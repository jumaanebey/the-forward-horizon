import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { emailSequences, sendSequenceEmail, getLeadsForSequenceStep } from '@/lib/email-sequences';
import nodemailer from 'nodemailer';
import { performanceOptimizer } from '@/utils/performanceOptimizer';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// GET /api/email-sequences - Get leads ready for email sequences
export async function GET(request: NextRequest) {
  const timer = performanceOptimizer.startTimer('api-email-sequences-get');
  
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    if (action === 'process') {
      // Process email sequences
      const { data: leads, error } = await supabase
        .from('leads')
        .select('*')
        .eq('status', 'active');

      if (error) {
        console.error('Database error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch leads' },
          { status: 500 }
        );
      }

      const leadsToEmail = getLeadsForSequenceStep(leads);
      const results = [];

      for (const lead of leadsToEmail) {
        try {
          const sequence = emailSequences[lead.inquiry_type as keyof typeof emailSequences];
          if (!sequence) continue;

          const nextStep = sequence[lead.sequence_step];
          if (!nextStep) continue;

          // Send email
          await sendEmail(lead, nextStep);

          // Update lead progress
          await supabase
            .from('leads')
            .update({
              sequence_step: lead.sequence_step + 1,
              last_email_sent: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', lead.id);

          results.push({
            leadId: lead.id,
            email: lead.email,
            sequenceStep: lead.sequence_step,
            status: 'sent'
          });

        } catch (error) {
          console.error(`Failed to send email to ${lead.email}:`, error);
          results.push({
            leadId: lead.id,
            email: lead.email,
            sequenceStep: lead.sequence_step,
            status: 'failed',
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      timer();

      return NextResponse.json({
        message: 'Email sequences processed',
        processed: results.length,
        results
      });

    } else {
      // Get email sequence statistics
      const { data: leads, error } = await supabase
        .from('leads')
        .select('inquiry_type, sequence_step, status, last_email_sent')
        .eq('status', 'active');

      if (error) {
        console.error('Database error:', error);
        return NextResponse.json(
          { error: 'Failed to fetch leads' },
          { status: 500 }
        );
      }

      // Calculate statistics
      const stats = {
        totalLeads: leads.length,
        byInquiryType: {} as Record<string, number>,
        bySequenceStep: {} as Record<number, number>,
        readyForNextStep: 0
      };

      leads.forEach(lead => {
        // Count by inquiry type
        stats.byInquiryType[lead.inquiry_type] = (stats.byInquiryType[lead.inquiry_type] || 0) + 1;
        
        // Count by sequence step
        stats.bySequenceStep[lead.sequence_step] = (stats.bySequenceStep[lead.sequence_step] || 0) + 1;
        
        // Count ready for next step
        const sequence = emailSequences[lead.inquiry_type as keyof typeof emailSequences];
        if (sequence && sequence[lead.sequence_step]) {
          const daysSinceLastEmail = lead.last_email_sent 
            ? Math.floor((new Date().getTime() - new Date(lead.last_email_sent).getTime()) / (1000 * 60 * 60 * 24))
            : 999;
          
          const nextStep = sequence[lead.sequence_step];
          if (daysSinceLastEmail >= nextStep.day) {
            stats.readyForNextStep++;
          }
        }
      });

      timer();

      return NextResponse.json({
        statistics: stats,
        sequences: Object.keys(emailSequences)
      });

    }

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/email-sequences - Send manual email
export async function POST(request: NextRequest) {
  const timer = performanceOptimizer.startTimer('api-email-sequences-post');
  
  try {
    const body = await request.json();
    const { leadId, customMessage, subject } = body;

    if (!leadId) {
      return NextResponse.json(
        { error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    // Get lead details
    const { data: lead, error } = await supabase
      .from('leads')
      .select('*')
      .eq('id', leadId)
      .single();

    if (error || !lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Send custom email
    const emailContent = customMessage || 'Thank you for your interest in Forward Horizon. We will contact you soon.';
    const emailSubject = subject || 'Forward Horizon - Thank You';

    await sendCustomEmail(lead, emailSubject, emailContent);

    // Update lead
    await supabase
      .from('leads')
      .update({
        last_email_sent: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', leadId);

    timer();

    return NextResponse.json({
      message: 'Email sent successfully',
      leadId,
      email: lead.email
    });

  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to send sequence emails
async function sendEmail(lead: any, sequenceStep: any) {
  const personalizedHTML = sequenceStep.htmlBody
    .replace(/\{firstName\}/g, lead.first_name)
    .replace(/\{lastName\}/g, lead.last_name);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: lead.email,
    subject: sequenceStep.subject,
    html: personalizedHTML
  };

  await transporter.sendMail(mailOptions);
}

// Helper function to send custom emails
async function sendCustomEmail(lead: any, subject: string, content: string) {
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${subject}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <h1 style="color: white; font-size: 24px; margin: 0;">Forward Horizon</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="font-size: 18px; color: #374151; margin: 0 0 24px 0;">Hi ${lead.first_name},</p>
                            
                            <div style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
                                ${content}
                            </div>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 16px;">
                                Best regards,<br>
                                <strong>Forward Horizon Team</strong>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
                            <p style="color: #6b7280; margin: 0; font-size: 14px;">Forward Horizon - Transitional Housing Support</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: lead.email,
    subject,
    html: htmlContent
  };

  await transporter.sendMail(mailOptions);
}