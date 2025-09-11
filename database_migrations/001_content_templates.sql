-- Migration: Create content_templates table
-- Description: Stores content templates for automated visual content generation

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

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_content_templates_framework ON content_templates(framework);
CREATE INDEX IF NOT EXISTS idx_content_templates_audience ON content_templates(target_audience);
CREATE INDEX IF NOT EXISTS idx_content_templates_platforms ON content_templates USING GIN(platforms);
CREATE INDEX IF NOT EXISTS idx_content_templates_active ON content_templates(is_active);
CREATE INDEX IF NOT EXISTS idx_content_templates_performance ON content_templates(performance_score DESC);

-- Insert default templates
INSERT INTO content_templates (
    id, name, framework, hook_type, visual_elements, psychological_triggers, 
    target_audience, platforms, variables, created_by
) VALUES 
(
    'd100-insider-access',
    'Insider Access Hook',
    'Dream 100',
    'Insider Access',
    '{
        "opening_frame": {
            "text_overlay": "Los {NUMBER} secretos que {AUTHORITY} no quiere que sepas",
            "background": "behind_scenes_footage",
            "duration": "2-3 segundos",
            "effects": ["zoom_in", "text_reveal_animation"]
        },
        "authority_proof": {
            "element": "screenshot_social_proof",
            "content": "Capturas de pantalla de interacciones con figuras de autoridad",
            "duration": "1-2 segundos"
        },
        "revelation_moment": {
            "text": "Aquí está el secreto número {X} que cambió todo para mí",
            "visual": "dramatic_reveal_animation",
            "duration": "3-4 segundos"
        }
    }',
    ARRAY['curiosity_gap', 'authority_proof', 'exclusivity'],
    'Ambitious Professionals',
    ARRAY['LinkedIn', 'Instagram', 'TikTok'],
    '{
        "NUMBER": ["3", "5", "7", "10"],
        "AUTHORITY": ["expertos de la industria", "gurús del marketing", "líderes empresariales"],
        "X": ["1", "2", "3", "4", "5"]
    }',
    'system'
),
(
    'hso-problem-agitation',
    'Problem Agitation Hook',
    'Hook-Story-Offer',
    'Problem Agitation',
    '{
        "opening_frame": {
            "text_overlay": "¿Te ha pasado que {PROBLEM}?",
            "background": "relatable_problem_scenario",
            "duration": "3-4 segundos",
            "effects": ["emotional_color_grading", "close_up_shots"]
        }
    }',
    ARRAY['problem_agitation', 'relatability', 'solution_seeking'],
    'Problem Solvers',
    ARRAY['Instagram', 'TikTok', 'YouTube'],
    '{
        "PROBLEM": [
            "trabajas 12 horas y no ves resultados",
            "tienes mil ideas pero no sabes por dónde empezar",
            "quieres crecer pero no tienes tiempo"
        ]
    }',
    'system'
),
(
    'attractive-character',
    'Attractive Character Hook',
    'Attractive Character',
    'Authority Positioning',
    '{
        "opening_frame": {
            "text_overlay": "Soy {CHARACTER_TYPE} y esto es lo que aprendí sobre {TOPIC}",
            "background": "professional_authority_setting",
            "duration": "2-3 segundos",
            "effects": ["confidence_animation", "authority_visuals"]
        },
        "credibility_moment": {
            "text": "Después de {EXPERIENCE} años en {INDUSTRY}",
            "visual": "timeline_achievements",
            "duration": "2-3 segundos"
        }
    }',
    ARRAY['authority', 'credibility', 'expertise'],
    'Knowledge Seekers',
    ARRAY['LinkedIn', 'YouTube', 'Instagram'],
    '{
        "CHARACTER_TYPE": ["experto", "consultor", "mentor", "líder"],
        "TOPIC": ["éxito", "crecimiento", "innovación", "liderazgo"],
        "EXPERIENCE": ["5", "10", "15", "20"],
        "INDUSTRY": ["marketing", "tecnología", "negocios", "ventas"]
    }',
    'system'
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_content_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER trigger_update_content_templates_updated_at
    BEFORE UPDATE ON content_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_content_templates_updated_at();

-- Create table for template performance tracking
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
    campaign_id VARCHAR(255),
    user_id VARCHAR(255)
);

-- Index for performance tracking
CREATE INDEX IF NOT EXISTS idx_template_performance_template_id ON template_performance(template_id);
CREATE INDEX IF NOT EXISTS idx_template_performance_platform ON template_performance(platform);
CREATE INDEX IF NOT EXISTS idx_template_performance_date ON template_performance(created_at);

-- Create table for API usage tracking
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
    user_id VARCHAR(255)
);

-- Index for API tracking
CREATE INDEX IF NOT EXISTS idx_api_usage_api_name ON api_usage_tracking(api_name);
CREATE INDEX IF NOT EXISTS idx_api_usage_template_id ON api_usage_tracking(template_id);
CREATE INDEX IF NOT EXISTS idx_api_usage_date ON api_usage_tracking(created_at);
