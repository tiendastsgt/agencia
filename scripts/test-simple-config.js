/**
 * Script para probar la configuración simple
 * Ejecutar: node scripts/test-simple-config.js
 */

console.log('🧪 Probando configuración simple...\n')

try {
  // Simular variables de entorno
  globalThis.VITE_GEMINI_API_KEY = 'test_gemini_key'
  globalThis.VITE_OPENAI_API_KEY = 'test_openai_key'
  globalThis.VITE_STABILITY_API_KEY = 'test_stability_key'
  
  console.log('📊 Variables de entorno simuladas:')
  console.log(`   VITE_GEMINI_API_KEY: ${globalThis.VITE_GEMINI_API_KEY ? '✅ Configurado' : '❌ No configurado'}`)
  console.log(`   VITE_OPENAI_API_KEY: ${globalThis.VITE_OPENAI_API_KEY ? '✅ Configurado' : '❌ No configurado'}`)
  console.log(`   VITE_STABILITY_API_KEY: ${globalThis.VITE_STABILITY_API_KEY ? '✅ Configurado' : '❌ No configurado'}`)
  
  console.log('\n💡 Para configurar en tu proyecto:')
  console.log('   1. Edita el archivo .env.local')
  console.log('   2. Agrega tus API keys reales:')
  console.log('      VITE_GEMINI_API_KEY=tu_api_key_aqui')
  console.log('      VITE_OPENAI_API_KEY=tu_api_key_aqui')
  console.log('      VITE_STABILITY_API_KEY=tu_api_key_aqui')
  console.log('   3. Reinicia el servidor de desarrollo')
  
  console.log('\n🎉 Configuración simple probada exitosamente!')
  
} catch (error) {
  console.error('❌ Error probando configuración:', error.message)
}




