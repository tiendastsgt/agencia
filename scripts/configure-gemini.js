/**
 * Script para configurar API key de Gemini
 * Ejecutar: node scripts/configure-gemini.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function configureGeminiAPI() {
  console.log('🤖 Configurando API key de Gemini...\n')
  
  const envPath = path.join(process.cwd(), '.env.local')
  
  // Verificar si el archivo existe
  if (!fs.existsSync(envPath)) {
    console.log('❌ Archivo .env.local no encontrado')
    console.log('💡 Ejecuta primero: node scripts/setup-env.js')
    return
  }
  
  // Leer el archivo actual
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  // Verificar si ya tiene una API key configurada
  if (envContent.includes('VITE_GEMINI_API_KEY=') && !envContent.includes('your_gemini_api_key_here')) {
    console.log('✅ API key de Gemini ya está configurada')
    console.log('📝 Contenido actual:')
    console.log(envContent)
    return
  }
  
  console.log('📋 Para configurar Gemini:')
  console.log('   1. Ve a https://aistudio.google.com/')
  console.log('   2. Inicia sesión con tu cuenta de Google')
  console.log('   3. Haz clic en "Get API Key"')
  console.log('   4. Crea una nueva API key')
  console.log('   5. Copia la API key')
  console.log('\n💡 Luego edita el archivo .env.local y reemplaza:')
  console.log('   VITE_GEMINI_API_KEY=your_gemini_api_key_here')
  console.log('   por:')
  console.log('   VITE_GEMINI_API_KEY=tu_api_key_real_aqui')
  
  console.log('\n🔧 Archivo .env.local actual:')
  console.log(envContent)
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  configureGeminiAPI()
}

export { configureGeminiAPI }




