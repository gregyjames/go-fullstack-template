import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('authToken'));
  const navigate = useNavigate();

  const login = useCallback(async (username: string, password: string) => {
    const encoded = btoa(`${username}:${password}`);

    const response = await fetch('/api/ping', {
      headers: { 'Authorization': `Basic ${encoded}` },
    });

    if (!response.ok) {
      throw new Error('Invalid username or password');
    }

    localStorage.setItem('authToken', encoded);
    setToken(encoded);
    navigate('/dashboard');
  }, [navigate]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setToken(null);
    navigate('/login');
  }, [navigate]);

  const authFetch = useCallback(async (url: string, options: RequestInit = {}) => {
    const currentToken = localStorage.getItem('authToken');
    if (!currentToken) {
      logout();
      throw new Error('No auth token');
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Basic ${currentToken}`,
      },
    });

    if (response.status === 401) {
      logout();
      throw new Error('Unauthorized');
    }

    return response;
  }, [logout]);

  const value = {
    token,
    isAuthenticated: !!token,
    login,
    logout,
    authFetch,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
