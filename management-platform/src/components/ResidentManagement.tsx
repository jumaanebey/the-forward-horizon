'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  User, 
  DollarSign,
  Phone,
  Mail,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Eye,
  UserCheck,
  Building,
  Calendar
} from 'lucide-react';

interface Resident {
  id: string;
  residentId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  status: 'active' | 'graduated' | 'exited' | 'suspended';
  program: 'transitional' | 'permanent' | 'emergency';
  unit: string;
  moveInDate: string;
  caseManager: string;
  monthlyRent: number;
  rentPaid: boolean;
  notes: string;
  riskScore: number;
  progressScore: number;
}

export default function ResidentManagement() {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showAddResident, setShowAddResident] = useState(false);

  useEffect(() => {
    setResidents([
      {
        id: '1',
        residentId: 'FH-2024-001',
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        status: 'active',
        program: 'transitional',
        unit: 'A-101',
        moveInDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        caseManager: 'Sarah Johnson',
        monthlyRent: 450,
        rentPaid: true,
        notes: 'Making excellent progress, attending all counseling sessions',
        riskScore: 25,
        progressScore: 85
      },
      {
        id: '2',
        residentId: 'FH-2024-002',
        firstName: 'Maria',
        lastName: 'Garcia',
        email: 'maria.garcia@email.com',
        phone: '(555) 234-5678',
        status: 'active',
        program: 'transitional',
        unit: 'B-205',
        moveInDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        caseManager: 'Mike Chen',
        monthlyRent: 450,
        rentPaid: false,
        notes: 'Single mother with two children, needs childcare support',
        riskScore: 45,
        progressScore: 70
      }
    ]);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'graduated': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'exited': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'suspended': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredResidents = residents.filter(resident => {
    const matchesSearch = 
      resident.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resident.residentId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || resident.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const residentStats = {
    total: residents.length,
    active: residents.filter(r => r.status === 'active').length,
    graduated: residents.filter(r => r.status === 'graduated').length,
    rentOverdue: residents.filter(r => r.status === 'active' && !r.rentPaid).length
  };

  const handleAddResident = () => {
    setShowAddResident(true);
  };

  const handleViewResident = (residentId: string) => {
    console.log('View resident:', residentId);
    // Could open a modal or navigate to resident details
  };

  const handleEditResident = (residentId: string) => {
    console.log('Edit resident:', residentId);
    // Could open edit modal
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Resident Management</h2>
          <p className="text-gray-600">Manage current and former residents</p>
        </div>
        <Button className="flex items-center space-x-2" onClick={handleAddResident}>
          <Plus className="w-4 h-4" />
          <span>Add Resident</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Residents</p>
                <p className="text-2xl font-bold">{residentStats.total}</p>
              </div>
              <User className="w-8 h-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-green-600">{residentStats.active}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Graduated</p>
                <p className="text-2xl font-bold text-blue-600">{residentStats.graduated}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rent Overdue</p>
                <p className="text-2xl font-bold text-red-600">{residentStats.rentOverdue}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by name, ID, or unit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="graduated">Graduated</option>
            <option value="exited">Exited</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Residents ({filteredResidents.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredResidents.map((resident) => (
              <div key={resident.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-medium">{resident.firstName} {resident.lastName}</h3>
                      <Badge variant="outline" className="text-xs font-mono">
                        {resident.residentId}
                      </Badge>
                      <Badge className={getStatusColor(resident.status)} variant="outline">
                        {resident.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Building className="w-3 h-3" />
                          <span>Unit: {resident.unit}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <User className="w-3 h-3" />
                          <span>CM: {resident.caseManager}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <DollarSign className="w-3 h-3" />
                          <span>Rent: ${resident.monthlyRent}/month</span>
                          {!resident.rentPaid && <AlertTriangle className="w-3 h-3 text-red-500" />}
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Calendar className="w-3 h-3" />
                          <span>Move-in: {new Date(resident.moveInDate).toLocaleDateString()}</span>
                        </div>
                        {resident.email && (
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Mail className="w-3 h-3" />
                            <span>{resident.email}</span>
                          </div>
                        )}
                        {resident.phone && (
                          <div className="flex items-center space-x-1 text-sm text-gray-600">
                            <Phone className="w-3 h-3" />
                            <span>{resident.phone}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {resident.notes && (
                      <p className="text-gray-600 text-sm mb-2">{resident.notes}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleViewResident(resident.id)}>
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleEditResident(resident.id)}>
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => console.log('More options for', resident.id)}>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}