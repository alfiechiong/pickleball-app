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
  BottomTabs: NavigatorScreenParams<BottomTabParamList>;
  GameDetails: { id: string };
  CreateGame: undefined;
  TournamentDetails: { id: string };
  CreateTournament: undefined;
  Profile: undefined;
  Settings: undefined;
};

// Bottom Tab
export type BottomTabParamList = {
  Home: undefined;
  Games: undefined;
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
