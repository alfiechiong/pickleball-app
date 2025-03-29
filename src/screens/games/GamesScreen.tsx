import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import theme from '../../styles/theme';
import { MainStackNavigationProp } from '../../navigation/types';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/AuthContext';
import { Game } from '../../services/gameService';
import * as gameParticipantService from '../../services/gameParticipantService';

const { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOW } = theme;

const GamesScreen: React.FC = () => {
  const navigation = useNavigation<MainStackNavigationProp>();
  const { games, loading, error, loadGames } = useGame();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [joiningGame, setJoiningGame] = useState<string | null>(null);
  const [participations, setParticipations] = useState<{ [gameId: string]: string }>({});

  const fetchGames = useCallback(async () => {
    try {
      await loadGames();
    } catch (err) {
      console.error('Error loading games:', err);
      Alert.alert('Error', 'Failed to load games. Please try again.');
    }
  }, [loadGames]);

  const fetchUserParticipations = useCallback(async () => {
    if (!user) return;

    try {
      console.log('Fetching user participations...');
      const userGames = await gameParticipantService.getUserGames();
      const participationMap: { [gameId: string]: string } = {};

      userGames.forEach(participation => {
        if (participation.game_id) {
          participationMap[participation.game_id] = participation.status;
        }
      });

      setParticipations(participationMap);
    } catch (err) {
      console.error('Error loading user participations:', err);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  useEffect(() => {
    if (user) {
      fetchUserParticipations();
    }
  }, [fetchUserParticipations, user]);

  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      // First load games, then participations only if user is logged in
      await fetchGames();
      if (user) {
        await fetchUserParticipations();
      }
    } catch (error) {
      console.error('Error during refresh:', error);
      Alert.alert('Refresh Failed', 'Unable to refresh data. Please try again later.');
    } finally {
      setRefreshing(false);
    }
  }, [fetchGames, fetchUserParticipations, user]);

  const handleJoinGame = async (gameId: string) => {
    try {
      setJoiningGame(gameId);
      await gameParticipantService.joinGame(gameId);
      Alert.alert(
        'Request Sent',
        'Your request to join this game has been sent to the host for approval.'
      );
      await fetchUserParticipations();
    } catch (error) {
      Alert.alert(
        'Failed to Join',
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setJoiningGame(null);
    }
  };

  const renderGameItem = ({ item }: { item: Game }) => {
    const isCreator = item.creator_id === user?.id;
    const participationStatus = participations[item.id];
    const canJoin = !isCreator && item.status === 'open' && !participationStatus;
    const isJoining = joiningGame === item.id;

    return (
      <TouchableOpacity
        style={styles.gameCard}
        onPress={() => navigation.navigate('GameDetails', { id: item.id })}
      >
        <Text style={styles.gameTitle}>{getGameName(item)}</Text>
        <Text style={styles.gameDetails}>
          {formatDate(item.date)} • {formatTime(item.start_time)} - {formatTime(item.end_time)}
        </Text>
        <Text style={styles.gameLocation}>{item.location}</Text>
        <View style={styles.gameStats}>
          <Text style={styles.statsText}>
            Players: {item.current_players || 1}/{item.max_players}
          </Text>
          <Text
            style={[
              styles.statusBadge,
              item.status === 'open'
                ? styles.openStatus
                : item.status === 'full'
                  ? styles.fullStatus
                  : styles.cancelledStatus,
            ]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>

        <View style={styles.gameFooter}>
          <Text style={styles.levelBadge}>
            {item.skill_level.charAt(0).toUpperCase() + item.skill_level.slice(1)}
          </Text>

          {canJoin && (
            <TouchableOpacity
              style={styles.joinButton}
              onPress={() => handleJoinGame(item.id)}
              disabled={isJoining}
            >
              {isJoining ? (
                <ActivityIndicator size="small" color={COLORS.white} />
              ) : (
                <Text style={styles.joinButtonText}>Join</Text>
              )}
            </TouchableOpacity>
          )}

          {participationStatus && (
            <View
              style={[
                styles.participationBadge,
                participationStatus === 'pending'
                  ? styles.pendingBadge
                  : participationStatus === 'approved'
                    ? styles.approvedBadge
                    : styles.rejectedBadge,
              ]}
            >
              <Text style={styles.participationText}>{participationStatus.toUpperCase()}</Text>
            </View>
          )}

          {isCreator && (
            <View style={styles.creatorBadge}>
              <Text style={styles.creatorText}>HOST</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  // Helper function to generate a game name
  const getGameName = (game: Game) => {
    return `Pickleball Game at ${game.location}`;
  };

  // Helper function to format dates
  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Helper function to format time
  const formatTime = (timeString: string) => {
    if (!timeString) return 'TBD';

    // If timeString is already in HH:MM format, return it
    if (timeString.match(/^\d{1,2}:\d{2}(:\d{2})?$/)) {
      // Convert 24h to 12h format
      const [hours, minutes] = timeString.split(':');
      const h = parseInt(hours, 10);
      const ampm = h >= 12 ? 'PM' : 'AM';
      const hour12 = h % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    }

    // Otherwise, assume it's a full datetime string
    try {
      const date = new Date(timeString);
      return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      console.error('Error formatting time:', e);
      return timeString;
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={fetchGames} size="small" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pickleball Games</Text>
        <Button
          title="Create Game"
          onPress={() => navigation.navigate('CreateGame')}
          size="small"
        />
      </View>

      {games.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No games found</Text>
          <Text style={styles.emptySubText}>Be the first to create a game!</Text>
          <Button
            title="Create Game"
            onPress={() => navigation.navigate('CreateGame')}
            style={styles.createButton}
          />
        </View>
      ) : (
        <FlatList
          data={games}
          renderItem={renderGameItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
            />
          }
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <Text style={styles.listHeaderText}>Available Games ({games.length})</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  listContainer: {
    padding: SPACING.md,
    paddingBottom: 80, // Extra space at the bottom
  },
  listHeader: {
    marginBottom: SPACING.md,
  },
  listHeaderText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  gameCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.small,
  },
  gameTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  gameDetails: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  gameLocation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  statsText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
  },
  levelBadge: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  joinButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
  },
  joinButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
  },
  statusBadge: {
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  openStatus: {
    backgroundColor: COLORS.success,
    color: COLORS.white,
  },
  fullStatus: {
    backgroundColor: COLORS.warning,
    color: COLORS.white,
  },
  cancelledStatus: {
    backgroundColor: COLORS.error,
    color: COLORS.white,
  },
  participationBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participationText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  pendingBadge: {
    backgroundColor: COLORS.warning,
  },
  approvedBadge: {
    backgroundColor: COLORS.success,
  },
  rejectedBadge: {
    backgroundColor: COLORS.error,
  },
  creatorBadge: {
    backgroundColor: COLORS.secondary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  creatorText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptySubText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  createButton: {
    minWidth: 150,
  },
});

export default GamesScreen;
