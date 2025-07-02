import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function PreviousStudyPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Previous Study Page (to be implemented)</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 22,
    color: '#4A90E2',
    fontWeight: '600',
  },
}); 