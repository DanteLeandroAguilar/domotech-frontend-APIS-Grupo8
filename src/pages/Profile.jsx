import { useState, useEffect } from 'react';
import { Header } from '../components/common/Header';

const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const Profile = ({ cartItemsCount }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const payload = decodeJwt(token);
      setUserInfo(payload);
    }
  }, []);

  const formatDate = (epochSeconds) => {
    if (!epochSeconds) return '-';
    try {
      const d = new Date(epochSeconds * 1000);
      return d.toLocaleString();
    } catch {
      return '-';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header cartItemsCount={cartItemsCount} />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center gap-6 mb-8">
            <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-6xl">person</span>
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mi Perfil</h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {isAuthenticated ? 'Sesión activa' : 'No autenticado'}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold mb-4">Información del Perfil</h2>
            {isAuthenticated ? (
              userInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nombre</p>
                    <p className="font-medium">{userInfo.name || userInfo.firstname || userInfo.firstName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Apellido</p>
                    <p className="font-medium">{userInfo.lastname || userInfo.lastName || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium">{userInfo.email || userInfo.user_email || userInfo.sub || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Usuario</p>
                    <p className="font-medium">{userInfo.username || userInfo.preferred_username || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Rol</p>
                    <p className="font-medium">{userInfo.role || userInfo.roles?.[0] || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Emitido</p>
                    <p className="font-medium">{formatDate(userInfo.iat)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Expira</p>
                    <p className="font-medium">{formatDate(userInfo.exp)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Issuer</p>
                    <p className="font-medium break-all">{userInfo.iss || '-'}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  No se pudo leer la información del usuario desde el token.
                </p>
              )
            ) : (
              <p className="text-gray-600 dark:text-gray-400">
                Debes iniciar sesión para ver tu información de perfil.
              </p>
            )}

            <p className="mt-6 text-xs text-gray-500 dark:text-gray-500">
              La información se obtiene del payload del token JWT almacenado en localStorage (clave "token").
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
