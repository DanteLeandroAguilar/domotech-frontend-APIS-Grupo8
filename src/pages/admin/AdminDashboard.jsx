import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Dashboard } from '../../components/admin/Dashboard';
import { fetchAllOrders, updateOrderStatus } from '../../store/slices/ordersSlice';
import { fetchAllProducts } from '../../store/slices/productsSlice';
import { getStatusBadgeColorSelect } from '../../utils/formatters';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { orders, loading: loadingOrders } = useSelector((state) => state.orders);
  const { products, loading: loadingProducts } = useSelector((state) => state.products);

  const loading = loadingOrders || loadingProducts;

  useEffect(() => {
    dispatch(fetchAllOrders());
    dispatch(fetchAllProducts({ page: 0, size: 100 }));
  }, [dispatch]);

  // Calcular estadísticas usando useMemo para optimizar
  const stats = useMemo(() => {
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const pendingOrders = orders.filter(
      order => order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED'
    ).length;
    const productsInStock = products.filter(p => p.stock > 0).length;

    return {
      totalSales,
      pendingOrders,
      productsInStock,
    };
  }, [orders, products]);

  // Estados para el cambio de estado
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Manejar cambio de estado
  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await dispatch(updateOrderStatus({ orderId, orderStatus: newStatus })).unwrap();
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // Ordenar órdenes por orderId descendente (más recientes primero)
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => b.orderId - a.orderId);
  }, [orders]);

  // Estados disponibles
  const orderStatuses = ['PENDING', 'CONFIRMED', 'DELIVERED', 'CANCELED'];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Panel de Administración
        </h2>

        {/* Estadísticas */}
        <Dashboard stats={stats} />

        {/* Gestión de Pedidos */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
          Gestión de Pedidos
        </h2>
        
        <div className="overflow-x-auto bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-800">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
            <thead className="bg-gray-50 dark:bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ID del Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No hay pedidos
                  </td>
                </tr>
              ) : (
                sortedOrders.map((order) => (
                  <tr key={order.orderId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      Usuario #{order.userId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      {new Date(order.orderDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.orderStatus}
                          onChange={(e) => handleStatusChange(order.orderId, e.target.value)}
                          disabled={updatingOrderId === order.orderId}
                          className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${getStatusBadgeColorSelect(order.orderStatus)}`}
                        >
                          {orderStatuses.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                      ${order.total.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;