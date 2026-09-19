import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  quickDemoLogin: (role: 'admin' | 'user') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('dsa_jwt_token');
    const storedUser = localStorage.getItem('dsa_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        // Verify token with backend
        api.getProfile()
          .then(res => {
            setUser(res.user);
            localStorage.setItem('dsa_user', JSON.stringify(res.user));
          })
          .catch(() => {
            // Token expired or invalid
            localStorage.removeItem('dsa_jwt_token');
            localStorage.removeItem('dsa_user');
            setToken(null);
            setUser(null);
          })
          .finally(() => setIsLoading(false));
        return;
      } catch (e) {
        localStorage.removeItem('dsa_jwt_token');
        localStorage.removeItem('dsa_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.login({ email, password });
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('dsa_jwt_token', res.token);
    localStorage.setItem('dsa_user', JSON.stringify(res.user));
  };

  const signup = async (name: string, email: string, password: string, role?: string) => {
    const res = await api.signup({ name, email, password, role });
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('dsa_jwt_token', res.token);
    localStorage.setItem('dsa_user', JSON.stringify(res.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('dsa_jwt_token');
    localStorage.removeItem('dsa_user');
  };

  const quickDemoLogin = async (role: 'admin' | 'user') => {
    if (role === 'admin') {
      await login('admin@dsa.com', 'Password123!');
    } else {
      await login('alex@example.com', 'Password123!');
    }
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = Boolean(user && token);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isLoading,
        login,
        signup,
        logout,
        quickDemoLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
