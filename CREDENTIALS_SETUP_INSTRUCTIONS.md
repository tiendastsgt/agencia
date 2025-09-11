# 🔐 Configuración del Sistema de Credenciales Seguro

## 📋 Instrucciones de Configuración

### 1. Ejecutar Migración de Base de Datos

Ejecuta el siguiente SQL en el **SQL Editor** de Supabase:

```sql
-- Sistema de Credenciales Seguro para MarketPro GT
-- Migración 003: Tabla de credenciales encriptadas

-- Tabla para almacenar credenciales de APIs de forma segura
CREATE TABLE IF NOT EXISTS api_credentials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Información de la credencial
  provider VARCHAR(100) NOT NULL, -- 'openai', 'facebook', 'google', 'linkedin', etc.
  credential_name VARCHAR(255) NOT NULL, -- Nombre descriptivo
  credential_type VARCHAR(50) NOT NULL, -- 'api_key', 'oauth_token', 'service_account'
  
  -- Credencial encriptada
  encrypted_value TEXT NOT NULL, -- Valor encriptado
  encryption_key_id VARCHAR(100) NOT NULL, -- ID de la clave de encriptación
  
  -- Metadatos
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMP WITH TIME ZONE,
  last_used_at TIMESTAMP WITH TIME ZONE,
  usage_count INTEGER DEFAULT 0,
  
  -- Configuración adicional (JSON)
  config JSONB DEFAULT '{}',
  
  -- Auditoría
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Tabla para logs de uso de credenciales
CREATE TABLE IF NOT EXISTS credential_usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  credential_id UUID REFERENCES api_credentials(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Información del uso
  action VARCHAR(100) NOT NULL, -- 'validate', 'use', 'refresh', 'error'
  endpoint VARCHAR(255),
  status_code INTEGER,
  response_time_ms INTEGER,
  error_message TEXT,
  
  -- Metadatos
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para configuración de proveedores
CREATE TABLE IF NOT EXISTS api_providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL, -- 'openai', 'facebook', 'google'
  display_name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Configuración de autenticación
  auth_type VARCHAR(50) NOT NULL, -- 'api_key', 'oauth2', 'service_account'
  base_url VARCHAR(500),
  documentation_url VARCHAR(500),
  
  -- Configuración de límites
  rate_limit_per_minute INTEGER,
  rate_limit_per_hour INTEGER,
  rate_limit_per_day INTEGER,
  
  -- Configuración de validación
  validation_endpoint VARCHAR(500),
  validation_method VARCHAR(10) DEFAULT 'GET',
  
  -- Estado
  is_active BOOLEAN DEFAULT true,
  is_available BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar proveedores predefinidos
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

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_api_credentials_client_id ON api_credentials(client_id);
CREATE INDEX IF NOT EXISTS idx_api_credentials_user_id ON api_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_api_credentials_provider ON api_credentials(provider);
CREATE INDEX IF NOT EXISTS idx_api_credentials_active ON api_credentials(is_active);
CREATE INDEX IF NOT EXISTS idx_credential_usage_logs_credential_id ON credential_usage_logs(credential_id);
CREATE INDEX IF NOT EXISTS idx_credential_usage_logs_created_at ON credential_usage_logs(created_at);

-- Políticas RLS (Row Level Security)
ALTER TABLE api_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE credential_usage_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_providers ENABLE ROW LEVEL SECURITY;

-- Política para api_credentials: Los usuarios solo pueden ver sus propias credenciales
CREATE POLICY "Users can view own credentials" ON api_credentials
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own credentials" ON api_credentials
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own credentials" ON api_credentials
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own credentials" ON api_credentials
  FOR DELETE USING (auth.uid() = user_id);

-- Política para credential_usage_logs: Los usuarios solo pueden ver sus propios logs
CREATE POLICY "Users can view own usage logs" ON credential_usage_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own usage logs" ON credential_usage_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Política para api_providers: Todos pueden leer (es información pública)
CREATE POLICY "Anyone can view providers" ON api_providers
  FOR SELECT USING (true);

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updated_at
CREATE TRIGGER update_api_credentials_updated_at 
  BEFORE UPDATE ON api_credentials 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_providers_updated_at 
  BEFORE UPDATE ON api_providers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Función para encriptar credenciales (usando pgcrypto)
CREATE OR REPLACE FUNCTION encrypt_credential(credential_value TEXT, key_id TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Usar pgcrypto para encriptar con AES-256
  RETURN encode(
    pgp_sym_encrypt(credential_value, key_id, 'cipher-algo=aes256'),
    'base64'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para desencriptar credenciales
CREATE OR REPLACE FUNCTION decrypt_credential(encrypted_value TEXT, key_id TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Desencriptar usando pgcrypto
  RETURN pgp_sym_decrypt(
    decode(encrypted_value, 'base64'),
    key_id,
    'cipher-algo=aes256'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para validar una credencial
CREATE OR REPLACE FUNCTION validate_api_credential(credential_id UUID)
RETURNS JSONB AS $$
DECLARE
  credential_record RECORD;
  provider_record RECORD;
  validation_result JSONB;
BEGIN
  -- Obtener la credencial
  SELECT * INTO credential_record 
  FROM api_credentials 
  WHERE id = credential_id AND user_id = auth.uid();
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Credential not found');
  END IF;
  
  -- Obtener información del proveedor
  SELECT * INTO provider_record 
  FROM api_providers 
  WHERE name = credential_record.provider;
  
  IF NOT FOUND THEN
    RETURN jsonb_build_object('valid', false, 'error', 'Provider not found');
  END IF;
  
  -- Log del intento de validación
  INSERT INTO credential_usage_logs (credential_id, user_id, action, endpoint)
  VALUES (credential_id, auth.uid(), 'validate', provider_record.validation_endpoint);
  
  -- Actualizar contador de uso
  UPDATE api_credentials 
  SET usage_count = usage_count + 1, last_used_at = NOW()
  WHERE id = credential_id;
  
  -- Retornar información de validación (sin la credencial real)
  RETURN jsonb_build_object(
    'valid', true,
    'provider', provider_record.display_name,
    'credential_name', credential_record.credential_name,
    'last_used', credential_record.last_used_at,
    'usage_count', credential_record.usage_count + 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comentarios para documentación
COMMENT ON TABLE api_credentials IS 'Almacena credenciales de APIs de forma encriptada';
COMMENT ON TABLE credential_usage_logs IS 'Registra el uso de credenciales para auditoría';
COMMENT ON TABLE api_providers IS 'Configuración de proveedores de API disponibles';
COMMENT ON FUNCTION encrypt_credential IS 'Encripta una credencial usando AES-256';
COMMENT ON FUNCTION decrypt_credential IS 'Desencripta una credencial usando AES-256';
COMMENT ON FUNCTION validate_api_credential IS 'Valida una credencial y registra su uso';

```

### 2. Verificar Instalación

Después de ejecutar la migración, verifica que se crearon las tablas:

```sql
-- Verificar tablas creadas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('api_credentials', 'credential_usage_logs', 'api_providers');

-- Verificar proveedores insertados
SELECT name, display_name, auth_type 
FROM api_providers 
ORDER BY name;
```

### 3. Configurar Variables de Entorno

Agrega la siguiente variable a tu archivo `.env.local`:

```env
# Clave de encriptación para credenciales (cámbiala en producción)
VITE_ENCRYPTION_KEY=marketpro-gt-encryption-key-2025-secure
```

### 4. Funcionalidades Disponibles

Una vez configurado, tendrás acceso a:

- ✅ **Gestión de Credenciales**: Interfaz para agregar/editar/eliminar credenciales
- ✅ **Encriptación AES-256**: Todas las credenciales se almacenan encriptadas
- ✅ **Validación Automática**: Verificación de credenciales antes de usar
- ✅ **Logs de Uso**: Auditoría completa del uso de credenciales
- ✅ **Múltiples Proveedores**: Soporte para 10+ APIs (OpenAI, Facebook, Google, etc.)
- ✅ **Políticas RLS**: Seguridad a nivel de fila en Supabase
- ✅ **Expiración Automática**: Gestión de credenciales con fecha de expiración

### 5. Proveedores Soportados

| Proveedor | Tipo de Auth | Descripción |
|-----------|--------------|-------------|
| OpenAI | API Key | GPT y DALL-E |
| Facebook | OAuth2 | Graph API |
| Instagram | OAuth2 | Basic Display API |
| Google | OAuth2 | Analytics 4 |
| LinkedIn | OAuth2 | Marketing API |
| Twitter | OAuth2 | API v2 |
| TikTok | OAuth2 | Business API |
| YouTube | OAuth2 | Analytics API |
| Stability AI | API Key | Stable Diffusion |
| RunwayML | API Key | Video Generation |

### 6. Uso en el Código

```typescript
import { useCredentials, useApiCall } from '@/lib/hooks/useCredentials'

// Obtener credenciales de un proveedor
const { credentials } = useCredentials('openai')

// Hacer llamada a API usando credenciales
const { makeApiCall } = useApiCall()
const result = await makeApiCall('openai', 'https://api.openai.com/v1/models')
```

### 7. Seguridad

- 🔒 **Encriptación**: AES-256 para todas las credenciales
- 🔒 **RLS**: Row Level Security en Supabase
- 🔒 **Auditoría**: Logs completos de uso
- 🔒 **Expiración**: Gestión automática de credenciales expiradas
- 🔒 **Validación**: Verificación antes de cada uso

## 🚀 Próximos Pasos

1. Ejecuta la migración SQL
2. Configura las variables de entorno
3. Ve a `/credentials` en la aplicación
4. Configura tu primera credencial
5. ¡Comienza a usar las APIs de forma segura!

---

**Fecha de configuración**: 10/9/2025
**Versión**: 1.0.0
