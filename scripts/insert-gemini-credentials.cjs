/**
 * Script para insertar credenciales de Gemini en la base de datos
 * Usa la variable de entorno GEMINI_API_KEY
 */

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabase = createClient(
  'https://yitczogktdykcwjnejrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY'
);

async function insertGeminiCredentials() {
  console.log('🔑 Insertando credenciales de Gemini en la base de datos...\n');

  try {
    // Verificar si ya existen credenciales de Gemini
    const { data: existing, error: checkError } = await supabase
      .from('api_credentials')
      .select('id, provider, is_active')
      .eq('provider', 'gemini_image')
      .eq('is_active', true);

    if (checkError) {
      console.log('❌ Error verificando credenciales existentes:', checkError.message);
      return;
    }

    if (existing && existing.length > 0) {
      console.log('⚠️  Ya existen credenciales activas de Gemini en la base de datos');
      console.log('📋 Credenciales existentes:');
      existing.forEach(cred => {
        console.log(`  - ID: ${cred.id}, Provider: ${cred.provider}, Activa: ${cred.is_active}`);
      });
      console.log('\n💡 Si quieres actualizar las credenciales, primero desactiva las existentes');
      return;
    }

    // Obtener API key de variable de entorno
    const geminiApiKey = process.env.GEMINI_API_KEY;
    
    if (!geminiApiKey) {
      console.log('❌ No se encontró la variable de entorno GEMINI_API_KEY');
      console.log('💡 Configura la variable de entorno con tu API key de Gemini:');
      console.log('   export GEMINI_API_KEY="tu_api_key_aqui"');
      console.log('   o en Windows: set GEMINI_API_KEY=tu_api_key_aqui');
      return;
    }

    console.log('✅ API key de Gemini encontrada en variables de entorno');
    console.log(`🔑 Key: ${geminiApiKey.substring(0, 10)}...${geminiApiKey.substring(geminiApiKey.length - 4)}`);

    // Insertar credenciales en la base de datos
    const credentialData = {
      provider: 'gemini_image',
      credential_name: 'Google Gemini Image Generation API',
      credential_type: 'api_key',
      encrypted_value: geminiApiKey, // En producción, esto debería estar encriptado
      encryption_key_id: 'env_var', // Indicador de que viene de variable de entorno
      is_active: true,
      config: {
        model: 'gemini-2.5-flash-image',
        style: 'photographic',
        safety_filter: true,
        max_tokens: 4096
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('api_credentials')
      .insert(credentialData)
      .select()
      .single();

    if (error) {
      console.log('❌ Error insertando credenciales:', error.message);
      return;
    }

    console.log('✅ Credenciales de Gemini insertadas correctamente');
    console.log(`📋 ID: ${data.id}`);
    console.log(`🏷️  Provider: ${data.provider}`);
    console.log(`📝 Nombre: ${data.credential_name}`);
    console.log(`🔧 Config: ${JSON.stringify(data.config, null, 2)}`);

    // Verificar que se pueden obtener las credenciales
    console.log('\n🔍 Verificando que las credenciales se pueden obtener...');
    
    const { data: retrieved, error: retrieveError } = await supabase
      .from('api_credentials')
      .select('encrypted_value, config')
      .eq('provider', 'gemini_image')
      .eq('is_active', true)
      .single();

    if (retrieveError) {
      console.log('❌ Error obteniendo credenciales:', retrieveError.message);
    } else {
      console.log('✅ Credenciales obtenidas correctamente');
      console.log(`🔑 API Key: ${retrieved.encrypted_value.substring(0, 10)}...${retrieved.encrypted_value.substring(retrieved.encrypted_value.length - 4)}`);
      console.log(`⚙️  Config: ${JSON.stringify(retrieved.config, null, 2)}`);
    }

    console.log('\n🎉 ¡Credenciales de Gemini configuradas correctamente!');
    console.log('🚀 Ahora puedes usar el sistema de infografías con Gemini');

  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

// Ejecutar el script
insertGeminiCredentials();




