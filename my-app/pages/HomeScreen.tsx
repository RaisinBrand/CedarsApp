import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import { BleManager } from 'react-native-ble-plx';

const manager = new BleManager();

export default function HomeScreen() {
  const [devices, setDevices] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const startScan = async () => {
    setDevices([]);
    setIsScanning(true);

    if (Platform.OS === 'android') {
      const permissions = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);

      if (Object.values(permissions).some(p => p !== 'granted')) {
        alert('Bluetooth permissions are required.');
        return;
      }
    }

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) return;
      if (device && device.name && !devices.some(d => d.id === device.id)) {
        setDevices(prev => [...prev, device]);
      }
    });

    setTimeout(() => {
      manager.stopDeviceScan();
      setIsScanning(false);
    }, 8000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title} > Welcome to APP</Text>
      <Text style={styles.description} > Please search for a device below</Text>
      <Text style={styles.title}>Bluetooth Signal Reader</Text>
      <Button title={isScanning ? 'Scanning...' : 'Scan for Devices'} onPress={startScan} disabled={isScanning} />
      <FlatList
        data={devices}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.deviceItem}>
            <Text style={styles.deviceName}>📱 {item.name}</Text>
            <Text style={styles.deviceId}>{item.id}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  description : {fontSize: 18, fontWeight: 'medium', textAlign: 'center', marginBottom: 20},
  deviceItem: { padding: 12, borderBottomWidth: 1, borderColor: '#ddd' },
  deviceName: { fontSize: 16 },
  deviceId: { fontSize: 12, color: 'gray' },
});
