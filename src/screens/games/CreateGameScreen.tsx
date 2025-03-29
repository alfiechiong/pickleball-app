import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../contexts/AuthContext';
import { createGame, CreateGameData } from '../../services/gameService';
import { format } from 'date-fns';

const skillLevels = ['beginner', 'intermediate', 'advanced', 'pro'] as const;
type SkillLevel = (typeof skillLevels)[number];
const maxPlayerOptions = [2, 4, 6, 8] as const;
type MaxPlayers = (typeof maxPlayerOptions)[number];

interface FormData {
  location: string;
  date: Date;
  start_time: Date;
  end_time: Date;
  max_players: MaxPlayers;
  skill_level: SkillLevel;
  notes: string;
}

export const CreateGameScreen: React.FC = () => {
  const navigation = useNavigation();
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    location: '',
    date: new Date(),
    start_time: new Date(),
    end_time: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
    max_players: 4,
    skill_level: 'intermediate',
    notes: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Validate required fields
      if (!formData.location.trim()) {
        Alert.alert('Error', 'Please enter a location');
        return;
      }

      // Format times to ensure they match the required pattern
      const formatTimeToString = (date: Date) => {
        return format(date, 'HH:mm');
      };

      const gameData: CreateGameData = {
        location: formData.location.trim(),
        date: format(formData.date, 'yyyy-MM-dd'),
        start_time: formatTimeToString(formData.start_time),
        end_time: formatTimeToString(formData.end_time),
        max_players: formData.max_players,
        skill_level: formData.skill_level,
        notes: formData.notes?.trim() || undefined,
      };

      // Validate times
      const startTime = new Date(`1970-01-01T${gameData.start_time}`);
      const endTime = new Date(`1970-01-01T${gameData.end_time}`);

      if (endTime <= startTime) {
        Alert.alert('Error', 'End time must be after start time');
        return;
      }

      // Validate date is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const gameDate = new Date(gameData.date);
      gameDate.setHours(0, 0, 0, 0);

      if (gameDate < today) {
        Alert.alert('Error', 'Game date cannot be in the past');
        return;
      }

      console.log('Token available:', !!token);
      console.log('Submitting game data:', JSON.stringify(gameData, null, 2));

      if (!token) {
        throw new Error('Not authenticated');
      }

      const createdGame = await createGame(gameData, token);
      console.log('Created game:', JSON.stringify(createdGame, null, 2));

      Alert.alert('Success', 'Game created successfully!');
      navigation.goBack();
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      if (error instanceof Error) {
        console.error('Error details:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
        });
      }
      Alert.alert(
        'Error',
        error instanceof Error ? error.message : 'Failed to create game. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.form}>
          <Text style={styles.label}>Location</Text>
          <TextInput
            style={styles.input}
            value={formData.location}
            onChangeText={(text: string) => setFormData({ ...formData, location: text })}
            placeholder="Enter location"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Date</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Text>{format(formData.date, 'MMMM d, yyyy')}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Start Time</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartTimePicker(true)}>
            <Text>{format(formData.start_time, 'h:mm a')}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>End Time</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndTimePicker(true)}>
            <Text>{format(formData.end_time, 'h:mm a')}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Max Players</Text>
          {Platform.OS === 'ios' ? (
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => {
                Alert.alert(
                  'Select Max Players',
                  '',
                  maxPlayerOptions.map(num => ({
                    text: num.toString(),
                    onPress: () => setFormData({ ...formData, max_players: num }),
                  }))
                );
              }}
            >
              <Text style={styles.pickerButtonText}>{formData.max_players} Players</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.max_players}
                onValueChange={(value: MaxPlayers) =>
                  setFormData({ ...formData, max_players: value })
                }
                style={styles.picker}
                mode="dropdown"
              >
                {maxPlayerOptions.map(num => (
                  <Picker.Item key={num} label={`${num} Players`} value={num} />
                ))}
              </Picker>
            </View>
          )}

          <Text style={styles.label}>Skill Level</Text>
          {Platform.OS === 'ios' ? (
            <TouchableOpacity
              style={styles.pickerButton}
              onPress={() => {
                Alert.alert(
                  'Select Skill Level',
                  '',
                  skillLevels.map(level => ({
                    text: level.charAt(0).toUpperCase() + level.slice(1),
                    onPress: () => setFormData({ ...formData, skill_level: level }),
                  }))
                );
              }}
            >
              <Text style={styles.pickerButtonText}>
                {formData.skill_level.charAt(0).toUpperCase() + formData.skill_level.slice(1)}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.skill_level}
                onValueChange={(value: SkillLevel) =>
                  setFormData({ ...formData, skill_level: value })
                }
                style={styles.picker}
                mode="dropdown"
              >
                {skillLevels.map(level => (
                  <Picker.Item
                    key={level}
                    label={level.charAt(0).toUpperCase() + level.slice(1)}
                    value={level}
                  />
                ))}
              </Picker>
            </View>
          )}

          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={formData.notes}
            onChangeText={(text: string) => setFormData({ ...formData, notes: text })}
            placeholder="Add any additional notes"
            placeholderTextColor="#666"
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Game'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showDatePicker && (
        <DateTimePicker
          value={formData.date}
          mode="date"
          display="default"
          onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setFormData({ ...formData, date: selectedDate });
            }
          }}
          minimumDate={new Date()}
        />
      )}

      {showStartTimePicker && (
        <DateTimePicker
          value={formData.start_time}
          mode="time"
          display="default"
          onChange={(event: DateTimePickerEvent, selectedTime?: Date) => {
            setShowStartTimePicker(false);
            if (selectedTime) {
              setFormData({ ...formData, start_time: selectedTime });
            }
          }}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={formData.end_time}
          mode="time"
          display="default"
          onChange={(event: DateTimePickerEvent, selectedTime?: Date) => {
            setShowEndTimePicker(false);
            if (selectedTime) {
              setFormData({ ...formData, end_time: selectedTime });
            }
          }}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
    ...(Platform.OS === 'android' && {
      height: 50,
    }),
  },
  picker: {
    ...(Platform.OS === 'android'
      ? {
          height: 50,
          width: '100%',
        }
      : {
          height: 50,
          width: '100%',
        }),
  },
  pickerButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CreateGameScreen;
