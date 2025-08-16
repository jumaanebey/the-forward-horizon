"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";

interface Resident {
  id: number;
  name: string;
  room_number?: string;
  admission_date?: string;
  notes?: string;
  program?: string;
  dob?: string;
  phone?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  medicalConditions?: string;
  medications?: string;
}

interface ExportButtonProps {
  residents: Resident[];
}

export default function ExportButton({ residents }: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);

  const exportToCSV = () => {
    setExporting(true);
    
    try {
      // Prepare CSV data
      const headers = [
        'ID',
        'Name',
        'Room Number',
        'Admission Date',
        'Date of Birth',
        'Phone',
        'Program',
        'Emergency Contact',
        'Emergency Phone',
        'Medical Conditions',
        'Medications',
        'Notes'
      ];

      const csvData = residents.map(resident => [
        resident.id,
        resident.name,
        resident.room_number || '',
        resident.admission_date || '',
        resident.dob || '',
        resident.phone || '',
        resident.program || '',
        resident.emergencyContact || '',
        resident.emergencyPhone || '',
        resident.medicalConditions || '',
        resident.medications || '',
        resident.notes || ''
      ]);

      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `residents_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Residents exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export residents');
    } finally {
      setExporting(false);
    }
  };

  return (
    <button
      onClick={exportToCSV}
      disabled={exporting || residents.length === 0}
      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
    >
      {exporting ? (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Exporting...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export CSV
        </>
      )}
    </button>
  );
} 