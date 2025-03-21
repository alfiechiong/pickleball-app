import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { MainStackNavigationProp } from '../navigation/types';
import theme from '../styles/theme';

const { COLORS, SPACING, FONT_SIZES } = theme;

// Mock user data
const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  profileImage: 'https://via.placeholder.com/150',
  skillLevel: 'Intermediate',
  gamesPlayed: 27,
  wins: 18,
  tournaments: 5,
};

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<MainStackNavigationProp>();

  const StatisticItem = ({ label, value }: { label: string; value: number | string }) => (
    <View style={styles.statisticItem}>
      <Text style={styles.statisticValue}>{value}</Text>
      <Text style={styles.statisticLabel}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: mockUser.profileImage }} style={styles.profileImage} />
          <Text style={styles.name}>{mockUser.name}</Text>
          <Text style={styles.email}>{mockUser.email}</Text>
          <Text style={styles.skillLevel}>Skill Level: {mockUser.skillLevel}</Text>
        </View>

        <View style={styles.statsContainer}>
          <Text style={styles.sectionTitle}>Statistics</Text>
          <View style={styles.statisticsRow}>
            <StatisticItem label="Games Played" value={mockUser.gamesPlayed} />
            <StatisticItem label="Wins" value={mockUser.wins} />
            <StatisticItem label="Tournaments" value={mockUser.tournaments} />
          </View>
        </View>

        <View style={styles.buttonsContainer}>
          <Button
            title="Edit Profile"
            onPress={() => console.log('Edit profile')}
            style={styles.button}
          />
          <Button
            title="Settings"
            onPress={() => navigation.navigate('Settings')}
            style={styles.button}
          />
          <Button
            title="Logout"
            onPress={() => console.log('Logout')}
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  profileHeader: {
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: SPACING.md,
  },
  name: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  email: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  skillLevel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.accent,
    fontWeight: '600',
  },
  statsContainer: {
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  statisticsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statisticItem: {
    alignItems: 'center',
  },
  statisticValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  statisticLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  buttonsContainer: {
    padding: SPACING.lg,
  },
  button: {
    marginBottom: SPACING.md,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
    marginBottom: SPACING.md,
  },
});

export default ProfileScreen;
