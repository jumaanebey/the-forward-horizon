'use client';
import { useState } from 'react';

interface MedicalRecord {
  id: number;
  date: string;
  type: string;
  provider: string;
  notes: string;
  medications: string;
  followUp: string;
}

interface MedicalRecordsModalProps {
  resident: any;
  onClose: () => void;
}

export default function MedicalRecordsModal({ resident, onClose }: MedicalRecordsModalProps) {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([
    {
      id: 1,
      date: '2024-01-20',
      type: 'General Checkup',
      provider: 'Dr. Smith',
      notes: 'Patient in good health, blood pressure normal',
      medications: 'None',
      followUp: '6 months'
    },
  ]);

  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    date: '',
    type: '',
    provider: '',
    notes: '',
    medications: '',
    followUp: ''
  });

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const record: MedicalRecord = {
      id: Date.now(),
      ...newRecord
    };
    setMedicalRecords([record, ...medicalRecords]);
    setNewRecord({ date: '', type: '', provider: '', notes: '', medications: '', followUp: '' });
    setShowAddRecord(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Medical Records - {resident.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Add Record Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddRecord(!showAddRecord)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              {showAddRecord ? 'Cancel' : 'Add Medical Record'}
            </button>
          </div>

          {/* Add Record Form */}
          {showAddRecord && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Medical Record</h3>
              <form onSubmit={handleAddRecord} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newRecord.date}
                      onChange={(e) => setNewRecord({...newRecord, date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type of Visit *
                    </label>
                    <select
                      required
                      value={newRecord.type}
                      onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Type</option>
                      <option value="General Checkup">General Checkup</option>
                      <option value="Mental Health">Mental Health</option>
                      <option value="Dental">Dental</option>
                      <option value="Emergency">Emergency</option>
                      <option value="Specialist">Specialist</option>
                      <option value="Lab Work">Lab Work</option>
                      <option value="Vaccination">Vaccination</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Healthcare Provider *
                    </label>
                    <input
                      type="text"
                      required
                      value={newRecord.provider}
                      onChange={(e) => setNewRecord({...newRecord, provider: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Dr. Smith, XYZ Clinic"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Follow-up Required
                    </label>
                    <input
                      type="text"
                      value={newRecord.followUp}
                      onChange={(e) => setNewRecord({...newRecord, followUp: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="2 weeks, 3 months, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Medications Prescribed
                  </label>
                  <textarea
                    value={newRecord.medications}
                    onChange={(e) => setNewRecord({...newRecord, medications: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="List medications and dosages..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visit Notes *
                  </label>
                  <textarea
                    required
                    value={newRecord.notes}
                    onChange={(e) => setNewRecord({...newRecord, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Detailed notes about the visit..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddRecord(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Add Record
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Medical Records List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Medical History</h3>
            
            {medicalRecords.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No medical records found</p>
            ) : (
              medicalRecords.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900">{record.type}</h4>
                      <p className="text-sm text-gray-600">{record.date} • {record.provider}</p>
                    </div>
                    {record.followUp && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Follow-up: {record.followUp}
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div>
                      <strong className="text-sm text-gray-700">Notes:</strong>
                      <p className="text-sm text-gray-600 mt-1">{record.notes}</p>
                    </div>
                    
                    {record.medications && (
                      <div>
                        <strong className="text-sm text-gray-700">Medications:</strong>
                        <p className="text-sm text-gray-600 mt-1">{record.medications}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}