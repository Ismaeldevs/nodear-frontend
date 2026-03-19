/**
 * Comisiones de Mercado Pago - Checkout Pro
 * Fuente: Simulador de Costos MP (verificado Feb 2026, acreditación inmediata)
 *
 * Estructura de costos:
 *   - Tasa base:  6.29% sobre el monto (aplica a todos los cobros)
 *   - Cuotas s/i: costo adicional absorbido por el vendedor (sin costo para el comprador)
 *   - IVA:        21% sobre el total de comisiones
 *
 * Resultados verificados del simulador ($50.000):
 *   Contado      → comisión $3.805  (7,61% efectivo)
 *   3 cuotas s/i → comisión $11.665 (23,33% efectivo)
 */

const IVA = 0.21;
const TASA_BASE = 0.0629; // 6,29% — aplica a todos los medios de pago

// Costo adicional POR OFRECER cuotas sin interés (se suma a la tasa base)
const COSTO_CUOTAS = {
  1: 0,       // contado: sin costo extra
  2: 0.0799,  // orientativo — verificar en panel MP
  3: 0.1299,  // 12,99% — verificado en simulador Feb 2026
};

/**
 * Calcula la comisión de Mercado Pago y el neto que recibe el vendedor.
 *
 * @param {number} monto       - Precio de venta bruto
 * @param {number} cuotas      - Cantidad de cuotas (1, 2 o 3)
 * @returns {{ bruto, comisionSinIVA, ivaComision, comisionTotal, neto, tasaEfectiva }}
 */
export function calcularComisionMP(monto, cuotas = 1) {
  const costoCuotas = COSTO_CUOTAS[cuotas] ?? 0;
  const tasaSinIVA = TASA_BASE + costoCuotas;
  const iva = tasaSinIVA * IVA;
  const tasaEfectiva = tasaSinIVA + iva; // e.g. 23,33% para 3 cuotas

  const comisionSinIVA = monto * tasaSinIVA;
  const ivaComision = monto * iva;
  const comisionTotal = monto * tasaEfectiva;
  const neto = monto - comisionTotal;

  return {
    bruto: monto,
    comisionSinIVA,
    ivaComision,
    comisionTotal,
    neto,
    tasaEfectiva,
    cuotas,
  };
}

/**
 * Dado un monto de ventas totales, calcula el rango de neto estimado
 * (best case = todo contado, worst case = todo 3 cuotas).
 *
 * @param {number} totalVentas
 * @returns {{ optimista, pesimista }}
 */
export function calcularRangoNetoMensual(totalVentas) {
  const optimista = calcularComisionMP(totalVentas, 1);
  const pesimista = calcularComisionMP(totalVentas, 3);
  return { optimista, pesimista };
}

export const MP_TASAS = {
  contado: (TASA_BASE * (1 + IVA) * 100).toFixed(2),        // 7.61%
  tresCuotas: ((TASA_BASE + COSTO_CUOTAS[3]) * (1 + IVA) * 100).toFixed(2), // 23.33%
};

// Descuento visible para transferencia/efectivo (configurable)
export const DESCUENTO_TRANSFERENCIA = 0.20; // 20%

/**
 * Devuelve el precio de transferencia (descuento sobre el precio exhibido).
 * @param {number} precio         - Precio exhibido (ya lleva el margen de cuotas)
 * @param {number} descuento      - Proporción de descuento (default 0.20 = 20%)
 */
export function calcularPrecioTransferencia(precio, descuento = DESCUENTO_TRANSFERENCIA) {
  return precio * (1 - descuento);
}

/**
 * Formatea un monto como moneda ARS sin decimales y con separadores de miles.
 * Ejemplo: 50000 → "$50.000"
 * @param {number} monto
 */
export function formatARS(monto) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(monto);
}
