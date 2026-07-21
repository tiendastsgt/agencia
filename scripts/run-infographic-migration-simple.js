#!/usr/bin/env node

/**
 * Script simple para ejecutar la migración de infografías
 * Fecha: 15 de Septiembre, 2025
 * Versión: 2.4.0
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function runInfographicMigration() {
  console.log('🎨 Ejecutando migración del sistema de infografías...')
  console.log('📅 Fecha:', new Date().toISOString())
  console.log('')

  try {
    // Leer el archivo de migración
    const migrationPath = join(__dirname, '..', 'database_migrations', '007_infographic_system.sql')
    const migrationSQL = readFileSync(migrationPath, 'utf8')
    
    console.log('📖 Archivo de migración leído correctamente')
    console.log(`📏 Tamaño: ${(migrationSQL.length / 1024).toFixed(2)} KB`)
    console.log('')

    // Mostrar las tablas que se van a crear
    console.log('📋 Tablas que se van a crear:')
    console.log('   • infographics - Para almacenar infografías generadas')
    console.log('   • infographic_templates - Para templates predefinidos')
    console.log('')

    // Mostrar políticas RLS
    console.log('🔒 Políticas de seguridad (RLS):')
    console.log('   • Usuarios autenticados pueden ver sus propias infografías')
    console.log('   • Usuarios autenticados pueden crear infografías')
    console.log('   • Usuarios autenticados pueden actualizar sus infografías')
    console.log('   • Usuarios autenticados pueden eliminar sus infografías')
    console.log('   • Todos pueden ver templates públicos')
    console.log('')

    // Mostrar templates predefinidos
    console.log('📚 Templates predefinidos que se insertarán:')
    console.log('   • Marketing Analytics Dashboard')
    console.log('   • Social Media Performance')
    console.log('   • Business Performance Report')
    console.log('')

    console.log('🚀 INSTRUCCIONES PARA EJECUTAR LA MIGRACIÓN:')
    console.log('')
    console.log('1. Ve al SQL Editor de Supabase:')
    console.log('   https://supabase.com/dashboard/project/[tu-proyecto]/sql')
    console.log('')
    console.log('2. Copia y pega el siguiente SQL:')
    console.log('─'.repeat(80))
    console.log(migrationSQL)
    console.log('─'.repeat(80))
    console.log('')
    console.log('3. Ejecuta el SQL en Supabase')
    console.log('')
    console.log('4. Verifica que las tablas se crearon correctamente:')
    console.log('   - infographics')
    console.log('   - infographic_templates')
    console.log('')
    console.log('5. Verifica que los templates se insertaron:')
    console.log('   SELECT COUNT(*) FROM infographic_templates;')
    console.log('')
    console.log('✅ Una vez ejecutada la migración, el sistema de infografías funcionará correctamente!')

  } catch (error) {
    console.error('❌ Error durante la migración:', error.message)
    console.error('')
    console.error('🔧 Soluciones posibles:')
    console.error('   1. Verificar que el archivo de migración existe')
    console.error('   2. Verificar permisos de lectura del archivo')
    console.error('   3. Verificar que el archivo SQL es válido')
    process.exit(1)
  }
}

// Ejecutar migración
runInfographicMigration()
  .then(() => {
    console.log('')
    console.log('✨ Script de migración completado exitosamente')
    console.log('📋 Recuerda ejecutar el SQL en Supabase para completar la migración')
    process.exit(0)
  })
  .catch((error) => {
    console.error('')
    console.error('💥 Script de migración falló:', error.message)
    process.exit(1)
  })




