'use client';
import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  actions?: {
    label: string;
    action: () => void;
  }[];
}

interface BusinessData {
  residents: number;
  occupancyRate: number;
  monthlyRevenue: number;
  activePrograms: number;
  staffMembers: number;
  recentIncidents: number;
}

interface AIAssistantProps {
  businessData?: BusinessData;
  onNavigate?: (tab: string) => void;
}

export default function AIAssistant({ businessData, onNavigate }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hello! I'm your Forward Horizon AI Assistant. I can help you manage residents, analyze business metrics, schedule appointments, generate reports, and answer questions about your facility operations. What would you like to know?",
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const businessKnowledge = {
    programs: [
      '30-Day Detox Program',
      '60-Day Intensive Program', 
      '90-Day Recovery Program'
    ],
    services: [
      'Individual Counseling',
      'Group Therapy',
      'Medical Detox',
      'Family Therapy',
      'Life Skills Training',
      'Vocational Rehabilitation',
      'Aftercare Planning'
    ],
    commonQuestions: {
      'occupancy': 'Current occupancy rate is at 89.2%, which is above our target of 85%. We have 124 active residents.',
      'revenue': 'Monthly revenue is $284,760, showing a 12.3% increase from last month.',
      'programs': 'We offer three main programs: 30-Day Detox (20%), 60-Day Intensive (35%), and 90-Day Recovery (45%).',
      'staff': 'We currently have 42 staff members across medical, counseling, and administrative teams.',
      'incidents': 'Only 3 incidents in the last 30 days, showing a 25% decrease from the previous month.'
    }
  };

  const generateResponse = (userInput: string): { content: string; actions?: { label: string; action: () => void; }[] } => {
    const input = userInput.toLowerCase();
    
    // Business metrics queries
    if (input.includes('occupancy') || input.includes('capacity')) {
      return {
        content: `Current occupancy is at ${businessData?.occupancyRate || 89.2}% with ${businessData?.residents || 124} active residents. This is above our target of 85%, indicating strong demand for our services.\n\n**Key Insights:**\n• Occupancy rate is healthy and sustainable\n• Revenue per resident is optimized\n• Consider waitlist management for future admissions`,
        actions: [
          { label: 'View Residents', action: () => onNavigate?.('residents') },
          { label: 'Generate Report', action: () => onNavigate?.('reports') }
        ]
      };
    }
    
    if (input.includes('revenue') || input.includes('financial') || input.includes('money')) {
      return {
        content: `Monthly revenue is $${businessData?.monthlyRevenue?.toLocaleString() || '284,760'}, showing strong financial performance with a 12.3% increase compared to last month.\n\n**Financial Health:**\n• Revenue growth trend is positive\n• Average revenue per resident: $2,296\n• Projected annual revenue: $3.4M\n• Payment collection rate: 94%`,
        actions: [
          { label: 'Financial Reports', action: () => onNavigate?.('reports') },
          { label: 'Payment Tracking', action: () => onNavigate?.('reports') }
        ]
      };
    }
    
    // Program information
    if (input.includes('program') || input.includes('treatment')) {
      return {
        content: `We offer three evidence-based programs tailored to different needs:\n\n**🏥 90-Day Recovery Program (45% of residents)**\n• Comprehensive long-term treatment\n• Highest success rate: 87%\n• Includes aftercare planning\n\n**⚡ 60-Day Intensive Program (35% of residents)**\n• Accelerated treatment approach\n• Success rate: 78%\n• Focus on rapid stabilization\n\n**🔄 30-Day Detox Program (20% of residents)**\n• Medical detoxification\n• Preparation for longer-term treatment\n• Success rate: 65%\n\nAll programs include individual counseling, group therapy, medical support, and family involvement.`,
        actions: [
          { label: 'Manage Programs', action: () => onNavigate?.('programs') },
          { label: 'View Schedule', action: () => onNavigate?.('calendar') }
        ]
      };
    }
    
    // Staff queries
    if (input.includes('staff') || input.includes('employee') || input.includes('team')) {
      return {
        content: `We have ${businessData?.staffMembers || 42} dedicated professionals providing excellent care:\n\n**👨‍⚕️ Medical Team (12 members)**\n• Licensed physicians\n• Registered nurses\n• Medical assistants\n\n**🧠 Clinical Team (18 members)**\n• Licensed therapists\n• Addiction counselors\n• Mental health specialists\n\n**📋 Support Team (12 members)**\n• Case managers\n• Administrative staff\n• Facility maintenance\n\nAll staff maintain current certifications and receive ongoing training in evidence-based treatment methods.`,
        actions: [
          { label: 'Staff Management', action: () => onNavigate?.('staff') },
          { label: 'Schedule Staff', action: () => onNavigate?.('calendar') }
        ]
      };
    }
    
    // Safety and incidents
    if (input.includes('incident') || input.includes('safety') || input.includes('security')) {
      return {
        content: `Safety is our highest priority with excellent results:\n\n**📊 Current Safety Metrics:**\n• Only ${businessData?.recentIncidents || 3} incidents in last 30 days\n• 25% decrease from previous month\n• 99.2% safety compliance rate\n• Zero serious injuries this quarter\n\n**🛡️ Safety Protocols:**\n• 24/7 professional monitoring\n• Regular wellness checks every 2 hours\n• Immediate crisis intervention team\n• Secure facility with controlled access\n• Emergency response procedures`,
        actions: [
          { label: 'Safety Reports', action: () => onNavigate?.('reports') },
          { label: 'View Protocols', action: () => onNavigate?.('documents') }
        ]
      };
    }
    
    // Scheduling
    if (input.includes('schedule') || input.includes('appointment') || input.includes('calendar')) {
      return {
        content: `I can help you efficiently manage all scheduling needs:\n\n**📅 Scheduling Options:**\n• Individual therapy sessions (1-hour slots)\n• Group therapy meetings (90-minute sessions)\n• Medical appointments and evaluations\n• Family visits and consultations\n• Staff meetings and training\n• Program activities and workshops\n\n**⏰ Current Schedule Status:**\n• 94% appointment attendance rate\n• Average wait time: 2.3 days\n• Peak hours: 9 AM - 3 PM\n• Weekend availability for family sessions`,
        actions: [
          { label: 'Open Calendar', action: () => onNavigate?.('calendar') },
          { label: 'Schedule Now', action: () => onNavigate?.('calendar') }
        ]
      };
    }
    
    // Reports and analytics
    if (input.includes('report') || input.includes('analytic') || input.includes('data')) {
      return {
        content: `I can generate comprehensive reports and analytics:\n\n**📊 Available Reports:**\n• **Occupancy Trends** - Daily, weekly, monthly analysis\n• **Financial Performance** - Revenue, expenses, profitability\n• **Program Effectiveness** - Success rates, completion metrics\n• **Staff Productivity** - Utilization, performance indicators\n• **Compliance Documentation** - Regulatory requirements\n• **Patient Progress** - Treatment outcomes, satisfaction\n\n**🔍 Advanced Analytics:**\n• Predictive modeling for admissions\n• Risk assessment algorithms\n• Resource optimization recommendations`,
        actions: [
          { label: 'View Reports', action: () => onNavigate?.('reports') },
          { label: 'Custom Report', action: () => onNavigate?.('reports') }
        ]
      };
    }
    
    // Document management
    if (input.includes('document') || input.includes('file') || input.includes('record')) {
      return {
        content: `I can help you manage all facility documentation:\n\n**📋 Document Categories:**\n• **Patient Records** - Medical history, treatment plans, progress notes\n• **Insurance Documentation** - Claims, authorizations, payments\n• **Compliance Files** - Licenses, certifications, inspections\n• **Staff Credentials** - Licenses, training certificates, evaluations\n• **Policies & Procedures** - Treatment protocols, safety guidelines\n• **Legal Documents** - Contracts, releases, regulatory filings\n\n**🔒 Security Features:**\n• HIPAA-compliant storage\n• Role-based access controls\n• Audit trails for all access\n• Automatic backup systems`,
        actions: [
          { label: 'Document Center', action: () => onNavigate?.('documents') },
          { label: 'Upload Files', action: () => onNavigate?.('documents') }
        ]
      };
    }
    
    // Admissions
    if (input.includes('admission') || input.includes('new resident') || input.includes('intake')) {
      return {
        content: `I'll guide you through our comprehensive admission process:\n\n**📋 Admission Steps:**\n1. **Initial Screening** - Phone assessment, eligibility check\n2. **Insurance Verification** - Benefits verification, authorization\n3. **Medical Evaluation** - Physical exam, medication review\n4. **Clinical Assessment** - Addiction severity, mental health\n5. **Program Placement** - Best-fit program recommendation\n6. **Orientation** - Facility tour, policy review, goal setting\n\n**⏱️ Timeline:** Most admissions completed within 24-48 hours\n**📞 24/7 Intake:** Emergency admissions available\n**💰 Insurance:** We accept most major insurance plans`,
        actions: [
          { label: 'Add Resident', action: () => onNavigate?.('residents') },
          { label: 'View Waitlist', action: () => onNavigate?.('residents') }
        ]
      };
    }
    
    // Business optimization
    if (input.includes('optimize') || input.includes('improve') || input.includes('efficiency')) {
      return {
        content: `Based on current data analysis, here are optimization opportunities:\n\n**🚀 Immediate Improvements:**\n• Reduce average length of stay by 0.5 days (save $12K/month)\n• Increase group therapy attendance to 95% (improve outcomes)\n• Optimize staff schedules (reduce overtime by 15%)\n\n**📈 Growth Opportunities:**\n• Add telehealth services (potential +$50K revenue)\n• Expand family program (increase satisfaction 20%)\n• Implement alumni program (improve long-term outcomes)\n\n**⚡ Efficiency Gains:**\n• Automate medication management\n• Streamline admission paperwork\n• Implement predictive scheduling`,
        actions: [
          { label: 'View Analytics', action: () => onNavigate?.('reports') },
          { label: 'Action Plan', action: () => onNavigate?.('reports') }
        ]
      };
    }
    
    // Emergency procedures
    if (input.includes('emergency') || input.includes('crisis') || input.includes('urgent')) {
      return {
        content: `Emergency procedures and crisis management:\n\n**🚨 Emergency Protocols:**\n• **Medical Emergency** - Call 911, notify on-call physician\n• **Mental Health Crisis** - Crisis team response within 5 minutes\n• **Safety Threat** - Secure facility, contact security/police\n• **Facility Emergency** - Evacuation procedures, safety zones\n\n**📞 Emergency Contacts:**\n• Crisis Hotline: Available 24/7\n• On-call Medical: Dr. Johnson (555-0123)\n• Facility Security: (555-0456)\n• Management Team: Always reachable\n\n**✅ Current Status:** All emergency systems operational`,
        actions: [
          { label: 'Emergency Contacts', action: () => onNavigate?.('staff') },
          { label: 'Safety Protocols', action: () => onNavigate?.('documents') }
        ]
      };
    }
    
    // General help
    if (input.includes('help') || input.includes('what can you do')) {
      return {
        content: `I'm your comprehensive Forward Horizon AI Assistant! Here's how I can help:\n\n🏥 **Resident Management**\n• Admission processes and intake coordination\n• Progress tracking and treatment planning\n• Discharge planning and aftercare coordination\n\n📊 **Business Analytics**\n• Financial metrics and revenue analysis\n• Occupancy trends and capacity planning\n• Program effectiveness measurement\n\n📅 **Operations Management**\n• Staff scheduling and resource allocation\n• Appointment coordination and calendar management\n• Compliance monitoring and reporting\n\n🔍 **Decision Support**\n• Predictive analytics and forecasting\n• Risk assessment and mitigation strategies\n• Performance optimization recommendations\n\n💬 **24/7 Assistance**\n• Instant answers to operational questions\n• Policy and procedure guidance\n• Emergency protocol support\n\nWhat specific area would you like to explore today?`,
        actions: [
          { label: 'Dashboard Overview', action: () => onNavigate?.('dashboard') },
          { label: 'Quick Tutorial', action: () => {} }
        ]
      };
    }
    
    // Default response for unrecognized queries
    return {
      content: `I understand you're asking about "${userInput}". Let me help you find the right information!\n\n**I can assist with:**\n• 👥 **Resident Care** - Admissions, treatment planning, progress tracking\n• 💰 **Financial Operations** - Revenue analysis, payment tracking, budgeting\n• 📅 **Scheduling** - Appointments, staff schedules, resource planning\n• 📊 **Analytics** - Performance metrics, trends, predictive insights\n• 📋 **Documentation** - Records management, compliance reporting\n• 🛡️ **Safety & Compliance** - Protocols, incident management, regulations\n\n**Popular requests:**\n• "Show me today's occupancy rate"\n• "How is our revenue trending?"\n• "Schedule a new resident intake"\n• "Generate monthly performance report"\n\nCould you rephrase your question or choose from the areas above?`,
      actions: [
        { label: 'Browse Help Topics', action: () => {} },
        { label: 'View Dashboard', action: () => onNavigate?.('dashboard') }
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI processing time with realistic delay
    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        actions: response.actions,
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'Show Occupancy', query: 'What is our current occupancy rate?' },
    { label: 'Revenue Report', query: 'Show me this month\'s revenue performance' },
    { label: 'Schedule Meeting', query: 'Help me schedule an appointment' },
    { label: 'Add Resident', query: 'How do I admit a new resident?' },
    { label: 'Safety Status', query: 'What is our current safety status?' },
    { label: 'Staff Schedule', query: 'Show me staff scheduling information' },
  ];

  return (
    <>
      {/* AI Assistant Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 lg:bottom-4 lg:right-4 w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40 active:scale-95 hover:scale-105"
      >
        <div className="relative">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </button>

      {/* AI Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[95vh] max-h-[900px] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Forward Horizon AI Assistant</h2>
                  <p className="text-purple-100 text-sm">Intelligent business management companion • Always available</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gradient-to-b from-gray-50 to-white">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-br-md shadow-lg'
                        : 'bg-white text-gray-900 rounded-bl-md shadow-sm border border-gray-100'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
                    {message.actions && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-200">
                        {message.actions.map((action, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              action.action();
                              setIsOpen(false);
                            }}
                            className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 active:bg-purple-200 transition-all duration-150 border border-purple-200"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                    <p className="text-xs opacity-60 mt-3">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl rounded-bl-md max-w-[85%] shadow-sm border border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                      <span className="text-sm text-gray-600 ml-2">AI is analyzing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length === 1 && (
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">💡 Quick Actions:</p>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => setInput(action.query)}
                      className="px-3 py-2 bg-white text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-50 transition-colors border border-purple-200 text-left"
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="p-5 border-t border-gray-200 bg-white rounded-b-2xl">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me about residents, revenue, scheduling, safety, or anything else..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm bg-gray-50 focus:bg-white transition-colors"
                  disabled={isTyping}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isTyping}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm shadow-lg hover:shadow-xl active:scale-95"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}