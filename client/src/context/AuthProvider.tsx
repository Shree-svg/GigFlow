import { useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/auth.service';
import { AuthContext } from './AuthContext';

const getInitialAuth = (): { token: string | null; user: User | null } => {
  const savedToken = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  if (!savedToken || !savedUser) return { token: null, user: null };
  try {
    return { token: savedToken, user: JSON.parse(savedUser) as User };
  } catch {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return { token: null, user: null };
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [initialAuth] = useState(getInitialAuth);
  const [user, setUser] = useState<User | null>(initialAuth.user);
  const [token, setToken] = useState<string | null>(initialAuth.token);
  const isLoading = false;

  const persist = (tok: string, usr: User) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('user', JSON.stringify(usr));
    setToken(tok);
    setUser(usr);
  };

  const login = async (email: string, password: string) => {
    const res = await authService.login(email, password);
    if (!res.success || !res.data) throw new Error(res.message);
    persist(res.data.token, res.data.user);
  };

  const register = async (name: string, email: string, password: string, role?: string) => {
    const res = await authService.register(name, email, password, role);
    if (!res.success || !res.data) throw new Error(res.message);
    persist(res.data.token, res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user, token, isAdmin: user?.role === 'Admin',
        isLoading, login, register, logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
