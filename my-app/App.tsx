// App.tsx
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RealTime from './RealTime';
import CurrentTest from './CurrentTest';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CurrentTest">
        <Stack.Screen name="RealTime" component={RealTime} />
        <Stack.Screen name="CurrentTest" component={CurrentTest} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}