import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Button from '../components/Button';
import theme from '../styles/theme';
import { globalStyles } from '../styles/global';
import { BottomTabParamList, MainStackNavigationProp } from '../navigation/types';
import { Game } from '../services/gameService';
import { useGame } from '../contexts/GameContext';

const { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOW } = theme;

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<MainStackNavigationProp>();
  const { games, loading, error, loadGames } = useGame();
  const [upcomingGames, setUpcomingGames] = useState<Game[]>([]);

  useEffect(() => {
    // Load games when component mounts
    loadGames();
  }, [loadGames]);

  useEffect(() => {
    // Update upcomingGames with the most recent open games
    if (games && games.length > 0) {
      // Sort games by date - newest first
      const sortedGames = [...games].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      // Take at most 2 games
      setUpcomingGames(sortedGames.slice(0, 2));
    }
  }, [games]);

  // Sample tournaments data
  const upcomingTournaments = [
    {
      id: '1',
      name: 'Summer Championship',
      date: 'June 10-12, 2024',
      location: 'Metro Sports Complex',
      participants: 32,
    },
  ];

  const navigateToBottomTab = (tabName: keyof BottomTabParamList) => {
    navigation.navigate('BottomTabs', { screen: tabName });
  };

  // Helper function to format the game title
  const formatGameTitle = (game: Game) => {
    const skillLevel = game.skill_level.charAt(0).toUpperCase() + game.skill_level.slice(1);
    return `${skillLevel} Game`;
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom', 'left', 'right']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.appName}>Pickleball App</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <Button
            title="Create Game"
            onPress={() => navigation.navigate('CreateGame')}
            style={styles.quickActionButton}
          />
          <Button
            title="Find Games"
            onPress={() => navigateToBottomTab('Games')}
            type="secondary"
            style={styles.quickActionButton}
          />
        </View>

        {/* Upcoming Games */}
        <View style={styles.sectionContainer}>
          <View style={globalStyles.spaceBetween}>
            <Text style={styles.sectionTitle}>Upcoming Games</Text>
            <Text style={styles.viewAll} onPress={() => navigateToBottomTab('Games')}>
              View All
            </Text>
          </View>

          {loading ? (
            <ActivityIndicator size="small" color={COLORS.primary} style={styles.loader} />
          ) : error ? (
            <Text style={styles.errorText}>Error loading games</Text>
          ) : upcomingGames.length > 0 ? (
            upcomingGames.map(game => (
              <View key={game.id} style={styles.card}>
                <Text style={styles.cardTitle}>{formatGameTitle(game)}</Text>
                <View style={styles.cardDetails}>
                  <Text style={styles.cardDetailText}>📅 {formatDate(game.date)}</Text>
                  <Text style={styles.cardDetailText}>📍 {game.location}</Text>
                  <Text style={styles.cardDetailText}>👥 {game.max_players} players</Text>
                </View>
                <Button
                  title="View Details"
                  onPress={() => navigation.navigate('GameDetails', { id: game.id })}
                  type="outline"
                  size="small"
                  style={styles.cardButton}
                />
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No upcoming games</Text>
          )}
        </View>

        {/* Upcoming Tournaments */}
        <View style={styles.sectionContainer}>
          <View style={globalStyles.spaceBetween}>
            <Text style={styles.sectionTitle}>Tournaments</Text>
            <Text style={styles.viewAll} onPress={() => navigateToBottomTab('Tournaments')}>
              View All
            </Text>
          </View>

          {upcomingTournaments.length > 0 ? (
            upcomingTournaments.map(tournament => (
              <View key={tournament.id} style={styles.card}>
                <Text style={styles.cardTitle}>{tournament.name}</Text>
                <View style={styles.cardDetails}>
                  <Text style={styles.cardDetailText}>📅 {tournament.date}</Text>
                  <Text style={styles.cardDetailText}>📍 {tournament.location}</Text>
                  <Text style={styles.cardDetailText}>
                    👥 {tournament.participants} participants
                  </Text>
                </View>
                <Button
                  title="View Details"
                  onPress={() => navigation.navigate('TournamentDetails', { id: tournament.id })}
                  type="outline"
                  size="small"
                  style={styles.cardButton}
                />
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No upcoming tournaments</Text>
          )}
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>Pickleball Tip of the Day</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipTitle}>Dinking Technique</Text>
            <Text style={styles.tipText}>
              Perfect your dink by keeping your paddle face up and using a soft touch. Focus on
              placement rather than power to keep your opponents at bay.
            </Text>
          </View>
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
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
    ...SHADOW.medium,
    marginTop: -1,
  },
  welcomeText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.white,
    opacity: 0.9,
  },
  appName: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  sectionContainer: {
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  viewAll: {
    color: COLORS.primary,
    fontWeight: '500',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.sm,
    ...SHADOW.small,
  },
  cardTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  cardDetails: {
    marginBottom: SPACING.sm,
  },
  cardDetailText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  cardButton: {
    alignSelf: 'flex-end',
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.textSecondary,
    padding: SPACING.md,
  },
  errorText: {
    textAlign: 'center',
    color: COLORS.error,
    padding: SPACING.md,
  },
  loader: {
    padding: SPACING.md,
  },
  tipsContainer: {
    padding: SPACING.md,
    marginBottom: SPACING.xl,
  },
  tipCard: {
    backgroundColor: COLORS.accentLight,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.accent,
  },
  tipTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.accentDark,
    marginBottom: SPACING.xs,
  },
  tipText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
});

export default HomeScreen;
