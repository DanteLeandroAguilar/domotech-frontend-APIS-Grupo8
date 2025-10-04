 
import api from '../axios';

export const authAPI = {
  // POST /auth/register
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // POST /auth/authenticate
  login: async (credentials) => {
    const response = await api.post('/auth/authenticate', credentials);
    return response.data;
  },

  // Guardar token y usuario en localStorage
  saveAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};