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
}

interface PrintReportProps {
  residents: Resident[];
  reportType: 'all' | 'active' | 'program' | 'medical';
  programFilter?: string;
}

export default function PrintReport({ residents, reportType, programFilter }: PrintReportProps) {
  const [isPrinting, setIsPrinting] = useState(false);

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

  const getFilteredResidents = () => {
    switch (reportType) {
      case 'active':
        return residents.filter(r => r.status === 'Active');
      case 'program':
        return residents.filter(r => r.program === programFilter);
      case 'medical':
        return residents.filter(r => r.medicalConditions && r.medicalConditions.trim() !== '');
      default:
        return residents;
    }
  };

  const getReportTitle = () => {
    switch (reportType) {
      case 'active':
        return 'Active Residents Report';
      case 'program':
        return `${programFilter} Program Report`;
      case 'medical':
        return 'Residents with Medical Conditions Report';
      default:
        return 'All Residents Report';
    }
  };

  const handlePrint = () => {
    setIsPrinting(true);
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };

  const filteredResidents = getFilteredResidents();

  return (
    <div className="space-y-4">
      {/* Print Button */}
      <div className="print:hidden">
        <button
          onClick={handlePrint}
          disabled={isPrinting}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
        >
          {isPrinting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Preparing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Report
            </>
          )}
        </button>
      </div>

      {/* Print Report Content */}
      <div className="bg-white print:bg-white print:shadow-none shadow-sm border print:border-0 rounded-lg p-6 print:p-0">
        {/* Header */}
        <div className="text-center mb-8 print:mb-6">
          <h1 className="text-3xl font-bold text-gray-900 print:text-2xl mb-2">
            Forward Horizon
          </h1>
          <h2 className="text-xl font-semibold text-gray-700 print:text-lg mb-1">
            {getReportTitle()}
          </h2>
          <p className="text-gray-600 print:text-sm">
            Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
          </p>
          <p className="text-gray-600 print:text-sm">
            Total Residents: {filteredResidents.length}
          </p>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 print:mb-4 print:grid-cols-4">
          <div className="text-center p-3 bg-gray-50 print:bg-gray-50 rounded">
            <div className="text-2xl font-bold text-blue-600 print:text-xl">{filteredResidents.length}</div>
            <div className="text-sm text-gray-600 print:text-xs">Total</div>
          </div>
          <div className="text-center p-3 bg-gray-50 print:bg-gray-50 rounded">
            <div className="text-2xl font-bold text-green-600 print:text-xl">
              {filteredResidents.filter(r => r.status === 'Active').length}
            </div>
            <div className="text-sm text-gray-600 print:text-xs">Active</div>
          </div>
          <div className="text-center p-3 bg-gray-50 print:bg-gray-50 rounded">
            <div className="text-2xl font-bold text-yellow-600 print:text-xl">
              {filteredResidents.filter(r => r.status === 'Pending').length}
            </div>
            <div className="text-sm text-gray-600 print:text-xs">Pending</div>
          </div>
          <div className="text-center p-3 bg-gray-50 print:bg-gray-50 rounded">
            <div className="text-2xl font-bold text-purple-600 print:text-xl">
              {filteredResidents.filter(r => r.medicalConditions && r.medicalConditions.trim() !== '').length}
            </div>
            <div className="text-sm text-gray-600 print:text-xs">Medical</div>
          </div>
        </div>

        {/* Residents Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 print:border-gray-400">
            <thead className="bg-gray-100 print:bg-gray-200">
              <tr>
                <th className="border border-gray-300 print:border-gray-400 px-3 py-2 text-left text-sm font-medium text-gray-700 print:text-xs">
                  Name
                </th>
                <th className="border border-gray-300 print:border-gray-400 px-3 py-2 text-left text-sm font-medium text-gray-700 print:text-xs">
                  Room
                </th>
                <th className="border border-gray-300 print:border-gray-400 px-3 py-2 text-left text-sm font-medium text-gray-700 print:text-xs">
                  Program
                </th>
                <th className="border border-gray-300 print:border-gray-400 px-3 py-2 text-left text-sm font-medium text-gray-700 print:text-xs">
                  Status
                </th>
                <th className="border border-gray-300 print:border-gray-400 px-3 py-2 text-left text-sm font-medium text-gray-700 print:text-xs">
                  Admission Date
                </th>
                <th className="border border-gray-300 print:border-gray-400 px-3 py-2 text-left text-sm font-medium text-gray-700 print:text-xs">
                  Age
                </th>
                <th className="border border-gray-300 print:border-gray-400 px-3 py-2 text-left text-sm font-medium text-gray-700 print:text-xs">
                  Emergency Contact
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredResidents.map((resident, index) => (
                <tr key={resident.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 print:bg-gray-50'}>
                  <td className="border border-gray-300 print:border-gray-400 px-3 py-2 text-sm print:text-xs">
                    {resident.name}
                  </td>
                  <td className="border border-gray-300 print:border-gray-400 px-3 py-2 text-sm print:text-xs">
                    {resident.room_number || '-'}
                  </td>
                  <td className="border border-gray-300 print:border-gray-400 px-3 py-2 text-sm print:text-xs">
                    {resident.program || '-'}
                  </td>
                  <td className="border border-gray-300 print:border-gray-400 px-3 py-2 text-sm print:text-xs">
                    <span className={`px-2 py-1 rounded text-xs ${
                      resident.status === 'Active' ? 'bg-green-100 text-green-800 print:bg-green-100' :
                      resident.status === 'Pending' ? 'bg-yellow-100 text-yellow-800 print:bg-yellow-100' :
                      resident.status === 'Inactive' ? 'bg-red-100 text-red-800 print:bg-red-100' :
                      'bg-gray-100 text-gray-800 print:bg-gray-100'
                    }`}>
                      {resident.status || 'Not set'}
                    </span>
                  </td>
                  <td className="border border-gray-300 print:border-gray-400 px-3 py-2 text-sm print:text-xs">
                    {formatDate(resident.admission_date)}
                  </td>
                  <td className="border border-gray-300 print:border-gray-400 px-3 py-2 text-sm print:text-xs">
                    {calculateAge(resident.dob)}
                  </td>
                  <td className="border border-gray-300 print:border-gray-400 px-3 py-2 text-sm print:text-xs">
                    {resident.emergencyContact || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-8 print:mt-6 pt-4 print:pt-2 border-t print:border-gray-400">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
            <div>
              <p className="text-sm text-gray-600 print:text-xs">
                <strong>Report Type:</strong> {getReportTitle()}
              </p>
              <p className="text-sm text-gray-600 print:text-xs">
                <strong>Generated By:</strong> Forward Horizon Management System
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 print:text-xs">
                <strong>Page 1 of 1</strong>
              </p>
              <p className="text-sm text-gray-600 print:text-xs">
                <strong>Date:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:bg-white {
            background: white !important;
          }
          .print\\:border-0 {
            border: none !important;
          }
          .print\\:p-0 {
            padding: 0 !important;
          }
          .print\\:mb-6 {
            margin-bottom: 1.5rem !important;
          }
          .print\\:mb-4 {
            margin-bottom: 1rem !important;
          }
          .print\\:mt-6 {
            margin-top: 1.5rem !important;
          }
          .print\\:pt-2 {
            padding-top: 0.5rem !important;
          }
          .print\\:text-2xl {
            font-size: 1.5rem !important;
          }
          .print\\:text-lg {
            font-size: 1.125rem !important;
          }
          .print\\:text-sm {
            font-size: 0.875rem !important;
          }
          .print\\:text-xs {
            font-size: 0.75rem !important;
          }
          .print\\:text-xl {
            font-size: 1.25rem !important;
          }
          .print\\:grid-cols-4 {
            grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
          }
          .print\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }
          .print\\:border-gray-400 {
            border-color: #9ca3af !important;
          }
          .print\\:bg-gray-200 {
            background-color: #e5e7eb !important;
          }
          .print\\:bg-gray-50 {
            background-color: #f9fafb !important;
          }
          .print\\:bg-green-100 {
            background-color: #dcfce7 !important;
          }
          .print\\:bg-yellow-100 {
            background-color: #fef3c7 !important;
          }
          .print\\:bg-red-100 {
            background-color: #fee2e2 !important;
          }
        }
      `}</style>
    </div>
  );
} 