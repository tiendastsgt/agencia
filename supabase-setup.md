# 🗄️ Configuración Completa de Supabase - MarketPro GT

## 🚨 **PASOS CRÍTICOS PARA COMPLETAR EL DESPLIEGUE**

### 1. **Crear Proyecto en Supabase**

1. Ve a [supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo proyecto:
   - **Nombre:** `marketpro-gt`
   - **Región:** `us-east-1` (más cerca de Guatemala)
   - **Contraseña:** Genera una segura
4. Espera a que se complete la configuración (2-3 minutos)

### 2. **Obtener Credenciales**

1. Ve a **Settings > API**
2. Copia:
   - **Project URL:** `https://tu-proyecto.supabase.co`
   - **anon public key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### 3. **Configurar Variables de Entorno**

Actualiza `config/api-keys.ts`:
```typescript
export const API_CONFIG = {
  SUPABASE_URL: 'https://tu-proyecto-real.supabase.co',
  SUPABASE_ANON_KEY: 'tu_clave_real_aqui',
  OPENAI_API_KEY: 'sk-tu_clave_openai_real'
}
```

### 4. **Crear Todas las Tablas**

Ejecuta este SQL en el **SQL Editor** de Supabase:

```sql
-- 1. Tablas Principales
CREATE TABLE clients (
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

CREATE TABLE campaigns (
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

CREATE TABLE content (
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

CREATE TABLE analytics (
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

CREATE TABLE market_research (
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

CREATE TABLE strategies (
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

-- 2. Tablas Multi-Armed Bandit
CREATE TABLE mab_experiments (
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

CREATE TABLE mab_arm_performance (
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

CREATE TABLE mab_selections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID REFERENCES mab_experiments(id) ON DELETE CASCADE,
  arm_id VARCHAR(255) NOT NULL,
  context JSONB,
  algorithm VARCHAR(100),
  confidence DECIMAL(5,4),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE mab_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID REFERENCES mab_experiments(id) ON DELETE CASCADE,
  arm_id VARCHAR(255) NOT NULL,
  reward DECIMAL(15,4) NOT NULL,
  context JSONB,
  metadata JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tablas Reinforcement Learning
CREATE TABLE rl_experiments (
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

CREATE TABLE rl_episodes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID REFERENCES rl_experiments(id) ON DELETE CASCADE,
  episode_data JSONB,
  total_reward DECIMAL(15,4),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE rl_rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID REFERENCES rl_experiments(id) ON DELETE CASCADE,
  episode_id UUID REFERENCES rl_episodes(id) ON DELETE CASCADE,
  reward_data JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE rl_policies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID REFERENCES rl_experiments(id) ON DELETE CASCADE,
  policy_data JSONB,
  performance_metrics JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla Prompt Rewrite
CREATE TABLE prompt_rewrite_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  experiment_id UUID REFERENCES rl_experiments(id) ON DELETE CASCADE,
  session_data JSONB,
  evaluation_history JSONB[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tablas de Plantillas de Contenido
CREATE TABLE content_templates (
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

CREATE TABLE template_performance (
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

CREATE TABLE api_usage_tracking (
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
```

### 5. **Configurar Políticas RLS**

```sql
-- Habilitar RLS en todas las tablas
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

-- Políticas para usuarios autenticados
CREATE POLICY "Users can view own data" ON clients FOR SELECT USING (auth.uid() = created_by);
CREATE POLICY "Users can insert own data" ON clients FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can update own data" ON clients FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Users can delete own data" ON clients FOR DELETE USING (auth.uid() = created_by);

-- Aplicar políticas similares a todas las tablas
-- (Repetir para campaigns, content, analytics, etc.)
```

### 6. **Crear Edge Functions**

Necesitas crear estas Edge Functions en Supabase:

1. **mab-select-arm** - Para seleccionar brazos MAB
2. **mab-record-reward** - Para registrar recompensas
3. **rl-optimize-prompt** - Para optimización de prompts
4. **generate-content** - Para generación de contenido

### 7. **Verificar Configuración**

1. Ejecuta el script de verificación:
```bash
node scripts/run-migration.js
```

2. Verifica que todas las tablas estén creadas en el dashboard de Supabase

## ✅ **Estado Actual vs Requerido**

| Componente | Estado Actual | Requerido |
|------------|---------------|-----------|
| **Proyecto Supabase** | ❌ No creado | ✅ Creado |
| **Tablas (15)** | ❌ No existen | ✅ Creadas |
| **Políticas RLS** | ❌ No configuradas | ✅ Configuradas |
| **Edge Functions** | ❌ No desplegadas | ✅ Desplegadas |
| **API Keys** | ❌ Placeholders | ✅ Reales |
| **Migraciones** | ❌ No ejecutadas | ✅ Ejecutadas |

## 🚀 **Próximos Pasos**

1. **Crear proyecto Supabase** (5 minutos)
2. **Ejecutar SQL de tablas** (10 minutos)
3. **Configurar API keys** (5 minutos)
4. **Desplegar Edge Functions** (15 minutos)
5. **Probar aplicación** (10 minutos)

**Total: ~45 minutos para completar la configuración**

---

**¡Una vez completado esto, tu aplicación estará 100% funcional! 🎉**
