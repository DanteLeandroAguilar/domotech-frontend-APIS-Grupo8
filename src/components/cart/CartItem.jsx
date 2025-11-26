import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatPrice } from '../../utils/formatters';
import { imagesAPI } from '../../api/endpoints/images';
import { updateProductAmount } from '../../store/slices/cartSlice';
import { fetchPrincipalImage, fetchImageBase64 } from '../../store/slices/imagesSlice';

export const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const { updating } = useSelector((state) => state.cart);
  const { principalImages, base64Images, loadingImages } = useSelector((state) => state.images);

  // Obtener imageId
  let imageId = item.product?.principalImage?.imageId;
  const principalImage = item.productId ? principalImages[item.productId] : null;
  if (!imageId && principalImage) {
    imageId = principalImage.imageId;
  }

  // Cargar imagen principal si no está en el estado
  useEffect(() => {
    if (!imageId && item.productId && !principalImage) {
      dispatch(fetchPrincipalImage(item.productId));
    }
  }, [item.productId, principalImage, dispatch]);

  // Cargar base64 si no está en el estado
  useEffect(() => {
    if (imageId && !base64Images[imageId] && !loadingImages[imageId]) {
      dispatch(fetchImageBase64(imageId));
    }
  }, [imageId, base64Images, loadingImages, dispatch]);

  // Calcular URL de imagen
  const imageUrl = imageId && base64Images[imageId]
    ? `data:image/jpeg;base64,${base64Images[imageId]}`
    : (imageId ? imagesAPI.getImageUrl(imageId) : 'https://via.placeholder.com/100x100?text=Producto');

  const handleIncrease = async () => {
    await dispatch(updateProductAmount({ productId: item.productId, amount: item.amount + 1 }));
  };

  const handleDecrease = async () => {
    if (item.amount > 1) {
      await dispatch(updateProductAmount({ productId: item.productId, amount: item.amount - 1 }));
    }
  };

  const handleRemove = async () => {
    await dispatch(updateProductAmount({ productId: item.productId, amount: 0 }));
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
          disabled={updating || item.amount <= 1}
          className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-lg">remove</span>
        </button>
        <span className="w-8 text-center font-medium">{item.amount}</span>
        <button
          onClick={handleIncrease}
          disabled={updating}
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
        disabled={updating}
        className="text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors disabled:opacity-50"
      >
        <span className="material-symbols-outlined">delete</span>
      </button>
    </div>
  );
};