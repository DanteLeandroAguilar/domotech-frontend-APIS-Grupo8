 
import { mockCategories, simulateApiDelay } from '../../data/mockData';

export const categoriesAPI = {
  // GET /categories - Obtener todas las categorías
  getAll: async () => {
    await simulateApiDelay();
    return mockCategories.filter(category => category.isActive);
  },

  // GET /categories/{id} - Obtener categoría por ID
  getById: async (id) => {
    await simulateApiDelay();
    const category = mockCategories.find(cat => cat.id === parseInt(id));
    if (!category) {
      throw new Error('Categoría no encontrada');
    }
    return category;
  },

  // POST /categories - Crear categoría (solo SELLER)
  create: async (categoryData) => {
    await simulateApiDelay();
    const newCategory = {
      id: Date.now(), // ID temporal
      ...categoryData,
      isActive: true
    };
    return newCategory;
  },

  // PUT /categories/{id} - Actualizar categoría (solo SELLER)
  update: async (id, categoryData) => {
    await simulateApiDelay();
    const category = mockCategories.find(cat => cat.id === parseInt(id));
    if (!category) {
      throw new Error('Categoría no encontrada');
    }
    return { ...category, ...categoryData };
  },

  // DELETE /categories/{id} - Eliminar categoría (solo SELLER)
  delete: async (id) => {
    await simulateApiDelay();
    const category = mockCategories.find(cat => cat.id === parseInt(id));
    if (!category) {
      throw new Error('Categoría no encontrada');
    }
    return { message: 'Categoría eliminada correctamente' };
  },
};