// User Dashboard - Limited access interface for general users
'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  Users, 
  Clock,
  CheckCircle
} from 'lucide-react';

interface UserDashboardProps {
  userRole: 'user';
}

interface PublicProgram {
  name: string;
  description: string;
  status: string;
  duration?: string;
  features: string[];
}

interface PublicMetrics {
  totalBeds: number;
  availableBeds: number;
  facilityStatus: string;
  programsAvailable: number;
}

export default function UserDashboard({ userRole }: UserDashboardProps) {
  const [metrics, setMetrics] = useState<PublicMetrics>({
    totalBeds: 24,
    availableBeds: 24,
    facilityStatus: 'Preparing for Opening',
    programsAvailable: 3
  });

  const [programs] = useState<PublicProgram[]>([
    {
      name: 'Veterans Recovery Program',
      description: 'Specialized support for military veterans transitioning to civilian life',
      status: 'In Development',
      duration: '6-12 months',
      features: ['Trauma-informed care', 'Job placement assistance', 'VA benefits support', 'Peer mentorship']
    },
    {
      name: 'General Recovery Housing',
      description: 'Comprehensive recovery support in a structured environment',
      status: 'In Development', 
      duration: '3-18 months',
      features: ['Individual counseling', 'Group therapy', 'Life skills training', 'Recovery planning']
    },
    {
      name: 'Re-entry Support Program',
      description: 'Helping individuals successfully transition back into the community',
      status: 'In Development',
      duration: '6-24 months', 
      features: ['Employment assistance', 'Housing transition', 'Legal support', 'Family reunification']
    }
  ]);

  const facilityFeatures = [
    'Common Kitchen & Dining Areas',
    'Living Room & Recreation Space',
    'Laundry Facilities',
    'Study & Computer Room',
    'Garden & Outdoor Patio',
    'Parking Available',
    '24/7 Security System',
    'ADA Accessible Rooms'
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Forward Horizon Recovery</h1>
          <p className="text-xl text-gray-600">Building paths to recovery and independence</p>
          <Badge variant="outline" className="mt-2">
            <Clock className="w-4 h-4 mr-1" />
            {metrics.facilityStatus}
          </Badge>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <Home className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold">{metrics.totalBeds}</div>
              <div className="text-sm text-gray-600">Total Beds</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold">{metrics.availableBeds}</div>
              <div className="text-sm text-gray-600">Available</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold">{metrics.programsAvailable}</div>
              <div className="text-sm text-gray-600">Programs</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4 text-center">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <div className="text-2xl font-bold">Soon</div>
              <div className="text-sm text-gray-600">Opening</div>
            </CardContent>
          </Card>
        </div>

        {/* Programs Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {programs.map((program, index) => (
            <Card key={index} className="h-full">
              <CardHeader>
                <CardTitle className="text-lg">{program.name}</CardTitle>
                <Badge variant="secondary">{program.status}</Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600">{program.description}</p>
                
                {program.duration && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    Duration: {program.duration}
                  </div>
                )}
                
                <div>
                  <h4 className="font-medium mb-2">Program Features:</h4>
                  <ul className="space-y-1">
                    {program.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Facility Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Home className="w-5 h-5 mr-2" />
                Facility Amenities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {facilityFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="w-3 h-3 mr-2 text-green-500" />
                    {feature}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Location & Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium">Address</h4>
                <p className="text-gray-600">Pasadena, CA<br />Los Angeles County</p>
                <p className="text-xs text-gray-500 mt-1">Exact location provided upon acceptance</p>
              </div>
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={() => window.open('tel:+16268887776', '_self')}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Call (626) 888-7776
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={() => window.open('mailto:info@theforwardhorizon.com', '_self')}
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Inquiry
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  size="sm"
                  onClick={() => window.open('https://theforwardhorizon.com', '_blank')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Get Started Online
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Getting Started Section */}
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-medium mb-2">Initial Contact</h3>
                <p className="text-sm text-gray-600">Reach out to learn about our programs and determine if Forward Horizon is right for you.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-medium mb-2">Assessment & Tour</h3>
                <p className="text-sm text-gray-600">Schedule a facility tour and complete our assessment process.</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-medium mb-2">Begin Your Journey</h3>
                <p className="text-sm text-gray-600">Move in and start your personalized recovery program with our support team.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action Footer */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Begin Your Recovery Journey?</h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Take the first step towards healing and independence. Our comprehensive programs are designed to support you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
                onClick={() => window.open('https://theforwardhorizon.com', '_blank')}
              >
                Start Your Application
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-3"
                onClick={() => window.open('tel:+16268887776', '_self')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Now: (626) 888-7776
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Visit our main website: <a 
                href="https://theforwardhorizon.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 underline font-medium"
              >
                theforwardhorizon.com
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}