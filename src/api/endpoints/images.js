import axios from 'axios';
import api from '../clients';
import { getTokenFromStore } from '../../store';

export const imagesAPI = {
  // POST /api/productos/{productId}/images - Subir imagen (solo SELLER)
  upload: async (productId, formData) => {
    const response = await api.post(`/api/productos/${productId}/images`, formData);
    return response;
  },

  // GET /api/productos/{productId}/images - Obtener todas las imágenes del producto
  getByProduct: async (productId) => {
    const response = await api.get(`/api/productos/${productId}/images`);
    return response;
  },

  // GET /api/productos/{productId}/images/principal - Obtener imagen principal
  getPrincipal: async (productId) => {
    const response = await api.get(`/api/productos/${productId}/images/principal`);
    return response;
  },

  // GET /api/images/{imageId}/download - URL para visualizar imagen
  getImageUrl: (imageId) => {
    return `${import.meta.env.VITE_API_URL}/api/images/${imageId}/download`;
  },

  // GET /api/images/{imageId}/download - Obtener imagen en base64
  getImageBase64: async (imageId) => {
    const token = getTokenFromStore();
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:4003';
    const url = `${baseURL}/api/images/${imageId}/download`;
    const response = await axios.get(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      responseType: 'blob',
    });
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Devuelve solo la parte base64 (sin el prefijo data:image/...)
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(response.data);
    });
  },

  // PUT /api/images/{imageId}/principal - Marcar como principal (solo SELLER)
  markAsPrincipal: async (imageId) => {
    const response = await api.put(`/api/images/${imageId}/principal`);
    return response;
  },

  // DELETE /api/images/{imageId} - Eliminar imagen (solo SELLER)
  delete: async (imageId) => {
    const response = await api.delete(`/api/images/${imageId}`);
    return response;
  },
};