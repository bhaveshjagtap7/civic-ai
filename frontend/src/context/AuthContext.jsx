import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('civicai_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('civicai_token'));
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('civicai_theme') === 'dark' ||
      (!('civicai_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('civicai_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('civicai_theme', 'light');
    }
  }, [darkMode]);

  // Load User Profile on mount if token exists
  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/profile');
          if (res.status === 'success') {
            setUser(res.data);
            localStorage.setItem('civicai_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('Failed to load user profile', err);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [token]);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('civicai_token', userToken);
    localStorage.setItem('civicai_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('civicai_token');
    localStorage.removeItem('civicai_user');
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem('civicai_user', JSON.stringify(next));
      return next;
    });
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        darkMode,
        login,
        logout,
        updateUser,
        toggleDarkMode,
        isAuthenticated: !!token && !!user,
        isCitizen: user?.role === 'Citizen',
        isOfficer: user?.role === 'Officer',
        isAdmin: user?.role === 'Admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
