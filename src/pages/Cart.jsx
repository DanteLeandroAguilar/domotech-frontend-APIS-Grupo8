import { useEffect } from 'react';
import { Header } from '../components/common/Header';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { Loading } from '../components/common/Loading';
import { useCart } from '../hooks/useCart';

const Cart = () => {
  const { cart, loading, loadCart } = useCart();

  useEffect(() => {
    loadCart();
  }, []);

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
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
          Carrito de Compras
        </h1>

        {!cart || !cart.items || cart.items.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-gray-400 dark:text-gray-600">
              shopping_cart
            </span>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              Tu carrito está vacío
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cart.items.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
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