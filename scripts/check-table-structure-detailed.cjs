const { createClient } = require('@supabase/supabase-js');

// Usar las credenciales directamente (las mismas que en el proyecto)
const supabase = createClient(
  'https://yitczogktdykcwjnejrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY'
);

async function checkTableStructureDetailed() {
  console.log('🔍 Verificando estructura detallada de la tabla infographics...');
  
  try {
    // Intentar insertar con campos mínimos para ver qué campos acepta
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
    
    console.log('📋 Intentando insertar con campos mínimos...');
    const { data: insertData, error: insertError } = await supabase
      .from('infographics')
      .insert(minimalInfographic)
      .select()
      .single();
    
    if (insertError) {
      console.log('❌ Error al insertar:', insertError.message);
      console.log('💡 Esto nos dice qué campos NO existen en la tabla');
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
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

checkTableStructureDetailed();




