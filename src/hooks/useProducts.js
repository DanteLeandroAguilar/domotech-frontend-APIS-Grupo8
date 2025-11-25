import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setPage, resetPage } from '../store/slices/productsSlice';

export const useProducts = (filters = {}) => {
  const dispatch = useDispatch();
  const { products, loading, error, pagination } = useSelector((state) => state.products);

  const loadProducts = useCallback(() => {
    dispatch(fetchProducts({
      ...filters,
      page: pagination.page,
      size: pagination.size,
    }));
  }, [dispatch, filters, pagination.page, pagination.size]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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

  const goToPage = (page) => {
    if (page >= 0 && page < pagination.totalPages) {
      dispatch(setPage(page));
    }
  };

  const handleResetPage = () => {
    dispatch(resetPage());
  };

  return {
    products,
    loading,
    error,
    pagination,
    nextPage,
    prevPage,
    goToPage,
    resetPage: handleResetPage,
    reload: loadProducts,
  };
};