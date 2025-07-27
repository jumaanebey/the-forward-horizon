'use client';
import { useState, useEffect } from 'react';

interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: 'appointment' | 'meeting' | 'therapy' | 'medical' | 'group' | 'activity';
  startTime: string;
  endTime: string;
  date: string;
  attendees: string[];
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'in-progress';
  priority: 'low' | 'medium' | 'high';
}

interface Appointment {
  id: string;
  residentName: string;
  staffName: string;
  type: 'consultation' | 'therapy' | 'checkup' | 'assessment';
  date: string;
  time: string;
  duration: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
}

export default function CalendarScheduling() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    setCurrentDate(new Date());
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/calendar');
      const data = await response.json();
      
      const formattedEvents: CalendarEvent[] = data.events.map((event: any) => ({
        id: event.id,
        title: event.title,
        description: event.description || '',
        type: 'appointment',
        startTime: event.startTime,
        endTime: event.endTime,
        date: new Date(event.startTime).toISOString().split('T')[0],
        attendees: event.attendees || [],
        location: event.location || '',
        status: event.status || 'scheduled',
        priority: 'medium'
      }));

      setEvents(formattedEvents);
    } catch (error) {
      console.error('Error loading calendar events:', error);
      // Fallback to empty state for startup
      setEvents([]);
    }
    
    // For now, keep appointments empty since we don't have residents yet
    setAppointments([]);
    setLoading(false);
  };

  const createEvent = async (eventData: Partial<CalendarEvent>) => {
    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        loadData(); // Reload events
        return true;
      }
    } catch (error) {
      console.error('Error creating event:', error);
    }
    return false;
  };

  // Legacy mock data (commented out for reference)
  /*const loadDataOld = async () => {
    setLoading(true);
    setTimeout(() => {
      const mockEvents: CalendarEvent[] = [
        {
          id: '1',
          title: 'Morning Group Therapy',
          description: 'Daily group therapy session for addiction recovery',
          type: 'group',
          startTime: '09:00',
          endTime: '10:30',
          date: '2024-01-26',
          attendees: ['Dr. Sarah Johnson', 'James Wilson', 'Group A Residents'],
          location: 'Therapy Room 1',
          status: 'scheduled',
          priority: 'high'
        },
        {
          id: '2',
          title: 'Individual Counseling - John Smith',
          description: 'Weekly individual counseling session',
          type: 'therapy',
          startTime: '14:00',
          endTime: '15:00',
          date: '2024-01-26',
          attendees: ['John Smith', 'James Wilson'],
          location: 'Counseling Office 2',
          status: 'scheduled',
          priority: 'medium'
        },
        {
          id: '3',
          title: 'Medical Rounds',
          description: 'Daily medical rounds and resident check-ups',
          type: 'medical',
          startTime: '11:00',
          endTime: '12:00',
          date: '2024-01-26',
          attendees: ['Dr. Sarah Johnson', 'Maria Rodriguez'],
          location: 'Medical Wing',
          status: 'in-progress',
          priority: 'high'
        },
        {
          id: '4',
          title: 'Staff Meeting',
          description: 'Weekly staff coordination meeting',
          type: 'meeting',
          startTime: '16:00',
          endTime: '17:00',
          date: '2024-01-26',
          attendees: ['All Staff'],
          location: 'Conference Room',
          status: 'scheduled',
          priority: 'medium'
        },
        {
          id: '5',
          title: 'Evening Activities',
          description: 'Recreational activities and social time',
          type: 'activity',
          startTime: '19:00',
          endTime: '20:30',
          date: '2024-01-26',
          attendees: ['Recreation Staff', 'All Residents'],
          location: 'Activity Center',
          status: 'scheduled',
          priority: 'low'
        },
        {
          id: '6',
          title: 'Family Therapy - Sarah Johnson',
          description: 'Family counseling session',
          type: 'therapy',
          startTime: '10:00',
          endTime: '11:30',
          date: '2024-01-27',
          attendees: ['Sarah Johnson', 'Family Members', 'James Wilson'],
          location: 'Family Room',
          status: 'scheduled',
          priority: 'high'
        },
        {
          id: '7',
          title: 'Monthly Board Meeting',
          description: 'Monthly board of directors meeting',
          type: 'meeting',
          startTime: '14:00',
          endTime: '16:00',
          date: '2024-01-28',
          attendees: ['Board Members', 'Angela Davis'],
          location: 'Main Conference Room',
          status: 'scheduled',
          priority: 'high'
        },
        {
          id: '8',
          title: 'New Resident Orientation',
          description: 'Orientation for new admissions',
          type: 'group',
          startTime: '09:00',
          endTime: '12:00',
          date: '2024-01-29',
          attendees: ['New Residents', 'Orientation Team'],
          location: 'Orientation Room',
          status: 'scheduled',
          priority: 'medium'
        },
        {
          id: '9',
          title: 'Medical Reviews',
          description: 'Weekly medical case reviews',
          type: 'medical',
          startTime: '10:00',
          endTime: '11:30',
          date: '2024-01-30',
          attendees: ['Dr. Sarah Johnson', 'Medical Team'],
          location: 'Medical Conference Room',
          status: 'scheduled',
          priority: 'high'
        },
        {
          id: '10',
          title: 'Community Outreach Event',
          description: 'Local community engagement activity',
          type: 'activity',
          startTime: '13:00',
          endTime: '17:00',
          date: '2024-01-31',
          attendees: ['Volunteers', 'Community Team'],
          location: 'Community Center',
          status: 'scheduled',
          priority: 'medium'
        }
      ];

      const mockAppointments: Appointment[] = [
        {
          id: '1',
          residentName: 'John Smith',
          staffName: 'Dr. Sarah Johnson',
          type: 'consultation',
          date: '2024-01-26',
          time: '10:00',
          duration: 60,
          status: 'scheduled',
          notes: 'Monthly progress review'
        },
        {
          id: '2',
          residentName: 'Sarah Johnson',
          staffName: 'James Wilson',
          type: 'therapy',
          date: '2024-01-26',
          time: '14:00',
          duration: 60,
          status: 'scheduled'
        },
        {
          id: '3',
          residentName: 'Michael Brown',
          staffName: 'Maria Rodriguez',
          type: 'checkup',
          date: '2024-01-26',
          time: '11:30',
          duration: 30,
          status: 'completed',
          notes: 'Vital signs stable, medication adjusted'
        },
        {
          id: '4',
          residentName: 'Emily Chen',
          staffName: 'Dr. Sarah Johnson',
          type: 'assessment',
          date: '2024-01-25',
          time: '15:00',
          duration: 90,
          status: 'completed',
          notes: 'Initial assessment completed, treatment plan developed'
        },
        {
          id: '5',
          residentName: 'Robert Wilson',
          staffName: 'James Wilson',
          type: 'therapy',
          date: '2024-01-24',
          time: '13:00',
          duration: 60,
          status: 'no-show',
          notes: 'Patient did not attend scheduled session'
        }
      ];

      setEvents(mockEvents);
      setAppointments(mockAppointments);
      setLoading(false);
    }, 800);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'appointment': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'meeting': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'therapy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medical': return 'bg-red-100 text-red-800 border-red-200';
      case 'group': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'activity': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'no-show': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAppointmentTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800';
      case 'therapy': return 'bg-green-100 text-green-800';
      case 'checkup': return 'bg-purple-100 text-purple-800';
      case 'assessment': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const navigateToEventDate = (eventDate: string) => {
    const eventDateObj = new Date(eventDate);
    setSelectedDate(eventDateObj);
    setActiveTab('calendar');
    
    // Scroll to the calendar section
    setTimeout(() => {
      const calendarSection = document.getElementById('calendar-grid');
      if (calendarSection) {
        calendarSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const formatDateForCalendar = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return formatDateForCalendar(date) === formatDateForCalendar(today);
  };

  const isSameDate = (date1: Date, date2: Date) => {
    return formatDateForCalendar(date1) === formatDateForCalendar(date2);
  };

  const getEventsForDate = (date: Date) => {
    const dateString = formatDateForCalendar(date);
    return events.filter(event => event.date === dateString);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const selectedDateEvents = events.filter(event => 
    event.date === formatDateForCalendar(selectedDate)
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const upcomingAppointments = appointments.filter(apt => 
    apt.status === 'scheduled' && new Date(apt.date) >= new Date()
  ).sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-48 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Calendar & Scheduling</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Schedule appointments, meetings, and activities across your facility</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="flex bg-gray-100 rounded-lg p-1">
              {(['month', 'week', 'day'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-md capitalize transition-colors ${
                    viewMode === mode
                      ? 'bg-white text-indigo-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowEventModal(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium text-sm sm:text-base"
            >
              Schedule Event
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-indigo-100 rounded-lg">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Today's Events</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{todayEvents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {events.filter(e => e.status === 'completed' && e.date === currentDate?.toISOString().split('T')[0]).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Upcoming Appointments</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{upcomingAppointments.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {events.filter(e => e.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            {[
              { id: 'calendar', label: 'Calendar View' },
              { id: 'appointments', label: 'Appointments' },
              { id: 'schedule', label: 'Daily Schedule' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 ${
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Calendar View Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            {/* Today's Schedule */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {isSameDate(selectedDate, new Date()) ? "Today's Schedule" : "Selected Date Schedule"} - {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h2>
                  <div className="text-sm text-gray-500">{selectedDateEvents.length} events</div>
                </div>
              </div>
              <div className="p-6">
                {selectedDateEvents.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No events scheduled</h3>
                    <p className="text-gray-500">No events scheduled for this date</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedDateEvents.map((event) => (
                      <div 
                        key={event.id} 
                        className={`p-4 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow ${getEventTypeColor(event.type)}`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="font-semibold text-gray-900">{event.title}</h3>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                                {event.status}
                              </span>
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(event.priority)}`}>
                                {event.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {formatTime(event.startTime)} - {formatTime(event.endTime)}
                              </div>
                              <div className="flex items-center">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {event.location}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Calendar Grid */}
            <div id="calendar-grid" className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const prevMonth = new Date(selectedDate);
                        prevMonth.setMonth(prevMonth.getMonth() - 1);
                        setSelectedDate(prevMonth);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedDate(new Date())}
                      className="px-3 py-1 text-sm bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => {
                        const nextMonth = new Date(selectedDate);
                        nextMonth.setMonth(nextMonth.getMonth() + 1);
                        setSelectedDate(nextMonth);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                      {day}
                    </div>
                  ))}
                </div>
                
                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {getDaysInMonth(selectedDate).map((day, index) => {
                    if (!day) {
                      return <div key={index} className="h-24"></div>;
                    }
                    
                    const dayEvents = getEventsForDate(day);
                    const isSelected = isSameDate(day, selectedDate);
                    const isTodayDate = isToday(day);
                    
                    return (
                      <div
                        key={index}
                        onClick={() => setSelectedDate(day)}
                        className={`h-24 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 ${
                          isSelected ? 'bg-indigo-50 border-indigo-200' : ''
                        } ${isTodayDate ? 'bg-blue-50 border-blue-200' : ''}`}
                      >
                        <div className={`text-sm font-medium mb-1 ${
                          isTodayDate ? 'text-blue-600' : 
                          isSelected ? 'text-indigo-600' : 'text-gray-900'
                        }`}>
                          {day.getDate()}
                        </div>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedEvent(event);
                              }}
                              className={`text-xs p-1 rounded truncate cursor-pointer hover:opacity-80 ${getEventTypeColor(event.type)}`}
                            >
                              {event.title}
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <div className="text-xs text-gray-500 p-1">
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
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Appointment Management</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Resident</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date & Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{appointment.residentName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{appointment.staffName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getAppointmentTypeColor(appointment.type)}`}>
                          {appointment.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(appointment.date).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">{formatTime(appointment.time)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.duration} min
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => {
                            // For now, just show an alert - could open edit modal in future
                            alert(`Edit appointment for ${appointment.residentName}`);
                          }}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            const updatedAppointments = appointments.map(apt => 
                              apt.id === appointment.id 
                                ? { ...apt, status: 'cancelled' as const }
                                : apt
                            );
                            setAppointments(updatedAppointments);
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Daily Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Schedule Overview</h2>
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Advanced Scheduling</h3>
              <p className="text-gray-600">Detailed weekly and monthly scheduling views coming soon...</p>
            </div>
          </div>
        )}

        {/* Event Detail Modal */}
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b">
                <h2 className="text-xl font-bold text-gray-900">{selectedEvent.title}</h2>
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[70vh]">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <p className="text-gray-900">{selectedEvent.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getEventTypeColor(selectedEvent.type)}`}>
                        {selectedEvent.type}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(selectedEvent.priority)}`}>
                        {selectedEvent.priority}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <p className="text-gray-900">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <p className="text-gray-900">{formatTime(selectedEvent.startTime)} - {formatTime(selectedEvent.endTime)}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <p className="text-gray-900">{selectedEvent.location}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedEvent.status)}`}>
                      {selectedEvent.status}
                    </span>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Attendees</label>
                    <div className="space-y-1">
                      {selectedEvent.attendees.map((attendee, index) => (
                        <div key={index} className="text-sm text-gray-900">• {attendee}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Schedule Event Modal */}
        {showEventModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl w-full max-w-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-900">Schedule New Event</h2>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-indigo-600 text-2xl">📅</span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Event Scheduler</h3>
                <p className="text-gray-600 mb-6">Advanced event creation and scheduling tools coming soon...</p>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}