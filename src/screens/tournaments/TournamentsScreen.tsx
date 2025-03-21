import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { MainStackNavigationProp } from '../../navigation/types';
import theme from '../../styles/theme';

const { COLORS, SPACING, FONT_SIZES } = theme;

// Mock data for demonstration
const mockTournaments = [
  {
    id: '1',
    title: 'Summer Championship',
    date: 'June 15-18, 2023',
    location: 'Central Courts Complex',
    participants: 32,
    entryFee: '$50',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '2',
    title: 'Weekend Tournament',
    date: 'July 8-9, 2023',
    location: 'Recreation Center',
    participants: 16,
    entryFee: '$30',
    image: 'https://via.placeholder.com/100',
  },
  {
    id: '3',
    title: 'Charity Cup',
    date: 'August 12-14, 2023',
    location: 'Memorial Park Courts',
    participants: 24,
    entryFee: '$40',
    image: 'https://via.placeholder.com/100',
  },
];

const TournamentsScreen: React.FC = () => {
  const navigation = useNavigation<MainStackNavigationProp>();

  const renderItem = ({ item }: { item: (typeof mockTournaments)[0] }) => (
    <View style={styles.tournamentCard}>
      <Image source={{ uri: item.image }} style={styles.tournamentImage} />
      <View style={styles.tournamentInfo}>
        <Text style={styles.tournamentTitle}>{item.title}</Text>
        <Text style={styles.tournamentDate}>{item.date}</Text>
        <Text style={styles.tournamentLocation}>{item.location}</Text>
        <View style={styles.tournamentDetails}>
          <Text style={styles.tournamentDetail}>Participants: {item.participants}</Text>
          <Text style={styles.tournamentDetail}>Entry Fee: {item.entryFee}</Text>
        </View>
        <Button
          title="View Details"
          onPress={() => navigation.navigate('TournamentDetails', { id: item.id })}
          style={styles.detailsButton}
        />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tournaments</Text>
        <Button
          title="Create Tournament"
          onPress={() => navigation.navigate('CreateTournament')}
          style={styles.createButton}
        />
      </View>

      <FlatList
        data={mockTournaments}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
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
  createButton: {
    paddingHorizontal: SPACING.md,
  },
  listContent: {
    padding: SPACING.md,
  },
  tournamentCard: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    flexDirection: 'row',
  },
  tournamentImage: {
    width: 100,
    height: '100%',
  },
  tournamentInfo: {
    flex: 1,
    padding: SPACING.md,
  },
  tournamentTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  tournamentDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.accent,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  tournamentLocation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  tournamentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  tournamentDetail: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  detailsButton: {
    alignSelf: 'flex-end',
  },
});

export default TournamentsScreen;
