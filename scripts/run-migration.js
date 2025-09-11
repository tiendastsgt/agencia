#!/usr/bin/env node

/**
 * Script para ejecutar la migración SQL del sistema de credenciales
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY son requeridos')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function runMigration() {
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

    // Ejecutar la migración usando rpc
    console.log('🔄 Ejecutando migración...')
    
    const { data, error } = await supabase.rpc('exec_sql', {
      sql: migrationSQL
    })

    if (error) {
      console.error('❌ Error al ejecutar migración:', error.message)
      console.error('Detalles:', error)
      return
    }

    console.log('✅ Migración ejecutada correctamente!')

    // Verificar que las tablas se crearon
    console.log('\n🔍 Verificando tablas creadas...')
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['api_credentials', 'credential_usage_logs', 'api_providers'])

    if (tablesError) {
      console.error('❌ Error al verificar tablas:', tablesError.message)
      return
    }

    const tableNames = tables?.map(t => t.table_name) || []
    console.log(`✅ ${tableNames.length}/3 tablas creadas:`)
    tableNames.forEach(table => {
      console.log(`   - ${table}`)
    })

    // Verificar proveedores insertados
    console.log('\n🔍 Verificando proveedores insertados...')
    
    const { data: providers, error: providersError } = await supabase
      .from('api_providers')
      .select('name, display_name')
      .order('name')

    if (providersError) {
      console.error('❌ Error al verificar proveedores:', providersError.message)
      return
    }

    console.log(`✅ ${providers?.length || 0} proveedores insertados:`)
    providers?.forEach(provider => {
      console.log(`   - ${provider.display_name} (${provider.name})`)
    })

    console.log('\n🎉 MIGRACIÓN COMPLETADA EXITOSAMENTE!')
    console.log('\n📝 Próximos pasos:')
    console.log('   1. Ve a http://localhost:5173/credentials')
    console.log('   2. Deberías ver la lista de proveedores')
    console.log('   3. Configura tu primera credencial')

  } catch (error) {
    console.error('❌ Error durante la migración:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

runMigration()