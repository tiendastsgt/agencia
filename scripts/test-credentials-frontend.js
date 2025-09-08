import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Faltan variables de entorno SUPABASE_URL o SUPABASE_ANON_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testCredentialsSaving() {
  console.log('🧪 PRUEBA CRÍTICA: Verificación de guardado de credenciales API')
  console.log('='.repeat(60))
  
  try {
    // 1. Intentar autenticar con el usuario autorizado
    console.log('\n1️⃣ Autenticando usuario autorizado...')
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'hatch.guate@gmail.com',
      password: 'testpassword123' // Contraseña de prueba
    })
    
    if (authError) {
      console.log('ℹ️ No se pudo autenticar con contraseña de prueba (normal si no está configurada)')
      console.log('📝 Continuando prueba con función directa...')
    } else {
      console.log('✅ Usuario autenticado correctamente')
    }
    
    // 2. Obtener cliente de TiendaSTS para la prueba
    console.log('\n2️⃣ Obteniendo cliente de prueba...')
    const { data: clients, error: clientsError } = await supabase
      .from('clients')
      .select('*')
      .eq('name', 'TiendaSTS.com')
      .limit(1)
    
    if (clientsError) {
      throw new Error(`Error obteniendo cliente: ${clientsError.message}`)
    }
    
    if (!clients || clients.length === 0) {
      throw new Error('No se encontró el cliente TiendaSTS.com')
    }
    
    const client = clients[0]
    console.log(`✅ Cliente encontrado: ${client.name} (ID: ${client.id})`)
    
    // 3. Preparar credenciales de prueba
    const testCredentials = {
      twitter: {
        bearer_token: 'test_bearer_token_12345',
        username: 'tiendasts'
      },
      meta: {
        access_token: 'test_meta_access_token_67890',
        page_id: '123456789'
      }
    }
    
    // 4. Probar guardado de credenciales para cada plataforma
    for (const [platform, credentials] of Object.entries(testCredentials)) {
      console.log(`\n3️⃣ Probando guardado para ${platform.toUpperCase()}...`)
      
      try {
        // Obtener sesión actual
        const { data: { session } } = await supabase.auth.getSession()
        
        const { data, error } = await supabase.functions.invoke('manage-api-credentials', {
          body: {
            action: 'set',
            client_id: client.id,
            platform,
            credentials
          },
          headers: {
            Authorization: session?.access_token ? `Bearer ${session.access_token}` : undefined,
            'Content-Type': 'application/json'
          }
        })
        
        if (error) {
          console.error(`❌ Error guardando ${platform}:`, error)
          continue
        }
        
        if (data?.data) {
          console.log(`✅ ${platform.toUpperCase()}: Credenciales guardadas exitosamente`)
          console.log(`   ID: ${data.data.id}`)
        } else {
          console.error(`⚠️ ${platform.toUpperCase()}: Respuesta vacía del servidor`)
        }
        
      } catch (err) {
        console.error(`❌ Error en ${platform}:`, err.message)
      }
    }
    
    // 5. Verificar que las credenciales se guardaron en la base de datos
    console.log('\n4️⃣ Verificando datos en base de datos...')
    const { data: savedCreds, error: queryError } = await supabase
      .from('client_api_credentials')
      .select('*')
      .eq('client_id', client.id)
      .order('created_at', { ascending: false })
    
    if (queryError) {
      throw new Error(`Error consultando credenciales: ${queryError.message}`)
    }
    
    if (savedCreds && savedCreds.length > 0) {
      console.log(`✅ Se encontraron ${savedCreds.length} registros de credenciales:`)
      savedCreds.forEach(cred => {
        console.log(`   - ${cred.platform}: ${cred.is_active ? 'ACTIVO' : 'INACTIVO'} (${cred.created_at})`)
      })
    } else {
      console.log('⚠️ No se encontraron credenciales guardadas')
    }
    
    // 6. Probar función de carga de credenciales
    console.log('\n5️⃣ Probando carga de credenciales...')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      const { data, error } = await supabase.functions.invoke('manage-api-credentials', {
        body: {
          action: 'get',
          client_id: client.id
        },
        headers: {
          Authorization: session?.access_token ? `Bearer ${session.access_token}` : undefined,
          'Content-Type': 'application/json'
        }
      })
      
      if (error) {
        console.error('❌ Error cargando credenciales:', error)
      } else if (data?.data) {
        console.log(`✅ Se cargaron ${data.data.length} credenciales desde la API`)
      } else {
        console.log('⚠️ No se cargaron credenciales desde la API')
      }
    } catch (err) {
      console.error('❌ Error probando carga:', err.message)
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('✅ PRUEBA COMPLETADA: Verificación de guardado de credenciales')
    console.log('📝 El usuario debe probar manualmente en: https://8ljexpkb6y0q.space.minimax.io')
    console.log('='.repeat(60))
    
  } catch (error) {
    console.error('\n❌ ERROR CRÍTICO EN LA PRUEBA:')
    console.error(error.message)
    console.error('\nStack trace:', error.stack)
    process.exit(1)
  }
}

// Ejecutar la prueba
testCredentialsSaving().then(() => {
  console.log('\n🎯 Prueba finalizada')
  process.exit(0)
}).catch(error => {
  console.error('\n💥 Error fatal:', error)
  process.exit(1)
})
