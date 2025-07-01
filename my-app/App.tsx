// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginScreen from './src/pages/LoginPage';
import AgreementPage from './src/pages/AgreementPage';
import SelectDevicePage from './src/pages/SelectDevicePage';
import SelectSettingPage from './src/pages/SelectSettingPage';
import ClientPage from './src/pages/ClinicPage';


// Future screens can be added here like:
// import AgreementScreen from './screens/AgreementScreen';
import { RootStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator initialRouteName='Client'
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Agreement" component={AgreementPage} />
          <Stack.Screen name="SelectDevice" component = {SelectDevicePage} />
          <Stack.Screen name="SelectSetting" component = {SelectSettingPage} />
          <Stack.Screen name="Client" component = {ClientPage} />
          
          {/* add more screens here */}
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});
