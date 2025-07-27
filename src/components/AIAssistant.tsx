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

  const generateResponse = (userInput: string): { content: string; actions?: { label: string; action: () => void; }[] } => {
    const input = userInput.toLowerCase();
    
    if (input.includes('occupancy') || input.includes('capacity')) {
      return {
        content: `Forward Horizon is currently in the pre-opening phase with ${businessData?.residents || 0} residents. We are preparing for our initial opening and have launched marketing campaigns to build our waitlist. All systems are being prepared for operations.`,
        actions: [
          { label: 'View Residents', action: () => onNavigate?.('residents') },
          { label: 'Generate Report', action: () => onNavigate?.('reports') }
        ]
      };
    }
    
    if (input.includes('revenue') || input.includes('financial') || input.includes('money')) {
      return {
        content: `Monthly revenue is $${businessData?.monthlyRevenue?.toLocaleString() || '284,760'}, showing strong financial performance with a 12.3% increase compared to last month.`,
        actions: [
          { label: 'Financial Reports', action: () => onNavigate?.('reports') },
          { label: 'Payment Tracking', action: () => onNavigate?.('reports') }
        ]
      };
    }
    
    if (input.includes('program') || input.includes('treatment')) {
      return {
        content: `We offer three evidence-based programs: 90-Day Recovery Program (45% of residents), 60-Day Intensive Program (35% of residents), and 30-Day Detox Program (20% of residents). All programs include individual counseling, group therapy, medical support, and family involvement.`,
        actions: [
          { label: 'Manage Programs', action: () => onNavigate?.('programs') },
          { label: 'View Schedule', action: () => onNavigate?.('calendar') }
        ]
      };
    }
    
    if (input.includes('staff') || input.includes('employee') || input.includes('team')) {
      return {
        content: `We have ${businessData?.staffMembers || 42} dedicated professionals providing excellent care across medical, clinical, and support teams. All staff maintain current certifications and receive ongoing training.`,
        actions: [
          { label: 'Staff Management', action: () => onNavigate?.('staff') },
          { label: 'Schedule Staff', action: () => onNavigate?.('calendar') }
        ]
      };
    }
    
    if (input.includes('incident') || input.includes('safety') || input.includes('security')) {
      return {
        content: `Safety is our highest priority. We've had only ${businessData?.recentIncidents || 3} incidents in the last 30 days, representing a 25% decrease. We maintain 24/7 monitoring and immediate crisis intervention capabilities.`,
        actions: [
          { label: 'Safety Reports', action: () => onNavigate?.('reports') },
          { label: 'View Protocols', action: () => onNavigate?.('documents') }
        ]
      };
    }
    
    if (input.includes('schedule') || input.includes('appointment') || input.includes('calendar')) {
      return {
        content: `I can help you manage individual therapy sessions, group meetings, medical appointments, family visits, staff meetings, and program activities. Our current appointment attendance rate is 94%.`,
        actions: [
          { label: 'Open Calendar', action: () => onNavigate?.('calendar') },
          { label: 'Schedule Now', action: () => onNavigate?.('calendar') }
        ]
      };
    }
    
    if (input.includes('help') || input.includes('what can you do')) {
      return {
        content: `I can help with resident management, business analytics, staff scheduling, financial reporting, safety monitoring, and operational guidance. I provide 24/7 assistance for all facility operations.`,
        actions: [
          { label: 'Dashboard Overview', action: () => onNavigate?.('dashboard') },
          { label: 'View Reports', action: () => onNavigate?.('reports') }
        ]
      };
    }
    
    return {
      content: `I understand you're asking about "${userInput}". I can help with resident management, financial operations, scheduling, analytics, documentation, and safety protocols. Could you please rephrase your question?`,
      actions: [
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
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { label: 'Show Occupancy', query: 'What is our current occupancy rate?' },
    { label: 'Revenue Report', query: 'Show me revenue performance' },
    { label: 'Schedule Meeting', query: 'Help me schedule an appointment' },
    { label: 'Add Resident', query: 'How do I admit a new resident?' },
    { label: 'Safety Status', query: 'What is our current safety status?' },
    { label: 'Staff Schedule', query: 'Show me staff information' },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-4 lg:bottom-4 lg:right-4 w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center z-40 active:scale-95 hover:scale-105"
      >
        <div className="relative">
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[95vh] max-h-[900px] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Forward Horizon AI Assistant</h2>
                  <p className="text-purple-100 text-sm">Intelligent business management companion</p>
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
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-sm text-gray-600 ml-2">AI is analyzing...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length === 1 && (
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-sm font-semibold text-gray-700 mb-3">Quick Actions:</p>
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