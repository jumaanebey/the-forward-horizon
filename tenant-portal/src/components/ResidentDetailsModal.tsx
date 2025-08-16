"use client";
import { useState } from "react";

interface Resident {
  id: number;
  name: string;
  room_number?: string;
  admission_date?: string;
  notes?: string;
  program?: string;
  status?: string;
  medicalConditions?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  dob?: string;
  phone?: string;
  medications?: string;
  created_at?: string;
}

interface ResidentDetailsModalProps {
  resident: Resident | null;
  onClose: () => void;
}

export default function ResidentDetailsModal({ resident, onClose }: ResidentDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'medical' | 'contact' | 'notes'>('overview');

  if (!resident) return null;

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (dob?: string) => {
    if (!dob) return 'Not provided';
    const birthDate = new Date(dob);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    return age;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '👤' },
    { id: 'medical', label: 'Medical', icon: '🏥' },
    { id: 'contact', label: 'Contact', icon: '📞' },
    { id: 'notes', label: 'Notes', icon: '📝' }
  ] as const;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{resident.name}</h2>
            <p className="text-gray-600">ID: {resident.id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Full Name:</span>
                      <span className="font-medium">{resident.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date of Birth:</span>
                      <span className="font-medium">{formatDate(resident.dob)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{calculateAge(resident.dob)} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone:</span>
                      <span className="font-medium">{resident.phone || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Program Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Room Number:</span>
                      <span className="font-medium">{resident.room_number || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Program Type:</span>
                      <span className="font-medium">{resident.program || 'Not assigned'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-medium px-2 py-1 rounded text-sm ${
                        resident.status === 'Active' ? 'bg-green-100 text-green-800' :
                        resident.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        resident.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {resident.status || 'Not set'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Admission Date:</span>
                      <span className="font-medium">{formatDate(resident.admission_date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'medical' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Medical Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Medical Conditions</label>
                    <div className="bg-gray-50 p-4 rounded-md">
                      {resident.medicalConditions ? (
                        <p className="text-gray-900 whitespace-pre-wrap">{resident.medicalConditions}</p>
                      ) : (
                        <p className="text-gray-500 italic">No medical conditions recorded</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Medications</label>
                    <div className="bg-gray-50 p-4 rounded-md">
                      {resident.medications ? (
                        <p className="text-gray-900 whitespace-pre-wrap">{resident.medications}</p>
                      ) : (
                        <p className="text-gray-500 italic">No medications recorded</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Emergency Contact Information</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Name</label>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-gray-900">{resident.emergencyContact || 'Not provided'}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact Phone</label>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-gray-900">{resident.emergencyPhone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Additional Notes</h3>
                <div className="bg-gray-50 p-4 rounded-md">
                  {resident.notes ? (
                    <p className="text-gray-900 whitespace-pre-wrap">{resident.notes}</p>
                  ) : (
                    <p className="text-gray-500 italic">No additional notes</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Record Information</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>Created: {resident.created_at ? formatDate(resident.created_at) : 'Unknown'}</p>
                  <p>Last Updated: {resident.created_at ? formatDate(resident.created_at) : 'Unknown'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 