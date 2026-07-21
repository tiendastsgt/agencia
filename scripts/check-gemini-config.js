/**
 * Script para verificar la configuración de Gemini en tiempo real
 * Ejecutar: node scripts/check-gemini-config.js
 */

import fs from 'fs'
import path from 'path'

function checkGeminiConfig() {
  console.log('🔍 Verificando configuración de Gemini...\n')
  
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
    
    console.log('📊 Configuración encontrada:')
    console.log(`   API Key: ${geminiKey.substring(0, 20)}...`)
    console.log(`   Longitud: ${geminiKey.length} caracteres`)
    console.log(`   Formato: ${geminiKey.startsWith('AIzaSy') ? '✅ Correcto' : '⚠️ Inusual'}`)
    
    // Verificar si es la key placeholder
    if (geminiKey === 'your_gemini_api_key_here') {
      console.log('❌ API key es placeholder, no está configurada')
      return
    }
    
    console.log('\n🔧 Para debuggear en el navegador:')
    console.log('   1. Abre DevTools (F12)')
    console.log('   2. Ve a la pestaña Console')
    console.log('   3. Ejecuta este código:')
    console.log('')
    console.log('   console.log("VITE_GEMINI_API_KEY:", import.meta.env.VITE_GEMINI_API_KEY)')
    console.log('')
    console.log('   4. Debería mostrar tu API key')
    
    console.log('\n🎯 Para probar la generación:')
    console.log('   1. Haz clic en "Generar con Gemini"')
    console.log('   2. Observa los logs en la consola')
    console.log('   3. Deberías ver: "Checking API key configuration"')
    console.log('   4. Si hasApiKey: true, debería usar Gemini')
    console.log('   5. Si hasApiKey: false, usará fallback')
    
    console.log('\n✅ Configuración verificada')
    
  } catch (error) {
    console.log('❌ Error verificando configuración:', error.message)
  }
}

checkGeminiConfig()




