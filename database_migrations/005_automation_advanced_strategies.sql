-- Migration 005: Automation and Advanced Strategies Tables
-- Fase 5: Automatización Avanzada
-- Fase 6: Estrategias Premium

-- Tabla para programación inteligente
CREATE TABLE IF NOT EXISTS campaign_schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    content_id UUID REFERENCES content(id) ON DELETE CASCADE,
    platform VARCHAR(50) NOT NULL,
    scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'failed', 'cancelled')),
    audience_analysis JSONB,
    optimal_schedule JSONB,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para campañas automatizadas
CREATE TABLE IF NOT EXISTS automated_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    campaign_type VARCHAR(50) NOT NULL CHECK (campaign_type IN ('awareness', 'engagement', 'conversion', 'retention')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'failed')),
    trigger_events JSONB,
    automation_rules JSONB,
    performance_metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para A/B tests automáticos
CREATE TABLE IF NOT EXISTS ab_tests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id UUID REFERENCES automated_campaigns(id) ON DELETE CASCADE,
    test_name VARCHAR(255) NOT NULL,
    variants JSONB,
    traffic_split INTEGER DEFAULT 50 CHECK (traffic_split >= 0 AND traffic_split <= 100),
    success_metric VARCHAR(100) NOT NULL,
    minimum_sample_size INTEGER DEFAULT 1000,
    confidence_level DECIMAL(3,2) DEFAULT 0.95 CHECK (confidence_level >= 0 AND confidence_level <= 1),
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'completed', 'paused')),
    results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para estrategias Dream 100
CREATE TABLE IF NOT EXISTS dream100_strategies (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    target_audience TEXT NOT NULL,
    dream100_list JSONB,
    current_phase VARCHAR(20) DEFAULT 'research' CHECK (current_phase IN ('research', 'engagement', 'relationship', 'promotion')),
    progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para escaleras de valor
CREATE TABLE IF NOT EXISTS value_ladders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    steps JSONB,
    current_step INTEGER DEFAULT 0,
    conversion_rates JSONB,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para scripts de webinar
CREATE TABLE IF NOT EXISTS webinar_scripts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    duration INTEGER NOT NULL, -- en minutos
    sections JSONB,
    psychological_triggers JSONB,
    conversion_goals JSONB,
    performance JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para algoritmos genéticos
CREATE TABLE IF NOT EXISTS genetic_algorithms (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    population_size INTEGER NOT NULL,
    generations INTEGER NOT NULL,
    mutation_rate DECIMAL(3,2) NOT NULL CHECK (mutation_rate >= 0 AND mutation_rate <= 1),
    crossover_rate DECIMAL(3,2) NOT NULL CHECK (crossover_rate >= 0 AND crossover_rate <= 1),
    selection_method VARCHAR(20) NOT NULL CHECK (selection_method IN ('tournament', 'roulette', 'rank')),
    fitness_function VARCHAR(100) NOT NULL,
    parameters JSONB,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'completed', 'paused')),
    results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para optimización bayesiana
CREATE TABLE IF NOT EXISTS bayesian_optimizations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    objective_function VARCHAR(100) NOT NULL,
    parameters JSONB,
    acquisition_function VARCHAR(10) NOT NULL CHECK (acquisition_function IN ('ei', 'pi', 'ucb')),
    n_initial_points INTEGER NOT NULL,
    n_iterations INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'completed', 'paused')),
    results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para EvoPrompt
CREATE TABLE IF NOT EXISTS evoprompt_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    base_prompt TEXT NOT NULL,
    mutation_operators JSONB,
    fitness_metrics JSONB,
    population_size INTEGER NOT NULL,
    generations INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'running', 'completed', 'paused')),
    results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para versiones de prompts
CREATE TABLE IF NOT EXISTS prompt_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    version VARCHAR(50) NOT NULL,
    prompt TEXT NOT NULL,
    performance JSONB,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para resultados de algoritmos genéticos
CREATE TABLE IF NOT EXISTS genetic_algorithm_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    config_id UUID REFERENCES genetic_algorithms(id) ON DELETE CASCADE,
    results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para resultados de optimización bayesiana
CREATE TABLE IF NOT EXISTS bayesian_optimization_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    config_id UUID REFERENCES bayesian_optimizations(id) ON DELETE CASCADE,
    results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para resultados de EvoPrompt
CREATE TABLE IF NOT EXISTS evoprompt_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    config_id UUID REFERENCES evoprompt_configs(id) ON DELETE CASCADE,
    results JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_campaign_schedules_client_id ON campaign_schedules(client_id);
CREATE INDEX IF NOT EXISTS idx_campaign_schedules_platform ON campaign_schedules(platform);
CREATE INDEX IF NOT EXISTS idx_campaign_schedules_scheduled_time ON campaign_schedules(scheduled_time);
CREATE INDEX IF NOT EXISTS idx_automated_campaigns_client_id ON automated_campaigns(client_id);
CREATE INDEX IF NOT EXISTS idx_automated_campaigns_status ON automated_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_ab_tests_campaign_id ON ab_tests(campaign_id);
CREATE INDEX IF NOT EXISTS idx_ab_tests_status ON ab_tests(status);
CREATE INDEX IF NOT EXISTS idx_dream100_strategies_client_id ON dream100_strategies(client_id);
CREATE INDEX IF NOT EXISTS idx_value_ladders_client_id ON value_ladders(client_id);
CREATE INDEX IF NOT EXISTS idx_webinar_scripts_client_id ON webinar_scripts(client_id);
CREATE INDEX IF NOT EXISTS idx_genetic_algorithms_status ON genetic_algorithms(status);
CREATE INDEX IF NOT EXISTS idx_bayesian_optimizations_status ON bayesian_optimizations(status);
CREATE INDEX IF NOT EXISTS idx_evoprompt_configs_status ON evoprompt_configs(status);
CREATE INDEX IF NOT EXISTS idx_prompt_versions_is_active ON prompt_versions(is_active);

-- RLS Policies
ALTER TABLE campaign_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE automated_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE ab_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE dream100_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE value_ladders ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE genetic_algorithms ENABLE ROW LEVEL SECURITY;
ALTER TABLE bayesian_optimizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE evoprompt_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompt_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE genetic_algorithm_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE bayesian_optimization_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE evoprompt_results ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para campaign_schedules
CREATE POLICY "Users can view their campaign schedules" ON campaign_schedules
    FOR SELECT USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their campaign schedules" ON campaign_schedules
    FOR INSERT WITH CHECK (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can update their campaign schedules" ON campaign_schedules
    FOR UPDATE USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their campaign schedules" ON campaign_schedules
    FOR DELETE USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

-- Políticas RLS para automated_campaigns
CREATE POLICY "Users can view their automated campaigns" ON automated_campaigns
    FOR SELECT USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their automated campaigns" ON automated_campaigns
    FOR INSERT WITH CHECK (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can update their automated campaigns" ON automated_campaigns
    FOR UPDATE USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their automated campaigns" ON automated_campaigns
    FOR DELETE USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

-- Políticas RLS para ab_tests
CREATE POLICY "Users can view their ab tests" ON ab_tests
    FOR SELECT USING (campaign_id IN (
        SELECT id FROM automated_campaigns WHERE client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can insert their ab tests" ON ab_tests
    FOR INSERT WITH CHECK (campaign_id IN (
        SELECT id FROM automated_campaigns WHERE client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can update their ab tests" ON ab_tests
    FOR UPDATE USING (campaign_id IN (
        SELECT id FROM automated_campaigns WHERE client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    ));

CREATE POLICY "Users can delete their ab tests" ON ab_tests
    FOR DELETE USING (campaign_id IN (
        SELECT id FROM automated_campaigns WHERE client_id IN (
            SELECT id FROM clients WHERE user_id = auth.uid()
        )
    ));

-- Políticas RLS para dream100_strategies
CREATE POLICY "Users can view their dream100 strategies" ON dream100_strategies
    FOR SELECT USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their dream100 strategies" ON dream100_strategies
    FOR INSERT WITH CHECK (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can update their dream100 strategies" ON dream100_strategies
    FOR UPDATE USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their dream100 strategies" ON dream100_strategies
    FOR DELETE USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

-- Políticas RLS para value_ladders
CREATE POLICY "Users can view their value ladders" ON value_ladders
    FOR SELECT USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their value ladders" ON value_ladders
    FOR INSERT WITH CHECK (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can update their value ladders" ON value_ladders
    FOR UPDATE USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their value ladders" ON value_ladders
    FOR DELETE USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

-- Políticas RLS para webinar_scripts
CREATE POLICY "Users can view their webinar scripts" ON webinar_scripts
    FOR SELECT USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their webinar scripts" ON webinar_scripts
    FOR INSERT WITH CHECK (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can update their webinar scripts" ON webinar_scripts
    FOR UPDATE USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their webinar scripts" ON webinar_scripts
    FOR DELETE USING (client_id IN (
        SELECT id FROM clients WHERE user_id = auth.uid()
    ));

-- Políticas RLS para genetic_algorithms
CREATE POLICY "Users can view genetic algorithms" ON genetic_algorithms
    FOR SELECT USING (true);

CREATE POLICY "Users can insert genetic algorithms" ON genetic_algorithms
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update genetic algorithms" ON genetic_algorithms
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete genetic algorithms" ON genetic_algorithms
    FOR DELETE USING (true);

-- Políticas RLS para bayesian_optimizations
CREATE POLICY "Users can view bayesian optimizations" ON bayesian_optimizations
    FOR SELECT USING (true);

CREATE POLICY "Users can insert bayesian optimizations" ON bayesian_optimizations
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update bayesian optimizations" ON bayesian_optimizations
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete bayesian optimizations" ON bayesian_optimizations
    FOR DELETE USING (true);

-- Políticas RLS para evoprompt_configs
CREATE POLICY "Users can view evoprompt configs" ON evoprompt_configs
    FOR SELECT USING (true);

CREATE POLICY "Users can insert evoprompt configs" ON evoprompt_configs
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update evoprompt configs" ON evoprompt_configs
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete evoprompt configs" ON evoprompt_configs
    FOR DELETE USING (true);

-- Políticas RLS para prompt_versions
CREATE POLICY "Users can view prompt versions" ON prompt_versions
    FOR SELECT USING (true);

CREATE POLICY "Users can insert prompt versions" ON prompt_versions
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update prompt versions" ON prompt_versions
    FOR UPDATE USING (true);

CREATE POLICY "Users can delete prompt versions" ON prompt_versions
    FOR DELETE USING (true);

-- Políticas RLS para resultados
CREATE POLICY "Users can view genetic algorithm results" ON genetic_algorithm_results
    FOR SELECT USING (true);

CREATE POLICY "Users can insert genetic algorithm results" ON genetic_algorithm_results
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view bayesian optimization results" ON bayesian_optimization_results
    FOR SELECT USING (true);

CREATE POLICY "Users can insert bayesian optimization results" ON bayesian_optimization_results
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view evoprompt results" ON evoprompt_results
    FOR SELECT USING (true);

CREATE POLICY "Users can insert evoprompt results" ON evoprompt_results
    FOR INSERT WITH CHECK (true);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_campaign_schedules_updated_at BEFORE UPDATE ON campaign_schedules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automated_campaigns_updated_at BEFORE UPDATE ON automated_campaigns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ab_tests_updated_at BEFORE UPDATE ON ab_tests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_dream100_strategies_updated_at BEFORE UPDATE ON dream100_strategies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_value_ladders_updated_at BEFORE UPDATE ON value_ladders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_webinar_scripts_updated_at BEFORE UPDATE ON webinar_scripts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_genetic_algorithms_updated_at BEFORE UPDATE ON genetic_algorithms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bayesian_optimizations_updated_at BEFORE UPDATE ON bayesian_optimizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evoprompt_configs_updated_at BEFORE UPDATE ON evoprompt_configs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
