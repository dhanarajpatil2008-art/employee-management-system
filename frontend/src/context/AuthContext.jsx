import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize login state from LocalStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('ems_token');
    const savedUser = localStorage.getItem('ems_user');

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // 1. Login Function
  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('ems_token', token);
        localStorage.setItem('ems_user', JSON.stringify(user));
        return { success: true, user };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login Failed. Check credentials.'
      };
    }
  };

  // 2. Register Function (Employee)
  const register = async (userData) => {
    try {
      const res = await API.post('/auth/register', userData);
      if (res.data.success) {
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('ems_token', token);
        localStorage.setItem('ems_user', JSON.stringify(user));
        return { success: true, user };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration Failed.'
      };
    }
  };

  // 3. Logout Function
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ems_token');
    localStorage.removeItem('ems_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
