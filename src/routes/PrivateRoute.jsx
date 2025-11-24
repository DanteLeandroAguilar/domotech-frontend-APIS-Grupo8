import { Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectIsAuthenticated, 
  selectUserRole, 
  selectUserLoading,
  loadUserFromToken 
} from '../store/slices/userSlice';

export const PrivateRoute = ({ children, requiredRole }) => {
  const dispatch = useDispatch();
  
  // Estado de Redux
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const loading = useSelector(selectUserLoading);

  // Intentar cargar usuario desde token si no está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      const token = localStorage.getItem('token');
      if (token) {
        dispatch(loadUserFromToken());
      }
    }
  }, [dispatch, isAuthenticated]);

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere un rol específico, verificarlo
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  // Usuario autenticado y con el rol correcto
  return children;
};