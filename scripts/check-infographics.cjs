const { createClient } = require('@supabase/supabase-js');

// Usar las credenciales directamente (las mismas que en el proyecto)
const supabase = createClient(
  'https://yitczogktdykcwjnejrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY'
);

async function checkInfographics() {
  console.log('🔍 Verificando infografías en la base de datos...');
  
  try {
    // Intentar contar infografías directamente
    const { count, error: countError } = await supabase
      .from('infographics')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('❌ Error al acceder a la tabla infographics:', countError.message);
      console.log('💡 Esto puede significar que la tabla no existe o no tienes permisos');
      return;
    }
    
    console.log('✅ Tabla infographics accesible');
    console.log(`📊 Total de infografías: ${count}`);
    
    // Listar infografías
    const { data: infographics, error: listError } = await supabase
      .from('infographics')
      .select('id, title, created_at, status')
      .limit(5);
    
    if (listError) {
      console.log('❌ Error al listar infografías:', listError.message);
      return;
    }
    
    if (infographics && infographics.length > 0) {
      console.log('📋 Infografías encontradas:');
      infographics.forEach(inf => {
        console.log(`  - ${inf.title} (ID: ${inf.id}, Status: ${inf.status})`);
      });
    } else {
      console.log('📭 No hay infografías en la base de datos');
    }
    
    // Verificar templates
    console.log('\n🔍 Verificando templates de infografías...');
    const { data: templates, error: templateError } = await supabase
      .from('infographic_templates')
      .select('id, name, category')
      .limit(3);
    
    if (templateError) {
      console.log('❌ Error al acceder a templates:', templateError.message);
    } else {
      console.log(`✅ Templates disponibles: ${templates.length}`);
      if (templates.length > 0) {
        templates.forEach(template => {
          console.log(`  - ${template.name} (${template.category})`);
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

checkInfographics();
