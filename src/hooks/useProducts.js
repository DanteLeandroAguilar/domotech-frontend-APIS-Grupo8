import { useState, useEffect } from 'react';
import { productsAPI } from '../api/endpoints/products';

export const useProducts = (filters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalPages: 0,
    totalElements: 0,
  });

  useEffect(() => {
    loadProducts();
  }, [filters, pagination.page]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let data;
      
      if (filters.search) {
        data = await productsAPI.search(filters.search, pagination.page, pagination.size);
      } else if (Object.keys(filters).length > 0) {
        data = await productsAPI.filter(filters, pagination.page, pagination.size);
      } else {
        data = await productsAPI.getCatalog(pagination.page, pagination.size);
      }

      setProducts(data.content || []);
      setPagination(prev => ({
        ...prev,
        totalPages: data.totalPages || 0,
        totalElements: data.totalElements || 0,
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    if (pagination.page < pagination.totalPages - 1) {
      setPagination(prev => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.page > 0) {
      setPagination(prev => ({ ...prev, page: prev.page - 1 }));
    }
  };

  const goToPage = (page) => {
    if (page >= 0 && page < pagination.totalPages) {
      setPagination(prev => ({ ...prev, page }));
    }
  };

  return {
    products,
    loading,
    error,
    pagination,
    nextPage,
    prevPage,
    goToPage,
    reload: loadProducts,
  };
};