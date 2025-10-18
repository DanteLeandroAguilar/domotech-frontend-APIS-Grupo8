import { formatPrice } from '../../utils/formatters';

export const ProductTable = ({ products, onEdit, onDelete }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        No hay productos registrados
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3">Nombre</th>
            <th className="px-6 py-3">Precio</th>
            <th className="px-6 py-3">Descuento</th>
            <th className="px-6 py-3">Stock</th>
            <th className="px-6 py-3">Estado</th>
            <th className="px-6 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.productId}
              className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
            >
              <th className="px-6 py-4 font-medium whitespace-nowrap">
                {product.name}
              </th>
              <td className="px-6 py-4">{formatPrice(product.price)}</td>
              <td className="px-6 py-4">
                {product.discount > 0 ? `${product.discount} %` : '-'}
              </td>
              <td className="px-6 py-4">{product.stock}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    product.active
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                  }`}
                >
                  {product.active ? 'Activo' : 'Inactivo'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex gap-4 justify-end">
                  <button
                    onClick={() => onEdit(product)}
                    className="font-medium text-primary hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onDelete(product.productId)}
                    className="font-medium text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};