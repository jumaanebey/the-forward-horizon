import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email sequence templates for each audience
const emailSequences = {
  veterans: [
    {
      delay: 24, // hours after initial signup
      subject: "Your Next Step: VA Benefits Optimization",
      body: `Hi {firstName},

I hope you've had a chance to review your Veterans Benefits Guide. Many veterans don't realize they're missing out on benefits they've earned.

Here are 3 quick actions you can take this week:

✅ Check your VA disability rating - you may be eligible for an increase
✅ Apply for your Certificate of Eligibility for VA home loans
✅ Look into VASH housing vouchers if you're currently struggling with housing

At Forward Horizon, we specialize in helping veterans navigate these systems. Our staff includes veterans who understand the process firsthand.

Ready to take the next step? 
Call us at (626) 603-0954 or visit theforwardhorizon.com

We're here to serve those who served.

The Forward Horizon Veterans Team`
    },
    {
      delay: 72, // 3 days
      subject: "Success Story: How James Found Stable Housing",
      body: `Hi {firstName},

I wanted to share James's story with you. James is an Army veteran who came to Forward Horizon after struggling with housing instability for months.

"I was living out of my car and felt like I'd hit rock bottom. Forward Horizon didn't just give me a place to stay - they helped me get my VA benefits sorted out, found me a job, and gave me back my dignity." - James S.

Today, James has his own apartment, a steady job, and is mentoring other veterans in our program.

Your situation might be different, but you deserve the same level of support and respect.

If you're ready to talk about your next steps, call us at (626) 603-0954. We have openings in our veterans program right now.

Semper Fi,
The Forward Horizon Team`
    },
    {
      delay: 168, // 1 week
      subject: "Last Call: Veterans Program Spots Available",
      body: `Hi {firstName},

I've been thinking about your housing situation and wanted to reach out one more time.

We currently have 3 spots available in our veterans-only program:
• Safe, stable housing starting at $450/month
• 24/7 support from staff who understand military culture
• Help maximizing your VA benefits
• Job placement assistance
• Community of fellow veterans

These spots typically fill up within a week, and our next openings won't be until next month.

If you're interested, please call (626) 603-0954 today to schedule a brief phone interview.

You've served our country - let us serve you.

Respectfully,
[Staff Name]
Forward Horizon Veterans Program`
    }
  ],
  recovery: [
    {
      delay: 24,
      subject: "Your Recovery Journey: Day-by-Day Success",
      body: `Hi {firstName},

Recovery is a daily choice, and I'm proud of you for taking this step.

Here's something important: the first 90 days are crucial. Having a structured, sober environment makes all the difference in building lasting sobriety.

Three things that successful residents tell us helped them most:

🌟 Living with others who understand the struggle
🌟 Having clear expectations and accountability
🌟 Access to support 24/7 when cravings hit

At Forward Horizon, we've helped over 250 people build successful, sober lives. Our residents have an 89% success rate because we understand that recovery is about more than just staying clean - it's about building a new life.

Ready to learn more about our program?
Call (626) 603-0954 or visit theforwardhorizon.com

One day at a time,
The Forward Horizon Recovery Team`
    },
    {
      delay: 72,
      subject: "Maria's Story: From Relapse to 2 Years Sober",
      body: `Hi {firstName},

I want to share Maria's story because it shows that recovery is possible, even after multiple attempts.

Maria came to us after her third relapse. She was scared, ashamed, and convinced she'd never get it right.

"Forward Horizon saved my life. The community here doesn't just help you stay sober—they help you rebuild everything. I have a job, an apartment, and most importantly, hope." - Maria R.

Today, Maria has 2 years of sobriety and works as a peer counselor helping others in early recovery.

What made the difference? She says it was having people who believed in her when she couldn't believe in herself.

We believe in you too, {firstName}.

Our next group intake is this week. Call (626) 603-0954 to learn more about joining our recovery community.

In solidarity,
The Forward Horizon Team`
    },
    {
      delay: 168,
      subject: "Your Bed is Waiting - Recovery Program",
      body: `Hi {firstName},

Recovery can't wait, and neither should you.

I wanted to let you know we have immediate availability in our recovery housing program:

✅ Substance-free environment with 24/7 support
✅ Peer community of people in recovery
✅ Case management and life skills training
✅ Job placement assistance
✅ $400/month all-inclusive

Most importantly: you'll be surrounded by people who understand your journey and want to see you succeed.

We're accepting new residents this week. Call (626) 603-0954 today to schedule your intake interview.

Don't let another day pass living in active addiction. You deserve recovery, and we're here to help you achieve it.

With hope,
[Staff Name]
Forward Horizon Recovery Program`
    }
  ],
  reentry: [
    {
      delay: 24,
      subject: "Your 72-Hour Reentry Action Plan",
      body: `Hi {firstName},

Your re-entry journey starts with the first 72 hours, and having a plan makes all the difference.

Based on helping 180+ returning citizens, here are the most critical first steps:

Day 1: Get your ID and Social Security card replacement started
Day 2: Apply for benefits (SNAP, Medicaid) 
Day 3: Connect with a re-entry program for ongoing support

The biggest mistake people make? Trying to do everything alone.

At Forward Horizon, we've seen what works. Our residents have a 5% recidivism rate (compared to 68% nationally) because we address housing, employment, and support together.

Want to talk about your re-entry plan?
Call (626) 603-0954 or visit theforwardhorizon.com

Your past doesn't define your future.

The Forward Horizon Reentry Team`
    },
    {
      delay: 72,
      subject: "Success Story: David's Path to Independence",
      body: `Hi {firstName},

I want to share David's story because it shows what's possible with the right support.

David came to Forward Horizon directly from prison with $50 and a bus ticket. Today, 18 months later, he has his own apartment, a steady job, and is rebuilding his relationship with his daughter.

"Forward Horizon didn't just give me a place to stay—they gave me a chance to prove to myself that I could change. The structure, the support, the belief that I could succeed - that made all the difference." - David M.

What made David successful:
• Safe, stable housing during his transition
• Help with documentation and benefits
• Job placement with a second-chance employer  
• Life skills training and financial literacy
• Peer support from other returning citizens

You have the same potential for success, {firstName}.

Call (626) 603-0954 to learn about our re-entry program.

Believing in your success,
The Forward Horizon Team`
    },
    {
      delay: 168,
      subject: "Don't Navigate Reentry Alone - Program Openings",
      body: `Hi {firstName},

Reentry is challenging enough without having to figure it out alone.

Right now, we have immediate openings in our re-entry support program:

🏠 Safe, affordable housing ($450/month)
💼 Employment assistance and job placement
📋 Help with documentation and benefits
🎯 Case management and support services
👥 Community of other returning citizens
📈 92% of our residents stay connected to support

Most importantly: you'll have people in your corner who believe in your ability to succeed.

These openings typically fill within days. Call (626) 603-0954 today to schedule your intake appointment.

Your fresh start is waiting.

With respect,
[Staff Name]
Forward Horizon Reentry Program

P.S. Remember: asking for help is a sign of strength, not weakness.`
    }
  ]
};

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, formType, sequenceStep } = await request.json();

    if (!email || !firstName || !formType || sequenceStep === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const sequences = emailSequences[formType as keyof typeof emailSequences];
    if (!sequences || !sequences[sequenceStep]) {
      return NextResponse.json(
        { error: 'Invalid sequence configuration' },
        { status: 400 }
      );
    }

    const emailTemplate = sequences[sequenceStep];

    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Personalize email body
    const personalizedBody = emailTemplate.body.replace(/\{firstName\}/g, firstName);

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: emailTemplate.subject,
      text: personalizedBody,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    console.log(`Sequence email sent: ${email} - ${formType} - step ${sequenceStep}`);

    return NextResponse.json({
      success: true,
      message: 'Sequence email sent successfully'
    });

  } catch (error) {
    console.error('Error sending sequence email:', error);
    return NextResponse.json(
      { error: 'Failed to send sequence email' },
      { status: 500 }
    );
  }
}