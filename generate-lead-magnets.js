const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const puppeteer = require('puppeteer');

async function generateLeadMagnetPDFs() {
  try {
    // Define the three guides to generate
    const guides = [
      {
        filename: 'Veterans_Benefits_Guide.md',
        output: 'Veterans_Benefits_Guide.pdf',
        title: 'Veterans Benefits Guide + Housing Checklist',
        color: '#2563eb' // Blue theme
      },
      {
        filename: 'Recovery_Housing_Guide.md',
        output: 'Recovery_Housing_Preparation_Guide.pdf',
        title: 'Recovery Housing Preparation Guide',
        color: '#059669' // Green theme
      },
      {
        filename: 'Life_After_Release_Planning_Kit.md',
        output: 'Life_After_Release_Planning_Kit.pdf',
        title: 'Life After Release Planning Kit',
        color: '#7c3aed' // Purple theme
      }
    ];

    // Launch Puppeteer once for all PDFs
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    for (const guide of guides) {
      console.log(`\n📄 Generating ${guide.title}...`);
      
      // Read the markdown file
      const markdownPath = path.join(__dirname, guide.filename);
      if (!fs.existsSync(markdownPath)) {
        console.log(`❌ File not found: ${guide.filename}`);
        continue;
      }
      
      const markdownContent = fs.readFileSync(markdownPath, 'utf8');
      
      // Convert markdown to HTML
      const htmlContent = marked(markdownContent);
      
      // Create complete HTML document with theme-specific styling
      const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>${guide.title}</title>
          <style>
              body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  line-height: 1.6;
                  margin: 0;
                  padding: 30px;
                  color: #333;
                  max-width: 800px;
                  margin: 0 auto;
                  font-size: 14px;
              }
              
              /* Cover Page Styling */
              .cover-page {
                  page-break-after: always;
                  text-align: center;
                  padding: 100px 40px;
                  background: linear-gradient(135deg, ${guide.color}10, ${guide.color}20);
                  border: 3px solid ${guide.color};
                  margin: -30px -30px 50px -30px;
              }
              
              .cover-title {
                  font-size: 36px;
                  font-weight: bold;
                  color: ${guide.color};
                  margin-bottom: 30px;
                  line-height: 1.2;
              }
              
              .cover-subtitle {
                  font-size: 18px;
                  color: #666;
                  margin-bottom: 40px;
              }
              
              .cover-logo {
                  width: 80px;
                  height: 80px;
                  background: ${guide.color};
                  border-radius: 12px;
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  color: white;
                  font-size: 24px;
                  font-weight: bold;
                  margin-bottom: 20px;
              }
              
              h1 {
                  color: ${guide.color};
                  border-bottom: 3px solid ${guide.color};
                  padding-bottom: 8px;
                  font-size: 24px;
                  margin-top: 35px;
                  margin-bottom: 18px;
                  page-break-before: avoid;
              }
              
              h2 {
                  color: ${guide.color};
                  font-size: 20px;
                  margin-top: 28px;
                  margin-bottom: 14px;
                  border-left: 4px solid ${guide.color};
                  padding-left: 12px;
                  page-break-after: avoid;
              }
              
              h3 {
                  color: ${guide.color};
                  font-size: 16px;
                  margin-top: 22px;
                  margin-bottom: 10px;
                  page-break-after: avoid;
              }
              
              h4 {
                  color: ${guide.color};
                  font-size: 14px;
                  margin-top: 18px;
                  margin-bottom: 8px;
                  font-weight: 600;
                  page-break-after: avoid;
              }
              
              p {
                  margin-bottom: 10px;
                  text-align: justify;
                  orphans: 2;
                  widows: 2;
              }
              
              ul, ol {
                  margin-bottom: 12px;
                  padding-left: 20px;
              }
              
              li {
                  margin-bottom: 6px;
                  orphans: 2;
                  widows: 2;
              }
              
              strong {
                  color: ${guide.color};
                  font-weight: 600;
              }
              
              code {
                  background-color: #f3f4f6;
                  padding: 2px 4px;
                  border-radius: 3px;
                  font-family: 'Courier New', monospace;
                  font-size: 12px;
              }
              
              pre {
                  background-color: #f8fafc;
                  border: 1px solid #e5e7eb;
                  border-radius: 5px;
                  padding: 12px;
                  overflow-x: auto;
                  margin: 12px 0;
                  font-size: 12px;
              }
              
              blockquote {
                  border-left: 4px solid ${guide.color}80;
                  background-color: ${guide.color}10;
                  margin: 15px 0;
                  padding: 12px 15px;
                  font-style: italic;
              }
              
              table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 15px 0;
                  font-size: 13px;
              }
              
              th, td {
                  border: 1px solid #d1d5db;
                  padding: 8px 10px;
                  text-align: left;
              }
              
              th {
                  background-color: ${guide.color}20;
                  font-weight: 600;
                  color: ${guide.color};
              }
              
              hr {
                  border: none;
                  height: 2px;
                  background: linear-gradient(to right, ${guide.color}, ${guide.color}80, ${guide.color}60);
                  margin: 25px 0;
              }
              
              /* Checkbox styling */
              input[type="checkbox"] {
                  margin-right: 8px;
                  transform: scale(1.2);
              }
              
              /* Page breaks */
              .page-break {
                  page-break-before: always;
              }
              
              /* Print optimizations */
              @media print {
                  body {
                      padding: 15px;
                      font-size: 12px;
                  }
                  
                  h1 {
                      font-size: 20px;
                      margin-top: 25px;
                  }
                  
                  h2 {
                      font-size: 16px;
                      margin-top: 20px;
                  }
                  
                  h3 {
                      font-size: 14px;
                  }
                  
                  .cover-page {
                      margin: -15px -15px 30px -15px;
                      padding: 60px 30px;
                  }
                  
                  .cover-title {
                      font-size: 28px;
                  }
              }
              
              /* Footer for each page */
              @page {
                  margin: 20mm 15mm;
                  @bottom-center {
                      content: "Forward Horizon - " attr(title) " | Page " counter(page);
                      font-size: 10px;
                      color: #666;
                  }
              }
          </style>
      </head>
      <body>
          <div class="cover-page">
              <div class="cover-logo">FH</div>
              <h1 class="cover-title">${guide.title}</h1>
              <p class="cover-subtitle">Comprehensive Resource Guide from Forward Horizon</p>
              <p style="color: #666; font-size: 14px; margin-top: 60px;">
                  Supporting your journey to stability, independence, and success
              </p>
          </div>
          
          ${htmlContent}
          
          <div style="page-break-before: always; text-align: center; padding: 40px; color: #666;">
              <div style="border-top: 2px solid ${guide.color}; padding-top: 30px;">
                  <h2 style="color: ${guide.color}; border: none; margin-bottom: 20px;">Contact Forward Horizon</h2>
                  <p><strong>Phone:</strong> (555) 123-4567</p>
                  <p><strong>Website:</strong> theforwardhorizon.com</p>
                  <p><strong>Email:</strong> info@theforwardhorizon.com</p>
                  <br>
                  <p style="font-style: italic; font-size: 12px;">
                      This guide is provided as a resource to support your journey. For the most current information and personalized assistance, please contact Forward Horizon directly.
                  </p>
              </div>
          </div>
      </body>
      </html>
      `;
      
      // Create a new page for each PDF
      const page = await browser.newPage();
      
      // Set content and generate PDF
      await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
      
      const pdfPath = path.join(__dirname, guide.output);
      await page.pdf({
        path: pdfPath,
        format: 'A4',
        printBackground: true,
        margin: {
          top: '15mm',
          right: '12mm',
          bottom: '20mm',
          left: '12mm'
        },
        displayHeaderFooter: false
      });
      
      await page.close();
      
      const fileSize = Math.round(fs.statSync(pdfPath).size / 1024);
      console.log(`✅ Generated: ${guide.output} (${fileSize} KB)`);
    }
    
    await browser.close();
    
    console.log(`\n🎉 Successfully generated all lead magnet PDFs!`);
    console.log(`\nThese PDFs are now ready to be delivered to users who complete the forms on your landing pages:`);
    console.log(`- Veterans Benefits Guide + Housing Checklist`);
    console.log(`- Recovery Housing Preparation Guide`);
    console.log(`- Life After Release Planning Kit`);
    
  } catch (error) {
    console.error('❌ Error generating PDFs:', error);
  }
}

// Run the PDF generation
generateLeadMagnetPDFs();