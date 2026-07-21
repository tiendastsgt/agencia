#!/usr/bin/env node

/**
 * Script para configurar credenciales de prueba
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yitczogktdykcwjnejrt.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔧 Configurando credenciales de prueba...\n')

async function setupTestCredentials() {
  try {
    // 1. Obtener clientes existentes
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id, name, user_id')
      .limit(2)
    
    if (clientsError) {
      console.error('❌ Error al obtener clientes:', clientsError.message)
      return
    }
    
    console.log('📋 Clientes encontrados:')
    clients.forEach(client => {
      console.log(`   - ${client.name} (ID: ${client.id})`)
    })
    
    // 2. Obtener proveedores de API
    const { data: providers, error: providersError } = await supabase
      .from('api_providers')
      .select('id, name, display_name')
      .limit(5)
    
    if (providersError) {
      console.error('❌ Error al obtener proveedores:', providersError.message)
      return
    }
    
    console.log('\n🔑 Proveedores de API encontrados:')
    providers.forEach(provider => {
      console.log(`   - ${provider.display_name} (${provider.name})`)
    })
    
    // 3. Crear credenciales de prueba
    const testCredentials = [
      {
        client_id: clients[0]?.id,
        user_id: clients[0]?.user_id,
        provider: 'openai',
        credential_name: 'OpenAI Test Key',
        credential_type: 'api_key',
        encrypted_value: 'sk-test-key-123456789',
        encryption_key_id: 'test-key',
        is_active: true,
        usage_count: 0,
        config: {}
      },
      {
        client_id: clients[0]?.id,
        user_id: clients[0]?.user_id,
        provider: 'facebook',
        credential_name: 'Facebook Test Token',
        credential_type: 'oauth_token',
        encrypted_value: 'facebook-test-token-123456789',
        encryption_key_id: 'test-key',
        is_active: true,
        usage_count: 0,
        config: {}
      }
    ]
    
    console.log('\n➕ Creando credenciales de prueba...')
    
    for (const credential of testCredentials) {
      const { data, error } = await supabase
        .from('api_credentials')
        .insert(credential)
        .select()
      
      if (error) {
        console.log(`❌ Error al crear credencial ${credential.credential_name}:`, error.message)
      } else {
        console.log(`✅ Credencial creada: ${credential.credential_name}`)
      }
    }
    
    // 4. Verificar credenciales creadas
    const { data: allCredentials, error: verifyError } = await supabase
      .from('api_credentials')
      .select('id, provider, credential_name, is_active, created_at')
      .order('created_at', { ascending: false })
    
    if (verifyError) {
      console.error('❌ Error al verificar credenciales:', verifyError.message)
    } else {
      console.log('\n📊 Credenciales en la base de datos:')
      if (allCredentials && allCredentials.length > 0) {
        allCredentials.forEach(cred => {
          console.log(`   - ${cred.credential_name} (${cred.provider}) - ${cred.is_active ? 'Activa' : 'Inactiva'}`)
        })
      } else {
        console.log('   ⚠️  No hay credenciales en la base de datos')
      }
    }
    
    console.log('\n🎉 Configuración completada!')
    console.log('💡 Ahora puedes ir a http://localhost:5173/credentials para ver las credenciales')
    
  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

setupTestCredentials()
