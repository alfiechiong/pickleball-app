import axios from 'axios';
import { API_URL, getHeaders, handleApiError } from '../config/api';
import { User } from './authService';

export interface UpdateUserData {
  name?: string;
  email?: string;
  skill_level?: string;
  profile_picture?: string;
}

export const updateUserProfile = async (userId: number, data: UpdateUserData): Promise<User> => {
  try {
    const headers = await getHeaders();
    const response = await axios.put(`${API_URL}/users/${userId}`, data, { headers });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const getUserProfile = async (userId: number): Promise<User> => {
  try {
    const headers = await getHeaders();
    const response = await axios.get(`${API_URL}/users/${userId}`, { headers });
    return response.data.data;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};

export const uploadProfilePicture = async (
  userId: number,
  imageFile: FormData
): Promise<string> => {
  try {
    const headers = await getHeaders();
    const response = await axios.post(`${API_URL}/users/${userId}/profile-picture`, imageFile, {
      headers: {
        ...headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data.data.profile_picture_url;
  } catch (error) {
    handleApiError(error);
    throw error;
  }
};
