import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoriesAPI } from '../../api/endpoints/categories';

// Estado inicial
const initialState = {
  categories: [],
  currentCategory: null,
  loading: false,
  error: null,
};

// Thunk para obtener todas las categorías
export const fetchAllCategories = createAsyncThunk(
  'categories/fetchAllCategories',
  async () => {
    const response = await categoriesAPI.getAll();
    return response;
  }
);

// Thunk para obtener una categoría por ID
export const fetchCategoryById = createAsyncThunk(
  'categories/fetchCategoryById',
  async (id) => {
    const response = await categoriesAPI.getById(id);
    return response;
  }
);

// Thunk para crear una categoría (solo SELLER)
export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async (categoryData) => {
    const response = await categoriesAPI.create(categoryData);
    return response;
  }
);

// Thunk para actualizar una categoría (solo SELLER)
export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, categoryData }) => {
    const response = await categoriesAPI.update(id, categoryData);
    return response;
  }
);

// Thunk para eliminar una categoría (solo SELLER)
export const deleteCategory = createAsyncThunk(
  'categories/deleteCategory',
  async (id) => {
    await categoriesAPI.delete(id);
    return id;
  }
);

// Slice de categories
const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    // Obtener todas las categorías
    builder
      .addCase(fetchAllCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.categories = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllCategories.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al cargar las categorías';
        state.categories = [];
      });

    // Obtener categoría por ID
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al cargar la categoría';
        state.currentCategory = null;
      });

    // Crear categoría (admin)
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Agregar la nueva categoría a la lista
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al crear la categoría';
      });

    // Actualizar categoría (admin)
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Actualizar la categoría en la lista
        const index = state.categories.findIndex(c => c.categoryId === action.payload.categoryId);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        // Actualizar currentCategory si es la misma
        if (state.currentCategory?.categoryId === action.payload.categoryId) {
          state.currentCategory = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al actualizar la categoría';
      });

    // Eliminar categoría (admin)
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Eliminar la categoría de la lista
        state.categories = state.categories.filter(c => c.categoryId !== action.payload);
        // Limpiar currentCategory si es la eliminada
        if (state.currentCategory?.categoryId === action.payload) {
          state.currentCategory = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al eliminar la categoría';
      });
  },
});

export const { clearError, clearCurrentCategory } = categoriesSlice.actions;
export default categoriesSlice.reducer;

