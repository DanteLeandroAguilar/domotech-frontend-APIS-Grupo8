import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './slices/ordersSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    products: productsReducer,
    cart: cartReducer,
  },
});


