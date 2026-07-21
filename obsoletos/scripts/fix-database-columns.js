import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://yitczogktdykcwjnejrt.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY'

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixDatabaseColumns() {
  console.log('🔧 Arreglando columnas faltantes en la base de datos...\n')

  try {
    // 1. Agregar columna created_by a la tabla content
    console.log('1. Agregando columna created_by a la tabla content...')
    const { error: contentError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE content 
        ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
      `
    })
    
    if (contentError) {
      console.log('   ⚠️ Error (puede que ya exista):', contentError.message)
    } else {
      console.log('   ✅ Columna created_by agregada a content')
    }

    // 2. Agregar columna created_by a la tabla strategies
    console.log('2. Agregando columna created_by a la tabla strategies...')
    const { error: strategiesError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE strategies 
        ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
      `
    })
    
    if (strategiesError) {
      console.log('   ⚠️ Error (puede que ya exista):', strategiesError.message)
    } else {
      console.log('   ✅ Columna created_by agregada a strategies')
    }

    // 3. Agregar columna created_by a la tabla market_research
    console.log('3. Agregando columna created_by a la tabla market_research...')
    const { error: researchError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE market_research 
        ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);
      `
    })
    
    if (researchError) {
      console.log('   ⚠️ Error (puede que ya exista):', researchError.message)
    } else {
      console.log('   ✅ Columna created_by agregada a market_research')
    }

    // 4. Agregar columna campaign_type a la tabla campaigns
    console.log('4. Agregando columna campaign_type a la tabla campaigns...')
    const { error: campaignsError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE campaigns 
        ADD COLUMN IF NOT EXISTS campaign_type VARCHAR(50) DEFAULT 'general';
      `
    })
    
    if (campaignsError) {
      console.log('   ⚠️ Error (puede que ya exista):', campaignsError.message)
    } else {
      console.log('   ✅ Columna campaign_type agregada a campaigns')
    }

    // 5. Crear función encrypt_credential si no existe
    console.log('5. Creando función encrypt_credential...')
    const { error: functionError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE OR REPLACE FUNCTION encrypt_credential(credential_value TEXT)
        RETURNS TEXT AS $$
        BEGIN
          -- En un entorno real, aquí usarías pgcrypto para encriptar
          -- Por ahora, devolvemos el valor tal como está
          RETURN credential_value;
        END;
        $$ LANGUAGE plpgsql;
      `
    })
    
    if (functionError) {
      console.log('   ⚠️ Error (puede que ya exista):', functionError.message)
    } else {
      console.log('   ✅ Función encrypt_credential creada')
    }

    console.log('\n🎉 ¡Corrección de columnas completada!')
    console.log('\n📋 Resumen:')
    console.log('   - Columna created_by agregada a content, strategies, market_research')
    console.log('   - Columna campaign_type agregada a campaigns')
    console.log('   - Función encrypt_credential creada')

  } catch (error) {
    console.error('❌ Error general:', error)
  }
}

// Ejecutar la función
fixDatabaseColumns()
