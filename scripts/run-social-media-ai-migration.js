#!/usr/bin/env node

/**
 * Script para ejecutar la migración de funcionalidades de redes sociales y IA
 * MarketPro GT v2.2.0
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key'

if (!supabaseServiceKey || supabaseServiceKey === 'your-service-role-key') {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY no está configurado')
  console.log('Por favor configura la variable de entorno SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigration() {
  try {
    console.log('🚀 Iniciando migración de funcionalidades de redes sociales y IA...')
    
    // Leer el archivo SQL
    const migrationPath = join(__dirname, '..', 'database_migrations', '006_social_media_ai_features.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf8')
    
    console.log('📄 Archivo de migración cargado:', migrationPath)
    
    // Ejecutar la migración
    console.log('⚡ Ejecutando migración...')
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (error) {
      console.error('❌ Error ejecutando migración:', error)
      throw error
    }
    
    console.log('✅ Migración ejecutada exitosamente')
    console.log('📊 Resultado:', data)
    
    // Verificar que las tablas se crearon correctamente
    console.log('🔍 Verificando tablas creadas...')
    
    const tablesToCheck = [
      'sentiment_analysis',
      'generated_images', 
      'social_media_posts',
      'trending_topics',
      'custom_reports',
      'custom_dashboards',
      'intelligent_alerts',
      'social_media_metrics',
      'competitor_analysis',
      'trend_predictions'
    ]
    
    for (const tableName of tablesToCheck) {
      const { data: tableData, error: tableError } = await supabase
        .from(tableName)
        .select('*')
        .limit(1)
      
      if (tableError) {
        console.error(`❌ Error verificando tabla ${tableName}:`, tableError.message)
      } else {
        console.log(`✅ Tabla ${tableName} creada correctamente`)
      }
    }
    
    console.log('🎉 Migración completada exitosamente!')
    console.log('📋 Funcionalidades implementadas:')
    console.log('   • Análisis de sentimientos')
    console.log('   • Generación de imágenes con IA')
    console.log('   • Gestión de redes sociales')
    console.log('   • Trending topics')
    console.log('   • Reportes personalizados')
    console.log('   • Dashboards personalizables')
    console.log('   • Alertas inteligentes')
    console.log('   • Métricas de redes sociales')
    console.log('   • Análisis de competencia')
    console.log('   • Predicciones de tendencias')
    
  } catch (error) {
    console.error('💥 Error durante la migración:', error)
    process.exit(1)
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration()
}

export { runMigration }
