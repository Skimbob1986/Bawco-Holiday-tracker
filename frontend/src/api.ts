import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface Holiday {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  description?: string;
  userId: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (email: string, password: string, name?: string) =>
    api.post<AuthResponse>('/auth/register', { email, password, name }),
  login: (email: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { email, password }),
};

export const holidayAPI = {
  getAll: () => api.get<Holiday[]>('/holidays'),
  getById: (id: number) => api.get<Holiday>(`/holidays/${id}`),
  create: (data: Omit<Holiday, 'id' | 'userId'>) =>
    api.post<Holiday>('/holidays', data),
  update: (id: number, data: Partial<Holiday>) =>
    api.put<Holiday>(`/holidays/${id}`, data),
  delete: (id: number) => api.delete(`/holidays/${id}`),
};

export default api;
