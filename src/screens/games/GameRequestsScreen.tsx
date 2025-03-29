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
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../../navigation/types';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/AuthContext';
import theme from '../../styles/theme';
import Button from '../../components/Button';
import Icon from '../../components/Icon';
import { GameParticipant } from '../../services/gameParticipantService';

const { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS, SHADOW } = theme;

type GameRequestsRouteProp = RouteProp<MainStackParamList, 'GameRequests'>;
type GameRequestsNavigationProp = NativeStackNavigationProp<MainStackParamList, 'GameRequests'>;

const GameRequestsScreen: React.FC = () => {
  const navigation = useNavigation<GameRequestsNavigationProp>();
  const route = useRoute<GameRequestsRouteProp>();
  const { gameId } = route.params;
  const { user } = useAuth();
  const {
    gameParticipants,
    loadGameParticipants,
    updateParticipantStatus,
    selectedGame,
    loadGame,
    loading,
    error,
  } = useGame();
  const [refreshing, setRefreshing] = useState(false);
  const [processingIds, setProcessingIds] = useState<string[]>([]);
  const [updatingParticipantId, setUpdatingParticipantId] = useState<string | null>(null);

  // Load the game and its participants
  const loadData = useCallback(async () => {
    try {
      await loadGame(gameId);
      await loadGameParticipants(gameId);
    } catch (error) {
      console.error('Error loading requests:', error);
      Alert.alert('Error', 'Failed to load player requests. Please try again.');
    }
  }, [gameId, loadGame, loadGameParticipants]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadData();
    } catch (error) {
      console.error('Error refreshing:', error);
    } finally {
      setRefreshing(false);
    }
  }, [loadData]);

  const handleUpdateStatus = async (participantId: string, status: 'approved' | 'rejected') => {
    try {
      setUpdatingParticipantId(participantId);
      await updateParticipantStatus(gameId, participantId, status);
      Alert.alert('Success', `Player has been ${status === 'approved' ? 'approved' : 'rejected'}.`);
    } catch (error) {
      console.error('Error updating status:', error);
      Alert.alert('Error', `Failed to ${status} player. Please try again.`);
    } finally {
      setUpdatingParticipantId(null);
    }
  };

  // Filter for pending requests only
  const pendingRequests = gameParticipants.filter(participant => participant.status === 'pending');

  const renderParticipantItem = ({ item }: { item: GameParticipant }) => {
    const isProcessing = processingIds.includes(item.id);

    return (
      <View style={styles.participantCard}>
        <View style={styles.participantInfo}>
          <Text style={styles.participantName}>{item.user?.name || 'Unknown Player'}</Text>
          <Text style={styles.participantEmail}>{item.user?.email}</Text>
          <Text style={styles.participantSkill}>
            Skill:{' '}
            {item.user?.skill_level
              ? item.user.skill_level.charAt(0).toUpperCase() + item.user.skill_level.slice(1)
              : 'Unknown'}
          </Text>
          <Text style={styles.joinedDate}>
            Requested: {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          {isProcessing ? (
            <ActivityIndicator size="small" color={COLORS.primary} />
          ) : (
            <>
              <TouchableOpacity
                style={[styles.actionButton, styles.approveButton]}
                onPress={() => handleUpdateStatus(item.id, 'approved')}
              >
                <Text style={styles.actionButtonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleUpdateStatus(item.id, 'rejected')}
              >
                <Text style={styles.actionButtonText}>Reject</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  // Check if user is the host
  const isHost = selectedGame && user && selectedGame.creator_id === user.id;

  if (!isHost) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>
            You don't have permission to manage player requests for this game.
          </Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} size="small" />
        </View>
      </SafeAreaView>
    );
  }

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Try Again" onPress={loadData} size="small" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Player Requests</Text>
        {selectedGame && (
          <Text style={styles.subtitle}>
            {selectedGame.location} on {new Date(selectedGame.date).toLocaleDateString()}
          </Text>
        )}
      </View>

      {pendingRequests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No pending requests</Text>
          <Button
            title="Back to Game"
            onPress={() => navigation.goBack()}
            type="secondary"
            style={styles.backButton}
          />
        </View>
      ) : (
        <FlatList
          data={pendingRequests}
          renderItem={renderParticipantItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[COLORS.primary]}
            />
          }
          ListHeaderComponent={
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                {pendingRequests.length} pending request{pendingRequests.length !== 1 ? 's' : ''}
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
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.lg,
  },
  header: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  listContainer: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  participantCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW.small,
  },
  participantInfo: {
    marginBottom: SPACING.sm,
  },
  participantName: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  participantEmail: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  participantSkill: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  joinedDate: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: SPACING.sm,
  },
  actionButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  approveButton: {
    backgroundColor: COLORS.success,
  },
  rejectButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: FONT_SIZES.sm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emptyText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    marginVertical: SPACING.md,
  },
  backButton: {
    marginTop: SPACING.md,
  },
  statsContainer: {
    marginBottom: SPACING.md,
  },
  statsText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  errorText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.error,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
});

export default GameRequestsScreen;
