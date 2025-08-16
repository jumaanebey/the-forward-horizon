import { NextRequest, NextResponse } from 'next/server';
import { AuthManager } from '@/lib/auth';
import { performanceOptimizer } from '@/utils/performanceOptimizer';

export async function POST(request: NextRequest) {
  const timer = performanceOptimizer.startTimer('api-auth-login');
  
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate user
    const result = await AuthManager.authenticate(email, password);
    
    if (!result) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Set session cookie
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: result.user.id,
        email: result.user.email,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        role: result.user.role,
        department: result.user.department,
        phone: result.user.phone,
        status: result.user.status
      }
    });

    // Set secure HTTP-only cookie
    response.cookies.set('session_token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/'
    });

    timer();
    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
