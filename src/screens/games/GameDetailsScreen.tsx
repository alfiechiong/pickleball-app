import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { MainStackNavigationProp, MainStackParamList } from '../../navigation/types';
import { useGame } from '../../contexts/GameContext';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/Button';
import theme from '../../styles/theme';
import { formatDate, formatTime } from '../../utils/dateUtils';
import { GameParticipant } from '../../services/gameParticipantService';

const { COLORS, SPACING, FONT_SIZES } = theme;

type GameDetailsRouteProp = RouteProp<MainStackParamList, 'GameDetails'>;

const GameDetailsScreen: React.FC = () => {
  const route = useRoute<GameDetailsRouteProp>();
  const navigation = useNavigation<MainStackNavigationProp>();
  const { id: gameId } = route.params;
  const { user } = useAuth();
  const {
    selectedGame,
    loading,
    error,
    loadGame,
    joinGame,
    gameParticipants,
    loadGameParticipants,
    updateParticipantStatus,
  } = useGame();

  const [joinLoading, setJoinLoading] = useState(false);
  const [userParticipation, setUserParticipation] = useState<GameParticipant | null>(null);
  const [actionLoading, setActionLoading] = useState<{ [key: string]: boolean }>({});

  const isCreator = selectedGame?.creator_id === user?.id;

  useEffect(() => {
    loadGame(gameId);
  }, [gameId, loadGame]);

  useEffect(() => {
    if (selectedGame) {
      loadGameParticipants(gameId);
    }
  }, [selectedGame, gameId, loadGameParticipants]);

  useEffect(() => {
    if (user && gameParticipants.length > 0) {
      const participation = gameParticipants.find(p => p.user_id === user.id);
      setUserParticipation(participation || null);
    }
  }, [gameParticipants, user]);

  const handleJoinGame = async () => {
    try {
      setJoinLoading(true);
      await joinGame(gameId);
      Alert.alert(
        'Request Sent',
        'Your request to join this game has been sent to the host for approval.'
      );
    } catch (error) {
      Alert.alert(
        'Failed to Join',
        error instanceof Error ? error.message : 'Something went wrong'
      );
    } finally {
      setJoinLoading(false);
    }
  };

  const handleParticipantAction = async (
    participantId: string,
    status: 'approved' | 'rejected'
  ) => {
    try {
      setActionLoading(prev => ({ ...prev, [participantId]: true }));
      await updateParticipantStatus(gameId, participantId, status);
      Alert.alert(
        status === 'approved' ? 'Player Approved' : 'Player Rejected',
        `You have ${status === 'approved' ? 'approved' : 'rejected'} the player's request.`
      );
    } catch (error) {
      Alert.alert('Action Failed', error instanceof Error ? error.message : 'Something went wrong');
    } finally {
      setActionLoading(prev => ({ ...prev, [participantId]: false }));
    }
  };

  if (loading && !selectedGame) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading game details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Button title="Try Again" onPress={() => loadGame(gameId)} style={styles.button} />
        </View>
      </SafeAreaView>
    );
  }

  if (!selectedGame) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Game not found</Text>
          <Button title="Go Back" onPress={() => navigation.goBack()} style={styles.button} />
        </View>
      </SafeAreaView>
    );
  }

  const pendingParticipants = gameParticipants.filter(p => p.status === 'pending');
  const approvedParticipants = gameParticipants.filter(p => p.status === 'approved');
  const canJoin = !isCreator && !userParticipation && selectedGame.status === 'open';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>Game Details</Text>

          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Date:</Text>
              <Text style={styles.detailValue}>{formatDate(selectedGame.date)}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Time:</Text>
              <Text style={styles.detailValue}>
                {formatTime(selectedGame.start_time)} - {formatTime(selectedGame.end_time)}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Location:</Text>
              <Text style={styles.detailValue}>{selectedGame.location}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Players:</Text>
              <Text style={styles.detailValue}>
                {approvedParticipants.length + 1} / {selectedGame.max_players}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Skill Level:</Text>
              <Text style={styles.detailValue}>{selectedGame.skill_level}</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status:</Text>
              <Text
                style={[
                  styles.statusBadge,
                  selectedGame.status === 'open'
                    ? styles.openStatus
                    : selectedGame.status === 'full'
                      ? styles.fullStatus
                      : styles.cancelledStatus,
                ]}
              >
                {selectedGame.status.toUpperCase()}
              </Text>
            </View>

            {selectedGame.notes && (
              <View style={styles.notesSection}>
                <Text style={styles.detailLabel}>Notes:</Text>
                <Text style={styles.notesText}>{selectedGame.notes}</Text>
              </View>
            )}
          </View>

          {/* Join Button */}
          {canJoin && (
            <Button
              title={joinLoading ? 'Sending Request...' : 'Join Game'}
              onPress={handleJoinGame}
              disabled={joinLoading || selectedGame.status !== 'open'}
              style={styles.joinButton}
            />
          )}

          {/* User participation status */}
          {userParticipation && !isCreator && (
            <View style={styles.participationCard}>
              <Text style={styles.participationTitle}>Your Request Status</Text>
              <Text
                style={[
                  styles.statusBadge,
                  userParticipation.status === 'pending'
                    ? styles.pendingStatus
                    : userParticipation.status === 'approved'
                      ? styles.approvedStatus
                      : styles.rejectedStatus,
                ]}
              >
                {userParticipation.status.toUpperCase()}
              </Text>
              {userParticipation.status === 'pending' && (
                <Text style={styles.pendingMessage}>Your request is waiting for host approval</Text>
              )}
            </View>
          )}

          {/* Host Approval Section */}
          {isCreator && pendingParticipants.length > 0 && (
            <View style={styles.approvalSection}>
              <Text style={styles.sectionTitle}>Pending Requests</Text>
              {pendingParticipants.map(participant => (
                <View key={participant.id} style={styles.participantCard}>
                  <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>{participant.user?.name}</Text>
                    <Text style={styles.participantSkill}>
                      Skill: {participant.user?.skill_level}
                    </Text>
                  </View>
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.approveButton]}
                      onPress={() => handleParticipantAction(participant.id, 'approved')}
                      disabled={actionLoading[participant.id]}
                    >
                      {actionLoading[participant.id] ? (
                        <ActivityIndicator size="small" color={COLORS.white} />
                      ) : (
                        <Text style={styles.actionButtonText}>Approve</Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.rejectButton]}
                      onPress={() => handleParticipantAction(participant.id, 'rejected')}
                      disabled={actionLoading[participant.id]}
                    >
                      <Text style={styles.actionButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Approved Participants Section */}
          {approvedParticipants.length > 0 && (
            <View style={styles.participantsSection}>
              <Text style={styles.sectionTitle}>Approved Players</Text>
              {approvedParticipants.map(participant => (
                <View key={participant.id} style={styles.participantCard}>
                  <View style={styles.participantInfo}>
                    <Text style={styles.participantName}>{participant.user?.name}</Text>
                    <Text style={styles.participantSkill}>
                      Skill: {participant.user?.skill_level}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
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
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.error,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  detailsCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 8,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  detailLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  detailValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs / 2,
    borderRadius: 4,
    overflow: 'hidden',
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
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
  pendingStatus: {
    backgroundColor: COLORS.warning,
    color: COLORS.white,
  },
  approvedStatus: {
    backgroundColor: COLORS.success,
    color: COLORS.white,
  },
  rejectedStatus: {
    backgroundColor: COLORS.error,
    color: COLORS.white,
  },
  notesSection: {
    marginTop: SPACING.md,
  },
  notesText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  joinButton: {
    marginBottom: SPACING.lg,
  },
  participationCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 8,
    padding: SPACING.lg,
    marginBottom: SPACING.lg,
    alignItems: 'center',
  },
  participationTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    marginBottom: SPACING.sm,
  },
  pendingMessage: {
    marginTop: SPACING.sm,
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  approvalSection: {
    marginBottom: SPACING.lg,
  },
  participantsSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    marginBottom: SPACING.md,
    color: COLORS.textPrimary,
  },
  participantCard: {
    backgroundColor: COLORS.backgroundLight,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantInfo: {
    flex: 1,
  },
  participantName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  participantSkill: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 4,
    marginLeft: SPACING.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveButton: {
    backgroundColor: COLORS.success,
  },
  rejectButton: {
    backgroundColor: COLORS.error,
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
  },
  button: {
    marginTop: SPACING.md,
  },
});

export default GameDetailsScreen;
