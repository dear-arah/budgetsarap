import React, { useEffect, useState } from 'react';
import { Tabs, Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for authentication state storage
import LoginScreen from './auth/login';
import SignUpPage from './auth/signup';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabLayout from './main/tabs/tablayout';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login status

  // Load authentication state from AsyncStorage
  useEffect(() => {
    const checkAuthState = async () => {
      const token = await AsyncStorage.getItem('token'); // Example: Assume 'token' is stored after login
      setIsAuthenticated(!!token); // Set authentication state
    };
    checkAuthState();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "Tabs" : "Login"} // Dynamically set the initial route
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpPage} />
      <Stack.Screen name="Tabs" component={TabLayout} />
    </Stack.Navigator>
  );
}
