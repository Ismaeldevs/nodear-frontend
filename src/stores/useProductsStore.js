import { create } from 'zustand';
import { productService, categoryService, sizeService, colorService } from '../services/api';

export const useProductsStore = create((set, get) => ({
  products: [],
  categories: [],
  sizes: [],
  colors: [],
  selectedProduct: null,
  filters: {
    categoriaId: null,
    talleId: null,
    colorId: null,
    precioMin: null,
    precioMax: null,
    busqueda: '',
    ordenarPor: 'createdAt',
    orden: 'DESC',
  },
  isLoading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  },

  // Acciones de productos
  fetchProducts: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { filters, pagination } = get();
      
      // Mapear ordenamiento al formato del backend
      let ordenar = 'recientes';
      if (filters.ordenarPor === 'precioBase') {
        ordenar = filters.orden === 'ASC' ? 'precio_asc' : 'precio_desc';
      } else if (filters.ordenarPor === 'nombre') {
        ordenar = 'nombre';
      }
      
      const queryParams = {
        categoriaId: filters.categoriaId,
        talleId: filters.talleId,
        colorId: filters.colorId,
        precioMin: filters.precioMin,
        precioMax: filters.precioMax,
        busqueda: filters.busqueda,
        ordenar,
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        ...params,
      };

      // Limpiar valores null, undefined y cadenas vacías
      Object.keys(queryParams).forEach((key) => {
        if (queryParams[key] === null || queryParams[key] === undefined || queryParams[key] === '') {
          delete queryParams[key];
        }
      });

      const response = await productService.getAll(queryParams);
      
      set({
        products: response.data.productos || [],
        pagination: {
          page: response.data.paginacion?.pagina || 1,
          limit: response.data.paginacion?.limite || 12,
          total: response.data.paginacion?.total || 0,
          totalPages: response.data.paginacion?.totalPaginas || 0,
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al cargar productos',
        isLoading: false,
        products: [], // Limpiar productos en caso de error
      });
    }
  },

  fetchProductById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await productService.getById(id);
      set({
        selectedProduct: response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Error al cargar producto',
        isLoading: false,
      });
      return null;
    }
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      pagination: { ...state.pagination, page: 1 }, // Reset a página 1 al filtrar
    }));
    get().fetchProducts();
  },

  clearFilters: () => {
    set({
      filters: {
        categoriaId: null,
        talleId: null,
        colorId: null,
        precioMin: null,
        precioMax: null,
        busqueda: '',
        ordenarPor: 'createdAt',
        orden: 'DESC',
      },
      pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
    });
    get().fetchProducts();
  },

  setPage: (page) => {
    set((state) => ({
      pagination: { ...state.pagination, page },
    }));
    get().fetchProducts({ page });
  },

  // Acciones de categorías
  fetchCategories: async () => {
    try {
      const response = await categoryService.getAll();
      set({ categories: response.data });
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  },

  // Acciones de talles
  fetchSizes: async () => {
    try {
      const response = await sizeService.getAll();
      set({ sizes: response.data });
    } catch (error) {
      console.error('Error fetching sizes:', error);
    }
  },

  // Acciones de colores
  fetchColors: async () => {
    try {
      const response = await colorService.getAll();
      set({ colors: response.data });
    } catch (error) {
      console.error('Error fetching colors:', error);
    }
  },

  // Inicializar catálogo
  initializeCatalog: async () => {
    await Promise.all([
      get().fetchCategories(),
      get().fetchSizes(),
      get().fetchColors(),
      get().fetchProducts(),
    ]);
  },

  // Limpiar producto seleccionado
  clearSelectedProduct: () => set({ selectedProduct: null }),
}));
