import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Document {
  id: string;
  title: string;
  category: string;
  type: string;
  size: string;
  uploadedAt: string;
  isNew?: boolean;
  isImportant?: boolean;
}

const mockDocuments: Document[] = [
  {
    id: '1',
    title: 'Lease Agreement - 2024',
    category: 'Legal',
    type: 'PDF',
    size: '2.4 MB',
    uploadedAt: '2024-07-15',
    isImportant: true,
  },
  {
    id: '2',
    title: 'Move-in Checklist',
    category: 'Forms',
    type: 'PDF',
    size: '1.2 MB',
    uploadedAt: '2024-07-20',
  },
  {
    id: '3',
    title: 'Maintenance Request Form',
    category: 'Forms',
    type: 'PDF',
    size: '856 KB',
    uploadedAt: '2024-07-25',
  },
  {
    id: '4',
    title: 'Community Guidelines',
    category: 'Policies',
    type: 'PDF',
    size: '3.1 MB',
    uploadedAt: '2024-07-10',
  },
  {
    id: '5',
    title: 'Emergency Contact List',
    category: 'Important',
    type: 'PDF',
    size: '512 KB',
    uploadedAt: '2024-07-28',
    isImportant: true,
  },
  {
    id: '6',
    title: 'Parking Permit Application',
    category: 'Forms',
    type: 'PDF',
    size: '1.8 MB',
    uploadedAt: '2024-07-22',
  },
  {
    id: '7',
    title: 'Pet Policy Agreement',
    category: 'Policies',
    type: 'PDF',
    size: '1.5 MB',
    uploadedAt: '2024-07-18',
  },
  {
    id: '8',
    title: 'Rent Payment Instructions',
    category: 'Important',
    type: 'PDF',
    size: '2.1 MB',
    uploadedAt: '2024-07-30',
    isNew: true,
    isImportant: true,
  },
];

const categories = ['All', 'Legal', 'Forms', 'Policies', 'Important'];

export default function DocumentsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDocuments = documents.filter(doc => {
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownload = (document: Document) => {
    Alert.alert(
      'Download Document',
      `Would you like to download "${document.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Download', 
          onPress: () => {
            // Simulate download
            Alert.alert('Success', 'Document downloaded successfully');
          }
        }
      ]
    );
  };

  const handleShare = (document: Document) => {
    Alert.alert(
      'Share Document',
      `Would you like to share "${document.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Share', 
          onPress: () => {
            Alert.alert('Success', 'Document shared successfully');
          }
        }
      ]
    );
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Legal': return 'document-text';
      case 'Forms': return 'clipboard';
      case 'Policies': return 'library';
      case 'Important': return 'star';
      default: return 'document';
    }
  };

  const getFileTypeColor = (type: string) => {
    switch (type) {
      case 'PDF': return '#EF4444';
      case 'DOC': return '#3B82F6';
      case 'XLS': return '#10B981';
      case 'JPG': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  const renderDocument = ({ item }: { item: Document }) => (
    <View style={styles.documentCard}>
      <View style={styles.documentHeader}>
        <View style={styles.documentInfo}>
          <View style={styles.documentTitleContainer}>
            <Text style={styles.documentTitle}>{item.title}</Text>
            {item.isNew && (
              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            )}
            {item.isImportant && (
              <Ionicons name="star" size={16} color="#F59E0B" style={styles.importantIcon} />
            )}
          </View>
          <View style={styles.documentMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="folder-outline" size={14} color="#9CA3AF" />
              <Text style={styles.metaText}>{item.category}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color="#9CA3AF" />
              <Text style={styles.metaText}>{item.uploadedAt}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="document-outline" size={14} color="#9CA3AF" />
              <Text style={styles.metaText}>{item.size}</Text>
            </View>
          </View>
        </View>
        <View style={[styles.fileTypeBadge, { backgroundColor: getFileTypeColor(item.type) }]}>
          <Text style={styles.fileTypeText}>{item.type}</Text>
        </View>
      </View>
      
      <View style={styles.documentActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDownload(item)}
        >
          <Ionicons name="download-outline" size={20} color="#8B5CF6" />
          <Text style={styles.actionButtonText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleShare(item)}
        >
          <Ionicons name="share-outline" size={20} color="#8B5CF6" />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Preview', `Previewing ${item.title}`)}
        >
          <Ionicons name="eye-outline" size={20} color="#8B5CF6" />
          <Text style={styles.actionButtonText}>Preview</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Documents</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{documents.length}</Text>
              <Text style={styles.statLabel}>Total Documents</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {documents.filter(d => d.isImportant).length}
              </Text>
              <Text style={styles.statLabel}>Important</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {documents.filter(d => d.isNew).length}
              </Text>
              <Text style={styles.statLabel}>New</Text>
            </View>
          </View>

          {/* Category Filter */}
          <View style={styles.categoryContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category && styles.categoryButtonSelected
                  ]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Ionicons
                    name={getCategoryIcon(category) as any}
                    size={16}
                    color={selectedCategory === category ? '#FFFFFF' : '#9CA3AF'}
                  />
                  <Text style={[
                    styles.categoryButtonText,
                    selectedCategory === category && styles.categoryButtonTextSelected
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActionsContainer}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickActionButton}>
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>Upload Document</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickActionButton}>
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  style={styles.quickActionGradient}
                >
                  <Ionicons name="folder-open-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>Request Document</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Documents List */}
          <View style={styles.documentsSection}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'All' ? 'All Documents' : `${selectedCategory} Documents`}
              <Text style={styles.documentCount}> ({filteredDocuments.length})</Text>
            </Text>
            
            <FlatList
              data={filteredDocuments}
              renderItem={renderDocument}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.documentsList}
            />
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  searchButton: {
    backgroundColor: '#374151',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  categoryButtonSelected: {
    backgroundColor: '#8B5CF6',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginLeft: 6,
    fontWeight: '500',
  },
  categoryButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  quickActionsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  quickActionGradient: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  quickActionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 8,
    fontSize: 12,
  },
  documentsSection: {
    flex: 1,
  },
  documentCount: {
    color: '#9CA3AF',
    fontWeight: 'normal',
  },
  documentsList: {
    paddingBottom: 20,
  },
  documentCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  documentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  documentInfo: {
    flex: 1,
  },
  documentTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  newBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  newBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  importantIcon: {
    marginLeft: 8,
  },
  documentMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  fileTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  fileTypeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  documentActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#4B5563',
    paddingTop: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  actionButtonText: {
    color: '#8B5CF6',
    fontWeight: '500',
    marginLeft: 4,
    fontSize: 12,
  },
}); 