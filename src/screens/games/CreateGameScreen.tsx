import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { MainStackNavigationProp } from '../../navigation/types';
import theme from '../../styles/theme';

const { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } = theme;

const CreateGameScreen: React.FC = () => {
  const navigation = useNavigation<MainStackNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Create Game</Text>
        <Text style={styles.subtitle}>Enter game details below</Text>

        <View style={styles.formContainer}>
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Game Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter a title for your game"
              placeholderTextColor={COLORS.gray}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Date</Text>
            <TextInput
              style={styles.input}
              placeholder="Select date"
              placeholderTextColor={COLORS.gray}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Time</Text>
            <TextInput
              style={styles.input}
              placeholder="Select time"
              placeholderTextColor={COLORS.gray}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Location</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter game location"
              placeholderTextColor={COLORS.gray}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Number of Players</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter number of players (e.g., 4)"
              placeholderTextColor={COLORS.gray}
              keyboardType="number-pad"
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Skill Level</Text>
            <TextInput
              style={styles.input}
              placeholder="Select skill level"
              placeholderTextColor={COLORS.gray}
            />
          </View>

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter details about the game"
              placeholderTextColor={COLORS.gray}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Create Game"
              onPress={() => {
                console.log('Create game pressed');
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
    height: 100,
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

export default CreateGameScreen;
