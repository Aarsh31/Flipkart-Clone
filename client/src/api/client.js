import axios from 'axios';

const AUTH_STORAGE_KEY = 'flipkart_clone_auth';
const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const normalizedApiBaseUrl = rawApiBaseUrl?.replace(/\/+$/, '');

export const api = axios.create({
  baseURL: normalizedApiBaseUrl ? `${normalizedApiBaseUrl}/api` : '/api',
});

api.interceptors.request.use((config) => {
  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!raw) {
    return config;
  }

  try {
    const auth = JSON.parse(raw);
    if (auth?.token) {
      config.headers.Authorization = `Bearer ${auth.token}`;
    }
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  return config;
});

export const authStorageKey = AUTH_STORAGE_KEY;
