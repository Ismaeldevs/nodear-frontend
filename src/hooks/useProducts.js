import { useState, useEffect } from 'react';
import { useProductsStore } from '../stores/useProductsStore';

export const useProducts = (filters = {}) => {
  const { products, isLoading, error, pagination, fetchProducts } = useProductsStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      fetchProducts(filters);
      setInitialized(true);
    }
  }, [initialized, fetchProducts]);

  const refetch = () => fetchProducts(filters);

  return {
    products,
    isLoading,
    error,
    pagination,
    refetch,
  };
};

export const useProduct = (productId) => {
  const { selectedProduct, isLoading, error, fetchProductById, clearSelectedProduct } = useProductsStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (productId && !initialized) {
      fetchProductById(productId);
      setInitialized(true);
    }

    return () => {
      if (initialized) {
        clearSelectedProduct();
      }
    };
  }, [productId, initialized, fetchProductById, clearSelectedProduct]);

  const refetch = () => {
    if (productId) {
      return fetchProductById(productId);
    }
  };

  return {
    product: selectedProduct,
    isLoading,
    error,
    refetch,
  };
};

export const useCategories = () => {
  const { categories, fetchCategories } = useProductsStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && categories.length === 0) {
      fetchCategories();
      setInitialized(true);
    }
  }, [initialized, categories.length, fetchCategories]);

  return { categories };
};

export const useSizes = () => {
  const { sizes, fetchSizes } = useProductsStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && sizes.length === 0) {
      fetchSizes();
      setInitialized(true);
    }
  }, [initialized, sizes.length, fetchSizes]);

  return { sizes };
};

export const useColors = () => {
  const { colors, fetchColors } = useProductsStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized && colors.length === 0) {
      fetchColors();
      setInitialized(true);
    }
  }, [initialized, colors.length, fetchColors]);

  return { colors };
};
