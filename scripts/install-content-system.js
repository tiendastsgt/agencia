#!/usr/bin/env node

// Script de instalación completa del sistema de plantillas de contenido
// Ejecuta todas las configuraciones necesarias

import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

console.log('🚀 Instalando Sistema de Plantillas de Contenido...')
console.log('=' .repeat(50))

async function installContentSystem() {
  try {
    // 1. Verificar dependencias
    console.log('📦 Verificando dependencias...')
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
    
    const requiredDeps = [
      '@supabase/supabase-js',
      'lucide-react'
    ]
    
    const missingDeps = requiredDeps.filter(dep => 
      !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
    )
    
    if (missingDeps.length > 0) {
      console.log(`⚠️  Dependencias faltantes: ${missingDeps.join(', ')}`)
      console.log('📥 Instalando dependencias...')
      execSync(`npm install ${missingDeps.join(' ')}`, { stdio: 'inherit' })
    } else {
      console.log('✅ Todas las dependencias están instaladas')
    }
    
    // 2. Crear archivo de configuración de API keys
    console.log('🔑 Configurando archivo de API keys...')
    const configDir = 'config'
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }
    
    const apiKeysFile = path.join(configDir, 'api-keys.ts')
    if (!fs.existsSync(apiKeysFile)) {
      const apiKeysContent = `// Configuración de APIs para Generación de Contenido Visual
// Reemplaza las API keys con tus claves reales

export const API_CONFIG = {
  // OpenAI API Key (para DALL-E 3)
  OPENAI_API_KEY: 'sk-your-openai-api-key-here',
  
  // Stability AI API Key (para Stable Diffusion)
  STABILITY_API_KEY: 'sk-your-stability-api-key-here',
  
  // Google AI API Key (para Imagen)
  GOOGLE_AI_API_KEY: 'your-google-ai-api-key-here',
  
  // Supabase Configuration
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-supabase-anon-key'
}

export default API_CONFIG`
      
      fs.writeFileSync(apiKeysFile, apiKeysContent)
      console.log('✅ Archivo de configuración creado en config/api-keys.ts')
      console.log('⚠️  IMPORTANTE: Configura tus API keys en config/api-keys.ts')
    } else {
      console.log('✅ Archivo de configuración ya existe')
    }
    
    // 3. Crear archivo .env si no existe
    console.log('🌍 Configurando variables de entorno...')
    const envFile = '.env'
    if (!fs.existsSync(envFile)) {
      const envContent = `# Configuración de APIs para Generación de Contenido Visual

# OpenAI API Key (para DALL-E 3)
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here

# Stability AI API Key (para Stable Diffusion)
VITE_STABILITY_API_KEY=sk-your-stability-api-key-here

# Google AI API Key (para Imagen)
VITE_GOOGLE_AI_API_KEY=your-google-ai-api-key-here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Configuración de la aplicación
VITE_APP_NAME=MarketPro GT
VITE_APP_VERSION=1.0.0`
      
      fs.writeFileSync(envFile, envContent)
      console.log('✅ Archivo .env creado')
      console.log('⚠️  IMPORTANTE: Configura tus variables de entorno en .env')
    } else {
      console.log('✅ Archivo .env ya existe')
    }
    
    // 4. Verificar estructura de archivos
    console.log('📁 Verificando estructura de archivos...')
    const requiredFiles = [
      'src/lib/content-template-engine.ts',
      'src/lib/content-generation-apis.ts',
      'src/components/ContentTemplateGenerator.tsx',
      'src/components/APIStatusChecker.tsx',
      'database_migrations/001_content_templates.sql',
      'database_migrations/002_create_exec_sql_function.sql'
    ]
    
    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file))
    
    if (missingFiles.length > 0) {
      console.log('❌ Archivos faltantes:')
      missingFiles.forEach(file => console.log(`   - ${file}`))
      console.log('💥 Instalación incompleta. Algunos archivos no se encontraron.')
      return false
    } else {
      console.log('✅ Todos los archivos del sistema están presentes')
    }
    
    // 5. Mostrar instrucciones de configuración
    console.log('')
    console.log('🎉 ¡Sistema de Plantillas de Contenido instalado exitosamente!')
    console.log('')
    console.log('📋 PRÓXIMOS PASOS:')
    console.log('')
    console.log('1. 🔑 Configurar API Keys:')
    console.log('   - Edita config/api-keys.ts con tus API keys reales')
    console.log('   - O configura las variables de entorno en .env')
    console.log('')
    console.log('2. 🗄️  Configurar Base de Datos:')
    console.log('   - Ejecuta las migraciones SQL en tu instancia de Supabase')
    console.log('   - O usa el script: node scripts/setup-content-templates.js')
    console.log('')
    console.log('3. 🚀 Iniciar la Aplicación:')
    console.log('   - npm run dev')
    console.log('   - Ve al Dashboard para usar el generador de contenido')
    console.log('')
    console.log('📚 DOCUMENTACIÓN:')
    console.log('   - Sistema de plantillas: src/lib/content-template-engine.ts')
    console.log('   - APIs de generación: src/lib/content-generation-apis.ts')
    console.log('   - Componente principal: src/components/ContentTemplateGenerator.tsx')
    console.log('')
    console.log('🔗 APIs SOPORTADAS:')
    console.log('   - OpenAI DALL-E 3: https://platform.openai.com/api-keys')
    console.log('   - Stability AI: https://platform.stability.ai/account/keys')
    console.log('   - Google AI: https://aistudio.google.com/app/apikey')
    console.log('')
    
    return true
    
  } catch (error) {
    console.error('❌ Error durante la instalación:', error)
    return false
  }
}

// Ejecutar instalación
installContentSystem().then(success => {
  if (success) {
    console.log('✅ Instalación completada exitosamente')
    process.exit(0)
  } else {
    console.log('💥 Instalación falló')
    process.exit(1)
  }
})

