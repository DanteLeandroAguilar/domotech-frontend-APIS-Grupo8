import { useState, useEffect } from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { cartAPI } from './api/endpoints/cart';
import { isBuyer, isAuthenticated } from './utils/auth';

function App() {
  const [cartItemsCount, setCartItemsCount] = useState(0);

  useEffect(() => {
    loadCartCount();
  }, []);

  const loadCartCount = async () => {
    if (!isAuthenticated() || !isBuyer()) {
      setCartItemsCount(0);
      return;
    }

    try {
      const data = await cartAPI.getMyCart();
      if (data && data.items) {
        const count = data.items.reduce((total, item) => total + item.amount, 0);
        setCartItemsCount(count);
      }
    } catch (error) {
      console.error('Error al cargar carrito:', error);
    }
  };

  const updateCartCount = () => {
    loadCartCount();
  };

  return (
    <>
      <AppRoutes cartItemsCount={cartItemsCount} updateCartCount={updateCartCount} />
      <ToastContainer />
    </>
  );
}

export default App;