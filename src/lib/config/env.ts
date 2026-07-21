/**
 * Configuración de variables de entorno
 * Versión simplificada sin import.meta
 */

// Función para obtener variables de entorno
export function getEnvVar(key: string, defaultValue: string = ''): string {
  // En el navegador, buscar en el objeto global
  if (typeof window !== 'undefined') {
    // Vite inyecta las variables de entorno en el objeto global
    const globalEnv = (globalThis as any)[key]
    if (globalEnv && globalEnv !== '') {
      return globalEnv
    }
    
    // Fallback: buscar en window
    const windowEnv = (window as any)[key]
    if (windowEnv && windowEnv !== '') {
      return windowEnv
    }
  }
  
  return defaultValue
}

// Variables de entorno específicas para AI
export const AI_ENV_VARS = {
  GEMINI_API_KEY: 'VITE_GEMINI_API_KEY',
  OPENAI_API_KEY: 'VITE_OPENAI_API_KEY',
  STABILITY_API_KEY: 'VITE_STABILITY_API_KEY',
  MIDJOURNEY_API_KEY: 'VITE_MIDJOURNEY_API_KEY'
} as const

// Función para obtener todas las API keys
export function getAIEnvVars(): Record<string, string> {
  const result: Record<string, string> = {}
  
  for (const [name, key] of Object.entries(AI_ENV_VARS)) {
    result[name] = getEnvVar(key, '')
  }
  
  return result
}

// Función para verificar si una API key está configurada
export function isAPIKeyConfigured(provider: keyof typeof AI_ENV_VARS): boolean {
  const key = AI_ENV_VARS[provider]
  const value = getEnvVar(key, '')
  return value !== '' && value !== 'your_api_key_here'
}
