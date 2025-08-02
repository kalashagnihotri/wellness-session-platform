import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('wellness_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('wellness_token');
      window.location.href = '/login';
      toast.error('Session expired. Please log in again.');
    }
    return Promise.reject(error);
  }
);

// Authentication API functions
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (email: string, password: string) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },
};

// Session API functions
export const sessionAPI = {
  getPublicSessions: async (page = 1, limit = 10) => {
    const response = await api.get(`/sessions?page=${page}&limit=${limit}`);
    return response.data;
  },

  getMySessions: async () => {
    const response = await api.get('/sessions/my-sessions');
    return response.data;
  },

  getSessionById: async (id: string) => {
    const response = await api.get(`/sessions/my-sessions/${id}`);
    return response.data; // Return the full response structure
  },

  saveDraftSession: async (data: {
    id?: string;
    title: string;
    tags: string[] | string;
    json_file_url: string;
  }) => {
    const response = await api.post('/sessions/my-sessions/save-draft', data);
    return response.data;
  },

  publishSession: async (id: string) => {
    const response = await api.post(`/sessions/my-sessions/publish`, { id });
    return response.data;
  },

  deleteSession: async (id: string) => {
    const response = await api.delete(`/sessions/my-sessions/${id}`);
    return response.data;
  },
};

export default api;
