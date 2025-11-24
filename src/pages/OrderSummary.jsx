import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/common/Header";
import { Footer } from "../components/common/Footer";
import { Button } from "../components/common/Button";
import { formatPrice, formatDate } from "../utils/formatters";
import { Loading } from "../components/common/Loading";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyOrders,
  selectLatestOrder,
  selectMyOrdersError,
  selectMyOrdersStatus,
} from "../store/slices/ordersSlice";

const OrderSummary = () => {
  const dispatch = useDispatch();
  const ordersStatus = useSelector(selectMyOrdersStatus);
  const ordersError = useSelector(selectMyOrdersError);
  const latestOrder = useSelector(selectLatestOrder);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const loading = ordersStatus === "loading";

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Loading message="Cargando orden..." />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow container mx-auto px-4 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
              <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-3xl">
                check_circle
              </span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              ¡Compra Exitosa!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Tu orden ha sido procesada correctamente
            </p>
          </div>

          {ordersStatus === "failed" && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">
              {ordersError || "No pudimos cargar los detalles de tu orden."}
            </div>
          )}

          {latestOrder && (
            <div className="bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800 rounded-lg p-6 lg:p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Detalles de la Orden
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Número de Orden
                  </span>
                  <span className="font-medium">#{latestOrder.orderId}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Fecha
                  </span>
                  <span className="font-medium">
                    {formatDate(latestOrder.orderDate)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">
                    Estado
                  </span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {latestOrder.orderStatus}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <h4 className="font-semibold mb-4">Productos</h4>
                <div className="space-y-3">
                  {latestOrder.details?.map((detail) => (
                    <div
                      key={detail.id}
                      className="flex justify-between text-sm"
                    >
                      <span className="text-gray-600 dark:text-gray-300">
                        {detail.productName} x {detail.quantity}
                      </span>
                      <span className="font-medium">
                        {formatPrice(detail.subtotal)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 mt-6 pt-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>{formatPrice(latestOrder.total)}</span>
                </div>
              </div>
            </div>
          )}

          {!loading && !latestOrder && ordersStatus !== "failed" && (
            <div className="bg-gray-50 border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700 rounded-lg p-6 text-center text-gray-600 dark:text-gray-300">
              Aún no registramos ninguna compra en tu cuenta.
            </div>
          )}

          <div className="mt-8 flex gap-4">
            <Link to="/" className="flex-1">
              <Button variant="outline" fullWidth>
                Volver al Inicio
              </Button>
            </Link>
            <Link to="/catalog" className="flex-1">
              <Button fullWidth>Seguir Comprando</Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderSummary;
