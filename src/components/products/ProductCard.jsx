import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatPrice, calculateDiscountPercentage, calculateDiscountedPrice } from '../../utils/formatters';
import { imagesAPI } from '../../api/endpoints/images';
import { isSeller as authIsSeller } from '../../utils/auth';
import { updateProductAmount, fetchCart } from '../../store/slices/cartSlice';
import { getTokenFromStore } from '../../store';

export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { cart, updating } = useSelector((state) => state.cart);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Cargar carrito si está autenticado y no hay carrito
    if (isAuthenticated && !cart) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, cart, dispatch]);

  const { isAuthenticated: authIsAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsAuthenticated(authIsAuthenticated);
  }, [authIsAuthenticated]);

  const isSeller = () => authIsSeller();

  const [imageUrl, setImageUrl] = useState(
    product.principalImage 
      ? imagesAPI.getImageUrl(product.principalImage.imageId)
      : 'https://via.placeholder.com/300x300?text=Sin+Imagen'
  );

  // Si las imágenes requieren auth y vienen como blob, creamos un Object URL
  useEffect(() => {
    let createdUrl;
    const loadBlob = async () => {
      if (!product?.principalImage?.imageId) return;
      try {
        const token = getTokenFromStore();
        const url = imagesAPI.getImageUrl(product.principalImage.imageId);
        const response = await fetch(url, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const blob = await response.blob();
        createdUrl = URL.createObjectURL(blob);
        setImageUrl(createdUrl);
      } catch (e) {
        // fallback se mantiene a la URL directa
      }
    };
    loadBlob();
    return () => {
      if (createdUrl) URL.revokeObjectURL(createdUrl);
    };
  }, [product?.principalImage?.imageId]);

  const discountPercentage = calculateDiscountPercentage(product.price, product.discount);
  const finalPrice = calculateDiscountedPrice(product.price, product.discount);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || isSeller()) return;

    // Obtener cantidad actual en carrito para este producto y sumar 1
    const existingItem = cart?.items?.find((it) => it.productId === product.productId);
    const currentAmount = existingItem ? Number(existingItem.amount || 0) : 0;
    const newAmount = currentAmount + 1;

    await dispatch(updateProductAmount({ productId: product.productId, amount: newAmount }));
  };

  return (
    <Link 
      to={`/product/${product.productId}`}
      className="product-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <div 
          className="w-full h-56 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-green-500/30 text-xs px-2 py-1 rounded-full font-bold" style={{color:'#00FF7F'}}>
            {discountPercentage}% OFF
          </div>
        )}
        {!product.active && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold">No Disponible</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-1 truncate">
          {product.name}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-baseline gap-2 mb-3">
          <p className="text-primary font-bold text-xl">
            {formatPrice(finalPrice)}
          </p>
          {discountPercentage > 0 && (
            <p className="text-gray-500 dark:text-gray-400 text-sm line-through">
              {formatPrice(product.price)}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {product.available ? '' : 'Sin Stock'}
          </span>

          {isAuthenticated && !isSeller() && product.active && product.available && (
            <button
              onClick={handleAddToCart}
              disabled={updating || !product.available}
              className="text-sm bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updating ? 'Agregando...' : 'Agregar'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};