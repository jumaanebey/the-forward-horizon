'use client';
import { useState } from 'react';

interface NotificationBellProps {
  unreadCount: number;
  hasUrgent: boolean;
  onClick: () => void;
}

export default function NotificationBell({ unreadCount, hasUrgent, onClick }: NotificationBellProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-all duration-200 ${
        isAnimating ? 'animate-pulse' : ''
      } ${hasUrgent ? 'animate-bounce' : ''}`}
    >
      <svg 
        className={`w-6 h-6 ${hasUrgent ? 'text-red-500' : ''}`} 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M15 17h5l-5-5V9.5a6 6 0 10-12 0V12l-5 5h5m7 0v1a3 3 0 11-6 0v-1m6 0H9" 
        />
      </svg>
      
      {/* Notification Badge */}
      {unreadCount > 0 && (
        <span className={`absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none transform translate-x-1/2 -translate-y-1/2 rounded-full ${
          hasUrgent 
            ? 'bg-red-500 text-white animate-pulse' 
            : 'bg-blue-500 text-white'
        }`}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}

      {/* Urgent indicator */}
      {hasUrgent && (
        <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-400 animate-ping"></span>
      )}
    </button>
  );
}