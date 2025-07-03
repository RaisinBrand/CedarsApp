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
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigationTypes';


// Generic field metadata
type Field = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'dropdown' | 'date' | 'decimal';
  options?: string[];
  min?: number;
  max?: number;
  unit?: string;
};

const devices = [
  { key: 'Reflex', label: 'Reflex Cuff' },
  { key: 'Pressure', label: 'Pressure Plate' },
  { key: 'EIT', label: 'EIT Cuff' },
  { key: 'Muscle', label: 'Muscle Cuff' },
];

const modalities = ['EEG', 'MRI', 'Blood Test'];

const ethnicityOptions = [
  'Hispanic or Latino',
  'Not Hispanic or Latino',
  'Unknown',
  'Prefer not to answer'
];

const genderIdentityOptions = [
  'Man',
  'Woman',
  'Non-binary',
  'Transgender man',
  'Transgender woman',
  'Genderfluid',
  'Agender',
  'Other',
  'Prefer not to answer'
];

const sexAssignedOptions = [
  'Male',
  'Female',
  'Intersex',
  'Prefer not to answer'
];

const sexualOrientationOptions = [
  'Heterosexual/Straight',
  'Gay',
  'Lesbian',
  'Bisexual',
  'Pansexual',
  'Asexual',
  'Queer',
  'Other',
  'Prefer not to answer'
];

export default function CurrentStudyPage() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  
  // Study configuration
  const [studyName, setStudyName] = useState('');
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [modality, setModality] = useState('');
  const [person, setPerson] = useState('');
  const [description, setDescription] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  // Patient data fields
  const [fields, setFields] = useState<Field[]>([]);
  const [values, setValues] = useState<Record<string, any>>({});
  const [dropdownField, setDropdownField] = useState<Field | null>(null);
  const [modalityDropdownVisible, setModalityDropdownVisible] = useState(false);

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

  useEffect(() => {
    const base: Field[] = [
      // Basic Demographics
      { key: 'name', label: 'Patient Name', type: 'text' },
      { key: 'birthDate', label: 'Date of Birth', type: 'date' },
      { key: 'ethnicity', label: 'Ethnicity', type: 'dropdown', options: ethnicityOptions },
      { key: 'genderIdentity', label: 'Gender Identity', type: 'dropdown', options: genderIdentityOptions },
      { key: 'sexAssigned', label: 'Sex Assigned at Birth', type: 'dropdown', options: sexAssignedOptions },
      { key: 'sexualOrientation', label: 'Sexual Orientation', type: 'dropdown', options: sexualOrientationOptions },
      
      // Anthropometric Measurements
      { key: 'height', label: 'Height', type: 'decimal', min: 50, max: 250, unit: 'cm' },
      { key: 'weight', label: 'Weight', type: 'decimal', min: 10, max: 300, unit: 'kg' },
      { key: 'waistToKnee', label: 'Waist to Knee Height', type: 'decimal', min: 10, max: 100, unit: 'cm' },
      { key: 'kneeToAnkle', label: 'Knee to Ankle Height', type: 'decimal', min: 10, max: 80, unit: 'cm' },
      { key: 'midThighGirth', label: 'Mid-Thigh Girth', type: 'decimal', min: 20, max: 100, unit: 'cm' },
      { key: 'calfGirth', label: 'Calf Girth', type: 'decimal', min: 15, max: 60, unit: 'cm' },
      { key: 'shoulderWidth', label: 'Width of Shoulders', type: 'decimal', min: 20, max: 80, unit: 'cm' },
      { key: 'hipWidth', label: 'Width of Hips', type: 'decimal', min: 15, max: 60, unit: 'cm' },
      { key: 'ankleHeight', label: 'Ankle Height', type: 'decimal', min: 3, max: 20, unit: 'cm' },
      { key: 'upperBodyHeight', label: 'Upper Body Height', type: 'decimal', min: 20, max: 150, unit: 'cm' },
      { key: 'lowerBodyHeight', label: 'Lower Body Height', type: 'decimal', min: 30, max: 150, unit: 'cm' },
      { key: 'neckHeight', label: 'Height of Neck', type: 'decimal', min: 5, max: 25, unit: 'cm' },
      { key: 'foreheadPerimeter', label: 'Perimeter of Forehead', type: 'decimal', min: 30, max: 80, unit: 'cm' },
      { key: 'armLength', label: 'Length of Arms', type: 'decimal', min: 30, max: 120, unit: 'cm' },
      
      // Cuff Info
      { key: 'serialNumber', label: 'Serial Number', type: 'text' },
    ];

    setFields(base);
    base.forEach(f => setValues(v => ({ ...v, [f.key]: v[f.key] ?? '' })));
  }, []);

  const onDevicePress = (deviceKey: string) => {
    setSelectedDevices(prev =>
      prev.includes(deviceKey)
        ? prev.filter(key => key !== deviceKey)
        : [...prev, deviceKey]
    );
  };

  const handleChange = (key: string, value: any) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };

  const onSubmit = () => {
    const studyData = {
      studyName,
      selectedDevices,
      modality,
      person,
      description,
      startDate: currentDate,
      patientData: values
    };
    console.log('Study Data:', studyData);
    alert('Study created successfully! Check console for data.');
  };

  const renderDropdown = (field: Field) => (
    <View key={field.key} style={styles.fieldContainer}>
      <Text style={styles.label}>{field.label}</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownField(field)}
        activeOpacity={0.7}
      >
        <Text style={values[field.key] ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
          {values[field.key] || `Select ${field.label}`}
        </Text>
        <FontAwesome5 name="chevron-down" size={16} color="#666666" />
      </TouchableOpacity>
    </View>
  );

  const renderField = (field: Field) => {
    const val = values[field.key];
    switch (field.type) {
      case 'number':
        return (
          <View key={field.key} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.label}
              {field.unit && <Text style={styles.unitText}> ({field.unit})</Text>}
              {field.min !== undefined && field.max !== undefined && (
                <Text style={styles.rangeText}> ({field.min}-{field.max})</Text>
              )}
            </Text>
            <TextInput
              style={styles.input}
              value={String(val)}
              onChangeText={(text) => {
                const n = parseInt(text, 10);
                if (!isNaN(n) && (field.min == null || n >= field.min) && (field.max == null || n <= field.max)) {
                  handleChange(field.key, n);
                } else if (text === '') {
                  handleChange(field.key, '');
                }
              }}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              placeholderTextColor="#999999"
              keyboardType="numeric"
            />
          </View>
        );
      case 'decimal':
        return (
          <View key={field.key} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.label}
              {field.unit && <Text style={styles.unitText}> ({field.unit})</Text>}
              {field.min !== undefined && field.max !== undefined && (
                <Text style={styles.rangeText}> ({field.min}-{field.max})</Text>
              )}
            </Text>
            <TextInput
              style={styles.input}
              value={String(val)}
              onChangeText={(text) => {
                const n = parseFloat(text);
                if (!isNaN(n) && (field.min == null || n >= field.min) && (field.max == null || n <= field.max)) {
                  handleChange(field.key, n);
                } else if (text === '' || text.endsWith('.')) {
                  handleChange(field.key, text);
                }
              }}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              placeholderTextColor="#999999"
              keyboardType="decimal-pad"
            />
          </View>
        );
      case 'dropdown':
        return renderDropdown(field);
      case 'date':
        return (
          <View key={field.key} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              value={val || ''}
              onChangeText={(text) => {
                const digits = text.replace(/\D/g, '').slice(0, 8);
                let formatted = digits;
                if (digits.length > 4) {
                  formatted = digits.slice(0, 4) + '-' + digits.slice(4);
                }
                if (digits.length > 6) {
                  formatted = formatted.slice(0, 7) + '-' + digits.slice(6);
                }
                handleChange(field.key, formatted);
              }}
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#999999"
              maxLength={10}
            />
          </View>
        );
      default:
        return (
          <View key={field.key} style={styles.fieldContainer}>
            <Text style={styles.label}>
              {field.label}
              {field.key === 'serialNumber' && <Text style={styles.exampleText}> (e.g., 9.5v1)</Text>}
            </Text>
            <TextInput
              style={styles.input}
              value={val}
              onChangeText={(text) => handleChange(field.key, text)}
              placeholder={field.key === 'serialNumber' ? 'e.g., 9.5v1' : `Enter ${field.label.toLowerCase()}`}
              placeholderTextColor="#999999"
            />
          </View>
        );
    }
  };

  const renderSectionHeader = (title: string) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionDivider} />
    </View>
  );

  // Group fields by section
  const demographicFields = fields.filter(f => 
    ['name', 'birthDate', 'ethnicity', 'genderIdentity', 'sexAssigned', 'sexualOrientation'].includes(f.key)
  );
  
  const anthropometricFields = fields.filter(f => 
    ['height', 'weight', 'waistToKnee', 'kneeToAnkle', 'midThighGirth', 'calfGirth', 'shoulderWidth', 'hipWidth', 'ankleHeight', 'upperBodyHeight', 'lowerBodyHeight', 'neckHeight', 'foreheadPerimeter', 'armLength'].includes(f.key)
  );
  
  const cuffFields = fields.filter(f => 
    f.key === 'serialNumber'
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('SelectSetting')}>
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
          {/* Study Configuration Section */}
          {renderSectionHeader('Study Configuration')}
          
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
              onPress={() => setModalityDropdownVisible(true)}
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

          {/* Patient Data Sections */}
          {renderSectionHeader('Basic Information & Demographics')}
          <View style={styles.sectionContent}>
            {demographicFields.map(renderField)}
          </View>

          {renderSectionHeader('Anthropometric Measurements')}
          <View style={styles.sectionContent}>
            {anthropometricFields.map(renderField)}
          </View>

          {renderSectionHeader('Cuff Information')}
          <View style={styles.sectionContent}>
            {cuffFields.map(renderField)}
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

      {/* Patient Data Dropdown Modal */}
      {dropdownField && (
        <Modal
          visible={true}
          transparent
          animationType="slide"
          onRequestClose={() => setDropdownField(null)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  Select {dropdownField.label}
                </Text>
                <TouchableOpacity
                  onPress={() => setDropdownField(null)}
                  style={styles.modalCloseButton}
                  activeOpacity={0.7}
                >
                  <FontAwesome5 name="times" size={20} color="#666666" />
                </TouchableOpacity>
              </View>
              
              <ScrollView style={styles.modalOptions}>
                {dropdownField.options?.map(opt => (
                  <TouchableOpacity
                    key={opt}
                    style={styles.optionButton}
                    onPress={() => { 
                      handleChange(dropdownField.key, opt); 
                      setDropdownField(null); 
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.optionText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setDropdownField(null)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Modality Dropdown Modal */}
      {modalityDropdownVisible && (
        <Modal
          visible={true}
          transparent
          animationType="slide"
          onRequestClose={() => setModalityDropdownVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Modality</Text>
                <TouchableOpacity
                  onPress={() => setModalityDropdownVisible(false)}
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
                      setModalityDropdownVisible(false);
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.optionText}>{opt}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setModalityDropdownVisible(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  sectionHeader: {
    marginBottom: 16,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 8,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: '#E2E8F0',
    borderRadius: 1,
  },
  sectionContent: {
    marginBottom: 24,
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
  unitText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4A90E2',
  },
  rangeText: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#999999',
  },
  exampleText: {
    fontSize: 12,
    color: '#999999',
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