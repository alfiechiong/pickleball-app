import { NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp as RNBottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Auth Stack
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Main Stack
export type MainStackParamList = {
  BottomTabs: { screen: keyof BottomTabParamList } & NavigatorScreenParams<BottomTabParamList>;
  GameDetails: { id: string };
  GameRequests: { gameId: string };
  CreateGame: undefined;
  Auth: undefined;
  EditProfile: undefined;
  Settings: undefined;
};

// Bottom Tab
export type BottomTabParamList = {
  Home: undefined;
  Games: undefined;
  MyGames: undefined;
  Tournaments: undefined;
  Profile: undefined;
};

// Navigation Props
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>;
export type MainStackNavigationProp = NativeStackNavigationProp<MainStackParamList>;
export type BottomTabNavigationProp = RNBottomTabNavigationProp<BottomTabParamList>;

// Root Stack
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
