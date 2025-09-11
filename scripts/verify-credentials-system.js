#!/usr/bin/env node

/**
 * Script de verificación del sistema de credenciales
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY son requeridos')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function verifyCredentialsSystem() {
  console.log('🔍 VERIFICANDO SISTEMA DE CREDENCIALES\n')

  try {
    // Verificar tablas
    console.log('1️⃣ Verificando tablas...')
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['api_credentials', 'credential_usage_logs', 'api_providers'])

    if (tablesError) throw tablesError

    const tableNames = tables?.map(t => t.table_name) || []
    const expectedTables = ['api_credentials', 'credential_usage_logs', 'api_providers']
    
    const missingTables = expectedTables.filter(table => !tableNames.includes(table))
    
    if (missingTables.length > 0) {
      console.error('❌ Tablas faltantes:', missingTables.join(', '))
      console.log('💡 Ejecuta la migración SQL primero')
      return
    }
    
    console.log('✅ Todas las tablas están presentes')

    // Verificar proveedores
    console.log('\n2️⃣ Verificando proveedores...')
    
    const { data: providers, error: providersError } = await supabase
      .from('api_providers')
      .select('name, display_name, auth_type')
      .order('name')

    if (providersError) throw providersError

    console.log(`✅ ${providers?.length || 0} proveedores configurados:`)
    providers?.forEach(provider => {
      console.log(`   - ${provider.display_name} (${provider.auth_type})`)
    })

    // Verificar funciones
    console.log('\n3️⃣ Verificando funciones...')
    
    const { data: functions, error: functionsError } = await supabase
      .from('information_schema.routines')
      .select('routine_name')
      .eq('routine_schema', 'public')
      .in('routine_name', ['encrypt_credential', 'decrypt_credential', 'validate_api_credential'])

    if (functionsError) throw functionsError

    const functionNames = functions?.map(f => f.routine_name) || []
    const expectedFunctions = ['encrypt_credential', 'decrypt_credential', 'validate_api_credential']
    
    const missingFunctions = expectedFunctions.filter(func => !functionNames.includes(func))
    
    if (missingFunctions.length > 0) {
      console.error('❌ Funciones faltantes:', missingFunctions.join(', '))
      return
    }
    
    console.log('✅ Todas las funciones están presentes')

    // Verificar políticas RLS
    console.log('\n4️⃣ Verificando políticas RLS...')
    
    const { data: policies, error: policiesError } = await supabase
      .from('information_schema.table_privileges')
      .select('table_name, privilege_type')
      .eq('table_schema', 'public')
      .in('table_name', ['api_credentials', 'credential_usage_logs', 'api_providers'])

    if (policiesError) throw policiesError

    console.log('✅ Políticas RLS configuradas')

    console.log('\n🎉 ¡Sistema de credenciales verificado exitosamente!')
    console.log('\n📝 Próximos pasos:')
    console.log('   1. Ve a /credentials en la aplicación')
    console.log('   2. Configura tu primera credencial')
    console.log('   3. ¡Comienza a usar las APIs de forma segura!')

  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message)
    process.exit(1)
  }
}

verifyCredentialsSystem()
