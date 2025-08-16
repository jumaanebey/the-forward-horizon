// Email sequence scheduling utilities
// In production, this would be handled by a background job service like Vercel Cron, AWS Lambda, or a dedicated queue system

interface Lead {
  email: string;
  firstName: string;
  formType: 'veterans' | 'recovery' | 'reentry';
  signupDate: Date;
}

interface SequenceConfig {
  delay: number; // hours
  subject: string;
}

const sequenceDelays = {
  veterans: [24, 72, 168], // 1 day, 3 days, 1 week
  recovery: [24, 72, 168],
  reentry: [24, 72, 168]
};

export class EmailSequenceScheduler {
  private leads: Map<string, Lead> = new Map();
  
  constructor() {
    // In production, this would load from a database
    this.loadLeadsFromStorage();
    
    // Check for scheduled emails every hour
    setInterval(() => {
      this.processPendingEmails();
    }, 60 * 60 * 1000); // 1 hour
  }

  addLead(email: string, firstName: string, formType: 'veterans' | 'recovery' | 'reentry') {
    const lead: Lead = {
      email,
      firstName,
      formType,
      signupDate: new Date()
    };
    
    this.leads.set(email, lead);
    this.saveLeadsToStorage();
    
    console.log(`Added lead to email sequence: ${email} (${formType})`);
  }

  private async processPendingEmails() {
    const now = new Date();
    
    for (const [email, lead] of this.leads) {
      const delays = sequenceDelays[lead.formType];
      
      for (let step = 0; step < delays.length; step++) {
        const delayHours = delays[step];
        const shouldSendAt = new Date(lead.signupDate.getTime() + (delayHours * 60 * 60 * 1000));
        
        if (now >= shouldSendAt && !this.hasEmailBeenSent(email, step)) {
          await this.sendSequenceEmail(lead, step);
          this.markEmailAsSent(email, step);
        }
      }
    }
  }

  private async sendSequenceEmail(lead: Lead, step: number) {
    try {
      const response = await fetch('/api/email-sequences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: lead.email,
          firstName: lead.firstName,
          formType: lead.formType,
          sequenceStep: step
        }),
      });

      if (response.ok) {
        console.log(`Sequence email sent: ${lead.email} - step ${step}`);
      } else {
        console.error(`Failed to send sequence email: ${lead.email} - step ${step}`);
      }
    } catch (error) {
      console.error('Error sending sequence email:', error);
    }
  }

  private hasEmailBeenSent(email: string, step: number): boolean {
    // In production, this would check a database
    const sentEmails = this.getSentEmailsFromStorage();
    return sentEmails.has(`${email}-${step}`);
  }

  private markEmailAsSent(email: string, step: number) {
    const sentEmails = this.getSentEmailsFromStorage();
    sentEmails.add(`${email}-${step}`);
    this.saveSentEmailsToStorage(sentEmails);
  }

  private loadLeadsFromStorage() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('email_sequence_leads');
        if (stored) {
          const leadsArray = JSON.parse(stored);
          leadsArray.forEach((lead: any) => {
            lead.signupDate = new Date(lead.signupDate);
            this.leads.set(lead.email, lead);
          });
        }
      } catch (error) {
        console.error('Error loading leads from storage:', error);
      }
    }
  }

  private saveLeadsToStorage() {
    if (typeof window !== 'undefined') {
      try {
        const leadsArray = Array.from(this.leads.values());
        localStorage.setItem('email_sequence_leads', JSON.stringify(leadsArray));
      } catch (error) {
        console.error('Error saving leads to storage:', error);
      }
    }
  }

  private getSentEmailsFromStorage(): Set<string> {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('sent_sequence_emails');
        if (stored) {
          return new Set(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading sent emails from storage:', error);
      }
    }
    return new Set();
  }

  private saveSentEmailsToStorage(sentEmails: Set<string>) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('sent_sequence_emails', JSON.stringify(Array.from(sentEmails)));
      } catch (error) {
        console.error('Error saving sent emails to storage:', error);
      }
    }
  }

  // Method to manually trigger next sequence email (for testing)
  async triggerNextEmail(email: string): Promise<boolean> {
    const lead = this.leads.get(email);
    if (!lead) {
      return false;
    }

    const delays = sequenceDelays[lead.formType];
    
    for (let step = 0; step < delays.length; step++) {
      if (!this.hasEmailBeenSent(email, step)) {
        await this.sendSequenceEmail(lead, step);
        this.markEmailAsSent(email, step);
        return true;
      }
    }
    
    return false; // All emails already sent
  }

  // Get sequence status for a lead
  getSequenceStatus(email: string): { step: number; total: number; nextEmailAt?: Date } | null {
    const lead = this.leads.get(email);
    if (!lead) {
      return null;
    }

    const delays = sequenceDelays[lead.formType];
    let currentStep = 0;
    
    for (let step = 0; step < delays.length; step++) {
      if (this.hasEmailBeenSent(email, step)) {
        currentStep = step + 1;
      } else {
        break;
      }
    }

    let nextEmailAt: Date | undefined;
    if (currentStep < delays.length) {
      const nextDelayHours = delays[currentStep];
      nextEmailAt = new Date(lead.signupDate.getTime() + (nextDelayHours * 60 * 60 * 1000));
    }

    return {
      step: currentStep,
      total: delays.length,
      nextEmailAt
    };
  }
}

// Global instance (in production, this would be managed differently)
export const emailScheduler = new EmailSequenceScheduler();