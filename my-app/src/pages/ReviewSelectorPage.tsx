import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigationTypes';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function ReviewSelector() {
  const navigation = useNavigation<Nav>();

  const go = (mode: 'clinic' | 'research') => {
    navigation.navigate('Search', { modality: mode });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Review Mode</Text>

      <Pressable style={styles.card} onPress={() => go('clinic')}>
        <Text style={styles.cardTitle}>Clinic</Text>
        <Text style={styles.cardSubtitle}>Review clinical test visits</Text>
      </Pressable>

      <Pressable style={styles.card} onPress={() => go('research')}>
        <Text style={styles.cardTitle}>Research Study</Text>
        <Text style={styles.cardSubtitle}>Review research-study visits</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60 },
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : undefined,
  },
  card: {
    backgroundColor: '#F7F7F7',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
    height: 300,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 4,
    color: '#007AFF',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : undefined,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#555',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : undefined,
  },
});
