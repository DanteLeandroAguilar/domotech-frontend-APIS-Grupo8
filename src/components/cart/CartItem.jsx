import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatPrice } from '../../utils/formatters';
import { imagesAPI } from '../../api/endpoints/images';
import { updateProductAmount } from '../../store/slices/cartSlice';

export const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const { updating } = useSelector((state) => state.cart);

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
        // Fallback a URL directa si falla
        setImageUrl(imagesAPI.getImageUrl(imageId));
      }
    };
    loadImage();
  }, [item.product?.principalImage?.imageId, item.productId]);

  const room = item.room || 'general';

  const handleIncrease = async () => {
    await dispatch(updateProductAmount({ productId: item.productId, amount: item.amount + 1, room }));
  };

  const handleDecrease = async () => {
    if (item.amount > 1) {
      await dispatch(updateProductAmount({ productId: item.productId, amount: item.amount - 1, room }));
    }
  };

  const handleRemove = async () => {
    await dispatch(updateProductAmount({ productId: item.productId, amount: 0, room }));
  };

  // Usar los valores que vienen del backend
  const discount = item.discount || 0;
  const unitFinalPrice = item.price * (1 - discount / 100);
  const subtotal = item.finalPrice || (unitFinalPrice * item.amount);

  return (
    <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors">
      {/* Imagen */}
      <div className="flex-shrink-0">
        <img
          src={imageUrl}
          alt={item.productName}
          className="w-20 h-20 object-cover rounded-lg shadow-md"
        />
      </div>

      {/* Información del producto */}
      <div className="flex-grow min-w-0">
        <h3 className="font-bold text-gray-900 dark:text-white mb-1 truncate">
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
              <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                {discount}% OFF
              </span>
            </>
          ) : (
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {formatPrice(item.price)}
            </p>
          )}
          <span className="text-xs text-gray-500 dark:text-gray-400">
            c/u
          </span>
        </div>
      </div>

      {/* Controles de cantidad */}
      <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 px-2 py-1">
        <button
          onClick={handleDecrease}
          disabled={updating || item.amount <= 1}
          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Disminuir cantidad"
        >
          <span className="material-symbols-outlined text-lg">remove</span>
        </button>
        <span className="w-8 text-center font-semibold text-gray-900 dark:text-white">{item.amount}</span>
        <button
          onClick={handleIncrease}
          disabled={updating}
          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
          aria-label="Aumentar cantidad"
        >
          <span className="material-symbols-outlined text-lg">add</span>
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right min-w-[100px]">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Subtotal</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          {formatPrice(subtotal)}
        </p>
      </div>

      {/* Botón eliminar */}
      <button
        onClick={handleRemove}
        disabled={updating}
        className="flex-shrink-0 p-2 rounded-lg text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
        aria-label="Eliminar producto"
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </div>
  );
};