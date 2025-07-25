"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import EditResidentForm from "./EditResidentForm";
import { toast } from 'react-hot-toast';
import ExportButton from './ExportButton';

interface Resident {
  id: number;
  name: string;
  room_number?: string;
  admission_date?: string;
  notes?: string;
  // Add other fields as needed
}

export default function ResidentsList() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingResident, setEditingResident] = useState<Resident | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [deletingResidentId, setDeletingResidentId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from("residents")
      .select("id, name, room_number, admission_date, notes")
      .order("admission_date", { ascending: false });
    if (error) {
      setError(error.message);
    } else {
      setResidents(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (resident: Resident) => {
    setEditingResident(resident);
    setEditError(null);
  };

  const showSuccess = (msg: string) => {
    toast.success(msg);
  };

  const handleUpdate = async (updatedResident: any) => {
    setEditLoading(true);
    setEditError(null);
    // Map form fields to Supabase columns
    const { id, name, room, entryDate, notes } = updatedResident;
    const { error } = await supabase
      .from("residents")
      .update({
        name,
        room_number: room,
        admission_date: entryDate,
        notes,
        // Add other fields as needed
      })
      .eq("id", id);
    setEditLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setEditingResident(null);
    fetchResidents();
    showSuccess("Resident updated successfully!");
  };

  const handleDelete = async (residentId: number) => {
    if (!window.confirm("Are you sure you want to delete this resident?")) return;
    setDeletingResidentId(residentId);
    setDeleteError(null);
    const { error } = await supabase.from("residents").delete().eq("id", residentId);
    setDeletingResidentId(null);
    if (error) {
      toast.error(error.message);
      return;
    }
    fetchResidents();
    showSuccess("Resident deleted successfully!");
  };

  const filteredResidents = residents.filter(resident => {
    const matchesSearch = resident.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (resident.room_number && resident.room_number.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesFilter = filterStatus === 'all' || true; // Add status filtering when you have status field
    return matchesSearch && matchesFilter;
  });

  if (loading) return <div>Loading residents...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (residents.length === 0) return <div>No residents found.</div>;

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Residents</h2>
        <ExportButton residents={residents} />
      </div>
      
      {/* Search and Filter Controls */}
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or room number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="sm:w-48">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Residents</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading residents...</p>
        </div>
      ) : error ? (
        <div className="text-red-600 text-center py-8">{error}</div>
      ) : filteredResidents.length === 0 ? (
        <div className="text-center py-8 text-gray-600">
          {searchTerm ? 'No residents found matching your search.' : 'No residents found.'}
        </div>
      ) : (
        <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Room</th>
              <th className="px-4 py-2 text-left">Admission Date</th>
              <th className="px-4 py-2 text-left">Notes</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.map((resident) => (
              <tr key={resident.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{resident.name}</td>
                <td className="px-4 py-2">{resident.room_number || "-"}</td>
                <td className="px-4 py-2">{resident.admission_date || "-"}</td>
                <td className="px-4 py-2">{resident.notes || "-"}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    onClick={() => handleEdit(resident)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    onClick={() => handleDelete(resident.id)}
                    disabled={deletingResidentId === resident.id}
                  >
                    {deletingResidentId === resident.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editingResident && (
        <EditResidentForm
          resident={editingResident}
          onClose={() => setEditingResident(null)}
          onUpdate={handleUpdate}
        />
      )}
      {editError && <div className="text-red-600 mt-2">{editError}</div>}
      {deleteError && <div className="text-red-600 mt-2">{deleteError}</div>}
    </div>
  );
} 