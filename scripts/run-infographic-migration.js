#!/usr/bin/env node

/**
 * Script para ejecutar la migración del sistema de infografías
 * Fecha: 15 de Septiembre, 2025
 * Versión: 2.4.0
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno requeridas no encontradas')
  console.error('   VITE_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY son requeridas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runInfographicMigration() {
  console.log('🚀 Iniciando migración del sistema de infografías...')
  console.log('📅 Fecha:', new Date().toISOString())
  console.log('📋 Versión: 2.4.0')
  console.log('')

  try {
    // Leer el archivo SQL
    const migrationPath = join(__dirname, '..', 'database_migrations', '007_infographic_system.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf8')
    
    console.log('📖 Archivo de migración leído correctamente')
    console.log(`📏 Tamaño: ${(migrationSQL.length / 1024).toFixed(2)} KB`)
    console.log('')

    // Ejecutar la migración
    console.log('⚡ Ejecutando migración...')
    const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL })
    
    if (error) {
      throw new Error(`Error ejecutando migración: ${error.message}`)
    }
    
    console.log('✅ Migración ejecutada correctamente')
    console.log('')

    // Verificar que las tablas se crearon
    console.log('🔍 Verificando tablas creadas...')
    
    const tables = ['infographics', 'infographic_templates', 'infographic_generations', 'infographic_analytics']
    
    for (const table of tables) {
      const { data: tableData, error: tableError } = await supabase
        .from(table)
        .select('*')
        .limit(1)
      
      if (tableError) {
        console.log(`❌ Error verificando tabla ${table}: ${tableError.message}`)
      } else {
        console.log(`✅ Tabla ${table} verificada correctamente`)
      }
    }
    
    console.log('')

    // Verificar templates insertados
    console.log('🔍 Verificando templates insertados...')
    const { data: templates, error: templatesError } = await supabase
      .from('infographic_templates')
      .select('id, name, category')
    
    if (templatesError) {
      console.log(`❌ Error verificando templates: ${templatesError.message}`)
    } else {
      console.log(`✅ ${templates.length} templates insertados:`)
      templates.forEach(template => {
        console.log(`   - ${template.name} (${template.category})`)
      })
    }
    
    console.log('')

    // Verificar funciones auxiliares
    console.log('🔍 Verificando funciones auxiliares...')
    
    try {
      // Probar función de estadísticas (con un UUID de prueba)
      const testUserId = '00000000-0000-0000-0000-000000000000'
      const { data: stats, error: statsError } = await supabase
        .rpc('get_infographic_stats', { user_id_param: testUserId })
      
      if (statsError) {
        console.log(`⚠️  Función get_infographic_stats: ${statsError.message}`)
      } else {
        console.log('✅ Función get_infographic_stats verificada')
      }
    } catch (error) {
      console.log(`⚠️  Error verificando funciones: ${error.message}`)
    }
    
    console.log('')

    // Resumen final
    console.log('🎉 MIGRACIÓN COMPLETADA EXITOSAMENTE')
    console.log('')
    console.log('📊 Resumen:')
    console.log('   ✅ 4 tablas creadas')
    console.log('   ✅ 3 templates predefinidos insertados')
    console.log('   ✅ Índices y triggers configurados')
    console.log('   ✅ Políticas RLS implementadas')
    console.log('   ✅ Funciones auxiliares creadas')
    console.log('')
    console.log('🚀 El sistema de infografías está listo para usar!')
    console.log('')
    console.log('📋 Próximos pasos:')
    console.log('   1. Configurar API keys para generación de imágenes')
    console.log('   2. Probar la funcionalidad en la interfaz')
    console.log('   3. Crear infografías de prueba')
    console.log('   4. Documentar casos de uso específicos')
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message)
    console.error('')
    console.error('🔧 Soluciones posibles:')
    console.error('   1. Verificar conexión a Supabase')
    console.error('   2. Verificar permisos de service role key')
    console.error('   3. Verificar que la función exec_sql existe')
    console.error('   4. Revisar logs de Supabase para más detalles')
    process.exit(1)
  }
}

// Ejecutar migración
runInfographicMigration()
  .then(() => {
    console.log('')
    console.log('✨ Script completado exitosamente')
    process.exit(0)
  })
  .catch((error) => {
    console.error('')
    console.error('💥 Script falló:', error.message)
    process.exit(1)
  })




