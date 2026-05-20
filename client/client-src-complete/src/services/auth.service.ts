import api from './api';
import type { ApiResponse, AuthResponse } from '../types';

export const authService = {
  async register(name: string, email: string, password: string, role?: string) {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/register', {
      name, email, password, ...(role && { role }),
    });
    return data;
  },

  async login(email: string, password: string) {
    const { data } = await api.post<ApiResponse<AuthResponse>>('/auth/login', {
      email, password,
    });
    return data;
  },

  async getMe() {
    const { data } = await api.get<ApiResponse>('/auth/me');
    return data;
  },
};
