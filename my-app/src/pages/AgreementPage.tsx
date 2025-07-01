// pages/AgreementPage.tsx
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigationTypes';
import agreement from '../../assets/agreement.json';

export default function AgreementPage() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleAccept = () => {
    navigation.navigate('SelectDevice');
  };

  return (
    <View style={styles.container}>
      {/* ─── Title ─────────────────────────────────────────────── */}
      <Text style={styles.title}>User Agreement</Text>

      <Text style={styles.text}>
        Please read and accept the agreement below to continue.
      </Text>

      {/* ─── Scroll-only box ──────────────────────────────────── */}
      <View style={styles.scrollBox}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.text}>
            {agreement.text}
          </Text>
        </ScrollView>
      </View>

      {/* ─── Accept button pinned below ───────────────────────── */}
      <TouchableOpacity style={styles.button} onPress={handleAccept}>
        <Text style={styles.buttonText}>Accept</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },

  /* Header */
  title: {
    fontSize: 28,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Display' : undefined,
  },

  /* Scrollable agreement box */
  scrollBox: {
    // flex: 1, // Remove or comment out flex to avoid filling all available space
    height: 600, // Increased height for a larger scroll box
    borderWidth: 1,
    marginTop: 15,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 15,
    backgroundColor: '#F9F9F9',
  },
  scrollContent: {
    padding: 16,
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : undefined,
  },

  /* Accept button */
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
    alignSelf: 'center',
    width: '50%',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'SF Pro Text' : undefined,
  },
});
