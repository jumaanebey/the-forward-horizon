"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "../utils/supabaseClient";

interface Payment {
  id: number;
  resident_id: number;
  amount: number;
  payment_type: 'rent' | 'program_fee' | 'medical' | 'other';
  payment_method: 'cash' | 'check' | 'card' | 'transfer';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  due_date: string;
  paid_date?: string;
  notes?: string;
  created_at: string;
}

interface Resident {
  id: number;
  name: string;
  room_number?: string;
}

interface PaymentTrackingProps {
  resident: Resident | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentTracking({ resident, isOpen, onClose }: PaymentTrackingProps) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddPayment, setShowAddPayment] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const [newPayment, setNewPayment] = useState({
    amount: '',
    payment_type: 'rent' as Payment['payment_type'],
    payment_method: 'cash' as Payment['payment_method'],
    due_date: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen && resident) {
      fetchPayments();
    }
  }, [isOpen, resident]);

  const fetchPayments = async () => {
    if (!resident) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('resident_id', resident.id)
        .order('due_date', { ascending: false });

      if (error) {
        toast.error('Failed to fetch payments');
        return;
      }

      setPayments(data || []);
    } catch (error) {
      toast.error('Error loading payments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resident) return;

    setLoading(true);
    try {
      const paymentData = {
        resident_id: resident.id,
        amount: parseFloat(newPayment.amount),
        payment_type: newPayment.payment_type,
        payment_method: newPayment.payment_method,
        status: 'pending' as Payment['status'],
        due_date: newPayment.due_date,
        notes: newPayment.notes || null
      };

      const { data, error } = await supabase
        .from('payments')
        .insert([paymentData])
        .select();

      if (error) {
        toast.error('Failed to add payment');
        return;
      }

      toast.success('Payment added successfully');
      setNewPayment({
        amount: '',
        payment_type: 'rent',
        payment_method: 'cash',
        due_date: '',
        notes: ''
      });
      setShowAddPayment(false);
      fetchPayments();
    } catch (error) {
      toast.error('Error adding payment');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async (paymentId: number, status: Payment['status']) => {
    setLoading(true);
    try {
      const updateData: any = { status };
      if (status === 'completed') {
        updateData.paid_date = new Date().toISOString();
      }

      const { error } = await supabase
        .from('payments')
        .update(updateData)
        .eq('id', paymentId);

      if (error) {
        toast.error('Failed to update payment');
        return;
      }

      toast.success('Payment status updated');
      fetchPayments();
    } catch (error) {
      toast.error('Error updating payment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async (paymentId: number) => {
    if (!window.confirm('Are you sure you want to delete this payment record?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', paymentId);

      if (error) {
        toast.error('Failed to delete payment');
        return;
      }

      toast.success('Payment deleted successfully');
      fetchPayments();
    } catch (error) {
      toast.error('Error deleting payment');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredPayments = () => {
    return payments.filter(payment => {
      const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
      const matchesType = filterType === 'all' || payment.payment_type === filterType;
      return matchesStatus && matchesType;
    });
  };

  const getTotalOutstanding = () => {
    return payments
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getTotalPaid = () => {
    return payments
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getOverduePayments = () => {
    const today = new Date();
    return payments.filter(p => 
      p.status === 'pending' && new Date(p.due_date) < today
    );
  };

  if (!isOpen) return null;

  const filteredPayments = getFilteredPayments();
  const outstandingAmount = getTotalOutstanding();
  const totalPaid = getTotalPaid();
  const overduePayments = getOverduePayments();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Payment Tracking - {resident?.name}
            </h2>
            <p className="text-gray-600">Room: {resident?.room_number}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Summary Cards */}
        <div className="p-6 border-b bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-600">Total Outstanding</div>
              <div className="text-2xl font-bold text-red-600">${outstandingAmount.toFixed(2)}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-600">Total Paid</div>
              <div className="text-2xl font-bold text-green-600">${totalPaid.toFixed(2)}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-600">Overdue Payments</div>
              <div className="text-2xl font-bold text-orange-600">{overduePayments.length}</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium text-gray-600">Total Payments</div>
              <div className="text-2xl font-bold text-blue-600">{payments.length}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="refunded">Refunded</option>
              </select>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="rent">Rent</option>
                <option value="program_fee">Program Fee</option>
                <option value="medical">Medical</option>
                <option value="other">Other</option>
              </select>
            </div>
            <button
              onClick={() => setShowAddPayment(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add Payment
            </button>
          </div>
        </div>

        {/* Payments Table */}
        <div className="p-6 overflow-y-auto max-h-[40vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading payments...</p>
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              No payments found matching your criteria.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-md overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Type</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Method</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Due Date</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Paid Date</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium">${payment.amount.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          payment.payment_type === 'rent' ? 'bg-blue-100 text-blue-800' :
                          payment.payment_type === 'program_fee' ? 'bg-purple-100 text-purple-800' :
                          payment.payment_type === 'medical' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.payment_type.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2 capitalize">{payment.payment_method}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          payment.status === 'failed' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {new Date(payment.due_date).toLocaleDateString()}
                        {payment.status === 'pending' && new Date(payment.due_date) < new Date() && (
                          <span className="ml-2 text-red-600 text-xs">OVERDUE</span>
                        )}
                      </td>
                      <td className="px-4 py-2">
                        {payment.paid_date ? new Date(payment.paid_date).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-2">
                          {payment.status === 'pending' && (
                            <button
                              onClick={() => handleUpdatePaymentStatus(payment.id, 'completed')}
                              className="px-2 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                            >
                              Mark Paid
                            </button>
                          )}
                          <button
                            onClick={() => handleDeletePayment(payment.id)}
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

        {/* Add Payment Modal */}
        {showAddPayment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Payment</h3>
              <form onSubmit={handleAddPayment} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Type</label>
                  <select
                    required
                    value={newPayment.payment_type}
                    onChange={(e) => setNewPayment({...newPayment, payment_type: e.target.value as Payment['payment_type']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="rent">Rent</option>
                    <option value="program_fee">Program Fee</option>
                    <option value="medical">Medical</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                  <select
                    required
                    value={newPayment.payment_method}
                    onChange={(e) => setNewPayment({...newPayment, payment_method: e.target.value as Payment['payment_method']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="card">Card</option>
                    <option value="transfer">Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newPayment.due_date}
                    onChange={(e) => setNewPayment({...newPayment, due_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newPayment.notes}
                    onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddPayment(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Adding...' : 'Add Payment'}
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