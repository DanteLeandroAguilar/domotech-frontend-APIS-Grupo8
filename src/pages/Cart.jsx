import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../components/common/Header';
import { CartItem } from '../components/cart/CartItem';
import { CartSummary } from '../components/cart/CartSummary';
import { Loading } from '../components/common/Loading';
import { clearCart as clearCartAction } from '../store/slices/cartSlice';
import { formatPrice } from '../utils/formatters';

const Cart = () => {
  const dispatch = useDispatch();
  const { cart, loading } = useSelector((state) => state.cart);

  const handleClearCart = async () => {
    await dispatch(clearCartAction());
  };

  // Agrupar items por habitación
  const groupedItems = useMemo(() => {
    if (!cart?.items || cart.items.length === 0) return {};

    const grouped = {};
    cart.items.forEach((item) => {
      const room = item.room || 'general';
      if (!grouped[room]) {
        grouped[room] = [];
      }
      grouped[room].push(item);
    });

    // Ordenar habitaciones: "general" primero, luego alfabético
    const sortedRooms = Object.keys(grouped).sort((a, b) => {
      if (a === 'general') return -1;
      if (b === 'general') return 1;
      return a.localeCompare(b);
    });

    const sortedGrouped = {};
    sortedRooms.forEach((room) => {
      sortedGrouped[room] = grouped[room];
    });

    return sortedGrouped;
  }, [cart?.items]);

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Carrito de Compras
                </h1>
                <button 
                  onClick={handleClearCart}
                  className="flex items-center gap-2 text-sm font-medium text-red-600 dark:text-red-500 hover:text-red-800 dark:hover:text-red-400 transition-colors px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <span className="material-symbols-outlined text-lg">delete_sweep</span>
                  Vaciar Carrito
                </button>
              </div>
              
              <div className="space-y-6">
                {Object.entries(groupedItems).map(([room, items]) => {
                  const roomTotal = items.reduce((sum, item) => {
                    return sum + (item.finalPrice || (item.price * item.amount * (1 - (item.discount || 0) / 100)));
                  }, 0);
                  const roomItemCount = items.reduce((sum, item) => sum + item.amount, 0);
                  
                  return (
                    <div 
                      key={room} 
                      className="rounded-xl bg-white dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden transition-all hover:shadow-xl"
                    >
                      {/* Encabezado de la habitación */}
                      <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border-b-2 border-primary/20 dark:border-primary/30 px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/20 dark:bg-primary/30">
                              <span className="material-symbols-outlined text-2xl text-primary dark:text-primary">
                                {room === 'general' ? 'home' : 'room'}
                              </span>
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {room === 'general' ? 'Habitación General' : room.charAt(0).toUpperCase() + room.slice(1)}
                              </h2>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {roomItemCount} {roomItemCount === 1 ? 'producto' : 'productos'}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Subtotal</p>
                            <p className="text-lg font-bold text-primary dark:text-primary">
                              {formatPrice(roomTotal)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Lista de productos de la habitación */}
                      <div className="p-4 space-y-3">
                        {items.map((item) => (
                          <CartItem key={item.id || `${item.productId}-${room}`} item={item} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="lg:col-span-1">
              <CartSummary cart={cart} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Cart;