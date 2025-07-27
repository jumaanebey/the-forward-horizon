import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_CALENDAR_CREDENTIALS = {
  type: "service_account",
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
};

async function getCalendarService() {
  const auth = new google.auth.GoogleAuth({
    credentials: GOOGLE_CALENDAR_CREDENTIALS,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  const calendar = google.calendar({ version: 'v3', auth });
  return calendar;
}

export async function GET(request: NextRequest) {
  try {
    const calendar = await getCalendarService();
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 50,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items?.map(event => ({
      id: event.id,
      title: event.summary,
      description: event.description,
      startTime: event.start?.dateTime || event.start?.date,
      endTime: event.end?.dateTime || event.end?.date,
      location: event.location,
      attendees: event.attendees?.map(attendee => attendee.email) || [],
      status: 'scheduled'
    })) || [];

    return NextResponse.json({ events });
  } catch (error) {
    console.error('Calendar API error:', error);
    
    // Return mock data if Calendar API is not configured
    const mockEvents = [
      {
        id: '1',
        title: 'Setup Google Calendar Integration',
        description: 'Configure Google Calendar API credentials',
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        location: 'Admin Office',
        attendees: ['admin@theforwardhorizon.com'],
        status: 'scheduled'
      }
    ];

    return NextResponse.json({ 
      events: mockEvents,
      message: 'Google Calendar not configured - showing sample data'
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const calendar = await getCalendarService();
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    const body = await request.json();

    const event = {
      summary: body.title,
      description: body.description,
      start: {
        dateTime: body.startTime,
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: body.endTime,
        timeZone: 'America/Los_Angeles',
      },
      location: body.location,
      attendees: body.attendees?.map((email: string) => ({ email })),
    };

    const response = await calendar.events.insert({
      calendarId: calendarId,
      requestBody: event,
    });

    return NextResponse.json({ 
      success: true, 
      eventId: response.data.id,
      event: response.data
    });
  } catch (error) {
    console.error('Error creating calendar event:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create calendar event' },
      { status: 500 }
    );
  }
}