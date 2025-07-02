import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigationTypes';
import { FontAwesome5 } from '@expo/vector-icons';

// ── CONFIG ───────────────────────────────────────────
/** Replace with the IP (or tunnel URL) where FastAPI runs. */
const BACKEND_URL = 'http://172.20.10.5:8000';
/** How often we re-query /devices/ (ms). */
const POLL_MS = 3_000;

// ── TYPES ────────────────────────────────────────────
type ConnectionState =
  | 'searching'
  | 'found'
  | 'connecting'
  | 'connected'
  | 'error';

type ConnectDeviceRouteProp = RouteProp<RootStackParamList, 'ConnectDevice'>;

// ── COMPONENT ───────────────────────────────────────
export default function ConnectDevicePage() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<ConnectDeviceRouteProp>();

  const [connectionState, setConnectionState] =
    useState<ConnectionState>('searching');
  const [deviceID, setDeviceID] = useState('');
  const [deviceIP, setDeviceIP] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // If you passed down “previousPage” in params, grab it:
  const previousPage = route.params?.previousPage ?? 'Clinic';

  // ── 1️⃣  Real discovery loop: poll /devices/ ───────────
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/devices/`);
        const json = await res.json();

        const ids = Object.keys(json); // {"giga-01": {...}}
        if (ids.length > 0) {
          const id = ids[0];
          const ip = json[id].ip;
          setDeviceID(id);
          setDeviceIP(ip);
          if (connectionState === 'searching') setConnectionState('found');
        } else {
          setDeviceID('');
          setDeviceIP('');
          if (
            connectionState !== 'connecting' &&
            connectionState !== 'connected'
          ) {
            setConnectionState('searching');
          }
        }
      } catch (err) {
        console.warn('Device fetch error:', err);
        if (connectionState !== 'connected') setConnectionState('error');
      } finally {
        timerRef.current = setTimeout(poll, POLL_MS);
      }
    };

    poll(); // kick off immediately
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [connectionState]);

  // ── 2️⃣  Simulated “connect” button (replace later) ──
  const handleConnect = () => {
    setConnectionState('connecting');
    // TODO: replace with real WebSocket / handshake
    setTimeout(() => setConnectionState('connected'), 1500);
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    setConnectionState('searching');
  };

  // ── 3️⃣  UI renderer ─────────────────────────────────
  const renderContent = () => {
    switch (connectionState) {
      case 'searching':
        return (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.statusText}>Scanning for boards…</Text>
            <Text style={styles.subText}>
              Make sure the board is powered on and on the same network
            </Text>
          </View>
        );

      case 'found':
        return (
          <View style={styles.centerContent}>
            <View style={styles.deviceCard}>
              <FontAwesome5 name="microchip" size={48} color="#4A90E2" />
              <Text style={styles.deviceTitle}>Board detected</Text>
              <Text style={styles.deviceIP}>
                {deviceID} · {deviceIP}
              </Text>
              <Text style={styles.deviceStatus}>Ready to connect</Text>
            </View>
            <TouchableOpacity style={styles.connectButton} onPress={handleConnect}>
              <Text style={styles.connectButtonText}>Connect</Text>
            </TouchableOpacity>
          </View>
        );

      case 'connecting':
        return (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#4A90E2" />
            <Text style={styles.statusText}>Connecting to board…</Text>
            <Text style={styles.subText}>Establishing secure channel</Text>
          </View>
        );

      case 'connected':
        return (
          <View style={styles.centerContent}>
            <View style={styles.successCard}>
              <FontAwesome5 name="check-circle" size={64} color="#4CAF50" />
              <Text style={styles.successTitle}>Connected!</Text>
              <Text style={styles.successSubtitle}>
                Device is ready for testing
              </Text>
            </View>
            <Text style={styles.redirectText}>
              Redirecting to {previousPage} page…
            </Text>
          </View>
        );

      case 'error':
        return (
          <View style={styles.centerContent}>
            <View style={styles.errorCard}>
              <FontAwesome5
                name="exclamation-triangle"
                size={48}
                color="#F44336"
              />
              <Text style={styles.errorTitle}>Connection failed</Text>
              <Text style={styles.errorSubtitle}>
                Please check your network and try again.
              </Text>
              <Text style={styles.retryText}>Attempts: {retryCount}</Text>
            </View>
            <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
              <Text style={styles.retryButtonText}>Try again</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return null;
    }
  };

  // ── 4️⃣  Component tree ──────────────────────────────
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Connect Device</Text>
        <Text style={styles.headerSubtitle}>
          Establish connection with reflex tester
        </Text>
      </View>

      {/* Main */}
      <View style={styles.content}>{renderContent()}</View>

      {/* Status bar */}
      <View style={styles.statusBar}>
        <View
          style={[styles.statusDot, { backgroundColor: getStatusColor() }]}
        />
        <Text style={styles.statusBarText}>{getStatusText()}</Text>
      </View>
    </View>
  );

  // ── helpers ─────────────────────────────────────────
  function getStatusColor(): string {
    switch (connectionState) {
      case 'searching':
        return '#FFA726';
      case 'found':
        return '#4A90E2';
      case 'connecting':
        return '#FFA726';
      case 'connected':
        return '#4CAF50';
      case 'error':
        return '#F44336';
      default:
        return '#999';
    }
  }

  function getStatusText(): string {
    switch (connectionState) {
      case 'searching':
        return 'Searching…';
      case 'found':
        return 'Device found';
      case 'connecting':
        return 'Connecting…';
      case 'connected':
        return 'Connected';
      case 'error':
        return 'Error';
      default:
        return 'Unknown';
    }
  }
}

// ── STYLE SHEET (unchanged from your version) ─────────
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
