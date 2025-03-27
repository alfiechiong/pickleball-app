import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Picker } from '@react-native-picker/picker';
import Button from '../../components/Button';
import { AuthStackNavigationProp } from '../../navigation/types';
import theme from '../../styles/theme';
import { useAuth } from '../../contexts/AuthContext';

const { COLORS, SPACING, FONT_SIZES, BORDER_RADIUS } = theme;

type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'pro';

interface FormData {
  name: string;
  email: string;
  password: string;
  skill_level: SkillLevel;
}

// Form validation schema
const registerSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Please enter a valid email').required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  skill_level: yup
    .mixed<SkillLevel>()
    .oneOf(['beginner', 'intermediate', 'advanced', 'pro'] as const, 'Please select a skill level')
    .required('Skill level is required'),
});

const skillLevels = [
  { label: 'Select skill level', value: '' },
  { label: 'Beginner', value: 'beginner' as SkillLevel },
  { label: 'Intermediate', value: 'intermediate' as SkillLevel },
  { label: 'Advanced', value: 'advanced' as SkillLevel },
  { label: 'Pro', value: 'pro' as SkillLevel },
];

const RegisterScreen: React.FC = () => {
  const navigation = useNavigation<AuthStackNavigationProp>();
  const { register, error, clearError } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      skill_level: 'beginner',
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      clearError();
      await register(data);
    } catch (err) {
      Alert.alert('Registration Failed', error || 'An error occurred while registering');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Pickleball</Text>
          </View>

          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the pickleball community today!</Text>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <Controller
                control={control}
                name="name"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    style={styles.input}
                    placeholder="Create a password"
                    secureTextEntry
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Skill Level</Text>
              <Controller
                control={control}
                name="skill_level"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={value}
                      onValueChange={(itemValue: SkillLevel) => onChange(itemValue)}
                      style={styles.picker}
                    >
                      {skillLevels.slice(1).map(level => (
                        <Picker.Item key={level.value} label={level.label} value={level.value} />
                      ))}
                    </Picker>
                  </View>
                )}
              />
              {errors.skill_level && (
                <Text style={styles.errorText}>{errors.skill_level.message}</Text>
              )}
            </View>

            <Button
              title="Register"
              onPress={handleSubmit(onSubmit)}
              fullWidth
              loading={false}
              style={styles.button}
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: SPACING.md,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoText: {
    fontSize: FONT_SIZES.title,
    fontWeight: 'bold',
    color: COLORS.primary,
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
  form: {
    width: '100%',
  },
  inputContainer: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    fontSize: FONT_SIZES.md,
    backgroundColor: COLORS.white,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.white,
  },
  picker: {
    height: 50,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.xs,
    marginTop: SPACING.xs,
  },
  button: {
    marginBottom: SPACING.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  loginText: {
    color: COLORS.textSecondary,
    fontSize: FONT_SIZES.sm,
    marginRight: SPACING.xs,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
