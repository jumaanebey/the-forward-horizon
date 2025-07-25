"use client";
import { useState } from "react";
import PrintReport from "./PrintReport";

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
}

interface ReportsPanelProps {
  residents: Resident[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ReportsPanel({ residents, isOpen, onClose }: ReportsPanelProps) {
  const [selectedReport, setSelectedReport] = useState<'all' | 'active' | 'program' | 'medical'>('all');
  const [selectedProgram, setSelectedProgram] = useState<string>('');

  if (!isOpen) return null;

  const programs = Array.from(new Set(residents.map(r => r.program).filter(Boolean)));

  const handleReportChange = (reportType: 'all' | 'active' | 'program' | 'medical') => {
    setSelectedReport(reportType);
    if (reportType !== 'program') {
      setSelectedProgram('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Generate Reports</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Report Selection */}
        <div className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Report Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleReportChange('all')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  selectedReport === 'all'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">All Residents Report</h4>
                    <p className="text-sm text-gray-600">Complete list of all residents</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleReportChange('active')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  selectedReport === 'active'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Active Residents Report</h4>
                    <p className="text-sm text-gray-600">Only currently active residents</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleReportChange('program')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  selectedReport === 'program'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Program-Specific Report</h4>
                    <p className="text-sm text-gray-600">Residents in a specific program</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => handleReportChange('medical')}
                className={`p-4 border-2 rounded-lg text-left transition-colors ${
                  selectedReport === 'medical'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <div className="p-2 bg-red-100 rounded-lg mr-3">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">Medical Conditions Report</h4>
                    <p className="text-sm text-gray-600">Residents with medical conditions</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Program Selection (only for program reports) */}
          {selectedReport === 'program' && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Program
              </label>
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Choose a program</option>
                {programs.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Report Preview */}
          {selectedReport && (selectedReport !== 'program' || selectedProgram) && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Preview</h3>
              <PrintReport
                residents={residents}
                reportType={selectedReport}
                programFilter={selectedProgram}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 