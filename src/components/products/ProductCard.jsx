import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { formatPrice, calculateDiscountPercentage, calculateDiscountedPrice } from '../../utils/formatters';
import { cartAPI } from '../../api/endpoints/cart';
import { 
  selectImagesByProduct, 
  selectImagesLoading 
} from '../../store/slices/productImageSlice';
import { 
  selectIsAuthenticated, 
  selectUserRole 
} from '../../store/slices/userSlice';

export const ProductCard = ({ product, updateCartCount }) => {
  const [loading, setLoading] = useState(false);
  
  // Estado de Redux
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const images = useSelector(state => selectImagesByProduct(state, product.productId));
  const imagesLoading = useSelector(selectImagesLoading);
  
  const isSeller = userRole === 'SELLER';

  // Obtener la imagen principal desde Redux o usar placeholder
  const principalImage = images.find(img => img.isMain) || images[0];
  const imageUrl = principalImage?.url || 'https://via.placeholder.com/300x300?text=Sin+Imagen';

  // Debug temporal - Verificar qué imágenes tiene cada producto
  useEffect(() => {
    console.log(`🖼️ Product ${product.productId} [${product.name}]:`, {
      imagesCount: images.length,
      principalImage,
      imageUrl,
      allImages: images
    });
  }, [images, product.productId, product.name, principalImage, imageUrl]);

  const discountPercentage = calculateDiscountPercentage(product.price, product.discount);
  const finalPrice = calculateDiscountedPrice(product.price, product.discount);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || isSeller) return;

    setLoading(true);
    try {
      // Obtener cantidad actual en carrito para este producto y sumar 1
      const cart = await cartAPI.getMyCart();
      const existingItem = cart?.items?.find((it) => it.productId === product.productId);
      const currentAmount = existingItem ? Number(existingItem.amount || 0) : 0;
      const newAmount = currentAmount + 1;

      await cartAPI.updateProductAmount(product.productId, newAmount);
      if (updateCartCount) {
        updateCartCount();
      }
      console.log('✅ Producto agregado al carrito');
    } catch (error) {
      console.error('❌ Error al agregar al carrito:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link 
      to={`/product/${product.productId}`}
      className="product-card bg-white dark:bg-gray-800 rounded-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
    >
      <div className="relative">
        <div className="w-full h-56 bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
          {imagesLoading && !principalImage ? (
            // Skeleton loader mientras carga
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-600 animate-pulse" />
          ) : (
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
              onError={(e) => {
                console.error(`❌ Error al cargar imagen para producto ${product.productId}:`, imageUrl);
                e.target.src = 'https://via.placeholder.com/300x300?text=Error+al+Cargar';
              }}
            />
          )}
        </div>
        
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

          {isAuthenticated && !isSeller && product.active && product.available && (
            <button
              onClick={handleAddToCart}
              disabled={loading || !product.available}
              className="text-sm bg-primary text-white px-3 py-1 rounded hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Agregando...' : 'Agregar'}
            </button>
          )}
        </div>
      </div>
    </Link>
  );
};