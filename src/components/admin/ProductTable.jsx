import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatPrice } from '../../utils/formatters';
import { imagesAPI } from '../../api/endpoints/images';
import { fetchImageBase64 } from '../../store/slices/imagesSlice';

export const ProductTable = ({ products, onEdit, onDelete }) => {
  const dispatch = useDispatch();
  const { base64Images } = useSelector((state) => state.images);

  const { loadingImages } = useSelector((state) => state.images);

  // Cargar imágenes en base64 para todos los productos
  useEffect(() => {
    if (!products || products.length === 0) return;

    products.forEach((product) => {
      const mainImage = product.principalImage || product.images?.[0];
      const imageId = mainImage?.imageId;
      // Solo cargar si no está en el estado y no está cargando
      if (imageId && !base64Images[imageId] && !loadingImages[imageId]) {
        dispatch(fetchImageBase64(imageId));
      }
    });
  }, [products, base64Images, loadingImages, dispatch]);

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
            // Usar principalImage directamente del producto, o la primera imagen como fallback
            const mainImage = product.principalImage || product.images?.[0];
            
            return (
              <tr
                key={product.productId}
                className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <td className="px-6 py-4">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {mainImage ? (
                      <img
                        src={base64Images[mainImage.imageId] ? `data:image/jpeg;base64,${base64Images[mainImage.imageId]}` : imagesAPI.getImageUrl(mainImage.imageId)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                </td>
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
            );
          })}
        </tbody>
      </table>
    </div>
  );
};