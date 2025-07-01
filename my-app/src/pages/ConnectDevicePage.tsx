import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigationTypes';
import { FontAwesome5 } from '@expo/vector-icons';

type ConnectionState = 'searching' | 'found' | 'connecting' | 'connected' | 'error';
type ConnectDeviceRouteProp = RouteProp<RootStackParamList, 'ConnectDevice'>;

export default function ConnectDevicePage() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ConnectDeviceRouteProp>();
  const [connectionState, setConnectionState] = useState<ConnectionState>('searching');
  const [deviceIP, setDeviceIP] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);

  // Get the previous page type from route params
  const previousPage = route.params?.previousPage || 'Clinic';

  // Simulate device discovery
  useEffect(() => {
    if (connectionState === 'searching') {
      setTimeout(() => {
        setDeviceIP('192.168.1.100');
        setConnectionState('found');
      }, 2000);
    }
  }, [connectionState]);

  const handleConnect = () => {
    setConnectionState('connecting');
    
    // Simulate connection attempt
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      
      if (success) {
        setConnectionState('connected');
      } else {
        setConnectionState('error');
        setRetryCount(prev => prev + 1);
      }
    }, 2000);
  };

  const handleRetry = () => {
    setConnectionState('searching');
    setRetryCount(0);
  };



  const renderContent = () => {
    switch (connectionState) {
      case 'searching':
        return (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.statusText}>Searching for devices...</Text>
            <Text style={styles.subText}>Make sure your device is powered on and connected to the same network</Text>
          </View>
        );

      case 'found':
        return (
          <View style={styles.centerContent}>
            <View style={styles.deviceCard}>
              <FontAwesome5 name="microchip" size={48} color="#4A90E2" />
              <Text style={styles.deviceTitle}>Reflex Device Found</Text>
              <Text style={styles.deviceIP}>IP: {deviceIP}</Text>
              <Text style={styles.deviceStatus}>Ready to connect</Text>
            </View>
            <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
              <Text style={styles.connectButtonText}>Connect to Device</Text>
            </TouchableOpacity>
          </View>
        );

      case 'connecting':
        return (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.statusText}>Connecting to device...</Text>
            <Text style={styles.subText}>Establishing secure connection</Text>
          </View>
        );

      case 'connected':
        return (
          <View style={styles.centerContent}>
            <View style={styles.successCard}>
              <FontAwesome5 name="check-circle" size={64} color="#4CAF50" />
              <Text style={styles.successTitle}>Connected Successfully!</Text>
              <Text style={styles.successSubtitle}>Device is ready for testing</Text>
            </View>
            <Text style={styles.redirectText}>Redirecting to test page...</Text>
          </View>
        );

      case 'error':
        return (
          <View style={styles.centerContent}>
            <View style={styles.errorCard}>
              <FontAwesome5 name="exclamation-triangle" size={48} color="#F44336" />
              <Text style={styles.errorTitle}>Connection Failed</Text>
              <Text style={styles.errorSubtitle}>
                Unable to connect to device. Please check your network connection and try again.
              </Text>
              <Text style={styles.retryText}>Attempts: {retryCount}</Text>
            </View>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>


      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Connect Device</Text>
        <Text style={styles.headerSubtitle}>Establish connection with reflex testing device</Text>
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Status Bar */}
      <View style={styles.statusBar}>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
        <Text style={styles.statusBarText}>{getStatusText()}</Text>
      </View>
    </View>
  );

  function getStatusColor(): string {
    switch (connectionState) {
      case 'searching': return '#FFA726';
      case 'found': return '#4A90E2';
      case 'connecting': return '#FFA726';
      case 'connected': return '#4CAF50';
      case 'error': return '#F44336';
      default: return '#999';
    }
  }

  function getStatusText(): string {
    switch (connectionState) {
      case 'searching': return 'Searching...';
      case 'found': return 'Device Found';
      case 'connecting': return 'Connecting...';
      case 'connected': return 'Connected';
      case 'error': return 'Connection Failed';
      default: return 'Unknown';
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
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
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingHorizontal: 24,
    paddingBottom: 24,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    marginTop: 8,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333333',
    marginTop: 24,
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  deviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  deviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 16,
  },
  deviceIP: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
    marginTop: 8,
  },
  deviceStatus: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  connectButton: {
    backgroundColor: '#4A90E2',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  connectButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  successCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 16,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666666',
    marginTop: 8,
  },
  redirectText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  errorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 32,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginTop: 16,
  },
  errorSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  retryText: {
    fontSize: 12,
    color: '#999999',
    marginTop: 16,
  },
  retryButton: {
    backgroundColor: '#F44336',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusBarText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
});
