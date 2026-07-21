#!/usr/bin/env node

/**
 * Script para verificar las tablas de la base de datos
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

// Cargar variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yitczogktdykcwjnejrt.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔍 Verificando tablas de la base de datos...\n')

// Tablas principales (15)
const mainTables = [
  'clients', 'campaigns', 'content', 'analytics', 'market_research', 'strategies',
  'mab_experiments', 'mab_arm_performance', 'mab_selections', 'mab_rewards',
  'rl_experiments', 'rl_episodes', 'rl_rewards', 'rl_policies', 'prompt_rewrite_sessions'
]

// Tablas de credenciales (3)
const credentialTables = [
  'api_providers', 'api_credentials', 'credential_usage_logs'
]

async function checkTable(tableName) {
  try {
    const { data, error, count } = await supabase
      .from(tableName)
      .select('*', { count: 'exact', head: true })
    
    if (error) {
      return { exists: false, error: error.message, count: 0 }
    }
    
    return { exists: true, error: null, count: count || 0 }
  } catch (error) {
    return { exists: false, error: error.message, count: 0 }
  }
}

async function checkAllTables() {
  console.log('📊 TABLAS PRINCIPALES (15):')
  console.log('=' .repeat(50))
  
  for (const table of mainTables) {
    const result = await checkTable(table)
    const status = result.exists ? '✅' : '❌'
    const count = result.exists ? `(${result.count} registros)` : ''
    const error = result.error ? ` - ${result.error}` : ''
    
    console.log(`${status} ${table.padEnd(25)} ${count}${error}`)
  }
  
  console.log('\n🔑 TABLAS DE CREDENCIALES (3):')
  console.log('=' .repeat(50))
  
  for (const table of credentialTables) {
    const result = await checkTable(table)
    const status = result.exists ? '✅' : '❌'
    const count = result.exists ? `(${result.count} registros)` : ''
    const error = result.error ? ` - ${result.error}` : ''
    
    console.log(`${status} ${table.padEnd(25)} ${count}${error}`)
  }
  
  console.log('\n👥 VERIFICANDO CLIENTES:')
  console.log('=' .repeat(50))
  
  try {
    const { data: clients, error } = await supabase
      .from('clients')
      .select('id, name, user_id, created_at')
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) {
      console.log('❌ Error al obtener clientes:', error.message)
    } else if (clients && clients.length > 0) {
      console.log(`✅ ${clients.length} clientes encontrados:`)
      clients.forEach(client => {
        console.log(`   - ${client.name} (ID: ${client.id}, User: ${client.user_id})`)
      })
    } else {
      console.log('⚠️  No hay clientes en la base de datos')
    }
  } catch (error) {
    console.log('❌ Error:', error.message)
  }
  
  console.log('\n🔐 VERIFICANDO USUARIOS:')
  console.log('=' .repeat(50))
  
  try {
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.log('❌ Error al obtener usuarios:', error.message)
    } else if (users && users.length > 0) {
      console.log(`✅ ${users.length} usuarios encontrados:`)
      users.forEach(user => {
        console.log(`   - ${user.email} (ID: ${user.id})`)
      })
    } else {
      console.log('⚠️  No hay usuarios en la base de datos')
    }
  } catch (error) {
    console.log('❌ Error al verificar usuarios:', error.message)
  }
}

checkAllTables().catch(console.error)
