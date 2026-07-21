#!/usr/bin/env node

/**
 * Script para verificar y arreglar políticas RLS
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yitczogktdykcwjnejrt.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY'

const supabase = createClient(supabaseUrl, supabaseKey)

console.log('🔧 Verificando políticas RLS...\n')

async function checkRLSPolicies() {
  try {
    // 1. Verificar si RLS está habilitado en api_credentials
    const { data: rlsStatus, error: rlsError } = await supabase
      .rpc('check_rls_status', { table_name: 'api_credentials' })
    
    if (rlsError) {
      console.log('⚠️  No se puede verificar RLS directamente')
    } else {
      console.log('📊 Estado RLS:', rlsStatus)
    }
    
    // 2. Intentar autenticarse con el usuario de prueba
    console.log('\n🔐 Intentando autenticación...')
    
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'mypxtbfr@minimax.com',
      password: '7jujudSXex'
    })
    
    if (authError) {
      console.log('❌ Error de autenticación:', authError.message)
      console.log('💡 Intentando con credenciales alternativas...')
      
      // Intentar con el usuario tiendastsgt@gmail.com si existe
      const { data: authData2, error: authError2 } = await supabase.auth.signInWithPassword({
        email: 'tiendastsgt@gmail.com',
        password: 'password123'
      })
      
      if (authError2) {
        console.log('❌ Error con tiendastsgt@gmail.com:', authError2.message)
        console.log('\n📋 SOLUCIÓN:')
        console.log('1. Ve a http://localhost:5173/login')
        console.log('2. Usa las credenciales: mypxtbfr@minimax.com / 7jujudSXex')
        console.log('3. O crea un nuevo usuario en Supabase')
        return
      } else {
        console.log('✅ Autenticado como:', authData2.user.email)
      }
    } else {
      console.log('✅ Autenticado como:', authData.user.email)
    }
    
    // 3. Intentar crear una credencial de prueba con usuario autenticado
    console.log('\n➕ Intentando crear credencial de prueba...')
    
    const { data: clients } = await supabase
      .from('clients')
      .select('id, user_id')
      .limit(1)
    
    if (clients && clients.length > 0) {
      const testCredential = {
        client_id: clients[0].id,
        user_id: clients[0].user_id,
        provider: 'openai',
        credential_name: 'OpenAI Test Key',
        credential_type: 'api_key',
        encrypted_value: 'sk-test-key-123456789',
        encryption_key_id: 'test-key',
        is_active: true,
        usage_count: 0,
        config: {}
      }
      
      const { data, error } = await supabase
        .from('api_credentials')
        .insert(testCredential)
        .select()
      
      if (error) {
        console.log('❌ Error al crear credencial:', error.message)
        console.log('🔍 Detalles del error:', error)
      } else {
        console.log('✅ Credencial creada exitosamente:', data[0].credential_name)
      }
    }
    
    // 4. Verificar credenciales existentes
    const { data: credentials, error: credError } = await supabase
      .from('api_credentials')
      .select('id, provider, credential_name, is_active')
    
    if (credError) {
      console.log('❌ Error al obtener credenciales:', credError.message)
    } else {
      console.log('\n📊 Credenciales existentes:')
      if (credentials && credentials.length > 0) {
        credentials.forEach(cred => {
          console.log(`   - ${cred.credential_name} (${cred.provider})`)
        })
      } else {
        console.log('   ⚠️  No hay credenciales')
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

checkRLSPolicies()
