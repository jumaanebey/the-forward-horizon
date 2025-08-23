import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const healthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        marketingWebsite: 'operational',
        formSubmission: 'operational',
        backupSystem: 'operational',
        managementPlatform: 'unknown'
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'development',
        hasManagementApiUrl: !!process.env.MANAGEMENT_API_URL,
        hasManagementApiKey: !!process.env.MANAGEMENT_API_KEY
      }
    };

    // Test management platform connectivity
    try {
      const managementApiUrl = process.env.MANAGEMENT_API_URL || 'https://forward-horizon-management-j0ekx2val-jumaane-beys-projects.vercel.app';
      const response = await fetch(`${managementApiUrl}/api/leads`, {
        method: 'OPTIONS',
        signal: AbortSignal.timeout(3000) // 3 second timeout
      });
      
      if (response.status === 200) {
        healthStatus.services.managementPlatform = 'operational';
      } else {
        healthStatus.services.managementPlatform = 'degraded';
      }
    } catch (error) {
      healthStatus.services.managementPlatform = 'down';
      healthStatus.status = 'degraded';
    }

    return NextResponse.json(healthStatus, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    }, { status: 500 });
  }
} 