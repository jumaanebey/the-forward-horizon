'use client';
import { useState } from 'react';

interface Program {
  id: number;
  name: string;
  description: string;
  duration: number; // in days
  phases: Phase[];
  currentEnrollment: number;
  maxCapacity: number;
  status: 'active' | 'inactive';
  requirements: string[];
}

interface Phase {
  id: number;
  name: string;
  description: string;
  duration: number; // in days
  requirements: string[];
  milestones: string[];
  order: number;
}

interface Enrollment {
  id: number;
  residentId: number;
  residentName: string;
  programId: number;
  programName: string;
  currentPhase: number;
  startDate: string;
  expectedCompletionDate: string;
  status: 'active' | 'completed' | 'withdrawn' | 'suspended';
  progress: number; // percentage
  notes: string;
}

export default function ProgramsContent() {
  const [activeTab, setActiveTab] = useState<'programs' | 'enrollments' | 'graduation'>('programs');
  const [showAddProgram, setShowAddProgram] = useState(false);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null);

  // Mock programs data
  const [programs, setPrograms] = useState<Program[]>([
    {
      id: 1,
      name: 'Recovery Program',
      description: 'Comprehensive addiction recovery program with counseling and life skills training',
      duration: 180,
      currentEnrollment: 45,
      maxCapacity: 50,
      status: 'active',
      requirements: ['Medical clearance', 'Background check', 'Court referral'],
      phases: [
        {
          id: 1,
          name: 'Intake & Assessment',
          description: 'Initial evaluation and orientation',
          duration: 14,
          order: 1,
          requirements: ['Medical exam', 'Psychological assessment', 'Orientation completion'],
          milestones: ['Complete intake forms', 'Meet with counselor', 'Create treatment plan']
        },
        {
          id: 2,
          name: 'Stabilization',
          description: 'Focus on stability and basic life skills',
          duration: 60,
          order: 2,
          requirements: ['Daily attendance', 'Weekly counseling', 'Group participation'],
          milestones: ['30 days clean', 'Complete life skills workshop', 'Establish routine']
        },
        {
          id: 3,
          name: 'Development',
          description: 'Skill building and personal development',
          duration: 76,
          order: 3,
          requirements: ['Job readiness training', 'Educational goals', 'Community service'],
          milestones: ['Find employment/education', 'Complete job training', '90 days clean']
        },
        {
          id: 4,
          name: 'Transition',
          description: 'Preparation for independent living',
          duration: 30,
          order: 4,
          requirements: ['Housing plan', 'Support system', 'Aftercare plan'],
          milestones: ['Secure housing', 'Complete program requirements', 'Graduation preparation']
        }
      ]
    },
    {
      id: 2,
      name: 'Re-entry Program',
      description: 'Specialized program for individuals transitioning from correctional facilities',
      duration: 120,
      currentEnrollment: 30,
      maxCapacity: 35,
      status: 'active',
      requirements: ['Recent release from custody', 'Parole/probation approval', 'Background verification'],
      phases: [
        {
          id: 5,
          name: 'Re-entry Orientation',
          description: 'Adjustment to community life and facility rules',
          duration: 10,
          order: 1,
          requirements: ['Facility orientation', 'Legal compliance review', 'Support team meeting'],
          milestones: ['Complete orientation', 'Meet probation officer', 'Establish contact with family']
        },
        {
          id: 6,
          name: 'Skill Building',
          description: 'Job training and life skills development',
          duration: 70,
          order: 2,
          requirements: ['Job readiness program', 'Educational assessment', 'Mental health support'],
          milestones: ['Complete job training', 'Obtain identification documents', 'Develop support network']
        },
        {
          id: 7,
          name: 'Community Integration',
          description: 'Gradual integration into community with support',
          duration: 40,
          order: 3,
          requirements: ['Employment/education', 'Community service', 'Regular check-ins'],
          milestones: ['Secure employment', 'Establish community connections', 'Financial stability']
        }
      ]
    }
  ]);

  // Mock enrollments data
  const [enrollments, setEnrollments] = useState<Enrollment[]>([
    {
      id: 1,
      residentId: 1,
      residentName: 'John Smith',
      programId: 1,
      programName: 'Recovery Program',
      currentPhase: 2,
      startDate: '2024-03-15',
      expectedCompletionDate: '2024-09-11',
      status: 'active',
      progress: 45,
      notes: 'Good progress, attending all sessions'
    },
    {
      id: 2,
      residentId: 2,
      residentName: 'Sarah Johnson',
      programId: 1,
      programName: 'Recovery Program',
      currentPhase: 3,
      startDate: '2024-02-01',
      expectedCompletionDate: '2024-07-30',
      status: 'active',
      progress: 75,
      notes: 'Excellent participant, helping other residents'
    },
    {
      id: 3,
      residentId: 3,
      residentName: 'Michael Brown',
      programId: 2,
      programName: 'Re-entry Program',
      currentPhase: 2,
      startDate: '2024-04-10',
      expectedCompletionDate: '2024-08-08',
      status: 'active',
      progress: 60,
      notes: 'Meeting all requirements, good attendance'
    }
  ]);

  const [newProgram, setNewProgram] = useState({
    name: '',
    description: '',
    duration: 90,
    maxCapacity: 20,
    requirements: ['']
  });

  const [newEnrollment, setNewEnrollment] = useState({
    residentName: '',
    programId: 0,
    startDate: '',
    notes: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'withdrawn': return 'bg-red-100 text-red-800';
      case 'suspended': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const handleAddProgram = (e: React.FormEvent) => {
    e.preventDefault();
    const program: Program = {
      id: Date.now(),
      ...newProgram,
      currentEnrollment: 0,
      status: 'active',
      phases: []
    };
    setPrograms([...programs, program]);
    setNewProgram({
      name: '',
      description: '',
      duration: 90,
      maxCapacity: 20,
      requirements: ['']
    });
    setShowAddProgram(false);
  };

  const handleEnrollResident = (e: React.FormEvent) => {
    e.preventDefault();
    const program = programs.find(p => p.id === newEnrollment.programId);
    if (!program) return;

    const enrollment: Enrollment = {
      id: Date.now(),
      residentId: Date.now(),
      residentName: newEnrollment.residentName,
      programId: newEnrollment.programId,
      programName: program.name,
      currentPhase: 1,
      startDate: newEnrollment.startDate,
      expectedCompletionDate: new Date(
        new Date(newEnrollment.startDate).getTime() + program.duration * 24 * 60 * 60 * 1000
      ).toISOString().split('T')[0],
      status: 'active',
      progress: 0,
      notes: newEnrollment.notes
    };

    setEnrollments([...enrollments, enrollment]);
    setNewEnrollment({
      residentName: '',
      programId: 0,
      startDate: '',
      notes: ''
    });
    setShowEnrollModal(false);
  };

  const graduatedResidents = enrollments.filter(e => e.status === 'completed');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Program Management</h2>
            <p className="text-gray-600">Manage programs, enrollments, and track resident progress</p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAddProgram(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Add Program
            </button>
            <button
              onClick={() => setShowEnrollModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
            >
              Enroll Resident
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('programs')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'programs'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Programs
          </button>
          <button
            onClick={() => setActiveTab('enrollments')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'enrollments'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Active Enrollments
          </button>
          <button
            onClick={() => setActiveTab('graduation')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'graduation'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Graduations
          </button>
        </div>
      </div>

      {/* Programs Tab */}
      {activeTab === 'programs' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {programs.map((program) => (
            <div key={program.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{program.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{program.description}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(program.status)}`}>
                  {program.status}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{program.duration} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Enrollment:</span>
                  <span className="font-medium">{program.currentEnrollment}/{program.maxCapacity}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phases:</span>
                  <span className="font-medium">{program.phases.length}</span>
                </div>
              </div>

              <div className="mt-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Capacity</span>
                  <span className="text-gray-900">{Math.round((program.currentEnrollment / program.maxCapacity) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full bg-blue-500"
                    style={{ width: `${(program.currentEnrollment / program.maxCapacity) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
                <div className="space-y-1">
                  {program.requirements.slice(0, 3).map((req, index) => (
                    <div key={index} className="flex items-center text-xs text-gray-600">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                      {req}
                    </div>
                  ))}
                  {program.requirements.length > 3 && (
                    <div className="text-xs text-gray-500">+{program.requirements.length - 3} more</div>
                  )}
                </div>
              </div>

              <div className="mt-6 flex space-x-2">
                <button
                  onClick={() => setSelectedProgram(program)}
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

      {/* Enrollments Tab */}
      {activeTab === 'enrollments' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Resident
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phase
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expected Completion
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {enrollments.filter(e => e.status === 'active').map((enrollment) => {
                  const program = programs.find(p => p.id === enrollment.programId);
                  const currentPhase = program?.phases.find(p => p.order === enrollment.currentPhase);
                  
                  return (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{enrollment.residentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{enrollment.programName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          Phase {enrollment.currentPhase}: {currentPhase?.name || 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className={`h-2 rounded-full ${getProgressColor(enrollment.progress)}`}
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{enrollment.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(enrollment.status)}`}>
                          {enrollment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(enrollment.expectedCompletionDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => setSelectedEnrollment(enrollment)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          View
                        </button>
                        <button className="text-gray-600 hover:text-gray-900">
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Graduation Tab */}
      {activeTab === 'graduation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Graduation Stats */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Graduation Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-medium">8 graduates</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">This Year</span>
                    <span className="font-medium">47 graduates</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Success Rate</span>
                    <span className="font-medium text-green-600">87%</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Avg. Completion Time</span>
                    <span className="font-medium">156 days</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Graduations</h3>
              <div className="space-y-3">
                {enrollments
                  .filter(e => e.progress > 90 && e.status === 'active')
                  .slice(0, 3)
                  .map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{enrollment.residentName}</p>
                        <p className="text-xs text-gray-600">{enrollment.programName}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-green-600">{enrollment.progress}%</p>
                        <p className="text-xs text-gray-500">
                          {new Date(enrollment.expectedCompletionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Graduation History */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Graduations</h3>
              <div className="space-y-4">
                {graduatedResidents.length === 0 ? (
                  <div className="text-center py-8">
                    <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <p className="text-gray-500 mt-2">No graduations recorded yet</p>
                    <p className="text-sm text-gray-400">Completed programs will appear here</p>
                  </div>
                ) : (
                  graduatedResidents.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-green-100 rounded-full">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{enrollment.residentName}</p>
                          <p className="text-sm text-gray-600">{enrollment.programName}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(enrollment.startDate).toLocaleDateString()} - {new Date(enrollment.expectedCompletionDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                          Graduated
                        </span>
                        <p className="text-xs text-gray-500 mt-1">Duration: {enrollment.progress === 100 ? programs.find(p => p.id === enrollment.programId)?.duration : 'N/A'} days</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Program Modal */}
      {showAddProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Program</h3>
              <button
                onClick={() => setShowAddProgram(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddProgram} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newProgram.name}
                    onChange={(e) => setNewProgram({...newProgram, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (days) *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProgram.duration}
                    onChange={(e) => setNewProgram({...newProgram, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Capacity *
                  </label>
                  <input
                    type="number"
                    required
                    value={newProgram.maxCapacity}
                    onChange={(e) => setNewProgram({...newProgram, maxCapacity: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({...newProgram, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                {newProgram.requirements.map((req, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => {
                        const updatedRequirements = [...newProgram.requirements];
                        updatedRequirements[index] = e.target.value;
                        setNewProgram({...newProgram, requirements: updatedRequirements});
                      }}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter requirement"
                    />
                    {index > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const updatedRequirements = newProgram.requirements.filter((_, i) => i !== index);
                          setNewProgram({...newProgram, requirements: updatedRequirements});
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
                  onClick={() => setNewProgram({...newProgram, requirements: [...newProgram.requirements, '']})}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Add Requirement
                </button>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProgram(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Program
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enroll Resident Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Enroll Resident</h3>
              <button
                onClick={() => setShowEnrollModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEnrollResident} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resident Name *
                </label>
                <input
                  type="text"
                  required
                  value={newEnrollment.residentName}
                  onChange={(e) => setNewEnrollment({...newEnrollment, residentName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Program *
                </label>
                <select
                  required
                  value={newEnrollment.programId}
                  onChange={(e) => setNewEnrollment({...newEnrollment, programId: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={0}>Select a program</option>
                  {programs.filter(p => p.status === 'active').map((program) => (
                    <option key={program.id} value={program.id}>
                      {program.name} ({program.currentEnrollment}/{program.maxCapacity})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={newEnrollment.startDate}
                  onChange={(e) => setNewEnrollment({...newEnrollment, startDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newEnrollment.notes}
                  onChange={(e) => setNewEnrollment({...newEnrollment, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEnrollModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Enroll Resident
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Program Details Modal */}
      {selectedProgram && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{selectedProgram.name} Details</h3>
              <button
                onClick={() => setSelectedProgram(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Program Info */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Program Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900">{selectedProgram.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Duration</label>
                      <p className="text-gray-900">{selectedProgram.duration} days</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Max Capacity</label>
                      <p className="text-gray-900">{selectedProgram.maxCapacity}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Enrollment</label>
                    <p className="text-gray-900">{selectedProgram.currentEnrollment} residents</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Requirements</label>
                    <ul className="text-gray-900 text-sm space-y-1">
                      {selectedProgram.requirements.map((req, index) => (
                        <li key={index} className="flex items-center">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Program Phases */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Program Phases</h4>
                <div className="space-y-4">
                  {selectedProgram.phases.map((phase) => (
                    <div key={phase.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium text-gray-900">
                          Phase {phase.order}: {phase.name}
                        </h5>
                        <span className="text-sm text-gray-500">{phase.duration} days</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{phase.description}</p>
                      
                      <div className="mb-3">
                        <p className="text-xs font-medium text-gray-700 mb-1">Requirements:</p>
                        <div className="space-y-1">
                          {phase.requirements.map((req, index) => (
                            <div key={index} className="text-xs text-gray-600 flex items-center">
                              <div className="w-1 h-1 bg-gray-400 rounded-full mr-2"></div>
                              {req}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-medium text-gray-700 mb-1">Milestones:</p>
                        <div className="space-y-1">
                          {phase.milestones.map((milestone, index) => (
                            <div key={index} className="text-xs text-gray-600 flex items-center">
                              <div className="w-1 h-1 bg-green-400 rounded-full mr-2"></div>
                              {milestone}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedProgram(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Edit Program
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enrollment Details Modal */}
      {selectedEnrollment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Enrollment Details</h3>
              <button
                onClick={() => setSelectedEnrollment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Resident</label>
                  <p className="text-gray-900 font-medium">{selectedEnrollment.residentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Program</label>
                  <p className="text-gray-900">{selectedEnrollment.programName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Start Date</label>
                  <p className="text-gray-900">{new Date(selectedEnrollment.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Expected Completion</label>
                  <p className="text-gray-900">{new Date(selectedEnrollment.expectedCompletionDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Current Phase</label>
                  <p className="text-gray-900">Phase {selectedEnrollment.currentPhase}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(selectedEnrollment.status)}`}>
                    {selectedEnrollment.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Progress</label>
                <div className="flex items-center mt-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-3 mr-3">
                    <div
                      className={`h-3 rounded-full ${getProgressColor(selectedEnrollment.progress)}`}
                      style={{ width: `${selectedEnrollment.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{selectedEnrollment.progress}%</span>
                </div>
              </div>

              {selectedEnrollment.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="text-gray-900 mt-1">{selectedEnrollment.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                onClick={() => setSelectedEnrollment(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Update Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}