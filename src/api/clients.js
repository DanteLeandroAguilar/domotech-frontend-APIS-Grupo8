import axios from 'axios';
import { getTokenFromStore } from '../store';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4003';

// Rutas públicas que no requieren token
const publicRoutes = ['/auth/register', '/auth/authenticate'];

// Crear instancia de axios
const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de request - Agregar token automáticamente
axiosInstance.interceptors.request.use(
  (config) => {
    // Verificar si es una ruta pública
    const isPublic = publicRoutes.some(route => config.url.includes(route));
    
    // Agregar token solo si no es ruta pública
    if (!isPublic) {
      const token = getTokenFromStore();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de response - Manejar errores globalmente
axiosInstance.interceptors.response.use(
  (response) => {
    // Retornar solo la data
    return response.data;
  },
  (error) => {
    // Manejar error 401 (no autorizado)
    if (error.response?.status === 401) {
      // Limpiar el token - PrivateRoute se encargará de la redirección
      localStorage.removeItem('token');
    }
    
    // Formato consistente de error
    const errorResponse = {
      status: error.response?.status,
      message: error.response?.data?.message || error.response?.data?.error || error.message || 'Error en la petición',
      data: error.response?.data
    };
    
    return Promise.reject(errorResponse);
  }
);

// Objeto API con métodos HTTP
const api = {
  get: (url, options = {}) => {
    return axiosInstance.get(url, {
      params: options.params,
      headers: options.headers,
    });
  },

  post: (url, data, options = {}) => {
    // Si data es FormData, axios maneja Content-Type automáticamente
    return axiosInstance.post(url, data, {
      params: options.params,
      headers: options.headers,
    });
  },

  put: (url, data, options = {}) => {
    return axiosInstance.put(url, data, {
      params: options.params,
      headers: options.headers,
    });
  },

  patch: (url, data, options = {}) => {
    return axiosInstance.patch(url, data, {
      params: options.params,
      headers: options.headers,
    });
  },

  delete: (url, options = {}) => {
    return axiosInstance.delete(url, {
      params: options.params,
      headers: options.headers,
    });
  },
};

export default api;