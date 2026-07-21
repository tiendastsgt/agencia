/**
 * Script para probar la configuración
 * Ejecutar: node scripts/test-config.js
 */

import { configManager } from '../src/lib/config/index.js'

function testConfiguration() {
  console.log('🧪 Probando configuración del sistema...\n')
  
  try {
    const config = configManager.getConfig()
    
    console.log('✅ Configuración cargada exitosamente')
    console.log('📊 Configuración de AI:')
    
    // Probar configuración de Gemini
    const geminiConfig = configManager.getAIConfig('gemini')
    console.log(`   🤖 Gemini: ${geminiConfig.apiKey ? '✅ Configurado' : '❌ No configurado'}`)
    
    // Probar configuración de DALL-E
    const dalleConfig = configManager.getAIConfig('dalle3')
    console.log(`   🎨 DALL-E 3: ${dalleConfig.apiKey ? '✅ Configurado' : '❌ No configurado'}`)
    
    // Probar configuración de Stability
    const stabilityConfig = configManager.getAIConfig('stability')
    console.log(`   ⚡ Stability AI: ${stabilityConfig.apiKey ? '✅ Configurado' : '❌ No configurado'}`)
    
    console.log('\n📋 Configuración de Infografías:')
    const infographicConfig = configManager.getInfographicConfig()
    console.log(`   📏 Tamaño por defecto: ${infographicConfig.defaultSize}`)
    console.log(`   🎯 Calidad por defecto: ${infographicConfig.defaultQuality}`)
    console.log(`   🔄 Fallback habilitado: ${infographicConfig.fallbackEnabled ? '✅' : '❌'}`)
    
    console.log('\n🎉 Configuración probada exitosamente!')
    
  } catch (error) {
    console.error('❌ Error probando configuración:', error.message)
    console.error('Stack:', error.stack)
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testConfiguration()
}

export { testConfiguration }




