import AsyncStorage from '@react-native-async-storage/async-storage';

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
    throw new Error(error.response.data.error?.message || 'An error occurred');
  } else if (error.request) {
    // The request was made but no response was received
    throw new Error('No response from server');
  } else {
    // Something happened in setting up the request that triggered an Error
    throw new Error('Error setting up request');
  }
};
