import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { API_URL } from '../config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState({ completedModules: [], unlockedAchievements: [], points: 0 });

  const fetchProgress = useCallback(async (userToken) => {
    if (!userToken) return;
    try {
      const response = await fetch(`${API_URL}/api/progress`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      const data = await response.json();
      if (response.ok) {
        setProgress(data);
      }
    } catch (error) {
      console.error("Failed to fetch progress", error);
    }
  }, []);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      if (storedToken && storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
        fetchProgress(storedToken);
      }
    } catch (error) {
      console.error("Error loading auth state from localStorage", error);
      localStorage.clear();
    } finally {
      setIsLoading(false);
    }
  }, [fetchProgress]);

  const login = useCallback((userData, userToken) => {

    
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    setUser(userData);
    setToken(userToken);
    fetchProgress(userToken);
  }, [fetchProgress]);

  const logout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setToken(null);
    setProgress({ completedModules: [], unlockedAchievements: [], points: 0 });
  }, []);

  const value = useMemo(() => ({
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    progress,
    login,
    logout,
    fetchProgress // --- THIS LINE IS THE FIX ---
  }), [user, token, isLoading, progress, login, logout, fetchProgress]);

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}