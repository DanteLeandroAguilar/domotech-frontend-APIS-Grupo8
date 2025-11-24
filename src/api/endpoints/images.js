import api from '../clients';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4002';

export const imagesAPI = {
  // POST /api/productos/{productId}/images - Subir imagen (solo SELLER)
  upload: async (productId, formData) => {
    const response = await api.post(`/api/productos/${productId}/images`, formData);
    
    // Agregar URL completa a la respuesta
    if (response?.imageId) {
      response.url = `${BASE_URL}/api/images/${response.imageId}/download`;
    }
    
    return response;
  },

  // GET /api/productos/{productId}/images - Obtener todas las imágenes del producto
  getByProduct: async (productId) => {
    const response = await api.get(`/api/productos/${productId}/images`);
    
    // Construir URLs completas y normalizar propiedades
    return response.map(img => ({
      ...img,
      url: `${BASE_URL}/api/images/${img.imageId}/download`,
      isMain: img.isMain || img.isPrincipal || false
    }));
  },

  // GET /api/productos/{productId}/images/principal - Obtener imagen principal
  getPrincipal: async (productId) => {
    const response = await api.get(`/api/productos/${productId}/images/principal`);
    
    // Agregar URL completa
    if (response?.imageId) {
      response.url = `${BASE_URL}/api/images/${response.imageId}/download`;
      response.isMain = true;
    }
    
    return response;
  },

  // GET /api/images/{imageId}/download - URL para visualizar imagen
  getImageUrl: (imageId) => {
    return `${BASE_URL}/api/images/${imageId}/download`;
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