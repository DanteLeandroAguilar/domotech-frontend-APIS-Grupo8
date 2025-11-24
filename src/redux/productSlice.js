import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI } from '../api/endpoints/products';

// Estado inicial
const initialState = {
  products: [],
  currentProduct: null,
  filters: {
    categoryId: null,
    brand: null,
    minPrice: null,
    maxPrice: null,
    searchTerm: '',
    compatibility: null,
    connectionType: null,
    withStock: null,
    withDiscount: null,
  },
  pagination: {
    page: 0,
    size: 12,
    totalPages: 0,
    totalElements: 0,
    sortBy: 'name',
    sortDirection: 'asc',
  },
  loading: false,
  error: null,
  stockCheck: null,
};

// ============ Thunks Asíncronos ============

// GET - Obtener catálogo de productos con paginación
export const fetchCatalog = createAsyncThunk(
  'products/fetchCatalog',
  async ({ page = 0, size = 12 } = {}) => {
      const response = await productsAPI.getCatalog(page, size);
      return response;
  }
);

// GET - Obtener producto por ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id) => {
      const response = await productsAPI.getById(id);
      return response;
  }
);

// GET - Buscar productos
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ term, page = 0, size = 12 }) => {
      const response = await productsAPI.search(term, page, size);
      return response; 
  }
);

// GET - Obtener productos por categoría
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async ({ categoryId, page = 0, size = 12 }) => {
      const response = await productsAPI.getByCategory(categoryId, page, size);
      return response;
  }
);

// GET - Filtrar productos (filtros unificados)
export const filterProducts = createAsyncThunk(
  'products/filterProducts',
  async (filters) => {
      const response = await productsAPI.filter(filters);
      return response;
  }
);

// GET - Verificar stock disponible
export const checkProductStock = createAsyncThunk(
  'products/checkProductStock',
  async ({ id, quantity }) => {
      const response = await productsAPI.checkStock(id, quantity);
      return response;
  }
);

// POST - Crear nuevo producto (SELLER)
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData) => {
      const response = await productsAPI.create(productData);
      return response;
  }
);

// PUT - Actualizar producto existente (SELLER)
export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }) => {
      const response = await productsAPI.update(id, productData);
      return response;
  }
);

// PATCH - Actualizar stock (SELLER)
export const updateProductStock = createAsyncThunk(
  'products/updateProductStock',
  async ({ id, stockData }) => {
      const response = await productsAPI.updateStock(id, stockData);
      return response;
  }
);

// PATCH - Aplicar descuento (SELLER)
export const applyProductDiscount = createAsyncThunk(
  'products/applyProductDiscount',
  async ({ id, discountData }) => {
      const response = await productsAPI.applyDiscount(id, discountData);
      return response;
  }
);

// DELETE - Quitar descuento (SELLER)
export const removeProductDiscount = createAsyncThunk(
  'products/removeProductDiscount',
  async (id) => {
      const response = await productsAPI.removeDiscount(id);
      return response; 
  }
);

// DELETE - Eliminar producto (SELLER)
export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id) => {
      const response = await productsAPI.delete(id);
      return { id, ...response };
  }
);

// GET - Obtener todos los productos (ADMIN)
export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async ({ page = 0, size = 20 } = {}) => {
      const response = await productsAPI.getAll(page, size);
      return response;
  }
);

// ============ Slice ============

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Actualizar filtros localmente
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Limpiar filtros
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    
    // Actualizar paginación
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
    
    // Limpiar producto actual
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    
    // Limpiar error
    clearError: (state) => {
      state.error = null;
    },
    
    // Limpiar verificación de stock
    clearStockCheck: (state) => {
      state.stockCheck = null;
    },
    
    // Resetear estado completo
    resetProductState: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // ========== Fetch Catalog ==========
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.content || action.payload;
        state.pagination = {
          ...state.pagination,
          page: action.payload.number || 0,
          size: action.payload.size || state.pagination.size,
          totalPages: action.payload.totalPages || 1,
          totalElements: action.payload.totalElements || state.products.length,
        };
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar el catálogo';
      });

    // ========== Fetch Product By ID ==========
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar el producto';
      });

    // ========== Search Products ==========
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.content || action.payload;
        state.pagination = {
          ...state.pagination,
          page: action.payload.number || 0,
          size: action.payload.size || state.pagination.size,
          totalPages: action.payload.totalPages || 1,
          totalElements: action.payload.totalElements || state.products.length,
        };
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al buscar productos';
      });

    // ========== Fetch Products By Category ==========
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.content || action.payload;
        state.pagination = {
          ...state.pagination,
          page: action.payload.number || 0,
          size: action.payload.size || state.pagination.size,
          totalPages: action.payload.totalPages || 1,
          totalElements: action.payload.totalElements || state.products.length,
        };
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar productos por categoría';
      });

    // ========== Filter Products ==========
    builder
      .addCase(filterProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filterProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.content || action.payload;
        state.pagination = {
          ...state.pagination,
          page: action.payload.number || 0,
          size: action.payload.size || state.pagination.size,
          totalPages: action.payload.totalPages || 1,
          totalElements: action.payload.totalElements || state.products.length,
        };
      })
      .addCase(filterProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al filtrar productos';
      });

    // ========== Check Product Stock ==========
    builder
      .addCase(checkProductStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkProductStock.fulfilled, (state, action) => {
        state.loading = false;
        state.stockCheck = action.payload;
      })
      .addCase(checkProductStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al verificar stock';
      });

    // ========== Create Product ==========
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al crear el producto';
      });

    // ========== Update Product ==========
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al actualizar el producto';
      });

    // ========== Update Product Stock ==========
    builder
      .addCase(updateProductStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al actualizar el stock';
      });

    // ========== Apply Product Discount ==========
    builder
      .addCase(applyProductDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyProductDiscount.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(applyProductDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al aplicar el descuento';
      });

    // ========== Remove Product Discount ==========
    builder
      .addCase(removeProductDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProductDiscount.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(removeProductDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al quitar el descuento';
      });

    // ========== Delete Product ==========
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(p => p.id !== action.payload.id);
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al eliminar el producto';
      });

    // ========== Fetch All Products ==========
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.content || action.payload;
        state.pagination = {
          ...state.pagination,
          page: action.payload.number || 0,
          size: action.payload.size || state.pagination.size,
          totalPages: action.payload.totalPages || 1,
          totalElements: action.payload.totalElements || state.products.length,
        };
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al cargar todos los productos';
      });
  },
});

// ============ Exportar Acciones y Reducer ============

export const {
  setFilters,
  clearFilters,
  setPagination,
  clearCurrentProduct,
  clearError,
  clearStockCheck,
  resetProductState,
} = productSlice.actions;

// Selectores
export const selectProducts = (state) => state.products.products;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectFilters = (state) => state.products.filters;
export const selectPagination = (state) => state.products.pagination;
export const selectLoading = (state) => state.products.loading;
export const selectError = (state) => state.products.error;
export const selectStockCheck = (state) => state.products.stockCheck;

export default productSlice.reducer;

