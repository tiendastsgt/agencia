#!/usr/bin/env node

/**
 * Script para crear solo las tablas faltantes
 * 7 tablas restantes de las 13 totales
 */

import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://yitczogktdykcwjnejrt.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createMissingTables() {
  console.log('🚀 Creando las 7 tablas faltantes...');
  console.log('');

  const missingTables = [
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
    }
  ];

  console.log('📋 Tablas faltantes a crear:');
  missingTables.forEach((table, index) => {
    console.log(`   ${index + 1}. ${table.name}`);
  });
  console.log('');

  console.log('🔧 INSTRUCCIONES:');
  console.log('1. Ve al Dashboard de Supabase');
  console.log('2. Ve a "SQL Editor"');
  console.log('3. Copia y pega el SQL de cada tabla:');
  console.log('');

  missingTables.forEach((table, index) => {
    console.log(`--- TABLA ${index + 1}: ${table.name.toUpperCase()} ---`);
    console.log(table.sql);
    console.log('');
  });

  console.log('4. Ejecuta cada comando SQL');
  console.log('5. Verifica con: node scripts/verify-automation-implementation.js');
  console.log('');
  console.log('🎯 Una vez completado, tendrás 13/13 tablas (100%)');
}

// Ejecutar
createMissingTables().catch(console.error);
