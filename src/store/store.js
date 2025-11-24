import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import productImageReducer from './slices/productImageSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    productImage: productImageReducer,
  },
  // Configuración adicional para desarrollo
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;