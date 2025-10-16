import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ProductGallery } from '../components/products/ProductGallery';
import { Button } from '../components/common/Button';
import { Loading } from '../components/common/Loading';
import { productsAPI } from '../api/endpoints/products';
import { imagesAPI } from '../api/endpoints/images';
import { cartAPI } from '../api/endpoints/cart';
import { formatPrice, calculateDiscountPercentage } from '../utils/formatters';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    loadAuthData();
    loadProduct();
    loadImages();
  }, [id]);

  const loadAuthData = () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  };

  const isSeller = () => {
    return user?.role === 'SELLER';
  };

  const loadProduct = async () => {
    try {
      const data = await productsAPI.getById(id);
      setProduct(data);
    } catch (error) {
      console.error('Error al cargar producto:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadImages = async () => {
    try {
      const data = await imagesAPI.getByProduct(id);
      setImages(data);
    } catch (error) {
      console.error('Error al cargar imágenes:', error);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await cartAPI.updateProductAmount(product.productId, quantity);
      alert('Producto agregado al carrito');
    } catch (error) {
      alert(error.message || 'Error al agregar al carrito');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Loading message="Cargando producto..." />
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Producto no encontrado
          </h2>
        </main>
        <Footer />
      </div>
    );
  }

  const discountPercentage = calculateDiscountPercentage(product.price, product.discount);
  const finalPrice = product.price - product.discount;

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          <div>
            <ProductGallery images={images} />
          </div>

          
          <div>
            <div className="flex items-center text-sm mb-4">
              <span className="text-gray-500 dark:text-gray-400">
                {product.category?.name || 'Sin categoría'}
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {product.name}
            </h1>

            {product.brand && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Marca: {product.brand}
              </p>
            )}

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(finalPrice)}
              </span>
              {discountPercentage > 0 && (
                <>
                  <span className="text-xl font-medium text-gray-600 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-sm font-bold bg-green-500/30 px-2 py-1 rounded-full" style={{color:'#00FF7F'}}>
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 mb-6">
              {product.stock > 0 ? (
                <>
                  <span className="material-symbols-outlined" style={{color:'#03A63C'}}>check_circle</span>
                  <p className="font-semibold" style={{color:'#03A63C'}}>
                    En Stock ({product.stock} disponibles)
                  </p>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-red-500">cancel</span>
                  <p className="text-red-500 font-semibold">Sin Stock</p>
                </>
              )}
            </div>

            <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
              {product.description}
            </p>

            {isAuthenticated && !isSeller() && product.stock > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Cantidad</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-10 h-10 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {isAuthenticated && !isSeller() && product.stock > 0 && (
              <Button
                fullWidth
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="flex items-center justify-center gap-3"
              >
                <span className="material-symbols-outlined">add_shopping_cart</span>
                {addingToCart ? 'Agregando...' : 'Añadir al Carrito'}
              </Button>
            )}

            {/* Especificaciones técnicas */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Especificaciones Técnicas
              </h2>
              <div className="space-y-4 text-sm">
                {product.conectionType && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Tipo de Conexión</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {product.conectionType}
                    </span>
                  </div>
                )}
                {product.compatibility && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Compatibilidad</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {product.compatibility}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetail;