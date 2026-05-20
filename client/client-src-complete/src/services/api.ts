import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  // Increased timeout from 10s to 30s to accommodate Render's cold start delays
  timeout: 30000,
});

// Retry configuration for transient failures
const MAX_RETRIES = 3;

// Track retry counts per request using WeakMap for proper garbage collection
const requestRetryMap = new WeakMap<InternalAxiosRequestConfig, number>();

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    // Initialize retry count for this request
    requestRetryMap.set(config, 0);
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally — redirect to login
// Also implements retry logic for transient network failures
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as InternalAxiosRequestConfig;

    // Handle 401 - always redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Retry logic for transient failures (timeout, network errors, 5xx)
    // But not for client errors (4xx except 401)
    if (config) {
      const retryCount = requestRetryMap.get(config) ?? 0;
      if (retryCount < MAX_RETRIES) {
        const isTransientError =
          !error.response || // Network error
          error.code === 'ECONNABORTED' || // Timeout
          error.code === 'ENOTFOUND' || // DNS failure
          (error.response?.status && error.response.status >= 500); // Server error

        if (isTransientError) {
          const nextRetryCount = retryCount + 1;
          requestRetryMap.set(config, nextRetryCount);
          // Exponential backoff with base 2: 2s, 4s, 8s for retries 1, 2, 3
          // This avoids being too aggressive while still retrying quickly
          const delay = Math.pow(2, nextRetryCount) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
          return api(config);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
