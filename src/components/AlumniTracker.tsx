'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-hot-toast';

interface Alumni {
  id: string;
  resident_id: string;
  graduation_date: string;
  program_completed?: string;
  exit_reason: string;
  forwarding_address?: string;
  phone?: string;
  email?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  follow_up_notes?: string;
  last_contact_date?: string;
  employment_status?: string;
  housing_status?: string;
  sobriety_status?: string;
  created_at: string;
  updated_at: string;
  residents?: {
    name: string;
  };
}

interface Resident {
  id: string;
  name: string;
}

export default function AlumniTracker() {
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAlumni, setEditingAlumni] = useState<Alumni | null>(null);
  const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
  const [formData, setFormData] = useState({
    resident_id: '',
    graduation_date: '',
    program_completed: '',
    exit_reason: 'graduated',
    forwarding_address: '',
    phone: '',
    email: '',
    emergency_contact: '',
    emergency_phone: '',
    follow_up_notes: '',
    last_contact_date: '',
    employment_status: '',
    housing_status: '',
    sobriety_status: ''
  });

  const exitReasons = [
    'graduated',
    'transferred',
    'dismissed',
    'left_voluntarily',
    'medical_discharge'
  ];

  const employmentStatuses = [
    'employed_full_time',
    'employed_part_time',
    'self_employed',
    'unemployed_seeking',
    'unemployed_not_seeking',
    'student',
    'retired',
    'disabled'
  ];

  const housingStatuses = [
    'independent_living',
    'sober_living',
    'family_home',
    'transitional_housing',
    'homeless',
    'assisted_living',
    'other'
  ];

  const sobrietyStatuses = [
    'maintaining_sobriety',
    'relapsed_recovering',
    'relapsed_not_recovering',
    'unknown',
    'not_applicable'
  ];

  useEffect(() => {
    fetchAlumni();
    fetchResidents();
  }, []);

  const fetchAlumni = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('alumni')
        .select(`
          *,
          residents!inner(name)
        `)
        .order('graduation_date', { ascending: false });
      
      if (error) throw error;
      setAlumni(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch alumni records');
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
    
    if (!formData.resident_id || !formData.graduation_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const alumniData = {
        ...formData,
        forwarding_address: formData.forwarding_address.trim() || null,
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        emergency_contact: formData.emergency_contact.trim() || null,
        emergency_phone: formData.emergency_phone.trim() || null,
        follow_up_notes: formData.follow_up_notes.trim() || null,
        last_contact_date: formData.last_contact_date || null,
        employment_status: formData.employment_status || null,
        housing_status: formData.housing_status || null,
        sobriety_status: formData.sobriety_status || null
      };

      if (editingAlumni) {
        const { error } = await supabase
          .from('alumni')
          .update(alumniData)
          .eq('id', editingAlumni.id);

        if (error) throw error;
        toast.success('Alumni record updated successfully');
      } else {
        const { error } = await supabase
          .from('alumni')
          .insert([alumniData]);

        if (error) throw error;
        toast.success('Alumni record added successfully');
      }

      resetForm();
      fetchAlumni();
    } catch (error: any) {
      toast.error(editingAlumni ? 'Failed to update alumni record' : 'Failed to add alumni record');
    }
  };

  const handleEdit = (alumniRecord: Alumni) => {
    setEditingAlumni(alumniRecord);
    setFormData({
      resident_id: alumniRecord.resident_id,
      graduation_date: alumniRecord.graduation_date.split('T')[0],
      program_completed: alumniRecord.program_completed || '',
      exit_reason: alumniRecord.exit_reason,
      forwarding_address: alumniRecord.forwarding_address || '',
      phone: alumniRecord.phone || '',
      email: alumniRecord.email || '',
      emergency_contact: alumniRecord.emergency_contact || '',
      emergency_phone: alumniRecord.emergency_phone || '',
      follow_up_notes: alumniRecord.follow_up_notes || '',
      last_contact_date: alumniRecord.last_contact_date ? alumniRecord.last_contact_date.split('T')[0] : '',
      employment_status: alumniRecord.employment_status || '',
      housing_status: alumniRecord.housing_status || '',
      sobriety_status: alumniRecord.sobriety_status || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (alumniId: string) => {
    if (!confirm('Are you sure you want to delete this alumni record?')) return;

    try {
      const { error } = await supabase
        .from('alumni')
        .delete()
        .eq('id', alumniId);

      if (error) throw error;
      toast.success('Alumni record deleted successfully');
      fetchAlumni();
    } catch (error: any) {
      toast.error('Failed to delete alumni record');
    }
  };

  const resetForm = () => {
    setFormData({
      resident_id: '',
      graduation_date: '',
      program_completed: '',
      exit_reason: 'graduated',
      forwarding_address: '',
      phone: '',
      email: '',
      emergency_contact: '',
      emergency_phone: '',
      follow_up_notes: '',
      last_contact_date: '',
      employment_status: '',
      housing_status: '',
      sobriety_status: ''
    });
    setEditingAlumni(null);
    setShowAddForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'graduated': return 'bg-green-100 text-green-800';
      case 'transferred': return 'bg-blue-100 text-blue-800';
      case 'dismissed': return 'bg-red-100 text-red-800';
      case 'left_voluntarily': return 'bg-yellow-100 text-yellow-800';
      case 'medical_discharge': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSobrietyColor = (status: string) => {
    switch (status) {
      case 'maintaining_sobriety': return 'bg-green-100 text-green-800';
      case 'relapsed_recovering': return 'bg-yellow-100 text-yellow-800';
      case 'relapsed_not_recovering': return 'bg-red-100 text-red-800';
      case 'unknown': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alumni Tracking</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total Alumni: {alumni.length} | 
            Graduated: {alumni.filter(a => a.exit_reason === 'graduated').length} |
            Maintaining Sobriety: {alumni.filter(a => a.sobriety_status === 'maintaining_sobriety').length}
          </p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Alumni Record
        </button>
      </div>

      {/* Add/Edit Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingAlumni ? 'Edit Alumni Record' : 'Add Alumni Record'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resident *
                  </label>
                  <select
                    name="resident_id"
                    value={formData.resident_id}
                    onChange={handleChange}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Graduation Date *
                  </label>
                  <input
                    type="date"
                    name="graduation_date"
                    value={formData.graduation_date}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program Completed
                  </label>
                  <input
                    type="text"
                    name="program_completed"
                    value={formData.program_completed}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Recovery Program, Re-entry Program"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Exit Reason
                  </label>
                  <select
                    name="exit_reason"
                    value={formData.exit_reason}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {exitReasons.map(reason => (
                      <option key={reason} value={reason}>
                        {reason.replace('_', ' ').toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Forwarding Address
                    </label>
                    <textarea
                      name="forwarding_address"
                      value={formData.forwarding_address}
                      onChange={handleChange}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Contact
                    </label>
                    <input
                      type="text"
                      name="emergency_contact"
                      value={formData.emergency_contact}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Emergency Phone
                    </label>
                    <input
                      type="tel"
                      name="emergency_phone"
                      value={formData.emergency_phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Status Updates</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employment Status
                    </label>
                    <select
                      name="employment_status"
                      value={formData.employment_status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Status</option>
                      {employmentStatuses.map(status => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Housing Status
                    </label>
                    <select
                      name="housing_status"
                      value={formData.housing_status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Status</option>
                      {housingStatuses.map(status => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sobriety Status
                    </label>
                    <select
                      name="sobriety_status"
                      value={formData.sobriety_status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Status</option>
                      {sobrietyStatuses.map(status => (
                        <option key={status} value={status}>
                          {status.replace(/_/g, ' ').toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Contact Date
                    </label>
                    <input
                      type="date"
                      name="last_contact_date"
                      value={formData.last_contact_date}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Follow-up Notes
                  </label>
                  <textarea
                    name="follow_up_notes"
                    value={formData.follow_up_notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Notes about follow-up contacts, progress updates, etc."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {editingAlumni ? 'Update Record' : 'Add Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Alumni List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {alumni.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No alumni records found
            </div>
          ) : (
            alumni.map((alumniRecord) => (
              <div key={alumniRecord.id} className="border border-gray-200 rounded-lg p-6 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {alumniRecord.residents?.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Graduated: {formatDate(alumniRecord.graduation_date)}
                        {alumniRecord.program_completed && ` • ${alumniRecord.program_completed}`}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(alumniRecord.exit_reason)}`}>
                        {alumniRecord.exit_reason.replace('_', ' ').toUpperCase()}
                      </span>
                      {alumniRecord.sobriety_status && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSobrietyColor(alumniRecord.sobriety_status)}`}>
                          {alumniRecord.sobriety_status.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(alumniRecord)}
                      className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(alumniRecord.id)}
                      className="text-red-600 hover:text-red-800 px-3 py-1 rounded-md hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  {alumniRecord.employment_status && (
                    <div>
                      <span className="font-medium text-gray-700">Employment:</span>
                      <div className="text-gray-900">{alumniRecord.employment_status.replace(/_/g, ' ').toUpperCase()}</div>
                    </div>
                  )}
                  {alumniRecord.housing_status && (
                    <div>
                      <span className="font-medium text-gray-700">Housing:</span>
                      <div className="text-gray-900">{alumniRecord.housing_status.replace(/_/g, ' ').toUpperCase()}</div>
                    </div>
                  )}
                  {alumniRecord.last_contact_date && (
                    <div>
                      <span className="font-medium text-gray-700">Last Contact:</span>
                      <div className="text-gray-900">{formatDate(alumniRecord.last_contact_date)}</div>
                    </div>
                  )}
                </div>

                {alumniRecord.follow_up_notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <span className="font-medium text-gray-700">Follow-up Notes:</span>
                    <p className="text-gray-900 mt-1">{alumniRecord.follow_up_notes}</p>
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