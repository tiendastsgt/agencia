import { createClient } from '@supabase/supabase-js'

// Por ahora usamos valores de ejemplo - el usuario debe configurar las variables de entorno
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://tu-proyecto.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'tu_clave_anonima'

console.log('⚠️  NOTA: Usando valores de ejemplo para Supabase.')
console.log('   Para usar la base de datos real, configure las variables de entorno:')
console.log('   VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY')

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupYouTubeProvider() {
  try {
    console.log('🔍 Verificando si YouTube ya está configurado...')
    
    // Verificar si YouTube ya existe
    const { data: existingProvider, error: checkError } = await supabase
      .from('api_providers')
      .select('*')
      .eq('id', 'youtube')
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError
    }

    if (existingProvider) {
      console.log('✅ YouTube ya está configurado en la base de datos')
      return
    }

    console.log('📝 Agregando YouTube a los proveedores de API...')

    const youtubeProvider = {
      id: 'youtube',
      name: 'youtube',
      display_name: 'YouTube Analytics',
      description: 'YouTube Analytics API para obtener métricas de canales y videos',
      auth_type: 'oauth2',
      base_url: 'https://www.googleapis.com/youtube/v3',
      documentation_url: 'https://developers.google.com/youtube/analytics',
      validation_endpoint: 'https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true',
      rate_limit_per_minute: 100,
      rate_limit_per_hour: 10000,
      rate_limit_per_day: 1000000,
      is_active: true,
      is_available: true
    }

    const { data, error } = await supabase
      .from('api_providers')
      .insert([youtubeProvider])

    if (error) {
      throw error
    }

    console.log('✅ YouTube Analytics API agregado exitosamente a los proveedores')
    console.log('📋 Detalles del proveedor:')
    console.log(`   - ID: ${youtubeProvider.id}`)
    console.log(`   - Nombre: ${youtubeProvider.display_name}`)
    console.log(`   - Tipo de Auth: ${youtubeProvider.auth_type}`)
    console.log(`   - URL Base: ${youtubeProvider.base_url}`)
    console.log(`   - Límite por minuto: ${youtubeProvider.rate_limit_per_minute}`)

  } catch (error) {
    console.error('❌ Error configurando YouTube:', error.message)
    process.exit(1)
  }
}

// Ejecutar el script
setupYouTubeProvider()
