import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import theme from '../../styles/theme';
import { MainStackNavigationProp } from '../../navigation/types';
import { useGame } from '../../contexts/GameContext';
import { Game } from '../../services/gameService';

const { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOW } = theme;

const GamesScreen: React.FC = () => {
  const navigation = useNavigation<MainStackNavigationProp>();
  const { games, loading, error, loadGames } = useGame();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadGames();
  }, [loadGames]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadGames();
    setRefreshing(false);
  };

  const getStatusColor = (status: Game['status']) => {
    switch (status) {
      case 'open':
        return styles.openBadge;
      case 'full':
        return styles.fullBadge;
      case 'completed':
        return styles.completedBadge;
      case 'cancelled':
        return styles.cancelledBadge;
      default:
        return styles.openBadge;
    }
  };

  const getStatusText = (status: Game['status']) => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'full':
        return 'Full';
      case 'completed':
        return 'Completed';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Open';
    }
  };

  const formatDateTime = (date: string, time: string) => {
    const gameDate = new Date(`${date}T${time}`);
    return gameDate.toLocaleString();
  };

  const renderGameItem = ({ item }: { item: Game }) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => navigation.navigate('GameDetails', { id: item.id.toString() })}
    >
      <Text style={styles.gameTitle}>{`${item.skill_level} Game`}</Text>
      <View style={styles.gameDetails}>
        <Text style={styles.gameDetailText}>📅 {formatDateTime(item.date, item.time)}</Text>
        <Text style={styles.gameDetailText}>📍 {item.location}</Text>
        <Text style={styles.gameDetailText}>
          👥 {item.current_players}/{item.max_players} players
        </Text>
      </View>
      <View style={styles.statusContainer}>
        <View style={[styles.statusBadge, getStatusColor(item.status)]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
        <Button title="Retry" onPress={loadGames} size="small" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Games</Text>
        <Button
          title="Create Game"
          onPress={() => navigation.navigate('CreateGame')}
          size="small"
        />
      </View>

      <FlatList
        data={games}
        renderItem={renderGameItem}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        refreshing={refreshing}
        onRefresh={onRefresh}
      />
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
    marginBottom: SPACING.sm,
  },
  gameDetailText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.round,
  },
  openBadge: {
    backgroundColor: COLORS.primaryLight,
  },
  fullBadge: {
    backgroundColor: COLORS.secondaryLight,
  },
  completedBadge: {
    backgroundColor: COLORS.accentLight,
  },
  cancelledBadge: {
    backgroundColor: COLORS.lightGray,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '500',
  },
});

export default GamesScreen;
