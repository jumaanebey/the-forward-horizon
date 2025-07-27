const fs = require('fs');
const path = require('path');
const { marked } = require('marked');
const puppeteer = require('puppeteer');

async function generatePDF() {
  try {
    // Read the markdown file
    const markdownPath = path.join(__dirname, 'Forward_Horizon_Marketing_Funnel_Strategy.md');
    const markdownContent = fs.readFileSync(markdownPath, 'utf8');
    
    // Convert markdown to HTML
    const htmlContent = marked(markdownContent);
    
    // Create complete HTML document with styling
    const fullHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Forward Horizon Marketing Funnel Strategy</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 40px;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
            }
            h1 {
                color: #2563eb;
                border-bottom: 3px solid #2563eb;
                padding-bottom: 10px;
                font-size: 28px;
                margin-top: 40px;
                margin-bottom: 20px;
            }
            h2 {
                color: #1e40af;
                font-size: 22px;
                margin-top: 30px;
                margin-bottom: 15px;
                border-left: 4px solid #3b82f6;
                padding-left: 15px;
            }
            h3 {
                color: #1e3a8a;
                font-size: 18px;
                margin-top: 25px;
                margin-bottom: 12px;
            }
            h4 {
                color: #1e40af;
                font-size: 16px;
                margin-top: 20px;
                margin-bottom: 10px;
                font-weight: 600;
            }
            p {
                margin-bottom: 12px;
                text-align: justify;
            }
            ul, ol {
                margin-bottom: 15px;
                padding-left: 25px;
            }
            li {
                margin-bottom: 8px;
            }
            strong {
                color: #1e40af;
                font-weight: 600;
            }
            code {
                background-color: #f3f4f6;
                padding: 2px 6px;
                border-radius: 3px;
                font-family: 'Courier New', monospace;
                font-size: 14px;
            }
            pre {
                background-color: #f8fafc;
                border: 1px solid #e5e7eb;
                border-radius: 5px;
                padding: 15px;
                overflow-x: auto;
                margin: 15px 0;
            }
            blockquote {
                border-left: 4px solid #60a5fa;
                background-color: #eff6ff;
                margin: 20px 0;
                padding: 15px 20px;
                font-style: italic;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 20px 0;
            }
            th, td {
                border: 1px solid #d1d5db;
                padding: 12px;
                text-align: left;
            }
            th {
                background-color: #f3f4f6;
                font-weight: 600;
                color: #1f2937;
            }
            hr {
                border: none;
                height: 2px;
                background: linear-gradient(to right, #3b82f6, #60a5fa, #93c5fd);
                margin: 30px 0;
            }
            .page-break {
                page-break-before: always;
            }
            @media print {
                body {
                    padding: 20px;
                }
                h1 {
                    page-break-before: avoid;
                }
                h2, h3 {
                    page-break-after: avoid;
                }
            }
        </style>
    </head>
    <body>
        ${htmlContent}
    </body>
    </html>
    `;
    
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    
    // Set content and generate PDF
    await page.setContent(fullHtml, { waitUntil: 'networkidle0' });
    
    const pdfPath = path.join(__dirname, 'Forward_Horizon_Marketing_Funnel_Strategy.pdf');
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });
    
    await browser.close();
    
    console.log(`✅ PDF generated successfully: ${pdfPath}`);
    console.log(`📄 File size: ${Math.round(fs.statSync(pdfPath).size / 1024)} KB`);
    
  } catch (error) {
    console.error('❌ Error generating PDF:', error);
  }
}

// Run the PDF generation
generatePDF();