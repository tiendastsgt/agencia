#!/usr/bin/env node

/**
 * Script para verificar el estado de la base de datos
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

async function checkDatabase() {
  console.log('🔍 VERIFICANDO BASE DE DATOS\n')

  try {
    // Verificar tablas existentes
    console.log('1️⃣ Verificando tablas existentes...')
    
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .order('table_name')

    if (tablesError) {
      console.error('❌ Error al obtener tablas:', tablesError.message)
      return
    }

    const tableNames = tables?.map(t => t.table_name) || []
    console.log(`✅ ${tableNames.length} tablas encontradas:`)
    tableNames.forEach(table => {
      console.log(`   - ${table}`)
    })

    // Verificar si existen las tablas del sistema de credenciales
    const credentialTables = ['api_credentials', 'credential_usage_logs', 'api_providers']
    const missingTables = credentialTables.filter(table => !tableNames.includes(table))
    
    if (missingTables.length > 0) {
      console.log(`\n⚠️  Tablas del sistema de credenciales faltantes: ${missingTables.join(', ')}`)
      console.log('💡 Ejecuta la migración SQL en Supabase para crear estas tablas')
    } else {
      console.log('\n✅ Todas las tablas del sistema de credenciales están presentes')
    }

    // Verificar clientes
    console.log('\n2️⃣ Verificando clientes...')
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id, name, business_type')
      .limit(5)

    if (clientsError) {
      console.error('❌ Error al obtener clientes:', clientsError.message)
    } else {
      console.log(`✅ ${clients?.length || 0} clientes encontrados`)
      clients?.forEach(client => {
        console.log(`   - ${client.name} (${client.business_type})`)
      })
    }

    // Verificar campañas
    console.log('\n3️⃣ Verificando campañas...')
    const { data: campaigns, error: campaignsError } = await supabase
      .from('campaigns')
      .select('id, name, status')
      .limit(5)

    if (campaignsError) {
      console.error('❌ Error al obtener campañas:', campaignsError.message)
    } else {
      console.log(`✅ ${campaigns?.length || 0} campañas encontradas`)
      campaigns?.forEach(campaign => {
        console.log(`   - ${campaign.name} (${campaign.status})`)
      })
    }

    console.log('\n🎉 Verificación completada!')
    console.log('\n📝 Próximos pasos:')
    if (missingTables.length > 0) {
      console.log('   1. Ejecuta la migración SQL en Supabase')
      console.log('   2. Ve a http://localhost:5173/credentials')
    } else {
      console.log('   1. Ve a http://localhost:5173/credentials')
      console.log('   2. Configura tu primera credencial')
    }

  } catch (error) {
    console.error('❌ Error durante la verificación:', error.message)
    process.exit(1)
  }
}

checkDatabase()
