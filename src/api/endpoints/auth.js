import api from '../axios';

export const authAPI = {
  // POST /auth/register
  register: async (userData) => {
    try {
      const data = await api.post('/auth/register', userData);
      return data;
    } catch (error) {
      // Extraer mensaje de error del nuevo formato
      const message = error.message || 'Error al registrarse';
      throw new Error(message);
    }
  },

  // POST /auth/authenticate
  login: async (credentials) => {
    try {
      const data = await api.post('/auth/authenticate', credentials);
      return data;
    } catch (error) {
      // Extraer mensaje de error del nuevo formato
      const message = error.message || 'Error al iniciar sesión';
      throw new Error(message);
    }
  },

  // Guardar token en localStorage
  saveAuth: (token) => {
    localStorage.setItem('token', token);
  },

  // Obtener token
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Logout
  logout: () => {
    localStorage.removeItem('token');
  },
};