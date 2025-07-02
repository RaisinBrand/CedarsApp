import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// TODO: Replace with backend/JSON retrieval
const studies = [
  {
    id: '1',
    name: 'EEG Pilot Study',
    description: 'A pilot study to test EEG device integration and workflow.',
  },
  {
    id: '2',
    name: 'Muscle Cuff Validation',
    description: 'Validating muscle cuff readings in a clinical setting.',
  },
  {
    id: '3',
    name: 'Pressure Plate Usability',
    description: 'Assessing usability of the new pressure plate device.',
  },
];

export default function PreviousStudyPage() {
  const navigation = useNavigation();

  // In the future, fetch studies from backend/JSON file here
  // const [studies, setStudies] = useState([]);
  // useEffect(() => { fetchStudiesFromBackend(); }, []);

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
            <Text style={styles.headerTitle}>Previous Studies</Text>
            <Text style={styles.headerSubtitle}>Browse completed studies</Text>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {studies.map(study => (
          <TouchableOpacity
            key={study.id}
            style={styles.card}
            onPress={() => { /* no-op for now */ }}
            activeOpacity={0.85}
          >
            <Text style={styles.cardTitle}>{study.name}</Text>
            <Text style={styles.cardDescription}>{study.description}</Text>
          </TouchableOpacity>
        ))}
        <View style={styles.bottomPadding} />
      </ScrollView>
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
    top: Platform.OS === 'ios' ? 76 : 56,
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    marginHorizontal: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#4A90E2',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 16,
    color: '#333',
  },
  bottomPadding: {
    height: 80,
  },
}); 