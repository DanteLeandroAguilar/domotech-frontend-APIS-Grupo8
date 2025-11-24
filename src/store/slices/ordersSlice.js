import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ordersAPI } from "../../api/endpoints/orders";

export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMyOrders",
  async () => {
    const data = await ordersAPI.getMyOrders();
    return data;
  }
);

export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAllOrders",
  async (params = {}) => {
    const data = await ordersAPI.getAll(params);
    return data;
  }
);

export const confirmOrder = createAsyncThunk(
  "orders/confirmOrder",
  async () => {
    const data = await ordersAPI.confirm();
    return data;
  }
);

const initialState = {
  myOrders: [],
  myOrdersStatus: "idle",
  myOrdersError: null,
  allOrders: [],
  allOrdersStatus: "idle",
  allOrdersError: null,
  confirmStatus: "idle",
  confirmError: null,
  lastConfirmedOrder: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    resetConfirmState: (state) => {
      state.confirmStatus = "idle";
      state.confirmError = null;
      state.lastConfirmedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.myOrdersStatus = "loading";
        state.myOrdersError = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.myOrdersStatus = "succeeded";
        state.myOrders = action.payload || [];
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.myOrdersStatus = "failed";
        state.myOrdersError =
          action.error?.message || "No se pudo obtener tus órdenes";
      })
      .addCase(fetchAllOrders.pending, (state) => {
        state.allOrdersStatus = "loading";
        state.allOrdersError = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.allOrdersStatus = "succeeded";
        state.allOrders = action.payload || [];
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.allOrdersStatus = "failed";
        state.allOrdersError =
          action.error?.message || "No se pudo obtener las órdenes";
      })
      .addCase(confirmOrder.pending, (state) => {
        state.confirmStatus = "loading";
        state.confirmError = null;
        state.lastConfirmedOrder = null;
      })
      .addCase(confirmOrder.fulfilled, (state, action) => {
        state.confirmStatus = "succeeded";
        state.lastConfirmedOrder = action.payload;
        if (action.payload) {
          state.myOrders = [action.payload, ...state.myOrders];
        }
      })
      .addCase(confirmOrder.rejected, (state, action) => {
        state.confirmStatus = "failed";
        state.confirmError =
          action.error?.message || "No se pudo confirmar la orden";
      });
  },
});

export const { resetConfirmState } = ordersSlice.actions;

export const selectMyOrders = (state) => state.orders.myOrders;
export const selectMyOrdersStatus = (state) => state.orders.myOrdersStatus;
export const selectMyOrdersError = (state) => state.orders.myOrdersError;
export const selectAllOrders = (state) => state.orders.allOrders;
export const selectAllOrdersStatus = (state) => state.orders.allOrdersStatus;
export const selectAllOrdersError = (state) => state.orders.allOrdersError;
export const selectConfirmStatus = (state) => state.orders.confirmStatus;
export const selectConfirmError = (state) => state.orders.confirmError;
export const selectLastConfirmedOrder = (state) =>
  state.orders.lastConfirmedOrder;
export const selectLatestOrder = (state) => state.orders.myOrders?.[0] || null;

export default ordersSlice.reducer;
