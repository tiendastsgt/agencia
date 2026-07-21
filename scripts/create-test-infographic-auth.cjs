const { createClient } = require('@supabase/supabase-js');

// Usar las credenciales directamente (las mismas que en el proyecto)
const supabase = createClient(
  'https://yitczogktdykcwjnejrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY'
);

async function createTestInfographicWithAuth() {
  console.log('🔐 Autenticando y creando infografía de prueba...');
  
  try {
    // Intentar autenticarse con el usuario tiendastsgt@gmail.com
    // Nota: En un entorno real, esto se haría con las credenciales del usuario
    console.log('⚠️ Nota: Este script requiere autenticación de usuario');
    console.log('💡 Para crear infografías, usa la interfaz web en:');
    console.log('   http://localhost:5174/infographics');
    console.log('');
    console.log('🎯 Pasos para crear una infografía:');
    console.log('1. Ve a http://localhost:5174/infographics');
    console.log('2. Haz clic en la pestaña "Crear Nueva"');
    console.log('3. Completa los datos básicos (título, descripción)');
    console.log('4. Agrega secciones usando los botones');
    console.log('5. Haz clic en "Generar Infografía"');
    console.log('6. Ve a la pestaña "Mis Infografías" para ver el resultado');
    console.log('');
    console.log('📚 También puedes usar la pestaña "Infografías de Cursos":');
    console.log('1. Ve a la pestaña "Infografías de Cursos"');
    console.log('2. Carga archivos JSON de cursos (ejemplos en mejoras/jsons/)');
    console.log('3. Haz clic en "Convertir a Infografías"');
    console.log('4. Selecciona un proveedor de IA (Gemini recomendado)');
    console.log('5. Haz clic en "Generar Imágenes"');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

createTestInfographicWithAuth();




