'use client';
import { useState, useEffect } from 'react';
import FileUpload from './FileUpload';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'document' | 'spreadsheet' | 'other';
  size: number; // in bytes
  uploadDate: string;
  uploadedBy: string;
  category: 'medical' | 'administrative' | 'legal' | 'program' | 'resident' | 'staff';
  tags: string[];
  description?: string;
  url: string;
  residentId?: string; // if document is resident-specific
  staffId?: string; // if document is staff-specific
  programId?: string; // if document is program-specific
  version: number;
  isTemplate: boolean;
  templateCategory?: 'admission' | 'medical' | 'treatment' | 'discharge' | 'incident' | 'assessment';
}

interface DocumentFolder {
  id: string;
  name: string;
  description: string;
  category: Document['category'];
  parentId?: string;
  documentCount: number;
  createdDate: string;
  permissions: {
    read: string[];
    write: string[];
    admin: string[];
  };
}

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  category: Document['templateCategory'];
  fields: TemplateField[];
  createdBy: string;
  createdDate: string;
  isActive: boolean;
}

interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'checkbox' | 'signature';
  required: boolean;
  options?: string[]; // for select fields
  placeholder?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    pattern?: string;
  };
}

export default function DocumentManagement() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [folders, setFolders] = useState<DocumentFolder[]>([]);
  const [templates, setTemplates] = useState<DocumentTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('documents');
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockDocuments: Document[] = [
        {
          id: '1',
          name: 'John Smith - Medical History.pdf',
          type: 'pdf',
          size: 2048000, // 2MB
          uploadDate: '2024-01-20',
          uploadedBy: 'Dr. Johnson',
          category: 'medical',
          tags: ['medical history', 'admission'],
          description: 'Complete medical history for John Smith',
          url: '/documents/john-smith-medical.pdf',
          residentId: '1',
          version: 1,
          isTemplate: false
        },
        {
          id: '2',
          name: 'Incident Report Template.docx',
          type: 'document',
          size: 512000, // 512KB
          uploadDate: '2024-01-15',
          uploadedBy: 'Admin',
          category: 'administrative',
          tags: ['template', 'incident'],
          description: 'Standard template for incident reporting',
          url: '/documents/incident-template.docx',
          version: 2,
          isTemplate: true,
          templateCategory: 'incident'
        },
        {
          id: '3',
          name: 'Treatment Plan - Sarah Johnson.pdf',
          type: 'pdf',
          size: 1536000, // 1.5MB
          uploadDate: '2024-01-18',
          uploadedBy: 'Counselor Williams',
          category: 'program',
          tags: ['treatment plan', 'therapy'],
          description: 'Individualized treatment plan for Sarah Johnson',
          url: '/documents/sarah-treatment-plan.pdf',
          residentId: '2',
          version: 1,
          isTemplate: false
        },
        {
          id: '4',
          name: 'Staff Handbook 2024.pdf',
          type: 'pdf',
          size: 5120000, // 5MB
          uploadDate: '2024-01-01',
          uploadedBy: 'HR Department',
          category: 'staff',
          tags: ['handbook', 'policies'],
          description: 'Updated staff handbook for 2024',
          url: '/documents/staff-handbook-2024.pdf',
          version: 3,
          isTemplate: false
        },
        {
          id: '5',
          name: 'Program Evaluation Form.xlsx',
          type: 'spreadsheet',
          size: 256000, // 256KB
          uploadDate: '2024-01-10',
          uploadedBy: 'Program Director',
          category: 'program',
          tags: ['evaluation', 'assessment'],
          description: 'Quarterly program evaluation template',
          url: '/documents/program-evaluation.xlsx',
          version: 1,
          isTemplate: true,
          templateCategory: 'assessment'
        }
      ];

      const mockFolders: DocumentFolder[] = [
        {
          id: '1',
          name: 'Medical Records',
          description: 'Patient medical histories, assessments, and treatment records',
          category: 'medical',
          documentCount: 45,
          createdDate: '2024-01-01',
          permissions: {
            read: ['doctor', 'nurse', 'admin'],
            write: ['doctor', 'nurse'],
            admin: ['admin', 'medical_director']
          }
        },
        {
          id: '2',
          name: 'Administrative Files',
          description: 'Policies, procedures, and administrative documents',
          category: 'administrative',
          documentCount: 23,
          createdDate: '2024-01-01',
          permissions: {
            read: ['all'],
            write: ['admin', 'manager'],
            admin: ['admin']
          }
        },
        {
          id: '3',
          name: 'Program Documents',
          description: 'Treatment programs, curricula, and program-related materials',
          category: 'program',
          documentCount: 67,
          createdDate: '2024-01-01',
          permissions: {
            read: ['therapist', 'counselor', 'admin'],
            write: ['therapist', 'counselor', 'program_director'],
            admin: ['admin', 'program_director']
          }
        },
        {
          id: '4',
          name: 'Legal Documents',
          description: 'Contracts, compliance documents, and legal paperwork',
          category: 'legal',
          documentCount: 12,
          createdDate: '2024-01-01',
          permissions: {
            read: ['admin', 'legal'],
            write: ['admin', 'legal'],
            admin: ['admin', 'legal_director']
          }
        }
      ];

      const mockTemplates: DocumentTemplate[] = [
        {
          id: '1',
          name: 'Admission Assessment Form',
          description: 'Initial assessment for new residents',
          category: 'admission',
          createdBy: 'Admin',
          createdDate: '2024-01-01',
          isActive: true,
          fields: [
            {
              id: '1',
              label: 'Resident Name',
              type: 'text',
              required: true,
              placeholder: 'Enter full name'
            },
            {
              id: '2',
              label: 'Admission Date',
              type: 'date',
              required: true
            },
            {
              id: '3',
              label: 'Primary Concerns',
              type: 'textarea',
              required: true,
              placeholder: 'Describe primary concerns and treatment goals'
            },
            {
              id: '4',
              label: 'Insurance Provider',
              type: 'select',
              required: false,
              options: ['Aetna', 'Blue Cross', 'Cigna', 'Medicare', 'Medicaid', 'Other']
            }
          ]
        },
        {
          id: '2',
          name: 'Incident Report Form',
          description: 'Report for documenting facility incidents',
          category: 'incident',
          createdBy: 'Safety Officer',
          createdDate: '2024-01-01',
          isActive: true,
          fields: [
            {
              id: '1',
              label: 'Incident Date/Time',
              type: 'date',
              required: true
            },
            {
              id: '2',
              label: 'Location',
              type: 'text',
              required: true,
              placeholder: 'Where did the incident occur?'
            },
            {
              id: '3',
              label: 'Description',
              type: 'textarea',
              required: true,
              placeholder: 'Detailed description of the incident'
            },
            {
              id: '4',
              label: 'Severity Level',
              type: 'select',
              required: true,
              options: ['Low', 'Medium', 'High', 'Critical']
            },
            {
              id: '5',
              label: 'Immediate Action Taken',
              type: 'checkbox',
              required: false
            }
          ]
        }
      ];

      setDocuments(mockDocuments);
      setFolders(mockFolders);
      setTemplates(mockTemplates);
      setLoading(false);
    }, 800);
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
    const matchesFolder = !selectedFolder || doc.category === folders.find(f => f.id === selectedFolder)?.category;
    return matchesSearch && matchesCategory && matchesFolder;
  });

  const getFileIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return (
          <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.267 14.68c-.184 0-.308.018-.372.036v1.178c.076.018.171.023.302.023.479 0 .774-.242.774-.651 0-.366-.254-.586-.704-.586zm3.487.012c-.2 0-.33.018-.407.036v2.61c.077.018.201.018.313.018.817.006 1.349-.444 1.349-1.396.006-.83-.479-1.268-1.255-1.268z"/>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM9.498 16.19c-.309.29-.765.42-1.296.42a2.23 2.23 0 0 1-.308-.018v1.426H7v-3.936A7.558 7.558 0 0 1 8.219 14c.557 0 .953.106 1.22.319.254.202.426.533.426.923-.001.392-.131.723-.367.948zm3.807 1.355c-.42.349-1.059.515-1.84.515-.468 0-.799-.03-1.024-.06v-3.917A7.947 7.947 0 0 1 11.66 14c.757 0 1.249.136 1.633.426.415.308.675.799.675 1.504 0 .763-.279 1.29-.663 1.615zM17 14.77h-1.532v.911H16.9v.734h-1.432v1.604h-.906V14.03H17v.74zM14 9h-1V4l5 5h-4z"/>
          </svg>
        );
      case 'image':
        return (
          <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/>
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H5l3.5-4.5z"/>
          </svg>
        );
      case 'document':
        return (
          <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
      case 'spreadsheet':
        return (
          <svg className="w-8 h-8 text-green-700" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
            <path d="M9.5,11H7.5V13H9.5V11M16.5,11H14.5V13H16.5V11M9.5,14H7.5V16H9.5V14M16.5,14H14.5V16H16.5V14M12,11H10V13H12V11M12,14H10V16H12V14" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getCategoryColor = (category: Document['category']) => {
    switch (category) {
      case 'medical': return 'bg-red-100 text-red-800';
      case 'administrative': return 'bg-blue-100 text-blue-800';
      case 'legal': return 'bg-purple-100 text-purple-800';
      case 'program': return 'bg-green-100 text-green-800';
      case 'resident': return 'bg-yellow-100 text-yellow-800';
      case 'staff': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = (files: File[], metadata: any) => {
    // Simulate creating new documents from uploaded files
    const newDocuments: Document[] = files.map((file, index) => ({
      id: (documents.length + index + 1).toString(),
      name: file.name,
      type: getFileType(file.name),
      size: file.size,
      uploadDate: new Date().toISOString().split('T')[0],
      uploadedBy: 'Current User',
      category: metadata.category,
      tags: metadata.tags,
      description: metadata.description,
      url: `/documents/${file.name}`,
      version: 1,
      isTemplate: metadata.isTemplate,
      templateCategory: metadata.templateCategory,
      residentId: metadata.residentId,
      staffId: metadata.staffId,
      programId: metadata.programId
    }));

    setDocuments(prev => [...prev, ...newDocuments]);
  };

  const getFileType = (fileName: string): Document['type'] => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf': return 'pdf';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif': return 'image';
      case 'doc':
      case 'docx': return 'document';
      case 'xlsx':
      case 'xls': return 'spreadsheet';
      default: return 'other';
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Document Management</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">Store, organize, and manage facility documents securely</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-sm sm:text-base"
            >
              Upload Document
            </button>
            <button
              onClick={() => setShowTemplateModal(true)}
              className="px-4 sm:px-6 py-2 sm:py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium text-sm sm:text-base"
            >
              Create from Template
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{documents.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Folders</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{folders.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Templates</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{templates.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-orange-100 rounded-lg">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
              </div>
              <div className="ml-2 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">Storage Used</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {formatFileSize(documents.reduce((sum, doc) => sum + doc.size, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 overflow-x-auto">
          <div className="flex min-w-max">
            {[
              { id: 'documents', label: 'Documents', count: documents.length },
              { id: 'folders', label: 'Folders', count: folders.length },
              { id: 'templates', label: 'Templates', count: templates.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 sm:px-6 py-3 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div className="space-y-4 sm:space-y-6">
            {/* Search and Filters */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Documents</label>
                  <input
                    type="text"
                    placeholder="Search by name or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="w-full px-3 py-3 sm:py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                  >
                    <option value="all">All Categories</option>
                    <option value="medical">Medical</option>
                    <option value="administrative">Administrative</option>
                    <option value="legal">Legal</option>
                    <option value="program">Program</option>
                    <option value="resident">Resident</option>
                    <option value="staff">Staff</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">View</label>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                        viewMode === 'list'
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      List
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Documents Grid/List */}
            {filteredDocuments.length === 0 ? (
              <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow-sm border border-gray-200">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
                <p className="text-gray-500">Try adjusting your search or filter criteria</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredDocuments.map((document) => (
                  <div
                    key={document.id}
                    onClick={() => setSelectedDocument(document)}
                    className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-shrink-0">
                        {getFileIcon(document.type)}
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(document.category)}`}>
                        {document.category}
                      </span>
                    </div>
                    
                    <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
                      {document.name}
                    </h3>
                    
                    <div className="space-y-2 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Size:</span>
                        <span>{formatFileSize(document.size)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Uploaded:</span>
                        <span>{new Date(document.uploadDate).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>By:</span>
                        <span className="truncate ml-2">{document.uploadedBy}</span>
                      </div>
                    </div>
                    
                    {document.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {document.tags.slice(0, 2).map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                        {document.tags.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            +{document.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredDocuments.map((document) => (
                        <tr key={document.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 mr-3">
                                {getFileIcon(document.type)}
                              </div>
                              <div>
                                <div className="text-sm font-medium text-gray-900">{document.name}</div>
                                <div className="text-sm text-gray-500">v{document.version}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(document.category)}`}>
                              {document.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatFileSize(document.size)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div>{new Date(document.uploadDate).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">{document.uploadedBy}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => setSelectedDocument(document)}
                              className="text-blue-600 hover:text-blue-900 mr-3"
                            >
                              View
                            </button>
                            <button className="text-green-600 hover:text-green-900 mr-3">
                              Download
                            </button>
                            <button className="text-red-600 hover:text-red-900">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card Layout for List View */}
                <div className="block sm:hidden divide-y divide-gray-200">
                  {filteredDocuments.map((document) => (
                    <div key={document.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 mr-3">
                            {getFileIcon(document.type)}
                          </div>
                          <div>
                            <h3 className="text-sm font-medium text-gray-900 truncate">{document.name}</h3>
                            <p className="text-xs text-gray-500">v{document.version}</p>
                          </div>
                        </div>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(document.category)}`}>
                          {document.category}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-xs mb-3">
                        <div>
                          <span className="text-gray-500">Size:</span>
                          <p className="font-medium text-gray-900">{formatFileSize(document.size)}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Uploaded:</span>
                          <p className="font-medium text-gray-900">{new Date(document.uploadDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-end space-x-3 pt-3 border-t border-gray-100">
                        <button
                          onClick={() => setSelectedDocument(document)}
                          className="text-xs text-blue-600 hover:text-blue-900 font-medium"
                        >
                          View
                        </button>
                        <button className="text-xs text-green-600 hover:text-green-900 font-medium">
                          Download
                        </button>
                        <button className="text-xs text-red-600 hover:text-red-900 font-medium">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Folders Tab - Placeholder */}
        {activeTab === 'folders' && (
          <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow-sm border border-gray-200">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Folder Management</h3>
            <p className="text-gray-600">Organize your documents into structured folders with access controls</p>
          </div>
        )}

        {/* Templates Tab - Placeholder */}
        {activeTab === 'templates' && (
          <div className="bg-white rounded-xl p-8 sm:p-12 text-center shadow-sm border border-gray-200">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Document Templates</h3>
            <p className="text-gray-600">Create and manage reusable document templates for common forms and reports</p>
          </div>
        )}

        {/* Document Upload Modal */}
        {showUploadModal && (
          <FileUpload
            onFileUpload={handleFileUpload}
            onClose={() => setShowUploadModal(false)}
            acceptedTypes={['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png', '.xlsx', '.xls']}
            maxFileSize={10 * 1024 * 1024} // 10MB
            maxFiles={5}
          />
        )}

        {/* Template Modal Placeholder */}
        {showTemplateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
              <div className="flex justify-between items-center p-4 sm:p-6 border-b">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">Create from Template</h2>
                <button
                  onClick={() => setShowTemplateModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 sm:p-6">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Template System</h3>
                  <p className="text-gray-600">Template creation and management functionality will be implemented next</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}