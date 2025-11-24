import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import cartItemsReducer from "./cartItemsSlice";

export const store = configureStore({
  reducer: {
    products: productReducer,
    cartItems: cartItemsReducer,
  },
});