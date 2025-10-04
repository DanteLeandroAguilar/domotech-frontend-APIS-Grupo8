import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilters } from '../components/products/ProductFilters';
import { Loading } from '../components/common/Loading';
import { useProducts } from '../hooks/useProducts';

const Catalog = () => {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({});

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setFilters({ search });
    }
  }, [searchParams]);

  const { products, loading, error, pagination, nextPage, prevPage } = useProducts(filters);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Catálogo de Productos
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtros */}
          <aside className="lg:col-span-1">
            <ProductFilters onFilterChange={handleFilterChange} />
          </aside>

          {/* Grid de productos */}
          <div className="lg:col-span-3">
            {loading ? (
              <Loading message="Cargando productos..." />
            ) : error ? (
              <div className="text-center py-12 text-red-500">
                Error: {error}
              </div>
            ) : (
              <>
                <ProductGrid products={products} />

                {/* Paginación */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 gap-4">
                    <button
                      onClick={prevPage}
                      disabled={pagination.page === 0}
                      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Anterior
                    </button>
                    <span className="text-gray-600 dark:text-gray-400">
                      Página {pagination.page + 1} de {pagination.totalPages}
                    </span>
                    <button
                      onClick={nextPage}
                      disabled={pagination.page >= pagination.totalPages - 1}
                      className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 disabled:opacity-50 hover:bg-gray-300 dark:hover:bg-gray-600"
                    >
                      Siguiente
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Catalog;