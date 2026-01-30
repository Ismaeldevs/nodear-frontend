// Configuración de variables de entorno
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const config = {
  apiUrl: API_URL,
  tokenKey: 'nodear_token',
  userKey: 'nodear_user',
};
