const { createClient } = require('@supabase/supabase-js');

// Usar las credenciales directamente (las mismas que en el proyecto)
const supabase = createClient(
  'https://yitczogktdykcwjnejrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY'
);

async function checkTableStructure() {
  console.log('🔍 Verificando estructura de la tabla infographics...');
  
  try {
    // Intentar obtener una fila para ver la estructura
    const { data, error } = await supabase
      .from('infographics')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Error al acceder a la tabla:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Estructura de la tabla infographics:');
      console.log('📋 Columnas disponibles:');
      Object.keys(data[0]).forEach(column => {
        console.log(`  - ${column}: ${typeof data[0][column]}`);
      });
    } else {
      console.log('📭 La tabla está vacía, pero existe');
      console.log('💡 Vamos a intentar insertar con campos mínimos...');
      
      // Intentar insertar con campos mínimos
      const minimalInfographic = {
        user_id: '9f7772b5-46ab-4c33-9258-2393244db69f',
        title: 'Test Infographic',
        data: {
          title: 'Test Infographic',
          theme: { primaryColor: '#3B82F6' },
          sections: []
        },
        status: 'draft'
      };
      
      const { data: insertData, error: insertError } = await supabase
        .from('infographics')
        .insert(minimalInfographic)
        .select()
        .single();
      
      if (insertError) {
        console.log('❌ Error al insertar:', insertError.message);
      } else {
        console.log('✅ Inserción exitosa!');
        console.log('📋 Datos insertados:', insertData);
        
        // Eliminar el registro de prueba
        await supabase
          .from('infographics')
          .delete()
          .eq('id', insertData.id);
        console.log('🗑️ Registro de prueba eliminado');
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

checkTableStructure();




