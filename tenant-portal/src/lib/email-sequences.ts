// Email workflow sequences for different user types
// This handles automated follow-up emails based on inquiry type

interface EmailSequenceStep {
  day: number;
  subject: string;
  htmlBody: string;
  action?: 'call_reminder' | 'document_request' | 'appointment_booking';
}

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

// Email sequences for each program type
export const emailSequences = {
  'veteran-housing': [
    {
      day: 0, // Immediate welcome (already sent in form submission)
      subject: "🇺🇸 Your Veterans Benefits Guide + Housing Checklist",
      htmlBody: `<!-- Initial email already handled in form submission -->`
    },
    {
      day: 1,
      subject: "Your Next Steps: Veterans Housing Application Process",
      htmlBody: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Veterans Housing Next Steps</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <div style="font-size: 48px; margin-bottom: 16px;">📋</div>
                            <h1 style="color: white; font-size: 24px; margin: 0;">Ready for Your Next Step?</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="font-size: 18px; color: #374151; margin: 0 0 24px 0;">Hi {firstName},</p>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
                                Yesterday you downloaded our Veterans Benefits Guide. Today, let's take the next concrete step toward securing your transitional housing.
                            </p>
                            
                            <div style="background-color: #dbeafe; padding: 24px; border-radius: 8px; margin: 24px 0;">
                                <h3 style="color: #1e40af; margin: 0 0 16px 0;">Your Action Items for Today:</h3>
                                <ul style="color: #1e40af; margin: 0; padding-left: 20px; line-height: 1.8;">
                                    <li>Gather your DD214 and service records</li>
                                    <li>Complete our pre-screening questionnaire (2 minutes)</li>
                                    <li>Schedule your housing consultation call</li>
                                </ul>
                            </div>
                            
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="https://app.theforwardhorizon.com/veteran-prescreening" style="background-color: #1e40af; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Complete Pre-Screening (2 min)</a>
                            </div>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 16px;">
                                <strong>Need to speak with someone today?</strong><br>
                                Call our Veterans hotline: <a href="tel:+16266030954" style="color: #1e40af;">(626) 603-0954</a>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; text-align: center;">
                            <p style="color: #6b7280; margin: 0; font-size: 14px;">Forward Horizon Veterans Team</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
      action: 'document_request'
    },
    {
      day: 3,
      subject: "Haven't heard from you - Veterans housing still available",
      htmlBody: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Veterans Housing Follow-up</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="font-size: 18px; color: #374151; margin: 0 0 24px 0;">Hi {firstName},</p>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
                                I noticed you downloaded our Veterans Benefits Guide a few days ago, but haven't completed the pre-screening yet. 
                            </p>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
                                <strong>Good news:</strong> We still have housing units available specifically for veterans, and I want to make sure you don't miss out.
                            </p>
                            
                            <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 24px 0;">
                                <p style="color: #92400e; margin: 0; font-weight: bold;">⚡ Quick Question:</p>
                                <p style="color: #92400e; margin: 8px 0 0 0;">What's the biggest challenge preventing you from moving forward with housing right now?</p>
                            </div>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
                                Reply to this email or call me directly at <a href="tel:+16266030954" style="color: #1e40af;">(626) 603-0954</a>. I'm here to help remove any barriers.
                            </p>
                            
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="https://app.theforwardhorizon.com/veteran-prescreening" style="background-color: #dc2626; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Secure Your Housing Unit</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
      action: 'call_reminder'
    },
    {
      day: 7,
      subject: "Final notice: Your veterans housing reservation expires soon",
      htmlBody: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Veterans Housing Final Notice</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <div style="font-size: 48px; margin-bottom: 16px;">⏰</div>
                            <h1 style="color: white; font-size: 24px; margin: 0;">Final Notice - Action Required</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="font-size: 18px; color: #374151; margin: 0 0 24px 0;">Hi {firstName},</p>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
                                This is my final outreach regarding your veterans housing inquiry. Your informal reservation expires in 48 hours.
                            </p>
                            
                            <div style="background-color: #fee2e2; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626; margin: 24px 0;">
                                <p style="color: #dc2626; margin: 0; font-weight: bold;">❗ Important:</p>
                                <p style="color: #dc2626; margin: 8px 0 0 0;">If I don't hear from you by Friday, your housing unit will be offered to the next veteran on our waiting list.</p>
                            </div>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
                                <strong>To secure your unit:</strong> Call me at <a href="tel:+16266030954" style="color: #1e40af;">(626) 603-0954</a> or complete the 2-minute pre-screening below.
                            </p>
                            
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="https://app.theforwardhorizon.com/veteran-prescreening" style="background-color: #dc2626; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Complete Pre-Screening Now</a>
                            </div>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 16px;">
                                Thank you for your service,<br>
                                <strong>Forward Horizon Veterans Team</strong>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
    }
  ],
  
  'sober-living': [
    {
      day: 0,
      subject: "Your Recovery Housing Preparation Guide",
      htmlBody: `<!-- Initial email already handled in form submission -->`
    },
    {
      day: 1,
      subject: "Day 2 of Recovery: Your House Rules and What to Expect",
      htmlBody: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Day 2 Recovery Guide</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <div style="font-size: 48px; margin-bottom: 16px;">🌱</div>
                            <h1 style="color: white; font-size: 24px; margin: 0;">One Day at a Time</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="font-size: 18px; color: #374151; margin: 0 0 24px 0;">Hi {firstName},</p>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
                                Congratulations on taking the first step yesterday. Today, let's talk about what life looks like in our recovery house.
                            </p>
                            
                            <div style="background-color: #ecfdf5; padding: 24px; border-radius: 8px; margin: 24px 0;">
                                <h3 style="color: #059669; margin: 0 0 16px 0;">Your Daily Structure Will Include:</h3>
                                <ul style="color: #065f46; margin: 0; padding-left: 20px; line-height: 1.8;">
                                    <li>Morning check-ins with house manager</li>
                                    <li>Required AA/NA meetings (transportation provided)</li>
                                    <li>House chores and community responsibilities</li>
                                    <li>Employment search support (if ready)</li>
                                    <li>Evening reflection and planning</li>
                                </ul>
                            </div>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
                                <strong>Question for today:</strong> What's your biggest concern about living in a recovery house? Reply to this email - I want to address it personally.
                            </p>
                            
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="https://app.theforwardhorizon.com/recovery-intake" style="background-color: #059669; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Schedule Your Visit</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
      action: 'appointment_booking'
    },
    {
      day: 4,
      subject: "Your recovery support network is waiting",
      htmlBody: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Recovery Support Network</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="font-size: 18px; color: #374151; margin: 0 0 24px 0;">Hi {firstName},</p>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
                                Recovery is hard. It's even harder when you try to do it alone.
                            </p>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
                                Right now, there are 12 other people in our recovery house who understand exactly what you're going through. They're waiting to welcome you into a community that gets it.
                            </p>
                            
                            <div style="background-color: #fffbeb; padding: 20px; border-radius: 8px; border-left: 4px solid #f59e0b; margin: 24px 0;">
                                <p style="color: #92400e; margin: 0; font-weight: bold;">💪 Real Talk:</p>
                                <p style="color: #92400e; margin: 8px 0 0 0;">"I tried to get clean on my own 4 times. It wasn't until I moved into Forward Horizon that I finally had the support I needed." - Marcus, 8 months sober</p>
                            </div>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
                                What's holding you back from taking the next step? Call me: <a href="tel:+16266030954" style="color: #059669;">(626) 603-0954</a>
                            </p>
                            
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="https://app.theforwardhorizon.com/recovery-intake" style="background-color: #059669; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Join Our Recovery Community</a>
                            </div>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
      action: 'call_reminder'
    }
  ],
  
  'Re-entry-housing': [
    {
      day: 0,
      subject: "Your Life After Release Planning Kit",
      htmlBody: `<!-- Initial email already handled in form submission -->`
    },
    {
      day: 2,
      subject: "Week 1 Action Plan: Documents and Foundation Building",
      htmlBody: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Week 1 Re-entry Action Plan</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
                            <div style="font-size: 48px; margin-bottom: 16px;">📋</div>
                            <h1 style="color: white; font-size: 24px; margin: 0;">Week 1: Building Your Foundation</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="font-size: 18px; color: #374151; margin: 0 0 24px 0;">Hi {firstName},</p>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
                                Your first week out is crucial. Let's focus on getting your essential documents and building a solid foundation for success.
                            </p>
                            
                            <div style="background-color: #f3e8ff; padding: 24px; border-radius: 8px; margin: 24px 0;">
                                <h3 style="color: #7c3aed; margin: 0 0 16px 0;">This Week's Priority Tasks:</h3>
                                <ul style="color: #581c87; margin: 0; padding-left: 20px; line-height: 1.8;">
                                    <li>Get your state ID or driver's license</li>
                                    <li>Apply for Social Security card replacement</li>
                                    <li>Open a basic checking account</li>
                                    <li>Register with our employment services</li>
                                    <li>Complete housing application</li>
                                </ul>
                            </div>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
                                <strong>I'm here to help:</strong> I can walk you through each step and provide transportation to appointments if needed.
                            </p>
                            
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="https://app.theforwardhorizon.com/reentry-intake" style="background-color: #7c3aed; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Schedule Support Meeting</a>
                            </div>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 16px;">
                                Call me anytime: <a href="tel:+16266030954" style="color: #7c3aed;">(626) 603-0954</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`,
      action: 'appointment_booking'
    },
    {
      day: 5,
      subject: "Employment opportunities for second-chance hiring",
      htmlBody: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Second Chance Employment</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="font-size: 18px; color: #374151; margin: 0 0 24px 0;">Hi {firstName},</p>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
                                Good news! I have 3 employers who are actively hiring people with records right now:
                            </p>
                            
                            <div style="background-color: #f0fdf4; padding: 24px; border-radius: 8px; margin: 24px 0;">
                                <h3 style="color: #16a34a; margin: 0 0 16px 0;">🔥 Hot Job Opportunities:</h3>
                                <ul style="color: #15803d; margin: 0; padding-left: 20px; line-height: 1.8;">
                                    <li><strong>Warehouse Associate</strong> - $18/hr, immediate start</li>
                                    <li><strong>Construction Helper</strong> - $20/hr, training provided</li>
                                    <li><strong>Kitchen Prep</strong> - $16/hr, food service experience preferred</li>
                                </ul>
                            </div>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 24px;">
                                All these employers work with our re-entry program and understand your situation. No judgment, just opportunity.
                            </p>
                            
                            <div style="text-align: center; margin: 32px 0;">
                                <a href="https://app.theforwardhorizon.com/employment-services" style="background-color: #16a34a; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Apply for Jobs</a>
                            </div>
                            
                            <p style="color: #6b7280; line-height: 1.6; margin-bottom: 16px;">
                                Let's get you working: <a href="tel:+16266030954" style="color: #7c3aed;">(626) 603-0954</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`
    }
  ]
};

// Function to send sequence emails (would be called by a cron job or background worker)
export async function sendSequenceEmail(lead: Lead, sequenceStep: EmailSequenceStep) {
  // This would integrate with your email service (Gmail SMTP, SendGrid, etc.)
  console.log(`Sending sequence email to ${lead.email}: ${sequenceStep.subject}`);
  
  // Personalize the email content
  const personalizedHTML = sequenceStep.htmlBody
    .replace(/\{firstName\}/g, lead.firstName)
    .replace(/\{lastName\}/g, lead.lastName);
  
  // Email configuration would go here
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: lead.email,
    subject: sequenceStep.subject,
    html: personalizedHTML
  };
  
  // Send email logic here
  // await transporter.sendMail(mailOptions);
  
  // Update lead's sequence progress
  lead.sequenceStep += 1;
  lead.lastEmailSent = new Date();
  
  // Log action items for manual follow-up
  if (sequenceStep.action) {
    console.log(`Action required for ${lead.firstName}: ${sequenceStep.action}`);
  }
}

// Function to get leads ready for next sequence email
export function getLeadsForSequenceStep(allLeads: Lead[]): Lead[] {
  const now = new Date();
  const leadsToEmail: Lead[] = [];
  
  allLeads.forEach(lead => {
    if (lead.status !== 'active') return;
    
    const sequence = emailSequences[lead.inquiryType as keyof typeof emailSequences];
    if (!sequence) return;
    
    const nextStep = sequence[lead.sequenceStep];
    if (!nextStep) return;
    
    const daysSinceCreated = Math.floor((now.getTime() - lead.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceCreated >= nextStep.day) {
      leadsToEmail.push(lead);
    }
  });
  
  return leadsToEmail;
}

// Example manual action tracking
export const manualActions = {
  call_reminder: (lead: Lead) => {
    console.log(`📞 CALL REMINDER: ${lead.firstName} ${lead.lastName} - ${lead.phone || lead.email}`);
    console.log(`   Inquiry: ${lead.inquiryType}`);
    console.log(`   Message: ${lead.message}`);
  },
  
  document_request: (lead: Lead) => {
    console.log(`📋 DOCUMENT REQUEST: ${lead.firstName} ${lead.lastName}`);
    console.log(`   Need to follow up on required documents`);
  },
  
  appointment_booking: (lead: Lead) => {
    console.log(`📅 APPOINTMENT BOOKING: ${lead.firstName} ${lead.lastName}`);
    console.log(`   Schedule intake appointment or facility tour`);
  }
};