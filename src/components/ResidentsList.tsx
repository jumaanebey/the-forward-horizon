"use client";
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";
import EditResidentForm from "./EditResidentForm";

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
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
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
      setEditError(error.message);
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
      setDeleteError(error.message);
      return;
    }
    fetchResidents();
    showSuccess("Resident deleted successfully!");
  };

  if (loading) return <div>Loading residents...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;
  if (residents.length === 0) return <div>No residents found.</div>;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-4">Residents</h2>
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-800 rounded">
          {successMessage}
        </div>
      )}
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
          {residents.map((resident) => (
            <tr key={resident.id} className="border-t">
              <td className="px-4 py-2">{resident.name}</td>
              <td className="px-4 py-2">{resident.room_number || "-"}</td>
              <td className="px-4 py-2">{resident.admission_date || "-"}</td>
              <td className="px-4 py-2">{resident.notes || "-"}</td>
              <td className="px-4 py-2 flex gap-2">
                <button
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => handleEdit(resident)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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