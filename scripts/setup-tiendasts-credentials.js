#!/usr/bin/env node

/**
 * Script para configurar credenciales para tiendastsgt@gmail.com
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yitczogktdykcwjnejrt.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔧 Configurando credenciales para tiendastsgt@gmail.com...\n')

async function setupTiendaSTSCredentials() {
  try {
    // 1. Intentar autenticarse con tiendastsgt@gmail.com
    console.log('🔐 Intentando autenticación con tiendastsgt@gmail.com...')
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'tiendastsgt@gmail.com',
      password: 'tiendasts2025'
    })
    
    if (authError) {
      console.log('❌ Error de autenticación:', authError.message)
      console.log('💡 Posibles soluciones:')
      console.log('   1. Verificar que el usuario existe en Supabase')
      console.log('   2. Verificar la contraseña')
      console.log('   3. Crear el usuario si no existe')
      return
    }
    
    console.log('✅ Autenticado como:', authData.user.email)
    console.log('👤 User ID:', authData.user.id)
    
    // 2. Obtener el cliente de TiendaSTS
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('id, name, user_id')
      .ilike('name', '%tienda%')
    
    if (clientsError) {
      console.log('❌ Error al obtener clientes:', clientsError.message)
      return
    }
    
    if (!clients || clients.length === 0) {
      console.log('❌ No se encontraron clientes de TiendaSTS')
      return
    }
    
    const tiendaClient = clients[0]
    console.log(`📋 Cliente encontrado: ${tiendaClient.name} (ID: ${tiendaClient.id})`)
    
    // 3. Crear credenciales para TiendaSTS
    const credentials = [
      {
        client_id: tiendaClient.id,
        user_id: authData.user.id, // Usar el ID del usuario autenticado
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
        client_id: tiendaClient.id,
        user_id: authData.user.id,
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
        client_id: tiendaClient.id,
        user_id: authData.user.id,
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
        client_id: tiendaClient.id,
        user_id: authData.user.id,
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
        client_id: tiendaClient.id,
        user_id: authData.user.id,
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
    
    console.log('\n➕ Creando credenciales para TiendaSTS...')
    
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
    
    // 4. Verificar credenciales creadas
    const { data: allCredentials } = await supabase
      .from('api_credentials')
      .select('id, provider, credential_name, is_active, usage_count')
      .order('created_at', { ascending: false })
    
    console.log('\n📊 Credenciales de TiendaSTS:')
    if (allCredentials && allCredentials.length > 0) {
      allCredentials.forEach(cred => {
        console.log(`   - ${cred.credential_name} (${cred.provider}) - ${cred.usage_count} usos`)
      })
    } else {
      console.log('   ⚠️  No hay credenciales')
    }
    
    console.log('\n🎉 ¡Configuración completada!')
    console.log('💡 Usuario: tiendastsgt@gmail.com')
    console.log('💡 Contraseña: tiendasts2025')
    console.log('💡 Ve a http://localhost:5173/credentials para ver las credenciales')
    
  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

setupTiendaSTSCredentials()
