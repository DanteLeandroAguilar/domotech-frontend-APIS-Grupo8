import { createContext, useState, useEffect, useContext } from 'react';
import { cartAPI } from '../api/endpoints/cart';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar carrito cuando el usuario esté autenticado
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const data = await cartAPI.getMyCart();
      setCart(data);
    } catch (error) {
      console.error('Error al cargar carrito:', error);
      // Inicializar carrito vacío en caso de error
      setCart({
        id: 1,
        items: [],
        total: 0,
        itemCount: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const updateProductAmount = async (productId, amount) => {
    try {
      const updatedCart = await cartAPI.updateProductAmount(productId, amount);
      setCart(updatedCart);
      return { success: true };
    } catch (error) {
      console.error('Error al actualizar carrito:', error);
      return { 
        success: false, 
        error: error.message || 'Error al actualizar carrito' 
      };
    }
  };

  const addToCart = async (productId, amount = 1) => {
    return await updateProductAmount(productId, amount);
  };

  const removeFromCart = async (productId) => {
    return await updateProductAmount(productId, 0);
  };

  const getCartItemsCount = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.amount, 0);
  };

  const getCartTotal = () => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + (item.price * item.amount), 0);
  };

  const clearCart = () => {
    setCart({
      id: 1,
      items: [],
      total: 0,
      itemCount: 0
    });
  };

  const value = {
    cart,
    loading,
    loadCart,
    updateProductAmount,
    addToCart,
    removeFromCart,
    getCartItemsCount,
    getCartTotal,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};