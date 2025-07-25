"use client";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";

interface DashboardStats {
  totalResidents: number;
  recentAdditions: number;
  averageAge: number;
  occupancyRate: number;
  programDistribution: { [key: string]: number };
}

export default function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats>({
    totalResidents: 0,
    recentAdditions: 0,
    averageAge: 0,
    occupancyRate: 0,
    programDistribution: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Get all residents
      const { data: residents, error } = await supabase
        .from("residents")
        .select("*");

      if (error) {
        console.error("Error fetching stats:", error);
        return;
      }

      if (residents) {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

        // Calculate statistics
        const totalResidents = residents.length;
        const recentAdditions = residents.filter(resident => {
          if (!resident.created_at) return false;
          return new Date(resident.created_at) > thirtyDaysAgo;
        }).length;

        // Calculate average age (if DOB is available)
        const residentsWithAge = residents.filter(r => r.dob);
        const averageAge = residentsWithAge.length > 0 
          ? Math.round(residentsWithAge.reduce((sum, r) => {
              const age = now.getFullYear() - new Date(r.dob).getFullYear();
              return sum + age;
            }, 0) / residentsWithAge.length)
          : 0;

        // Calculate program distribution
        const programDistribution: { [key: string]: number } = {};
        residents.forEach(resident => {
          const program = resident.program || 'Unassigned';
          programDistribution[program] = (programDistribution[program] || 0) + 1;
        });

        // Mock occupancy rate (you can adjust based on your facility capacity)
        const totalCapacity = 50; // Adjust based on your facility
        const occupancyRate = Math.round((totalResidents / totalCapacity) * 100);

        setStats({
          totalResidents,
          recentAdditions,
          averageAge,
          occupancyRate,
          programDistribution
        });
      }
    } catch (error) {
      console.error("Error calculating stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Residents</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalResidents}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recent Additions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.recentAdditions}</p>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Age</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageAge}</p>
              <p className="text-xs text-gray-500">years</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</p>
              <p className="text-xs text-gray-500">of capacity</p>
            </div>
          </div>
        </div>
      </div>

      {/* Program Distribution */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(stats.programDistribution).map(([program, count]) => (
            <div key={program} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{program}</span>
              <span className="text-lg font-bold text-blue-600">{count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 