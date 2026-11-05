import axios from 'axios';

let getAuthToken = async () => null;

export const setAuthTokenGetter = (getter) => {
  getAuthToken = getter || (async () => null);
};

const api = axios.create({
  baseURL: `${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000').replace(/\/+$/, '')}/api`,
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

/**
 * Attach the Clerk session token supplied by AuthContext to every request.
 */
api.interceptors.request.use(async (config) => {
  try {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // Silently continue — token may not be available on public routes
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/me')) {
      // If a 401 comes back, redirect to login (Clerk will handle re-auth)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
