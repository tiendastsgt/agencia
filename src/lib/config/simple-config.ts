/**
 * Configuración Simple de Variables de Entorno
 * Sin uso de import.meta para evitar errores de compilación
 */

// Función simple para obtener variables de entorno
export function getSimpleEnvVar(key: string, defaultValue: string = ''): string {
  // En el navegador, las variables de entorno de Vite están en import.meta.env
  if (typeof window !== 'undefined' && typeof import.meta !== 'undefined' && import.meta.env) {
    const value = import.meta.env[key]
    if (value && value !== '' && value !== 'your_api_key_here' && value !== 'your_gemini_api_key_here') {
      return value
    }
  }
  
  return defaultValue
}

// Configuración de AI services
export const AI_CONFIG = {
  gemini: {
    provider: 'gemini' as const,
    apiKey: getSimpleEnvVar('VITE_GEMINI_API_KEY', ''),
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },
  dalle3: {
    provider: 'dalle3' as const,
    apiKey: getSimpleEnvVar('VITE_OPENAI_API_KEY', ''),
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },
  stability: {
    provider: 'stability' as const,
    apiKey: getSimpleEnvVar('VITE_STABILITY_API_KEY', ''),
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  },
  midjourney: {
    provider: 'midjourney' as const,
    apiKey: getSimpleEnvVar('VITE_MIDJOURNEY_API_KEY', ''),
    timeout: 60000,
    retryAttempts: 2,
    retryDelay: 2000
  },
  imagen: {
    provider: 'imagen' as const,
    apiKey: getSimpleEnvVar('VITE_GEMINI_API_KEY', ''), // Usa la misma API key que Gemini
    timeout: 30000,
    retryAttempts: 3,
    retryDelay: 1000
  }
}

// Configuración de infografías
export const INFOGRAPHIC_CONFIG = {
  defaultSize: '1024x1792' as const,
  defaultQuality: 'hd' as const,
  fallbackEnabled: true,
  maxRetries: 3,
  timeout: 45000
}

// Configuración de logging
export const LOGGING_CONFIG = {
  level: 'info' as const,
  enableConsole: true,
  enableRemote: false
}

// Función para verificar si una API key está configurada
export function isAPIKeyConfigured(provider: keyof typeof AI_CONFIG): boolean {
  const config = AI_CONFIG[provider]
  return config.apiKey !== '' && config.apiKey !== 'your_api_key_here'
}

// Función para obtener configuración completa
export function getSimpleConfig() {
  return {
    ai: AI_CONFIG,
    infographic: INFOGRAPHIC_CONFIG,
    logging: LOGGING_CONFIG
  }
}
