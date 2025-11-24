import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../api/endpoints/cart';

// Estado inicial
const initialState = {
  items: [],
  loading: false,
  error: null,
};

// ============ Thunks Asíncronos ============

// PATCH - Actualizar cantidad de producto en carrito
export const updateCartItemAmount = createAsyncThunk(
  'cartItems/updateCartItemAmount',
  async ({ productId, amount }) => {
    const response = await cartAPI.updateProductAmount(productId, amount);
    return response;
  }
);

// ============ Slice ============

const cartItemsSlice = createSlice({
  name: 'cartItems',
  initialState,
  reducers: {
    // Limpiar error
    clearError: (state) => {
      state.error = null;
    },
    
    // Resetear estado de items
    resetCartItemsState: () => {
      return initialState;
    },
    
    // Setear items (desde otra fuente, ej: cart slice)
    setCartItems: (state, action) => {
      state.items = action.payload || [];
    },
    
    // Limpiar items
    clearCartItems: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    // ========== Update Cart Item Amount ==========
    builder
      .addCase(updateCartItemAmount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemAmount.fulfilled, (state, action) => {
        state.loading = false;
        // Solo extraer los items de la respuesta
        state.items = action.payload?.items || [];
      })
      .addCase(updateCartItemAmount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Error al actualizar item del carrito';
      });
  },
});

// ============ Exportar Acciones y Reducer ============

export const {
  clearError,
  resetCartItemsState,
  setCartItems,
  clearCartItems,
} = cartItemsSlice.actions;

// Selectores
export const selectCartItems = (state) => state.cartItems.items;
export const selectCartItemsLoading = (state) => state.cartItems.loading;
export const selectCartItemsError = (state) => state.cartItems.error;

export default cartItemsSlice.reducer;

