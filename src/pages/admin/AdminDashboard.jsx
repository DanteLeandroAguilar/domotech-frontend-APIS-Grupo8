import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Dashboard } from '../../components/admin/Dashboard';
import { fetchAllOrders } from '../../store/slices/ordersSlice';
import { fetchAllProducts } from '../../store/slices/productsSlice';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { orders, loading: loadingOrders } = useSelector((state) => state.orders);
  const { products, loading: loadingProducts } = useSelector((state) => state.products);
  
  const [stats, setStats] = useState({
    totalSales: 0,
    pendingOrders: 0,
    productsInStock: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);

  const loading = loadingOrders || loadingProducts;

  useEffect(() => {
    // Solo cargar si no hay datos y no está cargando
    if (orders.length === 0 && !loadingOrders) {
      dispatch(fetchAllOrders());
    }
    if (products.length === 0 && !loadingProducts) {
      dispatch(fetchAllProducts({ page: 0, size: 100 }));
    }
  }, [dispatch, orders.length, products.length, loadingOrders, loadingProducts]);

  // Calcular estadísticas cuando cambian los datos
  useEffect(() => {
    if (orders.length > 0 || products.length > 0) {
      const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
      const pendingOrders = orders.filter(
        order => order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED'
      ).length;
      const productsInStock = products.filter(p => p.stock > 0).length;

      setStats({
        totalSales,
        pendingOrders,
        productsInStock,
      });

      setRecentOrders(orders.slice(0, 5));
    }
  }, [orders, products]);

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
      CONFIRMED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
      DELIVERED: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
      CANCELED: 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300',
    };
    return colors[status] || colors.PENDING;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Panel de Administración
        </h2>

        {/* Estadísticas */}
        <Dashboard stats={stats} />

        {/* Pedidos recientes */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4">
          Pedidos Recientes
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
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    Cargando pedidos...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No hay pedidos recientes
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
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
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
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