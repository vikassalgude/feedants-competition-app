/**
 * Dynamic API Base URL configuration
 * Reads process.env.EXPO_PUBLIC_API_URL or falls back to localhost:5000/api
 */

export const getApiBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  return 'http://localhost:5000/api';
};
