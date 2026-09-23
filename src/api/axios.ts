import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to append Auth Bearer tokens when available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cc_auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to unwrap Spring Boot ApiResponse wrapper and Page pagination
apiClient.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object') {
      let data = response.data;
      if ('success' in data && 'data' in data) {
        data = data.data !== undefined && data.data !== null ? data.data : data;
      }
      if (data && typeof data === 'object' && !Array.isArray(data) && Array.isArray(data.content)) {
        data = data.content;
      }
      return {
        ...response,
        data,
      };
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cc_auth_token');
    }
    return Promise.reject(error);
  }
);
