-- =====================================================
-- MIGRACIÓN: SISTEMA DE INFOGRAFÍAS
-- =====================================================
-- Fecha: 15 de Septiembre, 2025
-- Versión: 2.4.0
-- Descripción: Sistema completo de generación de infografías a partir de JSON

-- =====================================================
-- TABLA: infographics
-- =====================================================
CREATE TABLE IF NOT EXISTS infographics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    data JSONB NOT NULL,
    generated_images JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'generating', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    tags TEXT[] DEFAULT '{}',
    category VARCHAR(50) DEFAULT 'marketing',
    is_public BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    
    -- Índices
    CONSTRAINT infographics_title_check CHECK (length(title) > 0),
    CONSTRAINT infographics_category_check CHECK (category IN (
        'marketing', 'analytics', 'social-media', 'business', 
        'education', 'healthcare', 'technology', 'finance', 
        'sports', 'lifestyle', 'news', 'presentation'
    ))
);

-- =====================================================
-- TABLA: infographic_templates
-- =====================================================
CREATE TABLE IF NOT EXISTS infographic_templates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    thumbnail VARCHAR(500),
    data JSONB NOT NULL,
    tags TEXT[] DEFAULT '{}',
    popularity INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices
    CONSTRAINT infographic_templates_name_check CHECK (length(name) > 0),
    CONSTRAINT infographic_templates_category_check CHECK (category IN (
        'marketing', 'analytics', 'social-media', 'business', 
        'education', 'healthcare', 'technology', 'finance', 
        'sports', 'lifestyle', 'news', 'presentation'
    ))
);

-- =====================================================
-- TABLA: infographic_generations
-- =====================================================
CREATE TABLE IF NOT EXISTS infographic_generations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    infographic_id UUID NOT NULL REFERENCES infographics(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    model VARCHAR(100) NOT NULL,
    prompt TEXT NOT NULL,
    images JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    generation_time INTEGER, -- en segundos
    cost DECIMAL(10,4), -- costo en USD
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    
    -- Índices
    CONSTRAINT infographic_generations_provider_check CHECK (provider IN (
        'dalle', 'stability', 'midjourney', 'gemini'
    ))
);

-- =====================================================
-- TABLA: infographic_analytics
-- =====================================================
CREATE TABLE IF NOT EXISTS infographic_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    infographic_id UUID NOT NULL REFERENCES infographics(id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL,
    event_data JSONB DEFAULT '{}',
    user_agent TEXT,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Índices
    CONSTRAINT infographic_analytics_event_type_check CHECK (event_type IN (
        'view', 'download', 'share', 'like', 'comment'
    ))
);

-- =====================================================
-- ÍNDICES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para infographics
CREATE INDEX IF NOT EXISTS idx_infographics_user_id ON infographics(user_id);
CREATE INDEX IF NOT EXISTS idx_infographics_client_id ON infographics(client_id);
CREATE INDEX IF NOT EXISTS idx_infographics_campaign_id ON infographics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_infographics_status ON infographics(status);
CREATE INDEX IF NOT EXISTS idx_infographics_category ON infographics(category);
CREATE INDEX IF NOT EXISTS idx_infographics_created_at ON infographics(created_at);
CREATE INDEX IF NOT EXISTS idx_infographics_tags ON infographics USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_infographics_data ON infographics USING GIN(data);

-- Índices para infographic_templates
CREATE INDEX IF NOT EXISTS idx_infographic_templates_category ON infographic_templates(category);
CREATE INDEX IF NOT EXISTS idx_infographic_templates_popularity ON infographic_templates(popularity);
CREATE INDEX IF NOT EXISTS idx_infographic_templates_tags ON infographic_templates USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_infographic_templates_data ON infographic_templates USING GIN(data);

-- Índices para infographic_generations
CREATE INDEX IF NOT EXISTS idx_infographic_generations_infographic_id ON infographic_generations(infographic_id);
CREATE INDEX IF NOT EXISTS idx_infographic_generations_user_id ON infographic_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_infographic_generations_provider ON infographic_generations(provider);
CREATE INDEX IF NOT EXISTS idx_infographic_generations_status ON infographic_generations(status);
CREATE INDEX IF NOT EXISTS idx_infographic_generations_created_at ON infographic_generations(created_at);

-- Índices para infographic_analytics
CREATE INDEX IF NOT EXISTS idx_infographic_analytics_infographic_id ON infographic_analytics(infographic_id);
CREATE INDEX IF NOT EXISTS idx_infographic_analytics_event_type ON infographic_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_infographic_analytics_created_at ON infographic_analytics(created_at);

-- =====================================================
-- TRIGGERS PARA UPDATED_AT
-- =====================================================

-- Trigger para infographics
CREATE OR REPLACE FUNCTION update_infographics_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_infographics_updated_at
    BEFORE UPDATE ON infographics
    FOR EACH ROW
    EXECUTE FUNCTION update_infographics_updated_at();

-- Trigger para infographic_templates
CREATE OR REPLACE FUNCTION update_infographic_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_infographic_templates_updated_at
    BEFORE UPDATE ON infographic_templates
    FOR EACH ROW
    EXECUTE FUNCTION update_infographic_templates_updated_at();

-- =====================================================
-- POLÍTICAS RLS (ROW LEVEL SECURITY)
-- =====================================================

-- Habilitar RLS
ALTER TABLE infographics ENABLE ROW LEVEL SECURITY;
ALTER TABLE infographic_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE infographic_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE infographic_analytics ENABLE ROW LEVEL SECURITY;

-- Políticas para infographics
CREATE POLICY "Users can view their own infographics" ON infographics
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own infographics" ON infographics
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own infographics" ON infographics
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own infographics" ON infographics
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para infographic_templates (lectura pública)
CREATE POLICY "Anyone can view public templates" ON infographic_templates
    FOR SELECT USING (true);

-- Políticas para infographic_generations
CREATE POLICY "Users can view their own generations" ON infographic_generations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own generations" ON infographic_generations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para infographic_analytics
CREATE POLICY "Users can view analytics for their infographics" ON infographic_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM infographics 
            WHERE infographics.id = infographic_analytics.infographic_id 
            AND infographics.user_id = auth.uid()
        )
    );

CREATE POLICY "Anyone can insert analytics events" ON infographic_analytics
    FOR INSERT WITH CHECK (true);

-- =====================================================
-- FUNCIONES AUXILIARES
-- =====================================================

-- Función para obtener estadísticas de infografías
CREATE OR REPLACE FUNCTION get_infographic_stats(user_id_param UUID)
RETURNS JSONB AS $$
DECLARE
    result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_infographics', COUNT(*),
        'completed_infographics', COUNT(*) FILTER (WHERE status = 'completed'),
        'draft_infographics', COUNT(*) FILTER (WHERE status = 'draft'),
        'total_downloads', COALESCE(SUM(download_count), 0),
        'total_views', COALESCE(SUM(view_count), 0),
        'categories', (
            SELECT jsonb_object_agg(category, count)
            FROM (
                SELECT category, COUNT(*) as count
                FROM infographics
                WHERE user_id = user_id_param
                GROUP BY category
            ) category_stats
        )
    ) INTO result
    FROM infographics
    WHERE user_id = user_id_param;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para incrementar contadores
CREATE OR REPLACE FUNCTION increment_infographic_counter(
    infographic_id_param UUID,
    counter_type VARCHAR(20)
)
RETURNS VOID AS $$
BEGIN
    IF counter_type = 'view' THEN
        UPDATE infographics 
        SET view_count = view_count + 1 
        WHERE id = infographic_id_param;
    ELSIF counter_type = 'download' THEN
        UPDATE infographics 
        SET download_count = download_count + 1 
        WHERE id = infographic_id_param;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- DATOS INICIALES - TEMPLATES PREDEFINIDOS
-- =====================================================

-- Template 1: Marketing Analytics
INSERT INTO infographic_templates (name, description, category, data, tags) VALUES (
    'Marketing Analytics Dashboard',
    'Template para mostrar métricas de marketing y analytics',
    'marketing',
    '{
        "title": "Marketing Analytics Dashboard",
        "subtitle": "Métricas clave de rendimiento",
        "theme": {
            "name": "Marketing Blue",
            "primaryColor": "#3B82F6",
            "secondaryColor": "#1E40AF",
            "backgroundColor": "#FFFFFF",
            "textColor": "#1F2937",
            "accentColor": "#F59E0B",
            "fontFamily": "Inter",
            "style": "modern"
        },
        "layout": {
            "type": "grid",
            "columns": 2,
            "sections": 4,
            "spacing": "normal"
        },
        "sections": [
            {
                "id": "header",
                "type": "header",
                "title": "Marketing Analytics Dashboard",
                "content": {
                    "text": {
                        "content": "Análisis completo de rendimiento de marketing",
                        "format": "paragraph"
                    }
                },
                "position": {"x": 0, "y": 0, "width": 100, "height": 20}
            },
            {
                "id": "stats",
                "type": "stats",
                "title": "Métricas Principales",
                "content": {
                    "stats": {
                        "items": [
                            {"label": "Conversiones", "value": "15.2", "unit": "%"},
                            {"label": "CTR", "value": "3.8", "unit": "%"},
                            {"label": "ROAS", "value": "4.2", "unit": "x"},
                            {"label": "Costo por Lead", "value": "$25", "unit": ""}
                        ],
                        "layout": "grid"
                    }
                },
                "position": {"x": 0, "y": 20, "width": 100, "height": 40}
            },
            {
                "id": "chart",
                "type": "chart",
                "title": "Tendencias de Conversión",
                "content": {
                    "chart": {
                        "type": "line",
                        "data": [
                            {"label": "Ene", "value": 12},
                            {"label": "Feb", "value": 15},
                            {"label": "Mar", "value": 18},
                            {"label": "Abr", "value": 16},
                            {"label": "May", "value": 22}
                        ],
                        "showLegend": true,
                        "showValues": true
                    }
                },
                "position": {"x": 0, "y": 60, "width": 50, "height": 40}
            },
            {
                "id": "insights",
                "type": "list",
                "title": "Insights Clave",
                "content": {
                    "list": {
                        "items": [
                            {"text": "Aumento del 22% en conversiones"},
                            {"text": "Mejor rendimiento en móviles"},
                            {"text": "Facebook Ads liderando ROI"},
                            {"text": "Optimización de landing pages exitosa"}
                        ],
                        "type": "checkmark"
                    }
                },
                "position": {"x": 50, "y": 60, "width": 50, "height": 40}
            }
        ],
        "metadata": {
            "author": "MarketPro GT",
            "createdAt": "2025-09-15T00:00:00Z",
            "updatedAt": "2025-09-15T00:00:00Z",
            "tags": ["marketing", "analytics", "dashboard"],
            "category": "marketing",
            "language": "es",
            "version": "1.0.0"
        },
        "style": {
            "borderRadius": 8,
            "shadow": true,
            "border": false,
            "backgroundPattern": "none"
        }
    }'::jsonb,
    ARRAY['marketing', 'analytics', 'dashboard', 'metrics']
);

-- Template 2: Social Media Performance
INSERT INTO infographic_templates (name, description, category, data, tags) VALUES (
    'Social Media Performance',
    'Template para mostrar rendimiento en redes sociales',
    'social-media',
    '{
        "title": "Social Media Performance",
        "subtitle": "Análisis de rendimiento en redes sociales",
        "theme": {
            "name": "Social Purple",
            "primaryColor": "#8B5CF6",
            "secondaryColor": "#7C3AED",
            "backgroundColor": "#FFFFFF",
            "textColor": "#1F2937",
            "accentColor": "#EC4899",
            "fontFamily": "Inter",
            "style": "modern"
        },
        "layout": {
            "type": "vertical",
            "columns": 1,
            "sections": 5,
            "spacing": "normal"
        },
        "sections": [
            {
                "id": "header",
                "type": "header",
                "title": "Social Media Performance",
                "content": {
                    "text": {
                        "content": "Análisis completo de rendimiento en redes sociales",
                        "format": "paragraph"
                    }
                },
                "position": {"x": 0, "y": 0, "width": 100, "height": 15}
            },
            {
                "id": "platforms",
                "type": "comparison",
                "title": "Rendimiento por Plataforma",
                "content": {
                    "comparison": {
                        "items": [
                            {
                                "title": "Instagram",
                                "description": "Mejor rendimiento en engagement",
                                "pros": ["Alto engagement", "Crecimiento 25%", "Audiencia joven"],
                                "cons": ["Alto costo", "Competencia alta"],
                                "score": 85
                            },
                            {
                                "title": "Facebook",
                                "description": "Líder en alcance y conversiones",
                                "pros": ["Mayor alcance", "Buen ROI", "Audiencia diversa"],
                                "cons": ["Engagement menor", "Algoritmo complejo"],
                                "score": 78
                            }
                        ],
                        "layout": "side-by-side"
                    }
                },
                "position": {"x": 0, "y": 15, "width": 100, "height": 35}
            },
            {
                "id": "stats",
                "type": "stats",
                "title": "Métricas Generales",
                "content": {
                    "stats": {
                        "items": [
                            {"label": "Alcance Total", "value": "125K", "unit": ""},
                            {"label": "Engagement Rate", "value": "4.2", "unit": "%"},
                            {"label": "Crecimiento", "value": "+18", "unit": "%"},
                            {"label": "Seguidores", "value": "45K", "unit": ""}
                        ],
                        "layout": "horizontal"
                    }
                },
                "position": {"x": 0, "y": 50, "width": 100, "height": 25}
            },
            {
                "id": "insights",
                "type": "list",
                "title": "Insights Clave",
                "content": {
                    "list": {
                        "items": [
                            {"text": "Instagram Stories generan 40% más engagement"},
                            {"text": "Mejor horario: 6-8 PM"},
                            {"text": "Contenido visual supera texto 3:1"},
                            {"text": "Hashtags relevantes aumentan alcance 25%"}
                        ],
                        "type": "bullet"
                    }
                },
                "position": {"x": 0, "y": 75, "width": 100, "height": 25}
            }
        ],
        "metadata": {
            "author": "MarketPro GT",
            "createdAt": "2025-09-15T00:00:00Z",
            "updatedAt": "2025-09-15T00:00:00Z",
            "tags": ["social-media", "performance", "analytics"],
            "category": "social-media",
            "language": "es",
            "version": "1.0.0"
        },
        "style": {
            "borderRadius": 12,
            "shadow": true,
            "border": false,
            "backgroundPattern": "dots"
        }
    }'::jsonb,
    ARRAY['social-media', 'performance', 'analytics', 'engagement']
);

-- Template 3: Business Report
INSERT INTO infographic_templates (name, description, category, data, tags) VALUES (
    'Business Performance Report',
    'Template para reportes de rendimiento empresarial',
    'business',
    '{
        "title": "Business Performance Report",
        "subtitle": "Q3 2025 - Análisis de rendimiento",
        "theme": {
            "name": "Corporate Green",
            "primaryColor": "#059669",
            "secondaryColor": "#047857",
            "backgroundColor": "#FFFFFF",
            "textColor": "#1F2937",
            "accentColor": "#F59E0B",
            "fontFamily": "Inter",
            "style": "corporate"
        },
        "layout": {
            "type": "grid",
            "columns": 2,
            "sections": 6,
            "spacing": "normal"
        },
        "sections": [
            {
                "id": "header",
                "type": "header",
                "title": "Business Performance Report",
                "content": {
                    "text": {
                        "content": "Análisis trimestral de rendimiento empresarial",
                        "format": "paragraph"
                    }
                },
                "position": {"x": 0, "y": 0, "width": 100, "height": 15}
            },
            {
                "id": "kpis",
                "type": "stats",
                "title": "KPIs Principales",
                "content": {
                    "stats": {
                        "items": [
                            {"label": "Revenue", "value": "$2.5M", "unit": ""},
                            {"label": "Growth", "value": "+12", "unit": "%"},
                            {"label": "Profit Margin", "value": "18.5", "unit": "%"},
                            {"label": "Customer Satisfaction", "value": "4.8", "unit": "/5"}
                        ],
                        "layout": "grid"
                    }
                },
                "position": {"x": 0, "y": 15, "width": 100, "height": 30}
            },
            {
                "id": "chart",
                "type": "chart",
                "title": "Revenue Trend",
                "content": {
                    "chart": {
                        "type": "bar",
                        "data": [
                            {"label": "Q1", "value": 2.1},
                            {"label": "Q2", "value": 2.3},
                            {"label": "Q3", "value": 2.5}
                        ],
                        "showLegend": false,
                        "showValues": true
                    }
                },
                "position": {"x": 0, "y": 45, "width": 50, "height": 30}
            },
            {
                "id": "achievements",
                "type": "list",
                "title": "Logros del Trimestre",
                "content": {
                    "list": {
                        "items": [
                            {"text": "Nuevo producto lanzado exitosamente"},
                            {"text": "Expansión a 3 nuevos mercados"},
                            {"text": "Equipo creció 25%"},
                            {"text": "Certificación ISO 9001 obtenida"}
                        ],
                        "type": "checkmark"
                    }
                },
                "position": {"x": 50, "y": 45, "width": 50, "height": 30}
            },
            {
                "id": "goals",
                "type": "list",
                "title": "Objetivos Q4",
                "content": {
                    "list": {
                        "items": [
                            {"text": "Aumentar revenue 15%"},
                            {"text": "Mejorar customer satisfaction a 4.9"},
                            {"text": "Lanzar 2 nuevos productos"},
                            {"text": "Optimizar procesos operativos"}
                        ],
                        "type": "bullet"
                    }
                },
                "position": {"x": 0, "y": 75, "width": 100, "height": 25}
            }
        ],
        "metadata": {
            "author": "MarketPro GT",
            "createdAt": "2025-09-15T00:00:00Z",
            "updatedAt": "2025-09-15T00:00:00Z",
            "tags": ["business", "report", "performance", "kpis"],
            "category": "business",
            "language": "es",
            "version": "1.0.0"
        },
        "style": {
            "borderRadius": 8,
            "shadow": true,
            "border": true,
            "borderColor": "#E5E7EB",
            "backgroundPattern": "none"
        }
    }'::jsonb,
    ARRAY['business', 'report', 'performance', 'kpis', 'quarterly']
);

-- =====================================================
-- COMENTARIOS Y DOCUMENTACIÓN
-- =====================================================

COMMENT ON TABLE infographics IS 'Almacena las infografías creadas por los usuarios';
COMMENT ON TABLE infographic_templates IS 'Templates predefinidos para crear infografías';
COMMENT ON TABLE infographic_generations IS 'Registro de generaciones de imágenes para infografías';
COMMENT ON TABLE infographic_analytics IS 'Analytics y eventos de las infografías';

COMMENT ON COLUMN infographics.data IS 'Datos JSON de la infografía (estructura, contenido, estilo)';
COMMENT ON COLUMN infographics.generated_images IS 'Array de imágenes generadas para la infografía';
COMMENT ON COLUMN infographics.status IS 'Estado actual de la infografía';
COMMENT ON COLUMN infographics.tags IS 'Tags para categorización y búsqueda';
COMMENT ON COLUMN infographics.category IS 'Categoría principal de la infografía';

COMMENT ON FUNCTION get_infographic_stats(UUID) IS 'Obtiene estadísticas de infografías de un usuario';
COMMENT ON FUNCTION increment_infographic_counter(UUID, VARCHAR) IS 'Incrementa contadores de views/downloads';

-- =====================================================
-- FINALIZACIÓN
-- =====================================================

-- Verificar que las tablas se crearon correctamente
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'infographics') THEN
        RAISE NOTICE '✅ Tabla infographics creada correctamente';
    ELSE
        RAISE EXCEPTION '❌ Error: Tabla infographics no se creó';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'infographic_templates') THEN
        RAISE NOTICE '✅ Tabla infographic_templates creada correctamente';
    ELSE
        RAISE EXCEPTION '❌ Error: Tabla infographic_templates no se creó';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'infographic_generations') THEN
        RAISE NOTICE '✅ Tabla infographic_generations creada correctamente';
    ELSE
        RAISE EXCEPTION '❌ Error: Tabla infographic_generations no se creó';
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'infographic_analytics') THEN
        RAISE NOTICE '✅ Tabla infographic_analytics creada correctamente';
    ELSE
        RAISE EXCEPTION '❌ Error: Tabla infographic_analytics no se creó';
    END IF;
    
    RAISE NOTICE '🎉 Migración de sistema de infografías completada exitosamente';
END $$;
