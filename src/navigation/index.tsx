import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Import types
import {
  RootStackParamList,
  AuthStackParamList,
  MainStackParamList,
  BottomTabParamList,
} from './types';

// Import screens (these will be created later)
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import GamesScreen from '../screens/games/GamesScreen';
import GameDetailsScreen from '../screens/games/GameDetailsScreen';
import CreateGameScreen from '../screens/games/CreateGameScreen';
import TournamentsScreen from '../screens/tournaments/TournamentsScreen';
import TournamentDetailsScreen from '../screens/tournaments/TournamentDetailsScreen';
import CreateTournamentScreen from '../screens/tournaments/CreateTournamentScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Import theme
import { COLORS } from '../styles/theme';

// Create navigators
const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();
const BottomTab = createBottomTabNavigator<BottomTabParamList>();

// Auth Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
};

// Bottom Tab Navigator
const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Games') {
            iconName = focused ? 'tennisball' : 'tennisball-outline';
          } else if (route.name === 'Tournaments') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.gray,
        headerShown: false,
      })}
    >
      <BottomTab.Screen name="Home" component={HomeScreen} />
      <BottomTab.Screen name="Games" component={GamesScreen} />
      <BottomTab.Screen name="Tournaments" component={TournamentsScreen} />
      <BottomTab.Screen name="Profile" component={ProfileScreen} />
    </BottomTab.Navigator>
  );
};

// Main Navigator
const MainNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: COLORS.primary,
        },
        headerTintColor: COLORS.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <MainStack.Screen
        name="BottomTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name="GameDetails"
        component={GameDetailsScreen}
        options={{ title: 'Game Details' }}
      />
      <MainStack.Screen
        name="CreateGame"
        component={CreateGameScreen}
        options={{ title: 'Create Game' }}
      />
      <MainStack.Screen
        name="TournamentDetails"
        component={TournamentDetailsScreen}
        options={{ title: 'Tournament Details' }}
      />
      <MainStack.Screen
        name="CreateTournament"
        component={CreateTournamentScreen}
        options={{ title: 'Create Tournament' }}
      />
      <MainStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </MainStack.Navigator>
  );
};

// App Navigator
const AppNavigator = () => {
  // This would typically come from your auth context or state management
  const isLoggedIn = true; // Changed to true for testing purposes

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <RootStack.Screen name="Main" component={MainNavigator} />
          ) : (
            <RootStack.Screen name="Auth" component={AuthNavigator} />
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
