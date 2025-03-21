import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { MainStackNavigationProp } from '../navigation/types';
import theme from '../styles/theme';

const { COLORS, SPACING, FONT_SIZES } = theme;

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation<MainStackNavigationProp>();

  // State for toggle settings
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [locationServices, setLocationServices] = useState(true);

  // Setting item component
  const SettingItem = ({
    title,
    description,
    isToggle = false,
    value,
    onValueChange,
    onPress,
  }: {
    title: string;
    description?: string;
    isToggle?: boolean;
    value?: boolean;
    onValueChange?: (newValue: boolean) => void;
    onPress?: () => void;
  }) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTextContainer}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description && <Text style={styles.settingDescription}>{description}</Text>}
      </View>
      {isToggle ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: COLORS.lightGray, true: COLORS.accent }}
        />
      ) : (
        <Button title="View" onPress={onPress || (() => {})} style={styles.viewButton} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <SettingItem
            title="Push Notifications"
            description="Receive push notifications for game updates"
            isToggle
            value={pushNotifications}
            onValueChange={setPushNotifications}
          />
          <SettingItem
            title="Email Notifications"
            description="Receive email updates for new games and tournaments"
            isToggle
            value={emailNotifications}
            onValueChange={setEmailNotifications}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>
          <SettingItem
            title="Dark Mode"
            description="Switch between light and dark themes"
            isToggle
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <SettingItem
            title="Location Services"
            description="Allow the app to use your location to find nearby games"
            isToggle
            value={locationServices}
            onValueChange={setLocationServices}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingItem
            title="Personal Information"
            description="Update your personal details and preferences"
            onPress={() => console.log('Navigate to personal info')}
          />
          <SettingItem
            title="Change Password"
            description="Update your account password"
            onPress={() => console.log('Navigate to password change')}
          />
          <SettingItem
            title="Privacy Policy"
            description="Read our privacy policy"
            onPress={() => console.log('Navigate to privacy policy')}
          />
          <SettingItem
            title="Terms of Service"
            description="Read our terms of service"
            onPress={() => console.log('Navigate to terms')}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Logout"
            onPress={() => console.log('Logout')}
            style={styles.logoutButton}
          />
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
  section: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.white,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  settingTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  viewButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    minWidth: 80,
  },
  buttonContainer: {
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  logoutButton: {
    backgroundColor: COLORS.error,
  },
});

export default SettingsScreen;
