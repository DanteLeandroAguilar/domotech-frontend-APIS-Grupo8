import { useState, useEffect } from 'react';
import { formatPrice } from '../../utils/formatters';
import { imagesAPI } from '../../api/endpoints/images';
import { cartAPI } from '../../api/endpoints/cart';

export const CartItem = ({ item, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const [imageUrl, setImageUrl] = useState('https://via.placeholder.com/100x100?text=Producto');

  useEffect(() => {
    let createdUrl;
    const loadBlob = async () => {
      let imageId = item.product?.principalImage?.imageId;
      // Si el item del carrito no trae el objeto product, pedimos la imagen principal por productId
      if (!imageId && item.productId) {
        try {
          const principal = await imagesAPI.getPrincipal(item.productId);
          imageId = principal?.imageId;
        } catch (e) {
          imageId = null;
        }
      }
      if (!imageId) {
        setImageUrl('https://via.placeholder.com/100x100?text=Producto');
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const url = imagesAPI.getImageUrl(imageId);
        const response = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const blob = await response.blob();
        createdUrl = URL.createObjectURL(blob);
        setImageUrl(createdUrl);
      } catch (e) {
        // Fallback a URL directa si el blob falla
        setImageUrl(imagesAPI.getImageUrl(imageId));
      }
    };
    loadBlob();
    return () => {
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [item.product?.principalImage?.imageId]);

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

  const subtotal = item.price * item.amount;

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-white dark:bg-background-dark border border-gray-200 dark:border-gray-800">
      {/* Imagen */}
      <img
        src={imageUrl}
        alt={item.productName}
        className="w-20 h-20 object-cover rounded"
      />

      {/* Información del producto */}
      <div className="flex-grow">
        <h3 className="font-bold text-gray-900 dark:text-white">
          {item.productName}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {formatPrice(item.price)}
        </p>
      </div>

      {/* Controles de cantidad */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleDecrease}
          disabled={loading || item.amount <= 1}
          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-lg">remove</span>
        </button>
        <span className="w-8 text-center font-medium">{item.amount}</span>
        <button
          onClick={handleIncrease}
          disabled={loading}
          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800/50 disabled:opacity-50"
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
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </div>
  );
};