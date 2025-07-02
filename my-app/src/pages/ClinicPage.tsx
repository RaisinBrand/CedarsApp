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
  Modal,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

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

const studyMethods = ['EEG', 'Muscle Cuff', 'Pressure Plate'];

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

export default function ClientPage() {
  // Selected study method
  const [method, setMethod] = useState<string>('');
  const [fields, setFields] = useState<Field[]>([]);
  const [values, setValues] = useState<Record<string, any>>({});
  const [dropdownField, setDropdownField] = useState<Field | null>(null);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
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
      { key: 'upperBodyHeight', label: 'Upper Body Height', type: 'decimal', min: 20, max: 150, unit: 'cm' },
      { key: 'lowerBodyHeight', label: 'Lower Body Height', type: 'decimal', min: 30, max: 150, unit: 'cm' },
      
      // Study Information
      { key: 'method', label: 'Method of Study', type: 'dropdown', options: studyMethods },
    ];

    // Method-specific fields
    if (method === 'EEG') base.push({ key: 'electrodeCount', label: 'Electrode Count', type: 'number', min: 1, max: 256 });
    if (method === 'Muscle Cuff') base.push({ key: 'cuffPressure', label: 'Cuff Pressure', type: 'number', min: 0, max: 300, unit: 'mmHg' });
    if (method === 'Pressure Plate') base.push({ key: 'plateSize', label: 'Plate Size', type: 'dropdown', options: ['Small', 'Medium', 'Large'] });

    setFields(base);
    base.forEach(f => setValues(v => ({ ...v, [f.key]: v[f.key] ?? '' })));
  }, [method]);

  const handleChange = (key: string, value: any) => {
    setValues(prev => ({ ...prev, [key]: value }));
    if (key === 'method') setMethod(value);
  };

  const onSubmit = () => {
    console.log('Submit:', values);
    alert('Form submitted successfully! Check console for data.');
  };

  const getMethodIcon = () => {
    switch (method) {
      case 'EEG': 
        return <FontAwesome5 name="bolt" size={20} color="#F5A623" />;
      case 'Muscle Cuff': 
        return <MaterialCommunityIcons name="arm-flex" size={20} color="#4A90E2" />;
      case 'Pressure Plate': 
        return <FontAwesome5 name="weight" size={20} color="#D0021B" />;
      default: 
        return <FontAwesome5 name="stethoscope" size={20} color="#999999" />;
    }
  };

  const renderDropdown = (field: Field) => (
    <View key={field.key} style={styles.fieldContainer}>
      <Text style={styles.label}>{field.label}</Text>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setDropdownField(field)}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dropdownText,
          values[field.key] ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder
        ]}>
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
              keyboardType="numeric"
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
              keyboardType="decimal-pad"
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
            />
          </View>
        );
      case 'dropdown':
        return renderDropdown(field);
      case 'date':
        const val = values[field.key] || '';
        return (
          <View key={field.key} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              maxLength={10}                
              placeholder="YYYY-MM-DD"
              value={val}
              onChangeText={text => {
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
              placeholderTextColor="#999999"
            />
          </View>
        );
      default:
        return (
          <View key={field.key} style={styles.fieldContainer}>
            <Text style={styles.label}>{field.label}</Text>
            <TextInput
              style={styles.input}
              value={val}
              onChangeText={(text) => handleChange(field.key, text)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
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

  const formatVisitDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Group fields by section
  const demographicFields = fields.filter(f => 
    ['name', 'birthDate', 'ethnicity', 'genderIdentity', 'sexAssigned', 'sexualOrientation'].includes(f.key)
  );
  
  const anthropometricFields = fields.filter(f => 
    ['height', 'weight', 'upperBodyHeight', 'lowerBodyHeight'].includes(f.key)
  );
  
  const studyFields = fields.filter(f => 
    f.key === 'method' || !['name', 'birthDate', 'ethnicity', 'genderIdentity', 'sexAssigned', 'sexualOrientation', 'height', 'weight', 'upperBodyHeight', 'lowerBodyHeight', 'method'].includes(f.key)
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Patient Data</Text>
            <Text style={styles.headerSubtitle}>Medical form</Text>
          </View>
        </View>
        
        <View style={styles.headerBottom}>
          <View style={styles.dateInfo}>
            <FontAwesome5 name="calendar-alt" size={16} color="#4A90E2" />
            <Text style={styles.dateText}>Today: {currentDate}</Text>
          </View>
          <View style={styles.dateInfo}>
            <FontAwesome5 name="user" size={16} color="#F5A623" />
            <Text style={styles.dateText}>Clinician: Dr Bdizzle</Text>
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
          {/* Method Status Card */}
          {method && (
            <View style={styles.methodCard}>
              <View style={styles.methodCardContent}>
                {getMethodIcon()}
                <View style={styles.methodInfo}>
                  <Text style={styles.methodTitle}>{method}</Text>
                  <Text style={styles.methodDescription}>
                    {method === 'EEG' && 'Brain activity monitoring'}
                    {method === 'Muscle Cuff' && 'Muscle pressure measurement'}
                    {method === 'Pressure Plate' && 'Force and balance analysis'}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Demographics Section */}
          {renderSectionHeader('Basic Information & Demographics')}
          <View style={styles.formContainer}>
            {demographicFields.map(renderField)}
          </View>

          {/* Anthropometric Section */}
          {renderSectionHeader('Anthropometric Measurements')}
          <View style={styles.formContainer}>
            {anthropometricFields.map(renderField)}
          </View>

          {/* Study Information Section */}
          {renderSectionHeader('Study Information')}
          <View style={styles.formContainer}>
            {studyFields.map(renderField)}
          </View>

          {/* Method Info Cards */}
          {!method && (
            <View style={styles.infoCardsContainer}>
              <Text style={styles.infoCardsTitle}>Available Tests</Text>
              
              <View style={[styles.infoCard, styles.infoCardYellow]}>
                <FontAwesome5 name="bolt" size={24} color="#F5A623" />
                <View style={styles.infoCardText}>
                  <Text style={styles.infoCardTitle}>EEG Testing</Text>
                  <Text style={styles.infoCardDescription}>Brain electrical activity monitoring</Text>
                </View>
              </View>
              
              <View style={[styles.infoCard, styles.infoCardBlue]}>
                <MaterialCommunityIcons name="arm-flex" size={24} color="#4A90E2" />
                <View style={styles.infoCardText}>
                  <Text style={styles.infoCardTitle}>Muscle Cuff</Text>
                  <Text style={styles.infoCardDescription}>Muscle pressure measurement</Text>
                </View>
              </View>
              
              <View style={[styles.infoCard, styles.infoCardRed]}>
                <FontAwesome5 name="weight" size={24} color="#D0021B" />
                <View style={styles.infoCardText}>
                  <Text style={styles.infoCardTitle}>Pressure Plate</Text>
                  <Text style={styles.infoCardDescription}>Force and balance analysis</Text>
                </View>
              </View>
            </View>
          )}

          {/* Bottom padding for fixed button */}
          <View style={styles.bottomPadding} />
        </ScrollView>

        {/* Fixed Submit Button */}
        <View style={styles.submitContainer}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={onSubmit}
            activeOpacity={0.8}
          >
            <Text style={styles.submitText}>Submit Patient Data</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Dropdown Modal */}
      <Modal
        visible={!!dropdownField}
        transparent
        animationType="slide"
        onRequestClose={() => setDropdownField(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select {dropdownField?.label}
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
              {dropdownField?.options?.map(opt => (
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#4A90E2',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 32,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 14,
    color: '#333333',
    marginLeft: 8,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionHeader: {
    marginBottom: 16,
    marginTop: 8,
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
  methodCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  methodCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodInfo: {
    marginLeft: 12,
    flex: 1,
  },
  methodTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  methodDescription: {
    fontSize: 12,
    color: '#666666',
    marginTop: 2,
  },
  formContainer: {
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
    fontWeight: '400',
    color: '#666666',
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
  dropdownText: {
    fontSize: 16,
    flex: 1,
  },
  dropdownTextSelected: {
    color: '#000000',
    fontWeight: '500',
  },
  dropdownTextPlaceholder: {
    color: '#999999',
  },
  infoCardsContainer: {
    marginBottom: 24,
  },
  infoCardsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  infoCardYellow: {
    borderLeftWidth: 4,
    borderLeftColor: '#F5A623',
  },
  infoCardBlue: {
    borderLeftWidth: 4,
    borderLeftColor: '#4A90E2',
  },
  infoCardRed: {
    borderLeftWidth: 4,
    borderLeftColor: '#D0021B',
  },
  infoCardText: {
    marginLeft: 12,
    flex: 1,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  infoCardDescription: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
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