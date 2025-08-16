'use client';
import { useState } from 'react';

interface StaffMember {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  hireDate: string;
  status: 'active' | 'inactive' | 'on_leave';
  certifications: string[];
  permissions: Permission[];
  schedule: ShiftSchedule[];
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface Permission {
  module: string;
  actions: string[];
}

interface ShiftSchedule {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  type: 'regular' | 'overtime' | 'on_call';
}

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: Permission[];
  level: number;
}

export default function StaffContent() {
  const [activeTab, setActiveTab] = useState<'staff' | 'roles' | 'schedule'>('staff');
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddRole, setShowAddRole] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  // Mock staff data
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: 1,
      firstName: 'Dr. Sarah',
      lastName: 'Wilson',
      email: 'sarah.wilson@forwardhorizon.com',
      phone: '(555) 123-4567',
      role: 'Clinical Director',
      department: 'Medical',
      hireDate: '2022-01-15',
      status: 'active',
      certifications: ['Licensed Clinical Social Worker', 'Addiction Counselor Certification'],
      permissions: [
        { module: 'residents', actions: ['read', 'write', 'delete'] },
        { module: 'medical', actions: ['read', 'write'] },
        { module: 'reports', actions: ['read', 'write'] }
      ],
      schedule: [
        { dayOfWeek: 'Monday', startTime: '08:00', endTime: '17:00', type: 'regular' },
        { dayOfWeek: 'Tuesday', startTime: '08:00', endTime: '17:00', type: 'regular' },
        { dayOfWeek: 'Wednesday', startTime: '08:00', endTime: '17:00', type: 'regular' },
        { dayOfWeek: 'Thursday', startTime: '08:00', endTime: '17:00', type: 'regular' },
        { dayOfWeek: 'Friday', startTime: '08:00', endTime: '15:00', type: 'regular' }
      ],
      emergencyContact: {
        name: 'Michael Wilson',
        phone: '(555) 987-6543',
        relationship: 'Spouse'
      }
    },
    {
      id: 2,
      firstName: 'James',
      lastName: 'Rodriguez',
      email: 'james.rodriguez@forwardhorizon.com',
      phone: '(555) 234-5678',
      role: 'Case Manager',
      department: 'Support Services',
      hireDate: '2023-03-22',
      status: 'active',
      certifications: ['Certified Case Manager', 'Mental Health First Aid'],
      permissions: [
        { module: 'residents', actions: ['read', 'write'] },
        { module: 'programs', actions: ['read', 'write'] },
        { module: 'calendar', actions: ['read', 'write'] }
      ],
      schedule: [
        { dayOfWeek: 'Monday', startTime: '09:00', endTime: '18:00', type: 'regular' },
        { dayOfWeek: 'Tuesday', startTime: '09:00', endTime: '18:00', type: 'regular' },
        { dayOfWeek: 'Wednesday', startTime: '09:00', endTime: '18:00', type: 'regular' },
        { dayOfWeek: 'Thursday', startTime: '09:00', endTime: '18:00', type: 'regular' }
      ],
      emergencyContact: {
        name: 'Maria Rodriguez',
        phone: '(555) 876-5432',
        relationship: 'Wife'
      }
    },
    {
      id: 3,
      firstName: 'Lisa',
      lastName: 'Thompson',
      email: 'lisa.thompson@forwardhorizon.com',
      phone: '(555) 345-6789',
      role: 'Security Officer',
      department: 'Security',
      hireDate: '2023-06-01',
      status: 'active',
      certifications: ['Security Guard License', 'CPR Certification'],
      permissions: [
        { module: 'residents', actions: ['read'] },
        { module: 'security', actions: ['read', 'write'] }
      ],
      schedule: [
        { dayOfWeek: 'Saturday', startTime: '22:00', endTime: '06:00', type: 'regular' },
        { dayOfWeek: 'Sunday', startTime: '22:00', endTime: '06:00', type: 'regular' },
        { dayOfWeek: 'Monday', startTime: '22:00', endTime: '06:00', type: 'regular' }
      ],
      emergencyContact: {
        name: 'Robert Thompson',
        phone: '(555) 765-4321',
        relationship: 'Father'
      }
    },
    {
      id: 4,
      firstName: 'David',
      lastName: 'Chen',
      email: 'david.chen@forwardhorizon.com',
      phone: '(555) 456-7890',
      role: 'Administrator',
      department: 'Administration',
      hireDate: '2021-11-10',
      status: 'on_leave',
      certifications: ['Public Administration Certificate', 'Project Management'],
      permissions: [
        { module: 'residents', actions: ['read', 'write'] },
        { module: 'staff', actions: ['read', 'write'] },
        { module: 'reports', actions: ['read', 'write'] },
        { module: 'settings', actions: ['read', 'write'] }
      ],
      schedule: [
        { dayOfWeek: 'Monday', startTime: '07:00', endTime: '16:00', type: 'regular' },
        { dayOfWeek: 'Tuesday', startTime: '07:00', endTime: '16:00', type: 'regular' },
        { dayOfWeek: 'Wednesday', startTime: '07:00', endTime: '16:00', type: 'regular' },
        { dayOfWeek: 'Thursday', startTime: '07:00', endTime: '16:00', type: 'regular' },
        { dayOfWeek: 'Friday', startTime: '07:00', endTime: '14:00', type: 'regular' }
      ],
      emergencyContact: {
        name: 'Amy Chen',
        phone: '(555) 654-3210',
        relationship: 'Sister'
      }
    }
  ]);

  // Mock roles data
  const [roles, setRoles] = useState<Role[]>([
    {
      id: 1,
      name: 'Clinical Director',
      description: 'Oversees all clinical operations and staff',
      level: 5,
      permissions: [
        { module: 'residents', actions: ['read', 'write', 'delete'] },
        { module: 'medical', actions: ['read', 'write', 'delete'] },
        { module: 'staff', actions: ['read', 'write'] },
        { module: 'programs', actions: ['read', 'write'] },
        { module: 'reports', actions: ['read', 'write'] }
      ]
    },
    {
      id: 2,
      name: 'Case Manager',
      description: 'Manages resident cases and coordinates services',
      level: 3,
      permissions: [
        { module: 'residents', actions: ['read', 'write'] },
        { module: 'programs', actions: ['read', 'write'] },
        { module: 'calendar', actions: ['read', 'write'] },
        { module: 'reports', actions: ['read'] }
      ]
    },
    {
      id: 3,
      name: 'Security Officer',
      description: 'Maintains facility security and safety',
      level: 2,
      permissions: [
        { module: 'residents', actions: ['read'] },
        { module: 'security', actions: ['read', 'write'] },
        { module: 'incidents', actions: ['read', 'write'] }
      ]
    },
    {
      id: 4,
      name: 'Administrator',
      description: 'Handles administrative tasks and system management',
      level: 4,
      permissions: [
        { module: 'residents', actions: ['read', 'write'] },
        { module: 'staff', actions: ['read', 'write'] },
        { module: 'reports', actions: ['read', 'write'] },
        { module: 'settings', actions: ['read', 'write'] }
      ]
    }
  ]);

  const [newStaff, setNewStaff] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    hireDate: '',
    certifications: [''],
    emergencyContact: {
      name: '',
      phone: '',
      relationship: ''
    }
  });

  const [newRole, setNewRole] = useState({
    name: '',
    description: '',
    level: 1,
    permissions: [{ module: '', actions: [] as string[] }]
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'on_leave': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 5) return 'bg-purple-100 text-purple-800';
    if (level >= 4) return 'bg-blue-100 text-blue-800';
    if (level >= 3) return 'bg-green-100 text-green-800';
    if (level >= 2) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const departments = ['Medical', 'Support Services', 'Security', 'Administration', 'Facilities', 'Finance'];
  const availableModules = ['residents', 'medical', 'programs', 'calendar', 'staff', 'reports', 'security', 'settings'];
  const availableActions = ['read', 'write', 'delete'];

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    const staffMember: StaffMember = {
      id: Date.now(),
      ...newStaff,
      status: 'active',
      permissions: [],
      schedule: []
    };
    setStaff([...staff, staffMember]);
    setNewStaff({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      hireDate: '',
      certifications: [''],
      emergencyContact: { name: '', phone: '', relationship: '' }
    });
    setShowAddStaff(false);
  };

  const handleAddRole = (e: React.FormEvent) => {
    e.preventDefault();
    const role: Role = {
      id: Date.now(),
      ...newRole
    };
    setRoles([...roles, role]);
    setNewRole({
      name: '',
      description: '',
      level: 1,
      permissions: [{ module: '', actions: [] }]
    });
    setShowAddRole(false);
  };

  const activeStaff = staff.filter(s => s.status === 'active').length;
  const onLeaveStaff = staff.filter(s => s.status === 'on_leave').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Staff Management</h2>
            <p className="text-gray-600">Manage staff members, roles, and permissions</p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAddStaff(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Add Staff Member
            </button>
            <button
              onClick={() => setShowAddRole(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              Add Role
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('staff')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'staff'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Staff Directory
          </button>
          <button
            onClick={() => setActiveTab('roles')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'roles'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Roles & Permissions
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'schedule'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Schedule Overview
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-3xl font-bold text-gray-900">{staff.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Staff</p>
              <p className="text-3xl font-bold text-green-600">{activeStaff}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">On Leave</p>
              <p className="text-3xl font-bold text-yellow-600">{onLeaveStaff}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-3xl font-bold text-purple-600">{departments.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Directory Tab */}
      {activeTab === 'staff' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hire Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {staff.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {member.firstName[0]}{member.lastName[0]}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.department}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{member.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(member.status)}`}>
                        {member.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(member.hireDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedStaff(member)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        View
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Roles Tab */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {roles.map((role) => (
            <div key={role.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{role.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{role.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getLevelColor(role.level)}`}>
                  Level {role.level}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Permissions:</p>
                  <div className="space-y-2">
                    {role.permissions.map((permission, index) => (
                      <div key={index} className="flex items-center justify-between text-sm">
                        <span className="text-gray-900 capitalize">{permission.module}</span>
                        <div className="flex space-x-1">
                          {permission.actions.map((action) => (
                            <span key={action} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-2">
                <button
                  onClick={() => setSelectedRole(role)}
                  className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100"
                >
                  View Details
                </button>
                <button className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Schedule Tab */}
      {activeTab === 'schedule' && (
        <div className="space-y-6">
          {/* Schedule Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Schedule Overview</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Staff Member</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Mon</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Tue</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Wed</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Thu</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Fri</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Sat</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700">Sun</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.filter(s => s.status === 'active').map((member) => (
                    <tr key={member.id} className="border-b border-gray-100">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{member.firstName} {member.lastName}</div>
                        <div className="text-sm text-gray-500">{member.role}</div>
                      </td>
                      {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => {
                        const schedule = member.schedule.find(s => s.dayOfWeek === day);
                        return (
                          <td key={day} className="py-3 px-4 text-center">
                            {schedule ? (
                              <div className="text-xs">
                                <div className="font-medium">{schedule.startTime}-{schedule.endTime}</div>
                                <div className={`inline-block px-2 py-1 rounded text-xs ${
                                  schedule.type === 'regular' ? 'bg-green-100 text-green-800' :
                                  schedule.type === 'overtime' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {schedule.type.replace('_', ' ')}
                                </div>
                              </div>
                            ) : (
                              <span className="text-gray-400">Off</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add Staff Member</h3>
              <button
                onClick={() => setShowAddStaff(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaff.firstName}
                    onChange={(e) => setNewStaff({...newStaff, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaff.lastName}
                    onChange={(e) => setNewStaff({...newStaff, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role *
                  </label>
                  <select
                    required
                    value={newStaff.role}
                    onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a role</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.name}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department *
                  </label>
                  <select
                    required
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({...newStaff, department: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hire Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newStaff.hireDate}
                    onChange={(e) => setNewStaff({...newStaff, hireDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Certifications
                </label>
                {newStaff.certifications.map((cert, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={cert}
                      onChange={(e) => {
                        const updatedCerts = [...newStaff.certifications];
                        updatedCerts[index] = e.target.value;
                        setNewStaff({...newStaff, certifications: updatedCerts});
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter certification"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedCerts = newStaff.certifications.filter((_, i) => i !== index);
                          setNewStaff({...newStaff, certifications: updatedCerts});
                        }}
                        className="px-3 py-2 text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setNewStaff({...newStaff, certifications: [...newStaff.certifications, '']})}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Certification
                </button>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Emergency Contact</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Name</label>
                    <input
                      type="text"
                      value={newStaff.emergencyContact.name}
                      onChange={(e) => setNewStaff({
                        ...newStaff,
                        emergencyContact: {...newStaff.emergencyContact, name: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newStaff.emergencyContact.phone}
                      onChange={(e) => setNewStaff({
                        ...newStaff,
                        emergencyContact: {...newStaff.emergencyContact, phone: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Relationship</label>
                    <input
                      type="text"
                      value={newStaff.emergencyContact.relationship}
                      onChange={(e) => setNewStaff({
                        ...newStaff,
                        emergencyContact: {...newStaff.emergencyContact, relationship: e.target.value}
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddStaff(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Role Modal */}
      {showAddRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Role</h3>
              <button
                onClick={() => setShowAddRole(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddRole} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newRole.name}
                    onChange={(e) => setNewRole({...newRole, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Level (1-5) *
                  </label>
                  <select
                    required
                    value={newRole.level}
                    onChange={(e) => setNewRole({...newRole, level: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={1}>1 - Basic</option>
                    <option value={2}>2 - Limited</option>
                    <option value={3}>3 - Standard</option>
                    <option value={4}>4 - Advanced</option>
                    <option value={5}>5 - Full Access</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={newRole.description}
                  onChange={(e) => setNewRole({...newRole, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Permissions
                </label>
                {newRole.permissions.map((permission, index) => (
                  <div key={index} className="border border-gray-200 rounded-md p-4 mb-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Module</label>
                        <select
                          value={permission.module}
                          onChange={(e) => {
                            const updatedPermissions = [...newRole.permissions];
                            updatedPermissions[index].module = e.target.value;
                            setNewRole({...newRole, permissions: updatedPermissions});
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select module</option>
                          {availableModules.map((module) => (
                            <option key={module} value={module}>
                              {module}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Actions</label>
                        <div className="flex space-x-2">
                          {availableActions.map((action) => (
                            <label key={action} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={permission.actions.includes(action)}
                                onChange={(e) => {
                                  const updatedPermissions = [...newRole.permissions];
                                  if (e.target.checked) {
                                    updatedPermissions[index].actions.push(action);
                                  } else {
                                    updatedPermissions[index].actions = updatedPermissions[index].actions.filter(a => a !== action);
                                  }
                                  setNewRole({...newRole, permissions: updatedPermissions});
                                }}
                                className="mr-1"
                              />
                              <span className="text-sm">{action}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedPermissions = newRole.permissions.filter((_, i) => i !== index);
                          setNewRole({...newRole, permissions: updatedPermissions});
                        }}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove Permission
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setNewRole({
                    ...newRole,
                    permissions: [...newRole.permissions, { module: '', actions: [] }]
                  })}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Permission
                </button>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddRole(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Create Role
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Details Modal */}
      {selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {selectedStaff.firstName} {selectedStaff.lastName} - Staff Details
              </h3>
              <button
                onClick={() => setSelectedStaff(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Personal Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{selectedStaff.firstName} {selectedStaff.lastName}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedStaff.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{selectedStaff.phone}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Role</label>
                      <p className="text-gray-900">{selectedStaff.role}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Department</label>
                      <p className="text-gray-900">{selectedStaff.department}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Hire Date</label>
                      <p className="text-gray-900">{new Date(selectedStaff.hireDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedStaff.status)}`}>
                        {selectedStaff.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Certifications</label>
                    <ul className="text-gray-900 text-sm space-y-1">
                      {selectedStaff.certifications.map((cert, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2"></div>
                          {cert}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Emergency Contact</label>
                    <div className="text-gray-900 text-sm">
                      <p>{selectedStaff.emergencyContact.name} ({selectedStaff.emergencyContact.relationship})</p>
                      <p>{selectedStaff.emergencyContact.phone}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Permissions & Schedule */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Permissions & Schedule</h4>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">System Permissions</label>
                    <div className="space-y-2 mt-2">
                      {selectedStaff.permissions.map((permission, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-900 capitalize">{permission.module}</span>
                          <div className="flex space-x-1">
                            {permission.actions.map((action) => (
                              <span key={action} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                {action}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Weekly Schedule</label>
                    <div className="space-y-2 mt-2">
                      {selectedStaff.schedule.map((shift, index) => (
                        <div key={index} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                          <span className="text-gray-900">{shift.dayOfWeek}</span>
                          <div className="text-right">
                            <div className="font-medium">{shift.startTime} - {shift.endTime}</div>
                            <span className={`px-2 py-1 rounded text-xs ${
                              shift.type === 'regular' ? 'bg-green-100 text-green-800' :
                              shift.type === 'overtime' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {shift.type.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedStaff(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Edit Staff Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Role Details Modal */}
      {selectedRole && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{selectedRole.name} - Role Details</h3>
              <button
                onClick={() => setSelectedRole(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-500">Description</label>
                <p className="text-gray-900 mt-1">{selectedRole.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Access Level</label>
                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium mt-1 ${getLevelColor(selectedRole.level)}`}>
                  Level {selectedRole.level}
                </span>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Permissions</label>
                <div className="space-y-3 mt-2">
                  {selectedRole.permissions.map((permission, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-900 capitalize">{permission.module}</span>
                        <div className="flex space-x-1">
                          {permission.actions.map((action) => (
                            <span key={action} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              {action}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Staff with this Role</label>
                <div className="space-y-2 mt-2">
                  {staff.filter(s => s.role === selectedRole.name).map((member) => (
                    <div key={member.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                      <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                        <span className="text-xs font-medium text-gray-700">
                          {member.firstName[0]}{member.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{member.firstName} {member.lastName}</div>
                        <div className="text-sm text-gray-500">{member.department}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                onClick={() => setSelectedRole(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                Edit Role
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}