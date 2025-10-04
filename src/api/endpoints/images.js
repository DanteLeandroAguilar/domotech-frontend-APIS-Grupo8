 
import { getProductImages, mockImages, simulateApiDelay } from '../../data/mockData';

export const imagesAPI = {
  // POST /api/productos/{productId}/images - Subir imagen (solo SELLER)
  upload: async (productId, formData) => {
    await simulateApiDelay();
    // Simular subida de imagen
    const newImage = {
      imageId: `img_${Date.now()}`,
      productId: parseInt(productId),
      url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      isPrincipal: false
    };
    return newImage;
  },

  // GET /api/productos/{productId}/images - Obtener todas las imágenes del producto
  getByProduct: async (productId) => {
    await simulateApiDelay();
    return getProductImages(productId);
  },

  // GET /api/productos/{productId}/images/principal - Obtener imagen principal
  getPrincipal: async (productId) => {
    await simulateApiDelay();
    const images = getProductImages(productId);
    return images.find(img => img.isPrincipal) || images[0] || null;
  },

  // GET /api/images/{imageId}/download - URL para visualizar imagen
  getImageUrl: (imageId) => {
    return mockImages[imageId] || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop';
  },

  // PUT /api/images/{imageId}/principal - Marcar como principal (solo SELLER)
  markAsPrincipal: async (imageId) => {
    await simulateApiDelay();
    return { message: 'Imagen marcada como principal' };
  },

  // DELETE /api/images/{imageId} - Eliminar imagen (solo SELLER)
  delete: async (imageId) => {
    await simulateApiDelay();
    return { message: 'Imagen eliminada correctamente' };
  },
};