// Estado global de la sesión (equivale a un servicio de autenticación en Angular).
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { authApi, setAuthToken, setUnauthorizedHandler } from '../api/client.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'reservas.token';

// localStorage puede fallar (modo privado, bloqueos): por eso cada acceso va en try/catch.
const storage = {
  get() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  },
  set(value) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* la sesión durará solo mientras la pestaña esté abierta */
    }
  },
  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* nada que limpiar */
    }
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = useCallback(() => {
    storage.clear();
    setAuthToken(null);
    setUser(null);
  }, []);

  // Al cargar la app: si hay un token guardado, se valida con /auth/me.
  useEffect(() => {
    setUnauthorizedHandler(logout);
    const savedToken = storage.get();
    if (!savedToken) {
      setLoading(false);
      return;
    }
    setAuthToken(savedToken);
    authApi
      .me()
      .then(setUser)
      .catch(logout)
      .finally(() => setLoading(false));
  }, [logout]);

  const startSession = useCallback(({ user: loggedUser, token }) => {
    storage.set(token);
    setAuthToken(token);
    setUser(loggedUser);
    return loggedUser;
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      login: async (credentials) => startSession(await authApi.login(credentials)),
      register: async (data) => startSession(await authApi.register(data)),
      logout,
    }),
    [user, loading, startSession, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return context;
}
