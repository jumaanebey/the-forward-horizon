"use client";
import { useState } from "react";

interface AdvancedFiltersProps {
  onFiltersChange: (filters: FilterOptions) => void;
}

interface FilterOptions {
  dateRange: {
    start: string;
    end: string;
  };
  program: string;
  status: string;
  roomType: string;
  hasMedicalConditions: boolean;
  hasEmergencyContact: boolean;
}

export default function AdvancedFilters({ onFiltersChange }: AdvancedFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    dateRange: { start: "", end: "" },
    program: "",
    status: "",
    roomType: "",
    hasMedicalConditions: false,
    hasEmergencyContact: false
  });

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleDateRangeChange = (type: 'start' | 'end', value: string) => {
    const newDateRange = { ...filters.dateRange, [type]: value };
    const newFilters = { ...filters, dateRange: newDateRange };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters: FilterOptions = {
      dateRange: { start: "", end: "" },
      program: "",
      status: "",
      roomType: "",
      hasMedicalConditions: false,
      hasEmergencyContact: false
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters).some(value => {
    if (typeof value === 'object') {
      return Object.values(value).some(v => v !== "" && v !== false);
    }
    return value !== "" && value !== false;
  });

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <svg 
            className={`w-4 h-4 mr-2 transition-transform ${isExpanded ? 'rotate-90' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          Advanced Filters
          {hasActiveFilters && (
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
              Active
            </span>
          )}
        </button>
        
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-600 hover:text-red-800"
          >
            Clear All
          </button>
        )}
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Date Range */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Admission Date Range</label>
            <div className="space-y-2">
              <input
                type="date"
                value={filters.dateRange.start}
                onChange={(e) => handleDateRangeChange('start', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Start date"
              />
              <input
                type="date"
                value={filters.dateRange.end}
                onChange={(e) => handleDateRangeChange('end', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="End date"
              />
            </div>
          </div>

          {/* Program Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Program Type</label>
            <select
              value={filters.program}
              onChange={(e) => handleFilterChange('program', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Programs</option>
              <option value="Recovery">Recovery Program</option>
              <option value="Re-entry">Re-entry Program</option>
              <option value="Transitional">Transitional Housing</option>
              <option value="Short-term">Short-term Stay</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Inactive">Inactive</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Room Type Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Room Type</label>
            <select
              value={filters.roomType}
              onChange={(e) => handleFilterChange('roomType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="">All Rooms</option>
              <option value="A">A Block</option>
              <option value="B">B Block</option>
              <option value="C">C Block</option>
              <option value="D">D Block</option>
            </select>
          </div>

          {/* Medical Conditions Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Medical Information</label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.hasMedicalConditions}
                  onChange={(e) => handleFilterChange('hasMedicalConditions', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Has Medical Conditions</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.hasEmergencyContact}
                  onChange={(e) => handleFilterChange('hasEmergencyContact', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Has Emergency Contact</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 