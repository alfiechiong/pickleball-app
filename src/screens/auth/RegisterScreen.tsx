import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { AuthStackNavigationProp } from '../../navigation/types';
import theme from '../../styles/theme';

const { COLORS, SPACING, FONT_SIZES } = theme;

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Register</Text>
        <Text style={styles.message}>
          This is a placeholder for the Register screen. The full implementation will come in future
          updates.
        </Text>
        <Button
          title="Go back to Login"
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.md,
  },
  message: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  button: {
    minWidth: 200,
  },
});

export default RegisterScreen;
