import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Email templates for each audience
const emailTemplates = {
  general: {
    subject: "Thank you for contacting Forward Horizon",
    pdfFile: "Forward_Horizon_Marketing_Funnel_Strategy.pdf",
    body: `Thank you for contacting Forward Horizon!

We received your message and will respond within 24 hours during business days.

Forward Horizon provides transitional housing for veterans, individuals in recovery, and returning citizens. We're here to help you on your journey.

Visit our website: https://theforwardhorizon.com
Call us: (626) 603-0954

Best regards,
The Forward Horizon Team`
  },
  veterans: {
    subject: "Your Veterans Benefits Guide + Housing Checklist",
    pdfFile: "Veterans_Benefits_Guide.pdf",
    body: `Thank you for downloading your Veterans Benefits Guide!

Your service to our country deserves recognition, and your transition to civilian housing should be supported every step of the way.

This comprehensive guide includes:
• Complete VA benefits overview and eligibility
• Step-by-step housing application process
• Financial planning templates and budgeting guidance
• Essential documentation checklists
• Emergency contacts and resources

Ready to take the next step? Visit Forward Horizon to learn about our veterans housing program and submit your application: https://theforwardhorizon.com

Questions? Call us at (626) 603-0954 - we're here to help.

Semper Fi,
The Forward Horizon Team`
  },
  recovery: {
    subject: "Your Recovery Housing Preparation Guide",
    pdfFile: "Recovery_Housing_Preparation_Guide.pdf",
    body: `Welcome to your recovery journey!

Taking this step shows incredible strength and courage. Your Recovery Housing Preparation Guide is here to support you every step of the way.

Inside your guide you'll find:
• Complete preparation checklist for recovery housing
• What to expect in your first week and month
• Building support networks and relapse prevention strategies
• Financial planning for recovery
• Daily structure guidance and house rules

You're not alone in this journey. Visit Forward Horizon to learn about our recovery community and supportive housing program: https://theforwardhorizon.com

24/7 Support: (626) 603-0954

One day at a time,
The Forward Horizon Recovery Team`
  },
  reentry: {
    subject: "Your Life After Release Planning Kit",
    pdfFile: "Life_After_Release_Planning_Kit.pdf",
    body: `Your fresh start begins now!

Your past doesn't define your future, and this comprehensive planning kit will help you build the successful, independent life you deserve.

Your complete kit includes:
• 90-day step-by-step re-entry plan
• Essential documentation checklist and how to obtain them
• Employment strategies for second-chance hiring
• Housing options and application guidance
• Legal rights and benefit information

Forward Horizon believes in second chances. Visit us to learn about our re-entry support program and housing options: https://theforwardhorizon.com

Need immediate support? Call (626) 603-0954

Believing in your success,
The Forward Horizon Reentry Team`
  }
};

export async function POST(request: NextRequest) {
  try {
    console.log('API route called! - v2.0');
    
    // Handle both JSON and form data
    let firstName, email, formType;
    
    const contentType = request.headers.get('content-type');
    console.log('Content type:', contentType);
    
    if (contentType?.includes('application/json')) {
      const data = await request.json();
      firstName = data.firstName;
      email = data.email;
      formType = data.formType;
    } else {
      // Handle form data
      const formData = await request.formData();
      firstName = formData.get('firstName')?.toString();
      email = formData.get('email')?.toString();
      formType = formData.get('inquiry_type')?.toString(); // Fixed typo
    }
    
    console.log('Received data:', { firstName, email, formType });

    // Validate input
    if (!firstName || !email) {
      console.log('Missing required fields:', { firstName, email, formType });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Set default formType if missing
    if (!formType) {
      formType = 'general';
      console.log('No formType provided, using default:', formType);
    }

    // Map form values to template keys
    const formTypeMapping: { [key: string]: string } = {
      'veteran-housing': 'veterans',
      'sober-living': 'recovery', 
      'Re-entry-housing': 'reentry',
      'volunteer': 'general',
      'donate': 'general',
      'partner': 'general',
      'other': 'general'
    };

    let templateKey = formTypeMapping[formType] || formType;
    console.log('FormType mapping:', formType, '->', templateKey);

    if (!emailTemplates[templateKey as keyof typeof emailTemplates]) {
      console.log('Template not found for key:', templateKey);
      console.log('Available templates:', Object.keys(emailTemplates));
      // Fallback to general template
      templateKey = 'general';
      console.log('Using fallback template:', templateKey);
    }

    // Get email template
    const template = emailTemplates[templateKey as keyof typeof emailTemplates];

    // Log the lead capture (for now, until email is configured)
    console.log(`Lead captured: ${firstName} (${email}) - ${formType}`);
    console.log('Email template would be:', template.subject);

    // Debug logging
    console.log('Form submission received:');
    console.log('firstName:', firstName);
    console.log('email:', email);
    console.log('formType:', formType);
    console.log('EMAIL_USER configured:', !!process.env.EMAIL_USER);
    console.log('EMAIL_PASS configured:', !!process.env.EMAIL_PASS);

    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email not configured - storing lead for manual follow-up');
      
      // Return success but explain email will be sent manually
      return NextResponse.json({
        success: true,
        message: 'Thank you! Your information has been received. We will send your guide and follow up within 24 hours.',
        leadCaptured: true,
        emailPending: true
      });
    }

    // Create transporter (using Gmail SMTP for demo - in production use service like SendGrid)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password, not regular password
      },
    });

    // Get PDF file path
    const pdfPath = path.join(process.cwd(), template.pdfFile);
    
    // Check if PDF exists
    if (!fs.existsSync(pdfPath)) {
      console.error(`PDF not found: ${pdfPath}`);
      return NextResponse.json(
        { error: 'Resource temporarily unavailable' },
        { status: 500 }
      );
    }

    // Personalize email body
    const personalizedBody = template.body.replace(/\{firstName\}/g, firstName);

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: template.subject,
      text: personalizedBody,
      attachments: [
        {
          filename: template.pdfFile,
          path: pdfPath,
          contentType: 'application/pdf'
        }
      ]
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Also send notification to Forward Horizon team
    const notificationOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.NOTIFICATION_EMAIL || process.env.EMAIL_USER,
      subject: `New Lead: ${formType} form submission`,
      text: `New lead captured:

Name: ${firstName}
Email: ${email}
Form Type: ${formType}
Date: ${new Date().toLocaleDateString()}
Time: ${new Date().toLocaleTimeString()}

Follow up with this lead within 24 hours for best conversion rates.

Forward Horizon Team`
    };

    await transporter.sendMail(notificationOptions);

    // Add lead to email sequence (in production, this would trigger a background job)
    console.log(`Lead added to email sequence: ${firstName} (${email}) - ${formType}`);

    return NextResponse.json({
      success: true,
      message: 'Guide sent successfully',
      emailSequenceStarted: true
    });

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send guide. Please try again.' },
      { status: 500 }
    );
  }
}