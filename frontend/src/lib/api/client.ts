import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';

// Create axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Get token from localStorage (Clerk stores it there)
      const token = localStorage.getItem('clerk_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error adding auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Return only data, not full response
    return response.data;
  },
  (error: AxiosError<{ message?: string }>) => {
    const message = error.response?.data?.message || error.message;

    // Handle different error types
    switch (error.response?.status) {
      case 400:
        toast.error(`Invalid request: ${message}`);
        break;
      case 401:
        toast.error('Please sign in to continue');
        // Don't redirect immediately, let Clerk handle it
        break;
      case 403:
        toast.error('You do not have permission');
        break;
      case 404:
        toast.error('Resource not found');
        break;
      case 409:
        toast.error(`Conflict: ${message}`);
        break;
      case 500:
        toast.error('Server error. Please try again later');
        break;
      default:
        if (error.code === 'ECONNABORTED') {
          toast.error('Request timeout');
        } else if (error.code === 'ERR_NETWORK') {
          toast.error('Network error. Check your connection');
        }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
