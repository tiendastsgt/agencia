#!/usr/bin/env node

/**
 * Script simple para ejecutar la migración SQL usando curl
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

console.log('🚀 EJECUTANDO MIGRACIÓN SQL DEL SISTEMA DE CREDENCIALES\n')

try {
  // Leer el archivo de migración
  const migrationPath = path.join(__dirname, '..', 'database_migrations', '003_credentials_system.sql')
  
  if (!fs.existsSync(migrationPath)) {
    console.error('❌ Error: No se encontró el archivo de migración')
    process.exit(1)
  }

  const migrationSQL = fs.readFileSync(migrationPath, 'utf8')
  console.log('✅ Archivo de migración leído correctamente')

  // Leer variables de entorno
  const envPath = path.join(__dirname, '..', '.env.local')
  if (!fs.existsSync(envPath)) {
    console.error('❌ Error: No se encontró .env.local')
    process.exit(1)
  }

  const envContent = fs.readFileSync(envPath, 'utf8')
  const supabaseUrl = envContent.match(/VITE_SUPABASE_URL=(.+)/)?.[1]
  const supabaseKey = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/)?.[1]

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: No se encontraron las credenciales de Supabase')
    process.exit(1)
  }

  console.log('✅ Credenciales de Supabase encontradas')

  // Ejecutar la migración usando curl
  console.log('🔄 Ejecutando migración...')
  
  const curlCommand = `curl -X POST "${supabaseUrl}/rest/v1/rpc/exec_sql" -H "apikey: ${supabaseKey}" -H "Content-Type: application/json" -d "{\\"sql\\": \\"${migrationSQL.replace(/"/g, '\\"').replace(/\n/g, '\\n')}\\"}"`
  
  try {
    const result = execSync(curlCommand, { encoding: 'utf8', timeout: 30000 })
    console.log('✅ Migración ejecutada correctamente!')
    console.log('Resultado:', result)
  } catch (error) {
    console.error('❌ Error al ejecutar migración:', error.message)
    console.log('💡 Intenta ejecutar la migración manualmente en Supabase SQL Editor')
    return
  }

  // Verificar que las tablas se crearon
  console.log('\n🔍 Verificando tablas creadas...')
  
  const checkTablesCommand = `curl -X GET "${supabaseUrl}/rest/v1/information_schema.tables?table_schema=eq.public&table_name=in.(api_credentials,credential_usage_logs,api_providers)" -H "apikey: ${supabaseKey}"`
  
  try {
    const tablesResult = execSync(checkTablesCommand, { encoding: 'utf8' })
    console.log('✅ Verificación de tablas completada')
    console.log('Resultado:', tablesResult)
  } catch (error) {
    console.error('❌ Error al verificar tablas:', error.message)
  }

  // Verificar proveedores insertados
  console.log('\n🔍 Verificando proveedores insertados...')
  
  const checkProvidersCommand = `curl -X GET "${supabaseUrl}/rest/v1/api_providers?select=name,display_name" -H "apikey: ${supabaseKey}"`
  
  try {
    const providersResult = execSync(checkProvidersCommand, { encoding: 'utf8' })
    console.log('✅ Verificación de proveedores completada')
    console.log('Resultado:', providersResult)
  } catch (error) {
    console.error('❌ Error al verificar proveedores:', error.message)
  }

  console.log('\n🎉 MIGRACIÓN COMPLETADA!')
  console.log('\n📝 Próximos pasos:')
  console.log('   1. Ve a http://localhost:5173/credentials')
  console.log('   2. Deberías ver la lista de proveedores')
  console.log('   3. Configura tu primera credencial')

} catch (error) {
  console.error('❌ Error durante la migración:', error.message)
  process.exit(1)
}
