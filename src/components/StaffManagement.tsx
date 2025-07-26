'use client';
import { useState, useEffect } from 'react';

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: 'Medical' | 'Administration' | 'Counseling' | 'Nursing' | 'Security' | 'Maintenance';
  status: 'Active' | 'On Leave' | 'Part-time' | 'Inactive';
  hireDate: string;
  certifications: string[];
  schedule: {
    monday: string;
    tuesday: string;
    wednesday: string;
    thursday: string;
    friday: string;
    saturday: string;
    sunday: string;
  };
  contactInfo: {
    emergencyContact: string;
    emergencyPhone: string;
  };
  assignments: string[];
}

interface Shift {
  id: string;
  staffId: string;
  staffName: string;
  department: string;
  date: string;
  startTime: string;
  endTime: string;
  type: 'Regular' | 'Overtime' | 'On-call' | 'Double';
  status: 'Scheduled' | 'In Progress' | 'Completed' | 'Cancelled';
}

export default function StaffManagement() {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('staff');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [staffActiveTab, setStaffActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockStaff: Staff[] = [
        {
          id: '1',
          firstName: 'Dr. Sarah',
          lastName: 'Johnson',
          email: 'sarah.johnson@forwardhorizon.com',
          phone: '(555) 123-4567',
          position: 'Medical Director',
          department: 'Medical',
          status: 'Active',
          hireDate: '2020-03-15',
          certifications: ['MD', 'Board Certified Psychiatry', 'Addiction Medicine'],
          schedule: {
            monday: '08:00-17:00',
            tuesday: '08:00-17:00',
            wednesday: '08:00-17:00',
            thursday: '08:00-17:00',
            friday: '08:00-15:00',
            saturday: 'Off',
            sunday: 'Off'
          },
          contactInfo: {
            emergencyContact: 'Michael Johnson',
            emergencyPhone: '(555) 987-6543'
          },
          assignments: ['Medical Ward', 'Detox Unit', 'Emergency Response Team']
        },
        {
          id: '2',
          firstName: 'Maria',
          lastName: 'Rodriguez',
          email: 'maria.rodriguez@forwardhorizon.com',
          phone: '(555) 234-5678',
          position: 'Head Nurse',
          department: 'Nursing',
          status: 'Active',
          hireDate: '2019-07-22',
          certifications: ['RN', 'BSN', 'CARN-AP'],
          schedule: {
            monday: '07:00-19:00',
            tuesday: 'Off',
            wednesday: '07:00-19:00',
            thursday: 'Off',
            friday: '07:00-19:00',
            saturday: '07:00-19:00',
            sunday: 'Off'
          },
          contactInfo: {
            emergencyContact: 'Carlos Rodriguez',
            emergencyPhone: '(555) 876-5432'
          },
          assignments: ['Nursing Station A', 'Medication Management', 'New Staff Training']
        },
        {
          id: '3',
          firstName: 'James',
          lastName: 'Wilson',
          email: 'james.wilson@forwardhorizon.com',
          phone: '(555) 345-6789',
          position: 'Clinical Counselor',
          department: 'Counseling',
          status: 'Active',
          hireDate: '2021-01-10',
          certifications: ['LCSW', 'CADC', 'Group Therapy Certified'],
          schedule: {
            monday: '09:00-18:00',
            tuesday: '09:00-18:00',
            wednesday: '09:00-18:00',
            thursday: '09:00-18:00',
            friday: '09:00-17:00',
            saturday: 'Off',
            sunday: 'Off'
          },
          contactInfo: {
            emergencyContact: 'Linda Wilson',
            emergencyPhone: '(555) 765-4321'
          },
          assignments: ['Individual Counseling', 'Group Therapy Sessions', 'Family Therapy']
        },
        {
          id: '4',
          firstName: 'Angela',
          lastName: 'Davis',
          email: 'angela.davis@forwardhorizon.com',
          phone: '(555) 456-7890',
          position: 'Facility Administrator',
          department: 'Administration',
          status: 'Active',
          hireDate: '2018-11-05',
          certifications: ['MBA Healthcare Management', 'Licensed Administrator'],
          schedule: {
            monday: '08:00-17:00',
            tuesday: '08:00-17:00',
            wednesday: '08:00-17:00',
            thursday: '08:00-17:00',
            friday: '08:00-16:00',
            saturday: 'Off',
            sunday: 'Off'
          },
          contactInfo: {
            emergencyContact: 'Robert Davis',
            emergencyPhone: '(555) 654-3210'
          },
          assignments: ['Operations Management', 'Compliance', 'Budget Planning']
        },
        {
          id: '5',
          firstName: 'Kevin',
          lastName: 'Thompson',
          email: 'kevin.thompson@forwardhorizon.com',
          phone: '(555) 567-8901',
          position: 'Security Officer',
          department: 'Security',
          status: 'Part-time',
          hireDate: '2022-09-12',
          certifications: ['Security License', 'CPR/AED', 'Crisis Intervention'],
          schedule: {
            monday: 'Off',
            tuesday: 'Off',
            wednesday: '22:00-06:00',
            thursday: '22:00-06:00',
            friday: '22:00-06:00',
            saturday: '22:00-06:00',
            sunday: '22:00-06:00'
          },
          contactInfo: {
            emergencyContact: 'Susan Thompson',
            emergencyPhone: '(555) 543-2109'
          },
          assignments: ['Night Security', 'Emergency Response', 'Access Control']
        }
      ];

      const mockShifts: Shift[] = [
        {
          id: '1',
          staffId: '1',
          staffName: 'Dr. Sarah Johnson',
          department: 'Medical',
          date: '2024-01-26',
          startTime: '08:00',
          endTime: '17:00',
          type: 'Regular',
          status: 'Scheduled'
        },
        {
          id: '2',
          staffId: '2',
          staffName: 'Maria Rodriguez',
          department: 'Nursing',
          date: '2024-01-26',
          startTime: '07:00',
          endTime: '19:00',
          type: 'Regular',
          status: 'In Progress'
        },
        {
          id: '3',
          staffId: '3',
          staffName: 'James Wilson',
          department: 'Counseling',
          date: '2024-01-26',
          startTime: '09:00',
          endTime: '18:00',
          type: 'Regular',
          status: 'Scheduled'
        },
        {
          id: '4',
          staffId: '5',
          staffName: 'Kevin Thompson',
          department: 'Security',
          date: '2024-01-25',
          startTime: '22:00',
          endTime: '06:00',
          type: 'Regular',
          status: 'Completed'
        },
        {
          id: '5',
          staffId: '2',
          staffName: 'Maria Rodriguez',
          department: 'Nursing',
          date: '2024-01-24',
          startTime: '19:00',
          endTime: '07:00',
          type: 'Overtime',
          status: 'Completed'
        }
      ];

      setStaff(mockStaff);
      setShifts(mockShifts);
      setLoading(false);
    }, 800);
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = 
      member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'All' || member.department === filterDepartment;
    const matchesStatus = filterStatus === 'All' || member.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'On Leave': return 'bg-yellow-100 text-yellow-800';
      case 'Part-time': return 'bg-blue-100 text-blue-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Scheduled': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-green-100 text-green-800';
      case 'Completed': return 'bg-gray-100 text-gray-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'Medical': return 'bg-red-100 text-red-800';
      case 'Nursing': return 'bg-blue-100 text-blue-800';
      case 'Counseling': return 'bg-purple-100 text-purple-800';
      case 'Administration': return 'bg-green-100 text-green-800';
      case 'Security': return 'bg-orange-100 text-orange-800';
      case 'Maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getShiftTypeColor = (type: string) => {
    switch (type) {
      case 'Regular': return 'bg-green-100 text-green-800';
      case 'Overtime': return 'bg-orange-100 text-orange-800';
      case 'On-call': return 'bg-blue-100 text-blue-800';
      case 'Double': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const departments = ['All', 'Medical', 'Administration', 'Counseling', 'Nursing', 'Security', 'Maintenance'];
  const statuses = ['All', 'Active', 'On Leave', 'Part-time', 'Inactive'];

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
            <p className="text-gray-600 mt-1">Manage staff schedules, roles, and assignments across your facility</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium"
          >
            Add New Staff
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold text-gray-900">{staff.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {staff.filter(s => s.status === 'Active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">6</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Duty</p>
                <p className="text-2xl font-bold text-gray-900">
                  {shifts.filter(s => s.status === 'In Progress').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overtime Hours</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            {[
              { id: 'staff', label: 'Staff Directory' },
              { id: 'schedule', label: 'Schedule & Shifts' },
              { id: 'assignments', label: 'Assignments' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Directory Tab */}
        {activeTab === 'staff' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <input
                    type="text"
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredStaff.map((member) => (
                <div key={member.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.firstName[0]}{member.lastName[0]}
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {member.firstName} {member.lastName}
                        </h3>
                        <p className="text-sm text-gray-600">{member.position}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedStaff(member)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(member.department)}`}>
                        {member.department}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(member.status)}`}>
                        {member.status}
                      </span>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>📧 {member.email}</p>
                      <p>📞 {member.phone}</p>
                      <p>📅 Hired: {new Date(member.hireDate).toLocaleDateString()}</p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {member.certifications.slice(0, 2).map((cert, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded">
                          {cert}
                        </span>
                      ))}
                      {member.certifications.length > 2 && (
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded">
                          +{member.certifications.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedule & Shifts Tab */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Current Shifts</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shifts.map((shift) => (
                    <tr key={shift.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{shift.staffName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(shift.department)}`}>
                          {shift.department}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(shift.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {shift.startTime} - {shift.endTime}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getShiftTypeColor(shift.type)}`}>
                          {shift.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(shift.status)}`}>
                          {shift.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Staff Assignments</h2>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Assignment Management</h3>
              <p className="text-gray-600">Advanced assignment tracking and workload distribution coming soon...</p>
            </div>
          </div>
        )}

        {/* Staff Detail Modal */}
        {selectedStaff && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedStaff.firstName} {selectedStaff.lastName}
                </h2>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Staff Detail Tabs */}
              <div className="border-b">
                <div className="flex">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'schedule', label: 'Schedule' },
                    { id: 'certifications', label: 'Certifications' },
                    { id: 'assignments', label: 'Assignments' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setStaffActiveTab(tab.id)}
                      className={`px-6 py-3 text-sm font-medium border-b-2 ${
                        staffActiveTab === tab.id
                          ? 'border-green-500 text-green-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {staffActiveTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <p className="text-gray-900">{selectedStaff.firstName} {selectedStaff.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                      <p className="text-gray-900">{selectedStaff.position}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getDepartmentColor(selectedStaff.department)}`}>
                        {selectedStaff.department}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedStaff.status)}`}>
                        {selectedStaff.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{selectedStaff.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900">{selectedStaff.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hire Date</label>
                      <p className="text-gray-900">{new Date(selectedStaff.hireDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                      <p className="text-gray-900">{selectedStaff.contactInfo.emergencyContact}</p>
                      <p className="text-sm text-gray-600">{selectedStaff.contactInfo.emergencyPhone}</p>
                    </div>
                  </div>
                )}

                {staffActiveTab === 'schedule' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Weekly Schedule</h3>
                    <div className="grid grid-cols-1 gap-3">
                      {Object.entries(selectedStaff.schedule).map(([day, hours]) => (
                        <div key={day} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900 capitalize">{day}</span>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            hours === 'Off' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {staffActiveTab === 'certifications' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Certifications & Qualifications</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedStaff.certifications.map((cert, index) => (
                        <div key={index} className="p-4 bg-blue-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="text-blue-900 font-medium">{cert}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {staffActiveTab === 'assignments' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Current Assignments</h3>
                    <div className="space-y-3">
                      {selectedStaff.assignments.map((assignment, index) => (
                        <div key={index} className="flex items-center p-4 bg-green-50 rounded-lg">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <span className="text-green-900 font-medium">{assignment}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Staff Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Add New Staff Member</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newStaff: Staff = {
                    id: (staff.length + 1).toString(),
                    firstName: formData.get('firstName') as string,
                    lastName: formData.get('lastName') as string,
                    email: formData.get('email') as string,
                    phone: formData.get('phone') as string,
                    position: formData.get('position') as string,
                    department: formData.get('department') as Staff['department'],
                    status: 'Active',
                    hireDate: new Date().toISOString().split('T')[0],
                    certifications: [],
                    schedule: {
                      monday: 'Off',
                      tuesday: 'Off',
                      wednesday: 'Off',
                      thursday: 'Off',
                      friday: 'Off',
                      saturday: 'Off',
                      sunday: 'Off'
                    },
                    contactInfo: {
                      emergencyContact: formData.get('emergencyName') as string,
                      emergencyPhone: formData.get('emergencyPhone') as string,
                    },
                    assignments: []
                  };
                  setStaff([...staff, newStaff]);
                  setShowAddForm(false);
                }}
                className="p-6 overflow-y-auto max-h-[70vh]"
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position *</label>
                      <input
                        type="text"
                        name="position"
                        required
                        placeholder="e.g., Registered Nurse"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                      <select
                        name="department"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      >
                        <option value="">Select department</option>
                        <option value="Medical">Medical</option>
                        <option value="Administration">Administration</option>
                        <option value="Counseling">Counseling</option>
                        <option value="Nursing">Nursing</option>
                        <option value="Security">Security</option>
                        <option value="Maintenance">Maintenance</option>
                      </select>
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                        <input
                          type="text"
                          name="emergencyName"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                        <input
                          type="tel"
                          name="emergencyPhone"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Add Staff
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}