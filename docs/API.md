# API Documentation - MarketPro GT

## Edge Functions

### generate-content

Genera contenido para redes sociales usando OpenAI GPT-5-nano.

**Endpoint:** `POST /functions/v1/generate-content`

**Headers:**
```
Authorization: Bearer <supabase_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "client_id": "string (required)",
  "type": "post | strategy | analysis (required)",
  "platform": "facebook | instagram | linkedin | tiktok | twitter (optional, default: general)",
  "topic": "string (optional)",
  "tone": "string (optional, default: profesional)",
  "custom_prompt": "string (optional)",
  "openai_api_key": "string (optional)"
}
```

**Response:**
```json
{
  "data": {
    "client_info": {
      "id": "string",
      "name": "string",
      "industry": "string"
    },
    "generation_timestamp": "string (ISO 8601)",
    "content_type": "string",
    "platform": "string",
    "hook": "string",
    "story": "string",
    "offer": "string",
    "content_body": "string",
    "hashtags": ["string"],
    "call_to_action": "string",
    "platform_optimization": {
      "character_count": "number",
      "optimal_posting_time": "string"
    },
    "optimal_posting_time": "string",
    "engagement_prediction": {
      "predicted_engagement_rate": "string",
      "expected_reach": "string",
      "estimated_likes": "string",
      "estimated_comments": "string"
    },
    "hashtag_suggestions": ["string"],
    "suggested_media": ["string"],
    "fallback": "boolean"
  }
}
```

**Error Response:**
```json
{
  "error": {
    "code": "CONTENT_GENERATION_FAILED",
    "message": "string",
    "timestamp": "string (ISO 8601)"
  }
}
```

### generate-marketing-strategy

Genera estrategias de marketing usando frameworks de Russell Brunson.

**Endpoint:** `POST /functions/v1/generate-marketing-strategy`

**Request Body:**
```json
{
  "clientId": "string (required)",
  "strategyType": "string (required)",
  "framework": "string (required)",
  "targetAudience": "string (optional)",
  "productInfo": {
    "name": "string",
    "industry": "string",
    "valueProposition": "string"
  },
  "businessGoals": ["string"],
  "customRequirements": "string (optional)",
  "openai_api_key": "string (optional)"
}
```

**Response:**
```json
{
  "data": {
    "strategy": {
      "title": "string",
      "framework": "string",
      "objectives": ["string"],
      "tactics": ["string"],
      "timeline": "string",
      "budget": "string",
      "kpis": ["string"]
    },
    "client_info": {
      "id": "string",
      "name": "string"
    },
    "generation_timestamp": "string (ISO 8601)"
  }
}
```

## Database Schema

### clients
```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business_type TEXT NOT NULL,
  description TEXT,
  website_url TEXT,
  logo_url TEXT,
  target_audience TEXT,
  primary_goal TEXT,
  social_profiles JSONB,
  api_credentials JSONB,
  is_active BOOLEAN DEFAULT true,
  user_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Campos adicionales
  industry TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  country TEXT DEFAULT 'Guatemala',
  competitors TEXT[],
  unique_value_proposition TEXT,
  created_by UUID REFERENCES auth.users(id)
);
```

### campaigns
```sql
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  objective TEXT,
  budget DECIMAL(10,2),
  framework TEXT,
  status TEXT DEFAULT 'planning',
  client_id UUID REFERENCES clients(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### content
```sql
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  campaign_id UUID REFERENCES campaigns(id),
  content_type TEXT NOT NULL,
  platform TEXT NOT NULL,
  content_data JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### strategies
```sql
CREATE TABLE strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id),
  strategy_type TEXT NOT NULL,
  framework TEXT NOT NULL,
  strategy_data JSONB NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Authentication

### Authorized Users
La aplicación utiliza un sistema de whitelist para usuarios autorizados:

```typescript
const authorizedEmails = [
  'tiendastsgt@gmail.com',
  'admin@agencia.com',
  'test@agencia.com'
];
```

### Row Level Security (RLS)
Todas las tablas tienen RLS habilitado con políticas específicas:

```sql
-- Ejemplo para tabla clients
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own clients" ON clients
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients" ON clients
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## Environment Variables

### Required
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key
```

### Optional
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

## Error Handling

### Common Error Codes
- `CONTENT_GENERATION_FAILED`: Error en generación de contenido
- `STRATEGY_GENERATION_FAILED`: Error en generación de estrategia
- `INVALID_CLIENT`: Cliente no válido o no encontrado
- `UNAUTHORIZED`: Usuario no autorizado
- `MISSING_PARAMETERS`: Parámetros requeridos faltantes

### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "timestamp": "2025-09-09T20:00:00.000Z"
  }
}
```
