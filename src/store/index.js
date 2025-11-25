import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './slices/ordersSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import categoriesReducer from './slices/categoriesSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    products: productsReducer,
    cart: cartReducer,
    categories: categoriesReducer,
    auth: authReducer,
  },
});

// Función helper para obtener el token del store (para uso fuera de componentes React)
export const getTokenFromStore = () => {
  const state = store.getState();
  return state.auth.token;
};


