import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cartAPI } from '../../api/endpoints/cart';

// Estado inicial
const initialState = {
  cart: null,
  loading: false,
  updating: false,
  error: null,
  itemCount: 0,
};

// Thunk para obtener el carrito del usuario
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async () => {
    const response = await cartAPI.getMyCart();
    return response;
  }
);

// Thunk para actualizar cantidad de producto en carrito
export const updateProductAmount = createAsyncThunk(
  'cart/updateProductAmount',
  async ({ productId, amount }) => {
    const response = await cartAPI.updateProductAmount(productId, amount);
    return response;
  }
);

// Thunk para vaciar el carrito
export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { getState }) => {
    const state = getState();
    const items = state.cart.cart?.items || [];
    
    if (items.length === 0) {
      return { id: 1, userId: null, active: true, items: [] };
    }
    
    // Actualizar todos los productos a cantidad 0 secuencialmente
    // Usar la última respuesta que será el carrito vacío
    let lastResponse = null;
    for (const item of items) {
      lastResponse = await cartAPI.updateProductAmount(item.productId, 0);
    }
    
    // Retornar la última respuesta (carrito actualizado y vacío)
    return lastResponse || { id: 1, userId: null, active: true, items: [] };
  }
);

// Thunk para obtener todos los carritos (solo SELLER)
export const fetchAllCarts = createAsyncThunk(
  'cart/fetchAllCarts',
  async (params = {}) => {
    const response = await cartAPI.getAll(params);
    return response;
  }
);

// Slice de cart
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Obtener carrito
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.cart = action.payload;
        // Calcular cantidad de items
        if (action.payload?.items) {
          state.itemCount = action.payload.items.reduce((total, item) => total + (item.amount || 0), 0);
        } else {
          state.itemCount = 0;
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al cargar el carrito';
        // Establecer carrito vacío en caso de error
        state.cart = {
          id: 1,
          items: [],
          total: 0,
          itemCount: 0,
        };
        state.itemCount = 0;
      });

    // Actualizar cantidad de producto
    builder
      .addCase(updateProductAmount.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateProductAmount.fulfilled, (state, action) => {
        state.updating = false;
        state.error = null;
        // Actualizar el carrito con la respuesta del backend
        state.cart = action.payload;
        // Calcular cantidad de items
        if (action.payload?.items) {
          state.itemCount = action.payload.items.reduce((total, item) => total + (item.amount || 0), 0);
        } else {
          state.itemCount = 0;
        }
      })
      .addCase(updateProductAmount.rejected, (state, action) => {
        state.updating = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al actualizar la cantidad';
      });

    // Vaciar carrito
    builder
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Actualizar el carrito con la respuesta del backend
        state.cart = action.payload;
        // Calcular cantidad de items
        if (action.payload?.items) {
          state.itemCount = action.payload.items.reduce((total, item) => total + (item.amount || 0), 0);
        } else {
          state.itemCount = 0;
        }
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al vaciar el carrito';
      });

    // Obtener todos los carritos (SELLER)
    builder
      .addCase(fetchAllCarts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCarts.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        // Los carritos de todos los usuarios no se guardan en el estado del carrito del usuario
      })
      .addCase(fetchAllCarts.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al cargar los carritos';
      });
  },
});

export const { clearError: clearCartError } = cartSlice.actions;
export default cartSlice.reducer;

