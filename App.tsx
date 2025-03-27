import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation';
import { AuthProvider } from './src/contexts/AuthContext';
import { GameProvider } from './src/contexts/GameContext';

export default function App() {
  return (
    <AuthProvider>
      <GameProvider>
        <StatusBar style="auto" />
        <AppNavigator />
      </GameProvider>
    </AuthProvider>
  );
}
