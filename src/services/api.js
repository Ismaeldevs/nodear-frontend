import api from '../config/axios';

// Servicios de Autenticación
export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async logout() {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  async refresh() {
    const response = await api.post('/auth/refresh');
    return response.data;
  },

  async getProfile() {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async updatePassword(currentPassword, newPassword) {
    const response = await api.patch('/auth/password', {
      currentPassword,
      newPassword,
    });
    return response.data;
  },
};

// Servicios de Productos
export const productService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    const response = await api.get(`/productos?${params.toString()}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/productos/${id}`);
    return response.data;
  },

  async search(query, filters = {}) {
    const params = new URLSearchParams({ busqueda: query });
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/productos?${params.toString()}`);
    return response.data;
  },

  async create(productData) {
    const response = await api.post('/productos', productData);
    return response.data;
  },

  async update(id, productData) {
    const response = await api.put(`/productos/${id}`, productData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/productos/${id}`);
    return response.data;
  },
};

// Servicios de Clientes
export const clientService = {
  async getProfile() {
    const response = await api.get('/clientes/perfil');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.patch('/clientes/perfil', profileData);
    return response.data;
  },

  async getAll(params = {}) {
    const query = new URLSearchParams(params).toString();
    const response = await api.get(`/clientes?${query}`);
    return response.data;
  },
  
  async updateStatus(id, activo) {
      const response = await api.patch(`/clientes/${id}/estado`, { activo });
      return response.data;
  }
};

// Servicios de Categorías
export const categoryService = {
  async getAll() {
    const response = await api.get('/categorias');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/categorias/${id}`);
    return response.data;
  },

  async create(data) {
    const response = await api.post('/categorias', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.patch(`/categorias/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/categorias/${id}`);
    return response.data;
  }
};

// Servicios de Talles
export const sizeService = {
  async getAll() {
    const response = await api.get('/talles');
    return response.data;
  },

  async create(data) {
    const response = await api.post('/talles', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.patch(`/talles/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/talles/${id}`);
    return response.data;
  }
};

// Servicios de Colores
export const colorService = {
  async getAll() {
    const response = await api.get('/colores');
    return response.data;
  },
  
  async create(data) {
    const response = await api.post('/colores', data);
    return response.data;
  },

  async update(id, data) {
    const response = await api.patch(`/colores/${id}`, data);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/colores/${id}`);
    return response.data;
  }
};

// Servicios de Usuarios (Simulado con API clientes por ahora o endpoint futuro)
export const userService = {
    async getAll(params = {}) {
        // Fallback a clientes si no existe endpoint de usuarios dedicado en este momento
        // Lo ideal sería un endpoint /api/users
        const query = new URLSearchParams(params).toString();
        // Intentamos usar clientes endpoint pero mapeandolo a usuarios en el frontend
        const response = await api.get(`/clientes?${query}`); 
        return response.data;
    }
};

// Servicios de Carrito
export const cartService = {
  async get() {
    const response = await api.get('/carrito');
    return response.data;
  },

  async addItem(productoId, varianteId, cantidad) {
    const response = await api.post('/carrito/items', {
      productoId,
      varianteId,
      cantidad,
    });
    return response.data;
  },

  async updateItem(itemId, cantidad) {
    const response = await api.patch(`/carrito/items/${itemId}`, {
      cantidad,
    });
    return response.data;
  },

  async removeItem(itemId) {
    const response = await api.delete(`/carrito/items/${itemId}`);
    return response.data;
  },

  async clear() {
    const response = await api.delete('/carrito');
    return response.data;
  },

  async sync(items) {
    const response = await api.post('/carrito/sincronizar', { items });
    return response.data;
  },
};

// Servicios de Pedidos
export const orderService = {
  async createOrder(orderData) {
    const response = await api.post('/pedidos', orderData);
    return response.data;
  },

  async createGuestOrder(orderData) {
    const response = await api.post('/pedidos/invitado', orderData);
    return response.data;
  },

  async getAll(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    const response = await api.get(`/pedidos?${params.toString()}`);
    return response.data;
  },

  async getMyOrders(page = 1, limit = 10) {
    const response = await api.get(`/pedidos/mis-pedidos?page=${page}&limit=${limit}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;
  },

  async updateStatus(id, estado) {
    const response = await api.patch(`/pedidos/${id}/estado`, { estado });
    return response.data;
  },

  async cancel(id) {
    const response = await api.post(`/pedidos/${id}/cancelar`);
    return response.data;
  },
};

// Servicios de Pagos
export const paymentService = {
  async createPreference(pedidoId) {
    const response = await api.post('/pagos/crear-preferencia', { pedidoId });
    return response.data;
  },

  async createGuestPreference(pedidoId) {
    const response = await api.post('/pagos/crear-preferencia-invitado', { pedidoId });
    return response.data;
  },

  async getPaymentStatus(pedidoId) {
    const response = await api.get(`/pagos/pedido/${pedidoId}`);
    return response.data;
  },
};

// Servicios de Wishlist
export const wishlistService = {
  async get() {
    const response = await api.get('/wishlist');
    return response.data;
  },

  async add(productoId) {
    const response = await api.post('/wishlist', { productoId });
    return response.data;
  },

  async remove(id) {
    const response = await api.delete(`/wishlist/${id}`);
    return response.data;
  },

  async check(productoId) {
    const response = await api.get(`/wishlist/check/${productoId}`);
    return response.data;
  },
};

// Servicios de Cupones
export const cuponService = {
  async getAll(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    const response = await api.get(`/cupones?${params.toString()}`);
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/cupones/${id}`);
    return response.data;
  },

  async create(cuponData) {
    const response = await api.post('/cupones', cuponData);
    return response.data;
  },

  async update(id, cuponData) {
    const response = await api.patch(`/cupones/${id}`, cuponData);
    return response.data;
  },

  async delete(id) {
    const response = await api.delete(`/cupones/${id}`);
    return response.data;
  },

  async validate(codigo, montoCompra) {
    const response = await api.post('/cupones/validar', { codigo, montoCompra });
    return response.data;
  },
};

// Servicios de Cliente - MOVIDO AL INICIO DEL ARCHIVO CON MÁS MÉTODOS
