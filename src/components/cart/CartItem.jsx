import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatPrice } from '../../utils/formatters';
import { imagesAPI } from '../../api/endpoints/images';
import { updateCartItemAmount, selectCartItemsLoading } from '../../redux/cartItemsSlice';

export const CartItem = ({ item, onUpdate }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectCartItemsLoading);

  const [imageUrl, setImageUrl] = useState('https://via.placeholder.com/100x100?text=Producto');

  useEffect(() => {
    const loadImage = async () => {
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
        const base64 = await imagesAPI.getImageBase64(imageId);
        setImageUrl(`data:image/jpeg;base64,${base64}`);
      } catch (e) {
        // Fallback a placeholder si falla
        setImageUrl('https://via.placeholder.com/100x100?text=Producto');
      }
    };
    loadImage();
  }, [item.product?.principalImage?.imageId, item.productId]);

  const handleIncrease = async () => {
    await dispatch(updateCartItemAmount({ 
      productId: item.productId, 
      amount: item.amount + 1 
    })).unwrap();
    if (onUpdate) onUpdate();
  };

  const handleDecrease = async () => {
    if (item.amount > 1) {
      await dispatch(updateCartItemAmount({ 
        productId: item.productId, 
        amount: item.amount - 1 
      })).unwrap();
      if (onUpdate) onUpdate();
    }
  };

  const handleRemove = async () => {
    await dispatch(updateCartItemAmount({ 
      productId: item.productId, 
      amount: 0 
    })).unwrap();
    if (onUpdate) onUpdate();
  };

  // Usar los valores que vienen del backend
  const discount = item.discount || 0;
  const unitFinalPrice = item.price * (1 - discount / 100);
  const subtotal = item.finalPrice || (unitFinalPrice * item.amount);

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
        <div className="flex items-center gap-2">
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