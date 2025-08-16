'use client';
import { useState } from 'react';

interface Document {
  id: number;
  name: string;
  type: 'legal' | 'medical' | 'personal' | 'program' | 'financial' | 'administrative';
  category: string;
  uploadedBy: string;
  uploadedAt: string;
  size: number;
  fileType: string;
  associatedWith: 'resident' | 'staff' | 'facility';
  associatedId?: number;
  associatedName?: string;
  status: 'active' | 'archived' | 'expired';
  expirationDate?: string;
  description?: string;
  tags: string[];
  isConfidential: boolean;
  accessLevel: 'public' | 'staff' | 'medical' | 'admin';
}

interface Folder {
  id: number;
  name: string;
  parentId?: number;
  type: 'resident' | 'staff' | 'facility' | 'templates';
  documentCount: number;
  createdAt: string;
  accessLevel: 'public' | 'staff' | 'medical' | 'admin';
}

export default function DocumentsContent() {
  const [activeTab, setActiveTab] = useState<'browse' | 'upload' | 'templates' | 'search'>('browse');
  const [selectedFolder, setSelectedFolder] = useState<number | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock documents data
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: 1,
      name: 'Birth Certificate - John Smith.pdf',
      type: 'legal',
      category: 'Identification',
      uploadedBy: 'Sarah Wilson',
      uploadedAt: '2024-07-20T10:30:00Z',
      size: 2456789,
      fileType: 'PDF',
      associatedWith: 'resident',
      associatedId: 1,
      associatedName: 'John Smith',
      status: 'active',
      description: 'Official birth certificate for identification purposes',
      tags: ['identification', 'legal', 'required'],
      isConfidential: false,
      accessLevel: 'staff'
    },
    {
      id: 2,
      name: 'Medical History - John Smith.docx',
      type: 'medical',
      category: 'Medical Records',
      uploadedBy: 'Dr. Sarah Wilson',
      uploadedAt: '2024-07-19T14:15:00Z',
      size: 1234567,
      fileType: 'DOCX',
      associatedWith: 'resident',
      associatedId: 1,
      associatedName: 'John Smith',
      status: 'active',
      description: 'Complete medical history and current conditions',
      tags: ['medical', 'history', 'confidential'],
      isConfidential: true,
      accessLevel: 'medical'
    },
    {
      id: 3,
      name: 'Court Order - Michael Brown.pdf',
      type: 'legal',
      category: 'Legal Documents',
      uploadedBy: 'James Rodriguez',
      uploadedAt: '2024-07-18T09:45:00Z',
      size: 3456789,
      fileType: 'PDF',
      associatedWith: 'resident',
      associatedId: 3,
      associatedName: 'Michael Brown',
      status: 'active',
      expirationDate: '2025-07-18',
      description: 'Court mandated treatment order',
      tags: ['legal', 'court', 'mandate'],
      isConfidential: false,
      accessLevel: 'staff'
    },
    {
      id: 4,
      name: 'Insurance Card - Sarah Johnson.jpg',
      type: 'financial',
      category: 'Insurance',
      uploadedBy: 'David Chen',
      uploadedAt: '2024-07-17T16:20:00Z',
      size: 891234,
      fileType: 'JPG',
      associatedWith: 'resident',
      associatedId: 2,
      associatedName: 'Sarah Johnson',
      status: 'active',
      expirationDate: '2024-12-31',
      description: 'Health insurance coverage information',
      tags: ['insurance', 'financial', 'health'],
      isConfidential: false,
      accessLevel: 'staff'
    },
    {
      id: 5,
      name: 'Program Completion Certificate.pdf',
      type: 'program',
      category: 'Certificates',
      uploadedBy: 'Sarah Wilson',
      uploadedAt: '2024-07-16T11:30:00Z',
      size: 1567890,
      fileType: 'PDF',
      associatedWith: 'facility',
      status: 'active',
      description: 'Template for program completion certificates',
      tags: ['template', 'certificate', 'program'],
      isConfidential: false,
      accessLevel: 'staff'
    },
    {
      id: 6,
      name: 'Staff License - Dr. Wilson.pdf',
      type: 'administrative',
      category: 'Staff Credentials',
      uploadedBy: 'David Chen',
      uploadedAt: '2024-07-15T13:45:00Z',
      size: 2345678,
      fileType: 'PDF',
      associatedWith: 'staff',
      associatedId: 1,
      associatedName: 'Dr. Sarah Wilson',
      status: 'active',
      expirationDate: '2025-01-15',
      description: 'Professional medical license',
      tags: ['license', 'credentials', 'medical'],
      isConfidential: false,
      accessLevel: 'admin'
    }
  ]);

  // Mock folders data
  const [folders, setFolders] = useState<Folder[]>([
    {
      id: 1,
      name: 'Resident Files',
      type: 'resident',
      documentCount: 15,
      createdAt: '2024-01-01T00:00:00Z',
      accessLevel: 'staff'
    },
    {
      id: 2,
      name: 'Staff Documents',
      type: 'staff',
      documentCount: 8,
      createdAt: '2024-01-01T00:00:00Z',
      accessLevel: 'admin'
    },
    {
      id: 3,
      name: 'Legal Documents',
      parentId: 1,
      type: 'resident',
      documentCount: 6,
      createdAt: '2024-01-15T00:00:00Z',
      accessLevel: 'staff'
    },
    {
      id: 4,
      name: 'Medical Records',
      parentId: 1,
      type: 'resident',
      documentCount: 12,
      createdAt: '2024-01-15T00:00:00Z',
      accessLevel: 'medical'
    },
    {
      id: 5,
      name: 'Templates',
      type: 'templates',
      documentCount: 5,
      createdAt: '2024-01-01T00:00:00Z',
      accessLevel: 'staff'
    },
    {
      id: 6,
      name: 'Facility Documents',
      type: 'facility',
      documentCount: 10,
      createdAt: '2024-01-01T00:00:00Z',
      accessLevel: 'admin'
    }
  ]);

  const [uploadForm, setUploadForm] = useState({
    name: '',
    type: 'personal' as Document['type'],
    category: '',
    associatedWith: 'resident' as Document['associatedWith'],
    associatedId: '',
    description: '',
    tags: '',
    isConfidential: false,
    accessLevel: 'staff' as Document['accessLevel'],
    expirationDate: ''
  });

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'legal': return 'bg-red-100 text-red-800';
      case 'medical': return 'bg-blue-100 text-blue-800';
      case 'personal': return 'bg-green-100 text-green-800';
      case 'program': return 'bg-purple-100 text-purple-800';
      case 'financial': return 'bg-yellow-100 text-yellow-800';
      case 'administrative': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAccessLevelColor = (level: string) => {
    switch (level) {
      case 'public': return 'bg-green-100 text-green-800';
      case 'staff': return 'bg-blue-100 text-blue-800';
      case 'medical': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    switch (fileType.toLowerCase()) {
      case 'pdf':
        return (
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18h12V6l-4-4H4v16zm8-14v3h3l-3-3z"/>
          </svg>
        );
      case 'docx':
      case 'doc':
        return (
          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18h12V6l-4-4H4v16zm8-14v3h3l-3-3z"/>
          </svg>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
        return (
          <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3h12c.6 0 1 .4 1 1v12c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1V4c0-.6.4-1 1-1zm8 2l-4 5 2 2 7-8z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18h12V6l-4-4H4v16zm8-14v3h3l-3-3z"/>
          </svg>
        );
    }
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesSearch = searchQuery === '' || 
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFolder = selectedFolder === null || 
      (selectedFolder === 1 && doc.associatedWith === 'resident') ||
      (selectedFolder === 2 && doc.associatedWith === 'staff') ||
      (selectedFolder === 5 && doc.tags.includes('template')) ||
      (selectedFolder === 6 && doc.associatedWith === 'facility');
    return matchesType && matchesSearch && matchesFolder;
  });

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate file upload
    const newDocument: Document = {
      id: Date.now(),
      name: uploadForm.name,
      type: uploadForm.type,
      category: uploadForm.category,
      uploadedBy: 'Current User',
      uploadedAt: new Date().toISOString(),
      size: Math.floor(Math.random() * 5000000) + 100000,
      fileType: 'PDF',
      associatedWith: uploadForm.associatedWith,
      associatedId: uploadForm.associatedId ? parseInt(uploadForm.associatedId) : undefined,
      status: 'active',
      description: uploadForm.description,
      tags: uploadForm.tags.split(',').map(tag => tag.trim()),
      isConfidential: uploadForm.isConfidential,
      accessLevel: uploadForm.accessLevel,
      expirationDate: uploadForm.expirationDate || undefined
    };
    setDocuments([newDocument, ...documents]);
    setUploadForm({
      name: '',
      type: 'personal',
      category: '',
      associatedWith: 'resident',
      associatedId: '',
      description: '',
      tags: '',
      isConfidential: false,
      accessLevel: 'staff',
      expirationDate: ''
    });
    setShowUploadModal(false);
  };

  const isExpiringSoon = (doc: Document) => {
    if (!doc.expirationDate) return false;
    const expirationDate = new Date(doc.expirationDate);
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    return expirationDate <= thirtyDaysFromNow;
  };

  const expiringDocuments = documents.filter(isExpiringSoon);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Document Management</h2>
            <p className="text-gray-600">Manage and organize all facility documents</p>
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Upload Document
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
              Create Folder
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mt-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'browse'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Browse Files
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'search'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Search & Filter
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === 'templates'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Templates
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Documents</p>
              <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Confidential Files</p>
              <p className="text-3xl font-bold text-red-600">{documents.filter(d => d.isConfidential).length}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-3xl font-bold text-yellow-600">{expiringDocuments.length}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.98-.833-2.75 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Storage Used</p>
              <p className="text-3xl font-bold text-purple-600">1.2GB</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Folders */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Folders</h3>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedFolder(null)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  selectedFolder === null
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                  </svg>
                  All Documents
                </div>
              </button>
              {folders.map((folder) => (
                <button
                  key={folder.id}
                  onClick={() => setSelectedFolder(folder.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    selectedFolder === folder.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"/>
                      </svg>
                      {folder.name}
                    </div>
                    <span className="text-xs text-gray-500">{folder.documentCount}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Expiring Documents Alert */}
            {expiringDocuments.length > 0 && (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <svg className="w-4 h-4 text-yellow-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"/>
                  </svg>
                  <h4 className="text-sm font-medium text-yellow-800">Expiring Soon</h4>
                </div>
                <p className="text-xs text-yellow-700">{expiringDocuments.length} documents expire within 30 days</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Search and Filters */}
            {activeTab === 'search' && (
              <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search documents..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="legal">Legal</option>
                      <option value="medical">Medical</option>
                      <option value="personal">Personal</option>
                      <option value="program">Program</option>
                      <option value="financial">Financial</option>
                      <option value="administrative">Administrative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">View</label>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setViewMode('list')}
                        className={`px-3 py-2 rounded-md text-sm ${
                          viewMode === 'list'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        List
                      </button>
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`px-3 py-2 rounded-md text-sm ${
                          viewMode === 'grid'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Grid
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Document List/Grid */}
            <div className="p-6">
              {activeTab === 'templates' ? (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Templates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {documents.filter(d => d.tags.includes('template')).map((template) => (
                      <div key={template.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center mb-3">
                          {getFileIcon(template.fileType)}
                          <div className="ml-3">
                            <h4 className="font-medium text-gray-900">{template.name}</h4>
                            <p className="text-sm text-gray-500">{template.category}</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <div className="flex space-x-2">
                          <button className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                            Use Template
                          </button>
                          <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm">
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDocuments.map((document) => (
                    <div
                      key={document.id}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => {
                        setSelectedDocument(document);
                        setShowDocumentModal(true);
                      }}
                    >
                      <div className="flex items-center mb-3">
                        {getFileIcon(document.fileType)}
                        <div className="ml-3 flex-1">
                          <h4 className="font-medium text-gray-900 truncate">{document.name}</h4>
                          <p className="text-sm text-gray-500">{formatFileSize(document.size)}</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(document.type)}`}>
                            {document.type}
                          </span>
                          {document.isConfidential && (
                            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/>
                            </svg>
                          )}
                        </div>
                        
                        {document.expirationDate && (
                          <div className={`text-xs ${isExpiringSoon(document) ? 'text-red-600' : 'text-gray-500'}`}>
                            Expires: {new Date(document.expirationDate).toLocaleDateString()}
                          </div>
                        )}
                        
                        <div className="text-xs text-gray-500">
                          {new Date(document.uploadedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Document
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Associated With
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Uploaded
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDocuments.map((document) => (
                        <tr key={document.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {getFileIcon(document.fileType)}
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{document.name}</div>
                                <div className="text-sm text-gray-500">{formatFileSize(document.size)}</div>
                              </div>
                              {document.isConfidential && (
                                <svg className="w-4 h-4 text-red-500 ml-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"/>
                                </svg>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeColor(document.type)}`}>
                              {document.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {document.associatedName || document.associatedWith}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {new Date(document.uploadedAt).toLocaleDateString()}
                            </div>
                            <div className="text-sm text-gray-500">by {document.uploadedBy}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(document.status)}`}>
                              {document.status}
                            </span>
                            {document.expirationDate && isExpiringSoon(document) && (
                              <div className="text-xs text-red-600 mt-1">
                                Expires: {new Date(document.expirationDate).toLocaleDateString()}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => {
                                setSelectedDocument(document);
                                setShowDocumentModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              View
                            </button>
                            <button className="text-gray-600 hover:text-gray-900">
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              {/* File Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-gray-600 mb-2">Drop files here or click to browse</p>
                <input type="file" className="hidden" />
                <button type="button" className="text-blue-600 hover:text-blue-800">Choose File</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={uploadForm.name}
                    onChange={(e) => setUploadForm({...uploadForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Document Type *
                  </label>
                  <select
                    required
                    value={uploadForm.type}
                    onChange={(e) => setUploadForm({...uploadForm, type: e.target.value as Document['type']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="personal">Personal</option>
                    <option value="legal">Legal</option>
                    <option value="medical">Medical</option>
                    <option value="program">Program</option>
                    <option value="financial">Financial</option>
                    <option value="administrative">Administrative</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={uploadForm.category}
                    onChange={(e) => setUploadForm({...uploadForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., ID Documents, Insurance"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Access Level *
                  </label>
                  <select
                    required
                    value={uploadForm.accessLevel}
                    onChange={(e) => setUploadForm({...uploadForm, accessLevel: e.target.value as Document['accessLevel']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="public">Public</option>
                    <option value="staff">Staff Only</option>
                    <option value="medical">Medical Staff Only</option>
                    <option value="admin">Admin Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Associated With
                  </label>
                  <select
                    value={uploadForm.associatedWith}
                    onChange={(e) => setUploadForm({...uploadForm, associatedWith: e.target.value as Document['associatedWith']})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="resident">Resident</option>
                    <option value="staff">Staff</option>
                    <option value="facility">Facility</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="date"
                    value={uploadForm.expirationDate}
                    onChange={(e) => setUploadForm({...uploadForm, expirationDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Brief description of the document"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <input
                  type="text"
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Comma-separated tags (e.g., urgent, identification, medical)"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="confidential"
                  checked={uploadForm.isConfidential}
                  onChange={(e) => setUploadForm({...uploadForm, isConfidential: e.target.checked})}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="confidential" className="ml-2 text-sm text-gray-700">
                  Mark as confidential
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Details Modal */}
      {showDocumentModal && selectedDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Document Details</h3>
              <button
                onClick={() => setShowDocumentModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Document Information</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{selectedDocument.name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Type</label>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(selectedDocument.type)}`}>
                        {selectedDocument.type}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Size</label>
                      <p className="text-gray-900">{formatFileSize(selectedDocument.size)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="text-gray-900">{selectedDocument.category}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Description</label>
                    <p className="text-gray-900">{selectedDocument.description || 'No description'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Tags</label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {selectedDocument.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Access & Status</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Status</label>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedDocument.status)}`}>
                        {selectedDocument.status}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Access Level</label>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getAccessLevelColor(selectedDocument.accessLevel)}`}>
                        {selectedDocument.accessLevel}
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Confidential</label>
                    <p className="text-gray-900">{selectedDocument.isConfidential ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Associated With</label>
                    <p className="text-gray-900">
                      {selectedDocument.associatedName || selectedDocument.associatedWith}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Uploaded By</label>
                    <p className="text-gray-900">{selectedDocument.uploadedBy}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Upload Date</label>
                    <p className="text-gray-900">{new Date(selectedDocument.uploadedAt).toLocaleDateString()}</p>
                  </div>
                  {selectedDocument.expirationDate && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Expiration Date</label>
                      <p className={`${isExpiringSoon(selectedDocument) ? 'text-red-600' : 'text-gray-900'}`}>
                        {new Date(selectedDocument.expirationDate).toLocaleDateString()}
                        {isExpiringSoon(selectedDocument) && ' (Expiring Soon)'}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-gray-200">
              <button
                onClick={() => setShowDocumentModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Download
              </button>
              <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}