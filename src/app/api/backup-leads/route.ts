import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Handle preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// POST /api/backup-leads - store lead as backup
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, phone, inquiryType, message, source } = body;

    if (!firstName || !email || !inquiryType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const backupLead = {
      id: Date.now().toString(),
      firstName,
      lastName: lastName || '',
      email,
      phone: phone || '',
      inquiryType,
      message: message || '',
      source: source || 'backup',
      timestamp: new Date().toISOString(),
      status: 'new'
    };

    // Log to console
    console.log('💾 BACKUP LEAD RECEIVED:', backupLead);

    // Store in a simple JSON file (in production, you might want to use a database)
    try {
      const backupDir = path.join(process.cwd(), 'backup-leads');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }

      const backupFile = path.join(backupDir, 'leads.json');
      let leads = [];
      
      if (fs.existsSync(backupFile)) {
        const fileContent = fs.readFileSync(backupFile, 'utf8');
        leads = JSON.parse(fileContent);
      }

      leads.push(backupLead);
      fs.writeFileSync(backupFile, JSON.stringify(leads, null, 2));
      
      console.log('✅ Backup lead stored successfully');
    } catch (fileError) {
      console.error('❌ File storage failed:', fileError);
      // Don't fail the request if file storage fails
    }

    return NextResponse.json({ 
      message: 'Backup lead stored successfully', 
      lead: backupLead 
    }, { status: 201 });

  } catch (error) {
    console.error('Backup leads POST error:', error);
    // Always return success to prevent form failures
    return NextResponse.json({ 
      message: 'Backup lead received (with errors)', 
      error: 'Internal processing error'
    }, { status: 200 });
  }
}
