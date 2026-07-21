#!/usr/bin/env node

/**
 * Script para crear más credenciales de prueba
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yitczogktdykcwjnejrt.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔧 Creando más credenciales de prueba...\n')

async function createMoreCredentials() {
  try {
    // Autenticarse
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'mypxtbfr@minimax.com',
      password: '7jujudSXex'
    })
    
    if (authError) {
      console.log('❌ Error de autenticación:', authError.message)
      return
    }
    
    console.log('✅ Autenticado como:', authData.user.email)
    
    // Obtener clientes
    const { data: clients } = await supabase
      .from('clients')
      .select('id, user_id')
      .limit(2)
    
    if (!clients || clients.length === 0) {
      console.log('❌ No hay clientes disponibles')
      return
    }
    
    // Crear credenciales para diferentes proveedores
    const credentials = [
      {
        client_id: clients[0].id,
        user_id: clients[0].user_id,
        provider: 'facebook',
        credential_name: 'Facebook Graph API Token',
        credential_type: 'oauth_token',
        encrypted_value: 'facebook-token-123456789',
        encryption_key_id: 'test-key',
        is_active: true,
        usage_count: 5,
        config: { permissions: ['pages_manage_posts', 'pages_read_engagement'] }
      },
      {
        client_id: clients[0].id,
        user_id: clients[0].user_id,
        provider: 'instagram',
        credential_name: 'Instagram Basic Display Token',
        credential_type: 'oauth_token',
        encrypted_value: 'instagram-token-123456789',
        encryption_key_id: 'test-key',
        is_active: true,
        usage_count: 3,
        config: { permissions: ['user_profile', 'user_media'] }
      },
      {
        client_id: clients[0].id,
        user_id: clients[0].user_id,
        provider: 'google',
        credential_name: 'Google Analytics 4 Key',
        credential_type: 'api_key',
        encrypted_value: 'google-analytics-key-123456789',
        encryption_key_id: 'test-key',
        is_active: true,
        usage_count: 12,
        config: { property_id: 'GA4-123456789' }
      },
      {
        client_id: clients[1]?.id || clients[0].id,
        user_id: clients[1]?.user_id || clients[0].user_id,
        provider: 'linkedin',
        credential_name: 'LinkedIn Marketing API',
        credential_type: 'oauth_token',
        encrypted_value: 'linkedin-token-123456789',
        encryption_key_id: 'test-key',
        is_active: true,
        usage_count: 8,
        config: { organization_id: '123456789' }
      },
      {
        client_id: clients[0].id,
        user_id: clients[0].user_id,
        provider: 'twitter',
        credential_name: 'Twitter API v2 Bearer Token',
        credential_type: 'oauth_token',
        encrypted_value: 'twitter-bearer-token-123456789',
        encryption_key_id: 'test-key',
        is_active: true,
        usage_count: 15,
        config: { api_version: 'v2' }
      }
    ]
    
    console.log('➕ Creando credenciales...')
    
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
    
    // Verificar todas las credenciales
    const { data: allCredentials } = await supabase
      .from('api_credentials')
      .select('id, provider, credential_name, is_active, usage_count')
      .order('created_at', { ascending: false })
    
    console.log('\n📊 Todas las credenciales:')
    if (allCredentials && allCredentials.length > 0) {
      allCredentials.forEach(cred => {
        console.log(`   - ${cred.credential_name} (${cred.provider}) - ${cred.usage_count} usos`)
      })
    }
    
    console.log('\n🎉 ¡Credenciales creadas exitosamente!')
    console.log('💡 Ve a http://localhost:5173/credentials para verlas')
    
  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

createMoreCredentials()
