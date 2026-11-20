import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import { api } from '@/services/api';
import {
  clearSession,
  getStoredUser,
  getToken,
  setStoredUser,
  setToken,
} from '@/services/tokenStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getToken(), getStoredUser()])
      .then(([storedToken, storedUser]) => {
        setTokenState(storedToken);
        setUser(storedUser);
      })
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      async signIn(email, password) {
        const data = await api('/signin', {
          method: 'POST',
          body: { email, password },
          auth: false,
        });
        await setToken(data.token);
        await setStoredUser(data.user);
        setTokenState(data.token);
        setUser(data.user);
      },
      async signOut() {
        await clearSession();
        setTokenState(null);
        setUser(null);
      },
    }),
    [token, user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return ctx;
}
