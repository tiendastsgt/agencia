const { createClient } = require('@supabase/supabase-js');

// Usar las credenciales directamente (las mismas que en el proyecto)
const supabase = createClient(
  'https://yitczogktdykcwjnejrt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY'
);

async function createTestInfographic() {
  console.log('🎨 Creando infografía de prueba...');
  
  try {
    // Obtener el usuario actual (simulamos el ID del usuario tiendastsgt@gmail.com)
    // En un caso real, esto se haría con autenticación
    const testUserId = '9f7772b5-46ab-4c33-9258-2393244db69f'; // ID del cliente TiendaSTS
    
    const testInfographic = {
      user_id: testUserId,
      client_id: testUserId,
      title: 'Infografía de Prueba - Marketing Digital',
      subtitle: 'Métricas y resultados Q3 2025',
      description: 'Infografía de prueba creada para demostrar el sistema',
      data: {
        title: 'Infografía de Prueba - Marketing Digital',
        subtitle: 'Métricas y resultados Q3 2025',
        description: 'Infografía de prueba creada para demostrar el sistema',
        theme: {
          name: 'Marketing Blue',
          primaryColor: '#3B82F6',
          secondaryColor: '#1E40AF',
          backgroundColor: '#FFFFFF',
          textColor: '#1F2937',
          accentColor: '#F59E0B',
          fontFamily: 'Inter',
          style: 'modern'
        },
        layout: {
          type: 'vertical',
          columns: 1,
          sections: 3,
          spacing: 'normal'
        },
        sections: [
          {
            id: 'header',
            type: 'header',
            title: 'Marketing Digital Q3 2025',
            content: {
              text: {
                content: 'Resultados destacados del tercer trimestre',
                format: 'paragraph'
              }
            }
          },
          {
            id: 'stats',
            type: 'stats',
            title: 'Métricas Principales',
            content: {
              stats: {
                items: [
                  { label: 'Conversiones', value: '15.2', unit: '%' },
                  { label: 'CTR', value: '3.8', unit: '%' },
                  { label: 'ROAS', value: '4.2', unit: 'x' }
                ],
                layout: 'horizontal'
              }
            }
          },
          {
            id: 'insights',
            type: 'list',
            title: 'Insights Clave',
            content: {
              list: {
                items: [
                  { text: 'Aumento del 22% en conversiones' },
                  { text: 'Mejor rendimiento en móviles' },
                  { text: 'Facebook Ads liderando ROI' }
                ],
                type: 'checkmark'
              }
            }
          }
        ],
        metadata: {
          author: 'MarketPro GT',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ['marketing', 'analytics', 'q3-2025'],
          category: 'marketing',
          language: 'es',
          version: '1.0.0'
        },
        style: {
          borderRadius: 8,
          shadow: true,
          border: false,
          backgroundPattern: 'none'
        }
      },
      generated_images: [],
      status: 'completed'
    };

    const { data, error } = await supabase
      .from('infographics')
      .insert(testInfographic)
      .select()
      .single();

    if (error) {
      console.log('❌ Error al crear infografía:', error.message);
      return;
    }

    console.log('✅ Infografía de prueba creada exitosamente!');
    console.log(`📋 ID: ${data.id}`);
    console.log(`📝 Título: ${data.title}`);
    console.log(`📊 Status: ${data.status}`);
    console.log(`📅 Creada: ${data.created_at}`);
    
    console.log('\n🎯 Ahora puedes:');
    console.log('1. Ir a http://localhost:5174/infographics');
    console.log('2. Hacer clic en la pestaña "Mis Infografías"');
    console.log('3. Ver la infografía de prueba creada');
    
  } catch (error) {
    console.error('❌ Error general:', error.message);
  }
}

createTestInfographic();
