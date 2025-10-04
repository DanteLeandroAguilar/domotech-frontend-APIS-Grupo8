import { createContext, useState, useEffect } from 'react';
import { authAPI } from '../api/endpoints/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario y token del localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = authAPI.getCurrentUser();

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const data = await authAPI.login(credentials);
      
      // Guardar token y usuario
      authAPI.saveAuth(data.token, data.user);
      setToken(data.token);
      setUser(data.user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Error al iniciar sesión' 
      };
    }
  };

  const register = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      
      // Guardar token y usuario
      authAPI.saveAuth(data.token, data.user);
      setToken(data.token);
      setUser(data.user);
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Error al registrarse' 
      };
    }
  };

  const logout = () => {
    authAPI.logout();
    setToken(null);
    setUser(null);
  };

  const isSeller = () => {
    return user?.role === 'SELLER';
  };

  const isBuyer = () => {
    return user?.role === 'BUYER';
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isSeller,
    isBuyer,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};