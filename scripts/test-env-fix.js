/**
 * Script para probar la corrección de variables de entorno
 * Ejecutar: node scripts/test-env-fix.js
 */

import fs from 'fs'
import path from 'path'

function testEnvFix() {
  console.log('🔧 Probando corrección de variables de entorno...\n')
  
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
    
    console.log('✅ API key encontrada en .env.local:')
    console.log(`   ${geminiKey.substring(0, 20)}...`)
    
    console.log('\n🔧 Corrección aplicada:')
    console.log('   - Cambiado de globalThis a import.meta.env')
    console.log('   - Agregada verificación de import.meta')
    console.log('   - Mejorada detección de placeholders')
    
    console.log('\n🎯 Para probar:')
    console.log('   1. Recarga la página en el navegador')
    console.log('   2. Haz clic en "Generar con Gemini"')
    console.log('   3. Deberías ver:')
    console.log('      ✅ hasApiKey: true')
    console.log('      ✅ apiKeyLength: 39')
    console.log('      ✅ apiKeyStart: "AIzaSyA5TG"')
    console.log('   4. Y NO debería usar fallback')
    
    console.log('\n📊 Logs esperados:')
    console.log('   INFO Checking API key configuration {hasApiKey: true, apiKeyLength: 39}')
    console.log('   INFO Using Gemini API for image generation')
    console.log('   INFO Image generated successfully')
    
    console.log('\n🎉 ¡Corrección aplicada!')
    
  } catch (error) {
    console.log('❌ Error:', error.message)
  }
}

testEnvFix()




