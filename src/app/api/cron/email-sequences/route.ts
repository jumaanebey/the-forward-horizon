import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { emailSequences, getLeadsForSequenceStep, sendSequenceEmail, manualActions } from '@/lib/email-sequences';

// This API route would be called by a cron job (like Vercel Cron or external service)
// Example: Call every day at 9 AM to send sequence emails

interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
  createdAt: Date;
  lastEmailSent?: Date;
  sequenceStep: number;
  status: 'active' | 'converted' | 'inactive';
}

// In production, this would come from your database
// For now, we'll simulate with in-memory storage
let leadDatabase: Lead[] = [];

export async function POST(request: NextRequest) {
  try {
    console.log('Email sequence cron job started:', new Date().toISOString());
    
    // Verify cron authorization (in production, use a secret key)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get leads ready for their next sequence email
    const leadsToEmail = getLeadsForSequenceStep(leadDatabase);
    console.log(`Found ${leadsToEmail.length} leads ready for sequence emails`);
    
    if (leadsToEmail.length === 0) {
      return NextResponse.json({ 
        success: true, 
        message: 'No leads ready for sequence emails',
        processed: 0 
      });
    }
    
    // Create email transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    
    let emailsSent = 0;
    let actionItemsCreated = 0;
    
    // Process each lead
    for (const lead of leadsToEmail) {
      try {
        const sequence = emailSequences[lead.inquiryType as keyof typeof emailSequences];
        if (!sequence) continue;
        
        const nextStep = sequence[lead.sequenceStep];
        if (!nextStep) continue;
        
        // Skip day 0 emails (already sent during form submission)
        if (nextStep.day === 0) {
          lead.sequenceStep += 1;
          continue;
        }
        
        // Personalize email content
        const personalizedHTML = nextStep.htmlBody
          .replace(/\{firstName\}/g, lead.firstName)
          .replace(/\{lastName\}/g, lead.lastName);
        
        // Send sequence email
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: lead.email,
          subject: nextStep.subject,
          html: personalizedHTML
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`✅ Sequence email sent to ${lead.firstName} (${lead.email}): ${nextStep.subject}`);
        
        // Update lead progress
        lead.sequenceStep += 1;
        lead.lastEmailSent = new Date();
        emailsSent++;
        
        // Create manual action items
        if (nextStep.action && manualActions[nextStep.action]) {
          manualActions[nextStep.action](lead);
          actionItemsCreated++;
        }
        
      } catch (error) {
        console.error(`Error processing lead ${lead.id}:`, error);
      }
    }
    
    console.log(`✅ Email sequence job completed: ${emailsSent} emails sent, ${actionItemsCreated} action items created`);
    
    return NextResponse.json({
      success: true,
      emailsSent,
      actionItemsCreated,
      leadsProcessed: leadsToEmail.length
    });
    
  } catch (error) {
    console.error('Email sequence cron job error:', error);
    return NextResponse.json(
      { error: 'Failed to process email sequences' },
      { status: 500 }
    );
  }
}

// Function to add a new lead to the sequence (called from form submission)
export async function addLeadToSequence(leadData: {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
}) {
  const newLead: Lead = {
    id: Date.now().toString(), // In production, use proper UUID
    firstName: leadData.firstName,
    lastName: leadData.lastName,
    email: leadData.email,
    phone: leadData.phone,
    inquiryType: leadData.inquiryType,
    message: leadData.message,
    createdAt: new Date(),
    sequenceStep: 0,
    status: 'active'
  };
  
  leadDatabase.push(newLead);
  console.log(`📧 Lead added to email sequence: ${newLead.firstName} (${newLead.inquiryType})`);
  
  return newLead;
}

// GET endpoint to view current leads (for debugging)
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  return NextResponse.json({
    totalLeads: leadDatabase.length,
    activeLeads: leadDatabase.filter(l => l.status === 'active').length,
    leads: leadDatabase.map(lead => ({
      id: lead.id,
      firstName: lead.firstName,
      email: lead.email,
      inquiryType: lead.inquiryType,
      sequenceStep: lead.sequenceStep,
      status: lead.status,
      createdAt: lead.createdAt,
      lastEmailSent: lead.lastEmailSent
    }))
  });
}