import AsyncStorage from '@react-native-async-storage/async-storage';

// Use the IP address instead of localhost for better compatibility with mobile devices
// For iOS simulator, localhost may work, but for Android emulator and physical devices, use your computer's IP
export const API_URL = 'http://192.168.0.210:3000/api/v1';

// For development, you might need to switch between different URLs
// Uncomment the following line if localhost is needed
// export const API_URL = 'http://localhost:3000/api/v1';

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
