'use client';
import { useState } from 'react';
import StripePaymentForm from './StripePaymentForm';

interface Payment {
  id: number;
  date: string;
  amount: number;
  type: string;
  method: string;
  status: string;
  dueDate: string;
  notes: string;
}

interface PaymentTrackingModalProps {
  resident: any;
  onClose: () => void;
}

export default function PaymentTrackingModal({ resident, onClose }: PaymentTrackingModalProps) {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      date: '2024-01-15',
      amount: 800,
      type: 'Monthly Rent',
      method: 'Cash',
      status: 'Paid',
      dueDate: '2024-01-15',
      notes: 'On time payment'
    },
    {
      id: 2,
      date: '',
      amount: 800,
      type: 'Monthly Rent',
      method: '',
      status: 'Pending',
      dueDate: '2024-02-15',
      notes: 'February rent due'
    },
  ]);

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [showStripePayment, setShowStripePayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [newPayment, setNewPayment] = useState({
    date: '',
    amount: '',
    type: '',
    method: '',
    status: 'Pending',
    dueDate: '',
    notes: ''
  });

  const handleAddPayment = (e: React.FormEvent) => {
    e.preventDefault();
    const payment: Payment = {
      id: Date.now(),
      ...newPayment,
      amount: parseFloat(newPayment.amount)
    };
    setPayments([payment, ...payments]);
    setNewPayment({ 
      date: '', 
      amount: '', 
      type: '', 
      method: '', 
      status: 'Pending', 
      dueDate: '', 
      notes: '' 
    });
    setShowAddPayment(false);
  };

  const markAsPaid = (paymentId: number) => {
    const today = new Date().toISOString().split('T')[0];
    setPayments(payments.map(p => 
      p.id === paymentId 
        ? { ...p, status: 'Paid', date: today }
        : p
    ));
  };

  const handleStripePayment = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowStripePayment(true);
  };

  const handlePaymentSuccess = (paymentResult: any) => {
    if (selectedPayment) {
      const today = new Date().toISOString().split('T')[0];
      setPayments(payments.map(p => 
        p.id === selectedPayment.id 
          ? { ...p, status: 'Paid', date: today, method: 'Card' }
          : p
      ));
    }
    setShowStripePayment(false);
    setSelectedPayment(null);
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    setShowStripePayment(false);
    setSelectedPayment(null);
  };

  const getTotalOwed = () => {
    return payments
      .filter(p => p.status === 'Pending' || p.status === 'Overdue')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getTotalPaid = () => {
    return payments
      .filter(p => p.status === 'Paid')
      .reduce((sum, p) => sum + p.amount, 0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">
            Payment Tracking - {resident.name}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Payment Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-green-700">Total Paid</h3>
              <p className="text-2xl font-bold text-green-900">${getTotalPaid().toFixed(2)}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-yellow-700">Amount Owed</h3>
              <p className="text-2xl font-bold text-yellow-900">${getTotalOwed().toFixed(2)}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-sm font-medium text-blue-700">Payment Method</h3>
              <p className="text-lg font-medium text-blue-900">Cash/Check</p>
            </div>
          </div>

          {/* Add Payment Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddPayment(!showAddPayment)}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              {showAddPayment ? 'Cancel' : 'Add Payment Record'}
            </button>
          </div>

          {/* Add Payment Form */}
          {showAddPayment && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Payment Record</h3>
              <form onSubmit={handleAddPayment} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Payment Type *
                    </label>
                    <select
                      required
                      value={newPayment.type}
                      onChange={(e) => setNewPayment({...newPayment, type: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Type</option>
                      <option value="Monthly Rent">Monthly Rent</option>
                      <option value="Security Deposit">Security Deposit</option>
                      <option value="Program Fee">Program Fee</option>
                      <option value="Medical Fee">Medical Fee</option>
                      <option value="Late Fee">Late Fee</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newPayment.amount}
                      onChange={(e) => setNewPayment({...newPayment, amount: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={newPayment.dueDate}
                      onChange={(e) => setNewPayment({...newPayment, dueDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={newPayment.status}
                      onChange={(e) => setNewPayment({...newPayment, status: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Paid">Paid</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>

                  {newPayment.status === 'Paid' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Date
                        </label>
                        <input
                          type="date"
                          value={newPayment.date}
                          onChange={(e) => setNewPayment({...newPayment, date: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Payment Method
                        </label>
                        <select
                          value={newPayment.method}
                          onChange={(e) => setNewPayment({...newPayment, method: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Method</option>
                          <option value="Cash">Cash</option>
                          <option value="Check">Check</option>
                          <option value="Money Order">Money Order</option>
                          <option value="Bank Transfer">Bank Transfer</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={newPayment.notes}
                    onChange={(e) => setNewPayment({...newPayment, notes: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional notes about this payment..."
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowAddPayment(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                  >
                    Add Payment
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Payment History */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Payment History</h3>
            
            {payments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No payment records found</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Paid Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {payments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.type}</div>
                          {payment.notes && (
                            <div className="text-sm text-gray-500">{payment.notes}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ${payment.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.dueDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.date || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.method || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {payment.status === 'Pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleStripePayment(payment)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Pay with Card
                              </button>
                              <button
                                onClick={() => markAsPaid(payment.id)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Mark Paid
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>

      {/* Stripe Payment Modal */}
      {showStripePayment && selectedPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Pay with Card</h3>
              <button
                onClick={() => setShowStripePayment(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <StripePaymentForm
              amount={selectedPayment.amount}
              residentId={resident.id || '1'}
              residentName={resident.name || 'Resident'}
              paymentType={selectedPayment.type}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              onCancel={() => setShowStripePayment(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}