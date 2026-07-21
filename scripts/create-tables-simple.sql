-- Crear tabla de proveedores
CREATE TABLE IF NOT EXISTS api_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  auth_type VARCHAR(50) NOT NULL,
  base_url VARCHAR(500),
  documentation_url VARCHAR(500),
  validation_endpoint VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear tabla de credenciales
CREATE TABLE IF NOT EXISTS api_credentials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider VARCHAR(100) NOT NULL,
  credential_name VARCHAR(255) NOT NULL,
  credential_type VARCHAR(50) NOT NULL,
  encrypted_value TEXT NOT NULL,
  encryption_key_id VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Crear tabla de logs
CREATE TABLE IF NOT EXISTS credential_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  credential_id UUID REFERENCES api_credentials(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL,
  endpoint VARCHAR(255),
  status_code INTEGER,
  response_time_ms INTEGER,
  error_message TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar proveedores
INSERT INTO api_providers (name, display_name, description, auth_type, base_url, documentation_url, validation_endpoint) VALUES
('openai', 'OpenAI', 'API de OpenAI para GPT y DALL-E', 'api_key', 'https://api.openai.com/v1', 'https://platform.openai.com/docs', 'https://api.openai.com/v1/models'),
('facebook', 'Facebook Graph API', 'API de Facebook para métricas y publicaciones', 'oauth2', 'https://graph.facebook.com/v18.0', 'https://developers.facebook.com/docs/graph-api', 'https://graph.facebook.com/v18.0/me'),
('instagram', 'Instagram Basic Display API', 'API de Instagram para métricas', 'oauth2', 'https://graph.instagram.com', 'https://developers.facebook.com/docs/instagram-basic-display-api', 'https://graph.instagram.com/me'),
('google', 'Google Analytics 4', 'API de Google Analytics para métricas', 'oauth2', 'https://analyticsdata.googleapis.com/v1beta', 'https://developers.google.com/analytics/devguides/reporting/data/v1', 'https://analyticsdata.googleapis.com/v1beta/properties'),
('linkedin', 'LinkedIn Marketing API', 'API de LinkedIn para campañas B2B', 'oauth2', 'https://api.linkedin.com/v2', 'https://docs.microsoft.com/en-us/linkedin/marketing/', 'https://api.linkedin.com/v2/people/~'),
('twitter', 'Twitter API v2', 'API de Twitter para métricas y publicaciones', 'oauth2', 'https://api.twitter.com/2', 'https://developer.twitter.com/en/docs/twitter-api', 'https://api.twitter.com/2/users/me'),
('tiktok', 'TikTok Business API', 'API de TikTok para métricas de business', 'oauth2', 'https://business-api.tiktok.com/open_api/v1.3', 'https://ads.tiktok.com/marketing_api/docs', 'https://business-api.tiktok.com/open_api/v1.3/user/info/'),
('youtube', 'YouTube Analytics API', 'API de YouTube para métricas de video', 'oauth2', 'https://youtubeanalytics.googleapis.com/v2', 'https://developers.google.com/youtube/analytics', 'https://youtubeanalytics.googleapis.com/v2/reports'),
('stability', 'Stability AI', 'API de Stability AI para generación de imágenes', 'api_key', 'https://api.stability.ai/v1', 'https://platform.stability.ai/docs', 'https://api.stability.ai/v1/user/account'),
('runway', 'RunwayML', 'API de RunwayML para generación de video', 'api_key', 'https://api.runwayml.com/v1', 'https://docs.runwayml.com/', 'https://api.runwayml.com/v1/account');

-- Habilitar RLS
ALTER TABLE api_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE credential_usage_logs ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Anyone can view providers" ON api_providers FOR SELECT USING (true);
CREATE POLICY "Users can view own credentials" ON api_credentials FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own credentials" ON api_credentials FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own credentials" ON api_credentials FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own credentials" ON api_credentials FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can view own usage logs" ON credential_usage_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own usage logs" ON credential_usage_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
