// Configuración de variables de entorno
export const config = {
  apiUrl: import.meta.env.VITE_API_URL || 'nodear-backend-production.up.railway.app:2998/api',
  mercadoPagoPublicKey: import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || 'APP_USR-da978436-2866-4ccd-a04e-6c1beec9d3ac',
  tokenKey: 'nodear_token',
  userKey: 'nodear_user',
};
