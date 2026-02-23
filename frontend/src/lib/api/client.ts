import axios, { AxiosError } from 'axios';
import { toast } from 'sonner';
import { config } from '@/lib/config';

// Auth token getter - set from App context
let getAuthToken: (() => Promise<string | null>) | null = null;

export const setAuthTokenGetter = (getter: () => Promise<string | null>) => {
  getAuthToken = getter;
};

// Create axios instance with production-grade configuration
const apiClient = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: config.apiTimeout,
  headers: {
    'Content-Type': 'application/json',
    // Required when routing through an ngrok tunnel — prevents the ngrok
    // interstitial browser-warning page from intercepting API responses.
    'ngrok-skip-browser-warning': 'true',
  },
  withCredentials: true, // Send cookies with requests
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Get token from Clerk's secure session
      if (getAuthToken) {
        const token = await getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
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

// Track shown errors to prevent spam
const shownErrors = new Set<string>();

// Error logger - ready for production monitoring integration (Sentry, LogRocket, etc.)
const logError = (error: AxiosError, context: string) => {
  // In development, log to console
  if (import.meta.env.DEV) {
    console.error(`[API Error] ${context}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
      url: error.config?.url,
      method: error.config?.method,
    });
  }
  
  // In production, send to monitoring service
  // Example: Sentry.captureException(error, { extra: { context } });
  // Example: LogRocket.captureException(error);
};

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    // Unwrap the API envelope: { success, data } -> data
    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
      return body.data;
    }
    return body;
  },
  (error: AxiosError<{ message?: string }>) => {
    // Log error for monitoring
    logError(error, 'API Request Failed');
    
    const message = error.response?.data?.message || error.message;
    const status = error.response?.status;
    
    // Create unique error key to prevent duplicate toasts
    const errorKey = `${status}-${message.substring(0, 50)}`;
    
    // Only show each unique error once per 5 seconds
    if (!shownErrors.has(errorKey)) {
      shownErrors.add(errorKey);
      
      // Handle different error types
      switch (status) {
        case 400:
          toast.error(`Invalid request: ${message}`);
          break;
        case 401:
          toast.error('Please sign in to continue');
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
      
      // Clear error key after 5 seconds
      setTimeout(() => shownErrors.delete(errorKey), 5000);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

// Typed API methods that return just the data
export const api = {
  get: <T = any>(url: string, config?: any): Promise<T> => {
    return apiClient.get(url, config);
  },
  post: <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    return apiClient.post(url, data, config);
  },
  patch: <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    return apiClient.patch(url, data, config);
  },
  put: <T = any>(url: string, data?: any, config?: any): Promise<T> => {
    return apiClient.put(url, data, config);
  },
  delete: <T = any>(url: string, config?: any): Promise<T> => {
    return apiClient.delete(url, config);
  },
};
