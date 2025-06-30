// RealTime.tsx
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LiveGraph = ({ dataPoints }: { dataPoints: number[] }) => {
  const maxValue = Math.max(...dataPoints, 1);
  const minValue = Math.min(...dataPoints, 0);
  const range = maxValue - minValue || 1;
  const graphHeight = 200;
  const graphWidth = 300;

  const getYPosition = (value: number) => graphHeight - ((value - minValue) / range) * graphHeight;
  const getXPosition = (index: number) => (index / (dataPoints.length - 1)) * graphWidth;

  return (
    <View style={styles.graphContainer}>
      <View style={styles.graphWrapper}>
        <View style={styles.graph}>
          {[0, 25, 50, 75, 100].map((tick) => (
            <View key={tick} style={[styles.gridLine, { top: graphHeight - (tick / 100) * graphHeight }]} />
          ))}
          <View style={styles.yAxisLabels}>
            {[100, 75, 50, 25, 0].map((label) => (
              <Text key={label} style={styles.yAxisLabel}>{label}mV</Text>
            ))}
          </View>
          <View style={styles.lineContainer}>
            {dataPoints.length > 1 && (
              <View style={styles.lineGraph}>
                {dataPoints.map((point, index) => {
                  if (index === 0) return null;
                  const prevPoint = dataPoints[index - 1];
                  const x1 = getXPosition(index - 1);
                  const y1 = getYPosition(prevPoint);
                  const x2 = getXPosition(index);
                  const y2 = getYPosition(point);
                  const angle = Math.atan2(y2 - y1, x2 - x1);
                  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
                  return (
                    <View
                      key={index}
                      style={[
                        styles.lineSegment,
                        {
                          width: length,
                          height: 2,
                          backgroundColor: '#007AFF',
                          position: 'absolute',
                          left: x1,
                          top: y1 - 1,
                          transform: [{ rotate: `${angle}rad` }],
                          transformOrigin: '0 0',
                        },
                      ]}
                    />
                  );
                })}
                {dataPoints.map((point, index) => (
                  <View
                    key={`point-${index}`}
                    style={[
                      styles.dataPoint,
                      {
                        left: getXPosition(index) - 3,
                        top: getYPosition(point) - 3,
                        backgroundColor: '#007AFF',
                      },
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
      <Text style={styles.graphLabel}>EMG Signal (Voltage vs Time)</Text>
    </View>
  );
};

export default function RealTime() {
  const [dataPoints, setDataPoints] = useState<number[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const navigation = useNavigation();

  const SERVER_URL = 'http://172.20.10.5:8080/emg';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(SERVER_URL);
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setDataPoints(data);
            setIsConnected(true);
            setLastUpdate(new Date().toLocaleTimeString());
          }
        } else {
          setIsConnected(false);
        }
      } catch (error) {
        console.error('Error fetching EMG data:', error);
        setIsConnected(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.title}>Live EMG Stream</Text>
      <Text style={styles.subtitle}>Real-time muscle activity monitoring</Text>
      <LiveGraph dataPoints={dataPoints} />
      <TouchableOpacity onPress={() => navigation.navigate('CurrentTest')} style={styles.button}>
        <Text style={styles.buttonText}>View Last Test</Text>
      </TouchableOpacity>
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
  statusContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#F8F9FA',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  lastUpdateText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '400',
  },
  graphContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  graphWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  graph: {
    width: 300,
    height: 200,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    width: '100%',
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  yAxisLabels: {
    position: 'absolute',
    left: -30,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#666666',
    fontWeight: '500',
  },
  lineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineGraph: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  lineSegment: {
    position: 'absolute',
  },
  dataPoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#007AFF',
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
