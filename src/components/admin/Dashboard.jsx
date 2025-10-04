export const Dashboard = ({ stats }) => {
  const defaultStats = {
    totalSales: 0,
    pendingOrders: 0,
    productsInStock: 0,
  };

  const displayStats = stats || defaultStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Ventas Totales
        </h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
          ${displayStats.totalSales?.toLocaleString() || '0'}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Pedidos Pendientes
        </h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
          {displayStats.pendingOrders || '0'}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800/50 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Productos en Stock
        </h3>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
          {displayStats.productsInStock || '0'}
        </p>
      </div>
    </div>
  );
};