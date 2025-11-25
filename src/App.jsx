import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppRoutes } from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCart } from './store/slices/cartSlice';
import { isBuyer, isAuthenticated } from './utils/auth';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated() && isBuyer()) {
      dispatch(fetchCart());
    }
  }, [dispatch]);

  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
}

export default App;