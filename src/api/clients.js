const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4003';

// Rutas públicas que no requieren token
const publicRoutes = ['/auth/register', '/auth/authenticate'];

// Función helper para construir query parameters
const buildQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return '';
  
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      queryParams.append(key, value);
    }
  });
  
  const queryString = queryParams.toString();
  return queryString ? `?${queryString}` : '';
};

// Función helper para verificar si una URL es pública
const isPublicRoute = (url) => {
  console.log('Verificando ruta pública para URL:', url);
  return publicRoutes.some(route => url.includes(route));
};

// Función helper para crear headers
const createHeaders = (url, customHeaders = {}) => {
  const headers = {
    ...customHeaders,
  };

  // No agregar Content-Type si ya viene en customHeaders (para FormData)
  if (!customHeaders['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  // Agregar token solo si no es una ruta pública
  if (!isPublicRoute(url)) {
    const token = localStorage.getItem('token');
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  return headers;
};

// Función helper para manejar respuestas
const handleResponse = (response) => {
  return response.json().then(data => {
    if (!response.ok) {
      // Manejar error 401 (no autorizado)
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      
      // Rechazar con el error
      return Promise.reject({
        status: response.status,
        message: data.message || data.error || 'Error en la petición',
        data: data
      });
    }
    return data;
  }).catch(error => {
    // Si el error no es JSON, crear un error genérico
    if (error.status) {
      return Promise.reject(error);
    }
    return Promise.reject({
      status: response.status,
      message: 'Error al procesar la respuesta',
      data: null
    });
  });
};

// Objeto API con métodos HTTP
const api = {
  get: (url, options = {}) => {
    const queryString = buildQueryString(options.params);
    const fullUrl = `${baseURL}${url}${queryString}`;
    
    return fetch(fullUrl, {
      method: 'GET',
      headers: createHeaders(url, options.headers),
    }).then(handleResponse);
  },

  post: (url, data, options = {}) => {
    const queryString = buildQueryString(options.params);
    const fullUrl = `${baseURL}${url}${queryString}`;
    
    // Si data es FormData, no convertir a JSON y no establecer Content-Type
    const isFormData = data instanceof FormData;
    const headers = createHeaders(url, options.headers);
    
    // Si es FormData, remover Content-Type para que el navegador lo configure automáticamente
    if (isFormData) {
      delete headers['Content-Type'];
    }
    
    return fetch(fullUrl, {
      method: 'POST',
      headers: headers,
      body: isFormData ? data : JSON.stringify(data),
    }).then(handleResponse);
  },

  put: (url, data, options = {}) => {
    const queryString = buildQueryString(options.params);
    const fullUrl = `${baseURL}${url}${queryString}`;
    
    // Si data es FormData, no convertir a JSON
    const isFormData = data instanceof FormData;
    const headers = createHeaders(url, options.headers);
    
    if (isFormData) {
      delete headers['Content-Type'];
    }
    
    return fetch(fullUrl, {
      method: 'PUT',
      headers: headers,
      body: isFormData ? data : JSON.stringify(data),
    }).then(handleResponse);
  },

  patch: (url, data, options = {}) => {
    const queryString = buildQueryString(options.params);
    const fullUrl = `${baseURL}${url}${queryString}`;
    
    return fetch(fullUrl, {
      method: 'PATCH',
      headers: createHeaders(url, options.headers),
      body: data ? JSON.stringify(data) : undefined,
    }).then(handleResponse);
  },

  delete: (url, options = {}) => {
    const queryString = buildQueryString(options.params);
    const fullUrl = `${baseURL}${url}${queryString}`;
    
    return fetch(fullUrl, {
      method: 'DELETE',
      headers: createHeaders(url, options.headers),
    }).then(handleResponse);
  },
};

export default api;