import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  unit: string;
  leaseStart: string;
  leaseEnd: string;
  rentAmount: string;
  profileImage?: string;
}

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
}

const mockUserProfile: UserProfile = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@email.com',
  phone: '(555) 123-4567',
  unit: 'Apt 302',
  leaseStart: '2024-01-15',
  leaseEnd: '2024-12-31',
  rentAmount: '$2,400/month',
};

const mockNotificationSettings: NotificationSetting[] = [
  {
    id: '1',
    title: 'Rent Due Reminders',
    description: 'Get notified 3 days before rent is due',
    enabled: true,
  },
  {
    id: '2',
    title: 'Maintenance Updates',
    description: 'Receive updates on maintenance requests',
    enabled: true,
  },
  {
    id: '3',
    title: 'Community Announcements',
    description: 'Important updates from property management',
    enabled: false,
  },
  {
    id: '4',
    title: 'Emergency Alerts',
    description: 'Critical safety and emergency notifications',
    enabled: true,
  },
  {
    id: '5',
    title: 'Payment Confirmations',
    description: 'Confirmations when payments are received',
    enabled: true,
  },
];

export default function ProfileScreen() {
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [notifications, setNotifications] = useState<NotificationSetting[]>(mockNotificationSettings);
  const [showEditProfile, setShowEditProfile] = useState(false);

  const handleNotificationToggle = (id: string) => {
    setNotifications(prev =>
      prev.map(setting =>
        setting.id === id
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => Alert.alert('Logged out') }
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Support',
      'How would you like to contact support?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => Alert.alert('Calling support...') },
        { text: 'Email', onPress: () => Alert.alert('Opening email...') },
        { text: 'Chat', onPress: () => Alert.alert('Opening chat...') }
      ]
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1F2937', '#111827']}
        style={styles.gradient}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <View style={styles.profileImage}>
                <Ionicons name="person" size={40} color="#8B5CF6" />
              </View>
              <TouchableOpacity style={styles.editImageButton}>
                <Ionicons name="camera" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
            <TouchableOpacity
              style={styles.editProfileButton}
              onPress={() => setShowEditProfile(true)}
            >
              <Ionicons name="pencil" size={16} color="#FFFFFF" />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{profile.rentAmount}</Text>
              <Text style={styles.statLabel}>Monthly Rent</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{profile.unit}</Text>
              <Text style={styles.statLabel}>Unit</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>
                {Math.ceil((new Date(profile.leaseEnd).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
              </Text>
              <Text style={styles.statLabel}>Lease Remaining</Text>
            </View>
          </View>

          {/* Lease Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lease Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color="#8B5CF6" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Lease Start</Text>
                  <Text style={styles.infoValue}>{formatDate(profile.leaseStart)}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="calendar-outline" size={20} color="#8B5CF6" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Lease End</Text>
                  <Text style={styles.infoValue}>{formatDate(profile.leaseEnd)}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="home-outline" size={20} color="#8B5CF6" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Unit</Text>
                  <Text style={styles.infoValue}>{profile.unit}</Text>
                </View>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="card-outline" size={20} color="#8B5CF6" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Monthly Rent</Text>
                  <Text style={styles.infoValue}>{profile.rentAmount}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={20} color="#8B5CF6" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{profile.email}</Text>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="mail" size={16} color="#8B5CF6" />
                </TouchableOpacity>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={20} color="#8B5CF6" />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{profile.phone}</Text>
                </View>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="call" size={16} color="#8B5CF6" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Notification Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notification Settings</Text>
            <View style={styles.infoCard}>
              {notifications.map((setting) => (
                <View key={setting.id} style={styles.notificationRow}>
                  <View style={styles.notificationInfo}>
                    <Text style={styles.notificationTitle}>{setting.title}</Text>
                    <Text style={styles.notificationDescription}>{setting.description}</Text>
                  </View>
                  <Switch
                    value={setting.enabled}
                    onValueChange={() => handleNotificationToggle(setting.id)}
                    trackColor={{ false: '#374151', true: '#8B5CF6' }}
                    thumbColor={setting.enabled ? '#FFFFFF' : '#9CA3AF'}
                  />
                </View>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsContainer}>
              <TouchableOpacity style={styles.actionCard}>
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.actionGradient}
                >
                  <Ionicons name="document-text-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.actionText}>View Lease</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <LinearGradient
                  colors={['#3B82F6', '#2563EB']}
                  style={styles.actionGradient}
                >
                  <Ionicons name="card-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.actionText}>Payment History</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.actionGradient}
                >
                  <Ionicons name="construct-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.actionText}>Maintenance</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionCard}>
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.actionGradient}
                >
                  <Ionicons name="help-circle-outline" size={24} color="#FFFFFF" />
                  <Text style={styles.actionText}>Support</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Account Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.infoCard}>
              <TouchableOpacity style={styles.accountRow}>
                <Ionicons name="shield-outline" size={20} color="#8B5CF6" />
                <Text style={styles.accountText}>Privacy & Security</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.accountRow}>
                <Ionicons name="language-outline" size={20} color="#8B5CF6" />
                <Text style={styles.accountText}>Language</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.accountRow}>
                <Ionicons name="help-circle-outline" size={20} color="#8B5CF6" />
                <Text style={styles.accountText}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.accountRow}>
                <Ionicons name="information-circle-outline" size={20} color="#8B5CF6" />
                <Text style={styles.accountText}>About</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Logout Button */}
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>

          <View style={styles.bottomSpacing} />
        </ScrollView>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#374151',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#8B5CF6',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#1F2937',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 16,
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8B5CF6',
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#374151',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  actionButton: {
    padding: 8,
  },
  notificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  notificationInfo: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 2,
  },
  notificationDescription: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  actionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    marginBottom: 12,
  },
  actionGradient: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 8,
    fontSize: 14,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#4B5563',
  },
  accountText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 12,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#374151',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  logoutText: {
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 16,
  },
  bottomSpacing: {
    height: 20,
  },
}); 