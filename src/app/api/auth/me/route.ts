import { NextRequest, NextResponse } from 'next/server';
import { AuthManager } from '@/lib/auth';
import { performanceOptimizer } from '@/utils/performanceOptimizer';

export async function GET(request: NextRequest) {
  const timer = performanceOptimizer.startTimer('api-auth-me');
  
  try {
    const sessionToken = request.cookies.get('session_token')?.value;

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Validate session and get user
    const user = await AuthManager.validateSession(sessionToken);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired session' },
        { status: 401 }
      );
    }

    timer();

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        department: user.department,
        phone: user.phone,
        status: user.status
      }
    });

  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
