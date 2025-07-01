import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Pressable,
} from 'react-native';
import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import {
  RouteProp,
  useRoute,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigationTypes';

type Route = RouteProp<RootStackParamList, 'Search'>;
type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function SearchPage() {
  const { modality } = useRoute<Route>().params; // 'clinic' | 'research'
  const navigation = useNavigation<Nav>();

  const [patient, setPatient] = useState('');
  const [visitDate, setVisitDate] = useState<Date | undefined>();
  const [showPicker, setShowPicker] = useState(false);

  /* ── handlers ───────────────────────────────────────────── */
  const handleDateChange = (
    _event: DateTimePickerEvent,
    selected?: Date,
  ) => {
    setShowPicker(Platform.OS === 'ios'); // keep iOS picker open inline
    if (selected) setVisitDate(selected);
  };

  const handleSearch = () => {
    if (!patient || !visitDate) return;
    alert(
      `Would search ${modality} bucket for "${patient}" on ${visitDate.toLocaleDateString()}`,
    );
  };

  /* ── derived ────────────────────────────────────────────── */
  const searchDisabled = !patient || !visitDate;

  return (
    <View style={styles.container} testID="search-page">
      {/* Back */}
      <TouchableOpacity
        testID="back-btn"
        style={styles.back}
        onPress={navigation.goBack}>
        <Text style={styles.backText}>{'←'} Back</Text>
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>
        {modality === 'clinic' ? 'Clinic' : 'Research Study'} Search
      </Text>

      {/* Patient input */}
      <TextInput
        testID="patient-input"
        style={styles.input}
        placeholder="Patient name"
        placeholderTextColor="#aaa"
        value={patient}
        onChangeText={setPatient}
      />

      {/* Date selector */}
      <Pressable
        testID="date-pressable"
        onPress={() => setShowPicker(true)}
        style={styles.input}>
        <Text
          style={{
            color: visitDate ? '#000' : '#aaa',
            fontFamily:
              Platform.OS === 'ios' ? 'SF Pro Text' : undefined,
          }}>
          {visitDate
            ? visitDate.toLocaleDateString()
            : 'Select visit date'}
        </Text>
      </Pressable>

      {/* Native date picker (hidden until Pressable tapped) */}
      {showPicker && (
        <DateTimePicker
          testID="date-picker"
          value={visitDate ?? new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          onChange={handleDateChange}
        />
      )}

      {/* Search button */}
      <TouchableOpacity
        testID="search-btn"
        style={[styles.button, searchDisabled && { opacity: 0.4 }]}
        onPress={handleSearch}
        disabled={searchDisabled}>
        <Text style={styles.buttonText}>
          {searchDisabled ? 'Fill fields to search' : 'Search'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

/* ─────────── Styles ─────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
  },
  back: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 16,
    padding: 8,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : undefined,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : undefined,
  },
  input: {
    height: 50,
    borderColor: '#E5E5EA',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
    justifyContent: 'center',
    backgroundColor: '#F2F2F7',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : undefined,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : undefined,
  },
});
