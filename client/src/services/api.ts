import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://smart-leads-api-50yq.onrender.com/api' : 'http://localhost:5001/api');

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

// Attach JWT token to every request and set baseURL dynamically
api.interceptors.request.use(
  (config) => {
    const savedApiUrl = localStorage.getItem('VITE_API_URL');
    config.baseURL = savedApiUrl || import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://smart-leads-api-50yq.onrender.com/api' : 'http://localhost:5001/api');

    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally — redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
