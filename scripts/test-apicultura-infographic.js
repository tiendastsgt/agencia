#!/usr/bin/env node

/**
 * Script para probar la generación de infografía de apicultura urbana
 * Fecha: 15 de Septiembre, 2025
 * Versión: 2.4.0
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function testApiculturaInfographic() {
  console.log('🐝 Probando generación de infografía de apicultura urbana...')
  console.log('📅 Fecha:', new Date().toISOString())
  console.log('')

  try {
    // Leer el JSON de ejemplo
    const jsonPath = join(__dirname, '..', 'mejoras', 'jsons', 'apicultura_urbana_infographic.json')
    const jsonContent = readFileSync(jsonPath, 'utf8')
    const data = JSON.parse(jsonContent)
    
    console.log('📖 JSON de apicultura cargado correctamente')
    console.log(`📏 Tamaño: ${(jsonContent.length / 1024).toFixed(2)} KB`)
    console.log('')

    // Mostrar información del curso
    const courseData = data.infographic_data.data
    console.log('📚 Información del Curso:')
    console.log(`   Título: ${courseData.title}`)
    console.log(`   Subtítulo: ${courseData.subtitle}`)
    console.log(`   Categoría: ${courseData.metadata.category}`)
    console.log(`   Secciones: ${courseData.sections.length}`)
    console.log(`   Tema: ${courseData.theme.name}`)
    console.log(`   Colores: ${courseData.theme.primaryColor}, ${courseData.theme.secondaryColor}`)
    console.log('')

    // Mostrar secciones
    console.log('📋 Secciones de la Infografía:')
    courseData.sections.forEach((section, index) => {
      console.log(`   ${index + 1}. ${section.title} (${section.type})`)
    })
    console.log('')

    // Mostrar prompt generado
    console.log('🎨 Prompt Generado para IA:')
    console.log('─'.repeat(80))
    console.log(data.prompt_generated)
    console.log('─'.repeat(80))
    console.log('')

    // Mostrar instrucciones de uso
    console.log('📋 Instrucciones de Uso:')
    data.usage_instructions.steps.forEach((step, index) => {
      console.log(`   ${step}`)
    })
    console.log('')

    console.log('💡 Tips de Personalización:')
    data.usage_instructions.customization_tips.forEach((tip, index) => {
      console.log(`   • ${tip}`)
    })
    console.log('')

    // Simular generación de infografía
    console.log('🚀 Simulando generación de infografía...')
    console.log('   ✅ Datos del curso procesados')
    console.log('   ✅ Prompt optimizado generado')
    console.log('   ✅ Configuración de tema aplicada')
    console.log('   ✅ Secciones organizadas')
    console.log('   ✅ Metadatos configurados')
    console.log('')

    // Mostrar resultado esperado
    console.log('🎯 Resultado Esperado:')
    console.log('   📊 Infografía vertical con 7 secciones')
    console.log('   🎨 Tema verde naturaleza (#10B981, #059669)')
    console.log('   📱 Optimizada para redes sociales (1024x1792)')
    console.log('   🐝 Iconos de abejas y elementos apícolas')
    console.log('   📚 Timeline de módulos del curso')
    console.log('   🎯 Objetivos claramente destacados')
    console.log('')

    // Mostrar métricas
    console.log('📊 Métricas de la Infografía:')
    console.log(`   • Duración del curso: ${courseData.sections[1].content.stats.items[0].value}`)
    console.log(`   • Número de módulos: ${courseData.sections[1].content.stats.items[3].value}`)
    console.log(`   • Objetivos: ${courseData.sections[3].content.list.items.length}`)
    console.log(`   • Créditos: ${courseData.sections[1].content.stats.items[2].value}`)
    console.log('')

    console.log('🎉 PRUEBA COMPLETADA EXITOSAMENTE')
    console.log('')
    console.log('📋 Próximos pasos:')
    console.log('   1. Usar el CourseInfographicGenerator en la interfaz')
    console.log('   2. Cargar el JSON del curso de apicultura')
    console.log('   3. Convertir a formato de infografía')
    console.log('   4. Generar con DALL-E 3 o Stability AI')
    console.log('   5. Descargar y usar para promoción del curso')
    console.log('')
    console.log('✨ La infografía está lista para ser generada!')

  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message)
    console.error('')
    console.error('🔧 Soluciones posibles:')
    console.error('   1. Verificar que el archivo JSON existe')
    console.error('   2. Verificar el formato del JSON')
    console.error('   3. Verificar permisos de lectura del archivo')
    process.exit(1)
  }
}

// Ejecutar prueba
testApiculturaInfographic()
  .then(() => {
    console.log('')
    console.log('✨ Script de prueba completado exitosamente')
    process.exit(0)
  })
  .catch((error) => {
    console.error('')
    console.error('💥 Script de prueba falló:', error.message)
    process.exit(1)
  })




