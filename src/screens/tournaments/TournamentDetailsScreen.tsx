import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { MainStackNavigationProp, MainStackParamList } from '../../navigation/types';
import theme from '../../styles/theme';

const { COLORS, SPACING, FONT_SIZES } = theme;

// Mock tournament data
const mockTournament = {
  id: '1',
  title: 'Summer Championship',
  startDate: 'June 15, 2023',
  endDate: 'June 18, 2023',
  registrationDeadline: 'June 1, 2023',
  location: 'Central Courts Complex',
  address: '123 Pickleball Lane, Sports City, CA 90210',
  maxParticipants: 32,
  currentParticipants: 24,
  entryFee: '$50',
  description:
    "Join us for the annual Summer Championship tournament. This event features men's, women's, and mixed doubles competitions across different skill levels. Prizes for winners include trophies, gift cards, and sponsored equipment.",
  organizer: 'City Pickleball Association',
  sponsors: ['PicklePro Gear', 'Sports Drink Co.', 'Local Athletics Club'],
  image: 'https://via.placeholder.com/400x200',
  rules:
    'USA Pickleball Association rules apply. All participants must check in 30 minutes before their scheduled match time. Match format is best 2 out of 3 games to 11 points.',
  divisions: [
    { name: "Men's Doubles 3.0-3.5", slots: '8 teams' },
    { name: "Women's Doubles 3.0-3.5", slots: '8 teams' },
    { name: 'Mixed Doubles 3.0-3.5', slots: '8 teams' },
    { name: "Men's Doubles 4.0+", slots: '4 teams' },
    { name: "Women's Doubles 4.0+", slots: '4 teams' },
    { name: 'Mixed Doubles 4.0+', slots: '4 teams' },
  ],
};

type TournamentDetailsRouteProp = RouteProp<MainStackParamList, 'TournamentDetails'>;

const TournamentDetailsScreen: React.FC = () => {
  const navigation = useNavigation<MainStackNavigationProp>();
  const route = useRoute<TournamentDetailsRouteProp>();
  const { id } = route.params;

  // In a real app, we would fetch the tournament data based on id
  // For now, we'll use the mock data

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: mockTournament.image }} style={styles.image} />

        <View style={styles.content}>
          <Text style={styles.title}>{mockTournament.title}</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date & Time</Text>
            <Text style={styles.text}>
              {mockTournament.startDate} - {mockTournament.endDate}
            </Text>
            <Text style={styles.label}>Registration Deadline</Text>
            <Text style={styles.text}>{mockTournament.registrationDeadline}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <Text style={styles.text}>{mockTournament.location}</Text>
            <Text style={styles.text}>{mockTournament.address}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Details</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Entry Fee:</Text>
              <Text style={styles.text}>{mockTournament.entryFee}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Participants:</Text>
              <Text style={styles.text}>
                {mockTournament.currentParticipants}/{mockTournament.maxParticipants}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Organizer:</Text>
              <Text style={styles.text}>{mockTournament.organizer}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.text}>{mockTournament.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Divisions</Text>
            {mockTournament.divisions.map((division, index) => (
              <View key={index} style={styles.divisionItem}>
                <Text style={styles.divisionName}>{division.name}</Text>
                <Text style={styles.divisionSlots}>{division.slots}</Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rules</Text>
            <Text style={styles.text}>{mockTournament.rules}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sponsors</Text>
            <View style={styles.sponsorsList}>
              {mockTournament.sponsors.map((sponsor, index) => (
                <Text key={index} style={styles.sponsorItem}>
                  {sponsor}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Button
              title="Register Now"
              onPress={() => console.log('Register for tournament')}
              style={styles.registerButton}
            />
            <Button
              title="Back to Tournaments"
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
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
  scrollContent: {
    paddingBottom: SPACING.lg,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginVertical: SPACING.md,
  },
  section: {
    marginBottom: SPACING.lg,
    padding: SPACING.sm,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
    paddingBottom: SPACING.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  text: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  divisionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  divisionName: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  divisionSlots: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.accent,
  },
  sponsorsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  sponsorItem: {
    backgroundColor: COLORS.lightGray,
    padding: SPACING.xs,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    borderRadius: 4,
    fontSize: FONT_SIZES.xs,
  },
  actionButtons: {
    marginTop: SPACING.md,
  },
  registerButton: {
    marginBottom: SPACING.sm,
  },
  backButton: {
    backgroundColor: COLORS.lightGray,
  },
});

export default TournamentDetailsScreen;
