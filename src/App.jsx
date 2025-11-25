import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppRoutes } from './routes/AppRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchCart } from './store/slices/cartSlice';
import { getLoggedUser } from './store/slices/authSlice';
import { isBuyer } from './utils/auth';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Cargar información del usuario si hay token pero no hay usuario
    if (token && !user) {
      dispatch(getLoggedUser());
    }
  }, [dispatch, token, user]);

  useEffect(() => {
    if (isAuthenticated && isBuyer()) {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <AppRoutes />
      <ToastContainer />
    </>
  );
}

export default App;