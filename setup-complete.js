#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('🚀 MarketPro GT - Configuración Completa\n');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupComplete() {
  try {
    console.log('📋 Configuración Completa de MarketPro GT\n');
    console.log('Este script te guiará a través de toda la configuración necesaria.\n');

    // 1. Verificar Supabase
    console.log('1️⃣ CONFIGURACIÓN DE SUPABASE\n');
    console.log('¿Ya tienes un proyecto de Supabase creado? (y/n)');
    const hasSupabase = await askQuestion('Respuesta: ');
    
    if (hasSupabase.toLowerCase() !== 'y') {
      console.log('\n📝 Pasos para crear proyecto Supabase:');
      console.log('1. Ve a https://supabase.com');
      console.log('2. Crea una cuenta o inicia sesión');
      console.log('3. Crea un nuevo proyecto:');
      console.log('   - Nombre: marketpro-gt');
      console.log('   - Región: us-east-1');
      console.log('   - Contraseña: genera una segura');
      console.log('4. Espera 2-3 minutos a que se complete\n');
      
      const continueSetup = await askQuestion('¿Continuar con la configuración? (y/n): ');
      if (continueSetup.toLowerCase() !== 'y') {
        console.log('❌ Configuración cancelada');
        rl.close();
        return;
      }
    }

    // 2. Obtener credenciales
    console.log('\n2️⃣ CREDENCIALES DE SUPABASE\n');
    console.log('Ve a Settings > API en tu proyecto de Supabase y copia:');
    
    const supabaseUrl = await askQuestion('Project URL: ');
    const supabaseKey = await askQuestion('anon public key: ');

    // 3. Configurar API keys
    console.log('\n3️⃣ CONFIGURACIÓN DE API KEYS\n');
    const openaiKey = await askQuestion('OpenAI API Key (opcional, presiona Enter para omitir): ');

    // 4. Actualizar configuración
    console.log('\n4️⃣ ACTUALIZANDO CONFIGURACIÓN\n');
    
    const apiConfigContent = `// Configuración de APIs para MarketPro GT
// Configurado automáticamente el ${new Date().toLocaleDateString()}

export const API_CONFIG = {
  // Supabase Configuration
  SUPABASE_URL: '${supabaseUrl}',
  SUPABASE_ANON_KEY: '${supabaseKey}',
  
  // OpenAI API Key (para generación de contenido)
  OPENAI_API_KEY: '${openaiKey || 'sk-your-openai-api-key-here'}',
  
  // Otras APIs (opcional)
  STABILITY_API_KEY: 'sk-your-stability-api-key-here',
  GOOGLE_AI_API_KEY: 'your-google-ai-api-key-here'
}

export default API_CONFIG`;

    fs.writeFileSync('config/api-keys.ts', apiConfigContent);
    console.log('✅ config/api-keys.ts actualizado');

    // 5. Crear archivo .env.local
    const envContent = `# MarketPro GT - Variables de Entorno
# Configurado automáticamente el ${new Date().toLocaleDateString()}

# Supabase Configuration
VITE_SUPABASE_URL=${supabaseUrl}
VITE_SUPABASE_ANON_KEY=${supabaseKey}

# OpenAI API Key (opcional)
VITE_OPENAI_API_KEY=${openaiKey || 'sk-your-openai-api-key-here'}

# Configuración de la aplicación
VITE_APP_NAME=MarketPro GT
VITE_APP_VERSION=1.0.0
VITE_APP_ENVIRONMENT=production`;

    fs.writeFileSync('.env.local', envContent);
    console.log('✅ .env.local creado');

    // 6. Crear script de configuración de Supabase
    const supabaseSetupScript = `#!/usr/bin/env node

// Script para configurar Supabase automáticamente
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = '${supabaseUrl}'
const supabaseKey = '${supabaseKey}'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupSupabase() {
  console.log('🗄️ Configurando Supabase...')
  
  try {
    // 1. Crear todas las tablas
    console.log('📊 Creando tablas...')
    
    const createTablesSQL = \`
-- Tablas Principales
CREATE TABLE IF NOT EXISTS clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  business_type VARCHAR(100),
  industry VARCHAR(100),
  target_audience TEXT,
  unique_value_proposition TEXT,
  country VARCHAR(100) DEFAULT 'Guatemala',
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  address TEXT,
  competitors TEXT[],
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS campaigns (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  campaign_type VARCHAR(100),
  status VARCHAR(50) DEFAULT 'draft',
  objective TEXT,
  target_audience JSONB,
  budget DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  russell_brunson_framework VARCHAR(100),
  value_ladder JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content_type VARCHAR(100),
  platform VARCHAR(100),
  hook TEXT,
  story TEXT,
  offer TEXT,
  content_body TEXT,
  media_urls JSONB,
  scheduled_for TIMESTAMP WITH TIME ZONE,
  status VARCHAR(50) DEFAULT 'draft',
  engagement_metrics JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  metric_type VARCHAR(100),
  metric_name VARCHAR(255),
  metric_value DECIMAL(15,4),
  metric_unit VARCHAR(50),
  platform VARCHAR(100),
  date_recorded DATE,
  additional_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS market_research (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  research_type VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  findings JSONB,
  market_size_data JSONB,
  competitor_analysis JSONB,
  target_audience_insights JSONB,
  trends_analysis JSONB,
  opportunity_assessment JSONB,
  threat_analysis JSONB,
  recommendations JSONB,
  status VARCHAR(50) DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS strategies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  strategy_type VARCHAR(100),
  framework_used VARCHAR(100),
  strategy_details JSONB,
  dream_100_list JSONB,
  value_ladder JSONB,
  webinar_script JSONB,
  traffic_temperature JSONB,
  psychological_triggers JSONB,
  expected_outcomes JSONB,
  implementation_steps JSONB,
  status VARCHAR(50) DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tablas Multi-Armed Bandit
CREATE TABLE IF NOT EXISTS mab_experiments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  experiment_type VARCHAR(50) CHECK (experiment_type IN ('content', 'campaign', 'strategy')),
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  arms JSONB NOT NULL,
  target_metric VARCHAR(50) CHECK (target_metric IN ('ctr', 'conversion', 'engagement')),
  total_traffic INTEGER DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mab_arm_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID REFERENCES mab_experiments(id) ON DELETE CASCADE,
  arm_id VARCHAR(255) NOT NULL,
  arm_name VARCHAR(255) NOT NULL,
  pulls INTEGER DEFAULT 0,
  rewards INTEGER DEFAULT 0,
  total_reward DECIMAL(15,4) DEFAULT 0,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mab_selections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID REFERENCES mab_experiments(id) ON DELETE CASCADE,
  arm_id VARCHAR(255) NOT NULL,
  context JSONB,
  algorithm VARCHAR(100),
  confidence DECIMAL(5,4),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mab_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID REFERENCES mab_experiments(id) ON DELETE CASCADE,
  arm_id VARCHAR(255) NOT NULL,
  reward DECIMAL(15,4) NOT NULL,
  context JSONB,
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tablas Reinforcement Learning
CREATE TABLE IF NOT EXISTS rl_experiments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  algorithm_type VARCHAR(50) CHECK (algorithm_type IN ('q-learning', 'policy-gradient')),
  reward_type VARCHAR(50) CHECK (reward_type IN ('exact_match', 'f1_score', 'perplexity', 'perplexity_f1', 'length_diff', 'engagement', 'conversion')),
  config JSONB,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID REFERENCES auth.users(id),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS rl_episodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID REFERENCES rl_experiments(id) ON DELETE CASCADE,
  episode_data JSONB,
  total_reward DECIMAL(15,4),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rl_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID REFERENCES rl_experiments(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES rl_episodes(id) ON DELETE CASCADE,
  reward_data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rl_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID REFERENCES rl_experiments(id) ON DELETE CASCADE,
  policy_data JSONB,
  performance_metrics JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla Prompt Rewrite
CREATE TABLE IF NOT EXISTS prompt_rewrite_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID REFERENCES rl_experiments(id) ON DELETE CASCADE,
  session_data JSONB,
  evaluation_history JSONB[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tablas de Plantillas de Contenido
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
  campaign_id UUID REFERENCES campaigns(id),
  user_id UUID REFERENCES auth.users(id)
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
  user_id UUID REFERENCES auth.users(id)
);
\`;

    // Ejecutar SQL
    const { error } = await supabase.rpc('exec_sql', { sql: createTablesSQL })
    
    if (error) {
      console.log('⚠️ Error creando tablas:', error.message)
      console.log('💡 Ejecuta manualmente el SQL en el editor de Supabase')
    } else {
      console.log('✅ Tablas creadas exitosamente')
    }

    // 2. Configurar RLS
    console.log('🔒 Configurando políticas RLS...')
    
    const rlsSQL = \`
-- Habilitar RLS
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_research ENABLE ROW LEVEL SECURITY;
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE mab_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE mab_arm_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE mab_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE mab_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE rl_experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE rl_episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rl_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE rl_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_rewrite_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_tracking ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "Users can manage own data" ON clients FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Users can manage own data" ON campaigns FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Users can manage own data" ON content FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Users can manage own data" ON analytics FOR ALL USING (true);
CREATE POLICY "Users can manage own data" ON market_research FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Users can manage own data" ON strategies FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Users can manage own data" ON mab_experiments FOR ALL USING (auth.uid() = created_by);
CREATE POLICY "Users can manage own data" ON mab_arm_performance FOR ALL USING (true);
CREATE POLICY "Users can manage own data" ON mab_selections FOR ALL USING (true);
CREATE POLICY "Users can manage own data" ON mab_rewards FOR ALL USING (true);
CREATE POLICY "Users can manage own data" ON rl_experiments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own data" ON rl_episodes FOR ALL USING (true);
CREATE POLICY "Users can manage own data" ON rl_rewards FOR ALL USING (true);
CREATE POLICY "Users can manage own data" ON rl_policies FOR ALL USING (true);
CREATE POLICY "Users can manage own data" ON prompt_rewrite_sessions FOR ALL USING (true);
CREATE POLICY "Public read access" ON content_templates FOR SELECT USING (true);
CREATE POLICY "Users can manage own data" ON template_performance FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own data" ON api_usage_tracking FOR ALL USING (auth.uid() = user_id);
\`;

    const { error: rlsError } = await supabase.rpc('exec_sql', { sql: rlsSQL })
    
    if (rlsError) {
      console.log('⚠️ Error configurando RLS:', rlsError.message)
    } else {
      console.log('✅ Políticas RLS configuradas')
    }

    console.log('🎉 Configuración de Supabase completada!')
    
  } catch (error) {
    console.error('❌ Error en configuración:', error.message)
  }
}

setupSupabase()`;

    fs.writeFileSync('setup-supabase.js', supabaseSetupScript);
    console.log('✅ setup-supabase.js creado');

    // 7. Crear script de despliegue de Edge Functions
    const deployFunctionsScript = `#!/usr/bin/env node

// Script para desplegar Edge Functions
const { execSync } = require('child_process');

console.log('🚀 Desplegando Edge Functions...')

try {
  // Verificar si Supabase CLI está instalado
  try {
    execSync('supabase --version', { stdio: 'pipe' });
  } catch (error) {
    console.log('📦 Instalando Supabase CLI...');
    execSync('npm install -g supabase', { stdio: 'inherit' });
  }

  // Login en Supabase
  console.log('🔐 Iniciando sesión en Supabase...');
  console.log('💡 Ejecuta: supabase login');
  console.log('💡 Luego: supabase link --project-ref tu-project-ref');
  console.log('💡 Finalmente: supabase functions deploy');

} catch (error) {
  console.error('❌ Error:', error.message);
}`;

    fs.writeFileSync('deploy-functions.js', deployFunctionsScript);
    console.log('✅ deploy-functions.js creado');

    // 8. Crear resumen final
    console.log('\n🎉 CONFIGURACIÓN COMPLETADA!\n');
    console.log('📋 Próximos pasos:');
    console.log('1. Ejecuta: node setup-supabase.js');
    console.log('2. Ejecuta: node deploy-functions.js');
    console.log('3. Ejecuta: pnpm build');
    console.log('4. Despliega con: npx vercel --prod\n');
    
    console.log('📁 Archivos creados:');
    console.log('- config/api-keys.ts (configurado)');
    console.log('- .env.local (configurado)');
    console.log('- setup-supabase.js (script de configuración)');
    console.log('- deploy-functions.js (script de despliegue)');
    console.log('- supabase/functions/ (Edge Functions)');
    
    console.log('\n🌐 Tu aplicación estará lista en:');
    console.log('- Desarrollo: http://localhost:5173');
    console.log('- Producción: Después del despliegue\n');

  } catch (error) {
    console.error('❌ Error en la configuración:', error.message);
  } finally {
    rl.close();
  }
}

setupComplete();
