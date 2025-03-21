import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import theme from '../../styles/theme';
import { MainStackNavigationProp } from '../../navigation/types';

const { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOW } = theme;

// Sample data for games
const GAMES_DATA = [
  {
    id: '1',
    title: 'Friendly Match',
    date: 'May 15, 2024',
    location: 'Central Park Courts',
    players: 4,
    status: 'scheduled',
  },
  {
    id: '2',
    title: 'Practice Session',
    date: 'May 18, 2024',
    location: 'Community Center',
    players: 6,
    status: 'scheduled',
  },
  {
    id: '3',
    title: 'Weekly Tournament Round 1',
    date: 'May 20, 2024',
    location: 'Sports Complex',
    players: 8,
    status: 'scheduled',
  },
  {
    id: '4',
    title: 'Advanced Skills Practice',
    date: 'May 22, 2024',
    location: 'Recreation Center',
    players: 4,
    status: 'scheduled',
  },
];

const GamesScreen: React.FC = () => {
  const navigation = useNavigation<MainStackNavigationProp>();

  const renderGameItem = ({ item }: { item: (typeof GAMES_DATA)[0] }) => (
    <TouchableOpacity
      style={styles.gameCard}
      onPress={() => navigation.navigate('GameDetails', { id: item.id })}
    >
      <Text style={styles.gameTitle}>{item.title}</Text>
      <View style={styles.gameDetails}>
        <Text style={styles.gameDetailText}>📅 {item.date}</Text>
        <Text style={styles.gameDetailText}>📍 {item.location}</Text>
        <Text style={styles.gameDetailText}>👥 {item.players} players</Text>
      </View>
      <View style={styles.statusContainer}>
        <View
          style={[
            styles.statusBadge,
            item.status === 'scheduled' && styles.scheduledBadge,
            item.status === 'inProgress' && styles.inProgressBadge,
            item.status === 'completed' && styles.completedBadge,
            item.status === 'cancelled' && styles.cancelledBadge,
          ]}
        >
          <Text style={styles.statusText}>
            {item.status === 'scheduled'
              ? 'Scheduled'
              : item.status === 'inProgress'
                ? 'In Progress'
                : item.status === 'completed'
                  ? 'Completed'
                  : 'Cancelled'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

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
        data={GAMES_DATA}
        renderItem={renderGameItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  scheduledBadge: {
    backgroundColor: COLORS.primaryLight,
  },
  inProgressBadge: {
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
