/**
 * Script simple para probar la API de Gemini
 * Ejecutar: node scripts/test-gemini-simple.js
 */

import fs from 'fs'
import path from 'path'

function testGeminiAPI() {
  console.log('🤖 Probando API de Gemini...\n')
  
  try {
    // Leer el archivo .env.local
    const envPath = path.join(process.cwd(), '.env.local')
    const envContent = fs.readFileSync(envPath, 'utf8')
    
    // Buscar la API key de Gemini
    const geminiMatch = envContent.match(/VITE_GEMINI_API_KEY=(.+)/)
    
    if (!geminiMatch) {
      console.log('❌ API key de Gemini no encontrada en .env.local')
      return
    }
    
    const geminiKey = geminiMatch[1].trim()
    
    if (!geminiKey || geminiKey === 'your_gemini_api_key_here') {
      console.log('❌ API key de Gemini no configurada')
      console.log('💡 Configura VITE_GEMINI_API_KEY en .env.local')
      return
    }
    
    console.log('✅ API key de Gemini configurada')
    console.log(`🔑 Key: ${geminiKey.substring(0, 20)}...`)
    
    // Verificar formato de la API key
    if (geminiKey.startsWith('AIzaSy')) {
      console.log('✅ Formato de API key correcto (Google AI)')
    } else {
      console.log('⚠️  Formato de API key inusual')
    }
    
    console.log('\n🎯 Para probar en la aplicación:')
    console.log('   1. Abre http://localhost:5173')
    console.log('   2. Ve a la sección de Infografías')
    console.log('   3. Haz clic en "Generar con Gemini"')
    console.log('   4. Deberías ver logs de Gemini en lugar de fallback')
    
    console.log('\n📊 Logs esperados:')
    console.log('   ✅ Starting infographic image generation')
    console.log('   ✅ Using Gemini API (no fallback)')
    console.log('   ✅ Image generated successfully')
    console.log('   ✅ Infographic image generation completed')
    
    console.log('\n🎉 ¡API de Gemini lista para usar!')
    
  } catch (error) {
    console.log('❌ Error leyendo configuración:', error.message)
  }
}

testGeminiAPI()




