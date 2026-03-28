/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authStorageKey } from '../api/client.js';
import { fetchMe, login, signup } from '../api/shop.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    try {
      const raw = window.localStorage.getItem(authStorageKey);
      return raw ? JSON.parse(raw) : { token: null, user: null };
    } catch {
      return { token: null, user: null };
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      if (!auth.token) {
        setLoading(false);
        return;
      }

      try {
        const { user } = await fetchMe();
        const next = { token: auth.token, user };
        setAuth(next);
        window.localStorage.setItem(authStorageKey, JSON.stringify(next));
      } catch {
        setAuth({ token: null, user: null });
        window.localStorage.removeItem(authStorageKey);
      } finally {
        setLoading(false);
      }
    };

    bootstrap();
  }, [auth.token]);

  const saveAuth = (payload) => {
    setAuth(payload);
    window.localStorage.setItem(authStorageKey, JSON.stringify(payload));
  };

  const value = useMemo(
    () => ({
      token: auth.token,
      user: auth.user,
      loading,
      isAuthenticated: Boolean(auth.token && auth.user),
      login: async (payload) => {
        const data = await login(payload);
        saveAuth(data);
        return data;
      },
      signup: async (payload) => {
        const data = await signup(payload);
        saveAuth(data);
        return data;
      },
      logout: () => {
        setAuth({ token: null, user: null });
        window.localStorage.removeItem(authStorageKey);
      },
    }),
    [auth, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
