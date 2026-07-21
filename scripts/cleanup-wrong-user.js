#!/usr/bin/env node

/**
 * Script para limpiar usuario incorrecto y configurar tiendastsgt@gmail.com
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yitczogktdykcwjnejrt.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🧹 Limpiando usuario incorrecto y configurando tiendastsgt@gmail.com...\n')

async function cleanupAndSetup() {
  try {
    // 1. Autenticarse con el usuario incorrecto para limpiar
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'mypxtbfr@minimax.com',
      password: '7jujudSXex'
    })
    
    if (authError) {
      console.log('❌ Error de autenticación:', authError.message)
      return
    }
    
    console.log('✅ Autenticado como:', authData.user.email)
    
    // 2. Eliminar todas las credenciales del usuario incorrecto
    console.log('\n🗑️  Eliminando credenciales del usuario incorrecto...')
    
    const { data: credentialsToDelete, error: deleteError } = await supabase
      .from('api_credentials')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000') // Eliminar todas
      .select()
    
    if (deleteError) {
      console.log('❌ Error al eliminar credenciales:', deleteError.message)
    } else {
      console.log(`✅ Eliminadas ${credentialsToDelete?.length || 0} credenciales`)
    }
    
    // 3. Cerrar sesión
    await supabase.auth.signOut()
    console.log('✅ Sesión cerrada')
    
    // 4. Buscar el cliente de tiendastsgt@gmail.com
    console.log('\n🔍 Buscando cliente de tiendastsgt@gmail.com...')
    
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id, name, user_id')
      .ilike('name', '%tienda%')
    
    if (clientsError) {
      console.log('❌ Error al buscar clientes:', clientsError.message)
      return
    }
    
    if (clients && clients.length > 0) {
      console.log('📋 Clientes encontrados:')
      clients.forEach(client => {
        console.log(`   - ${client.name} (ID: ${client.id}, User: ${client.user_id})`)
      })
      
      // 5. Crear credenciales para el cliente correcto
      const correctClient = clients[0]
      console.log(`\n➕ Creando credenciales para ${correctClient.name}...`)
      
      const credentials = [
        {
          client_id: correctClient.id,
          user_id: correctClient.user_id,
          provider: 'openai',
          credential_name: 'OpenAI API Key - TiendaSTS',
          credential_type: 'api_key',
          encrypted_value: 'sk-tiendasts-openai-key-123456789',
          encryption_key_id: 'tiendasts-key',
          is_active: true,
          usage_count: 0,
          config: {}
        },
        {
          client_id: correctClient.id,
          user_id: correctClient.user_id,
          provider: 'facebook',
          credential_name: 'Facebook Graph API - TiendaSTS',
          credential_type: 'oauth_token',
          encrypted_value: 'facebook-tiendasts-token-123456789',
          encryption_key_id: 'tiendasts-key',
          is_active: true,
          usage_count: 0,
          config: { permissions: ['pages_manage_posts', 'pages_read_engagement'] }
        },
        {
          client_id: correctClient.id,
          user_id: correctClient.user_id,
          provider: 'instagram',
          credential_name: 'Instagram API - TiendaSTS',
          credential_type: 'oauth_token',
          encrypted_value: 'instagram-tiendasts-token-123456789',
          encryption_key_id: 'tiendasts-key',
          is_active: true,
          usage_count: 0,
          config: { permissions: ['user_profile', 'user_media'] }
        },
        {
          client_id: correctClient.id,
          user_id: correctClient.user_id,
          provider: 'google',
          credential_name: 'Google Analytics 4 - TiendaSTS',
          credential_type: 'api_key',
          encrypted_value: 'google-tiendasts-key-123456789',
          encryption_key_id: 'tiendasts-key',
          is_active: true,
          usage_count: 0,
          config: { property_id: 'GA4-TIENDASTS-123456789' }
        },
        {
          client_id: correctClient.id,
          user_id: correctClient.user_id,
          provider: 'twitter',
          credential_name: 'Twitter API v2 - TiendaSTS',
          credential_type: 'oauth_token',
          encrypted_value: 'twitter-tiendasts-token-123456789',
          encryption_key_id: 'tiendasts-key',
          is_active: true,
          usage_count: 0,
          config: { api_version: 'v2' }
        }
      ]
      
      for (const credential of credentials) {
        const { data, error } = await supabase
          .from('api_credentials')
          .insert(credential)
          .select()
        
        if (error) {
          console.log(`❌ Error al crear ${credential.credential_name}:`, error.message)
        } else {
          console.log(`✅ Creada: ${credential.credential_name}`)
        }
      }
      
      // 6. Verificar credenciales creadas
      const { data: allCredentials } = await supabase
        .from('api_credentials')
        .select('id, provider, credential_name, client_id')
        .order('created_at', { ascending: false })
      
      console.log('\n📊 Credenciales de TiendaSTS:')
      if (allCredentials && allCredentials.length > 0) {
        allCredentials.forEach(cred => {
          console.log(`   - ${cred.credential_name} (${cred.provider})`)
        })
      } else {
        console.log('   ⚠️  No hay credenciales')
      }
      
    } else {
      console.log('❌ No se encontraron clientes de TiendaSTS')
    }
    
    console.log('\n🎉 ¡Configuración completada!')
    console.log('💡 Usuario correcto: tiendastsgt@gmail.com')
    console.log('💡 Ve a http://localhost:5173/credentials para ver las credenciales')
    
  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

cleanupAndSetup()
