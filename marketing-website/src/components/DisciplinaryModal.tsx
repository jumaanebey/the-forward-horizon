'use client';
import { useState } from 'react';

interface DisciplinaryRecord {
  id: number;
  date: string;
  type: string;
  severity: string;
  description: string;
  action: string;
  reportedBy: string;
  status: string;
  followUp: string;
}

interface DisciplinaryModalProps {
  resident: any;
  onClose: () => void;
}

export default function DisciplinaryModal({ resident, onClose }: DisciplinaryModalProps) {
  const [records, setRecords] = useState<DisciplinaryRecord[]>([
    {
      id: 1,
      date: '2024-01-25',
      type: 'Curfew Violation',
      severity: 'Minor',
      description: 'Returned 30 minutes past curfew time',
      action: 'Verbal Warning',
      reportedBy: 'Staff - Johnson',
      status: 'Resolved',
      followUp: 'Monitor compliance for 2 weeks'
    },
  ]);

  const [showAddRecord, setShowAddRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    date: '',
    type: '',
    severity: '',
    description: '',
    action: '',
    reportedBy: '',
    status: 'Open',
    followUp: ''
  });

  const handleAddRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const record: DisciplinaryRecord = {
      id: Date.now(),
      ...newRecord
    };
    setRecords([record, ...records]);
    setNewRecord({
      date: '', 
      type: '', 
      severity: '', 
      description: '', 
      action: '', 
      reportedBy: '', 
      status: 'Open', 
      followUp: '' 
    });
    setShowAddRecord(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Minor': return 'bg-yellow-100 text-yellow-800';
      case 'Moderate': return 'bg-orange-100 text-orange-800';
      case 'Major': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'Under Review': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Disciplinary Records - {resident.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-red-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-red-700">Open Issues</h3>
              <p className="text-2xl font-bold text-red-900">
                {records.filter(r => r.status === 'Open').length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-700">Under Review</h3>
              <p className="text-2xl font-bold text-yellow-900">
                {records.filter(r => r.status === 'Under Review').length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-700">Resolved</h3>
              <p className="text-2xl font-bold text-green-900">
                {records.filter(r => r.status === 'Resolved').length}
              </p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-700">Total Records</h3>
              <p className="text-2xl font-bold text-blue-900">{records.length}</p>
            </div>
          </div>

          {/* Add Record Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddRecord(!showAddRecord)}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
            >
              {showAddRecord ? 'Cancel' : 'Add Disciplinary Record'}
            </button>
          </div>

          {/* Add Record Form */}
          {showAddRecord && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Disciplinary Record</h3>
              <form onSubmit={handleAddRecord} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Incident *
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
                      Type of Violation *
                    </label>
                    <select
                      required
                      value={newRecord.type}
                      onChange={(e) => setNewRecord({...newRecord, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Type</option>
                      <option value="Curfew Violation">Curfew Violation</option>
                      <option value="Substance Use">Substance Use</option>
                      <option value="Disruptive Behavior">Disruptive Behavior</option>
                      <option value="Property Damage">Property Damage</option>
                      <option value="Verbal Altercation">Verbal Altercation</option>
                      <option value="Physical Altercation">Physical Altercation</option>
                      <option value="Theft">Theft</option>
                      <option value="Unauthorized Absence">Unauthorized Absence</option>
                      <option value="Rule Violation">General Rule Violation</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Severity Level *
                    </label>
                    <select
                      required
                      value={newRecord.severity}
                      onChange={(e) => setNewRecord({...newRecord, severity: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Severity</option>
                      <option value="Minor">Minor</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Major">Major</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Reported By *
                    </label>
                    <input
                      type="text"
                      required
                      value={newRecord.reportedBy}
                      onChange={(e) => setNewRecord({...newRecord, reportedBy: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Staff Name/Title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={newRecord.status}
                      onChange={(e) => setNewRecord({...newRecord, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Open">Open</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Action Taken
                    </label>
                    <select
                      value={newRecord.action}
                      onChange={(e) => setNewRecord({...newRecord, action: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Action</option>
                      <option value="Verbal Warning">Verbal Warning</option>
                      <option value="Written Warning">Written Warning</option>
                      <option value="Loss of Privileges">Loss of Privileges</option>
                      <option value="Extended Curfew">Extended Curfew</option>
                      <option value="Community Service">Community Service</option>
                      <option value="Counseling Required">Counseling Required</option>
                      <option value="Probation">Probation</option>
                      <option value="Suspension">Suspension</option>
                      <option value="Termination">Termination</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Incident Description *
                  </label>
                  <textarea
                    required
                    value={newRecord.description}
                    onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Detailed description of the incident..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow-up Required
                  </label>
                  <textarea
                    value={newRecord.followUp}
                    onChange={(e) => setNewRecord({...newRecord, followUp: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Any follow-up actions or monitoring required..."
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
                    className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Add Record
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Records List */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Disciplinary History</h3>
            
            {records.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No disciplinary records found</p>
            ) : (
              records.map((record) => (
                <div key={record.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-medium text-gray-900">{record.type}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(record.severity)}`}>
                          {record.severity}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {record.date} • Reported by: {record.reportedBy}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <strong className="text-sm text-gray-700">Description:</strong>
                      <p className="text-sm text-gray-600 mt-1">{record.description}</p>
                    </div>
                    
                    {record.action && (
                      <div>
                        <strong className="text-sm text-gray-700">Action Taken:</strong>
                        <p className="text-sm text-gray-600 mt-1">{record.action}</p>
                      </div>
                    )}
                    
                    {record.followUp && (
                      <div>
                        <strong className="text-sm text-gray-700">Follow-up:</strong>
                        <p className="text-sm text-gray-600 mt-1">{record.followUp}</p>
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