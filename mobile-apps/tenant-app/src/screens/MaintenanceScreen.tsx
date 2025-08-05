import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface MaintenanceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  status: 'Pending' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  estimatedCompletion?: string;
}

const mockMaintenanceRequests: MaintenanceRequest[] = [
  {
    id: '1',
    title: 'Kitchen Sink Leak',
    description: 'Sink is leaking under the cabinet, causing water damage',
    category: 'Plumbing',
    priority: 'High',
    status: 'In Progress',
    createdAt: '2024-07-28',
    updatedAt: '2024-07-29',
    assignedTo: 'Mike Johnson',
    estimatedCompletion: '2024-07-31',
  },
  {
    id: '2',
    title: 'AC Not Cooling',
    description: 'Air conditioning unit is not cooling properly',
    category: 'HVAC',
    priority: 'Medium',
    status: 'Pending',
    createdAt: '2024-07-29',
    updatedAt: '2024-07-29',
  },
  {
    id: '3',
    title: 'Light Bulb Replacement',
    description: 'Need new light bulbs in living room',
    category: 'Electrical',
    priority: 'Low',
    status: 'Completed',
    createdAt: '2024-07-25',
    updatedAt: '2024-07-26',
    assignedTo: 'Sarah Wilson',
  },
  {
    id: '4',
    title: 'Broken Window Lock',
    description: 'Window lock in bedroom is broken',
    category: 'General',
    priority: 'Medium',
    status: 'Pending',
    createdAt: '2024-07-30',
    updatedAt: '2024-07-30',
  },
];

const categories = ['Plumbing', 'HVAC', 'Electrical', 'General', 'Appliances', 'Structural'];
const priorities = ['Low', 'Medium', 'High', 'Emergency'];

export default function MaintenanceScreen() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>(mockMaintenanceRequests);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [newRequest, setNewRequest] = useState({
    title: '',
    description: '',
    category: 'General',
    priority: 'Medium' as const,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return '#F59E0B';
      case 'In Progress': return '#3B82F6';
      case 'Completed': return '#10B981';
      case 'Cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Emergency': return '#EF4444';
      case 'High': return '#F59E0B';
      case 'Medium': return '#3B82F6';
      case 'Low': return '#10B981';
      default: return '#6B7280';
    }
  };

  const handleSubmitRequest = () => {
    if (!newRequest.title || !newRequest.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const request: MaintenanceRequest = {
      id: Date.now().toString(),
      title: newRequest.title,
      description: newRequest.description,
      category: newRequest.category,
      priority: newRequest.priority,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
    };

    setRequests([request, ...requests]);
    setNewRequest({ title: '', description: '', category: 'General', priority: 'Medium' });
    setShowNewRequest(false);
    Alert.alert('Success', 'Maintenance request submitted successfully');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return 'time-outline';
      case 'In Progress': return 'construct-outline';
      case 'Completed': return 'checkmark-circle-outline';
      case 'Cancelled': return 'close-circle-outline';
      default: return 'help-outline';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.gradient}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Maintenance</Text>
          <TouchableOpacity
            style={styles.newRequestButton}
            onPress={() => setShowNewRequest(true)}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{requests.length}</Text>
              <Text style={styles.statLabel}>Total Requests</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {requests.filter(r => r.status === 'Pending').length}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {requests.filter(r => r.status === 'In Progress').length}
              </Text>
              <Text style={styles.statLabel}>In Progress</Text>
            </View>
          </View>

          {/* Emergency Contact */}
          <View style={styles.emergencyCard}>
            <View style={styles.emergencyHeader}>
              <Ionicons name="warning" size={24} color="#EF4444" />
              <Text style={styles.emergencyTitle}>Emergency Contact</Text>
            </View>
            <Text style={styles.emergencyText}>
              For urgent maintenance issues, call our 24/7 emergency line
            </Text>
            <TouchableOpacity style={styles.emergencyButton}>
              <Ionicons name="call" size={20} color="#FFFFFF" />
              <Text style={styles.emergencyButtonText}>Call (555) 123-4567</Text>
            </TouchableOpacity>
          </View>

          {/* Maintenance Requests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Requests</Text>
            {requests.map((request) => (
              <View key={request.id} style={styles.requestCard}>
                <View style={styles.requestHeader}>
                  <View style={styles.requestTitleContainer}>
                    <Text style={styles.requestTitle}>{request.title}</Text>
                    <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor(request.priority) }]}>
                      <Text style={styles.priorityText}>{request.priority}</Text>
                    </View>
                  </View>
                  <View style={styles.statusContainer}>
                    <Ionicons 
                      name={getStatusIcon(request.status) as any} 
                      size={20} 
                      color={getStatusColor(request.status)} 
                    />
                    <Text style={[styles.statusText, { color: getStatusColor(request.status) }]}>
                      {request.status}
                    </Text>
                  </View>
                </View>
                
                <Text style={styles.requestDescription}>{request.description}</Text>
                
                <View style={styles.requestDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="folder-outline" size={16} color="#9CA3AF" />
                    <Text style={styles.detailText}>{request.category}</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="calendar-outline" size={16} color="#9CA3AF" />
                    <Text style={styles.detailText}>Submitted: {request.createdAt}</Text>
                  </View>
                </View>

                {request.assignedTo && (
                  <View style={styles.assignedContainer}>
                    <Ionicons name="person-outline" size={16} color="#9CA3AF" />
                    <Text style={styles.assignedText}>Assigned to: {request.assignedTo}</Text>
                  </View>
                )}

                {request.estimatedCompletion && (
                  <View style={styles.estimatedContainer}>
                    <Ionicons name="time-outline" size={16} color="#9CA3AF" />
                    <Text style={styles.estimatedText}>
                      Estimated completion: {request.estimatedCompletion}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </ScrollView>

        {/* New Request Modal */}
        {showNewRequest && (
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>New Maintenance Request</Text>
                <TouchableOpacity onPress={() => setShowNewRequest(false)}>
                  <Ionicons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>

              <View style={styles.form}>
                <Text style={styles.label}>Title *</Text>
                <TextInput
                  style={styles.input}
                  value={newRequest.title}
                  onChangeText={(text) => setNewRequest({ ...newRequest, title: text })}
                  placeholder="Brief description of the issue"
                  placeholderTextColor="#9CA3AF"
                />

                <Text style={styles.label}>Description *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={newRequest.description}
                  onChangeText={(text) => setNewRequest({ ...newRequest, description: text })}
                  placeholder="Detailed description of the problem"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={4}
                />

                <Text style={styles.label}>Category</Text>
                <View style={styles.pickerContainer}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.categoryOption,
                        newRequest.category === category && styles.categoryOptionSelected
                      ]}
                      onPress={() => setNewRequest({ ...newRequest, category })}
                    >
                      <Text style={[
                        styles.categoryOptionText,
                        newRequest.category === category && styles.categoryOptionTextSelected
                      ]}>
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.label}>Priority</Text>
                <View style={styles.pickerContainer}>
                  {priorities.map((priority) => (
                    <TouchableOpacity
                      key={priority}
                      style={[
                        styles.priorityOption,
                        newRequest.priority === priority && styles.priorityOptionSelected
                      ]}
                      onPress={() => setNewRequest({ ...newRequest, priority: priority as any })}
                    >
                      <Text style={[
                        styles.priorityOptionText,
                        newRequest.priority === priority && styles.priorityOptionTextSelected
                      ]}>
                        {priority}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setShowNewRequest(false)}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleSubmitRequest}
                  >
                    <Text style={styles.submitButtonText}>Submit Request</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}
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
  newRequestButton: {
    backgroundColor: '#8B5CF6',
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
  emergencyCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  emergencyText: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 12,
  },
  emergencyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  emergencyButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  requestCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  requestTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 8,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 4,
  },
  requestDescription: {
    fontSize: 14,
    color: '#D1D5DB',
    marginBottom: 12,
  },
  requestDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  assignedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  assignedText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  estimatedContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  estimatedText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryOption: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  categoryOptionSelected: {
    backgroundColor: '#8B5CF6',
  },
  categoryOptionText: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  categoryOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  priorityOption: {
    backgroundColor: '#374151',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
  },
  priorityOptionSelected: {
    backgroundColor: '#8B5CF6',
  },
  priorityOptionText: {
    fontSize: 12,
    color: '#D1D5DB',
  },
  priorityOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#374151',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#D1D5DB',
    fontWeight: '600',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
}); 