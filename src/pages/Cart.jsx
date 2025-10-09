import { useEffect } from 'react';
import { Header } from '../components/common/Header';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { Loading } from '../components/common/Loading';
import { useCart } from '../hooks/useCart';

const Cart = () => {
  const { cart, loading, loadCart, clearCart } = useCart();

  useEffect(() => {
    loadCart();
  }, []);

  const handleClearCart = async () => {
    if (window.confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
      await clearCart();
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Loading message="Cargando carrito..." />
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background-light dark:bg-background-dark">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!cart || !cart.items || cart.items.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600 mb-4">
              shopping_cart
            </span>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Tu carrito está vacío
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Agrega algunos productos para comenzar
            </p>
            <button 
              onClick={() => window.location.href = '/catalog'}
              className="inline-flex items-center gap-2 rounded-lg bg-primary py-3 px-6 text-base font-bold text-white shadow-lg shadow-primary/30 hover:bg-primary/90 transition-all"
            >
              <span>Ver Productos</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                Carrito de Compras
              </h1>
              
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <CartItem key={item.id || item.productId} item={item} />
                ))}
              </div>

              {/* Botón Vaciar Carrito */}
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handleClearCart}
                  className="text-sm font-medium text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 transition-colors"
                >
                  Vaciar Carrito
                </button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <CartSummary cart={cart} />
            </div>
          </div>
        )}
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Carrito de Compras
            </h1>
      </main>
    </div>
  );
};

export default Cart;