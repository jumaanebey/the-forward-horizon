// Simple form submission handler for Vercel
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    
    // Log form submission (in production, you'd send this to email/database)
    console.log('Form submission received:', formData);
    
    // Here you would typically:
    // 1. Send email notification
    // 2. Save to database
    // 3. Trigger automation
    
    // For now, we'll just return success
    res.status(200).json({ 
      success: true, 
      message: 'Thank you for your submission! We will contact you within 24 hours.',
      data: formData 
    });
  } catch (error) {
    console.error('Form submission error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'There was an error processing your submission. Please try again.' 
    });
  }
}