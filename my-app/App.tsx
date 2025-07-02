// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView, StyleSheet } from 'react-native';
import LoginScreen from './src/pages/LoginPage';
import AgreementPage from './src/pages/AgreementPage';
import SelectSettingPage from './src/pages/SelectSettingPage';
import ReviewSelectorPage from './src/pages/ReviewSelectorPage';
import SearchPage from './src/pages/SearchPage';
import ClinicPage from './src/pages/ClinicPage';
import ResearchPage from './src/pages/ResearchPage';
import ConnectDevicePage from './src/pages/ConnectDevicePage';
import CurrentStudyPage from './src/pages/CurrentStudyPage';
import PreviousStudyPage from './src/pages/PreviousStudyPage';
// Future screens can be added here like:
// import AgreementScreen from './screens/AgreementScreen';
import { RootStackParamList } from './navigationTypes';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <Stack.Navigator initialRouteName='Login'
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Agreement" component={AgreementPage} />
          <Stack.Screen name="SelectSetting" component = {SelectSettingPage} />
          <Stack.Screen name="ReviewSelector" component = {ReviewSelectorPage} />
          <Stack.Screen name="Search" component = {SearchPage} />
          <Stack.Screen name="Clinic" component = {ClinicPage} />
          <Stack.Screen name="Research" component = {ResearchPage} />
          <Stack.Screen name="ConnectDevice" component = {ConnectDevicePage} />
          <Stack.Screen name="CurrentStudy" component={CurrentStudyPage} />
          <Stack.Screen name="PreviousStudy" component={PreviousStudyPage} />
          
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
