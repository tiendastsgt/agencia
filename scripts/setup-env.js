/**
 * Script para configurar variables de entorno
 * Ejecutar: node scripts/setup-env.js
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const envTemplate = `# Variables de entorno para desarrollo local
# Configura tus API keys aquí

# Google Gemini API Key
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# OpenAI DALL-E 3 API Key
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Stability AI API Key
VITE_STABILITY_API_KEY=your_stability_api_key_here

# Midjourney API Key (opcional)
VITE_MIDJOURNEY_API_KEY=your_midjourney_api_key_here

# Configuración de logging
VITE_LOG_LEVEL=info
`

const envPath = path.join(process.cwd(), '.env.local')

function setupEnvironment() {
  console.log('🔧 Configurando variables de entorno...')
  
  // Verificar si ya existe el archivo
  if (fs.existsSync(envPath)) {
    console.log('⚠️  El archivo .env.local ya existe')
    console.log('📝 Contenido actual:')
    console.log(fs.readFileSync(envPath, 'utf8'))
    console.log('\n💡 Si necesitas actualizarlo, edita el archivo manualmente')
    return
  }
  
  // Crear el archivo .env.local
  try {
    fs.writeFileSync(envPath, envTemplate)
    console.log('✅ Archivo .env.local creado exitosamente')
    console.log('📝 Edita el archivo y configura tus API keys:')
    console.log('   - VITE_GEMINI_API_KEY: Tu API key de Google Gemini')
    console.log('   - VITE_OPENAI_API_KEY: Tu API key de OpenAI')
    console.log('   - VITE_STABILITY_API_KEY: Tu API key de Stability AI')
    console.log('\n🚀 Después de configurar las API keys, reinicia el servidor de desarrollo')
  } catch (error) {
    console.error('❌ Error creando archivo .env.local:', error.message)
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  setupEnvironment()
}

export { setupEnvironment }
