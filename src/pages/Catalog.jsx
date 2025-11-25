import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { ProductGrid } from '../components/products/ProductGrid';
import { ProductFilters } from '../components/products/ProductFilters';
import { Loading } from '../components/common/Loading';
import { fetchProducts, setFilters, resetPage, setPage } from '../store/slices/productsSlice';

const Catalog = () => {
  const dispatch = useDispatch();
  const { products, loading, error, pagination, filters } = useSelector((state) => state.products);
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search');

  useEffect(() => {
    if (searchTerm) {
      // Si hay término de búsqueda, aplicarlo como filtro
      dispatch(setFilters({ searchTerm }));
    } else {
      // Si no hay búsqueda, limpiar filtros
      dispatch(setFilters({}));
    }
  }, [searchTerm, dispatch]);

  useEffect(() => {
    dispatch(fetchProducts({
      ...filters,
      page: pagination.page,
      size: pagination.size,
    }));
  }, [dispatch, filters, pagination.page, pagination.size]);

  const handleFilterChange = (newFilters) => {
    // Limpiar el parámetro de búsqueda de la URL cuando se usan filtros
    setSearchParams({});
    dispatch(setFilters(newFilters));
    // Resetear a la primera página cuando cambian los filtros
    dispatch(resetPage());
  };

  const handleClearSearch = () => {
    // Limpiar búsqueda y volver a mostrar todos los productos
    setSearchParams({});
    dispatch(setFilters({}));
    dispatch(resetPage());
  };

  const nextPage = () => {
    if (pagination.page < pagination.totalPages - 1) {
      dispatch(setPage(pagination.page + 1));
    }
  };

  const prevPage = () => {
    if (pagination.page > 0) {
      dispatch(setPage(pagination.page - 1));
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br ">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {searchTerm ? `Resultados para "${searchTerm}"` : 'Catálogo de Productos'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {pagination.totalElements} producto{pagination.totalElements !== 1 ? 's' : ''} encontrado{pagination.totalElements !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Mostrar mensaje y botón para limpiar búsqueda */}
        {searchTerm && (
          <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-blue-800 dark:text-blue-400 font-medium">
                Mostrando resultados de búsqueda
              </span>
            </div>
            <button
              onClick={handleClearSearch}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Limpiar búsqueda
            </button>
          </div>
        )}

        <div className={`grid grid-cols-1 ${searchTerm ? '' : 'lg:grid-cols-4'} gap-8`}>
          {/* Filtros - Solo mostrar si NO hay búsqueda */}
          {!searchTerm && (
            <aside className="lg:col-span-1">
              <ProductFilters onFilterChange={handleFilterChange} />
            </aside>
          )}

          {/* Grid de productos */}
          <div className={searchTerm ? 'col-span-1' : 'lg:col-span-3'}>
            {loading ? (
              <Loading message="Cargando productos..." />
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6 text-center">
                <svg className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p className="text-red-600 dark:text-red-400 font-semibold">Error: {error}</p>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center">
                <svg className="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {searchTerm 
                    ? `No hay productos que coincidan con "${searchTerm}"`
                    : 'Intenta ajustar los filtros o buscar algo diferente'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="mt-4 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all"
                  >
                    Ver todos los productos
                  </button>
                )}
              </div>
            ) : (
              <>
                <ProductGrid products={products} />

                {/* Paginación mejorada */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center mt-8 gap-3">
                    <button
                      onClick={prevPage}
                      disabled={pagination.page === 0}
                      className="px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 flex items-center gap-2 shadow-md"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                      </svg>
                      Anterior
                    </button>
                    <div className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold shadow-lg">
                      {pagination.page + 1} / {pagination.totalPages}
                    </div>
                    <button
                      onClick={nextPage}
                      disabled={pagination.page >= pagination.totalPages - 1}
                      className="px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 flex items-center gap-2 shadow-md"
                    >
                      Siguiente
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
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