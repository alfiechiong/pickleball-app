import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { API_URL } from '../config/constants';

// Types
import { ApiResponse } from '../types';

// Log the API URL when service is initialized
console.log('API Service initialized with baseURL:', API_URL);

class ApiService {
  private instance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.instance = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      timeout: 15000, // 15 seconds
    });

    console.log('Axios instance created with baseURL:', this.instance.defaults.baseURL);
    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      config => {
        if (this.token) {
          config.headers['Authorization'] = `Bearer ${this.token}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      response => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Attempt to refresh the token
            const newToken = await this.refreshToken();
            this.setToken(newToken);

            // Update the failed request with the new token
            if (originalRequest && originalRequest.headers) {
              originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            }

            // Retry the original request
            return this.instance(originalRequest);
          } catch (refreshError) {
            // If refresh fails, clear the token and redirect to login
            this.clearToken();
            // You might want to implement a callback or event here to notify the app
            // that the user needs to log in again
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  // Set auth token
  public setToken(token: string): void {
    this.token = token;
  }

  // Clear auth token
  public clearToken(): void {
    this.token = null;
  }

  // Refresh token
  private async refreshToken(): Promise<string> {
    // Implement your token refresh logic here
    // This could be a call to your auth service
    try {
      const response = await this.instance.post('/auth/refresh-token');
      return response.data.token;
    } catch (error) {
      throw new Error('Failed to refresh token');
    }
  }

  // Generic request method
  public async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
    try {
      const response: AxiosResponse = await this.instance(config);
      return {
        data: response.data.data || response.data,
        status: response.status,
        message: response.data.message || 'Success',
      };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          data: {} as T,
          status: error.response.status,
          message: error.response.data.message || error.message,
        };
      } else {
        return {
          data: {} as T,
          status: 500,
          message: 'Network error',
        };
      }
    }
  }

  // Helper methods for common HTTP methods
  public async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    console.log(`API GET request to: ${this.instance.defaults.baseURL}${url}`);
    return this.request<T>({ method: 'GET', url, params });
  }

  public async post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', url, data });
  }

  public async put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', url, data });
  }

  public async delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', url });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;
