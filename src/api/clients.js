import axios from 'axios';
import { getTokenFromStore } from '../store';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4003';

// Rutas públicas que no requieren token
const publicRoutes = ['/auth/register', '/auth/authenticate'];

// Función helper para verificar si una URL es pública
const isPublicRoute = (url) => {
  console.log('Verificando ruta pública para URL:', url);
  return publicRoutes.some(route => url.includes(route));
};

// Crear instancia de axios
const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor de solicitudes para agregar token
axiosInstance.interceptors.request.use(
  (config) => {
    // No agregar token si es una ruta pública
    if (!isPublicRoute(config.url)) {
      const token = getTokenFromStore();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Si el Content-Type ya está configurado (por ejemplo, para FormData), no sobrescribirlo
    if (config.headers['Content-Type'] === undefined && !(config.data instanceof FormData)) {
      config.headers['Content-Type'] = 'application/json';
    }

    // Si es FormData, remover Content-Type para que axios lo configure automáticamente
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas para manejar errores
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // Manejar error 401 (no autorizado)
    if (error.response?.status === 401) {
      // No redirigir si estamos en la página de login o register, o si es una ruta pública del backend
      // Esto permite que el componente maneje el error y muestre el mensaje
      const currentPath = window.location.pathname;
      const isAuthPage = currentPath === '/login' || currentPath === '/register';
      const isPublicBackendRoute = error.config?.url && isPublicRoute(error.config.url);
      
      if (!isAuthPage && !isPublicBackendRoute) {
        // Solo redirigir si no estamos en una página de autenticación
        window.location.href = '/login';
      }
    }

    // Rechazar con el error formateado
    return Promise.reject({
      status: error.response?.status || 500,
      message: error.response?.data?.message || error.response?.data?.error || error.message || 'Error en la petición',
      data: error.response?.data || null
    });
  }
);

// Objeto API con métodos HTTP
const api = {
  get: (url, options = {}) => {
    return axiosInstance.get(url, {
      params: options.params,
      headers: options.headers,
      responseType: options.responseType,
    });
  },

  post: (url, data, options = {}) => {
    return axiosInstance.post(url, data, {
      params: options.params,
      headers: options.headers,
      responseType: options.responseType,
    });
  },

  put: (url, data, options = {}) => {
    return axiosInstance.put(url, data, {
      params: options.params,
      headers: options.headers,
      responseType: options.responseType,
    });
  },

  patch: (url, data, options = {}) => {
    return axiosInstance.patch(url, data, {
      params: options.params,
      headers: options.headers,
      responseType: options.responseType,
    });
  },

  delete: (url, options = {}) => {
    return axiosInstance.delete(url, {
      params: options.params,
      headers: options.headers,
      responseType: options.responseType,
    });
  },
};

export default api;