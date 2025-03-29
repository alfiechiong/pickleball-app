import React, { useEffect, useState, useCallback, useRef } from 'react';
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
import SegmentedControl from '../../components/SegmentedControl';
import theme from '../../styles/theme';
import { MainStackNavigationProp } from '../../navigation/types';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/AuthContext';
import { GameParticipant } from '../../services/gameParticipantService';
import { formatDate, formatTime } from '../../utils/dateUtils';

const { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOW } = theme;

type FilterType = 'all' | 'pending' | 'approved' | 'rejected';

const MyGamesScreen: React.FC = () => {
  const navigation = useNavigation<MainStackNavigationProp>();
  const { userGames, loadUserGames, loading, error } = useGame();
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [filteredGames, setFilteredGames] = useState<GameParticipant[]>([]);

  // Create a stable fetchUserGames function that doesn't change on re-renders
  const fetchGamesStable = useRef(async () => {
    try {
      // Check if user is authenticated before trying to load user games
      if (!user || !user.id) {
        console.log('User not authenticated, cannot fetch games');
        return;
      }

      await loadUserGames();
    } catch (err) {
      console.error('Error loading user games:', err);

      // Check if this is a rate limiting error
      const errorMessage = err instanceof Error ? err.message : 'Failed to load your games';
      if (errorMessage.includes('too many') || errorMessage.includes('try again in')) {
        Alert.alert('Rate Limited', errorMessage);
      } else {
        Alert.alert('Error', 'Failed to load your games. Please try again later.');
      }
    }
  }).current;

  // Use effect to load games when user changes
  useEffect(() => {
    // Only load when we have a user
    if (user && user.id) {
      fetchGamesStable();
    }
  }, [user]);

  // Filter games when userGames or filter changes
  useEffect(() => {
    if (filter === 'all') {
      setFilteredGames(userGames);
    } else {
      setFilteredGames(userGames.filter(game => game.status === filter));
    }
  }, [userGames, filter]);

  // Create a stable refresh function
  const onRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchGamesStable();
    } catch (err) {
      // Error is already handled in fetchUserGames
      console.error('Error during refresh:', err);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const renderGameItem = ({ item }: { item: GameParticipant }) => {
    if (!item.game) return null;

    return (
      <TouchableOpacity
        style={styles.gameCard}
        onPress={() => navigation.navigate('GameDetails', { id: item.game_id })}
      >
        <View style={styles.statusBadgeContainer}>
          <Text
            style={[
              styles.statusBadge,
              item.status === 'pending'
                ? styles.pendingBadge
                : item.status === 'approved'
                  ? styles.approvedBadge
                  : styles.rejectedBadge,
            ]}
          >
            {item.status.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.gameTitle}>Pickleball Game at {item.game.location}</Text>

        <Text style={styles.gameDetails}>
          {formatDate(item.game.date)} • {formatTime(item.game.start_time)} -{' '}
          {formatTime(item.game.end_time)}
        </Text>

        <Text style={styles.gameLocation}>{item.game.location}</Text>

        <View style={styles.gameFooter}>
          <Text style={styles.skillLevel}>
            {item.game.skill_level.charAt(0).toUpperCase() + item.game.skill_level.slice(1)}
          </Text>

          <Text
            style={[
              styles.gameStatusBadge,
              item.game.status === 'open'
                ? styles.openStatus
                : item.game.status === 'full'
                  ? styles.fullStatus
                  : styles.cancelledStatus,
            ]}
          >
            {item.game.status.toUpperCase()}
          </Text>
        </View>

        {item.game.creator && <Text style={styles.hostInfo}>Host: {item.game.creator.name}</Text>}
      </TouchableOpacity>
    );
  };

  // Early return if user is not authenticated
  if (!user) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Authentication Required</Text>
        <Text style={styles.emptySubText}>Please log in to view your games.</Text>
        <Button
          title="Go to Login"
          onPress={() => {
            // @ts-ignore - Navigate to Auth stack
            navigation.navigate('Auth');
          }}
          style={styles.browseButton}
        />
      </View>
    );
  }

  if (loading && !refreshing && userGames.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error && error !== 'No games found') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Button title="Retry" onPress={fetchGamesStable} size="small" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Games</Text>
      </View>

      <View style={styles.filterContainer}>
        <SegmentedControl
          values={['All', 'Pending', 'Approved', 'Rejected']}
          selectedIndex={['all', 'pending', 'approved', 'rejected'].indexOf(filter)}
          onChange={(index: number) => {
            setFilter(['all', 'pending', 'approved', 'rejected'][index] as FilterType);
          }}
        />
      </View>

      {filteredGames.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No Games Found</Text>
          <Text style={styles.emptySubText}>
            {filter === 'all'
              ? "You haven't joined any games yet."
              : filter === 'pending'
                ? "You don't have any pending game requests."
                : filter === 'approved'
                  ? "You don't have any approved games."
                  : "You don't have any rejected games."}
          </Text>
          <Button
            title="Browse Games"
            onPress={() => navigation.navigate('BottomTabs', { screen: 'Games' })}
            style={styles.browseButton}
          />
        </View>
      ) : (
        <FlatList
          data={filteredGames}
          renderItem={renderGameItem}
          keyExtractor={item => item.id}
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
              <Text style={styles.listHeaderText}>
                {filter === 'all'
                  ? `My Games (${filteredGames.length})`
                  : filter === 'pending'
                    ? `Pending Requests (${filteredGames.length})`
                    : filter === 'approved'
                      ? `Approved Games (${filteredGames.length})`
                      : `Rejected Requests (${filteredGames.length})`}
              </Text>
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
  filterContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.backgroundLight,
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
  statusBadgeContainer: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    zIndex: 1,
  },
  statusBadge: {
    fontSize: FONT_SIZES.xs,
    fontWeight: 'bold',
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  pendingBadge: {
    backgroundColor: COLORS.warning,
    color: COLORS.white,
  },
  approvedBadge: {
    backgroundColor: COLORS.success,
    color: COLORS.white,
  },
  rejectedBadge: {
    backgroundColor: COLORS.error,
    color: COLORS.white,
  },
  gameTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    paddingRight: 80, // Make space for the status badge
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
    marginBottom: SPACING.md,
  },
  gameFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  skillLevel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.backgroundLight,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  gameStatusBadge: {
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
  hostInfo: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    marginTop: SPACING.xs,
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
  browseButton: {
    minWidth: 150,
  },
});

export default MyGamesScreen;
