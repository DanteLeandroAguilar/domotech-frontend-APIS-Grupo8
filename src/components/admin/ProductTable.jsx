import { useSelector } from 'react-redux';
import { formatPrice } from '../../utils/formatters';
import { selectImagesByProduct } from '../../store/slices/productImageSlice';

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
            <th className="px-6 py-3">Imagen</th>
            <th className="px-6 py-3">Nombre</th>
            <th className="px-6 py-3">Precio</th>
            <th className="px-6 py-3">Descuento</th>
            <th className="px-6 py-3">Stock</th>
            <th className="px-6 py-3">Estado</th>
            <th className="px-6 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            return (
              <ProductTableRow
                key={product.productId}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Componente separado para cada fila (optimización de renders)
const ProductTableRow = ({ product, onEdit, onDelete }) => {
  // Obtener imágenes desde Redux
  const images = useSelector(state => selectImagesByProduct(state, product.productId));
  const principalImage = images.find(img => img.isMain) || images[0];

  return (
    <tr className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
      <td className="px-6 py-4">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
          {principalImage ? (
            <img
              src={principalImage.url}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          {/* Badge de imagen principal */}
          {principalImage?.isMain && (
            <div className="absolute top-1 right-1 bg-primary/90 text-white text-[10px] px-1.5 py-0.5 rounded-full font-semibold shadow-sm">
              ★
            </div>
          )}
        </div>
      </td>
      
      <th className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
        <div className="max-w-xs truncate" title={product.name}>
          {product.name}
        </div>
      </th>
      
      <td className="px-6 py-4 text-gray-900 dark:text-white">
        {formatPrice(product.price)}
      </td>
      
      <td className="px-6 py-4">
        {product.discount > 0 ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
            {product.discount}% OFF
          </span>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">-</span>
        )}
      </td>
      
      <td className="px-6 py-4">
        <span className={`font-medium ${
          product.stock > 0 
            ? 'text-gray-900 dark:text-white' 
            : 'text-red-500 dark:text-red-400'
        }`}>
          {product.stock}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
            product.active
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
          }`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${
            product.active ? 'bg-green-500' : 'bg-red-500'
          }`}></span>
          {product.active ? 'Activo' : 'Inactivo'}
        </span>
      </td>
      
      <td className="px-6 py-4 text-right">
        <div className="flex gap-3 justify-end">
          <button
            onClick={() => onEdit(product)}
            className="inline-flex items-center gap-1 font-medium text-primary hover:text-primary/80 transition-colors"
            aria-label={`Editar ${product.name}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Editar
          </button>
          <button
            onClick={() => onDelete(product.productId)}
            className="inline-flex items-center gap-1 font-medium text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            aria-label={`Eliminar ${product.name}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        </div>
      </td>
    </tr>
  );
};