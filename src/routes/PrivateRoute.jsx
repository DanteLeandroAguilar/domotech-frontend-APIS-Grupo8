import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const PrivateRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, loading, isSeller, isBuyer } = useSelector((state) => state.auth);

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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar el rol si se requiere
  if (requiredRole === 'SELLER' && !isSeller) {
    return <Navigate to="/" replace />;
  }
  if (requiredRole === 'BUYER' && !isBuyer) {
    return <Navigate to="/" replace />;
  }

  return children;
};