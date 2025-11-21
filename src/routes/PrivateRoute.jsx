import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isAuthenticated as authIsAuthenticated, getJwtPayload, getRolesFromPayload } from '../utils/auth';

export const PrivateRoute = ({ children, requiredRole }) => {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    // Verificar autenticación y roles localmente desde el JWT
    const checkAuth = () => {
      const authenticated = authIsAuthenticated();
      setIsAuth(authenticated);

      if (!authenticated) {
        setHasAccess(false);
        setLoading(false);
        return;
      }

      const payload = getJwtPayload();

      // Verificar expiración si existe el claim exp
      if (payload?.exp && Date.now() >= payload.exp * 1000) {
        localStorage.removeItem('token');
        setIsAuth(false);
        setHasAccess(false);
        setLoading(false);
        return;
      }

      if (!requiredRole) {
        setHasAccess(true);
        setLoading(false);
        return;
      }

      const roles = getRolesFromPayload(payload);
      setHasAccess(Array.isArray(roles) && roles.includes(requiredRole));
      setLoading(false);
    };

    checkAuth();
  }, []);

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
