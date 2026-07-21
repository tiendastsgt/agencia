-- SQL CORREGIDO PARA CREAR LAS 7 TABLAS FALTANTES
-- Sin referencias a user_id que no existe

-- TABLA 1: ab_test_configs
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

-- TABLA 2: budget_optimizations
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

-- TABLA 3: scaling_rules
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

-- TABLA 4: dream_100_targets
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

-- TABLA 5: psychological_triggers
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

-- TABLA 6: genetic_algorithm_configs
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

-- TABLA 7: bayesian_optimization_configs
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

-- CREAR ÍNDICES PARA OPTIMIZACIÓN
CREATE INDEX IF NOT EXISTS idx_ab_test_configs_campaign_id ON public.ab_test_configs(campaign_id);
CREATE INDEX IF NOT EXISTS idx_budget_optimizations_campaign_id ON public.budget_optimizations(campaign_id);
CREATE INDEX IF NOT EXISTS idx_scaling_rules_campaign_id ON public.scaling_rules(campaign_id);
CREATE INDEX IF NOT EXISTS idx_dream_100_targets_client_id ON public.dream_100_targets(client_id);
CREATE INDEX IF NOT EXISTS idx_psychological_triggers_client_id ON public.psychological_triggers(client_id);
CREATE INDEX IF NOT EXISTS idx_genetic_algorithm_configs_client_id ON public.genetic_algorithm_configs(client_id);
CREATE INDEX IF NOT EXISTS idx_bayesian_optimization_configs_client_id ON public.bayesian_optimization_configs(client_id);

-- CREAR TRIGGERS PARA updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_ab_test_configs_updated_at BEFORE UPDATE ON public.ab_test_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_optimizations_updated_at BEFORE UPDATE ON public.budget_optimizations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scaling_rules_updated_at BEFORE UPDATE ON public.scaling_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dream_100_targets_updated_at BEFORE UPDATE ON public.dream_100_targets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_psychological_triggers_updated_at BEFORE UPDATE ON public.psychological_triggers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_genetic_algorithm_configs_updated_at BEFORE UPDATE ON public.genetic_algorithm_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bayesian_optimization_configs_updated_at BEFORE UPDATE ON public.bayesian_optimization_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- CONFIGURAR RLS (Row Level Security) - SIN POLÍTICAS COMPLEJAS
ALTER TABLE public.ab_test_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budget_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scaling_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dream_100_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.psychological_triggers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genetic_algorithm_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bayesian_optimization_configs ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS SIMPLES - PERMITIR TODO POR AHORA
CREATE POLICY "Allow all operations on ab_test_configs" ON public.ab_test_configs FOR ALL USING (true);
CREATE POLICY "Allow all operations on budget_optimizations" ON public.budget_optimizations FOR ALL USING (true);
CREATE POLICY "Allow all operations on scaling_rules" ON public.scaling_rules FOR ALL USING (true);
CREATE POLICY "Allow all operations on dream_100_targets" ON public.dream_100_targets FOR ALL USING (true);
CREATE POLICY "Allow all operations on psychological_triggers" ON public.psychological_triggers FOR ALL USING (true);
CREATE POLICY "Allow all operations on genetic_algorithm_configs" ON public.genetic_algorithm_configs FOR ALL USING (true);
CREATE POLICY "Allow all operations on bayesian_optimization_configs" ON public.bayesian_optimization_configs FOR ALL USING (true);
