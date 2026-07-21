#!/usr/bin/env node

/**
 * Script manual para ejecutar la migración de funcionalidades de redes sociales y IA
 * MarketPro GT v2.2.0
 * 
 * Este script ejecuta la migración directamente en Supabase SQL Editor
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function runMigrationManual() {
  try {
    console.log('🚀 Preparando migración manual de funcionalidades de redes sociales y IA...')
    
    // Leer el archivo SQL
    const migrationPath = join(__dirname, '..', 'database_migrations', '006_social_media_ai_features.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf8')
    
    console.log('📄 Archivo de migración cargado:', migrationPath)
    console.log('')
    console.log('='.repeat(80))
    console.log('📋 INSTRUCCIONES PARA EJECUTAR LA MIGRACIÓN:')
    console.log('='.repeat(80))
    console.log('')
    console.log('1. Ve a tu proyecto de Supabase')
    console.log('2. Navega a "SQL Editor" en el menú lateral')
    console.log('3. Crea una nueva consulta')
    console.log('4. Copia y pega el siguiente SQL:')
    console.log('')
    console.log('─'.repeat(80))
    console.log(migrationSQL)
    console.log('─'.repeat(80))
    console.log('')
    console.log('5. Haz clic en "Run" para ejecutar la migración')
    console.log('6. Verifica que no haya errores en la consola')
    console.log('')
    console.log('✅ La migración creará las siguientes tablas:')
    console.log('   • sentiment_analysis - Análisis de sentimientos')
    console.log('   • generated_images - Imágenes generadas con IA')
    console.log('   • social_media_posts - Posts en redes sociales')
    console.log('   • trending_topics - Temas trending')
    console.log('   • custom_reports - Reportes personalizados')
    console.log('   • custom_dashboards - Dashboards personalizables')
    console.log('   • intelligent_alerts - Alertas inteligentes')
    console.log('   • social_media_metrics - Métricas de redes sociales')
    console.log('   • competitor_analysis - Análisis de competencia')
    console.log('   • trend_predictions - Predicciones de tendencias')
    console.log('')
    console.log('🔒 Todas las tablas incluyen:')
    console.log('   • Row Level Security (RLS) habilitado')
    console.log('   • Políticas de acceso por usuario')
    console.log('   • Índices optimizados')
    console.log('   • Triggers automáticos')
    console.log('')
    console.log('⚠️  IMPORTANTE:')
    console.log('   • Esta migración es segura y no afecta datos existentes')
    console.log('   • Se pueden ejecutar múltiples veces sin problemas')
    console.log('   • Las tablas se crean solo si no existen')
    console.log('')
    console.log('🎉 Una vez completada la migración, las nuevas funcionalidades estarán disponibles!')
    console.log('')
    console.log('='.repeat(80))
    
  } catch (error) {
    console.error('💥 Error preparando la migración:', error)
    process.exit(1)
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigrationManual()
}

export { runMigrationManual }
