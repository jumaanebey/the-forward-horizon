'use client';
import { useState } from 'react';

interface Event {
  id: number;
  title: string;
  type: string;
  date: string;
  time: string;
  duration: number;
  resident?: string;
  staff: string;
  location: string;
  notes?: string;
  status: string;
}

export default function CalendarContent() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Mock events data
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Medical Appointment',
      type: 'medical',
      date: '2024-07-25',
      time: '09:00',
      duration: 60,
      resident: 'John Smith',
      staff: 'Dr. Johnson',
      location: 'Medical Office',
      notes: 'Regular checkup',
      status: 'scheduled'
    },
    {
      id: 2,
      title: 'Group Therapy Session',
      type: 'therapy',
      date: '2024-07-25',
      time: '14:00',
      duration: 90,
      staff: 'Sarah Wilson',
      location: 'Conference Room A',
      notes: 'Weekly group session',
      status: 'scheduled'
    },
    {
      id: 3,
      title: 'Court Hearing',
      type: 'legal',
      date: '2024-07-26',
      time: '10:30',
      duration: 120,
      resident: 'Michael Brown',
      staff: 'Case Manager',
      location: 'County Courthouse',
      notes: 'Progress review hearing',
      status: 'scheduled'
    },
    {
      id: 4,
      title: 'Staff Meeting',
      type: 'meeting',
      date: '2024-07-26',
      time: '16:00',
      duration: 60,
      staff: 'All Staff',
      location: 'Main Office',
      notes: 'Weekly team meeting',
      status: 'scheduled'
    }
  ]);

  const [newEvent, setNewEvent] = useState({
    title: '',
    type: 'appointment',
    date: '',
    time: '',
    duration: 60,
    resident: '',
    staff: '',
    location: '',
    notes: ''
  });

  // Get events for a specific date
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  // Get calendar days for current month
  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const event: Event = {
      id: Date.now(),
      ...newEvent,
      status: 'scheduled'
    };
    setEvents([...events, event]);
    setNewEvent({
      title: '',
      type: 'appointment',
      date: '',
      time: '',
      duration: 60,
      resident: '',
      staff: '',
      location: '',
      notes: ''
    });
    setShowAddEvent(false);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'medical': return 'bg-red-100 text-red-800 border-red-200';
      case 'therapy': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'legal': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'meeting': return 'bg-green-100 text-green-800 border-green-200';
      case 'appointment': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSameMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Calendar & Scheduling</h2>
            <p className="text-gray-600">Manage appointments, meetings, and events</p>
          </div>
          
          <div className="flex space-x-4">
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                  viewMode === 'month' 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 text-sm font-medium border-t border-b ${
                  viewMode === 'week' 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('day')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md border ${
                  viewMode === 'day' 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Day
              </button>
            </div>
            
            <button
              onClick={() => setShowAddEvent(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Add Event
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <h3 className="text-lg font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h3>
              
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="p-6">
              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-1">
                {getCalendarDays().map((day, index) => {
                  const dayEvents = getEventsForDate(day);
                  return (
                    <div
                      key={index}
                      className={`min-h-[100px] p-2 border border-gray-100 cursor-pointer hover:bg-gray-50 ${
                        !isSameMonth(day) ? 'text-gray-400 bg-gray-50' : ''
                      } ${
                        isToday(day) ? 'bg-blue-50 border-blue-200' : ''
                      }`}
                      onClick={() => setSelectedDate(day)}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday(day) ? 'text-blue-600' : ''
                      }`}>
                        {day.getDate()}
                      </div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded border ${getEventTypeColor(event.type)} truncate`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                            }}
                          >
                            {event.time} {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{dayEvents.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Selected Date Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">
              {formatDate(selectedDate)}
            </h4>
            
            <div className="space-y-3">
              {getEventsForDate(selectedDate).length === 0 ? (
                <p className="text-gray-500 text-sm">No events scheduled</p>
              ) : (
                getEventsForDate(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    className={`p-3 rounded-md border cursor-pointer ${getEventTypeColor(event.type)}`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className="font-medium text-sm">{event.title}</div>
                    <div className="text-xs mt-1">
                      {event.time} - {event.duration}min
                    </div>
                    {event.resident && (
                      <div className="text-xs mt-1">
                        Resident: {event.resident}
                      </div>
                    )}
                    <div className="text-xs mt-1">
                      Staff: {event.staff}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">This Week</h4>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Events</span>
                <span className="text-sm font-medium">{events.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Medical Appointments</span>
                <span className="text-sm font-medium">
                  {events.filter(e => e.type === 'medical').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Therapy Sessions</span>
                <span className="text-sm font-medium">
                  {events.filter(e => e.type === 'therapy').length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Court Hearings</span>
                <span className="text-sm font-medium">
                  {events.filter(e => e.type === 'legal').length}
                </span>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Upcoming Events</h4>
            <div className="space-y-3">
              {events
                .filter(event => new Date(event.date) >= new Date())
                .slice(0, 3)
                .map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start space-x-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className={`w-3 h-3 rounded-full mt-1 ${
                      event.type === 'medical' ? 'bg-red-400' :
                      event.type === 'therapy' ? 'bg-blue-400' :
                      event.type === 'legal' ? 'bg-yellow-400' :
                      'bg-green-400'
                    }`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {event.date} at {event.time}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Add New Event</h3>
              <button
                onClick={() => setShowAddEvent(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvent.title}
                    onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Event Type *
                  </label>
                  <select
                    required
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="appointment">General Appointment</option>
                    <option value="medical">Medical Appointment</option>
                    <option value="therapy">Therapy Session</option>
                    <option value="legal">Court/Legal</option>
                    <option value="meeting">Staff Meeting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time *
                  </label>
                  <input
                    type="time"
                    required
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={newEvent.duration}
                    onChange={(e) => setNewEvent({...newEvent, duration: parseInt(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resident (Optional)
                  </label>
                  <input
                    type="text"
                    value={newEvent.resident}
                    onChange={(e) => setNewEvent({...newEvent, resident: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Select or type resident name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Staff Member *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvent.staff}
                    onChange={(e) => setNewEvent({...newEvent, staff: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location *
                  </label>
                  <input
                    type="text"
                    required
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent({...newEvent, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddEvent(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Event Details</h3>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Title</label>
                <p className="text-gray-900">{selectedEvent.title}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Date</label>
                  <p className="text-gray-900">{selectedEvent.date}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Time</label>
                  <p className="text-gray-900">{selectedEvent.time}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Duration</label>
                  <p className="text-gray-900">{selectedEvent.duration} minutes</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Type</label>
                  <p className="text-gray-900 capitalize">{selectedEvent.type}</p>
                </div>
              </div>

              {selectedEvent.resident && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Resident</label>
                  <p className="text-gray-900">{selectedEvent.resident}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-medium text-gray-500">Staff</label>
                <p className="text-gray-900">{selectedEvent.staff}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500">Location</label>
                <p className="text-gray-900">{selectedEvent.location}</p>
              </div>

              {selectedEvent.notes && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Notes</label>
                  <p className="text-gray-900">{selectedEvent.notes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-4 pt-6">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Edit Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}