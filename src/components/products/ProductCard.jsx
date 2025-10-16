import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { formatPrice, calculateDiscountPercentage } from '../../utils/formatters';
import { imagesAPI } from '../../api/endpoints/images';
import { cartAPI } from '../../api/endpoints/cart';

export const ProductCard = ({ product }) => {
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const isSeller = () => {
    // TODO: Obtener el rol del usuario desde el token JWT decodificado
    return false;
  };

  const imageUrl = product.principalImage 
    ? imagesAPI.getImageUrl(product.principalImage.imageId)
    : 'https://via.placeholder.com/300x300?text=Sin+Imagen';

  const discountPercentage = calculateDiscountPercentage(product.price, product.discount);
  const finalPrice = product.price - product.discount;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || isSeller()) return;

    setLoading(true);
    try {
      await cartAPI.updateProductAmount(product.productId, 1);
      console.log('Producto agregado al carrito');
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
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
        <div 
          className="w-full h-56 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        {discountPercentage > 0 && (
          <div className="absolute top-2 right-2 bg-primary/20 text-primary font-bold text-xs px-2 py-1 rounded-full">
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
            Stock: {product.stock}
          </span>
          
          {isAuthenticated && !isSeller() && product.active && (
            <button
              onClick={handleAddToCart}
              disabled={loading || product.stock === 0}
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