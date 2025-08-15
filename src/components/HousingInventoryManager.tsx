'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Home, Users, DollarSign, MapPin, Calendar, CheckCircle, AlertCircle } from 'lucide-react';

interface Property {
  id: string;
  name: string;
  address: string;
  propertyType: 'house' | 'apartment' | 'duplex' | 'townhouse';
  totalUnits: number;
  occupiedUnits: number;
  monthlyRent: number;
  programTypes: string[];
  amenities: string[];
  status: 'active' | 'maintenance' | 'full' | 'inactive';
  owner: string;
  contactPhone: string;
  contactEmail: string;
  lastInspection: string;
  nextInspection: string;
  notes: string;
}

interface Room {
  id: string;
  propertyId: string;
  roomNumber: string;
  bedCount: number;
  roomType: 'single' | 'double' | 'triple' | 'quad';
  monthlyRate: number;
  programType: 'veterans' | 'recovery' | 'reentry' | 'general';
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  amenities: string[];
  accessibilityFeatures: string[];
}

export default function HousingInventoryManager() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [filter, setFilter] = useState('all');

  // Sample data
  useEffect(() => {
    const sampleProperties: Property[] = [
      {
        id: '1',
        name: 'Main Recovery House',
        address: '123 Recovery Way, Los Angeles, CA 90210',
        propertyType: 'house',
        totalUnits: 12,
        occupiedUnits: 8,
        monthlyRent: 800,
        programTypes: ['recovery', 'reentry'],
        amenities: ['Kitchen', 'Laundry', 'Common Area', 'WiFi', 'Backyard'],
        status: 'active',
        owner: 'Forward Horizon LLC',
        contactPhone: '(555) 123-4567',
        contactEmail: 'maintenance@forwardhorizon.com',
        lastInspection: '2024-01-15',
        nextInspection: '2024-04-15',
        notes: 'Well-maintained property with good community atmosphere'
      },
      {
        id: '2',
        name: 'Veterans Annex',
        address: '124 Recovery Way, Los Angeles, CA 90210',
        propertyType: 'house',
        totalUnits: 8,
        occupiedUnits: 6,
        monthlyRent: 850,
        programTypes: ['veterans'],
        amenities: ['Kitchen', 'Laundry', 'Veterans Lounge', 'WiFi', 'Garden'],
        status: 'active',
        owner: 'Forward Horizon LLC',
        contactPhone: '(555) 123-4568',
        contactEmail: 'veterans@forwardhorizon.com',
        lastInspection: '2024-01-20',
        nextInspection: '2024-04-20',
        notes: 'Specialized facility for veteran residents'
      },
      {
        id: '3',
        name: 'Transitional Housing Complex',
        address: '125 Recovery Way, Los Angeles, CA 90210',
        propertyType: 'apartment',
        totalUnits: 6,
        occupiedUnits: 4,
        monthlyRent: 750,
        programTypes: ['reentry', 'general'],
        amenities: ['Kitchen', 'Laundry', 'Study Room', 'WiFi', 'Parking'],
        status: 'active',
        owner: 'Forward Horizon LLC',
        contactPhone: '(555) 123-4569',
        contactEmail: 'transitional@forwardhorizon.com',
        lastInspection: '2024-01-25',
        nextInspection: '2024-04-25',
        notes: 'Focus on reentry and transitional support'
      }
    ];

    const sampleRooms: Room[] = [
      {
        id: '1',
        propertyId: '1',
        roomNumber: '101',
        bedCount: 2,
        roomType: 'double',
        monthlyRate: 800,
        programType: 'recovery',
        status: 'occupied',
        amenities: ['Private Bathroom', 'Closet', 'Desk'],
        accessibilityFeatures: []
      },
      {
        id: '2',
        propertyId: '1',
        roomNumber: '102',
        bedCount: 1,
        roomType: 'single',
        monthlyRate: 1000,
        programType: 'recovery',
        status: 'available',
        amenities: ['Private Bathroom', 'Closet', 'Desk'],
        accessibilityFeatures: ['Wheelchair Accessible']
      },
      {
        id: '3',
        propertyId: '2',
        roomNumber: '201',
        bedCount: 2,
        roomType: 'double',
        monthlyRate: 850,
        programType: 'veterans',
        status: 'occupied',
        amenities: ['Private Bathroom', 'Closet', 'Desk', 'Veteran Resources'],
        accessibilityFeatures: []
      }
    ];

    setProperties(sampleProperties);
    setRooms(sampleRooms);
  }, []);

  const getOccupancyRate = (property: Property) => {
    return Math.round((property.occupiedUnits / property.totalUnits) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'full': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoomStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'occupied': return 'bg-blue-100 text-blue-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'reserved': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true;
    if (filter === 'active') return property.status === 'active';
    if (filter === 'maintenance') return property.status === 'maintenance';
    if (filter === 'full') return property.status === 'full';
    return property.programTypes.includes(filter);
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Housing Inventory Management</h1>
            <p className="text-gray-600 mt-2">Manage properties, rooms, and occupancy across all Forward Horizon facilities</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowAddRoom(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Room</span>
            </button>
            <button
              onClick={() => setShowAddProperty(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Property</span>
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Home className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-gray-900">{properties.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Units</p>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.reduce((sum, p) => sum + p.totalUnits, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Occupied Units</p>
                <p className="text-2xl font-bold text-gray-900">
                  {properties.reduce((sum, p) => sum + p.occupiedUnits, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg. Monthly Rent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${Math.round(properties.reduce((sum, p) => sum + p.monthlyRent, 0) / properties.length)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Properties
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('maintenance')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'maintenance' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Maintenance
            </button>
            <button
              onClick={() => setFilter('veterans')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'veterans' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Veterans
            </button>
            <button
              onClick={() => setFilter('recovery')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'recovery' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Recovery
            </button>
            <button
              onClick={() => setFilter('reentry')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                filter === 'reentry' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Reentry
            </button>
          </div>
        </div>

        {/* Properties Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div key={property.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
                    <p className="text-sm text-gray-600 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.address}
                    </p>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(property.status)}`}>
                    {property.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Units</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {property.occupiedUnits}/{property.totalUnits}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Occupancy</p>
                    <p className="text-lg font-semibold text-gray-900">{getOccupancyRate(property)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Rent</p>
                    <p className="text-lg font-semibold text-gray-900">${property.monthlyRent}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="text-lg font-semibold text-gray-900 capitalize">{property.propertyType}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Programs:</p>
                  <div className="flex flex-wrap gap-1">
                    {property.programTypes.map((program) => (
                      <span key={program} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {program}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {property.amenities.slice(0, 3).map((amenity) => (
                      <span key={amenity} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {amenity}
                      </span>
                    ))}
                    {property.amenities.length > 3 && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        +{property.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <span>Next Inspection: {property.nextInspection}</span>
                  <span>Owner: {property.owner}</span>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedProperty(property)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    View Details
                  </button>
                  <button className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                    <Edit className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Property Details Modal */}
        {selectedProperty && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedProperty.name}</h2>
                  <button
                    onClick={() => setSelectedProperty(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Property Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Information</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Address</p>
                        <p className="text-gray-900">{selectedProperty.address}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Contact</p>
                        <p className="text-gray-900">{selectedProperty.contactPhone}</p>
                        <p className="text-gray-900">{selectedProperty.contactEmail}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Notes</p>
                        <p className="text-gray-900">{selectedProperty.notes}</p>
                      </div>
                    </div>
                  </div>

                  {/* Rooms */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Rooms</h3>
                    <div className="space-y-3">
                      {rooms
                        .filter(room => room.propertyId === selectedProperty.id)
                        .map(room => (
                          <div key={room.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center mb-2">
                              <h4 className="font-medium text-gray-900">Room {room.roomNumber}</h4>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoomStatusColor(room.status)}`}>
                                {room.status}
                              </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600">Type:</span> {room.roomType}
                              </div>
                              <div>
                                <span className="text-gray-600">Beds:</span> {room.bedCount}
                              </div>
                              <div>
                                <span className="text-gray-600">Rate:</span> ${room.monthlyRate}
                              </div>
                              <div>
                                <span className="text-gray-600">Program:</span> {room.programType}
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
