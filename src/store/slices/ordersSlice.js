import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ordersAPI } from '../../api/endpoints/orders';

// Estado inicial
const initialState = {
  orders: [],
  currentOrder: null,
  loading: false,
  confirming: false,
  error: null,
  confirmError: null,
};

// Thunk para confirmar una orden
export const confirmOrder = createAsyncThunk(
  'orders/confirm',
  async () => {
    const response = await ordersAPI.confirm();
    return response;
  }
);

// Thunk para obtener las órdenes del usuario autenticado
export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async () => {
    const response = await ordersAPI.getMyOrders();
    return response;
  }
);

// Thunk para obtener todas las órdenes (solo SELLER)
export const fetchAllOrders = createAsyncThunk(
  'orders/fetchAllOrders',
  async (params = {}) => {
    const response = await ordersAPI.getAll(params);
    return response;
  }
);

// Thunk para actualizar el estado de una orden (solo SELLER)
export const updateOrderStatus = createAsyncThunk(
  'orders/updateStatus',
  async ({ orderId, orderStatus }) => {
    const response = await ordersAPI.updateStatus(orderId, orderStatus);
    return response;
  }
);

// Slice de orders
const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.confirmError = null;
    },
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    // Confirmar orden
    builder
      .addCase(confirmOrder.pending, (state) => {
        state.confirming = true;
        state.confirmError = null;
      })
      .addCase(confirmOrder.fulfilled, (state, action) => {
        state.confirming = false;
        state.confirmError = null;
        // Guardar la orden retornada por el backend
        const newOrder = action.payload;
        if (newOrder) {
          // Establecer como orden actual
          state.currentOrder = newOrder;
          // Agregar a la lista de órdenes si no existe
          const orderExists = state.orders.some(order => order.orderId === newOrder.orderId);
          if (!orderExists) {
            state.orders.push(newOrder);
          } else {
            // Si existe, actualizarla
            const index = state.orders.findIndex(order => order.orderId === newOrder.orderId);
            if (index !== -1) {
              state.orders[index] = newOrder;
            }
          }
        }
      })
      .addCase(confirmOrder.rejected, (state, action) => {
        state.confirming = false;
        // Manejo de errores en extraReducers
        const error = action.payload || action.error;
        state.confirmError = error?.message || 'Error al confirmar la orden';
      });

    // Obtener órdenes del usuario
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = Array.isArray(action.payload) ? action.payload : [];
        // Si hay órdenes, establecer la más reciente como currentOrder
        if (state.orders.length > 0) {
          state.currentOrder = state.orders[state.orders.length - 1];
        }
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        // Manejo de errores en extraReducers
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al cargar las órdenes';
        state.orders = [];
      });

    // Obtener todas las órdenes (SELLER)
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.orders = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        // Manejo de errores en extraReducers
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al cargar las órdenes';
        state.orders = [];
      });

    // Actualizar estado de orden
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const updatedOrder = action.payload;
        // Actualizar la orden en la lista
        const index = state.orders.findIndex(order => order.orderId === updatedOrder.orderId);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        } else {
          state.orders.push(updatedOrder);
        }
        // Si es la orden actual, actualizarla también
        if (state.currentOrder?.orderId === updatedOrder.orderId) {
          state.currentOrder = updatedOrder;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        const error = action.payload || action.error;
        state.error = error?.message || 'Error al actualizar el estado de la orden';
      });
  },
});

export const { clearError, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;

