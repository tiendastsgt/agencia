#!/usr/bin/env node

/**
 * Script para configurar DALL-E 3 API Key
 * Ejecutar: node scripts/setup-dalle3.js
 */

import fs from 'fs'
import path from 'path'

const envPath = path.join(process.cwd(), '.env.local')

// Verificar si ya existe el archivo
if (fs.existsSync(envPath)) {
  console.log('✅ Archivo .env.local ya existe')
  
  // Leer el contenido actual
  const content = fs.readFileSync(envPath, 'utf8')
  
  // Verificar si ya tiene la API key de OpenAI
  if (content.includes('VITE_OPENAI_API_KEY=')) {
    console.log('✅ VITE_OPENAI_API_KEY ya está configurado')
    
    // Verificar si tiene un valor real
    const lines = content.split('\n')
    const openaiLine = lines.find(line => line.startsWith('VITE_OPENAI_API_KEY='))
    
    if (openaiLine && !openaiLine.includes('your_openai_api_key_here')) {
      console.log('✅ OpenAI API Key ya está configurado con un valor real')
      console.log('🎯 DALL-E 3 debería funcionar ahora')
    } else {
      console.log('⚠️  OpenAI API Key no está configurado')
      console.log('📝 Edita el archivo .env.local y agrega tu API key de OpenAI')
      console.log('🔗 Obtén tu API key en: https://platform.openai.com/api-keys')
    }
  } else {
    console.log('⚠️  VITE_OPENAI_API_KEY no está en el archivo')
    console.log('📝 Agrega esta línea al archivo .env.local:')
    console.log('VITE_OPENAI_API_KEY=tu_api_key_aqui')
  }
} else {
  console.log('❌ Archivo .env.local no existe')
  console.log('📝 Creando archivo .env.local...')
  
  const envContent = `# API Keys para MarketPro GT
# Configura tus API keys aquí

# OpenAI API Key para DALL-E 3
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Gemini API Key (para futuras implementaciones)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Stability AI API Key
VITE_STABILITY_API_KEY=your_stability_api_key_here

# Midjourney API Key
VITE_MIDJOURNEY_API_KEY=your_midjourney_api_key_here

# Configuración de logging
VITE_LOG_LEVEL=info`

  fs.writeFileSync(envPath, envContent)
  console.log('✅ Archivo .env.local creado')
  console.log('📝 Edita el archivo y agrega tu API key de OpenAI')
  console.log('🔗 Obtén tu API key en: https://platform.openai.com/api-keys')
}

console.log('\n🎯 Para usar DALL-E 3:')
console.log('1. Obtén tu API key de OpenAI en: https://platform.openai.com/api-keys')
console.log('2. Edita el archivo .env.local')
console.log('3. Reemplaza "your_openai_api_key_here" con tu API key real')
console.log('4. Reinicia el servidor de desarrollo')
console.log('5. Prueba la generación de infografías')




