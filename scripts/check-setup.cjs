#!/usr/bin/env node

/**
 * Script simple para verificar el setup del sistema
 */

console.log('🔍 VERIFICANDO SETUP DEL SISTEMA\n')

const fs = require('fs')
const path = require('path')

console.log('1️⃣ Verificando archivos de configuración...')

// Verificar .env.local
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  console.log('✅ .env.local encontrado')
  const envContent = fs.readFileSync(envPath, 'utf8')
  const hasSupabaseUrl = envContent.includes('VITE_SUPABASE_URL=')
  const hasSupabaseKey = envContent.includes('VITE_SUPABASE_ANON_KEY=')
  const hasOpenAIKey = envContent.includes('VITE_OPENAI_API_KEY=')
  const hasEncryptionKey = envContent.includes('VITE_ENCRYPTION_KEY=')
  
  console.log(`   - Supabase URL: ${hasSupabaseUrl ? '✅' : '❌'}`)
  console.log(`   - Supabase Key: ${hasSupabaseKey ? '✅' : '❌'}`)
  console.log(`   - OpenAI Key: ${hasOpenAIKey ? '✅' : '❌'}`)
  console.log(`   - Encryption Key: ${hasEncryptionKey ? '✅' : '❌'}`)
} else {
  console.log('❌ .env.local no encontrado')
}

// Verificar migraciones SQL
console.log('\n2️⃣ Verificando migraciones SQL...')
const migrationsPath = path.join(process.cwd(), 'database_migrations')
if (fs.existsSync(migrationsPath)) {
  const migrations = fs.readdirSync(migrationsPath).filter(f => f.endsWith('.sql'))
  console.log(`✅ ${migrations.length} migraciones encontradas:`)
  migrations.forEach(migration => {
    console.log(`   - ${migration}`)
  })
} else {
  console.log('❌ Carpeta database_migrations no encontrada')
}

// Verificar componentes UI
console.log('\n3️⃣ Verificando componentes UI...')
const uiComponents = [
  'src/components/ui/alert.tsx',
  'src/components/ui/tabs.tsx',
  'src/components/ui/badge.tsx',
  'src/components/ui/button.tsx',
  'src/components/ui/card.tsx'
]

let uiComponentsFound = 0
uiComponents.forEach(component => {
  const componentPath = path.join(process.cwd(), component)
  if (fs.existsSync(componentPath)) {
    uiComponentsFound++
  }
})

console.log(`✅ ${uiComponentsFound}/${uiComponents.length} componentes UI encontrados`)

// Verificar páginas del sistema de credenciales
console.log('\n4️⃣ Verificando sistema de credenciales...')
const credentialFiles = [
  'src/pages/CredentialsPage.tsx',
  'src/components/CredentialsStatus.tsx',
  'src/lib/credentials-service.ts',
  'src/lib/hooks/useCredentials.ts'
]

let credentialFilesFound = 0
credentialFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file)
  if (fs.existsSync(filePath)) {
    credentialFilesFound++
  }
})

console.log(`✅ ${credentialFilesFound}/${credentialFiles.length} archivos del sistema de credenciales encontrados`)

// Verificar rutas en App.tsx
console.log('\n5️⃣ Verificando configuración de rutas...')
const appPath = path.join(process.cwd(), 'src/App.tsx')
if (fs.existsSync(appPath)) {
  const appContent = fs.readFileSync(appPath, 'utf8')
  const hasCredentialsRoute = appContent.includes('/credentials')
  const hasCredentialsImport = appContent.includes('CredentialsPage')
  
  console.log(`   - Ruta /credentials: ${hasCredentialsRoute ? '✅' : '❌'}`)
  console.log(`   - Import CredentialsPage: ${hasCredentialsImport ? '✅' : '❌'}`)
} else {
  console.log('❌ src/App.tsx no encontrado')
}

console.log('\n🎉 Verificación completada!')
console.log('\n📝 Próximos pasos:')
console.log('   1. Ve a http://localhost:5173/')
console.log('   2. Inicia sesión o usa el modo demo')
console.log('   3. Ve a http://localhost:5173/credentials')
console.log('   4. Configura tu primera credencial de API')

console.log('\n💡 Si hay problemas:')
console.log('   - Ejecuta la migración SQL en Supabase')
console.log('   - Verifica que VITE_ENCRYPTION_KEY esté configurado')
console.log('   - Revisa la consola del navegador para errores')
