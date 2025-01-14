import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage for authentication state storage
import LoginScreen from './auth/login';
import SignUpPage from './auth/signup';
import TabLayout from './main/tabs/tablayout';
//import FolderScreen from './main/flashcards/folderscreen';
import DeckScreen from './main/flashcards/deckscreen';
import FlashcardPage from './main/flashcards/flashcardpage';
import QuizPage from './main/flashcards/quizpage';
import QuizYourself from './main/flashcards/quizyourself';
import IdentificationQuiz from './main/flashcards/identificationquiz';
import MultipleChoiceQuiz from './main/flashcards/multiplechoice';

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
      initialRouteName={isAuthenticated ? 'Tabs' : 'Login'} // Dynamically set the initial route
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpPage} />
      <Stack.Screen name="Tabs" component={TabLayout} />
      <Stack.Screen name="Deck" component={DeckScreen} />
      <Stack.Screen name="FlashcardPage" component={FlashcardPage} />
      <Stack.Screen name="QuizPage" component={QuizPage} />
      <Stack.Screen name="QuizYourself" component={QuizYourself} />
      <Stack.Screen name="IdentificationQuiz" component={IdentificationQuiz} />
      <Stack.Screen name="MultipleChoiceQuiz" component={MultipleChoiceQuiz} />


    </Stack.Navigator>
  );
}
