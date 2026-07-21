/**
 * Script simple para probar variables de entorno
 * Ejecutar: node scripts/test-env.js
 */

console.log('🧪 Probando variables de entorno...\n')

// Simular variables de entorno para prueba
const testEnv = {
  VITE_GEMINI_API_KEY: 'test_gemini_key',
  VITE_OPENAI_API_KEY: 'test_openai_key',
  VITE_STABILITY_API_KEY: 'test_stability_key'
}

console.log('📊 Variables de entorno simuladas:')
for (const [key, value] of Object.entries(testEnv)) {
  console.log(`   ${key}: ${value ? '✅ Configurado' : '❌ No configurado'}`)
}

console.log('\n💡 Para configurar en tu proyecto:')
console.log('   1. Edita el archivo .env.local')
console.log('   2. Agrega tus API keys reales')
console.log('   3. Reinicia el servidor de desarrollo')

console.log('\n🎉 Script de prueba completado!')




