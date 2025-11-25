import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';

export const PrivateRoute = ({ children, requiredRole }) => {
  const dispatch = useDispatch();
  const { 
    isAuthenticated, 
    isSeller, 
    isBuyer, 
    jwtPayload, 
    loading 
  } = useSelector((state) => state.auth);

  // Verificar expiración del token
  useEffect(() => {
    if (jwtPayload?.exp && Date.now() >= jwtPayload.exp * 1000) {
      dispatch(logout());
    }
  }, [jwtPayload, dispatch]);

  // Verificar acceso basado en rol
  const checkAccess = () => {
    if (!isAuthenticated) {
      return { isAuth: false, hasAccess: false };
    }

    // Verificar expiración
    if (jwtPayload?.exp && Date.now() >= jwtPayload.exp * 1000) {
      return { isAuth: false, hasAccess: false };
    }

    if (!requiredRole) {
      return { isAuth: true, hasAccess: true };
    }

    // Verificar rol requerido
    let hasAccess = false;
    if (requiredRole === 'SELLER') {
      hasAccess = isSeller;
    } else if (requiredRole === 'BUYER') {
      hasAccess = isBuyer;
    }

    return { isAuth: true, hasAccess };
  };

  const { isAuth, hasAccess } = checkAccess();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && !hasAccess) {
    return <Navigate to="/" replace />;
  }

  return children;
};
