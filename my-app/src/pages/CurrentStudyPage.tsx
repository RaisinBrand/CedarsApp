import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const devices = [
  { key: 'Reflex',   label: 'Reflex Cuff' },
  { key: 'Pressure', label: 'Pressure Plate' },
  { key: 'EIT',      label: 'EIT Cuff' },
  { key: 'Muscle',   label: 'Muscle Cuff' },
];
const modalities = ['EEG', 'MRI', 'Blood Test'];

export default function CurrentStudyPage() {
  const navigation = useNavigation();
  const [studyName, setStudyName] = useState('');
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [modality, setModality] = useState('');
  const [person, setPerson] = useState('');
  const [description, setDescription] = useState('');
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }));
  }, []);

  const onDevicePress = (deviceKey: string) => {
    setSelectedDevices(prev =>
      prev.includes(deviceKey)
        ? prev.filter(key => key !== deviceKey)
        : [...prev, deviceKey]
    );
  };

  const onSubmit = () => {
    // Placeholder for submit logic
    alert('Study created!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <FontAwesome5 name="arrow-left" size={20} color="#4A90E2" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Configure New Study</Text>
            <Text style={styles.headerSubtitle}>Enter study details</Text>
          </View>
        </View>
      </View>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.select({ ios: 'padding', android: undefined })}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Study Name */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Study Name</Text>
            <TextInput
              style={styles.input}
              value={studyName}
              onChangeText={setStudyName}
              placeholder="Enter study name"
              placeholderTextColor="#999999"
            />
          </View>
          {/* Devices Multi-select */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Devices (Multiple)</Text>
            <View style={styles.deviceList}>
              {devices.map(device => {
                const isActive = selectedDevices.includes(device.key);
                return (
                  <TouchableOpacity
                    key={device.key}
                    style={[styles.deviceCard, isActive && styles.deviceCardSelected]}
                    onPress={() => onDevicePress(device.key)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.deviceCardLabel, isActive && styles.deviceCardLabelSelected]}>
                      {device.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          {/* Modality Dropdown */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Study Type / Modality</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setDropdownVisible(true)}
              activeOpacity={0.7}
            >
              <Text style={modality ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
                {modality || 'Select modality'}
              </Text>
              <FontAwesome5 name="chevron-down" size={16} color="#666666" />
            </TouchableOpacity>
          </View>
          {/* Person Conducting Study */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Person Conducting Study</Text>
            <TextInput
              style={styles.input}
              value={person}
              onChangeText={setPerson}
              placeholder="Enter name"
              placeholderTextColor="#999999"
            />
          </View>
          {/* Start Date (auto) */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Start Date</Text>
            <Text style={styles.readonlyField}>{currentDate}</Text>
          </View>
          {/* Study Description (optional) */}
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Study Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description (optional)"
              placeholderTextColor="#999999"
              multiline
              numberOfLines={4}
            />
          </View>
          <View style={styles.bottomPadding} />
        </ScrollView>
        {/* Fixed Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={onSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitText}>Create Study</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {/* Modality Dropdown Modal */}
      <Modal
        visible={dropdownVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDropdownVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Modality</Text>
              <TouchableOpacity
                onPress={() => setDropdownVisible(false)}
                style={styles.modalCloseButton}
                activeOpacity={0.7}
              >
                <FontAwesome5 name="times" size={20} color="#666666" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalOptions}>
              {modalities.map(opt => (
                <TouchableOpacity
                  key={opt}
                  style={styles.optionButton}
                  onPress={() => {
                    setModality(opt);
                    setDropdownVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.optionText}>{opt}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.modalCancelButton}
              onPress={() => setDropdownVisible(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 86 : 66,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
    marginLeft: 8,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 32,
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginBottom: 40,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 4,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#000000',
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  deviceList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  deviceCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  deviceCardSelected: {
    backgroundColor: '#4A90E2',
    borderColor: '#4A90E2',
  },
  deviceCardLabel: {
    fontSize: 16,
    color: '#333333',
  },
  deviceCardLabelSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  dropdownButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownTextSelected: {
    color: '#000000',
    fontWeight: '500',
    fontSize: 16,
  },
  dropdownTextPlaceholder: {
    color: '#999999',
    fontSize: 16,
  },
  readonlyField: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#666',
  },
  bottomPadding: {
    height: 100,
  },
  submitContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '60%',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalOptions: {
    maxHeight: 250,
  },
  optionButton: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  modalCancelButton: {
    margin: 16,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '500',
  },
}); 