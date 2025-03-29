import AsyncStorage from '@react-native-async-storage/async-storage';

// Use localhost for iOS simulator or Android emulator
// For physical devices, this would need to be the actual IP address of your computer
export const API_URL = 'http://localhost:3000/api/v1';

export const getHeaders = async () => {
  const token = await AsyncStorage.getItem('accessToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const handleApiError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error Response:', {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    });
    throw new Error(error.response.data.message || 'An error occurred');
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API No Response Error:', error.request);
    throw new Error('No response from server');
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Setup Error:', error.message);
    throw new Error('Error setting up request');
  }
};
