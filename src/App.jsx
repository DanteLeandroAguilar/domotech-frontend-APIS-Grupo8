import { useEffect } from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, selectCartQuantity } from './store/cartSlice';
import { isBuyer, isAuthenticated } from './utils/auth';

function App() {
  const dispatch = useDispatch();
  const cartItemsCount = useSelector(selectCartQuantity);

  useEffect(() => {
    if (isAuthenticated() && isBuyer()) {
      dispatch(fetchCart());
    }
  }, [dispatch]);

  const updateCartCount = () => {
    dispatch(fetchCart());
  };

  return (
    <>
      <AppRoutes cartItemsCount={cartItemsCount} updateCartCount={updateCartCount} />
      <ToastContainer />
    </>
  );
}

export default App;