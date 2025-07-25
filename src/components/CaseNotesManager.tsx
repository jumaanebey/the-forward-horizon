'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-hot-toast';

interface CaseNote {
  id: string;
  resident_id: string;
  staff_id?: string;
  note_type: string;
  title: string;
  content: string;
  is_private: boolean;
  created_at: string;
  updated_at: string;
}

interface Resident {
  id: string;
  name: string;
}

interface CaseNotesManagerProps {
  residentId?: string;
  residentName?: string;
}

export default function CaseNotesManager({ residentId, residentName }: CaseNotesManagerProps) {
  const [notes, setNotes] = useState<CaseNote[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedNoteType, setSelectedNoteType] = useState('general');
  const [selectedResident, setSelectedResident] = useState(residentId || '');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_private: false
  });

  const noteTypes = [
    { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' },
    { value: 'medical', label: 'Medical', color: 'bg-red-100 text-red-800' },
    { value: 'behavioral', label: 'Behavioral', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'program', label: 'Program', color: 'bg-blue-100 text-blue-800' },
    { value: 'incident', label: 'Incident', color: 'bg-orange-100 text-orange-800' }
  ];

  useEffect(() => {
    fetchNotes();
    if (!residentId) {
      fetchResidents();
    }
  }, [residentId, selectedResident]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('case_notes')
        .select(`
          *,
          residents!inner(name)
        `);

      if (residentId) {
        query = query.eq('resident_id', residentId);
      } else if (selectedResident) {
        query = query.eq('resident_id', selectedResident);
      }

      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      setNotes(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch case notes');
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const { data, error } = await supabase
        .from('residents')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setResidents(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch residents');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedResident) {
      toast.error('Please select a resident');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const noteData = {
        resident_id: selectedResident,
        note_type: selectedNoteType,
        title: formData.title.trim(),
        content: formData.content.trim(),
        is_private: formData.is_private,
        staff_id: null // TODO: Replace with actual staff ID when auth is implemented
      };

      const { error } = await supabase
        .from('case_notes')
        .insert([noteData]);

      if (error) throw error;

      toast.success('Case note added successfully');
      setFormData({ title: '', content: '', is_private: false });
      setShowAddForm(false);
      fetchNotes();
    } catch (error: any) {
      toast.error('Failed to add case note');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const getNoteTypeStyle = (type: string) => {
    const noteType = noteTypes.find(nt => nt.value === type);
    return noteType ? noteType.color : 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Case Notes & Communication Log
            {residentName && <span className="text-lg font-normal text-gray-600 ml-2">- {residentName}</span>}
          </h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Note
        </button>
      </div>

      {/* Resident Selector (only show if not viewing specific resident) */}
      {!residentId && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Resident
          </label>
          <select
            value={selectedResident}
            onChange={(e) => setSelectedResident(e.target.value)}
            className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Residents</option>
            {residents.map(resident => (
              <option key={resident.id} value={resident.id}>
                {resident.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Add Note Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Add Case Note</h3>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!residentId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resident *
                  </label>
                  <select
                    value={selectedResident}
                    onChange={(e) => setSelectedResident(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Resident</option>
                    {residents.map(resident => (
                      <option key={resident.id} value={resident.id}>
                        {resident.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Note Type *
                </label>
                <select
                  value={selectedNoteType}
                  onChange={(e) => setSelectedNoteType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {noteTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief summary of the note..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Content *
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Detailed information about the case note..."
                />
              </div>

              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="is_private"
                    checked={formData.is_private}
                    onChange={handleChange}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Private Note (restricted access)</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Add Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notes List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No case notes found
            </div>
          ) : (
            notes.map((note) => (
              <div key={note.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getNoteTypeStyle(note.note_type)}`}>
                      {noteTypes.find(nt => nt.value === note.note_type)?.label || note.note_type}
                    </span>
                    {note.is_private && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-800 text-white">
                        Private
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {formatDate(note.created_at)}
                  </span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{note.title}</h3>
                
                <div className="text-gray-700 whitespace-pre-wrap mb-3">
                  {note.content}
                </div>
                
                {!residentId && note.residents && (
                  <div className="text-sm text-gray-500">
                    Resident: {(note.residents as any).name}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}