// Simplified Authentication System for immediate testing
import { supabase } from './supabase';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'staff' | 'manager' | 'admin';
  department?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
  lastLogin?: string;
}

export class SimpleAuth {
  
  // Simple authentication for demo purposes
  static async authenticate(email: string, password: string): Promise<{ user: User; token: string } | null> {
    // Always use demo authentication for now
    const demoUsers = [
      {
        email: 'admin@theforwardhorizon.com',
        password: 'admin123',
        user: {
          id: 'demo-admin',
          email: 'admin@theforwardhorizon.com',
          firstName: 'System',
          lastName: 'Administrator',
          role: 'admin' as const,
          department: 'Management',
          status: 'active' as const
        },
        token: 'demo-token-admin'
      },
      {
        email: 'staff@theforwardhorizon.com',
        password: 'staff123',
        user: {
          id: 'demo-staff',
          email: 'staff@theforwardhorizon.com',
          firstName: 'Sarah',
          lastName: 'Johnson',
          role: 'staff' as const,
          department: 'Counseling',
          status: 'active' as const
        },
        token: 'demo-token-staff'
      }
    ];

    const matchedUser = demoUsers.find(u => u.email === email && u.password === password);
    if (matchedUser) {
      return {
        user: matchedUser.user,
        token: matchedUser.token
      };
    }

    // Fallback to database if supabase is available
    if (!supabase) {
      return null;
    }

    try {
      const { data: user } = await supabase
        .from('user_accounts')
        .select('*')
        .eq('email', email)
        .eq('status', 'active')
        .single();

      if (!user || user.password_hash !== password) {
        return null;
      }

      // Create simple session token
      const sessionToken = 'session_' + Date.now() + '_' + Math.random().toString(36);
      
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24);

      await supabase
        .from('user_sessions')
        .insert({
          user_id: user.id,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString()
        });

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          department: user.department,
          phone: user.phone,
          status: user.status
        },
        token: sessionToken
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  // Validate session token  
  static async validateSession(token: string): Promise<User | null> {
    // Always use demo validation for now
    const demoSessions = {
      'demo-token-admin': {
        id: 'demo-admin',
        email: 'admin@theforwardhorizon.com',
        firstName: 'System',
        lastName: 'Administrator', 
        role: 'admin' as const,
        department: 'Management',
        status: 'active' as const
      },
      'demo-token-staff': {
        id: 'demo-staff',
        email: 'staff@theforwardhorizon.com',
        firstName: 'Sarah',
        lastName: 'Johnson',
        role: 'staff' as const,
        department: 'Counseling',
        status: 'active' as const
      }
    };

    if (demoSessions[token as keyof typeof demoSessions]) {
      return demoSessions[token as keyof typeof demoSessions];
    }

    // Fallback to database if supabase is available
    if (!supabase) {
      return null;
    }

    try {
      const { data: session } = await supabase
        .from('user_sessions')
        .select(`
          user_id,
          expires_at,
          user_accounts (
            id,
            email,
            first_name,
            last_name,
            role,
            department,
            phone,
            status
          )
        `)
        .eq('session_token', token)
        .single();

      if (!session || new Date(session.expires_at) < new Date()) {
        return null;
      }

      const user = session.user_accounts as any;
      return {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        department: user.department,
        phone: user.phone,
        status: user.status
      };
    } catch (error) {
      console.error('Session validation error:', error);
      return null;
    }
  }

  // Logout
  static async logout(token: string): Promise<boolean> {
    // Demo logout always succeeds
    return true;

    try {
      await supabase
        .from('user_sessions')
        .delete()
        .eq('session_token', token);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  }

  // Check permissions (simplified)
  static hasPermission(user: User, resource: string, action: string = 'view'): boolean {
    switch (user.role) {
      case 'admin':
        return true; // Admin can do everything
      case 'manager':
        return resource !== 'system'; // Manager can do almost everything
      case 'staff':
        return !['financial', 'staff', 'system'].includes(resource); // Staff has limited access
      case 'user':
        return ['dashboard', 'housing', 'calendar'].includes(resource) && action === 'view'; // Users can only view basic info
      default:
        return false;
    }
  }
}