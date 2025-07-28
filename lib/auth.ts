// Authentication and Role-Based Access Control System
import { supabase } from './supabase';
import bcrypt from 'bcryptjs';

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

export interface Permission {
  resource: string;
  action: string;
  granted: boolean;
}

export class AuthManager {
  
  // Check if user has permission for a specific action
  static async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
    if (!supabase) return false;

    try {
      const { data: user } = await supabase
        .from('user_accounts')
        .select('role')
        .eq('id', userId)
        .single();

      if (!user) return false;

      const { data: permission } = await supabase
        .from('role_permissions')
        .select('granted')
        .eq('role', user.role)
        .eq('resource', resource)
        .eq('action', action)
        .single();

      return permission?.granted || false;
    } catch (error) {
      console.error('Permission check error:', error);
      return false;
    }
  }

  // Get all permissions for a user role
  static async getUserPermissions(userId: string): Promise<Permission[]> {
    if (!supabase) return [];

    try {
      const { data: user } = await supabase
        .from('user_accounts')
        .select('role')
        .eq('id', userId)
        .single();

      if (!user) return [];

      const { data: permissions } = await supabase
        .from('role_permissions')
        .select('resource, action, granted')
        .eq('role', user.role);

      return permissions || [];
    } catch (error) {
      console.error('Get permissions error:', error);
      return [];
    }
  }

  // Create a new user account
  static async createUser(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: 'user' | 'staff' | 'manager' | 'admin';
    department?: string;
    phone?: string;
  }): Promise<User | null> {
    if (!supabase) return null;

    try {
      const passwordHash = await bcrypt.hash(userData.password, 12);

      const { data: user, error } = await supabase
        .from('user_accounts')
        .insert({
          email: userData.email,
          password_hash: passwordHash,
          first_name: userData.firstName,
          last_name: userData.lastName,
          role: userData.role || 'user',
          department: userData.department,
          phone: userData.phone,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

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
      console.error('Create user error:', error);
      return null;
    }
  }

  // Authenticate user login
  static async authenticate(email: string, password: string): Promise<{ user: User; token: string } | null> {
    if (!supabase) return null;

    try {
      const { data: user } = await supabase
        .from('user_accounts')
        .select('*')
        .eq('email', email)
        .eq('status', 'active')
        .single();

      if (!user) return null;

      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      if (!isValidPassword) return null;

      // Create session token
      const sessionToken = await this.createSession(user.id);
      if (!sessionToken) return null;

      // Update last login
      await supabase
        .from('user_accounts')
        .update({ last_login: new Date().toISOString() })
        .eq('id', user.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
          role: user.role,
          department: user.department,
          phone: user.phone,
          status: user.status,
          lastLogin: new Date().toISOString()
        },
        token: sessionToken
      };
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  // Create user session
  private static async createSession(userId: string): Promise<string | null> {
    if (!supabase) return null;

    try {
      const sessionToken = this.generateToken();
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour session

      await supabase
        .from('user_sessions')
        .insert({
          user_id: userId,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString()
        });

      return sessionToken;
    } catch (error) {
      console.error('Create session error:', error);
      return null;
    }
  }

  // Validate session token
  static async validateSession(token: string): Promise<User | null> {
    if (!supabase) return null;

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
      console.error('Validate session error:', error);
      return null;
    }
  }

  // Generate secure token
  private static generateToken(): string {
    return Math.random().toString(36).substring(2) + 
           Math.random().toString(36).substring(2) + 
           Date.now().toString(36);
  }

  // Logout user
  static async logout(token: string): Promise<boolean> {
    if (!supabase) return false;

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

  // Get filtered dashboard data based on user role
  static getFilteredDashboardData(user: User, rawData: any) {
    const data = { ...rawData };

    switch (user.role) {
      case 'user':
        // Users see only basic, non-sensitive information
        return {
          totalBeds: data.totalBeds,
          availableBeds: data.availableBeds,
          occupancyRate: data.occupancyRate > 0 ? 'Active' : 'Preparing',
          programs: data.programs?.map((p: any) => ({
            name: p.name,
            description: p.description,
            status: p.status
          })),
          recentActivity: data.recentActivity?.filter((a: any) => 
            !a.type.includes('financial') && !a.type.includes('incident')
          )
        };

      case 'staff':
        // Staff see operational data but not financial details
        return {
          ...data,
          totalRevenue: undefined,
          monthlyRevenue: undefined,
          paymentStatus: undefined,
          financialReports: undefined
        };

      case 'manager':
      case 'admin':
        // Managers and admins see everything
        return data;

      default:
        return {};
    }
  }
}

// Hook for checking permissions in components
export function usePermissions(userId: string | null) {
  const checkPermission = async (resource: string, action: string): Promise<boolean> => {
    if (!userId) return false;
    return AuthManager.hasPermission(userId, resource, action);
  };

  return { checkPermission };
}