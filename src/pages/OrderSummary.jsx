import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Button } from '../components/common/Button';
import { ordersAPI } from '../api/endpoints/orders';
import { formatPrice, formatDate } from '../utils/formatters';
import { Loading } from '../components/common/Loading';

const OrderSummary = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLatestOrder();
  }, []);

  const loadLatestOrder = async () => {
    try {
      const data = await ordersAPI.getMyOrders();
      if (data && data.length > 0) {
        // Obtener la orden más reciente
        setOrder(data[data.length - 1]);
      }
    } catch (error) {
      console.error('Error al cargar orden:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Loading message="Cargando confirmación..." />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-2xl mx-auto">
          {/* Encabezado de confirmación */}
          <div className="text-center">
            <svg 
              className="mx-auto h-12 w-12 text-primary" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              ¡Gracias por tu compra!
            </h2>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
              Tu pedido ha sido realizado y se está procesando. Recibirás una confirmación por correo electrónico en breve.
            </p>
          </div>

          {/* Resumen del pedido */}
          {order && (
            <div className="mt-10 bg-white dark:bg-background-dark/50 border border-gray-200 dark:border-white/10 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold p-4 sm:p-6 border-b border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
                Resumen del pedido
              </h3>
              
              {/* Lista de productos */}
              <div className="p-4 sm:p-6 space-y-4">
                {order.details?.map((detail, index) => (
                  <div key={detail.id || index} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="material-symbols-outlined text-gray-400">
                        package_2
                      </span>
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {detail.productName}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Cantidad: {detail.quantity}
                      </p>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(detail.subtotal)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totales */}
              <div className="border-t border-gray-200 dark:border-white/10 p-4 sm:p-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600 dark:text-gray-400">Subtotal</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(order.total)}
                  </p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600 dark:text-gray-400">Envío</p>
                  <p className="font-medium text-gray-900 dark:text-white">$0.00</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600 dark:text-gray-400">Impuestos</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatPrice(order.total * 0.07)}
                  </p>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-white/10 mt-2">
                  <p className="text-gray-900 dark:text-white">Total</p>
                  <p className="text-gray-900 dark:text-white">
                    {formatPrice(order.total * 1.07)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Información de la orden */}
          {order && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-white/10 rounded-lg p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Número de orden</p>
                  <p className="font-medium text-gray-900 dark:text-white">#{order.orderId}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Fecha</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(order.orderDate)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Estado</p>
                  <p className="font-medium text-green-600 dark:text-green-400">
                    {order.orderStatus}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Botones de acción */}
          <div className="mt-8 flex flex-col sm:flex-row-reverse gap-4">
            <Link to="/profile" className="flex-1">
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Ver estado del pedido
              </button>
            </Link>
            <Link to="/catalog" className="flex-1">
              <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-white/20 text-sm font-medium rounded-lg shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-background-dark/50 hover:bg-gray-50 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                Seguir comprando
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSummary;