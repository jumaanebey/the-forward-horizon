'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-hot-toast';

interface Room {
  id: string;
  room_number: string;
  building?: string;
  floor?: number;
  room_type: string;
  capacity: number;
  current_occupancy: number;
  status: string;
  amenities?: string[];
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface Resident {
  id: string;
  name: string;
  room_id?: string;
}

export default function RoomManager() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    room_number: '',
    building: '',
    floor: 1,
    room_type: 'standard',
    capacity: 1,
    status: 'available',
    amenities: [] as string[],
    notes: ''
  });

  const roomTypes = [
    'standard',
    'private',
    'shared',
    'medical',
    'isolation'
  ];

  const roomStatuses = [
    { value: 'available', label: 'Available', color: 'bg-green-100 text-green-800' },
    { value: 'occupied', label: 'Occupied', color: 'bg-blue-100 text-blue-800' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'reserved', label: 'Reserved', color: 'bg-purple-100 text-purple-800' }
  ];

  const availableAmenities = [
    'Private Bathroom',
    'Shared Bathroom',
    'Window',
    'Air Conditioning',
    'Heating',
    'Desk',
    'Closet',
    'TV',
    'Phone',
    'Internet Access'
  ];

  useEffect(() => {
    fetchRooms();
    fetchResidents();
  }, []);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      let query = supabase.from('rooms').select('*');
      
      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query.order('room_number');
      
      if (error) throw error;
      setRooms(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch rooms');
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const { data, error } = await supabase
        .from('residents')
        .select('id, name, room_id');
      
      if (error) throw error;
      setResidents(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch residents');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.room_number.trim()) {
      toast.error('Room number is required');
      return;
    }

    try {
      const roomData = {
        ...formData,
        room_number: formData.room_number.trim(),
        building: formData.building.trim() || null,
        notes: formData.notes.trim() || null,
        current_occupancy: 0 // Always start with 0 occupancy
      };

      if (editingRoom) {
        const { error } = await supabase
          .from('rooms')
          .update(roomData)
          .eq('id', editingRoom.id);

        if (error) throw error;
        toast.success('Room updated successfully');
      } else {
        const { error } = await supabase
          .from('rooms')
          .insert([roomData]);

        if (error) throw error;
        toast.success('Room added successfully');
      }

      resetForm();
      fetchRooms();
    } catch (error: any) {
      toast.error(editingRoom ? 'Failed to update room' : 'Failed to add room');
    }
  };

  const handleEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      room_number: room.room_number,
      building: room.building || '',
      floor: room.floor || 1,
      room_type: room.room_type,
      capacity: room.capacity,
      status: room.status,
      amenities: room.amenities || [],
      notes: room.notes || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room?')) return;

    try {
      const { error } = await supabase
        .from('rooms')
        .delete()
        .eq('id', roomId);

      if (error) throw error;
      toast.success('Room deleted successfully');
      fetchRooms();
    } catch (error: any) {
      toast.error('Failed to delete room');
    }
  };

  const resetForm = () => {
    setFormData({
      room_number: '',
      building: '',
      floor: 1,
      room_type: 'standard',
      capacity: 1,
      status: 'available',
      amenities: [],
      notes: ''
    });
    setEditingRoom(null);
    setShowAddForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      amenities: checked 
        ? [...prev.amenities, amenity]
        : prev.amenities.filter(a => a !== amenity)
    }));
  };

  const getStatusStyle = (status: string) => {
    const statusConfig = roomStatuses.find(s => s.value === status);
    return statusConfig ? statusConfig.color : 'bg-gray-100 text-gray-800';
  };

  const getResidentsInRoom = (roomId: string) => {
    return residents.filter(r => r.room_id === roomId);
  };

  const getOccupancyRate = () => {
    const totalCapacity = rooms.reduce((sum, room) => sum + room.capacity, 0);
    const totalOccupied = rooms.reduce((sum, room) => sum + room.current_occupancy, 0);
    return totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Room Management</h2>
          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
            <span>Total Rooms: {rooms.length}</span>
            <span>Occupancy Rate: {getOccupancyRate()}%</span>
            <span>Available: {rooms.filter(r => r.status === 'available').length}</span>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Add Room
        </button>
      </div>

      {/* Filter Controls */}
      <div className="flex items-center space-x-4 mb-6">
        <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            // Trigger re-fetch when filter changes
            setTimeout(fetchRooms, 0);
          }}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Statuses</option>
          {roomStatuses.map(status => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      {/* Add/Edit Room Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">
                {editingRoom ? 'Edit Room' : 'Add Room'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    name="room_number"
                    value={formData.room_number}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., A-101"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Building
                  </label>
                  <input
                    type="text"
                    name="building"
                    value={formData.building}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Building A"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Floor
                  </label>
                  <input
                    type="number"
                    name="floor"
                    value={formData.floor}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Room Type
                  </label>
                  <select
                    name="room_type"
                    value={formData.room_type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roomTypes.map(type => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleChange}
                    min="1"
                    max="10"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {roomStatuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amenities
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availableAmenities.map(amenity => (
                    <label key={amenity} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.amenities.includes(amenity)}
                        onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Additional notes about the room..."
                />
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
                  {editingRoom ? 'Update Room' : 'Add Room'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rooms Grid */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No rooms found
            </div>
          ) : (
            rooms.map((room) => (
              <div key={room.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{room.room_number}</h3>
                    {room.building && (
                      <p className="text-sm text-gray-600">{room.building} - Floor {room.floor}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(room)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(room.status)}`}>
                      {roomStatuses.find(s => s.value === room.status)?.label || room.status}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">{room.room_type}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Occupancy:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {room.current_occupancy}/{room.capacity}
                    </span>
                  </div>

                  {room.amenities && room.amenities.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-600">Amenities:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {room.amenities.slice(0, 3).map(amenity => (
                          <span key={amenity} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            +{room.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {getResidentsInRoom(room.id).length > 0 && (
                    <div>
                      <span className="text-sm text-gray-600">Residents:</span>
                      <div className="mt-1">
                        {getResidentsInRoom(room.id).map(resident => (
                          <div key={resident.id} className="text-sm text-gray-900">
                            {resident.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}