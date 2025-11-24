import { useState } from 'react';
import { useSelector } from 'react-redux';
import { formatPrice } from '../../utils/formatters';
import { cartAPI } from '../../api/endpoints/cart';
import { selectImagesByProduct } from '../../store/slices/productImageSlice';

export const CartItem = ({ item, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  // Obtener imágenes desde Redux
  const images = useSelector(state => selectImagesByProduct(state, item.productId));
  const principalImage = images.find(img => img.isMain) || images[0];
  const imageUrl = principalImage?.url || 'https://via.placeholder.com/100x100?text=Producto';

  const handleIncrease = async () => {
    setLoading(true);
    try {
      await cartAPI.updateProductAmount(item.productId, item.amount + 1);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error al actualizar cantidad:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecrease = async () => {
    if (item.amount > 1) {
      setLoading(true);
      try {
        await cartAPI.updateProductAmount(item.productId, item.amount - 1);
        if (onUpdate) onUpdate();
      } catch (error) {
        console.error('Error al actualizar cantidad:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await cartAPI.updateProductAmount(item.productId, 0);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    } finally {
      setLoading(false);
    }
  };

  // Usar los valores que vienen del backend
  const discount = item.discount || 0;
  const unitFinalPrice = item.price * (1 - discount / 100);
  const subtotal = item.finalPrice || (unitFinalPrice * item.amount);

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800">
      {/* Imagen */}
      <div className="w-20 h-20 flex-shrink-0">
        <img
          src={imageUrl}
          alt={item.productName}
          className="w-full h-full object-cover rounded"
          loading="lazy"
        />
      </div>

      {/* Información del producto */}
      <div className="flex-grow min-w-0">
        <h3 className="font-bold text-gray-900 dark:text-white truncate">
          {item.productName}
        </h3>
        <div className="flex items-center gap-2 flex-wrap">
          {discount > 0 ? (
            <>
              <p className="text-sm text-gray-400 dark:text-gray-500 line-through">
                {formatPrice(item.price)}
              </p>
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                {formatPrice(unitFinalPrice)}
              </p>
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">
                {discount}% OFF
              </span>
            </>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatPrice(item.price)}
            </p>
          )}
        </div>
      </div>

      {/* Controles de cantidad */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleDecrease}
          disabled={loading || item.amount <= 1}
          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Disminuir cantidad"
        >
          <span className="material-symbols-outlined text-lg">remove</span>
        </button>
        <span className="w-8 text-center font-medium">{item.amount}</span>
        <button
          onClick={handleIncrease}
          disabled={loading}
          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800/50 disabled:opacity-50 transition-colors"
          aria-label="Aumentar cantidad"
        >
          <span className="material-symbols-outlined text-lg">add</span>
        </button>
      </div>

      {/* Subtotal */}
      <p className="w-24 text-right font-semibold text-gray-900 dark:text-white">
        {formatPrice(subtotal)}
      </p>

      {/* Botón eliminar */}
      <button
        onClick={handleRemove}
        disabled={loading}
        className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50"
        aria-label="Eliminar producto"
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </div>
  );
};