import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MainStackNavigationProp, MainStackParamList } from '../../navigation/types';
import theme from '../../styles/theme';

const { COLORS, SPACING, FONT_SIZES } = theme;

// Mock game data
const mockGame = {
  id: '1',
  title: 'Morning Pickleball',
  date: 'June 10, 2023',
  time: '9:00 AM',
  location: 'Central Park Courts',
  players: [
    { id: '1', name: 'John Doe', team: 'A' },
    { id: '2', name: 'Jane Smith', team: 'A' },
    { id: '3', name: 'Mike Johnson', team: 'B' },
    { id: '4', name: 'Sarah Williams', team: 'B' },
  ],
  skillLevel: 'Intermediate',
  description:
    'A friendly morning pickleball game for intermediate players. Join us for fun and exercise!',
};

type GameDetailsRouteProp = RouteProp<MainStackParamList, 'GameDetails'>;

const GameDetailsScreen: React.FC = () => {
  const navigation = useNavigation<MainStackNavigationProp>();
  const route = useRoute<GameDetailsRouteProp>();

  // In a real app, we would fetch game details using the ID from the route
  // const gameId = route.params.id;
  const game = mockGame; // Using mock data for now

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>{game.title}</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date:</Text>
            <Text style={styles.infoValue}>{game.date}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Time:</Text>
            <Text style={styles.infoValue}>{game.time}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{game.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Skill Level:</Text>
            <Text style={styles.infoValue}>{game.skillLevel}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{game.description}</Text>

        <Text style={styles.sectionTitle}>Players</Text>
        <View style={styles.teamsContainer}>
          <View style={styles.teamColumn}>
            <Text style={styles.teamTitle}>Team A</Text>
            {game.players
              .filter(player => player.team === 'A')
              .map(player => (
                <Text key={player.id} style={styles.playerName}>
                  {player.name}
                </Text>
              ))}
          </View>
          <View style={styles.teamColumn}>
            <Text style={styles.teamTitle}>Team B</Text>
            {game.players
              .filter(player => player.team === 'B')
              .map(player => (
                <Text key={player.id} style={styles.playerName}>
                  {player.name}
                </Text>
              ))}
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Join Game"
            onPress={() => console.log('Join game')}
            style={styles.button}
          />
          <Button
            title="Back to Games"
            onPress={() => navigation.goBack()}
            type="secondary"
            style={styles.button}
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
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  infoLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
    width: 100,
  },
  infoValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    flex: 1,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  teamsContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  teamColumn: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.md,
    margin: SPACING.xs,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  teamTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  playerName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: SPACING.md,
  },
  button: {
    marginBottom: SPACING.md,
  },
});

export default GameDetailsScreen;
