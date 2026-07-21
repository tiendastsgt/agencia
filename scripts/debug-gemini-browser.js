/**
 * Script para debuggear Gemini en el navegador
 * Ejecutar en la consola del navegador
 */

console.log('🔍 Debugging Gemini API Key...')

// Verificar variables de entorno
console.log('📊 Variables de entorno:')
console.log('VITE_GEMINI_API_KEY:', import.meta.env.VITE_GEMINI_API_KEY)
console.log('VITE_OPENAI_API_KEY:', import.meta.env.VITE_OPENAI_API_KEY)
console.log('VITE_STABILITY_API_KEY:', import.meta.env.VITE_STABILITY_API_KEY)

// Verificar si existe window.__VITE_ENV__
console.log('🌐 window.__VITE_ENV__:', window.__VITE_ENV__)

// Verificar si existe globalThis
console.log('🌍 globalThis:', globalThis)

// Verificar configManager
try {
  const { configManager } = await import('../src/lib/config/index.ts')
  console.log('⚙️ ConfigManager:')
  console.log('  Gemini config:', configManager.getAIConfig('gemini'))
  console.log('  Full config:', configManager.getConfig())
} catch (error) {
  console.error('❌ Error importing configManager:', error)
}

// Verificar simple-config
try {
  const { getSimpleConfig, getSimpleEnvVar } = await import('../src/lib/config/simple-config.ts')
  console.log('🔧 Simple Config:')
  console.log('  getSimpleEnvVar VITE_GEMINI_API_KEY:', getSimpleEnvVar('VITE_GEMINI_API_KEY'))
  console.log('  getSimpleConfig:', getSimpleConfig())
} catch (error) {
  console.error('❌ Error importing simple-config:', error)
}

console.log('✅ Debug completo')




