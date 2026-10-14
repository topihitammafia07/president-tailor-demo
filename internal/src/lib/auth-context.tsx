'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { User } from '@/types';
import { api } from './api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_PROFILE_KEY = 'pt_cached_profile';

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: ReactNode;
  initialUser?: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(!initialUser);
  const router = useRouter();

  const syncCookies = (u: User | null) => {
    if (typeof document === 'undefined') return;
    if (u) {
      document.cookie = `pt_role=${u.role}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `pt_name=${encodeURIComponent(u.name)}; path=/; max-age=604800; SameSite=Lax`;
      document.cookie = `pt_email=${encodeURIComponent(u.email)}; path=/; max-age=604800; SameSite=Lax`;
    } else {
      document.cookie = 'pt_role=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'pt_name=; path=/; max-age=0; SameSite=Lax';
      document.cookie = 'pt_email=; path=/; max-age=0; SameSite=Lax';
    }
  };

  const refresh = useCallback(async () => {
    try {
      const data = await api.getMe();
      setUser(data.user);
      syncCookies(data.user);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(USER_PROFILE_KEY, JSON.stringify(data.user));
      }
    } catch {
      setUser(null);
      syncCookies(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(USER_PROFILE_KEY);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = sessionStorage.getItem(USER_PROFILE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          setUser((prev) => prev || parsed);
          syncCookies(parsed);
        }
      } catch {
        // ignore JSON parse error
      }
    }
    refresh();
  }, [refresh]);

  const login = async (email: string, pass: string) => {
    const res = await api.login(email, pass);
    setUser(res.user);
    syncCookies(res.user);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(USER_PROFILE_KEY, JSON.stringify(res.user));
    }
    if (res.user.role === 'owner') {
      router.push('/owner/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } finally {
      setUser(null);
      syncCookies(null);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(USER_PROFILE_KEY);
      }
      router.push('/login');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && !loading && !user && window.location.pathname !== '/login') {
      router.push('/login');
    }
  }, [user, loading, router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refresh }}>
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
