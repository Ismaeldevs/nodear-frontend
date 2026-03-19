// Configuración de variables de entorno
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'nodear-backend-production.up.railway.app:2998/api',
  tokenKey: 'nodear_token',
  userKey: 'nodear_user',
};
