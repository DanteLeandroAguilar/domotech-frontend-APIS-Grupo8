import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { Button } from '../components/common/Button';
import { useEffect } from 'react';
import { fetchCatalog } from '../store/slices/productsSlice';
import { ProductCard } from '../components/products/ProductCard';
import { Loading } from '../components/common/Loading';

const Home = () => {
  const dispatch = useDispatch();
  const { products: featuredProducts, loading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchCatalog({ page: 0, size: 6 }));
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative w-full h-[100vh] min-h-[480px] bg-cover bg-center flex items-center justify-center"
          style={{
            backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.7) 100%), url("https://images.unsplash.com/photo-1558002038-1055907df827?w=1920")'
          }}
        >
          <div className="text-center text-white max-w-3xl px-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter leading-tight">
              AUTOMATIZÁ TU HOGAR CON DOMOTECH
            </h1>
            <p className="mt-4 text-base md:text-lg text-gray-200">
              Descubre la última tecnología en domótica para hacer tu vida más fácil y eficiente.
            </p>
            <Link to="/catalog">
              <Button size="lg" className="mt-8">
                Ver Productos
              </Button>
            </Link>
          </div>
        </section>

        {/* Featured Products */}
        <section style={{ backgroundColor: '#9FADBF' }}>
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
              Productos Destacados
            </h2>

            {loading ? (
              <Loading message="Cargando productos..." />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredProducts.map(product => (
                  <ProductCard key={product.productId} product={product} />
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link to="/catalog">
                <Button variant="outline" className="border-[#2A3340]">
                  Ver todos los productos
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;