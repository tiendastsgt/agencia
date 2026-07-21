import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yitczogktdykcwjnejrt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkAndFixDatabase() {
  console.log('🔍 Verificando estado de la base de datos...\n')

  try {
    // Verificar si las tablas existen y tienen las columnas necesarias
    console.log('1. Verificando tabla content...')
    const { data: contentData, error: contentError } = await supabase
      .from('content')
      .select('*')
      .limit(1)
    
    if (contentError) {
      console.log('   ❌ Error al acceder a content:', contentError.message)
    } else {
      console.log('   ✅ Tabla content accesible')
    }

    console.log('2. Verificando tabla strategies...')
    const { data: strategiesData, error: strategiesError } = await supabase
      .from('strategies')
      .select('*')
      .limit(1)
    
    if (strategiesError) {
      console.log('   ❌ Error al acceder a strategies:', strategiesError.message)
    } else {
      console.log('   ✅ Tabla strategies accesible')
    }

    console.log('3. Verificando tabla market_research...')
    const { data: researchData, error: researchError } = await supabase
      .from('market_research')
      .select('*')
      .limit(1)
    
    if (researchError) {
      console.log('   ❌ Error al acceder a market_research:', researchError.message)
    } else {
      console.log('   ✅ Tabla market_research accesible')
    }

    console.log('4. Verificando tabla campaigns...')
    const { data: campaignsData, error: campaignsError } = await supabase
      .from('campaigns')
      .select('*')
      .limit(1)
    
    if (campaignsError) {
      console.log('   ❌ Error al acceder a campaigns:', campaignsError.message)
    } else {
      console.log('   ✅ Tabla campaigns accesible')
    }

    console.log('5. Verificando tabla api_credentials...')
    const { data: credentialsData, error: credentialsError } = await supabase
      .from('api_credentials')
      .select('*')
      .limit(1)
    
    if (credentialsError) {
      console.log('   ❌ Error al acceder a api_credentials:', credentialsError.message)
    } else {
      console.log('   ✅ Tabla api_credentials accesible')
    }

    console.log('\n📋 INSTRUCCIONES:')
    console.log('Para arreglar las columnas faltantes, ejecuta el archivo SQL_FIX_DATABASE_COLUMNS.sql')
    console.log('en el SQL Editor de Supabase:')
    console.log('1. Ve a https://supabase.com/dashboard')
    console.log('2. Selecciona tu proyecto')
    console.log('3. Ve a SQL Editor')
    console.log('4. Copia y pega el contenido de SQL_FIX_DATABASE_COLUMNS.sql')
    console.log('5. Ejecuta el script')

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar la función
checkAndFixDatabase()
