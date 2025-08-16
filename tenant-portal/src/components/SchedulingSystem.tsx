"use client";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { supabase } from "../utils/supabaseClient";

interface ScheduleEvent {
  id: number;
  title: string;
  description?: string;
  event_type: 'appointment' | 'meeting' | 'activity' | 'medical' | 'counseling' | 'other';
  start_time: string;
  end_time: string;
  resident_id?: number;
  staff_id?: number;
  location?: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  reminder_sent: boolean;
  notes?: string;
  created_at: string;
}

interface Resident {
  id: number;
  name: string;
  room_number?: string;
}

interface SchedulingSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SchedulingSystem({ isOpen, onClose }: SchedulingSystemProps) {
  const [events, setEvents] = useState<ScheduleEvent[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedResident, setSelectedResident] = useState<number | null>(null);

  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    event_type: 'appointment' as ScheduleEvent['event_type'],
    start_time: '',
    end_time: '',
    resident_id: null as number | null,
    location: '',
    notes: ''
  });

  useEffect(() => {
    if (isOpen) {
      fetchEvents();
      fetchResidents();
    }
  }, [isOpen, selectedDate, filterType, filterStatus, selectedResident]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('schedule_events')
        .select('*')
        .order('start_time', { ascending: true });

      // Filter by date range (current week)
      const startOfWeek = new Date(selectedDate);
      startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      query = query
        .gte('start_time', startOfWeek.toISOString())
        .lte('start_time', endOfWeek.toISOString());

      if (filterType !== 'all') {
        query = query.eq('event_type', filterType);
      }

      if (filterStatus !== 'all') {
        query = query.eq('status', filterStatus);
      }

      if (selectedResident) {
        query = query.eq('resident_id', selectedResident);
      }

      const { data, error } = await query;

      if (error) {
        toast.error('Failed to fetch events');
        return;
      }

      setEvents(data || []);
    } catch (error) {
      toast.error('Error loading events');
    } finally {
      setLoading(false);
    }
  };

  const fetchResidents = async () => {
    try {
      const { data, error } = await supabase
        .from('residents')
        .select('id, name, room_number')
        .order('name');

      if (error) {
        toast.error('Failed to fetch residents');
        return;
      }

      setResidents(data || []);
    } catch (error) {
      toast.error('Error loading residents');
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const eventData = {
        title: newEvent.title,
        description: newEvent.description || null,
        event_type: newEvent.event_type,
        start_time: newEvent.start_time,
        end_time: newEvent.end_time,
        resident_id: newEvent.resident_id,
        location: newEvent.location || null,
        status: 'scheduled' as ScheduleEvent['status'],
        reminder_sent: false,
        notes: newEvent.notes || null
      };

      const { data, error } = await supabase
        .from('schedule_events')
        .insert([eventData])
        .select();

      if (error) {
        toast.error('Failed to add event');
        return;
      }

      toast.success('Event scheduled successfully');
      setNewEvent({
        title: '',
        description: '',
        event_type: 'appointment',
        start_time: '',
        end_time: '',
        resident_id: null,
        location: '',
        notes: ''
      });
      setShowAddEvent(false);
      fetchEvents();
    } catch (error) {
      toast.error('Error adding event');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEventStatus = async (eventId: number, status: ScheduleEvent['status']) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('schedule_events')
        .update({ status })
        .eq('id', eventId);

      if (error) {
        toast.error('Failed to update event');
        return;
      }

      toast.success('Event status updated');
      fetchEvents();
    } catch (error) {
      toast.error('Error updating event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('schedule_events')
        .delete()
        .eq('id', eventId);

      if (error) {
        toast.error('Failed to delete event');
        return;
      }

      toast.success('Event deleted successfully');
      fetchEvents();
    } catch (error) {
      toast.error('Error deleting event');
    } finally {
      setLoading(false);
    }
  };

  const getEventsByDay = () => {
    const days = [];
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.start_time);
        return eventDate.toDateString() === day.toDateString();
      });

      days.push({
        date: day,
        events: dayEvents
      });
    }

    return days;
  };

  const getEventTypeColor = (type: ScheduleEvent['event_type']) => {
    switch (type) {
      case 'appointment': return 'bg-blue-100 text-blue-800';
      case 'meeting': return 'bg-green-100 text-green-800';
      case 'activity': return 'bg-purple-100 text-purple-800';
      case 'medical': return 'bg-red-100 text-red-800';
      case 'counseling': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: ScheduleEvent['status']) => {
    switch (status) {
      case 'scheduled': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isOpen) return null;

  const weekDays = getEventsByDay();
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Scheduling System</h2>
            <p className="text-gray-600">Manage appointments, meetings, and activities</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowAddEvent(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Schedule Event
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                <option value="appointment">Appointment</option>
                <option value="meeting">Meeting</option>
                <option value="activity">Activity</option>
                <option value="medical">Medical</option>
                <option value="counseling">Counseling</option>
                <option value="other">Other</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <select
                value={selectedResident || ''}
                onChange={(e) => setSelectedResident(e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Residents</option>
                {residents.map(resident => (
                  <option key={resident.id} value={resident.id}>
                    {resident.name} ({resident.room_number})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(selectedDate.getDate() - 7);
                  setSelectedDate(newDate);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Previous Week
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Today
              </button>
              <button
                onClick={() => {
                  const newDate = new Date(selectedDate);
                  newDate.setDate(selectedDate.getDate() + 7);
                  setSelectedDate(newDate);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Next Week
              </button>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        <div className="p-6 overflow-y-auto max-h-[50vh]">
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">Loading schedule...</p>
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-4">
              {weekDays.map((day, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className={`p-3 text-center font-medium ${
                    day.date.toDateString() === new Date().toDateString() 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-gray-50 text-gray-700'
                  }`}>
                    <div className="text-sm">{dayNames[index]}</div>
                    <div className="text-lg">{day.date.getDate()}</div>
                  </div>
                  <div className="p-2 space-y-2 min-h-[200px]">
                    {day.events.map(event => (
                      <div
                        key={event.id}
                        className="p-2 rounded text-xs border-l-4 cursor-pointer hover:bg-gray-50"
                        style={{ borderLeftColor: event.event_type === 'medical' ? '#ef4444' : '#3b82f6' }}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="text-gray-600">
                          {new Date(event.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex gap-1 mt-1">
                          <span className={`px-1 rounded text-xs ${getEventTypeColor(event.event_type)}`}>
                            {event.event_type}
                          </span>
                          <span className={`px-1 rounded text-xs ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                        </div>
                        <div className="flex gap-1 mt-2">
                          <button
                            onClick={() => handleUpdateEventStatus(event.id, 'completed')}
                            className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          >
                            Complete
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="px-1 py-0.5 bg-red-500 text-white rounded text-xs hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Event Modal */}
        {showAddEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule New Event</h3>
              <form onSubmit={handleAddEvent} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                  <input
                    type="text"
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Event Type</label>
                  <select
                    required
                    value={newEvent.event_type}
                    onChange={(e) => setNewEvent({...newEvent, event_type: e.target.value as ScheduleEvent['event_type']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="appointment">Appointment</option>
                    <option value="meeting">Meeting</option>
                    <option value="activity">Activity</option>
                    <option value="medical">Medical</option>
                    <option value="counseling">Counseling</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resident (Optional)</label>
                  <select
                    value={newEvent.resident_id || ''}
                    onChange={(e) => setNewEvent({...newEvent, resident_id: e.target.value ? parseInt(e.target.value) : null})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Resident</option>
                    {residents.map(resident => (
                      <option key={resident.id} value={resident.id}>
                        {resident.name} ({resident.room_number})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={newEvent.start_time}
                      onChange={(e) => setNewEvent({...newEvent, start_time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                    <input
                      type="datetime-local"
                      required
                      value={newEvent.end_time}
                      onChange={(e) => setNewEvent({...newEvent, end_time: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                  <textarea
                    value={newEvent.notes}
                    onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddEvent(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Scheduling...' : 'Schedule Event'}
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