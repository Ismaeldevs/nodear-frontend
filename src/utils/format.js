/**
 * Formatea un número como moneda en pesos argentinos
 * @param {number} amount - El monto a formatear
 * @returns {string} - El monto formateado con signo de peso
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '$0.00';
  
  const number = parseFloat(amount);
  if (isNaN(number)) return '$0.00';
  
  return `$${number.toFixed(2)}`;
}

/**
 * Formatea un número con separadores de miles
 * @param {number} num - El número a formatear
 * @returns {string} - El número formateado
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0';
  
  const number = parseFloat(num);
  if (isNaN(number)) return '0';
  
  return number.toLocaleString('es-AR');
}

/**
 * Formatea una fecha en formato DD/MM/YYYY
 * @param {string|Date} date - La fecha a formatear
 * @returns {string} - La fecha formateada
 */
export function formatDate(date) {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Formatea una fecha con hora en formato DD/MM/YYYY HH:MM
 * @param {string|Date} date - La fecha a formatear
 * @returns {string} - La fecha formateada con hora
 */
export function formatDateTime(date) {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
