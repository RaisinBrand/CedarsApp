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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigationTypes';

// Generic field metadata
type Field = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'dropdown' | 'date';
  options?: string[];
  min?: number;
  max?: number;
};

const studyMethods = ['EEG', 'MRI', 'Blood Test'];

export default function ResearchPage() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  // Selected study method
  const [method, setMethod] = useState<string>('');
  // Array of fields to render
  const [fields, setFields] = useState<Field[]>([]);
  // Values for each field key
  const [values, setValues] = useState<Record<string, any>>({});
  // Dropdown currently open
  const [dropdownField, setDropdownField] = useState<Field | null>(null);

  // Initialize base fields on mount or method change
  useEffect(() => {
    const base: Field[] = [
      { key: 'age', label: 'Age', type: 'number', min: 0, max: 100 },
      { key: 'sex', label: 'Sex', type: 'dropdown', options: ['Male', 'Female', 'Other'] },
      { key: 'race', label: 'Race', type: 'dropdown', options: ['Asian', 'Black', 'White', 'Other'] },
      { key: 'visitDate', label: 'Visit Date', type: 'date' },
      { key: 'method', label: 'Method of Study', type: 'dropdown', options: studyMethods },
    ];
    // Append method-specific
    if (method === 'EEG') base.push({ key: 'electrodeCount', label: 'Electrode Count', type: 'number', min: 1, max: 256 });
    if (method === 'MRI') base.push({ key: 'fieldStrength', label: 'Field Strength (T)', type: 'number', min: 0, max: 7 });
    if (method === 'Blood Test') base.push({ key: 'wbcCount', label: 'WBC Count', type: 'number', min: 0, max: 100 });
    setFields(base);
    // Initialize missing values
    base.forEach(f => {
      setValues(v => ({ ...v, [f.key]: v[f.key] ?? (f.type === 'number' ? '' : '') }));
    });
  }, [method]);

  // Update a field value
  const handleChange = (key: string, value: any) => {
    setValues(prev => ({ ...prev, [key]: value }));
    if (key === 'method') setMethod(value);
  };

  // Submit handler
  const onSubmit = () => {
    console.log('Submit:', values);
    // TODO: send to backend
  };

  // Render dropdown field as modal
  const renderDropdown = (field: Field) => (
    <View key={field.key}>
      <Text style={styles.label}>{field.label}</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setDropdownField(field)}
      >
        <Text style={styles.inputText}>
          {values[field.key] || `Select ${field.label}`}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Render each field by type
  const renderField = (field: Field) => {
    const val = values[field.key];
    switch (field.type) {
      case 'number':
        return (
          <TextInput
            key={field.key}
            style={styles.input}
            keyboardType="numeric"
            value={String(val)}
            onChangeText={text => {
              const n = parseInt(text, 10);
              if (!isNaN(n) && (field.min == null || n >= field.min) && (field.max == null || n <= field.max)) {
                handleChange(field.key, n);
              } else if (text === '') {
                handleChange(field.key, '');
              }
            }}
            placeholder={field.label}
            placeholderTextColor="#888"
          />
        );
      case 'dropdown':
        return renderDropdown(field);
      case 'date':
        return (
          <TextInput
            key={field.key}
            style={styles.input}
            value={val}
            onChangeText={text => handleChange(field.key, text)}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#888"
          />
        );
      default:
        return (
          <TextInput
            key={field.key}
            style={styles.input}
            value={val}
            onChangeText={text => handleChange(field.key, text)}
            placeholder={field.label}
            placeholderTextColor="#888"
          />
        );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: 'padding', android: undefined })}
    >
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>{'←'} Back</Text>
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.header}>Patient Test Data</Text>
        {fields.map(renderField)}
        <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal visible={!!dropdownField} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {dropdownField?.options?.map(opt => (
              <TouchableOpacity
                key={opt}
                style={styles.optionButton}
                onPress={() => { handleChange(dropdownField.key, opt); setDropdownField(null); }}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setDropdownField(null)}
            >
              <Text style={styles.closeText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    padding: 8,
    zIndex: 1000,
  },
  backText: {
    fontSize: 16,
    color: '#FF0',
    fontWeight: '600',
  },
  form: { padding: 24, paddingTop: 80 },
  header: { fontSize: 28, color: '#FF0', marginBottom: 24, textAlign: 'center' },
  label: { color: '#FFF', fontSize: 16, marginBottom: 8 },
  input: { backgroundColor: '#111', borderRadius: 8, padding: 12, marginBottom: 16, color : "white"},
  inputText: { color: 'white' },
  submitButton: { backgroundColor: '#0044CC', padding: 16, borderRadius: 10, marginTop: 24, alignItems: 'center' },
  submitText: { color: '#FF0', fontSize: 18, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#111', padding: 20, borderRadius: 10, width: '80%' },
  optionButton: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  optionText: { color: '#FFF', fontSize: 16 },
  closeButton: { marginTop: 16, alignItems: 'center' },
  closeText: { color: '#FF0', fontSize: 16 }
});
