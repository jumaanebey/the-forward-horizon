// Role-Based Dashboard Router
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  LogIn, 
  Eye, 
  EyeOff, 
  User, 
  Shield, 
  Settings,
  LogOut
} from 'lucide-react';
import UserDashboard from './UserDashboard';
import ManagementDashboard from './ManagementDashboard';
import { SimpleAuth, User as UserType } from '@/lib/simple-auth';

interface RoleBasedDashboardProps {
  onNavigate?: (tab: string) => void;
}

type ViewMode = 'login' | 'user' | 'management';

export default function RoleBasedDashboard({ onNavigate }: RoleBasedDashboardProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('user'); // Default to user view
  const [currentUser, setCurrentUser] = useState<UserType | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for existing session
    checkExistingSession();
  }, []);

  const checkExistingSession = async () => {
    const token = localStorage.getItem('fh_session_token');
    if (token) {
      const user = await SimpleAuth.validateSession(token);
      if (user) {
        setCurrentUser(user);
        setViewMode(user.role === 'user' ? 'user' : 'management');
      } else {
        localStorage.removeItem('fh_session_token');
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setLoginError('');

    try {
      console.log('Login form data:', loginForm);
      const auth = await SimpleAuth.authenticate(loginForm.email, loginForm.password);
      console.log('Authentication result:', auth);
      
      if (auth) {
        console.log('Login successful, setting user and redirecting');
        setCurrentUser(auth.user);
        localStorage.setItem('fh_session_token', auth.token);
        setViewMode(auth.user.role === 'user' ? 'user' : 'management');
        setShowLogin(false);
        setLoginForm({ email: '', password: '' });
      } else {
        console.log('Authentication failed');
        setLoginError('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem('fh_session_token');
    if (token) {
      await SimpleAuth.logout(token);
      localStorage.removeItem('fh_session_token');
    }
    setCurrentUser(null);
    setViewMode('user');
    setShowLogin(false);
  };

  const switchToUserView = () => {
    setViewMode('user');
    setShowLogin(false);
  };

  const switchToManagementView = () => {
    if (currentUser && currentUser.role !== 'user') {
      setViewMode('management');
    } else {
      setShowLogin(true);
    }
  };

  const canToggleViews = () => {
    return currentUser && ['admin', 'manager'].includes(currentUser.role);
  };

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <span>Staff Login</span>
            </CardTitle>
            <p className="text-gray-600">Access management dashboard</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  required
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                  {loginError}
                </div>
              )}

              <div className="space-y-2">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={switchToUserView}
                  disabled={loading}
                >
                  Back to Public View
                </Button>
              </div>
            </form>

            {/* Demo Credentials (Remove in production) */}
            <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded text-sm">
              <p className="font-medium text-yellow-800 mb-1">Demo Access:</p>
              <p className="text-yellow-700">Email: admin@theforwardhorizon.com</p>
              <p className="text-yellow-700">Password: admin123</p>
              <p className="text-xs text-yellow-600 mt-1">*Demo credentials for development</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* View Mode Toggle Bar */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900">Forward Horizon</h1>
            
            {/* View Toggle - Only show for logged-in admins/managers OR always show basic toggle */}
            <div className="flex items-center space-x-2">
              {canToggleViews() ? (
                <>
                  <Button
                    variant={viewMode === 'user' ? 'default' : 'outline'}
                    size="sm"
                    onClick={switchToUserView}
                    className="flex items-center space-x-1"
                  >
                    <User className="w-4 h-4" />
                    <span>Public View</span>
                  </Button>
                  
                  <Button
                    variant={viewMode === 'management' ? 'default' : 'outline'}
                    size="sm"
                    onClick={switchToManagementView}
                    className="flex items-center space-x-1"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Management</span>
                  </Button>
                  
                  {/* Admin indicator */}
                  <div className="flex items-center space-x-1 px-2 py-1 bg-blue-50 rounded text-xs text-blue-700">
                    <Settings className="w-3 h-3" />
                    <span>Admin Controls</span>
                  </div>
                </>
              ) : (
                /* Non-admin view - show basic toggle */
                <>
                  <Button
                    variant={viewMode === 'user' ? 'default' : 'outline'}
                    size="sm"
                    onClick={switchToUserView}
                    className="flex items-center space-x-1"
                  >
                    <User className="w-4 h-4" />
                    <span>Public View</span>
                  </Button>
                  
                  <Button
                    variant={viewMode === 'management' ? 'default' : 'outline'}
                    size="sm"
                    onClick={switchToManagementView}
                    className="flex items-center space-x-1"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Management</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Current View Indicator */}
            <div className="flex items-center space-x-2">
              {viewMode === 'user' ? (
                <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                  <User className="w-3 h-3 mr-1" />
                  Public View
                </Badge>
              ) : (
                <Badge variant="outline" className="text-blue-700 border-blue-300 bg-blue-50">
                  <Shield className="w-3 h-3 mr-1" />
                  Management View
                </Badge>
              )}
            </div>

            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <p className="text-sm font-medium">{currentUser.firstName} {currentUser.lastName}</p>
                  <div className="flex items-center space-x-1">
                    <Badge variant="secondary" className="text-xs">
                      {currentUser.role.charAt(0).toUpperCase() + currentUser.role.slice(1)}
                    </Badge>
                    {canToggleViews() && (
                      <Badge variant="default" className="text-xs bg-blue-600">
                        Admin
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Badge variant="outline">Public Access</Badge>
                {viewMode === 'user' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowLogin(true)}
                    className="flex items-center space-x-1"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Staff Login</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="relative">
        {/* Admin Notice when viewing public interface */}
        {viewMode === 'user' && canToggleViews() && (
          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mx-4 mt-4 rounded-r">
            <div className="flex items-center">
              <Settings className="w-5 h-5 text-blue-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Admin Preview: Public Interface
                </p>
                <p className="text-xs text-blue-600">
                  This is what visitors see. Switch to "Management" to access operational controls.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Admin Notice when viewing management interface */}
        {viewMode === 'management' && canToggleViews() && (
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 mx-4 mt-4 rounded-r">
            <div className="flex items-center">
              <Shield className="w-5 h-5 text-orange-600 mr-2" />
              <div>
                <p className="text-sm font-medium text-orange-800">
                  Admin Access: Management Dashboard
                </p>
                <p className="text-xs text-orange-600">
                  Full operational access with sensitive data. Switch to "Public View" to see visitor interface.
                </p>
              </div>
            </div>
          </div>
        )}

        {viewMode === 'user' ? (
          <UserDashboard userRole="user" />
        ) : viewMode === 'management' && currentUser ? (
          <ManagementDashboard user={currentUser} />
        ) : (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <Card className="text-center p-8">
              <Shield className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">Access Required</h2>
              <p className="text-gray-600 mb-4">Please log in to access the management dashboard</p>
              <Button onClick={() => setShowLogin(true)}>
                <LogIn className="w-4 h-4 mr-2" />
                Staff Login
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}