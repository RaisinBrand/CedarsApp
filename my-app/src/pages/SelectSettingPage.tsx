import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigationTypes';

const devices = [
  { key: 'Reflex',   label: 'Reflex Cuff' },
  { key: 'Pressure', label: 'Pressure Plate' },
  { key: 'EIT',      label: 'EIT Cuff' },
  { key: 'Muscle',   label: 'Muscle Cuff' },
];

const settings = [
  { key: 'Clinic',   label: 'Clinic' },
  { key: 'Research', label: 'Research' },
  { key: 'Review',   label: 'Review Previous Subjects' },
];

export default function SelectSettingPage() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [selectedDevices, setSelectedDevices] = useState<string[]>([]);
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);

  const onDevicePress = (deviceKey: string) => {
    setSelectedDevices(prev => 
      prev.includes(deviceKey) 
        ? prev.filter(key => key !== deviceKey)
        : [...prev, deviceKey]
    );
  };

  const onSettingPress = (settingKey: string) => {
    setSelectedSetting(prev => prev === settingKey ? null : settingKey);
  };

  const handleContinue = () => {
    if (selectedDevices.length > 0 && selectedSetting) {
      if (selectedSetting === 'Clinic') {
        navigation.navigate('Clinic');
      } else if (selectedSetting === 'Research') {
        navigation.navigate('Research');
      } else if (selectedSetting === 'Review') {
        navigation.navigate('ReviewSelector');
      }
    }
  };

  const renderDeviceItem = ({ item }: ListRenderItemInfo<typeof devices[0]>) => {
    const isActive = selectedDevices.includes(item.key);
    return (
      <TouchableOpacity
        style={[styles.card, isActive && styles.cardSelected]}
        onPress={() => onDevicePress(item.key)}
        activeOpacity={0.8}
      >
        <Text style={[styles.cardLabel, isActive && styles.cardLabelSelected]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderSettingItem = ({ item }: ListRenderItemInfo<typeof settings[0]>) => {
    const isActive = item.key === selectedSetting;
    return (
      <TouchableOpacity
        style={[styles.card, isActive && styles.cardSelected]}
        onPress={() => onSettingPress(item.key)}
        activeOpacity={0.8}
      >
        <Text style={[styles.cardLabel, isActive && styles.cardLabelSelected]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  const canContinue = selectedDevices.length > 0 && selectedSetting;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Select Devices & Setting</Text>
      
      {/* Devices Section */}
      <Text style={styles.sectionTitle}>Select Devices (Multiple)</Text>
      <FlatList
        data={devices}
        renderItem={renderDeviceItem}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.list}
        numColumns={1}
        scrollEnabled={false}
      />

      {/* Settings Section */}
      <Text style={styles.sectionTitle}>Select Setting (Single)</Text>
      <FlatList
        data={settings}
        renderItem={renderSettingItem}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.list}
        numColumns={1}
        scrollEnabled={false}
      />

      {/* Continue Button */}
      <TouchableOpacity 
        style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]} 
        onPress={handleContinue}
        disabled={!canContinue}
      >
        <Text style={[styles.continueButtonText, !canContinue && styles.continueButtonTextDisabled]}>
          {canContinue ? 'Continue' : 'Select at least one device and one setting'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  list: {
    marginBottom: 20,
  },
  card: {
    flex: 1,
    margin: 6,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  cardSelected: {
    backgroundColor: '#4a90e2',
  },
  cardLabel: {
    fontSize: 18,
    color: '#333',
  },
  cardLabelSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  continueButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  continueButtonTextDisabled: {
    color: '#999',
  },
});
