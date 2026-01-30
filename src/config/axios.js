import axios from 'axios';
import { config } from './config';

// Crear instancia de axios
const api = axios.create({
  baseURL: config.apiUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // IMPORTANTE: Enviar cookies automáticamente
});

// Interceptor para refresh token automático
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Si recibimos 401 y no hemos intentado refrescar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Intentar refrescar el token
        await axios.post(`${config.apiUrl}/auth/refresh`, {}, {
          withCredentials: true,
        });

        // Si el refresh fue exitoso, reintentar la petición original
        return api(originalRequest);
      } catch (refreshError) {
        // Si el refresh falla, cerrar sesión
        const currentPath = window.location.pathname;
        
        // Solo redirigir si estamos en rutas protegidas
        if (!currentPath.includes('/login') && !currentPath.includes('/register')) {
          if (currentPath.startsWith('/admin') || currentPath.includes('/checkout') || currentPath.includes('/perfil')) {
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
