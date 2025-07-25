"use client";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "../utils/supabaseClient";

interface Resident {
  id: number;
  name: string;
  room_number?: string;
  admission_date?: string;
  notes?: string;
  program?: string;
  status?: string;
}

interface BulkActionsProps {
  residents: Resident[];
  onResidentsUpdate: () => void;
}

export default function BulkActions({ residents, onResidentsUpdate }: BulkActionsProps) {
  const [selectedResidents, setSelectedResidents] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleSelectAll = () => {
    if (selectedResidents.length === residents.length) {
      setSelectedResidents([]);
    } else {
      setSelectedResidents(residents.map(r => r.id));
    }
  };

  const handleSelectResident = (residentId: number) => {
    setSelectedResidents(prev => 
      prev.includes(residentId) 
        ? prev.filter(id => id !== residentId)
        : [...prev, residentId]
    );
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedResidents.length === 0) return;

    setLoading(true);
    try {
      switch (bulkAction) {
        case "delete":
          if (!window.confirm(`Are you sure you want to delete ${selectedResidents.length} resident(s)?`)) {
            setLoading(false);
            return;
          }
          
          const { error: deleteError } = await supabase
            .from("residents")
            .delete()
            .in("id", selectedResidents);
          
          if (deleteError) {
            toast.error("Failed to delete residents");
            return;
          }
          
          toast.success(`${selectedResidents.length} resident(s) deleted successfully`);
          break;

        case "status":
          const newStatus = prompt("Enter new status (Active, Pending, Inactive, Completed):");
          if (!newStatus) {
            setLoading(false);
            return;
          }
          
          const { error: statusError } = await supabase
            .from("residents")
            .update({ status: newStatus })
            .in("id", selectedResidents);
          
          if (statusError) {
            toast.error("Failed to update status");
            return;
          }
          
          toast.success(`Status updated for ${selectedResidents.length} resident(s)`);
          break;

        case "export":
          const selectedResidentData = residents.filter(r => selectedResidents.includes(r.id));
          exportSelectedToCSV(selectedResidentData);
          break;
      }

      setSelectedResidents([]);
      setBulkAction("");
      onResidentsUpdate();
    } catch (error) {
      console.error("Bulk action error:", error);
      toast.error("An error occurred during bulk action");
    } finally {
      setLoading(false);
    }
  };

  const exportSelectedToCSV = (selectedData: Resident[]) => {
    const headers = [
      'ID',
      'Name',
      'Room Number',
      'Admission Date',
      'Program',
      'Status',
      'Notes'
    ];

    const csvData = selectedData.map(resident => [
      resident.id,
      resident.name,
      resident.room_number || '',
      resident.admission_date || '',
      resident.program || '',
      resident.status || '',
      resident.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `selected_residents_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Selected residents exported successfully!');
  };

  if (residents.length === 0) return null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Selection Controls */}
        <div className="flex items-center gap-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={selectedResidents.length === residents.length && residents.length > 0}
              onChange={handleSelectAll}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">
              Select All ({selectedResidents.length}/{residents.length})
            </span>
          </label>
        </div>

        {/* Bulk Actions */}
        {selectedResidents.length > 0 && (
          <div className="flex items-center gap-3">
            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">Choose Action</option>
              <option value="delete">Delete Selected</option>
              <option value="status">Update Status</option>
              <option value="export">Export Selected</option>
            </select>
            
            <button
              onClick={handleBulkAction}
              disabled={!bulkAction || loading}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                'Apply'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Selected Count */}
      {selectedResidents.length > 0 && (
        <div className="mt-3 p-3 bg-blue-50 rounded-md">
          <p className="text-sm text-blue-700">
            {selectedResidents.length} resident(s) selected
          </p>
        </div>
      )}
    </div>
  );
} 