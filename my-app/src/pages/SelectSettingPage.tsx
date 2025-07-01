import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ListRenderItemInfo,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigationTypes';

//type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SelectDevice'>;

const devices = [
  { key: 'Clinic',   label: 'Clinic' },
  { key: 'Research', label: 'Research' },
  { key: 'Review',      label: 'Review Previous Subjects' },

];

export default function SelectSettingPage() {
  //const navigation = useNavigation<NavigationProp>();
  const [selected, setSelected] = useState<string | null>(null);

  const onPress = (deviceKey: string) => {
    
    setSelected(prev => (prev === deviceKey ? null : deviceKey));
    //navigation.navigate('DeviceDetail', { device: deviceKey });
  };

  const renderItem = ({ item }: ListRenderItemInfo<typeof devices[0]>) => {
    const isActive = item.key === selected;
    return (
      <TouchableOpacity
        style={[styles.card, isActive && styles.cardSelected]}
        onPress={() => onPress(item.key)}
        activeOpacity={0.8}
      >
        <Text style={[styles.cardLabel, isActive && styles.cardLabelSelected]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Device</Text>
      <FlatList
        data={devices}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        contentContainerStyle={styles.list}
        numColumns={1}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    alignSelf: 'center',
  },
  list: {
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    margin: 8,
    paddingVertical: 24,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,            // shadow for Android
    shadowColor: '#000',     // shadow for iOS
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
});
