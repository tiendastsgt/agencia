-- Migración para funcionalidades de redes sociales y IA - v2.2.0
-- Ejecutar en Supabase SQL Editor

-- 1. Tabla para análisis de sentimientos
CREATE TABLE IF NOT EXISTS sentiment_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    text TEXT NOT NULL,
    sentiment VARCHAR(20) NOT NULL CHECK (sentiment IN ('positive', 'negative', 'neutral')),
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0 AND confidence <= 1),
    emotions JSONB,
    platform VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tabla para imágenes generadas
CREATE TABLE IF NOT EXISTS generated_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    prompt TEXT NOT NULL,
    style VARCHAR(50) NOT NULL,
    size VARCHAR(20) NOT NULL,
    quality VARCHAR(20) NOT NULL,
    image_url TEXT NOT NULL,
    revised_prompt TEXT,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Tabla para posts de redes sociales
CREATE TABLE IF NOT EXISTS social_media_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform VARCHAR(50) NOT NULL CHECK (platform IN ('facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube')),
    post_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    media_urls JSONB,
    metrics JSONB,
    status VARCHAR(20) DEFAULT 'published' CHECK (status IN ('draft', 'scheduled', 'published', 'failed')),
    scheduled_for TIMESTAMP WITH TIME ZONE,
    published_at TIMESTAMP WITH TIME ZONE,
    campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Tabla para trending topics
CREATE TABLE IF NOT EXISTS trending_topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    topic VARCHAR(255) NOT NULL,
    volume INTEGER DEFAULT 0,
    sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'negative', 'neutral')),
    category VARCHAR(100),
    country VARCHAR(10) DEFAULT 'GT',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tabla para reportes personalizados
CREATE TABLE IF NOT EXISTS custom_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    layout JSONB NOT NULL,
    widgets JSONB NOT NULL,
    filters JSONB,
    schedule JSONB,
    is_public BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Tabla para dashboards personalizables
CREATE TABLE IF NOT EXISTS custom_dashboards (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    layout JSONB NOT NULL,
    widgets JSONB NOT NULL,
    filters JSONB,
    is_default BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Tabla para alertas inteligentes
CREATE TABLE IF NOT EXISTS intelligent_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    conditions JSONB NOT NULL,
    actions JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_triggered TIMESTAMP WITH TIME ZONE,
    trigger_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Tabla para métricas de redes sociales
CREATE TABLE IF NOT EXISTS social_media_metrics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    platform VARCHAR(50) NOT NULL,
    post_id UUID REFERENCES social_media_posts(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Tabla para análisis de competencia
CREATE TABLE IF NOT EXISTS competitor_analysis (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    competitor_name VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    analysis_data JSONB NOT NULL,
    sentiment_score DECIMAL(3,2),
    engagement_rate DECIMAL(5,2),
    follower_count INTEGER,
    analysis_date DATE NOT NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Tabla para predicciones de tendencias
CREATE TABLE IF NOT EXISTS trend_predictions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    keyword VARCHAR(255) NOT NULL,
    platform VARCHAR(50) NOT NULL,
    predicted_volume INTEGER,
    confidence_score DECIMAL(3,2),
    prediction_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_sentiment_analysis_campaign ON sentiment_analysis(campaign_id);
CREATE INDEX IF NOT EXISTS idx_sentiment_analysis_platform ON sentiment_analysis(platform);
CREATE INDEX IF NOT EXISTS idx_sentiment_analysis_timestamp ON sentiment_analysis(timestamp);

CREATE INDEX IF NOT EXISTS idx_generated_images_campaign ON generated_images(campaign_id);
CREATE INDEX IF NOT EXISTS idx_generated_images_created_at ON generated_images(created_at);

CREATE INDEX IF NOT EXISTS idx_social_posts_platform ON social_media_posts(platform);
CREATE INDEX IF NOT EXISTS idx_social_posts_campaign ON social_media_posts(campaign_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_status ON social_media_posts(status);

CREATE INDEX IF NOT EXISTS idx_trending_topics_platform ON trending_topics(platform);
CREATE INDEX IF NOT EXISTS idx_trending_topics_created_at ON trending_topics(created_at);

CREATE INDEX IF NOT EXISTS idx_custom_reports_created_by ON custom_reports(created_by);
CREATE INDEX IF NOT EXISTS idx_custom_dashboards_created_by ON custom_dashboards(created_by);

CREATE INDEX IF NOT EXISTS idx_alerts_created_by ON intelligent_alerts(created_by);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON intelligent_alerts(is_active);

CREATE INDEX IF NOT EXISTS idx_metrics_platform ON social_media_metrics(platform);
CREATE INDEX IF NOT EXISTS idx_metrics_date ON social_media_metrics(date);

CREATE INDEX IF NOT EXISTS idx_competitor_analysis_competitor ON competitor_analysis(competitor_name);
CREATE INDEX IF NOT EXISTS idx_competitor_analysis_platform ON competitor_analysis(platform);

CREATE INDEX IF NOT EXISTS idx_trend_predictions_keyword ON trend_predictions(keyword);
CREATE INDEX IF NOT EXISTS idx_trend_predictions_platform ON trend_predictions(platform);

-- Políticas RLS
ALTER TABLE sentiment_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE trending_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_dashboards ENABLE ROW LEVEL SECURITY;
ALTER TABLE intelligent_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_media_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitor_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE trend_predictions ENABLE ROW LEVEL SECURITY;

-- Políticas para sentiment_analysis
CREATE POLICY "Users can view their own sentiment analysis" ON sentiment_analysis
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own sentiment analysis" ON sentiment_analysis
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own sentiment analysis" ON sentiment_analysis
    FOR UPDATE USING (auth.uid() = created_by);

-- Políticas para generated_images
CREATE POLICY "Users can view their own generated images" ON generated_images
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own generated images" ON generated_images
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own generated images" ON generated_images
    FOR UPDATE USING (auth.uid() = created_by);

-- Políticas para social_media_posts
CREATE POLICY "Users can view their own social media posts" ON social_media_posts
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own social media posts" ON social_media_posts
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own social media posts" ON social_media_posts
    FOR UPDATE USING (auth.uid() = created_by);

-- Políticas para trending_topics (lectura pública)
CREATE POLICY "Anyone can view trending topics" ON trending_topics
    FOR SELECT USING (true);

-- Políticas para custom_reports
CREATE POLICY "Users can view their own custom reports" ON custom_reports
    FOR SELECT USING (auth.uid() = created_by OR is_public = true);

CREATE POLICY "Users can insert their own custom reports" ON custom_reports
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own custom reports" ON custom_reports
    FOR UPDATE USING (auth.uid() = created_by);

-- Políticas para custom_dashboards
CREATE POLICY "Users can view their own custom dashboards" ON custom_dashboards
    FOR SELECT USING (auth.uid() = created_by OR is_default = true);

CREATE POLICY "Users can insert their own custom dashboards" ON custom_dashboards
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own custom dashboards" ON custom_dashboards
    FOR UPDATE USING (auth.uid() = created_by);

-- Políticas para intelligent_alerts
CREATE POLICY "Users can view their own intelligent alerts" ON intelligent_alerts
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own intelligent alerts" ON intelligent_alerts
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own intelligent alerts" ON intelligent_alerts
    FOR UPDATE USING (auth.uid() = created_by);

-- Políticas para social_media_metrics (lectura basada en posts del usuario)
CREATE POLICY "Users can view metrics for their posts" ON social_media_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM social_media_posts 
            WHERE social_media_posts.id = social_media_metrics.post_id 
            AND social_media_posts.created_by = auth.uid()
        )
    );

-- Políticas para competitor_analysis
CREATE POLICY "Users can view their own competitor analysis" ON competitor_analysis
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own competitor analysis" ON competitor_analysis
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own competitor analysis" ON competitor_analysis
    FOR UPDATE USING (auth.uid() = created_by);

-- Políticas para trend_predictions (lectura pública)
CREATE POLICY "Anyone can view trend predictions" ON trend_predictions
    FOR SELECT USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para updated_at
CREATE TRIGGER update_social_media_posts_updated_at BEFORE UPDATE ON social_media_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_reports_updated_at BEFORE UPDATE ON custom_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_dashboards_updated_at BEFORE UPDATE ON custom_dashboards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_intelligent_alerts_updated_at BEFORE UPDATE ON intelligent_alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para limpiar datos antiguos
CREATE OR REPLACE FUNCTION cleanup_old_data()
RETURNS void AS $$
BEGIN
    -- Limpiar trending topics más antiguos de 7 días
    DELETE FROM trending_topics WHERE created_at < NOW() - INTERVAL '7 days';
    
    -- Limpiar métricas más antiguas de 1 año
    DELETE FROM social_media_metrics WHERE date < CURRENT_DATE - INTERVAL '1 year';
    
    -- Limpiar predicciones más antiguas de 30 días
    DELETE FROM trend_predictions WHERE prediction_date < CURRENT_DATE - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Crear job para limpieza automática (requiere pg_cron extension)
-- SELECT cron.schedule('cleanup-old-data', '0 2 * * *', 'SELECT cleanup_old_data();');

-- Insertar datos de ejemplo para testing
INSERT INTO trending_topics (platform, topic, volume, sentiment, category) VALUES
('twitter', '#marketing', 15000, 'positive', 'business'),
('instagram', '#guatemala', 8500, 'positive', 'location'),
('linkedin', '#emprendimiento', 3200, 'positive', 'business'),
('tiktok', '#viral', 25000, 'neutral', 'entertainment'),
('youtube', '#tutorial', 12000, 'positive', 'education');

-- Comentarios de la migración
COMMENT ON TABLE sentiment_analysis IS 'Almacena análisis de sentimientos de comentarios y menciones';
COMMENT ON TABLE generated_images IS 'Almacena imágenes generadas con IA';
COMMENT ON TABLE social_media_posts IS 'Almacena posts publicados en redes sociales';
COMMENT ON TABLE trending_topics IS 'Almacena temas trending por plataforma';
COMMENT ON TABLE custom_reports IS 'Almacena reportes personalizados creados por usuarios';
COMMENT ON TABLE custom_dashboards IS 'Almacena dashboards personalizables';
COMMENT ON TABLE intelligent_alerts IS 'Almacena alertas inteligentes configuradas por usuarios';
COMMENT ON TABLE social_media_metrics IS 'Almacena métricas de posts en redes sociales';
COMMENT ON TABLE competitor_analysis IS 'Almacena análisis de competencia';
COMMENT ON TABLE trend_predictions IS 'Almacena predicciones de tendencias';

-- Mensaje de confirmación
DO $$
BEGIN
    RAISE NOTICE 'Migración 006 completada exitosamente. Se crearon 10 nuevas tablas para funcionalidades de redes sociales y IA.';
END $$;
