import axios from 'axios';
import { config } from '../config';

let getTokenFn: (() => Promise<string | null>) | null = null;

export function setAuthTokenGetter(fn: () => Promise<string | null>) {
  getTokenFn = fn;
}

export const api = axios.create({
  baseURL: config.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000,
});

// Attach bearer token on every request
api.interceptors.request.use(async (cfg) => {
  if (getTokenFn) {
    const token = await getTokenFn();
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

// Unwrap { success, data } API envelope
api.interceptors.response.use(
  (response) => {
    const body = response.data;
    if (body && typeof body === 'object' && 'success' in body) {
      if (!body.success) {
        return Promise.reject(body.error);
      }
      response.data = body.data;
    }
    return response.data;
  },
  (error) => {
    const msg =
      error?.response?.data?.error?.message ||
      error?.response?.data?.message ||
      error?.message ||
      'Unknown API error';
    console.error(
      '[API Error]',
      error?.config?.method?.toUpperCase(),
      error?.config?.url,
      `→ ${error?.response?.status}`,
      msg,
      error?.response?.data
    );
    if (error.response?.status === 401) {
      // Token expired — Clerk will handle re-auth
    }
    return Promise.reject(error);
  }
);
