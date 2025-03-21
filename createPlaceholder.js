const fs = require('fs');
const path = require('path');

// Screens to create
const screens = [
  // Auth screens
  { path: 'src/screens/auth/ForgotPasswordScreen.tsx', name: 'ForgotPassword' },

  // Game screens
  { path: 'src/screens/games/GameDetailsScreen.tsx', name: 'GameDetails' },
  { path: 'src/screens/games/CreateGameScreen.tsx', name: 'CreateGame' },

  // Tournament screens
  { path: 'src/screens/tournaments/TournamentsScreen.tsx', name: 'Tournaments' },
  { path: 'src/screens/tournaments/TournamentDetailsScreen.tsx', name: 'TournamentDetails' },
  { path: 'src/screens/tournaments/CreateTournamentScreen.tsx', name: 'CreateTournament' },

  // Profile screens
  { path: 'src/screens/ProfileScreen.tsx', name: 'Profile' },
  { path: 'src/screens/SettingsScreen.tsx', name: 'Settings' },
];

// Template for placeholder screen
const getTemplate = name => `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '${name.includes('Profile') || name.includes('Settings') ? '../components/Button' : '../../components/Button'}';
import theme from '${name.includes('Profile') || name.includes('Settings') ? '../styles/theme' : '../../styles/theme'}';

const { COLORS, SPACING, FONT_SIZES } = theme;

const ${name}Screen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>${name}</Text>
        <Text style={styles.message}>
          This is a placeholder for the ${name} screen. The full implementation will come in future updates.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  message: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
});

export default ${name}Screen;
`;

// Create placeholder screens
screens.forEach(screen => {
  const filePath = path.resolve(__dirname, screen.path);
  const dirPath = path.dirname(filePath);

  // Create directory if it doesn't exist
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  // Create file with template
  const content = getTemplate(screen.name);
  fs.writeFileSync(filePath, content);

  console.log(`Created ${screen.path}`);
});

console.log('All placeholder screens created successfully!');
