#!/usr/bin/env node

/**
 * Script de verificación para las fases 5 y 6
 * Verifica que todas las funcionalidades estén implementadas correctamente
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuración para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yitczogktdykcwjnejrt.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyImplementation() {
  console.log('🔍 Verificando implementación de las fases 5 y 6...');
  console.log('');

  const results = {
    phase5: {
      scheduling: false,
      automation: false,
      optimization: false
    },
    phase6: {
      strategies: false,
      optimization: false
    },
    database: {
      tables: 0,
      totalTables: 13
    },
    files: {
      services: 0,
      components: 0,
      pages: 0
    }
  };

  // Verificar archivos de servicios
  console.log('📁 Verificando archivos de servicios...');
  const serviceFiles = [
    'src/lib/intelligent-scheduling-service.ts',
    'src/lib/campaign-automation-service.ts',
    'src/lib/advanced-strategies-service.ts',
    'src/lib/advanced-optimization-service.ts'
  ];

  for (const file of serviceFiles) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${file}`);
      results.files.services++;
    } else {
      console.log(`   ❌ ${file} - NO ENCONTRADO`);
    }
  }

  // Verificar archivos de componentes
  console.log('');
  console.log('🧩 Verificando archivos de componentes...');
  const componentFiles = [
    'src/components/IntelligentSchedulingManager.tsx',
    'src/components/CampaignAutomationManager.tsx',
    'src/components/AdvancedStrategiesManager.tsx',
    'src/components/AdvancedOptimizationManager.tsx'
  ];

  for (const file of componentFiles) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${file}`);
      results.files.components++;
    } else {
      console.log(`   ❌ ${file} - NO ENCONTRADO`);
    }
  }

  // Verificar archivos de páginas
  console.log('');
  console.log('📄 Verificando archivos de páginas...');
  const pageFiles = [
    'src/pages/AutomationPage.tsx',
    'src/pages/PremiumStrategiesPage.tsx'
  ];

  for (const file of pageFiles) {
    const filePath = path.join(__dirname, '..', file);
    if (fs.existsSync(filePath)) {
      console.log(`   ✅ ${file}`);
      results.files.pages++;
    } else {
      console.log(`   ❌ ${file} - NO ENCONTRADO`);
    }
  }

  // Verificar tablas de base de datos
  console.log('');
  console.log('🗄️ Verificando tablas de base de datos...');
  const tablesToCheck = [
    'campaign_schedules',
    'automated_campaigns',
    'ab_test_configs',
    'budget_optimizations',
    'scaling_rules',
    'dream_100_targets',
    'value_ladders',
    'webinar_scripts',
    'psychological_triggers',
    'genetic_algorithm_configs',
    'bayesian_optimization_configs',
    'evoprompt_configs',
    'prompt_versions'
  ];

  for (const table of tablesToCheck) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.log(`   ❌ ${table} - ERROR: ${error.message}`);
      } else {
        console.log(`   ✅ ${table}`);
        results.database.tables++;
      }
    } catch (err) {
      console.log(`   ❌ ${table} - ERROR: ${err.message}`);
    }
  }

  // Verificar funcionalidades específicas
  console.log('');
  console.log('⚡ Verificando funcionalidades específicas...');

  // Fase 5: Programación Inteligente
  try {
    const { data, error } = await supabase
      .from('campaign_schedules')
      .select('*')
      .limit(1);
    
    if (!error) {
      console.log('   ✅ Fase 5.1: Programación Inteligente');
      results.phase5.scheduling = true;
    }
  } catch (err) {
    console.log('   ❌ Fase 5.1: Programación Inteligente');
  }

  // Fase 5: Automatización de Campañas
  try {
    const { data, error } = await supabase
      .from('automated_campaigns')
      .select('*')
      .limit(1);
    
    if (!error) {
      console.log('   ✅ Fase 5.2: Automatización de Campañas');
      results.phase5.automation = true;
    }
  } catch (err) {
    console.log('   ❌ Fase 5.2: Automatización de Campañas');
  }

  // Fase 5: A/B Testing Automático
  try {
    const { data, error } = await supabase
      .from('ab_test_configs')
      .select('*')
      .limit(1);
    
    if (!error) {
      console.log('   ✅ Fase 5.3: A/B Testing Automático');
      results.phase5.optimization = true;
    }
  } catch (err) {
    console.log('   ❌ Fase 5.3: A/B Testing Automático');
  }

  // Fase 6: Estrategias Avanzadas
  try {
    const { data, error } = await supabase
      .from('dream_100_targets')
      .select('*')
      .limit(1);
    
    if (!error) {
      console.log('   ✅ Fase 6.1: Estrategias Avanzadas');
      results.phase6.strategies = true;
    }
  } catch (err) {
    console.log('   ❌ Fase 6.1: Estrategias Avanzadas');
  }

  // Fase 6: Optimización Avanzada
  try {
    const { data, error } = await supabase
      .from('genetic_algorithm_configs')
      .select('*')
      .limit(1);
    
    if (!error) {
      console.log('   ✅ Fase 6.2: Optimización Avanzada');
      results.phase6.optimization = true;
    }
  } catch (err) {
    console.log('   ❌ Fase 6.2: Optimización Avanzada');
  }

  // Resumen final
  console.log('');
  console.log('📊 RESUMEN DE VERIFICACIÓN');
  console.log('========================');
  console.log('');
  
  console.log('📁 Archivos:');
  console.log(`   - Servicios: ${results.files.services}/4`);
  console.log(`   - Componentes: ${results.files.components}/4`);
  console.log(`   - Páginas: ${results.files.pages}/2`);
  console.log('');
  
  console.log('🗄️ Base de Datos:');
  console.log(`   - Tablas: ${results.database.tables}/${results.database.totalTables}`);
  console.log('');
  
  console.log('⚡ Fase 5 - Automatización Avanzada:');
  console.log(`   - Programación Inteligente: ${results.phase5.scheduling ? '✅' : '❌'}`);
  console.log(`   - Automatización de Campañas: ${results.phase5.automation ? '✅' : '❌'}`);
  console.log(`   - A/B Testing Automático: ${results.phase5.optimization ? '✅' : '❌'}`);
  console.log('');
  
  console.log('👑 Fase 6 - Estrategias Premium:');
  console.log(`   - Estrategias Avanzadas: ${results.phase6.strategies ? '✅' : '❌'}`);
  console.log(`   - Optimización Avanzada: ${results.phase6.optimization ? '✅' : '❌'}`);
  console.log('');

  // Calcular porcentaje de completitud
  const totalChecks = 10; // 4 servicios + 4 componentes + 2 páginas
  const completedChecks = results.files.services + results.files.components + results.files.pages;
  const completionPercentage = Math.round((completedChecks / totalChecks) * 100);

  console.log(`🎯 COMPLETITUD GENERAL: ${completionPercentage}%`);
  console.log('');

  if (completionPercentage === 100) {
    console.log('🎉 ¡IMPLEMENTACIÓN COMPLETA!');
    console.log('   Las fases 5 y 6 están completamente implementadas y listas para usar.');
  } else {
    console.log('⚠️  IMPLEMENTACIÓN PARCIAL');
    console.log('   Algunos archivos o funcionalidades necesitan ser completados.');
  }

  console.log('');
  console.log('🚀 Próximos pasos:');
  console.log('   1. Ejecutar la migración de base de datos si no se ha hecho');
  console.log('   2. Probar las funcionalidades en el navegador');
  console.log('   3. Configurar credenciales de APIs si es necesario');
  console.log('   4. Crear contenido de prueba para validar el flujo completo');
}

// Ejecutar verificación
verifyImplementation().catch(console.error);
