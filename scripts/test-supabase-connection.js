import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yitczogktdykcwjnejrt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔍 Probando conexión con Supabase...')
  
  try {
    // Probar conexión básica
    const { data, error } = await supabase.from('clients').select('count').limit(1)
    
    if (error) {
      console.error('❌ Error de conexión:', error.message)
      return
    }
    
    console.log('✅ Conexión con Supabase exitosa')
    
    // Verificar si hay usuarios
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers()
    
    if (usersError) {
      console.log('⚠️ No se pueden listar usuarios (normal para anon key)')
    } else {
      console.log(`👥 Usuarios encontrados: ${users.users.length}`)
    }
    
    // Crear un usuario de prueba
    console.log('🔧 Creando usuario de prueba...')
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'test@marketpro.com',
      password: 'test123456',
      options: {
        data: {
          name: 'Usuario de Prueba'
        }
      }
    })
    
    if (signUpError) {
      console.log('⚠️ Error al crear usuario:', signUpError.message)
    } else {
      console.log('✅ Usuario de prueba creado:', signUpData.user?.email)
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message)
  }
}

testConnection()
