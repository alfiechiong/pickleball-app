import React from 'react';
import { TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const API_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://your-production-url.com';

const LogoutButton = () => {
  const { logout: authLogout, token } = useAuth();

  const handleLogout = async () => {
    try {
      // Call logout API
      await axios.post(
        `${API_URL}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 5000, // 5 second timeout
        }
      );

      // Clear local auth state
      await authLogout();
    } catch (error) {
      console.error('Logout error:', error);

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          Alert.alert('Error', 'Request timed out. Please try again.');
        } else if (!error.response) {
          Alert.alert('Error', 'Network error. Please check your connection.');
        } else {
          Alert.alert('Error', 'Failed to logout. Please try again.');
        }
      }

      // Still clear local state even if API call fails
      await authLogout();
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Logout',
            onPress: handleLogout,
            style: 'destructive',
          },
        ]);
      }}
    >
      <Ionicons name="log-out-outline" size={24} color="#fff" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginRight: 15,
  },
});

export default LogoutButton;
