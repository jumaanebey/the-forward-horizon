'use client';
import { useState, useEffect } from 'react';

interface Resident {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  admissionDate: string;
  room: string;
  program: string;
  status: 'Active' | 'Pending' | 'Graduated' | 'Inactive' | 'On Leave';
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  medicalInfo: {
    allergies: string[];
    medications: string[];
    conditions: string[];
  };
  progressNotes: {
    id: string;
    date: string;
    note: string;
    author: string;
  }[];
}

export default function ResidentManagement() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterProgram, setFilterProgram] = useState('All');
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadResidents();
  }, []);

  const loadResidents = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockResidents: Resident[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@email.com',
          phone: '(555) 123-4567',
          dateOfBirth: '1985-03-15',
          admissionDate: '2024-01-15',
          room: 'A-101',
          program: '90-Day Recovery Program',
          status: 'Active',
          emergencyContact: {
            name: 'Mary Smith',
            relationship: 'Spouse',
            phone: '(555) 987-6543'
          },
          medicalInfo: {
            allergies: ['Penicillin', 'Shellfish'],
            medications: ['Metformin 500mg', 'Lisinopril 10mg'],
            conditions: ['Type 2 Diabetes', 'Hypertension']
          },
          progressNotes: [
            {
              id: '1',
              date: '2024-01-20',
              note: 'Patient showing good progress in group therapy sessions. Participating actively.',
              author: 'Dr. Johnson'
            },
            {
              id: '2',
              date: '2024-01-18',
              note: 'Completed first week orientation successfully. No issues reported.',
              author: 'Nurse Davis'
            }
          ]
        },
        {
          id: '2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah.j@email.com',
          phone: '(555) 234-5678',
          dateOfBirth: '1992-07-22',
          admissionDate: '2024-02-10',
          room: 'B-203',
          program: '60-Day Intensive Program',
          status: 'Active',
          emergencyContact: {
            name: 'Robert Johnson',
            relationship: 'Father',
            phone: '(555) 876-5432'
          },
          medicalInfo: {
            allergies: ['Latex'],
            medications: ['Sertraline 50mg'],
            conditions: ['Depression', 'Anxiety']
          },
          progressNotes: [
            {
              id: '3',
              date: '2024-02-15',
              note: 'Excellent engagement in individual counseling. Working on coping strategies.',
              author: 'Counselor Williams'
            }
          ]
        },
        {
          id: '3',
          firstName: 'Michael',
          lastName: 'Brown',
          email: 'mike.brown@email.com',
          phone: '(555) 345-6789',
          dateOfBirth: '1980-11-08',
          admissionDate: '2024-03-01',
          room: 'A-105',
          program: '30-Day Detox Program',
          status: 'Pending',
          emergencyContact: {
            name: 'Lisa Brown',
            relationship: 'Sister',
            phone: '(555) 765-4321'
          },
          medicalInfo: {
            allergies: [],
            medications: [],
            conditions: ['Substance Use Disorder']
          },
          progressNotes: [
            {
              id: '4',
              date: '2024-03-02',
              note: 'Initial assessment completed. Starting medical detox protocol.',
              author: 'Dr. Martinez'
            }
          ]
        }
      ];
      setResidents(mockResidents);
      setLoading(false);
    }, 800);
  };

  const filteredResidents = residents.filter(resident => {
    const matchesSearch = 
      resident.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.room.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || resident.status === filterStatus;
    const matchesProgram = filterProgram === 'All' || resident.program === filterProgram;
    
    return matchesSearch && matchesStatus && matchesProgram;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Graduated': return 'bg-blue-100 text-blue-800';
      case 'On Leave': return 'bg-purple-100 text-purple-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const programs = ['All', '30-Day Detox Program', '60-Day Intensive Program', '90-Day Recovery Program'];
  const statuses = ['All', 'Active', 'Pending', 'Graduated', 'On Leave', 'Inactive'];

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Resident Management</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage resident profiles, medical records, and progress tracking</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base w-full sm:w-auto"
          >
            Add New Resident
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Residents</p>
                <p className="text-2xl font-bold text-gray-900">{residents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {residents.filter(r => r.status === 'Active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {residents.filter(r => r.status === 'Pending').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Graduated</p>
                <p className="text-2xl font-bold text-gray-900">
                  {residents.filter(r => r.status === 'Graduated').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden mb-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="relative">
              <input
                type="text"
                placeholder="Search residents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
              <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex space-x-3 mt-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <select
                value={filterProgram}
                onChange={(e) => setFilterProgram(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {programs.map(program => (
                  <option key={program} value={program}>{program.length > 15 ? program.substring(0, 15) + '...' : program}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Desktop Filters */}
        <div className="hidden lg:block bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search residents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Program</label>
              <select
                value={filterProgram}
                onChange={(e) => setFilterProgram(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {programs.map(program => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Residents Table/Cards */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Residents ({filteredResidents.length})
            </h2>
          </div>
          
          {filteredResidents.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No residents found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            <>
              {/* Mobile Card Layout */}
              <div className="block lg:hidden p-4 space-y-4">
                {filteredResidents.map((resident) => (
                  <div key={resident.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 active:scale-95 active:shadow-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {resident.firstName.charAt(0)}{resident.lastName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-gray-900">
                            {resident.firstName} {resident.lastName}
                          </h3>
                          <p className="text-sm text-gray-500">{resident.room}</p>
                        </div>
                      </div>
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(resident.status)}`}>
                        {resident.status}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-xl p-3 mb-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-500 font-medium">Program</span>
                          <p className="text-gray-900 font-semibold truncate">{resident.program.split(' ')[0]} Program</p>
                        </div>
                        <div>
                          <span className="text-gray-500 font-medium">Admitted</span>
                          <p className="text-gray-900 font-semibold">
                            {new Date(resident.admissionDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setSelectedResident(resident)}
                        className="flex-1 bg-blue-50 text-blue-700 py-3 px-4 rounded-xl font-semibold text-sm hover:bg-blue-100 active:bg-blue-200 transition-all duration-150 active:scale-98"
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => {
                          const updatedResidents = residents.filter(r => r.id !== resident.id);
                          setResidents(updatedResidents);
                        }}
                        className="bg-red-50 text-red-700 py-3 px-4 rounded-xl font-semibold text-sm hover:bg-red-100 active:bg-red-200 transition-all duration-150 active:scale-98"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Admission Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredResidents.map((resident) => (
                      <tr key={resident.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {resident.firstName} {resident.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{resident.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {resident.room}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {resident.program}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(resident.status)}`}>
                            {resident.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(resident.admissionDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => setSelectedResident(resident)}
                            className="text-blue-600 hover:text-blue-900 mr-3"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => {
                              const updatedResidents = residents.filter(r => r.id !== resident.id);
                              setResidents(updatedResidents);
                            }}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Resident Detail Modal */}
        {selectedResident && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 sm:p-6 border-b">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 truncate">
                  {selectedResident.firstName} {selectedResident.lastName}
                </h2>
                <button
                  onClick={() => setSelectedResident(null)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Tabs */}
              <div className="border-b overflow-x-auto">
                <div className="flex min-w-max">
                  {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'medical', label: 'Medical' },
                    { id: 'progress', label: 'Progress' },
                    { id: 'emergency', label: 'Emergency' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-4 sm:px-6 py-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 sm:p-6 overflow-y-auto max-h-[70vh] sm:max-h-[60vh]">
                {activeTab === 'overview' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                      <p className="text-gray-900">{selectedResident.firstName} {selectedResident.lastName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <p className="text-gray-900">{selectedResident.email}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <p className="text-gray-900">{selectedResident.phone}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <p className="text-gray-900">{new Date(selectedResident.dateOfBirth).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
                      <p className="text-gray-900">{selectedResident.room}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                      <p className="text-gray-900">{selectedResident.program}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedResident.status)}`}>
                        {selectedResident.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Admission Date</label>
                      <p className="text-gray-900">{new Date(selectedResident.admissionDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}

                {activeTab === 'medical' && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Allergies</label>
                      <div className="flex flex-wrap gap-2">
                        {selectedResident.medicalInfo.allergies.length > 0 ? (
                          selectedResident.medicalInfo.allergies.map((allergy, index) => (
                            <span key={index} className="px-3 py-1 bg-red-100 text-red-800 text-sm rounded-full">
                              {allergy}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-500">No known allergies</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                      <div className="space-y-2">
                        {selectedResident.medicalInfo.medications.length > 0 ? (
                          selectedResident.medicalInfo.medications.map((medication, index) => (
                            <div key={index} className="p-3 bg-blue-50 rounded-lg">
                              <span className="text-blue-900">{medication}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500">No current medications</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
                      <div className="space-y-2">
                        {selectedResident.medicalInfo.conditions.length > 0 ? (
                          selectedResident.medicalInfo.conditions.map((condition, index) => (
                            <div key={index} className="p-3 bg-yellow-50 rounded-lg">
                              <span className="text-yellow-900">{condition}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-gray-500">No documented conditions</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'progress' && (
                  <div className="space-y-4">
                    {selectedResident.progressNotes.length > 0 ? (
                      selectedResident.progressNotes.map((note) => (
                        <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-gray-900">{note.author}</span>
                            <span className="text-sm text-gray-500">
                              {new Date(note.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-gray-700">{note.note}</p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <span className="text-gray-500">No progress notes available</span>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'emergency' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                      <p className="text-gray-900">{selectedResident.emergencyContact.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                      <p className="text-gray-900">{selectedResident.emergencyContact.relationship}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <p className="text-gray-900">{selectedResident.emergencyContact.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Add Resident Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 sm:p-6 border-b">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Add New Resident</h2>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  const newResident: Resident = {
                    id: (residents.length + 1).toString(),
                    firstName: formData.get('firstName') as string,
                    lastName: formData.get('lastName') as string,
                    email: formData.get('email') as string,
                    phone: formData.get('phone') as string,
                    dateOfBirth: formData.get('dateOfBirth') as string,
                    admissionDate: new Date().toISOString().split('T')[0],
                    room: formData.get('room') as string,
                    program: formData.get('program') as string,
                    status: 'Pending',
                    emergencyContact: {
                      name: formData.get('emergencyName') as string,
                      relationship: formData.get('emergencyRelationship') as string,
                      phone: formData.get('emergencyPhone') as string,
                    },
                    medicalInfo: {
                      allergies: [],
                      medications: [],
                      conditions: []
                    },
                    progressNotes: []
                  };
                  setResidents([...residents, newResident]);
                  setShowAddForm(false);
                }}
                className="p-4 sm:p-6 overflow-y-auto max-h-[75vh] sm:max-h-[70vh]"
              >
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        name="dateOfBirth"
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Room Assignment</label>
                      <input
                        type="text"
                        name="room"
                        placeholder="e.g., A-101"
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program *</label>
                    <select
                      name="program"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a program</option>
                      <option value="30-Day Detox Program">30-Day Detox Program</option>
                      <option value="60-Day Intensive Program">60-Day Intensive Program</option>
                      <option value="90-Day Recovery Program">90-Day Recovery Program</option>
                    </select>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                        <input
                          type="text"
                          name="emergencyName"
                          className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                        <input
                          type="text"
                          name="emergencyRelationship"
                          className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                      <input
                        type="tel"
                        name="emergencyPhone"
                        className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="w-full sm:w-auto px-6 py-3 sm:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-base font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-6 py-3 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-base font-medium"
                    >
                      Add Resident
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