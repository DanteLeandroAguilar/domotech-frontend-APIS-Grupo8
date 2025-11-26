import { Link } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Button } from '../components/common/Button';
import { formatPrice, formatDate } from '../utils/formatters';
import { Loading } from '../components/common/Loading';
import { imagesAPI } from '../api/endpoints/images';
import { fetchPrincipalImage, fetchImageBase64 } from '../store/slices/imagesSlice';

const OrderSummary = () => {
  const dispatch = useDispatch();
  const { currentOrder, confirming, error } = useSelector((state) => state.orders);
  const { token } = useSelector((state) => state.auth);
  const { principalImages, base64Images, loadingImages } = useSelector((state) => state.images);

  // Cargar imágenes principales y base64 que no estén en el estado
  useEffect(() => {
    if (!token || !currentOrder || !currentOrder.details) return;
    
    const productIds = new Set();
    currentOrder.details.forEach(detail => {
      productIds.add(detail.productId);
    });

    // Cargar imágenes principales que no estén en el estado
    Array.from(productIds).forEach((productId) => {
      if (!principalImages[productId]) {
        dispatch(fetchPrincipalImage(productId));
      }
    });
  }, [currentOrder, token, principalImages, dispatch]);

  // Cargar base64 de las imágenes principales
  useEffect(() => {
    if (!currentOrder || !currentOrder.details) return;
    
    const productIds = new Set();
    currentOrder.details.forEach(detail => {
      productIds.add(detail.productId);
    });

    Array.from(productIds).forEach((productId) => {
      const principal = principalImages[productId];
      const imageId = principal?.imageId;
      
      if (imageId && !base64Images[imageId] && !loadingImages[imageId]) {
        dispatch(fetchImageBase64(imageId));
      }
    });
  }, [currentOrder, principalImages, base64Images, loadingImages, dispatch]);

  // Calcular URLs de imágenes desde el estado
  const productImages = {};
  if (currentOrder?.details) {
    currentOrder.details.forEach(detail => {
      const principal = principalImages[detail.productId];
      const imageId = principal?.imageId;
      
      if (imageId && base64Images[imageId]) {
        productImages[detail.productId] = `data:image/jpeg;base64,${base64Images[imageId]}`;
      }
    });
  }


  // Mostrar loading solo si se está confirmando la orden
  if (confirming) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Loading message="Procesando orden..." />
        </main>
        <Footer />
      </div>
    );
  }

  // Si no hay orden actual, mostrar mensaje
  if (!currentOrder) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              No se encontró la orden
            </h2>
            <p className="mt-4 text-base text-gray-600 dark:text-gray-400">
              No hay una orden disponible para mostrar.
            </p>
            <div className="mt-8">
              <Link to="/catalog" className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-primary hover:bg-primary/90">
                Volver al catálogo
              </Link>
            </div>
          </div>
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
          {currentOrder && (
            <div className="mt-10 bg-white dark:bg-background-dark/50 border border-gray-200 dark:border-white/10 rounded-lg shadow-sm">
              <h3 className="text-lg font-bold p-4 sm:p-6 border-b border-gray-200 dark:border-white/10 text-gray-900 dark:text-white">
                Resumen del pedido
              </h3>
              
              {/* Lista de productos */}
              <div className="p-4 sm:p-6 space-y-4">
                {currentOrder.details?.map((detail, index) => (
                  <div key={detail.id || index} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      {productImages[detail.productId] ? (
                        <img
                          src={productImages[detail.productId]}
                          alt={detail.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="material-symbols-outlined text-gray-400">
                            package_2
                          </span>
                        </div>
                      )}
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
                    {formatPrice(currentOrder.total)}
                  </p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600 dark:text-gray-400">Envío</p>
                  <p className="font-medium text-gray-900 dark:text-white">$0.00</p>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-white/10 mt-2">
                  <p className="text-gray-900 dark:text-white">Total</p>
                  <p className="text-gray-900 dark:text-white">
                    {formatPrice(currentOrder.total)}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Información de la orden */}
          {currentOrder && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-white/10 rounded-lg p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Número de orden</p>
                  <p className="font-medium text-gray-900 dark:text-white">#{currentOrder.orderId}</p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Fecha</p>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {formatDate(currentOrder.orderDate)}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 dark:text-gray-400 mb-1">Estado</p>
                  <p className="font-medium text-green-600 dark:text-green-400">
                    {currentOrder.orderStatus}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Mostrar error si hay uno */}
          {error && (
            <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400">Error: {error}</p>
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