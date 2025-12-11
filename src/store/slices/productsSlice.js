import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productsAPI } from '../../api/endpoints/products';

// Estado inicial
const initialState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: {
    page: 0,
    size: 12,
    totalPages: 0,
    totalElements: 0,
  },
};

// Thunk para obtener productos con filtros
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (filters = {}) => {
    const response = await productsAPI.filter(filters);
    return response;
  }
);

// Thunk para obtener un producto por ID
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (id) => {
    const response = await productsAPI.getById(id);
    return response;
  }
);

// Thunk para obtener catálogo público
export const fetchCatalog = createAsyncThunk(
  'products/fetchCatalog',
  async ({ page = 0, size = 12 } = {}) => {
    const response = await productsAPI.getCatalog(page, size);
    return response;
  }
);

// Thunk para buscar productos
export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ term, page = 0, size = 12 } = {}) => {
    const response = await productsAPI.search(term, page, size);
    return response;
  }
);

// Thunk para obtener productos por categoría
export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async ({ categoryId, page = 0, size = 12 } = {}) => {
    const response = await productsAPI.getByCategory(categoryId, page, size);
    return response;
  }
);

// Thunk para verificar stock
export const checkStock = createAsyncThunk(
  'products/checkStock',
  async ({ id, quantity }) => {
    const response = await productsAPI.checkStock(id, quantity);
    return response;
  }
);

// Thunks para admin (SELLER)
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productsAPI.create(productData);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Error al crear el producto'
      });
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await productsAPI.update(id, productData);
      return response;
    } catch (error) {
      return rejectWithValue({
        message: error.message || 'Error al actualizar el producto'
      });
    }
    }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id) => {
    await productsAPI.delete(id);
    return id;
  }
);

export const updateProductStock = createAsyncThunk(
  'products/updateProductStock',
  async ({ id, stockData }) => {
    const response = await productsAPI.updateStock(id, stockData);
    return response;
  }
);

export const applyProductDiscount = createAsyncThunk(
  'products/applyProductDiscount',
  async ({ id, discountData }) => {
    const response = await productsAPI.applyDiscount(id, discountData);
    return response;
  }
);

export const removeProductDiscount = createAsyncThunk(
  'products/removeProductDiscount',
  async (id) => {
    const response = await productsAPI.removeDiscount(id);
    return response;
  }
);

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async ({ page = 0, size = 20 } = {}) => {
    const response = await productsAPI.getAll(page, size);
    return response;
  }
);

// Slice de products
const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    resetPage: (state) => {
      state.pagination.page = 0;
    },
    updateProductInList: (state, action) => {
      // Actualizar un producto en la lista con un ProductDto
      const updatedProduct = action.payload;
      const index = state.products.findIndex(p => p.productId === updatedProduct.productId);
      if (index !== -1) {
        state.products[index] = updatedProduct;
      }
      // Actualizar currentProduct si es el mismo
      if (state.currentProduct?.productId === updatedProduct.productId) {
        state.currentProduct = updatedProduct;
      }
    },
  }, // comienza los extra reducers para manejar los thunks asíncronos donde se llaman las APIs
  extraReducers: (builder) => {
    // Obtener productos con filtros
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      }) // si es correcto actualiza el estado/store
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = Array.isArray(action.payload.content) ? action.payload.content : [];
        state.pagination = {
          page: action.payload.page || state.pagination.page,
          size: action.payload.size || state.pagination.size,
          totalPages: action.payload.totalPages || 0,
          totalElements: action.payload.totalElements || 0,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al cargar los productos';
        state.products = [];
      });

    // Obtener producto por ID
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al cargar el producto';
        state.currentProduct = null;
      });

    // Obtener catálogo
    builder
      .addCase(fetchCatalog.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCatalog.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = Array.isArray(action.payload.content) ? action.payload.content : [];
        state.pagination = {
          ...state.pagination,
          page: action.payload.page || state.pagination.page,
          totalPages: action.payload.totalPages || 0,
          totalElements: action.payload.totalElements || 0,
        };
      })
      .addCase(fetchCatalog.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al cargar el catálogo';
        state.products = [];
      });

    // Buscar productos
    builder
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = Array.isArray(action.payload.content) ? action.payload.content : [];
        state.pagination = {
          page: action.payload.page || state.pagination.page,
          size: action.payload.size || state.pagination.size,
          totalPages: action.payload.totalPages || 0,
          totalElements: action.payload.totalElements || 0,
        };
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al buscar productos';
        state.products = [];
      });

    // Obtener productos por categoría
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = Array.isArray(action.payload.content) ? action.payload.content : [];
        state.pagination = {
          page: action.payload.page || state.pagination.page,
          size: action.payload.size || state.pagination.size,
          totalPages: action.payload.totalPages || 0,
          totalElements: action.payload.totalElements || 0,
        };
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al cargar productos por categoría';
        state.products = [];
      });

    // Verificar stock
    builder
      .addCase(checkStock.fulfilled, (state) => {
        // No cambia el estado, solo verifica
      })
      .addCase(checkStock.rejected, (state, action) => {
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al verificar stock';
      });

    // Crear producto (admin)
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Agregar el nuevo producto a la lista
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al crear el producto';
      });

    // Actualizar producto (admin)
    builder
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Actualizar el producto en la lista
        const index = state.products.findIndex(p => p.productId === action.payload.productId);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        // Actualizar currentProduct si es el mismo
        if (state.currentProduct?.productId === action.payload.productId) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al actualizar el producto';
      });

    // Eliminar producto (admin)
    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const index = state.products.findIndex(p => p.productId === action.payload);
        if (index !== -1) {
          state.products[index] = { ...state.products[index], active: false };
        }
        // Actualizar currentProduct si es el mismo
        if (state.currentProduct?.productId === action.payload) {
          state.currentProduct = { ...state.currentProduct, active: false };
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al eliminar el producto';
      });

    // Actualizar stock (admin)
    builder
      .addCase(updateProductStock.fulfilled, (state, action) => {
        // Actualizar el stock del producto en la lista
        const index = state.products.findIndex(p => p.productId === action.payload.productId);
        if (index !== -1) {
          state.products[index].stock = action.payload.stock;
        }
        // Actualizar currentProduct si es el mismo
        if (state.currentProduct?.productId === action.payload.productId) {
          state.currentProduct.stock = action.payload.stock;
        }
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al actualizar el stock';
      });

    // Aplicar descuento (admin)
    builder
      .addCase(applyProductDiscount.fulfilled, (state, action) => {
        // Actualizar el descuento del producto en la lista
        const index = state.products.findIndex(p => p.productId === action.payload.productId);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        // Actualizar currentProduct si es el mismo
        if (state.currentProduct?.productId === action.payload.productId) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(applyProductDiscount.rejected, (state, action) => {
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al aplicar el descuento';
      });

    // Quitar descuento (admin)
    builder
      .addCase(removeProductDiscount.fulfilled, (state, action) => {
        // Actualizar el producto en la lista
        const index = state.products.findIndex(p => p.productId === action.payload.productId);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        // Actualizar currentProduct si es el mismo
        if (state.currentProduct?.productId === action.payload.productId) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(removeProductDiscount.rejected, (state, action) => {
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al quitar el descuento';
      });

    // Obtener todos los productos (admin)
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.products = Array.isArray(action.payload.content) ? action.payload.content : [];
        state.pagination = {
          page: action.payload.page || state.pagination.page,
          size: action.payload.size || state.pagination.size,
          totalPages: action.payload.totalPages || 0,
          totalElements: action.payload.totalElements || 0,
        };
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al cargar los productos';
        state.products = [];
      });
  },
});

export const { clearError, clearCurrentProduct, setPage, resetPage, updateProductInList } = productsSlice.actions;
export default productsSlice.reducer;

