"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "../utils/supabaseClient";

interface MaintenanceRequest {
  id: number;
  title: string;
  description: string;
  category: 'plumbing' | 'electrical' | 'hvac' | 'structural' | 'equipment' | 'cleaning' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  location: string;
  reported_by?: string;
  assigned_to?: string;
  reported_date: string;
  scheduled_date?: string;
  completed_date?: string;
  estimated_cost?: number;
  actual_cost?: number;
  notes?: string;
  created_at: string;
}

interface MaintenanceTrackerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MaintenanceTracker({ isOpen, onClose }: MaintenanceTrackerProps) {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddRequest, setShowAddRequest] = useState(false);
  const [editingRequest, setEditingRequest] = useState<MaintenanceRequest | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: 'other' as MaintenanceRequest['category'],
    priority: 'medium' as MaintenanceRequest['priority'],
    location: '',
    reported_by: '',
    scheduled_date: '',
    estimated_cost: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchRequests();
    }
  }, [isOpen]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('maintenance_requests')
        .select('*')
        .order('reported_date', { ascending: false });

      if (error) {
        toast.error('Failed to fetch maintenance requests');
        return;
      }

      setRequests(data || []);
    } catch (error) {
      toast.error('Error loading maintenance requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const requestData = {
        title: newRequest.title,
        description: newRequest.description,
        category: newRequest.category,
        priority: newRequest.priority,
        status: 'pending' as MaintenanceRequest['status'],
        location: newRequest.location,
        reported_by: newRequest.reported_by || null,
        reported_date: new Date().toISOString(),
        scheduled_date: newRequest.scheduled_date || null,
        estimated_cost: newRequest.estimated_cost ? parseFloat(newRequest.estimated_cost) : null,
        notes: newRequest.notes || null
      };

      const { data, error } = await supabase
        .from('maintenance_requests')
        .insert([requestData])
        .select();

      if (error) {
        toast.error('Failed to add maintenance request');
        return;
      }

      toast.success('Maintenance request added successfully');
      setNewRequest({
        title: '',
        description: '',
        category: 'other',
        priority: 'medium',
        location: '',
        reported_by: '',
        scheduled_date: '',
        estimated_cost: '',
        notes: ''
      });
      setShowAddRequest(false);
      fetchRequests();
    } catch (error) {
      toast.error('Error adding maintenance request');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (requestId: number, status: MaintenanceRequest['status']) => {
    setLoading(true);
    try {
      const updateData: any = { status };
      if (status === 'completed') {
        updateData.completed_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('maintenance_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) {
        toast.error('Failed to update request status');
        return;
      }

      toast.success('Request status updated');
      fetchRequests();
    } catch (error) {
      toast.error('Error updating request status');
    } finally {
      setLoading(false);
    }
  };

  const handleAssignRequest = async (requestId: number, assignedTo: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .update({ 
          assigned_to: assignedTo,
          status: 'assigned'
        })
        .eq('id', requestId);

      if (error) {
        toast.error('Failed to assign request');
        return;
      }

      toast.success('Request assigned successfully');
      fetchRequests();
    } catch (error) {
      toast.error('Error assigning request');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId: number) => {
    if (!window.confirm('Are you sure you want to delete this maintenance request?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('maintenance_requests')
        .delete()
        .eq('id', requestId);

      if (error) {
        toast.error('Failed to delete request');
        return;
      }

      toast.success('Maintenance request deleted successfully');
      fetchRequests();
    } catch (error) {
      toast.error('Error deleting request');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredRequests = () => {
    return requests.filter(request => {
      const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
      const matchesPriority = filterPriority === 'all' || request.priority === filterPriority;
      const matchesCategory = filterCategory === 'all' || request.category === filterCategory;
      
      return matchesStatus && matchesPriority && matchesCategory;
    });
  };

  const getMaintenanceSummary = () => {
    const totalRequests = requests.length;
    const pendingRequests = requests.filter(r => r.status === 'pending').length;
    const inProgressRequests = requests.filter(r => r.status === 'in_progress').length;
    const completedRequests = requests.filter(r => r.status === 'completed').length;
    const urgentRequests = requests.filter(r => r.priority === 'urgent').length;

    return { totalRequests, pendingRequests, inProgressRequests, completedRequests, urgentRequests };
  };

  const getPriorityColor = (priority: MaintenanceRequest['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: MaintenanceRequest['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: MaintenanceRequest['category']) => {
    switch (category) {
      case 'plumbing': return 'bg-blue-100 text-blue-800';
      case 'electrical': return 'bg-yellow-100 text-yellow-800';
      case 'hvac': return 'bg-green-100 text-green-800';
      case 'structural': return 'bg-red-100 text-red-800';
      case 'equipment': return 'bg-purple-100 text-purple-800';
      case 'cleaning': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  const filteredRequests = getFilteredRequests();
  const summary = getMaintenanceSummary();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Maintenance Tracker</h2>
            <p className="text-gray-600">Track facility maintenance and repair requests</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddRequest(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              New Request
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-600">Total Requests</div>
              <div className="text-2xl font-bold text-blue-600">{summary.totalRequests}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-600">Pending</div>
              <div className="text-2xl font-bold text-yellow-600">{summary.pendingRequests}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-600">In Progress</div>
              <div className="text-2xl font-bold text-purple-600">{summary.inProgressRequests}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-600">Completed</div>
              <div className="text-2xl font-bold text-green-600">{summary.completedRequests}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-600">Urgent</div>
              <div className="text-2xl font-bold text-red-600">{summary.urgentRequests}</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">Urgent</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="plumbing">Plumbing</option>
              <option value="electrical">Electrical</option>
              <option value="hvac">HVAC</option>
              <option value="structural">Structural</option>
              <option value="equipment">Equipment</option>
              <option value="cleaning">Cleaning</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Requests Table */}
        <div className="p-6 overflow-y-auto max-h-[40vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading maintenance requests...</p>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No maintenance requests found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Request</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Category</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Priority</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Location</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Reported</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Assigned To</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">
                        <div>
                          <div className="font-medium">{request.title}</div>
                          <div className="text-sm text-gray-600 truncate max-w-xs">
                            {request.description}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${getCategoryColor(request.category)}`}>
                          {request.category.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(request.priority)}`}>
                          {request.priority.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(request.status)}`}>
                          {request.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {request.location}
                      </td>
                      <td className="px-4 py-2">
                        {new Date(request.reported_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-2">
                        {request.assigned_to || '-'}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          {request.status === 'pending' && (
                            <button
                              onClick={() => handleAssignRequest(request.id, 'Maintenance Staff')}
                              className="px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
                            >
                              Assign
                            </button>
                          )}
                          {request.status === 'assigned' && (
                            <button
                              onClick={() => handleUpdateStatus(request.id, 'in_progress')}
                              className="px-2 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600"
                            >
                              Start
                            </button>
                          )}
                          {request.status === 'in_progress' && (
                            <button
                              onClick={() => handleUpdateStatus(request.id, 'completed')}
                              className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                            >
                              Complete
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteRequest(request.id)}
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add Request Modal */}
        {showAddRequest && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">New Maintenance Request</h3>
              <form onSubmit={handleAddRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newRequest.title}
                    onChange={(e) => setNewRequest({...newRequest, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    required
                    value={newRequest.description}
                    onChange={(e) => setNewRequest({...newRequest, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      required
                      value={newRequest.category}
                      onChange={(e) => setNewRequest({...newRequest, category: e.target.value as MaintenanceRequest['category']})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="plumbing">Plumbing</option>
                      <option value="electrical">Electrical</option>
                      <option value="hvac">HVAC</option>
                      <option value="structural">Structural</option>
                      <option value="equipment">Equipment</option>
                      <option value="cleaning">Cleaning</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                    <select
                      required
                      value={newRequest.priority}
                      onChange={(e) => setNewRequest({...newRequest, priority: e.target.value as MaintenanceRequest['priority']})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={newRequest.location}
                    onChange={(e) => setNewRequest({...newRequest, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reported By</label>
                    <input
                      type="text"
                      value={newRequest.reported_by}
                      onChange={(e) => setNewRequest({...newRequest, reported_by: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                    <input
                      type="date"
                      value={newRequest.scheduled_date}
                      onChange={(e) => setNewRequest({...newRequest, scheduled_date: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Cost</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newRequest.estimated_cost}
                    onChange={(e) => setNewRequest({...newRequest, estimated_cost: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newRequest.notes}
                    onChange={(e) => setNewRequest({...newRequest, notes: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddRequest(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 