'use client';
import { useState, useEffect } from 'react';

interface Program {
  id: string;
  name: string;
  description: string;
  duration: number; // in days
  type: 'Detox' | 'Residential' | 'Outpatient' | 'Intensive';
  status: 'Active' | 'Inactive' | 'Draft';
  capacity: number;
  currentEnrollment: number;
  milestones: Milestone[];
  requirements: string[];
  createdDate: string;
}

interface Milestone {
  id: string;
  name: string;
  description: string;
  dayTarget: number;
  required: boolean;
  completionCriteria: string[];
}

interface ProgramEnrollment {
  id: string;
  residentId: string;
  residentName: string;
  programId: string;
  programName: string;
  enrollmentDate: string;
  expectedCompletionDate: string;
  status: 'Active' | 'Completed' | 'Withdrawn' | 'On Hold';
  progress: number; // percentage
  completedMilestones: string[];
  currentPhase: string;
}

export default function ProgramManagement() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [enrollments, setEnrollments] = useState<ProgramEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('programs');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockPrograms: Program[] = [
        {
          id: '1',
          name: '30-Day Detox Program',
          description: 'Medically supervised detoxification program focusing on safe withdrawal and stabilization.',
          duration: 30,
          type: 'Detox',
          status: 'Active',
          capacity: 20,
          currentEnrollment: 12,
          createdDate: '2024-01-01',
          requirements: [
            'Medical clearance required',
            'Insurance verification',
            'Completed intake assessment'
          ],
          milestones: [
            {
              id: '1',
              name: 'Initial Assessment',
              description: 'Complete medical and psychological assessment',
              dayTarget: 1,
              required: true,
              completionCriteria: ['Medical exam completed', 'Psychological evaluation done']
            },
            {
              id: '2',
              name: 'Stabilization',
              description: 'Achieve medical stabilization',
              dayTarget: 7,
              required: true,
              completionCriteria: ['Vital signs stable', 'Withdrawal symptoms managed']
            },
            {
              id: '3',
              name: 'Treatment Planning',
              description: 'Develop comprehensive treatment plan',
              dayTarget: 14,
              required: true,
              completionCriteria: ['Treatment goals set', 'Discharge plan created']
            }
          ]
        },
        {
          id: '2',
          name: '60-Day Intensive Program',
          description: 'Comprehensive residential treatment program with intensive therapy and skills training.',
          duration: 60,
          type: 'Intensive',
          status: 'Active',
          capacity: 40,
          currentEnrollment: 28,
          createdDate: '2024-01-01',
          requirements: [
            'Completed detox program',
            'Medical clearance',
            'Commitment to full program'
          ],
          milestones: [
            {
              id: '4',
              name: 'Program Orientation',
              description: 'Complete program orientation and initial assessments',
              dayTarget: 3,
              required: true,
              completionCriteria: ['Orientation completed', 'Initial therapy session']
            },
            {
              id: '5',
              name: 'Phase 1 Completion',
              description: 'Complete foundational treatment phase',
              dayTarget: 20,
              required: true,
              completionCriteria: ['Group therapy participation', 'Individual therapy sessions']
            },
            {
              id: '6',
              name: 'Phase 2 Completion',
              description: 'Complete intermediate treatment phase',
              dayTarget: 40,
              required: true,
              completionCriteria: ['Skills workshops completed', 'Family therapy sessions']
            },
            {
              id: '7',
              name: 'Graduation Preparation',
              description: 'Prepare for program completion and transition',
              dayTarget: 55,
              required: true,
              completionCriteria: ['Relapse prevention plan', 'Aftercare plan established']
            }
          ]
        },
        {
          id: '3',
          name: '90-Day Recovery Program',
          description: 'Extended residential program with comprehensive treatment and life skills development.',
          duration: 90,
          type: 'Residential',
          status: 'Active',
          capacity: 30,
          currentEnrollment: 22,
          createdDate: '2024-01-01',
          requirements: [
            'Commitment to 90-day program',
            'Medical and psychological clearance',
            'Insurance approval for extended stay'
          ],
          milestones: [
            {
              id: '8',
              name: 'Foundation Phase',
              description: 'Establish treatment foundation',
              dayTarget: 30,
              required: true,
              completionCriteria: ['Therapy engagement', 'Basic skills mastery']
            },
            {
              id: '9',
              name: 'Development Phase',
              description: 'Develop coping and life skills',
              dayTarget: 60,
              required: true,
              completionCriteria: ['Advanced therapy completion', 'Vocational training']
            },
            {
              id: '10',
              name: 'Integration Phase',
              description: 'Integrate skills and prepare for independence',
              dayTarget: 85,
              required: true,
              completionCriteria: ['Independent living skills', 'Community integration']
            }
          ]
        }
      ];

      const mockEnrollments: ProgramEnrollment[] = [
        {
          id: '1',
          residentId: '1',
          residentName: 'John Smith',
          programId: '2',
          programName: '60-Day Intensive Program',
          enrollmentDate: '2024-01-15',
          expectedCompletionDate: '2024-03-15',
          status: 'Active',
          progress: 65,
          completedMilestones: ['4', '5'],
          currentPhase: 'Phase 2'
        },
        {
          id: '2',
          residentId: '2',
          residentName: 'Sarah Johnson',
          programId: '2',
          programName: '60-Day Intensive Program',
          enrollmentDate: '2024-02-10',
          expectedCompletionDate: '2024-04-10',
          status: 'Active',
          progress: 35,
          completedMilestones: ['4'],
          currentPhase: 'Phase 1'
        },
        {
          id: '3',
          residentId: '3',
          residentName: 'Michael Brown',
          programId: '1',
          programName: '30-Day Detox Program',
          enrollmentDate: '2024-03-01',
          expectedCompletionDate: '2024-03-31',
          status: 'Active',
          progress: 10,
          completedMilestones: ['1'],
          currentPhase: 'Initial'
        }
      ];

      setPrograms(mockPrograms);
      setEnrollments(mockEnrollments);
      setLoading(false);
    }, 800);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Draft': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-blue-100 text-blue-800';
      case 'Withdrawn': return 'bg-red-100 text-red-800';
      case 'On Hold': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Detox': return 'bg-red-100 text-red-800';
      case 'Residential': return 'bg-blue-100 text-blue-800';
      case 'Outpatient': return 'bg-green-100 text-green-800';
      case 'Intensive': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
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
            <h1 className="text-3xl font-bold text-gray-900">Program Management</h1>
            <p className="text-gray-600 mt-1">Manage treatment programs, track milestones, and monitor resident progress</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
          >
            Create Program
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Programs</p>
                <p className="text-2xl font-bold text-gray-900">{programs.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Programs</p>
                <p className="text-2xl font-bold text-gray-900">
                  {programs.filter(p => p.status === 'Active').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Enrollment</p>
                <p className="text-2xl font-bold text-gray-900">
                  {programs.reduce((sum, p) => sum + p.currentEnrollment, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">78%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            {[
              { id: 'programs', label: 'Programs' },
              { id: 'enrollments', label: 'Current Enrollments' },
              { id: 'milestones', label: 'Milestone Tracking' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Programs Tab */}
        {activeTab === 'programs' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program) => (
              <div key={program.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{program.name}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(program.status)}`}>
                        {program.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(program.type)}`}>
                        {program.type}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedProgram(program)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>

                <p className="text-gray-600 text-sm mb-4">{program.description}</p>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-medium text-gray-900">{program.duration} days</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Enrollment:</span>
                    <span className="font-medium text-gray-900">
                      {program.currentEnrollment}/{program.capacity}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full" 
                      style={{ width: `${(program.currentEnrollment / program.capacity) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Milestones:</span>
                    <span className="font-medium text-gray-900">{program.milestones.length}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Enrollments Tab */}
        {activeTab === 'enrollments' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Current Enrollments</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Phase</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Expected Completion</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {enrollments.map((enrollment) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{enrollment.residentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{enrollment.programName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{enrollment.currentPhase}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                            <div 
                              className="bg-purple-600 h-2 rounded-full" 
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-900">{enrollment.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(enrollment.status)}`}>
                          {enrollment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(enrollment.expectedCompletionDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Milestones Tab */}
        {activeTab === 'milestones' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Milestone Tracking</h2>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Milestone Tracker</h3>
              <p className="text-gray-600">Detailed milestone tracking and progress visualization coming soon...</p>
            </div>
          </div>
        )}

        {/* Program Detail Modal */}
        {selectedProgram && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">{selectedProgram.name}</h2>
                <button
                  onClick={() => setSelectedProgram(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Program Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(selectedProgram.type)}`}>
                          {selectedProgram.type}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedProgram.status)}`}>
                          {selectedProgram.status}
                        </span>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                        <p className="text-gray-900">{selectedProgram.duration} days</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
                        <p className="text-gray-900">{selectedProgram.capacity} residents</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <p className="text-gray-900">{selectedProgram.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {selectedProgram.requirements.map((requirement, index) => (
                        <li key={index} className="flex items-center">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700">{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Program Milestones</h3>
                    <div className="space-y-4">
                      {selectedProgram.milestones.map((milestone) => (
                        <div key={milestone.id} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900">{milestone.name}</h4>
                            <span className="text-sm text-gray-500">Day {milestone.dayTarget}</span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{milestone.description}</p>
                          <div className="space-y-1">
                            <span className="text-xs font-medium text-gray-700">Completion Criteria:</span>
                            <ul className="text-xs text-gray-600">
                              {milestone.completionCriteria.map((criteria, index) => (
                                <li key={index} className="ml-4">• {criteria}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Create Program Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">Create New Program</h2>
                <button
                  onClick={() => setShowCreateForm(false)}
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
                  const newProgram: Program = {
                    id: (programs.length + 1).toString(),
                    name: formData.get('name') as string,
                    description: formData.get('description') as string,
                    duration: parseInt(formData.get('duration') as string),
                    type: formData.get('type') as Program['type'],
                    status: 'Active',
                    capacity: parseInt(formData.get('capacity') as string),
                    currentEnrollment: 0,
                    createdDate: new Date().toISOString().split('T')[0],
                    requirements: [(formData.get('requirements') as string || '').split('\n').filter(r => r.trim())].flat(),
                    milestones: []
                  };
                  setPrograms([...programs, newProgram]);
                  setShowCreateForm(false);
                }}
                className="p-6 overflow-y-auto max-h-[70vh]"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Program Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g., 45-Day Recovery Program"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      placeholder="Describe the program objectives and approach..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days) *</label>
                      <input
                        type="number"
                        name="duration"
                        required
                        min="1"
                        placeholder="30"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                      <select
                        name="type"
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Select type</option>
                        <option value="Detox">Detox</option>
                        <option value="Residential">Residential</option>
                        <option value="Outpatient">Outpatient</option>
                        <option value="Intensive">Intensive</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                      <input
                        type="number"
                        name="capacity"
                        required
                        min="1"
                        placeholder="20"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Requirements</label>
                    <textarea
                      name="requirements"
                      rows={4}
                      placeholder="Enter each requirement on a new line&#10;e.g., Medical clearance required&#10;Insurance verification&#10;Completed intake assessment"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter each requirement on a separate line</p>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                    >
                      Create Program
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