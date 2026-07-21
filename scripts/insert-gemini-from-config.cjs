/**
 * Script para insertar credenciales de Gemini desde config/api-keys.ts
 */

const { createClient } = require('@supabase/supabase-js');

// Configuración de Supabase
const supabase = createClient(
  'https://yitczogktdykcwjnejrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY'
);

async function insertGeminiFromConfig() {
  console.log('🔑 Insertando credenciales de Gemini desde config/api-keys.ts...\n');

  try {
    // Leer el archivo de configuración
    const fs = require('fs');
    const path = require('path');
    
    const configPath = path.join(__dirname, '../config/api-keys.ts');
    
    if (!fs.existsSync(configPath)) {
      console.log('❌ No se encontró el archivo config/api-keys.ts');
      console.log('💡 Crea el archivo con tu API key de Gemini');
      return;
    }

    const configContent = fs.readFileSync(configPath, 'utf8');
    
    // Extraer la API key de Gemini usando regex
    const geminiMatch = configContent.match(/GOOGLE_AI_API_KEY:\s*['"`]([^'"`]+)['"`]/);
    
    if (!geminiMatch) {
      console.log('❌ No se encontró GOOGLE_AI_API_KEY en config/api-keys.ts');
      console.log('💡 Asegúrate de que el archivo tenga la estructura correcta');
      return;
    }

    const geminiApiKey = geminiMatch[1];
    
    if (geminiApiKey === 'your-google-ai-api-key-here') {
      console.log('❌ La API key de Gemini no está configurada');
      console.log('💡 Reemplaza "your-google-ai-api-key-here" con tu API key real en config/api-keys.ts');
      return;
    }

    console.log('✅ API key de Gemini encontrada en config/api-keys.ts');
    console.log(`🔑 Key: ${geminiApiKey.substring(0, 10)}...${geminiApiKey.substring(geminiApiKey.length - 4)}`);

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
      
      // Preguntar si quiere actualizar
      console.log('\n🔄 Actualizando credenciales existentes...');
      
      const { data: updated, error: updateError } = await supabase
        .from('api_credentials')
        .update({
          encrypted_value: geminiApiKey,
          config: {
            model: 'gemini-2.5-flash-image',
            style: 'photographic',
            safety_filter: true,
            max_tokens: 4096
          },
          updated_at: new Date().toISOString()
        })
        .eq('provider', 'gemini_image')
        .eq('is_active', true)
        .select()
        .single();

      if (updateError) {
        console.log('❌ Error actualizando credenciales:', updateError.message);
        return;
      }

      console.log('✅ Credenciales de Gemini actualizadas correctamente');
      console.log(`📋 ID: ${updated.id}`);
      return;
    }

    // Insertar nuevas credenciales
    const credentialData = {
      provider: 'gemini_image',
      credential_name: 'Google Gemini Image Generation API',
      credential_type: 'api_key',
      encrypted_value: geminiApiKey,
      encryption_key_id: 'config_file',
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
insertGeminiFromConfig();




