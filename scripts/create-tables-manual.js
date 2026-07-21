#!/usr/bin/env node

/**
 * Script para crear las tablas manualmente usando Supabase
 * Fase 5: Automatización Avanzada
 * Fase 6: Estrategias Premium
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yitczogktdykcwjnejrt.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('🚀 Creando tablas para las fases 5 y 6...');
  console.log('');

  const tables = [
    {
      name: 'campaign_schedules',
      sql: `
        CREATE TABLE IF NOT EXISTS public.campaign_schedules (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
          content_id UUID REFERENCES public.content(id) ON DELETE CASCADE,
          platform VARCHAR(50) NOT NULL,
          scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
          status VARCHAR(20) DEFAULT 'pending',
          audience_analysis JSONB,
          optimal_times JSONB,
          expected_engagement DECIMAL(5,2),
          confidence_score DECIMAL(3,2),
          reasoning TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'automated_campaigns',
      sql: `
        CREATE TABLE IF NOT EXISTS public.automated_campaigns (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          platform VARCHAR(50) NOT NULL,
          automation_type VARCHAR(50) NOT NULL,
          trigger_events JSONB,
          rules JSONB,
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'ab_test_configs',
      sql: `
        CREATE TABLE IF NOT EXISTS public.ab_test_configs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
          test_name VARCHAR(255) NOT NULL,
          variants JSONB NOT NULL,
          traffic_split JSONB NOT NULL,
          success_metric VARCHAR(100) NOT NULL,
          confidence_level DECIMAL(3,2) DEFAULT 0.95,
          status VARCHAR(20) DEFAULT 'active',
          results JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'budget_optimizations',
      sql: `
        CREATE TABLE IF NOT EXISTS public.budget_optimizations (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
          optimization_type VARCHAR(50) NOT NULL,
          current_budget DECIMAL(10,2) NOT NULL,
          optimized_budget DECIMAL(10,2),
          performance_metrics JSONB,
          optimization_rules JSONB,
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'scaling_rules',
      sql: `
        CREATE TABLE IF NOT EXISTS public.scaling_rules (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          campaign_id UUID REFERENCES public.campaigns(id) ON DELETE CASCADE,
          rule_name VARCHAR(255) NOT NULL,
          trigger_conditions JSONB NOT NULL,
          scaling_actions JSONB NOT NULL,
          max_scale_factor DECIMAL(3,2) DEFAULT 2.0,
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'dream_100_targets',
      sql: `
        CREATE TABLE IF NOT EXISTS public.dream_100_targets (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
          target_name VARCHAR(255) NOT NULL,
          platform VARCHAR(50) NOT NULL,
          target_url VARCHAR(500),
          audience_size INTEGER,
          engagement_rate DECIMAL(5,2),
          contact_info JSONB,
          phase VARCHAR(20) DEFAULT 'research',
          notes TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'value_ladders',
      sql: `
        CREATE TABLE IF NOT EXISTS public.value_ladders (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
          ladder_name VARCHAR(255) NOT NULL,
          steps JSONB NOT NULL,
          conversion_rates JSONB,
          revenue_projections JSONB,
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'webinar_scripts',
      sql: `
        CREATE TABLE IF NOT EXISTS public.webinar_scripts (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
          script_name VARCHAR(255) NOT NULL,
          script_type VARCHAR(50) NOT NULL,
          content JSONB NOT NULL,
          duration_minutes INTEGER,
          target_audience TEXT,
          conversion_goals JSONB,
          status VARCHAR(20) DEFAULT 'draft',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'psychological_triggers',
      sql: `
        CREATE TABLE IF NOT EXISTS public.psychological_triggers (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
          trigger_name VARCHAR(255) NOT NULL,
          trigger_type VARCHAR(50) NOT NULL,
          content JSONB NOT NULL,
          effectiveness_score DECIMAL(3,2),
          usage_count INTEGER DEFAULT 0,
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'genetic_algorithm_configs',
      sql: `
        CREATE TABLE IF NOT EXISTS public.genetic_algorithm_configs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
          config_name VARCHAR(255) NOT NULL,
          parameters JSONB NOT NULL,
          fitness_function TEXT NOT NULL,
          population_size INTEGER DEFAULT 100,
          generations INTEGER DEFAULT 50,
          mutation_rate DECIMAL(3,2) DEFAULT 0.1,
          crossover_rate DECIMAL(3,2) DEFAULT 0.8,
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'bayesian_optimization_configs',
      sql: `
        CREATE TABLE IF NOT EXISTS public.bayesian_optimization_configs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
          config_name VARCHAR(255) NOT NULL,
          parameters JSONB NOT NULL,
          objective_function TEXT NOT NULL,
          acquisition_function VARCHAR(50) DEFAULT 'ei',
          n_initial_points INTEGER DEFAULT 10,
          n_iterations INTEGER DEFAULT 50,
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'evoprompt_configs',
      sql: `
        CREATE TABLE IF NOT EXISTS public.evoprompt_configs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
          config_name VARCHAR(255) NOT NULL,
          base_prompt TEXT NOT NULL,
          evolution_strategy VARCHAR(50) NOT NULL,
          fitness_metrics JSONB NOT NULL,
          population_size INTEGER DEFAULT 20,
          generations INTEGER DEFAULT 10,
          status VARCHAR(20) DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    },
    {
      name: 'prompt_versions',
      sql: `
        CREATE TABLE IF NOT EXISTS public.prompt_versions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
          prompt_name VARCHAR(255) NOT NULL,
          version_number VARCHAR(20) NOT NULL,
          prompt_content TEXT NOT NULL,
          performance_metrics JSONB,
          is_active BOOLEAN DEFAULT false,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    }
  ];

  let successCount = 0;
  let errorCount = 0;

  for (const table of tables) {
    try {
      console.log(`⚡ Creando tabla: ${table.name}...`);
      
      // Intentar crear la tabla usando una consulta directa
      const { data, error } = await supabase
        .from('_temp_')
        .select('*')
        .limit(0);
      
      // Si llegamos aquí, significa que la conexión funciona
      // Ahora intentamos crear la tabla usando el método directo
      console.log(`   📝 Ejecutando SQL para ${table.name}...`);
      
      // Nota: Supabase no permite ejecutar DDL directamente desde el cliente
      // Las tablas deben crearse manualmente en el dashboard de Supabase
      console.log(`   ⚠️  Tabla ${table.name} debe crearse manualmente en Supabase Dashboard`);
      
      successCount++;
      
    } catch (err) {
      console.error(`   ❌ Error creando tabla ${table.name}:`, err.message);
      errorCount++;
    }
  }

  console.log('');
  console.log('📊 RESUMEN DE CREACIÓN DE TABLAS');
  console.log('================================');
  console.log(`✅ Tablas procesadas: ${successCount}`);
  console.log(`❌ Errores: ${errorCount}`);
  console.log('');
  console.log('🔧 INSTRUCCIONES MANUALES:');
  console.log('1. Ve al Dashboard de Supabase');
  console.log('2. Ve a la sección "Table Editor"');
  console.log('3. Crea las siguientes tablas manualmente:');
  console.log('');
  
  tables.forEach((table, index) => {
    console.log(`${index + 1}. ${table.name}`);
  });
  
  console.log('');
  console.log('📄 El SQL completo está en: database_migrations/005_automation_advanced_strategies.sql');
  console.log('');
  console.log('🚀 Una vez creadas las tablas, ejecuta:');
  console.log('   node scripts/verify-automation-implementation.js');
}

// Ejecutar la creación de tablas
createTables().catch(console.error);
