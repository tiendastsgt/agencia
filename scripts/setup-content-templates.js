// Script para configurar el sistema de plantillas de contenido
// Ejecuta las migraciones y carga los datos iniciales

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupContentTemplates() {
  try {
    console.log('🚀 Configurando sistema de plantillas de contenido...')
    
    // 1. Crear función exec_sql si no existe
    console.log('📝 Creando función exec_sql...')
    const execSQLFunction = `
      CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
      RETURNS TEXT
      LANGUAGE plpgsql
      SECURITY DEFINER
      AS $$
      DECLARE
          result TEXT;
      BEGIN
          EXECUTE sql;
          RETURN 'SQL executed successfully';
      EXCEPTION
          WHEN OTHERS THEN
              RETURN 'Error: ' || SQLERRM;
      END;
      $$;
      
      GRANT EXECUTE ON FUNCTION exec_sql(TEXT) TO authenticated;
    `
    
    const { error: functionError } = await supabase.rpc('exec_sql', { sql: execSQLFunction })
    if (functionError) {
      console.log('⚠️  Función exec_sql ya existe o error:', functionError.message)
    } else {
      console.log('✅ Función exec_sql creada')
    }
    
    // 2. Crear tabla content_templates
    console.log('📊 Creando tabla content_templates...')
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS content_templates (
          id VARCHAR(255) PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          framework VARCHAR(100) NOT NULL,
          hook_type VARCHAR(100) NOT NULL,
          visual_elements JSONB NOT NULL,
          psychological_triggers TEXT[] NOT NULL,
          target_audience VARCHAR(100) NOT NULL,
          platforms TEXT[] NOT NULL,
          variables JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          created_by VARCHAR(255),
          is_active BOOLEAN DEFAULT true,
          usage_count INTEGER DEFAULT 0,
          performance_score DECIMAL(3,2) DEFAULT 0.0
      );
    `
    
    const { error: tableError } = await supabase.rpc('exec_sql', { sql: createTableSQL })
    if (tableError) {
      console.log('⚠️  Tabla content_templates ya existe o error:', tableError.message)
    } else {
      console.log('✅ Tabla content_templates creada')
    }
    
    // 3. Crear índices
    console.log('🔍 Creando índices...')
    const createIndexesSQL = `
      CREATE INDEX IF NOT EXISTS idx_content_templates_framework ON content_templates(framework);
      CREATE INDEX IF NOT EXISTS idx_content_templates_audience ON content_templates(target_audience);
      CREATE INDEX IF NOT EXISTS idx_content_templates_platforms ON content_templates USING GIN(platforms);
      CREATE INDEX IF NOT EXISTS idx_content_templates_active ON content_templates(is_active);
      CREATE INDEX IF NOT EXISTS idx_content_templates_performance ON content_templates(performance_score DESC);
    `
    
    const { error: indexError } = await supabase.rpc('exec_sql', { sql: createIndexesSQL })
    if (indexError) {
      console.log('⚠️  Error creando índices:', indexError.message)
    } else {
      console.log('✅ Índices creados')
    }
    
    // 4. Insertar templates por defecto
    console.log('📋 Insertando plantillas por defecto...')
    const templates = [
      {
        id: 'd100-insider-access',
        name: 'Insider Access Hook',
        framework: 'Dream 100',
        hook_type: 'Insider Access',
        visual_elements: {
          opening_frame: {
            text_overlay: 'Los {NUMBER} secretos que {AUTHORITY} no quiere que sepas',
            background: 'behind_scenes_footage',
            duration: '2-3 segundos',
            effects: ['zoom_in', 'text_reveal_animation']
          },
          authority_proof: {
            element: 'screenshot_social_proof',
            content: 'Capturas de pantalla de interacciones con figuras de autoridad',
            duration: '1-2 segundos'
          },
          revelation_moment: {
            text: 'Aquí está el secreto número {X} que cambió todo para mí',
            visual: 'dramatic_reveal_animation',
            duration: '3-4 segundos'
          }
        },
        psychological_triggers: ['curiosity_gap', 'authority_proof', 'exclusivity'],
        target_audience: 'Ambitious Professionals',
        platforms: ['LinkedIn', 'Instagram', 'TikTok'],
        variables: {
          NUMBER: ['3', '5', '7', '10'],
          AUTHORITY: ['expertos de la industria', 'gurús del marketing', 'líderes empresariales'],
          X: ['1', '2', '3', '4', '5']
        },
        created_by: 'system'
      },
      {
        id: 'hso-problem-agitation',
        name: 'Problem Agitation Hook',
        framework: 'Hook-Story-Offer',
        hook_type: 'Problem Agitation',
        visual_elements: {
          opening_frame: {
            text_overlay: '¿Te ha pasado que {PROBLEM}?',
            background: 'relatable_problem_scenario',
            duration: '3-4 segundos',
            effects: ['emotional_color_grading', 'close_up_shots']
          }
        },
        psychological_triggers: ['problem_agitation', 'relatability', 'solution_seeking'],
        target_audience: 'Problem Solvers',
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        variables: {
          PROBLEM: [
            'trabajas 12 horas y no ves resultados',
            'tienes mil ideas pero no sabes por dónde empezar',
            'quieres crecer pero no tienes tiempo'
          ]
        },
        created_by: 'system'
      },
      {
        id: 'attractive-character',
        name: 'Attractive Character Hook',
        framework: 'Attractive Character',
        hook_type: 'Authority Positioning',
        visual_elements: {
          opening_frame: {
            text_overlay: 'Soy {CHARACTER_TYPE} y esto es lo que aprendí sobre {TOPIC}',
            background: 'professional_authority_setting',
            duration: '2-3 segundos',
            effects: ['confidence_animation', 'authority_visuals']
          },
          credibility_moment: {
            text: 'Después de {EXPERIENCE} años en {INDUSTRY}',
            visual: 'timeline_achievements',
            duration: '2-3 segundos'
          }
        },
        psychological_triggers: ['authority', 'credibility', 'expertise'],
        target_audience: 'Knowledge Seekers',
        platforms: ['LinkedIn', 'YouTube', 'Instagram'],
        variables: {
          CHARACTER_TYPE: ['experto', 'consultor', 'mentor', 'líder'],
          TOPIC: ['éxito', 'crecimiento', 'innovación', 'liderazgo'],
          EXPERIENCE: ['5', '10', '15', '20'],
          INDUSTRY: ['marketing', 'tecnología', 'negocios', 'ventas']
        },
        created_by: 'system'
      }
    ]
    
    for (const template of templates) {
      const { error: insertError } = await supabase
        .from('content_templates')
        .upsert(template, { onConflict: 'id' })
      
      if (insertError) {
        console.log(`⚠️  Error insertando template ${template.id}:`, insertError.message)
      } else {
        console.log(`✅ Template ${template.name} insertado`)
      }
    }
    
    // 5. Crear tablas de tracking
    console.log('📈 Creando tablas de tracking...')
    const createTrackingTablesSQL = `
      CREATE TABLE IF NOT EXISTS template_performance (
          id SERIAL PRIMARY KEY,
          template_id VARCHAR(255) REFERENCES content_templates(id),
          platform VARCHAR(50) NOT NULL,
          engagement_rate DECIMAL(5,2),
          click_through_rate DECIMAL(5,2),
          conversion_rate DECIMAL(5,2),
          reach INTEGER,
          impressions INTEGER,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          campaign_id VARCHAR(255),
          user_id VARCHAR(255)
      );
      
      CREATE TABLE IF NOT EXISTS api_usage_tracking (
          id SERIAL PRIMARY KEY,
          api_name VARCHAR(100) NOT NULL,
          template_id VARCHAR(255) REFERENCES content_templates(id),
          cost DECIMAL(10,4),
          response_time_ms INTEGER,
          success BOOLEAN DEFAULT true,
          error_message TEXT,
          generated_content_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          user_id VARCHAR(255)
      );
    `
    
    const { error: trackingError } = await supabase.rpc('exec_sql', { sql: createTrackingTablesSQL })
    if (trackingError) {
      console.log('⚠️  Error creando tablas de tracking:', trackingError.message)
    } else {
      console.log('✅ Tablas de tracking creadas')
    }
    
    // 6. Verificar instalación
    console.log('🔍 Verificando instalación...')
    const { data: templates, error: verifyError } = await supabase
      .from('content_templates')
      .select('id, name, framework')
      .eq('is_active', true)
    
    if (verifyError) {
      console.log('❌ Error verificando instalación:', verifyError.message)
      return false
    }
    
    console.log(`✅ Sistema configurado exitosamente`)
    console.log(`📊 ${templates.length} plantillas disponibles:`)
    templates.forEach(template => {
      console.log(`   - ${template.name} (${template.framework})`)
    })
    
    return true
    
  } catch (error) {
    console.error('❌ Error configurando sistema:', error)
    return false
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  setupContentTemplates().then(success => {
    if (success) {
      console.log('🎉 Sistema de plantillas configurado exitosamente')
      process.exit(0)
    } else {
      console.log('💥 Error configurando el sistema')
      process.exit(1)
    }
  })
}

export { setupContentTemplates }












