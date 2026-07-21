# Dashboard Completo de Gestión de Contenido Visual

## Resumen Ejecutivo

El Dashboard de Gestión de Contenido Visual es una plataforma integral que unifica el Sistema de Generación de Hooks Visuales y el Pipeline de Personalización de Contenido en una interfaz centralizada. Esta solución permite gestionar campañas de marketing visual de manera eficiente, con capacidades avanzadas de personalización, testing multivariante, y optimización continua basada en IA.

**Características Principales:**
- **Interfaz Unificada**: Gestión centralizada de todos los sistemas de contenido visual
- **Generación Automática**: Integración con 5+ APIs de IA para creación de contenido
- **Testing Avanzado**: Sistema A/B/C/D con significancia estadística
- **Personalización Inteligente**: IA que adapta contenido por audiencia y plataforma
- **Monitoreo en Tiempo Real**: Dashboards de performance con alertas automáticas
- **Workflow Colaborativo**: Sistema de aprobación multi-nivel con control de versiones

---

## 1. ARQUITECTURA TÉCNICA DEL SISTEMA

### 1.1 Arquitectura General

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DASHBOARD DE GESTIÓN DE CONTENIDO VISUAL                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        FRONTEND LAYER                               │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │   │
│  │  │   Campaign      │  │   Performance   │  │   Content       │   │   │
│  │  │   Management    │  │   Dashboard     │  │   Library       │   │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘   │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │   │
│  │  │   A/B Testing   │  │   ML Config     │  │   Approval      │   │   │
│  │  │   Suite         │  │   Panel         │  │   Workflow      │   │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         API GATEWAY                                 │   │
│  │              (Authentication, Rate Limiting, Routing)               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       MICROSERVICES LAYER                          │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────┐ │   │
│  │  │   Campaign   │  │   Content    │  │  Performance │  │ Testing │ │   │
│  │  │   Service    │  │  Generation  │  │   Analytics  │ │ Service │ │   │
│  │  └──────────────┘  │   Service    │  │   Service    │  └─────────┘ │   │
│  │  ┌──────────────┐  └──────────────┘  └──────────────┘  ┌─────────┐ │   │
│  │  │   User       │  ┌──────────────┐  ┌──────────────┐  │   ML    │ │   │
│  │  │  Management  │  │   Workflow   │  │   Publishing │  │ Service │ │   │
│  │  │   Service    │  │   Service    │  │   Service    │  └─────────┘ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         DATA LAYER                                  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────┐ │   │
│  │  │   Campaign   │  │   Content    │  │   Analytics  │  │  User   │ │   │
│  │  │   Database   │  │   Storage    │  │   Warehouse  │  │  Store  │ │   │
│  │  │ (PostgreSQL) │  │   (S3/CDN)   │  │  (BigQuery)  │ │(Redis)  │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └─────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    EXTERNAL INTEGRATIONS                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────┐ │   │
│  │  │  AI Content  │  │   Social     │  │   Analytics  │  │Marketing│ │   │
│  │  │    APIs      │  │   Platforms  │  │   Platforms  │  │  Tools  │ │   │
│  │  │(OpenAI,RunML)│  │(Meta,TikTok) │  │  (GA4, FB)   │ │ (HubSpot)││   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └─────────┘ │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 Stack Tecnológico Recomendado

#### Frontend
- **Framework**: React 18 con TypeScript
- **UI Library**: Ant Design Pro / Chakra UI
- **State Management**: Zustand / Redux Toolkit
- **Routing**: React Router v6
- **Data Fetching**: TanStack Query (React Query)
- **Charts**: Chart.js / Recharts / D3.js
- **Real-time**: Socket.io-client
- **Build Tool**: Vite

#### Backend
- **Runtime**: Node.js con TypeScript
- **Framework**: NestJS / Fastify
- **API**: GraphQL con Apollo Server
- **Authentication**: Auth0 / Firebase Auth / Supabase Auth
- **Message Queue**: Redis / BullMQ
- **Caching**: Redis
- **File Upload**: Multer + AWS S3

#### Base de Datos
- **Principal**: PostgreSQL 15+
- **Cache**: Redis 7+
- **Analytics**: ClickHouse / BigQuery
- **Search**: Elasticsearch / Typesense
- **File Storage**: AWS S3 / Google Cloud Storage

#### DevOps y Despliegue
- **Containers**: Docker + Docker Compose
- **Orquestación**: Kubernetes / AWS ECS
- **CI/CD**: GitHub Actions / GitLab CI
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Cloud**: AWS / Google Cloud Platform / Azure

#### Integraciones Externas
- **AI Content Generation**: OpenAI GPT-4, RunwayML, Leonardo.ai
- **Social Platforms**: Meta Business API, TikTok Business API
- **Analytics**: Google Analytics 4, Facebook Analytics
- **A/B Testing**: Optimizely, VWO, AB Tasty
- **Marketing Automation**: HubSpot, Mailchimp

### 1.3 Modelos de Base de Datos

```sql
-- Campaigns
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    status campaign_status DEFAULT 'draft',
    objective campaign_objective NOT NULL,
    target_audience JSONB,
    platforms TEXT[] DEFAULT '{}',
    budget_total DECIMAL(10,2),
    budget_daily DECIMAL(10,2),
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Content Templates
CREATE TABLE content_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    category template_category,
    framework marketing_framework,
    template_data JSONB NOT NULL,
    visual_elements JSONB,
    psychological_triggers TEXT[],
    target_audience TEXT[],
    platforms TEXT[],
    performance_score DECIMAL(3,2) DEFAULT 0,
    usage_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Generated Content
CREATE TABLE generated_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id),
    template_id UUID REFERENCES content_templates(id),
    platform social_platform NOT NULL,
    content_type content_type NOT NULL,
    generated_data JSONB NOT NULL,
    ai_provider ai_provider,
    generation_config JSONB,
    status content_status DEFAULT 'generated',
    file_urls TEXT[],
    performance_metrics JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- A/B Testing Experiments
CREATE TABLE ab_experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id),
    name VARCHAR(255) NOT NULL,
    type experiment_type DEFAULT 'ab_test',
    hypothesis TEXT,
    variations JSONB NOT NULL,
    traffic_split JSONB DEFAULT '{"control": 0.5, "variant": 0.5}',
    success_metrics TEXT[],
    status experiment_status DEFAULT 'draft',
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    results JSONB,
    statistical_significance DECIMAL(3,2),
    winner_variation VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Performance Analytics
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES generated_content(id),
    experiment_id UUID REFERENCES ab_experiments(id),
    platform social_platform NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    additional_data JSONB,
    INDEX(content_id, metric_name, timestamp),
    INDEX(experiment_id, metric_name, timestamp)
);

-- Approval Workflows
CREATE TABLE approval_workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES generated_content(id),
    current_stage workflow_stage DEFAULT 'content_review',
    approvers JSONB NOT NULL,
    comments JSONB DEFAULT '[]',
    status approval_status DEFAULT 'pending',
    approved_at TIMESTAMP,
    approved_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Users and Permissions
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'contributor',
    permissions TEXT[],
    profile_data JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 2. INTERFAZ DE USUARIO PARA GESTIÓN DE CAMPAIGNS

### 2.1 Panel Principal de Campaigns

El panel principal proporciona una vista unificada de todas las campañas activas, pendientes y completadas, con acceso rápido a las funciones más utilizadas.

#### 2.1.1 Mockup del Dashboard Principal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🎯 Visual Content Dashboard                    [🔔] [👤 Usuario] [⚙️]       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📊 RESUMEN GENERAL                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐       │
│  │ Campañas    │  │ Contenido   │  │ Conversiones│  │ ROI Total   │       │
│  │ Activas     │  │ Generado    │  │ del Mes     │  │ del Mes     │       │
│  │             │  │             │  │             │  │             │       │
│  │     24      │  │    1,847    │  │   €47,392   │  │    312%     │       │
│  │  ↗️ +12%    │  │  ↗️ +23%    │  │  ↗️ +18%    │  │  ↗️ +45%    │       │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘       │
│                                                                             │
│  🚀 ACCIONES RÁPIDAS                                                        │
│  [➕ Nueva Campaña] [🎨 Generar Contenido] [📊 Ver Analytics] [⚡ A/B Test] │
│                                                                             │
│  📋 CAMPAÑAS RECIENTES                              [🔍 Buscar] [🔽 Filtros]│
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ✅ Black Friday 2024           📱 IG, TikTok    €2,450   85%  🟢     │   │
│  │ 🔄 Verano - Productos Playa    📘 FB, IG       €1,890   72%  🟡     │   │
│  │ 📝 Campaña B2B - SaaS          💼 LI, YT       €890     68%  🟡     │   │
│  │ ⏸️ Navidad - Early Bird        📱 TikTok       €3,200   0%   🔴     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📈 PERFORMANCE EN TIEMPO REAL                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │     Engagement Rate por Plataforma (Últimas 24h)                   │   │
│  │                                                                     │   │
│  │  📱 TikTok    ████████████████████████████████ 8.7%                │   │
│  │  📷 Instagram ████████████████████████████ 6.2%                    │   │
│  │  📘 Facebook  ████████████████████ 4.1%                            │   │
│  │  💼 LinkedIn  ████████████ 2.8%                                    │   │
│  │  🐦 Twitter   ████████ 2.1%                                        │   │
│  │                                                                     │   │
│  │  [Ver Detalle Completo] [Exportar Datos] [Configurar Alertas]     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 2.1.2 Flujo de Creación de Campaigns

**Paso 1: Configuración Básica**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📝 Nueva Campaña - Paso 1/4: Configuración Básica                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📋 INFORMACIÓN GENERAL                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Nombre de la Campaña*                                               │   │
│  │ [Campaña Black Friday 2024 - Moda]                                 │   │
│  │                                                                     │   │
│  │ Descripción                                                         │   │
│  │ [Campaña enfocada en productos de moda para Black Friday,         │   │
│  │  dirigida a millennials y Gen Z interesados en moda sostenible]   │   │
│  │                                                                     │   │
│  │ Objetivo de la Campaña*                                            │   │
│  │ ○ Awareness/Reconocimiento  ○ Engagement/Interacción              │   │
│  │ ● Conversiones/Ventas       ○ Leads/Captación                     │   │
│  │ ○ Retención/Fidelización    ○ Tráfico Web                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📅 PROGRAMACIÓN                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Fecha de Inicio*        Fecha de Finalización                      │   │
│  │ [📅 15/11/2024]         [📅 30/11/2024]                           │   │
│  │                                                                     │   │
│  │ Zona Horaria                                                        │   │
│  │ [Europe/Madrid (CET) ▼]                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  💰 PRESUPUESTO                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Presupuesto Total        Presupuesto Diario (Opcional)             │   │
│  │ [€ 5,000]                [€ 200]                                   │   │
│  │                                                                     │   │
│  │ 📊 Distribución por Plataforma (se calculará automáticamente)      │   │
│  │ Instagram: €2,000  TikTok: €2,500  Facebook: €500                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                           [← Atrás]  [Siguiente: Audiencia →]              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Paso 2: Definición de Audiencia**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🎯 Nueva Campaña - Paso 2/4: Definición de Audiencia                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  👥 SEGMENTACIÓN DEMOGRÁFICA                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Edad                    Género                                      │   │
│  │ [18] - [35] años       ☑️ Mujeres  ☑️ Hombres  ☐ No binario        │   │
│  │                                                                     │   │
│  │ Ubicación Geográfica                                                │   │
│  │ [España, México, Argentina] [+ Añadir país/región]                │   │
│  │                                                                     │   │
│  │ Idiomas                                                             │   │
│  │ ☑️ Español  ☑️ Catalán  ☐ Inglés  ☐ Francés  [+ Más idiomas]     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  💼 PERFIL PSICOGRÁFICO                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ☑️ Eco-conscious Millennials    ☑️ Fashion Forward Gen Z           │   │
│  │ ☑️ Value Seekers               ☐ Luxury Enthusiasts               │   │
│  │ ☑️ Social Media Natives        ☐ Brand Loyalists                  │   │
│  │ ☐ Early Tech Adopters         ☑️ Sustainable Lifestyle           │   │
│  │                                                                     │   │
│  │ [🔗 Usar Audiencia de Campaña Anterior] [🤖 Generar con IA]       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📱 COMPORTAMIENTO DIGITAL                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Plataformas Preferidas                                              │   │
│  │ ☑️ Instagram (Stories, Reels, Posts)  ☑️ TikTok (Videos, Lives)   │   │
│  │ ☑️ Facebook (Posts, Groups)          ☐ LinkedIn (Posts, Articles) │   │
│  │ ☐ Twitter/X (Tweets, Spaces)        ☐ YouTube (Videos, Shorts)   │   │
│  │                                                                     │   │
│  │ Horarios de Mayor Actividad                                         │   │
│  │ 🌅 Mañana (6-12h): 15%    🌞 Tarde (12-18h): 35%                 │   │
│  │ 🌆 Noche (18-24h): 40%    🌙 Madrugada (0-6h): 10%               │   │
│  │                                                                     │   │
│  │ Tipos de Contenido que Prefieren                                    │   │
│  │ ☑️ Videos Cortos  ☑️ Imágenes Estéticas  ☑️ Contenido Educativo  │   │
│  │ ☑️ User Generated Content  ☐ Lives/Streams  ☐ Infografías        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📈 ESTIMACIÓN DE ALCANCE                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Audiencia Total Estimada: ~2.3M usuarios                          │   │
│  │ ┌─────────────────────────────────────────────────────────────┐   │   │
│  │ │ Instagram: 1.2M  TikTok: 980K  Facebook: 420K             │   │   │
│  │ └─────────────────────────────────────────────────────────────┘   │   │
│  │ CPM Estimado: €1.20-€2.80 | CTR Esperado: 2.1-4.7%              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                      [← Atrás]  [Siguiente: Contenido →]                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Paso 3: Estrategia de Contenido**

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🎨 Nueva Campaña - Paso 3/4: Estrategia de Contenido                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📋 FRAMEWORKS DE MARKETING                                                 │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Selecciona los frameworks para esta campaña:                       │   │
│  │                                                                     │   │
│  │ ☑️ Hook-Story-Offer (HSO)                                          │   │
│  │    └─ Ideal para conversión directa y storytelling                │   │
│  │                                                                     │   │
│  │ ☑️ Dream 100 - Infiltración                                        │   │
│  │    └─ Aprovecha autoridad de influencers y figuras de confianza   │   │
│  │                                                                     │   │
│  │ ☐ Personaje Atractivo                                              │   │
│  │    └─ Desarrolla el carácter de marca y conecta emocionalmente    │   │
│  │                                                                     │   │
│  │ ☑️ Desencadenantes Psicológicos                                    │   │
│  │    └─ Urgencia, escasez, prueba social para maximizar conversión  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  🎭 TIPOS DE CONTENIDO A GENERAR                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Para Instagram:                                                     │   │
│  │ ☑️ Posts Cuadrados (1080x1080) - 15 piezas                        │   │
│  │ ☑️ Stories Verticales (1080x1920) - 25 piezas                     │   │
│  │ ☑️ Reels Cortos (15-30s) - 20 videos                              │   │
│  │ ☑️ Carouseles Informativos - 10 sets                              │   │
│  │                                                                     │   │
│  │ Para TikTok:                                                        │   │
│  │ ☑️ Videos Verticales (9:16) - 30 piezas                           │   │
│  │ ☑️ Trends Adaptados - 15 piezas                                   │   │
│  │ ☑️ Behind-the-scenes - 10 piezas                                  │   │
│  │                                                                     │   │
│  │ Para Facebook:                                                      │   │
│  │ ☑️ Posts con Link Preview - 12 piezas                             │   │
│  │ ☑️ Videos Cuadrados - 8 piezas                                    │   │
│  │ ☐ Eventos en Vivo                                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  🎨 ESTILO VISUAL Y BRANDING                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Paleta de Colores                                                   │   │
│  │ 🎯 Principal: #FF4757 (Rojo vibrante)                              │   │
│  │ 🎨 Secundario: #2F3542 (Gris oscuro)                              │   │
│  │ ✨ Acento: #FFD700 (Dorado)                                        │   │
│  │ 🤍 Neutro: #F8F9FA (Blanco roto)                                   │   │
│  │                                                                     │   │
│  │ Tipografía                                                          │   │
│  │ 📍 Headings: Montserrat Bold                                       │   │
│  │ 📝 Body: Open Sans Regular                                         │   │
│  │ 🎯 CTA: Nunito Black                                               │   │
│  │                                                                     │   │
│  │ Estilo Fotográfico                                                  │   │
│  │ ☑️ Lifestyle/Cotidiano  ☑️ Product Shots  ☐ Fashion Editorial     │   │
│  │ ☑️ User Generated Content  ☑️ Behind-the-scenes  ☐ Stock Photos   │   │
│  │                                                                     │   │
│  │ [📁 Subir Brand Guidelines] [🎨 Usar Plantilla Existente]         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📊 CONFIGURACIÓN A/B TESTING                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ ☑️ Activar Testing Automático                                      │   │
│  │                                                                     │   │
│  │ Variables a Testear:                                                │   │
│  │ ☑️ Headlines/Títulos (3 variaciones)                              │   │
│  │ ☑️ Call-to-Actions (3 opciones)                                   │   │
│  │ ☑️ Colores de CTA (2 opciones)                                    │   │
│  │ ☑️ Estilo de imagen (2 variaciones)                               │   │
│  │                                                                     │   │
│  │ Duración del Test: [7] días | Confianza: [95%]                   │   │
│  │ División de Tráfico: Control 25% | Variantes 25% cada una         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│                         [← Atrás]  [Siguiente: Revisión →]                 │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Biblioteca de Templates

La biblioteca de templates proporciona acceso organizado a todos los frameworks y plantillas disponibles, con funciones de búsqueda, filtrado y preview.

#### 2.2.1 Interfaz de la Biblioteca

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📚 Biblioteca de Templates                          [🔍] [➕ Nuevo Template]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  🔍 FILTROS Y BÚSQUEDA                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ [Buscar por nombre o descripción...]                               │   │
│  │                                                                     │   │
│  │ Framework:        Plataforma:         Audiencia:        Objetivo:  │   │
│  │ [Todos      ▼]   [Todas       ▼]     [Todas      ▼]    [Todos   ▼] │   │
│  │                                                                     │   │
│  │ Performance:      Uso:               Actualizado:                   │   │
│  │ [⭐ Todos   ▼]   [Frecuente   ▼]     [Últimos 30 días       ▼]     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📊 TEMPLATES DESTACADOS                                     [Ver Todos →] │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🏆 HSO-001: Problem Agitation Hook                    ⭐ 4.9 | 🔥 847 │   │
│  │    └─ Instagram, TikTok | Conversión | Actualizado: hace 2 días    │   │
│  │                                                                     │   │
│  │ 🥈 D100-002: Name Drop Authority                      ⭐ 4.8 | 🔥 743 │   │
│  │    └─ LinkedIn, YouTube | Autoridad | Actualizado: hace 1 semana   │   │
│  │                                                                     │   │
│  │ 🥉 PA-001: Reluctant Hero Hook                        ⭐ 4.7 | 🔥 692 │   │
│  │    └─ Todas las plataformas | Branding | Actualizado: hace 3 días  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📋 TODOS LOS TEMPLATES                          [🔀 Vista: Grid] [📊 Métricas]│
│  ┌───────┬─────────────────────────────┬────────────┬──────────┬──────────┐  │
│  │ Thumb │ Nombre                      │ Framework  │ Platforms│ Score    │  │
│  ├───────┼─────────────────────────────┼────────────┼──────────┼──────────┤  │
│  │ [📱]  │ HSO-001: Problem Agitation  │ HSO        │ IG,TT,FB │ ⭐ 4.9   │  │
│  │ [👑]  │ D100-002: Name Drop Auth    │ Dream 100  │ LI,YT,IG │ ⭐ 4.8   │  │
│  │ [🦸]  │ PA-001: Reluctant Hero      │ Attr Char  │ ALL      │ ⭐ 4.7   │  │
│  │ [🧠]  │ TP-001: Scarcity + Social   │ Psych Trig │ IG,FB,TT │ ⭐ 4.6   │  │
│  │ [❄️]  │ TT-001: Cold Traffic Edu    │ Traffic    │ YT,FB,LI │ ⭐ 4.5   │  │
│  │ [🔥]  │ TT-002: Warm Nurturing      │ Traffic    │ IG,Email │ ⭐ 4.4   │  │
│  │ [💰]  │ TT-003: Hot Conversion      │ Traffic    │ Email,Ad │ ⭐ 4.3   │  │
│  │ [📈]  │ HSO-002: Transformation     │ HSO        │ YT,IG,TT │ ⭐ 4.2   │  │
│  │ [🎯]  │ D100-001: Insider Access    │ Dream 100  │ LI,IG,TT │ ⭐ 4.1   │  │
│  │ [⚡]  │ PA-002: Challenger Adv      │ Attr Char  │ TT,IG,TW │ ⭐ 4.0   │  │
│  └───────┴─────────────────────────────┴────────────┴──────────┴──────────┘  │
│                                                                             │
│  [← Anterior] [1] [2] [3] [4] [5] [Siguiente →]        Mostrando 1-10 de 47 │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 2.2.2 Vista Detallada de Template

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📱 Template HSO-001: Problem Agitation Hook                    [⭐ Favorito]│
├─────────────────────────────────────────────────────────────────────────────┤
│  [← Volver a Biblioteca]                                  [✏️ Editar] [📄 Copiar] │
│                                                                             │
│  📊 MÉTRICAS Y PERFORMANCE                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Rating: ⭐⭐⭐⭐⭐ 4.9/5 (847 usos) | CTR Promedio: 6.7% | CVR: 12.3% │   │
│  │ Mejor Plataforma: Instagram Reels | Mejor Audiencia: Millennials   │   │
│  │ Última Actualización: hace 2 días | Creado: 15/09/2024            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  🎯 CONFIGURACIÓN DEL TEMPLATE                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Framework: Hook-Story-Offer (HSO)                                  │   │
│  │ Tipo: Problem Agitation Hook                                       │   │
│  │ Objetivo: Conversión directa, generación de leads                  │   │
│  │                                                                     │   │
│  │ Audiencia Target:                                                   │   │
│  │ • Solution Seekers (Principal)                                     │   │
│  │ • Problem-Aware Prospects                                          │   │
│  │ • Value-Conscious Consumers                                        │   │
│  │                                                                     │   │
│  │ Plataformas Optimizadas:                                           │   │
│  │ 📱 Instagram Reels (⭐ Excelente)  📱 TikTok (⭐ Muy bueno)      │   │
│  │ 📘 Facebook Posts (✅ Bueno)                                       │   │
│  │                                                                     │   │
│  │ Triggers Psicológicos:                                             │   │
│  │ 🧠 Problem Awareness  🤝 Relatability  💡 Solution Desire        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📱 PREVIEW Y ESTRUCTURA                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ FASE HOOK (3-4 segundos):                                          │   │
│  │ ┌─────────────────────────────────────────────────────────────┐   │   │
│  │ │ 💥 "¿Te ha pasado que [PROBLEMA ESPECÍFICO Y RELATABLE]?"  │   │   │
│  │ │                                                             │   │   │
│  │ │ Visual: Scenario relatable del problema                    │   │   │
│  │ │ Efectos: Emotional color grading, close-up shots          │   │   │
│  │ └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │ FASE STORY (8-12 segundos):                                        │   │
│  │ ┌─────────────────────────────────────────────────────────────┐   │   │
│  │ │ 📖 "Yo también pasé por eso exactamente. Hace [TIEMPO]     │   │   │
│  │ │     estaba en la misma situación y descubrí que..."        │   │   │
│  │ │                                                             │   │   │
│  │ │ Visual: Personal journey montage                           │   │   │
│  │ │ Efectos: Timeline animation, before-after transitions     │   │   │
│  │ └─────────────────────────────────────────────────────────────┘   │   │
│  │                                                                     │   │
│  │ FASE OFFER (4-6 segundos):                                         │   │
│  │ ┌─────────────────────────────────────────────────────────────┐   │   │
│  │ │ 🎯 "Y ahora puedes obtener el mismo resultado que yo       │   │   │
│  │ │     conseguí. Te muestro cómo paso a paso..."              │   │   │
│  │ │                                                             │   │   │
│  │ │ Visual: Solution demonstration                             │   │   │
│  │ │ Efectos: Results animation, CTA highlight                 │   │   │
│  │ └─────────────────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  🔧 VARIABLES PERSONALIZABLES                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ • [PROBLEMA_ESPECÍFICO]: Descripción del problema principal        │   │
│  │ • [TIEMPO]: Cuándo experimentaste el problema                      │   │
│  │ • [SITUACIÓN]: Contexto específico de la experiencia               │   │
│  │ • [SOLUCIÓN]: Qué específico resolvió el problema                  │   │
│  │ • [RESULTADO]: Beneficio concreto obtenido                         │   │
│  │ • [CTA]: Call-to-action específico                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ⚡ ACCIONES RÁPIDAS                                                        │
│  [🚀 Generar Contenido] [📊 Ver Estadísticas] [💾 Agregar a Favoritos]    │
│  [📋 Copiar Template] [✏️ Personalizar] [📤 Compartir] [❌ Reportar]       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. VISUALIZACIÓN EN TIEMPO REAL DE PERFORMANCE

### 3.1 Dashboard Principal de Analytics

El sistema de analytics proporciona monitoreo en tiempo real de todas las métricas críticas, con capacidad de drill-down hasta el nivel de contenido individual.

#### 3.1.1 Vista General de Performance

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📊 Dashboard de Performance                          Última actualización: │
│                                            🔴 En Vivo | hace 2 minutos     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ⚡ MÉTRICAS EN TIEMPO REAL                                [⚙️ Configurar] │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🔥 Engagement Rate    📈 Click-Through Rate   💰 Conversion Rate    │   │
│  │                                                                     │   │
│  │     7.8%                    4.2%                    12.3%          │   │
│  │   ↗️ +1.2%                ↗️ +0.8%                ↗️ +2.1%          │   │
│  │                                                                     │   │
│  │ 👥 Alcance Total      💬 Interacciones       €💸 ROAS             │   │
│  │                                                                     │   │
│  │   847,392                  65,847                   4.7x            │   │
│  │  ↗️ +12.4%               ↗️ +18.6%               ↗️ +0.9x           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📱 PERFORMANCE POR PLATAFORMA                    [📊 Cambiar Vista] [⏰ 24h]│
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                     │   │
│  │ 📱 TikTok        █████████████████████████████████████ 8.9%        │   │
│  │    👥 347K alcance  💬 31K interacciones  €💰 €1,247 gasto        │   │
│  │                                                                     │   │
│  │ 📷 Instagram     █████████████████████████████████ 7.1%            │   │
│  │    👥 289K alcance  💬 20.5K interacciones  €💰 €1,156 gasto      │   │
│  │                                                                     │   │
│  │ 📘 Facebook      ████████████████████████ 5.3%                     │   │
│  │    👥 156K alcance  💬 8.3K interacciones  €💰 €743 gasto         │   │
│  │                                                                     │   │
│  │ 💼 LinkedIn      ████████████████ 3.7%                             │   │
│  │    👥 45K alcance   💬 1.7K interacciones  €💰 €234 gasto         │   │
│  │                                                                     │   │
│  │ 🐦 Twitter       ████████ 2.1%                                     │   │
│  │    👥 23K alcance   💬 483 interacciones   €💰 €67 gasto          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  🏆 TOP PERFORMERS (Últimas 24h)                        [Ver Todos →]     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 1. 🔥 "5 errores que cometes sin darte cuenta"     📱 TikTok       │   │
│  │    ⚡ 47.2K views | 💬 3.8K comments | 🔄 892 shares | ❤️ 12.3K likes │   │
│  │                                                                     │   │
│  │ 2. ✨ "Transformación en 30 días - Antes/Después"  📷 Instagram    │   │
│  │    ⚡ 34.7K reach | 💬 1.2K comments | 🔄 456 saves | ❤️ 8.9K likes  │   │
│  │                                                                     │   │
│  │ 3. 💡 "El secreto que cambió mi negocio"           💼 LinkedIn     │   │
│  │    ⚡ 12.1K impressions | 💬 234 comments | 🔄 89 reposts | ❤️ 567 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  🎯 OBJETIVOS VS REALIDAD                              [🎯 Editar Objetivos]│
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Engagement Rate       Meta: 6.5% | Real: 7.8% | ✅ +20% sobre meta  │   │
│  │ Click-Through Rate    Meta: 3.8% | Real: 4.2% | ✅ +11% sobre meta  │   │
│  │ Conversion Rate       Meta: 10%  | Real: 12.3%| ✅ +23% sobre meta  │   │
│  │ ROAS                  Meta: 4.0x | Real: 4.7x | ✅ +18% sobre meta  │   │
│  │ Costo por Lead        Meta: €12  | Real: €9.30| ✅ -23% bajo meta   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  🚨 ALERTAS Y NOTIFICACIONES                           [⚙️ Configurar Alertas]│
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🟢 Todo funcionando correctamente                                   │   │
│  │ 🟡 Campaña "Verano 2024" con CTR bajo de lo normal (-15%)          │   │
│  │ 🟢 Nuevo record de engagement en TikTok (+47% vs ayer)             │   │
│  │ 🔴 Presupuesto de Facebook alcanzado al 95% (€4,750 de €5,000)     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Analytics Detallado por Campaña

Cada campaña tiene su propio dashboard detallado con métricas específicas, análisis de audiencia, y comparaciones históricas.

#### 3.2.1 Vista de Campaña Individual

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📊 Análisis: Campaña Black Friday 2024                [📅 15/11 - 30/11/24]│
├─────────────────────────────────────────────────────────────────────────────┤
│  [← Dashboard Principal]                        [📊 Exportar] [🔔 Alertas] │
│                                                                             │
│  🎯 RESUMEN DE CAMPAÑA                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Estado: 🟢 Activa | Progreso: ████████░░ 73% completada              │   │
│  │ Presupuesto: €3,650 / €5,000 (73% usado) | Días restantes: 4        │   │
│  │ Objetivo: Conversiones | Meta: 500 ventas | Actual: 347 ventas      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📈 MÉTRICAS PRINCIPALES                              [⏰ Última hora] [📊 CVR] │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │           Hoy         Ayer        Promedio    Mejor Día             │   │
│  │  👥 Alcance    67.2K      54.8K       61.3K      89.4K (22/11)     │   │
│  │  👁️ Impresiones 234.7K    189.3K     201.5K     312.8K (23/11)     │   │
│  │  💬 Interacciones 14.8K    12.1K      13.7K     21.9K (21/11)      │   │
│  │  🔗 Clicks      3.1K      2.8K       2.9K      4.7K (20/11)       │   │
│  │  💰 Conversiones  29        23         26        47 (23/11)        │   │
│  │  € Ingresos    €2,847    €2,156    €2,534    €4,623 (23/11)     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📊 GRÁFICO DE TENDENCIAS                           [📅 Últimos 7 días] [⚙️] │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Conversiones por Día                                                │   │
│  │                                                                     │   │
│  │  50│                                          ●                     │   │
│  │    │                                       ●     ●                  │   │
│  │  40│                                    ●           ●               │   │
│  │    │                               ●                   ●            │   │
│  │  30│                          ●                          ●          │   │
│  │    │                      ●                               ●         │   │
│  │  20│                 ●                                     ●        │   │
│  │    │            ●                                           ●       │   │
│  │  10│       ●                                                 ●      │   │
│  │    │  ●                                                       ●     │   │
│  │   0└────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────    │   │
│  │     15/11 17/11 19/11 21/11 23/11 25/11 27/11 29/11              │   │
│  │                                                                     │   │
│  │  ━━━ Conversiones  ━━━ Objetivo Diario  ░░░ Tendencia              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  🎭 PERFORMANCE POR CONTENIDO                        [🔄 Actualizar] [📋 Ver Lista]│
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🥇 Top Performer                                                    │   │
│  │ "⚡ Black Friday: 70% OFF - Solo hoy"                              │   │
│  │ 📱 Instagram Reel | 🎯 HSO-001 Framework                          │   │
│  │ ────────────────────────────────────────────────────────────        │   │
│  │ 👁️ 87.3K views | 💬 2.1K comments | 🔄 1.8K shares | ❤️ 15.6K likes │   │
│  │ 🔗 4.7K clicks | 💰 67 conversiones | 💵 CVR: 14.2% | €8,934 revenue│   │
│  │                                                                     │   │
│  │ 🥈 Segunda Posición                                                 │   │
│  │ "🎁 Regalos que amarán - Guía definitiva"                         │   │
│  │ 📱 TikTok Video | 🎯 D100-002 Framework                           │   │
│  │ ────────────────────────────────────────────────────────────        │   │
│  │ 👁️ 94.7K views | 💬 3.4K comments | 🔄 2.3K shares | ❤️ 18.9K likes │   │
│  │ 🔗 3.2K clicks | 💰 41 conversiones | 💵 CVR: 12.8% | €5,453 revenue│   │
│  │                                                                     │   │
│  │ 🥉 Tercera Posición                                                 │   │
│  │ "💡 5 secretos para ahorrar este Black Friday"                    │   │
│  │ 📘 Facebook Post | 🎯 TP-001 Framework                            │   │
│  │ ────────────────────────────────────────────────────────────        │   │
│  │ 👁️ 45.2K reach | 💬 892 comments | 🔄 567 shares | ❤️ 6.7K likes   │   │
│  │ 🔗 2.1K clicks | 💰 29 conversiones | 💵 CVR: 13.8% | €3,887 revenue│   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  👥 ANÁLISIS DE AUDIENCIA                              [🔍 Ver Detalles] │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Demografía Principal:                                               │   │
│  │ 👩 Mujeres 65% | 👨 Hombres 35%                                    │   │
│  │ 🔢 Edad: 25-34 (47%) | 35-44 (28%) | 18-24 (25%)                  │   │
│  │ 🌍 Países: España (67%) | México (18%) | Argentina (15%)           │   │
│  │                                                                     │   │
│  │ Intereses Principales:                                              │   │
│  │ 🛍️ Moda y Belleza (89%) | 🏠 Hogar (67%) | 💻 Tecnología (45%)     │   │
│  │ 🌱 Sostenibilidad (78%) | 💰 Ofertas (92%) | 🎭 Lifestyle (56%)    │   │
│  │                                                                     │   │
│  │ Horarios de Mayor Actividad:                                       │   │
│  │ 🌅 Mañana: 12% | 🌞 Tarde: 34% | 🌆 Noche: 46% | 🌙 Madrugada: 8%  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Comparación de Variaciones A/B/C/D

El sistema proporciona análisis estadístico detallado de todas las pruebas en ejecución, con recomendaciones automáticas basadas en significancia estadística.

#### 3.3.1 Panel de A/B Testing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🧪 A/B Testing: Comparación de Headlines              [Estado: 🟢 En Curso]│
├─────────────────────────────────────────────────────────────────────────────┤
│  [← Volver a Campaña]                    [⏸️ Pausar Test] [📊 Exportar Datos]│
│                                                                             │
│  ⚙️ CONFIGURACIÓN DEL EXPERIMENTO                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Nombre: Headlines Black Friday Test                                 │   │
│  │ Hipótesis: Headlines con urgencia convertirán mejor que informativos│   │
│  │ Duración: 7 días (día 5/7) | Confianza: 95% | Poder: 80%          │   │
│  │ Métrica Principal: Conversion Rate | Tráfico: 25% cada variación   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📊 RESULTADOS ACTUALES                               [🔄 Actualizar Datos] │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    │ Control (A) │ Variant B   │ Variant C   │ Variant D │
│  │                    │             │             │             │           │
│  │ 👁️ Impresiones      │    47.2K    │    46.8K    │    47.5K    │   46.1K   │
│  │ 🔗 Clicks           │     2.1K    │     2.4K    │     1.9K    │    2.7K   │
│  │ 💰 Conversiones     │      23     │      31     │      18     │     42    │
│  │                    │             │             │             │           │
│  │ 📊 CTR              │    4.45%    │    5.13%    │    4.00%    │   5.86%   │
│  │ 📊 CVR              │    1.10%    │    1.29%    │    0.95%    │   1.56%   │
│  │ 💵 CPC              │   €1.74     │   €1.52     │   €1.91     │  €1.35    │
│  │ 💵 CPA              │   €70.43    │   €58.71    │   €80.17    │  €54.76   │
│  │                    │             │             │             │           │
│  │ 📈 Lift vs Control │      -      │   +17.3%    │   -13.6%    │  +41.8%   │
│  │ 🎯 Significancia    │      -      │     76%     │     44%     │    94%    │
│  │ 🏆 Estado          │   Baseline  │  Promising  │ Underperform│  Winner   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📝 VARIACIONES DEL TEST                                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🅰️ Control (Baseline):                                               │   │
│  │ "Descubre nuestras ofertas especiales de Black Friday"             │   │
│  │ └─ Enfoque informativo, sin urgencia                               │   │
│  │                                                                     │   │
│  │ 🅱️ Variant B (+17.3% lift):                                         │   │
│  │ "⏰ Black Friday: Solo quedan 48 horas para estas ofertas"        │   │
│  │ └─ Añade urgencia temporal específica                              │   │
│  │                                                                     │   │
│  │ 🅲 Variant C (-13.6% lift):                                         │   │
│  │ "Black Friday 2024: Productos seleccionados con descuentos"       │   │
│  │ └─ Más formal y menos emocional                                    │   │
│  │                                                                     │   │
│  │ 🅳 Variant D (+41.8% lift): 🏆 GANADOR PROBABLE                     │   │
│  │ "🔥 ¡ÚLTIMO DÍA! Black Friday -70% - No te lo pierdas"           │   │
│  │ └─ Combina urgencia, descuento específico y FOMO                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  📈 GRÁFICO DE EVOLUCIÓN                             [📅 Últimos 5 días] │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ Conversion Rate por Día                                             │   │
│  │                                                                     │   │
│  │ 2.0%│                                               ●D              │   │
│  │     │                                            ●     ●            │   │
│  │ 1.5%│                          ●D              ●                    │   │
│  │     │        ●B              ●     ●B       ●                       │   │
│  │ 1.0%│    ●A     ●A        ●A        ●A   ●A                        │   │
│  │     │         ●C     ●C                ●C                           │   │
│  │ 0.5%│                            ●C                                 │   │
│  │     │                                                               │   │
│  │ 0.0%└────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────        │   │
│  │      Día 1  Día 2  Día 3  Día 4  Día 5                           │   │
│  │                                                                     │   │
│  │  ●━━● Control A  ●━━● Variant B  ●━━● Variant C  ●━━● Variant D     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  🎯 RECOMENDACIONES AUTOMÁTICAS                        [✅ Aplicar] [❌ Ignorar]│
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ 🏆 RECOMENDACIÓN PRINCIPAL:                                         │   │
│  │ Variant D es el ganador con 94% de confianza estadística.          │   │
│  │ Lift de +41.8% vs control con CPA 22% menor.                      │   │
│  │                                                                     │   │
│  │ 📋 ACCIONES SUGERIDAS:                                             │   │
│  │ 1. ✅ Implementar Variant D como nuevo control                     │   │
│  │ 2. ⏸️ Pausar Variant C (performance significativamente inferior)   │   │
│  │ 3. 🔄 Crear nuevo test basado en elementos de Variant D           │   │
│  │ 4. 📊 Aplicar learnings a otras campañas similares                │   │
│  │                                                                     │   │
│  │ 💡 INSIGHTS CLAVE:                                                 │   │
│  │ • La urgencia temporal específica mejora significativamente el CTR │   │
│  │ • Los emojis y el copy emocional incrementan el engagement        │   │
│  │ • El descuento específico (-70%) funciona mejor que genérico      │   │
│  │ • La combinación FOMO + urgencia es altamente efectiva            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

