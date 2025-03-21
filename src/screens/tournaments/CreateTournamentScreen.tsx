import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { MainStackNavigationProp } from '../../navigation/types';
import theme from '../../styles/theme';

const { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } = theme;

const CreateTournamentScreen: React.FC = () => {
  const navigation = useNavigation<MainStackNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Tournament</Text>
        <Text style={styles.subtitle}>Fill in tournament details</Text>

        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Tournament Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter tournament name"
              placeholderTextColor={COLORS.gray}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Start Date</Text>
            <TextInput
              style={styles.input}
              placeholder="Select start date"
              placeholderTextColor={COLORS.gray}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>End Date</Text>
            <TextInput
              style={styles.input}
              placeholder="Select end date"
              placeholderTextColor={COLORS.gray}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter tournament location"
              placeholderTextColor={COLORS.gray}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Maximum Participants</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter maximum number of participants"
              placeholderTextColor={COLORS.gray}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Entry Fee</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter entry fee"
              placeholderTextColor={COLORS.gray}
              keyboardType="decimal-pad"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Registration Deadline</Text>
            <TextInput
              style={styles.input}
              placeholder="Select registration deadline"
              placeholderTextColor={COLORS.gray}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter tournament details, rules, prizes, etc."
              placeholderTextColor={COLORS.gray}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Create Tournament"
              onPress={() => {
                console.log('Create tournament pressed');
                navigation.goBack();
              }}
              style={styles.button}
            />
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              type="secondary"
              style={styles.button}
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
  content: {
    padding: SPACING.md,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  fieldContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.backgroundLight,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: SPACING.sm,
  },
  buttonContainer: {
    marginTop: SPACING.md,
  },
  button: {
    marginBottom: SPACING.md,
  },
});

export default CreateTournamentScreen;
