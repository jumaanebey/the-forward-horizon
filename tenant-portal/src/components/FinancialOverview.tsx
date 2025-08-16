'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DollarSign, 
  TrendingUp,
  TrendingDown,
  Calendar,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Search,
  Download,
  Plus,
  FileText,
  Building,
  Users
} from 'lucide-react';

interface FinancialData {
  revenue: {
    monthly: number;
    quarterly: number;
    yearly: number;
    trend: number;
  };
  expenses: {
    monthly: number;
    quarterly: number;
    yearly: number;
    trend: number;
  };
  rentCollection: {
    collected: number;
    pending: number;
    overdue: number;
    rate: number;
  };
  occupancy: {
    total: number;
    occupied: number;
    vacant: number;
    rate: number;
  };
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
  residentId?: string;
  residentName?: string;
}

export default function FinancialOverview() {
  const [financialData, setFinancialData] = useState<FinancialData>({
    revenue: { monthly: 0, quarterly: 0, yearly: 0, trend: 0 },
    expenses: { monthly: 0, quarterly: 0, yearly: 0, trend: 0 },
    rentCollection: { collected: 0, pending: 0, overdue: 0, rate: 0 },
    occupancy: { total: 0, occupied: 0, vacant: 0, rate: 0 }
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  useEffect(() => {
    // Load demo financial data
    setFinancialData({
      revenue: {
        monthly: 18450,
        quarterly: 55350,
        yearly: 221400,
        trend: 8.5
      },
      expenses: {
        monthly: 12680,
        quarterly: 38040,
        yearly: 152160,
        trend: -3.2
      },
      rentCollection: {
        collected: 16200,
        pending: 1350,
        overdue: 900,
        rate: 87.8
      },
      occupancy: {
        total: 45,
        occupied: 41,
        vacant: 4,
        rate: 91.1
      }
    });

    // Load demo transactions
    setTransactions([
      {
        id: '1',
        type: 'income',
        category: 'Rent Payment',
        amount: 450,
        description: 'Monthly rent payment',
        date: new Date().toISOString(),
        status: 'completed',
        residentId: 'FH-2024-001',
        residentName: 'John Smith'
      },
      {
        id: '2',
        type: 'income',
        category: 'Rent Payment',
        amount: 450,
        description: 'Monthly rent payment',
        date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        residentId: 'FH-2024-002',
        residentName: 'Maria Garcia'
      },
      {
        id: '3',
        type: 'expense',
        category: 'Maintenance',
        amount: 285,
        description: 'Plumbing repair - Unit A-101',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed'
      },
      {
        id: '4',
        type: 'expense',
        category: 'Utilities',
        amount: 1200,
        description: 'Monthly electricity bill',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed'
      },
      {
        id: '5',
        type: 'income',
        category: 'Grant',
        amount: 5000,
        description: 'Federal housing assistance grant',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed'
      },
      {
        id: '6',
        type: 'expense',
        category: 'Staff',
        amount: 3200,
        description: 'Staff payroll - Case managers',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed'
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'rent payment': return <Building className="w-4 h-4" />;
      case 'grant': return <FileText className="w-4 h-4" />;
      case 'maintenance': return <Building className="w-4 h-4" />;
      case 'utilities': return <Building className="w-4 h-4" />;
      case 'staff': return <Users className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.residentName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || transaction.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const netIncome = financialData.revenue.monthly - financialData.expenses.monthly;
  const profitMargin = ((netIncome / financialData.revenue.monthly) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Financial Overview</h2>
          <p className="text-gray-600">Monitor revenue, expenses, and financial health</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Transaction</span>
          </Button>
        </div>
      </div>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold">${financialData.revenue.monthly.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">+{financialData.revenue.trend}%</span>
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Expenses</p>
                <p className="text-2xl font-bold">${financialData.expenses.monthly.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <TrendingDown className="w-3 h-3 text-green-500 mr-1" />
                  <span className="text-xs text-green-600">{financialData.expenses.trend}%</span>
                </div>
              </div>
              <CreditCard className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Net Income</p>
                <p className="text-2xl font-bold text-green-600">${netIncome.toLocaleString()}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-600">Margin: {profitMargin.toFixed(1)}%</span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Occupancy Rate</p>
                <p className="text-2xl font-bold">{financialData.occupancy.rate}%</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-gray-600">{financialData.occupancy.occupied}/{financialData.occupancy.total} units</span>
                </div>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rent Collection Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rent Collection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Collected</span>
                </div>
                <span className="font-semibold">${financialData.rentCollection.collected.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-yellow-500" />
                  <span>Pending</span>
                </div>
                <span className="font-semibold">${financialData.rentCollection.pending.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span>Overdue</span>
                </div>
                <span className="font-semibold text-red-600">${financialData.rentCollection.overdue.toLocaleString()}</span>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Collection Rate</span>
                  <span className="font-bold text-lg">{financialData.rentCollection.rate}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>Rent Revenue</span>
                <span className="font-semibold">${(financialData.revenue.monthly * 0.85).toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Grants & Funding</span>
                <span className="font-semibold">${(financialData.revenue.monthly * 0.15).toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Utilities</span>
                <span className="font-semibold text-red-600">-${(financialData.expenses.monthly * 0.35).toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Staff Costs</span>
                <span className="font-semibold text-red-600">-${(financialData.expenses.monthly * 0.45).toLocaleString()}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span>Maintenance</span>
                <span className="font-semibold text-red-600">-${(financialData.expenses.monthly * 0.2).toLocaleString()}</span>
              </div>
              
              <div className="pt-2 border-t">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Net Result</span>
                  <span className={`font-bold text-lg ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {netIncome >= 0 ? '+' : ''}${netIncome.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">All Types</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {getCategoryIcon(transaction.category)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">{transaction.description}</span>
                      <Badge className={getStatusColor(transaction.status)} variant="outline">
                        {transaction.status}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{transaction.category}</span>
                      {transaction.residentName && (
                        <>
                          <span>•</span>
                          <span>{transaction.residentName}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}

            {filteredTransactions.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No transactions found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}