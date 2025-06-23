import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  ScrollView,
} from 'react-native';

// Simple Graph Component
const LiveGraph = ({ dataPoints }: { dataPoints: number[] }) => {
  const maxValue = Math.max(...dataPoints, 1);
  const minValue = Math.min(...dataPoints, 0);
  const range = maxValue - minValue || 1;

  return (
    <View style={styles.graphContainer}>
      <View style={styles.graph}>
        {dataPoints.map((point, index) => {
          const height = ((point - minValue) / range) * 100;
          return (
            <View
              key={index}
              style={[
                styles.bar,
                {
                  height: `${height}%`,
                  backgroundColor: `hsl(${200 + (point / 100) * 60}, 70%, 50%)`,
                },
              ]}
            />
          );
        })}
      </View>
      <Text style={styles.graphLabel}>EMG Signal (Voltage vs Time)</Text>
    </View>
  );
};

// Title Component
const AppTitle = () => (
  <View style={styles.titleContainer}>
    <Text style={styles.title}>Live EMG Stream</Text>
    <Text style={styles.subtitle}>Real-time muscle activity monitoring</Text>
  </View>
);

// Refresh Button Component
const RefreshButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.button} onPress={onPress}>
    <Text style={styles.buttonText}>Clear Graph</Text>
  </TouchableOpacity>
);

export default function App() {
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Simulate real-time data stream
  const startStream = () => {
    stopStream();
    timerRef.current = setInterval(() => {
      setDataPoints(prev => {
        const newPoint = Math.random() * 100;
        const newData = [...prev, newPoint];
        // Keep only last 50 points for performance
        return newData.slice(-50);
      });
    }, 200); // 5 Hz update
  };

  const stopStream = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const clearGraph = () => {
    setDataPoints([]);
  };

  useEffect(() => {
    startStream();
    return () => stopStream();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Title Component */}
      <AppTitle />
      
      {/* Graph Component */}
      <LiveGraph dataPoints={dataPoints} />
      
      {/* Refresh Button Component */}
      <RefreshButton onPress={clearGraph} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  titleContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '400',
  },
  graphContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  graph: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  bar: {
    flex: 1,
    marginHorizontal: 1,
    borderRadius: 2,
    minHeight: 2,
  },
  graphLabel: {
    textAlign: 'center',
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 25,
    margin: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
