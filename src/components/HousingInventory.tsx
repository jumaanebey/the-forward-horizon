'use client';
import { useState, useEffect } from 'react';
import { housingAPI, House as DBHouse, Room as DBRoom, WaitlistEntry as DBWaitlistEntry } from '@/lib/supabase';

interface Room {
  id: string;
  room_number: string;
  house_name: string;
  bed_count: number;
  occupied_beds: number;
  room_type: 'single' | 'double' | 'triple' | 'quad';
  amenities: string[];
  status: 'available' | 'occupied' | 'maintenance' | 'reserved';
  monthly_rate: number;
  program_type: 'veterans' | 'recovery' | 'reentry' | 'general';
  accessibility_features?: string[];
  last_updated: string;
}

interface House {
  id: string;
  name: string;
  address: string;
  total_beds: number;
  occupied_beds: number;
  available_beds: number;
  rooms: Room[];
  house_type: 'main' | 'annex' | 'transitional';
  amenities: string[];
  status: 'operational' | 'preparation' | 'maintenance';
}

interface UpcomingAvailability {
  id: string;
  room_number: string;
  house_name: string;
  expected_date: string;
  bed_count: number;
  reason: 'graduation' | 'discharge' | 'transfer' | 'new_unit';
  priority: 'high' | 'medium' | 'low';
}

interface WaitlistEntry {
  id: string;
  name: string;
  program_type: string;
  requested_date: string;
  priority_score: number;
  special_needs?: string[];
  contact_info: string;
  status: 'active' | 'contacted' | 'scheduled' | 'inactive';
}

export default function HousingInventory() {
  const [houses, setHouses] = useState<House[]>([]);
  const [upcomingAvailability, setUpcomingAvailability] = useState<UpcomingAvailability[]>([]);
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedHouse, setSelectedHouse] = useState<string | null>(null);

  useEffect(() => {
    loadInventoryData();
  }, []);

  const transformSupabaseData = (roomsData: any[]): House[] => {
    // Group rooms by house
    const housesMap = new Map();
    
    roomsData.forEach((room: any) => {
      const houseKey = room.houses?.name || 'Forward Horizon Main House';
      
      if (!housesMap.has(houseKey)) {
        housesMap.set(houseKey, {
          id: room.house_id || '1',
          name: houseKey,
          address: '123 Recovery Way, Pasadena, CA 91101',
          total_beds: 0,
          occupied_beds: 0,
          available_beds: 0,
          house_type: 'main' as const,
          status: 'preparation' as const,
          amenities: [
            'Common Kitchen',
            'Living Room', 
            'Laundry Facilities',
            'Study Room',
            'Garden/Patio',
            'Parking',
            'Security System'
          ],
          rooms: []
        });
      }
      
      const house = housesMap.get(houseKey);
      const occupiedBeds = room.room_assignments?.filter((a: any) => a.status === 'active').length || 0;
      
      house.rooms.push({
        id: room.id,
        room_number: room.room_number,
        house_name: houseKey,
        bed_count: room.bed_count,
        occupied_beds: occupiedBeds,
        room_type: room.room_type,
        amenities: room.amenities || [],
        status: room.status,
        monthly_rate: room.monthly_rate,
        program_type: room.program_type,
        accessibility_features: room.accessibility_features,
        last_updated: room.updated_at
      });
      
      house.total_beds += room.bed_count;
      house.occupied_beds += occupiedBeds;
    });
    
    // Calculate available beds
    housesMap.forEach((house) => {
      house.available_beds = house.total_beds - house.occupied_beds;
    });
    
    return Array.from(housesMap.values());
  };

  const loadInventoryData = async () => {
    setLoading(true);
    
    try {
      // Try to load data from Supabase first
      const [housesData, waitlistData] = await Promise.all([
        housingAPI.getRoomsWithOccupancy(),
        housingAPI.getWaitlist()
      ]);

      if (housesData && housesData.length > 0) {
        // Transform Supabase data to component format
        const transformedHouses = transformSupabaseData(housesData);
        setHouses(transformedHouses);
        setWaitlist(waitlistData || []);
        
        // For upcoming availability, simulate based on current status
        const upcoming: UpcomingAvailability[] = [{
          id: '1',
          room_number: 'All Rooms',
          house_name: 'Forward Horizon Main House',
          expected_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          bed_count: 24,
          reason: 'new_unit',
          priority: 'high'
        }];
        setUpcomingAvailability(upcoming);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.log('Supabase not configured yet, using mock data:', error);
    }
    
    // Fallback to mock data for startup phase
    setTimeout(() => {
      const mockHouses: House[] = [
        {
          id: '1',
          name: 'Forward Horizon Main House',
          address: '123 Recovery Way, Pasadena, CA 91101',
          total_beds: 24,
          occupied_beds: 0,
          available_beds: 24,
          house_type: 'main',
          status: 'preparation',
          amenities: [
            'Common Kitchen',
            'Living Room',
            'Laundry Facilities',
            'Study Room',
            'Garden/Patio',
            'Parking',
            'Security System'
          ],
          rooms: [
            {
              id: '101',
              room_number: 'A-101',
              house_name: 'Forward Horizon Main House',
              bed_count: 2,
              occupied_beds: 0,
              room_type: 'double',
              amenities: ['Private Bathroom', 'AC/Heat', 'Window'],
              status: 'available',
              monthly_rate: 800,
              program_type: 'veterans',
              accessibility_features: ['Ground Floor'],
              last_updated: new Date().toISOString()
            },
            {
              id: '102',
              room_number: 'A-102',
              house_name: 'Forward Horizon Main House',
              bed_count: 2,
              occupied_beds: 0,
              room_type: 'double',
              amenities: ['Private Bathroom', 'AC/Heat', 'Window'],
              status: 'available',
              monthly_rate: 800,
              program_type: 'veterans',
              accessibility_features: ['Ground Floor'],
              last_updated: new Date().toISOString()
            },
            {
              id: '201',
              room_number: 'B-201',
              house_name: 'Forward Horizon Main House',
              bed_count: 2,
              occupied_beds: 0,
              room_type: 'double',
              amenities: ['Private Bathroom', 'AC/Heat', 'Window'],
              status: 'available',
              monthly_rate: 750,
              program_type: 'recovery',
              last_updated: new Date().toISOString()
            },
            {
              id: '202',
              room_number: 'B-202',
              house_name: 'Forward Horizon Main House',
              bed_count: 2,
              occupied_beds: 0,
              room_type: 'double',
              amenities: ['Private Bathroom', 'AC/Heat', 'Window'],
              status: 'available',
              monthly_rate: 750,
              program_type: 'recovery',
              last_updated: new Date().toISOString()
            },
            {
              id: '301',
              room_number: 'C-301',
              house_name: 'Forward Horizon Main House',
              bed_count: 2,
              occupied_beds: 0,
              room_type: 'double',
              amenities: ['Private Bathroom', 'AC/Heat', 'Window'],
              status: 'available',
              monthly_rate: 725,
              program_type: 'reentry',
              last_updated: new Date().toISOString()
            },
            {
              id: '302',
              room_number: 'C-302',
              house_name: 'Forward Horizon Main House',
              bed_count: 2,
              occupied_beds: 0,
              room_type: 'double',
              amenities: ['Private Bathroom', 'AC/Heat', 'Window'],
              status: 'available',
              monthly_rate: 725,
              program_type: 'reentry',
              last_updated: new Date().toISOString()
            },
            {
              id: '401',
              room_number: 'D-401',
              house_name: 'Forward Horizon Main House',
              bed_count: 2,
              occupied_beds: 0,
              room_type: 'double',
              amenities: ['Private Bathroom', 'AC/Heat', 'Window'],
              status: 'available',
              monthly_rate: 700,
              program_type: 'general',
              last_updated: new Date().toISOString()
            },
            {
              id: '402',
              room_number: 'D-402',
              house_name: 'Forward Horizon Main House',
              bed_count: 2,
              occupied_beds: 0,
              room_type: 'double',
              amenities: ['Private Bathroom', 'AC/Heat', 'Window'],
              status: 'available',
              monthly_rate: 700,
              program_type: 'general',
              last_updated: new Date().toISOString()
            },
            {
              id: '501',
              room_number: 'E-501',
              house_name: 'Forward Horizon Main House',
              bed_count: 1,
              occupied_beds: 0,
              room_type: 'single',
              amenities: ['Private Bathroom', 'AC/Heat', 'Window', 'Desk'],
              status: 'available',
              monthly_rate: 950,
              program_type: 'veterans',
              accessibility_features: ['ADA Compliant'],
              last_updated: new Date().toISOString()
            },
            {
              id: '502',
              room_number: 'E-502',
              house_name: 'Forward Horizon Main House',
              bed_count: 1,
              occupied_beds: 0,
              room_type: 'single',
              amenities: ['Private Bathroom', 'AC/Heat', 'Window', 'Desk'],
              status: 'available',
              monthly_rate: 950,
              program_type: 'veterans',
              accessibility_features: ['ADA Compliant'],
              last_updated: new Date().toISOString()
            },
            {
              id: '503',
              room_number: 'E-503',
              house_name: 'Forward Horizon Main House',
              bed_count: 3,
              occupied_beds: 0,
              room_type: 'triple',
              amenities: ['Shared Bathroom', 'AC/Heat', 'Window'],
              status: 'available',
              monthly_rate: 600,
              program_type: 'general',
              last_updated: new Date().toISOString()
            },
            {
              id: '504',
              room_number: 'E-504',
              house_name: 'Forward Horizon Main House',
              bed_count: 3,
              occupied_beds: 0,
              room_type: 'triple',
              amenities: ['Shared Bathroom', 'AC/Heat', 'Window'],
              status: 'available',
              monthly_rate: 600,
              program_type: 'general',
              last_updated: new Date().toISOString()
            }
          ]
        }
      ];

      const mockUpcoming: UpcomingAvailability[] = [
        {
          id: '1',
          room_number: 'All Rooms',
          house_name: 'Forward Horizon Main House',
          expected_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          bed_count: 24,
          reason: 'new_unit',
          priority: 'high'
        }
      ];

      const mockWaitlist: WaitlistEntry[] = [
        {
          id: '1',
          name: 'James M. (Veteran)',
          program_type: 'Veterans Recovery',
          requested_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority_score: 85,
          special_needs: ['PTSD Support', 'Job Placement'],
          contact_info: 'Contact via marketing leads',
          status: 'active'
        },
        {
          id: '2',
          name: 'Maria R. (Recovery)',
          program_type: 'Recovery Housing',
          requested_date: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority_score: 78,
          special_needs: ['Women-Only Space'],
          contact_info: 'Contact via marketing leads',
          status: 'active'
        },
        {
          id: '3',
          name: 'Robert K. (Re-entry)',
          program_type: 'Re-entry Support',
          requested_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority_score: 72,
          special_needs: ['Job Training', 'Legal Aid'],
          contact_info: 'Contact via marketing leads',
          status: 'active'
        }
      ];

      setHouses(mockHouses);
      setUpcomingAvailability(mockUpcoming);
      setWaitlist(mockWaitlist);
      setLoading(false);
    }, 1000);
  };

  const getOccupancyRate = (house: House) => {
    return house.total_beds > 0 ? ((house.occupied_beds / house.total_beds) * 100).toFixed(1) : '0.0';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'occupied': return 'bg-blue-500';
      case 'maintenance': return 'bg-yellow-500';
      case 'reserved': return 'bg-purple-500';
      case 'preparation': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getHouseStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100';
      case 'preparation': return 'text-orange-600 bg-orange-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgramTypeColor = (programType: string) => {
    switch (programType) {
      case 'veterans': return 'text-blue-600 bg-blue-100';
      case 'recovery': return 'text-green-600 bg-green-100';
      case 'reentry': return 'text-purple-600 bg-purple-100';
      case 'general': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow h-32"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const totalBeds = houses.reduce((sum, house) => sum + house.total_beds, 0);
  const totalOccupied = houses.reduce((sum, house) => sum + house.occupied_beds, 0);
  const totalAvailable = totalBeds - totalOccupied;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Housing Inventory</h1>
        <p className="text-gray-600">Manage housing units, bed availability, and capacity planning</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-lg">🏠</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Beds</p>
              <p className="text-2xl font-semibold text-gray-900">{totalBeds}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-lg">✅</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Available</p>
              <p className="text-2xl font-semibold text-gray-900">{totalAvailable}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-lg">📋</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Waitlist</p>
              <p className="text-2xl font-semibold text-gray-900">{waitlist.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <span className="text-orange-600 text-lg">⏰</span>
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Opening Soon</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingAvailability.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'houses', name: 'Housing Units', icon: '🏠' },
            { id: 'rooms', name: 'Room Details', icon: '🚪' },
            { id: 'waitlist', name: 'Waitlist', icon: '📋' },
            { id: 'upcoming', name: 'Upcoming Availability', icon: '📅' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Facility Status */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Facility Status</h3>
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-orange-600 text-xl">🏗️</span>
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-orange-900">Pre-Opening Phase</h4>
                  <p className="text-sm text-orange-700 mt-1">
                    Forward Horizon is currently preparing for opening. All 24 beds are available for reservation. 
                    Marketing campaigns are active and building a waitlist of qualified candidates.
                  </p>
                  <div className="mt-3">
                    <p className="text-xs text-orange-600">
                      Expected Opening: Next 30-45 days | License Application: In Progress
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bed Availability Grid */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Bed Availability Overview</h3>
            <div className="space-y-6">
              {houses.map((house) => (
                <div key={house.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-900">{house.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getHouseStatusColor(house.status)}`}>
                      {house.status.charAt(0).toUpperCase() + house.status.slice(1)}
                    </span>
                  </div>

                  {/* Room Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {house.rooms.map((room) => (
                      <div key={room.id} className={`border rounded-lg p-3 ${
                        room.status === 'available' ? 'border-green-200 bg-green-50' :
                        room.status === 'occupied' ? 'border-red-200 bg-red-50' :
                        room.status === 'maintenance' ? 'border-yellow-200 bg-yellow-50' :
                        'border-purple-200 bg-purple-50'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-900">{room.room_number}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgramTypeColor(room.program_type)}`}>
                            {room.program_type.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-gray-500">{room.room_type}</span>
                          <span className="text-xs font-medium">${room.monthly_rate}</span>
                        </div>
                        
                        {/* Bed indicators */}
                        <div className="flex items-center space-x-1 mb-2">
                          {Array.from({ length: room.bed_count }, (_, i) => (
                            <div
                              key={i}
                              className={`w-4 h-4 rounded border-2 ${
                                i < room.occupied_beds 
                                  ? 'bg-red-400 border-red-500' 
                                  : 'bg-white border-green-500'
                              }`}
                              title={`Bed ${i + 1}: ${i < room.occupied_beds ? 'Occupied' : 'Available'}`}
                            />
                          ))}
                        </div>
                        
                        <div className="text-xs text-gray-600">
                          {room.bed_count - room.occupied_beds} of {room.bed_count} available
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Summary */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div className="text-center">
                        <p className="text-gray-500">Total Beds</p>
                        <p className="font-semibold text-lg">{house.total_beds}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Available</p>
                        <p className="font-semibold text-lg text-green-600">{house.available_beds}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Occupancy</p>
                        <p className="font-semibold text-lg">{getOccupancyRate(house)}%</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Legend</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-white border-2 border-green-500 rounded"></div>
                <span className="text-sm text-gray-600">Available Bed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-400 border-2 border-red-500 rounded"></div>
                <span className="text-sm text-gray-600">Occupied Bed</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">V</span>
                <span className="text-sm text-gray-600">Veterans Program</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">R</span>
                <span className="text-sm text-gray-600">Recovery Program</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'houses' && (
        <div className="space-y-6">
          {houses.map((house) => (
            <div key={house.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{house.name}</h3>
                  <p className="text-sm text-gray-500">{house.address}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getHouseStatusColor(house.status)}`}>
                  {house.status.charAt(0).toUpperCase() + house.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Capacity Overview</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Total Beds:</span>
                      <span className="text-sm font-medium">{house.total_beds}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Available:</span>
                      <span className="text-sm font-medium text-green-600">{house.available_beds}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Occupancy Rate:</span>
                      <span className="text-sm font-medium">{getOccupancyRate(house)}%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {house.amenities.map((amenity, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'rooms' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Room Details</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Room
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Beds
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amenities
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {houses.flatMap(house => house.rooms).map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{room.room_number}</div>
                        <div className="text-sm text-gray-500">{room.house_name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {room.room_type.charAt(0).toUpperCase() + room.room_type.slice(1)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-900">{room.occupied_beds}/{room.bed_count}</span>
                        <div className="flex space-x-1">
                          {Array.from({ length: room.bed_count }, (_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < room.occupied_beds 
                                  ? 'bg-red-400' 
                                  : 'bg-green-400'
                              }`}
                              title={i < room.occupied_beds ? 'Occupied' : 'Available'}
                            />
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getProgramTypeColor(room.program_type)}`}>
                        {room.program_type.charAt(0).toUpperCase() + room.program_type.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${room.monthly_rate}/month
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(room.status)}`}>
                        {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {room.amenities.slice(0, 2).map((amenity, index) => (
                          <span key={index} className="px-1 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 2 && (
                          <span className="px-1 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                            +{room.amenities.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'waitlist' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Current Waitlist</h3>
            <p className="text-sm text-gray-500 mt-1">Prospective residents from marketing campaigns</p>
          </div>
          <div className="divide-y divide-gray-200">
            {waitlist.map((entry) => (
              <div key={entry.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h4 className="text-sm font-medium text-gray-900">{entry.name}</h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Priority: {entry.priority_score}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{entry.program_type}</p>
                    <div className="mt-2">
                      <p className="text-xs text-gray-500">
                        Requested Date: {new Date(entry.requested_date).toLocaleDateString()}
                      </p>
                      {entry.special_needs && (
                        <div className="mt-1">
                          <span className="text-xs text-gray-500">Special Needs: </span>
                          {entry.special_needs.map((need, index) => (
                            <span key={index} className="inline-block px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded mr-1">
                              {need}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entry.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'upcoming' && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Availability</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingAvailability.map((item) => (
              <div key={item.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">{item.house_name}</h4>
                    <p className="text-sm text-gray-500">{item.room_number}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Expected: {new Date(item.expected_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{item.bed_count} beds</p>
                    <p className="text-xs text-gray-500 capitalize">{item.reason.replace('_', ' ')}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      item.priority === 'high' ? 'bg-red-100 text-red-800' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}