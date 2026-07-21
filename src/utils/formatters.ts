/**
 * Utilidades de formateo comunes para MarketPro GT
 * 
 * Este módulo contiene funciones de formateo que se usan en múltiples componentes
 * para evitar duplicación de código y mantener consistencia en toda la aplicación.
 * 
 * @fileoverview Utilidades de formateo centralizadas
 * @version 2.4.0
 * @since 2025-01-27
 */

/**
 * Formatea números grandes con sufijos K, M
 * @param num - Número a formatear
 * @returns String formateado (ej: "1.2K", "5.3M")
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`
  }
  return num.toString()
}

/**
 * Obtiene una fecha N días atrás desde hoy
 * @param days - Número de días hacia atrás
 * @returns String de fecha en formato YYYY-MM-DD
 */
export function getDateDaysAgo(days: number): string {
  const date = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
  return date.toISOString().split('T')[0]
}

/**
 * Formatea duración en segundos a formato legible
 * @param seconds - Duración en segundos
 * @returns String formateado (ej: "2h 30m", "45m 30s")
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`
  } else {
    return `${remainingSeconds}s`
  }
}


/**
 * Formatea porcentaje con un decimal
 * @param value - Valor entre 0 y 1
 * @returns String formateado (ej: "85.5%")
 */
export function formatPercentage(value: number): string {
  return `${(value * 100).toFixed(1)}%`
}

/**
 * Formatea moneda en formato estándar
 * @param amount - Cantidad monetaria
 * @param currency - Código de moneda (default: 'USD')
 * @returns String formateado (ej: "$1,234.56")
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}
