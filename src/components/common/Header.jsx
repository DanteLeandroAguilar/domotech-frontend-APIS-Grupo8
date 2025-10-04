import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useState } from 'react';

export const Header = () => {
  const { isAuthenticated, user, logout, isSeller } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${searchQuery}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo y Navegación */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 text-gray-900 dark:text-white">
              <span className="material-symbols-outlined text-primary text-3xl">home_automation</span>
              <span className="text-xl font-bold">DomoTech</span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                Inicio
              </Link>
              <Link to="/catalog" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                Productos
              </Link>
              {isSeller() && (
                <>
                  <Link to="/admin" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/admin/products" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                    Gestión
                  </Link>
                </>
              )}
            </nav>
          </div>

          {/* Búsqueda y Acciones */}
          <div className="flex items-center gap-4">
            {/* Barra de búsqueda */}
            <form onSubmit={handleSearch} className="relative hidden sm:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg bg-gray-100 dark:bg-gray-800/50 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 border border-transparent focus:border-primary/30"
                placeholder="Buscar productos..."
              />
            </form>

            {/* Carrito (solo para compradores autenticados) */}
            {isAuthenticated && !isSeller() && (
              <Link to="/cart" className="relative rounded-lg p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
                <span className="material-symbols-outlined">shopping_cart</span>
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>
            )}

            {/* Usuario */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="hidden sm:block text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary">
                  {user?.username}
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-500 transition-colors"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link to="/login" className="px-5 py-2.5 text-sm font-bold bg-primary text-white rounded-lg shadow-md hover:bg-primary/90 transition-all">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};