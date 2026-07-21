const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function checkInfographics() {
  console.log('🔍 Verificando infografías en la base de datos...');
  
  try {
    // Verificar si la tabla existe
    const { data: tables, error: tableError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'infographics');
    
    if (tableError) {
      console.log('❌ Error al verificar tabla:', tableError.message);
      return;
    }
    
    if (tables.length === 0) {
      console.log('❌ La tabla infographics no existe');
      return;
    }
    
    console.log('✅ Tabla infographics existe');
    
    // Contar infografías
    const { count, error: countError } = await supabase
      .from('infographics')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.log('❌ Error al contar infografías:', countError.message);
      return;
    }
    
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
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

checkInfographics();




