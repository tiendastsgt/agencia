# 🏗️ ESTRUCTURA COMPLETA DEL PROYECTO - MarketPro GT v2.1.0

**Fecha de Actualización:** 12 de Enero, 2025  
**Versión:** v2.1.0 - PRODUCCIÓN ESTABLE  
**Estado:** ✅ COMPLETAMENTE FUNCIONAL

---

## 📋 ÍNDICE

1. [Arquitectura General](#arquitectura-general)
2. [Frontend - src/](#frontend---src)
3. [Backend - Base de Datos](#backend---base-de-datos)
4. [Configuración y Deploy](#configuración-y-deploy)
5. [Documentación](#documentación)
6. [Scripts y Utilidades](#scripts-y-utilidades)
7. [Estado Actual](#estado-actual)
8. [Próximos Pasos](#próximos-pasos)

---

## 🏗️ ARQUITECTURA GENERAL

```
agencia_V1/
├── 📱 Frontend (React + TypeScript + Vite)
├── 🗄️ Backend (Supabase + PostgreSQL)
├── ⚙️ Configuración y Deploy
├── 📚 Documentación
└── 🧪 Scripts y Utilidades
```

### 🛠️ **Stack Tecnológico**
- **Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend:** Supabase (BaaS) + PostgreSQL
- **APIs:** OpenAI, Facebook, Instagram, LinkedIn, Twitter, YouTube, TikTok
- **IA:** DALL-E 3, Stability AI, Midjourney, Gemini, RunwayML, Pika Labs, Luma AI
- **ML:** Multi-Armed Bandit, Reinforcement Learning, TensorFlow.js

---

## 📱 FRONTEND - src/

### 🎯 **Páginas Principales (src/pages/)**

```
pages/
├── 🏠 Dashboard.tsx                    # Panel principal del sistema
├── 👥 ClientsPage.tsx                  # Gestión completa de clientes
├── 📊 CampaignsPage.tsx                # Gestión de campañas de marketing
├── 🤖 AIContentGenerator.tsx           # Generador de contenido con IA
├── 📄 ContentPage.tsx                  # Gestión y edición de contenido
├── 📈 AnalyticsPage.tsx                # Analytics básicos y métricas
├── 📊 AdvancedAnalyticsPage.tsx        # Analytics avanzados con ML
├── ⚙️ AutomationPage.tsx               # Automatización de campañas
├── 🎯 StrategiesPage.tsx               # Estrategias básicas de marketing
├── 💎 PremiumStrategiesPage.tsx        # Estrategias premium avanzadas
├── 🔐 CredentialsPage.tsx              # Gestión de credenciales API
├── 🔗 ApiConnectionsPage.tsx           # Conexiones y estado de APIs
├── 🧪 ABTestingPage.tsx                # A/B Testing con Multi-Armed Bandit
├── 🧠 RLExperimentsPage.tsx            # Experimentos de Reinforcement Learning
├── 😊 SentimentAnalysisPage.tsx        # Análisis de sentimientos
├── 🖼️ ImageGenerationPage.tsx          # Generación de imágenes con IA
├── 🎥 VideoGenerationPage.tsx          # Generación de videos con IA
├── 🔍 AIMarketAnalysis.tsx             # Análisis de mercado con IA
├── 📚 ResearchPage.tsx                 # Investigación y análisis
├── 🧪 RLExperimentPage.tsx             # Experimento individual RL
├── 🏠 PlaceholderPage.tsx              # Página placeholder
├── 🔐 LoginPage.tsx                    # Página de login
├── 🔐 LoginPageOld.tsx                 # Página de login antigua
├── 🔄 AuthCallback.tsx                 # Callback de autenticación
└── 🌐 Redes Sociales:
    ├── 📘 FacebookInstagramPage.tsx     # Facebook e Instagram
    ├── 🐦 TwitterPage.tsx              # Twitter/X
    ├── 💼 LinkedInPage.tsx             # LinkedIn
    ├── 📺 YouTubePage.tsx              # YouTube
    ├── 🎵 TikTokPage.tsx               # TikTok
    └── 📊 GoogleAnalyticsPage.tsx      # Google Analytics
```

### 🧩 **Componentes (src/components/)**

```
components/
├── 🎨 ui/                              # Componentes base de UI
│   ├── alert.tsx                       # Alertas y notificaciones
│   ├── badge.tsx                       # Badges y etiquetas
│   ├── button.tsx                      # Botones personalizados
│   ├── card.tsx                        # Tarjetas y contenedores
│   ├── dialog.tsx                      # Diálogos y modales
│   ├── form.tsx                        # Formularios
│   ├── input.tsx                       # Campos de entrada
│   ├── label.tsx                       # Etiquetas de formulario
│   ├── progress.tsx                    # Barras de progreso
│   ├── scroll-area.tsx                 # Áreas de scroll
│   ├── select.tsx                      # Selectores
│   ├── slider.tsx                      # Deslizadores
│   ├── sonner.tsx                      # Notificaciones toast
│   ├── switch.tsx                      # Interruptores
│   ├── tabs.tsx                        # Pestañas
│   └── textarea.tsx                    # Áreas de texto
├── 📊 Gestión de Contenido:
│   ├── ContentPublisher.tsx            # Publicador de contenido
│   ├── ContentTemplateGenerator.tsx    # Generador de templates
│   ├── ContentVersionHistory.tsx       # Historial de versiones
│   └── MediaGenerationDemo.tsx         # Demo de generación de medios
├── 🖼️ Generación de Medios:
│   ├── ImageGenerator.tsx              # Generador de imágenes
│   ├── UnifiedImageManager.tsx         # Gestor unificado de imágenes
│   ├── UnifiedVideoManager.tsx         # Gestor unificado de videos
│   └── GeminiImageManager.tsx          # Gestor de imágenes Gemini
├── 🌐 Redes Sociales:
│   ├── SocialMediaManager.tsx          # Gestor general de redes sociales
│   ├── FacebookInstagramManager.tsx    # Gestor Facebook/Instagram
│   ├── FacebookPagesManager.tsx        # Gestor de páginas Facebook
│   ├── TwitterManager.tsx              # Gestor de Twitter/X
│   ├── LinkedInManager.tsx             # Gestor de LinkedIn
│   ├── YouTubeManager.tsx              # Gestor de YouTube
│   ├── YouTubeAnalyticsManager.tsx     # Analytics de YouTube
│   ├── TikTokManager.tsx               # Gestor de TikTok
│   └── InstagramManager.tsx            # Gestor de Instagram
├── 📊 Analytics y Métricas:
│   ├── RealtimeAnalyticsDashboard.tsx  # Dashboard de analytics en tiempo real
│   ├── CampaignMetrics.tsx             # Métricas de campañas
│   ├── SentimentAnalysis.tsx           # Análisis de sentimientos
│   ├── SentimentAnalyzer.tsx           # Analizador de sentimientos
│   └── GoogleAnalyticsManager.tsx      # Gestor de Google Analytics
├── 🤖 IA y Automatización:
│   ├── AdvancedOptimizationManager.tsx # Gestor de optimización avanzada
│   ├── AdvancedPromptBuilder.tsx       # Constructor de prompts avanzados
│   ├── AdvancedStrategiesManager.tsx   # Gestor de estrategias avanzadas
│   ├── CampaignAutomationManager.tsx   # Gestor de automatización de campañas
│   └── IntelligentSchedulingManager.tsx # Gestor de programación inteligente
├── 🧪 A/B Testing:
│   └── ab-testing/
│       ├── CreateExperimentDialog.tsx  # Diálogo de creación de experimentos
│       ├── ExperimentMetrics.tsx       # Métricas de experimentos
│       └── MABMetrics.tsx              # Métricas de Multi-Armed Bandit
├── 🔧 Utilidades y Diagnósticos:
│   ├── APIStatusChecker.tsx            # Verificador de estado de APIs
│   ├── CredentialsStatus.tsx           # Estado de credenciales
│   ├── DatabaseStatus.tsx              # Estado de base de datos
│   ├── OAuthManager.tsx                # Gestor de OAuth
│   ├── ErrorBoundary.tsx               # Manejo de errores
│   ├── AuthCallback.tsx                # Callback de autenticación
│   ├── AuthDiagnostic.tsx              # Diagnóstico de autenticación
│   ├── CheckLiendrexData.tsx           # Verificación de datos Liendrex
│   ├── CleanLiendrexCampaigns.tsx      # Limpieza de campañas Liendrex
│   └── UpdateLiendrexCampaigns.tsx     # Actualización de campañas Liendrex
└── 🎨 Layout:
    └── Layout.tsx                      # Layout principal de la aplicación
```

### ⚙️ **Servicios y Lógica (src/lib/)**

```
lib/
├── 🔐 Autenticación:
│   ├── auth.tsx                        # Autenticación principal
│   ├── authSimple.tsx                  # Autenticación simplificada
│   └── supabase.ts                     # Configuración de Supabase
├── 🌐 APIs de Redes Sociales:
│   ├── facebook-api.ts                 # API de Facebook
│   ├── instagram-api.ts                # API de Instagram
│   ├── twitter-api.ts                  # API de Twitter/X
│   ├── linkedin-api.ts                 # API de LinkedIn
│   ├── youtube-api.ts                  # API de YouTube
│   ├── youtube-analytics-api.ts        # API de Analytics de YouTube
│   ├── tiktok-api.ts                   # API de TikTok
│   └── google-analytics-api.ts         # API de Google Analytics
├── 🤖 IA y Generación de Contenido:
│   ├── openai.ts                       # API de OpenAI
│   ├── dalle3-api.ts                   # API de DALL-E 3
│   ├── gemini-image-api.ts             # API de Gemini para imágenes
│   ├── gemini-image-service.ts         # Servicio de imágenes Gemini
│   ├── stability-api.ts                # API de Stability AI
│   ├── midjourney-api.ts               # API de Midjourney
│   ├── runway-api.ts                   # API de RunwayML
│   ├── pika-api.ts                     # API de Pika Labs
│   └── luma-api.ts                     # API de Luma AI
├── 🧠 Algoritmos de Machine Learning:
│   ├── mab-algorithms.ts               # Algoritmos Multi-Armed Bandit
│   ├── mab-service.ts                  # Servicio Multi-Armed Bandit
│   ├── rl-algorithms.ts                # Algoritmos Reinforcement Learning
│   ├── rl-service.ts                   # Servicio Reinforcement Learning
│   └── prompt-rewrite-rl.ts            # Reescritura de prompts con RL
├── 📊 Analytics y Predicción:
│   ├── realtime-analytics-service.ts   # Servicio de analytics en tiempo real
│   ├── engagement-prediction-service.ts # Predicción de engagement
│   ├── sentiment-analysis-service.ts   # Análisis de sentimientos
│   ├── sentiment-service.ts            # Servicio de sentimientos
│   ├── recommendation-engine-service.ts # Motor de recomendaciones
│   └── intelligent-scheduling-service.ts # Programación inteligente
├── 🎯 Estrategias Avanzadas:
│   ├── advanced-strategies-service.ts  # Servicio de estrategias avanzadas
│   ├── advanced-optimization-service.ts # Optimización avanzada
│   ├── advanced-prompt-service.ts      # Servicio de prompts avanzados
│   └── campaign-automation-service.ts  # Automatización de campañas
├── 📄 Gestión de Contenido:
│   ├── content-service.ts              # Servicio de contenido
│   ├── content-generation-apis.ts      # APIs de generación de contenido
│   ├── content-template-engine.ts      # Motor de templates
│   ├── automated-content-service.ts    # Servicio de contenido automatizado
│   ├── campaign-service.ts             # Servicio de campañas
│   └── client-context.tsx              # Contexto de clientes
├── 🎨 Servicios Unificados:
│   ├── unified-image-service.ts        # Servicio unificado de imágenes
│   ├── unified-video-service.ts        # Servicio unificado de videos
│   ├── image-generation-service.ts     # Servicio de generación de imágenes
│   ├── credentials-service.ts          # Servicio de credenciales
│   └── utils.ts                        # Utilidades generales
├── 🪝 Hooks Personalizados:
│   └── hooks/
│       └── useCredentials.ts           # Hook para credenciales
└── 🧪 Testing y Diagnósticos:
    └── supabase-test.ts                # Testing de Supabase
```

---

## 🗄️ BACKEND - Base de Datos

### 📊 **Migraciones (database_migrations/)**

```
database_migrations/
├── 001_content_templates.sql           # Sistema de templates de contenido
├── 002_create_exec_sql_function.sql    # Funciones SQL personalizadas
├── 003_credentials_system.sql          # Sistema de credenciales API
├── 004_content_versions.sql            # Versionado de contenido
├── 005_automation_advanced_strategies.sql # Estrategias avanzadas de automatización
└── 006_social_media_ai_features.sql    # Features de IA para redes sociales
```

### ⚡ **Funciones Supabase (supabase/functions/)**

```
supabase/functions/
├── generate-content/
│   └── index.ts                        # Generación de contenido con IA
├── mab-record-reward/
│   └── index.ts                        # Registro de recompensas Multi-Armed Bandit
├── mab-select-arm/
│   └── index.ts                        # Selección de armas Multi-Armed Bandit
└── rl-optimize-prompt/
    └── index.ts                        # Optimización de prompts con RL
```

### 🗃️ **Tablas de Base de Datos (13 tablas implementadas)**

```
Tablas Principales:
├── clients                             # Clientes
├── campaigns                           # Campañas
├── content_templates                   # Templates de contenido
├── content_versions                    # Versiones de contenido
├── generated_images                    # Imágenes generadas
├── api_credentials                     # Credenciales de APIs
├── automation_strategies               # Estrategias de automatización
├── social_media_posts                  # Posts de redes sociales
├── analytics_data                      # Datos de analytics
├── ab_testing_experiments              # Experimentos A/B Testing
├── mab_arms                            # Armas Multi-Armed Bandit
├── rl_experiments                      # Experimentos RL
└── sentiment_analysis                  # Análisis de sentimientos
```

---

## ⚙️ CONFIGURACIÓN Y DEPLOY

### 🔧 **Configuración (config/)**

```
config/
├── api-keys.example.ts                 # Ejemplo de configuración de claves API
└── api-keys.ts                         # Configuración real de claves API
```

### 🚀 **Archivos de Deploy**

```
├── deploy.js                           # Script de deploy automatizado
├── deploy.md                           # Documentación de deploy
├── netlify.toml                        # Configuración de Netlify
├── vercel.json                         # Configuración de Vercel
├── package.json                        # Dependencias del proyecto
├── package-deploy.json                 # Dependencias para deploy
├── pnpm-lock.yaml                      # Lock file de pnpm
├── pnpm-workspace.yaml                 # Configuración de workspace
├── vite.config.ts                      # Configuración de Vite
├── tailwind.config.js                  # Configuración de Tailwind CSS
├── postcss.config.js                   # Configuración de PostCSS
├── tsconfig.json                       # Configuración de TypeScript
├── tsconfig.app.json                   # Configuración TypeScript para app
├── tsconfig.node.json                  # Configuración TypeScript para node
└── tsconfig.node.tsbuildinfo           # Build info de TypeScript
```

---

## 📚 DOCUMENTACIÓN

### 📖 **Documentación Actual (documentacion-actual/)**

```
documentacion-actual/
├── README.md                           # Documentación principal del proyecto
├── PROYECTO_DOCUMENTACION_COMPLETA.md  # Documentación completa del proyecto
├── ESTRUCTURA_TABLAS_SUPABASE.md       # Estructura detallada de tablas
├── ESTADO_IMPLEMENTACION_ACTUALIZADO.md # Estado actual de implementación
├── RESUMEN_EJECUTIVO_COMPLETO.md       # Resumen ejecutivo del proyecto
└── RUTA_DESARROLLO_2025.md             # Hoja de ruta para 2025
```

### 📋 **Archivos de Estado del Proyecto**

```
├── RUTA_DESARROLLO_ACTUALIZADA.md      # Hoja de ruta actualizada
├── TAREAS_PENDIENTES.md                # Lista de tareas pendientes
├── IMPLEMENTACION_v2.2.0_COMPLETADA.md # Implementación completada v2.2.0
├── IMPLEMENTACION_FASES_5_6_COMPLETADA.md # Fases 5 y 6 completadas
├── ACTUALIZACION_IA_v2.2.1.md          # Actualización de IA v2.2.1
├── SISTEMA_PROMPTS_AUTOMATICO_v2.2.1.md # Sistema de prompts automático
├── IMPLEMENTACION_PROMPTS_AVANZADOS_v2.2.1.md # Prompts avanzados
├── FUNCIONALIDADES_RESTAURADAS.md      # Funcionalidades restauradas
├── CORRECCIONES_v2.2.0.md              # Correcciones de la v2.2.0
├── RESUMEN_IMPLEMENTACION_FINAL.md     # Resumen final de implementación
├── RESUMEN_ORGANIZACION.md             # Resumen de organización
├── MANUAL_USUARIO.md                   # Manual de usuario
├── CONTRIBUTING.md                     # Guía de contribución
├── LICENSE                             # Licencia del proyecto
└── CHANGELOG.md                        # Registro de cambios
```

### 📚 **Documentación Técnica (docs/)**

```
docs/
├── CONTENT_TEMPLATES_SYSTEM.md         # Sistema de templates de contenido
└── IMPLEMENTACION_v2.2.0_GUIA_COMPLETA.md # Guía completa de implementación
```

### 📚 **Documentación Obsoleta (documentacion-obsoleta/)**

```
documentacion-obsoleta/
├── README.md                           # README obsoleto
├── ANALISIS_RECURSOS_JSON.md           # Análisis de recursos JSON
├── CREDENTIALS_SETUP_INSTRUCTIONS.md   # Instrucciones de setup de credenciales
├── CREDENTIALS_SYSTEM_README.md        # README del sistema de credenciales
├── FALTA_COMPLETAR.md                  # Lista de tareas faltantes
├── LIENDREX_DATA_CORRECTION.md         # Corrección de datos Liendrex
├── MAB_IMPLEMENTATION.md               # Implementación de MAB
├── RL_IMPLEMENTATION.md                # Implementación de RL
└── supabase-setup.md                   # Setup de Supabase
```

---

## 🧪 SCRIPTS Y UTILIDADES

### 🔧 **Scripts de Desarrollo (scripts/)**

```
scripts/
├── setup-complete.js                   # Setup completo del proyecto
├── verificar-estado.js                 # Verificación del estado del sistema
├── diagnostico-ab-testing.js           # Diagnóstico de A/B Testing
├── [24 archivos adicionales...]        # Scripts de desarrollo adicionales
└── [2 archivos .cjs]                   # Scripts CommonJS
└── [1 archivo .sql]                    # Script SQL
```

### 🗃️ **Scripts SQL**

```
├── SQL_SIMPLE_VACUUM.sql               # Optimización simple de base de datos
├── SQL_CREATE_GENERATED_IMAGES_TABLE.sql # Creación de tabla de imágenes
├── SQL_CREATE_GENERATED_IMAGES_ONLY.sql # Solo creación de tabla de imágenes
├── SQL_OPTIMIZE_GENERATED_IMAGES_TABLE.sql # Optimización de tabla de imágenes
├── SQL_OPTIMIZE_GENERATED_IMAGES_FIXED.sql # Optimización fija de imágenes
├── SQL_FIX_GENERATED_IMAGES_STRUCTURE.sql # Corrección de estructura de imágenes
├── SQL_FIX_GENERATED_IMAGES_RLS.sql    # Corrección de RLS de imágenes
├── SQL_VERIFY_GENERATED_IMAGES_COLUMNS.sql # Verificación de columnas
├── SQL_CHECK_GENERATED_IMAGES_STRUCTURE.sql # Verificación de estructura
├── SQL_VACUUM_GENERATED_IMAGES.sql     # VACUUM de tabla de imágenes
├── SQL_GET_COLUMNS_ONLY.sql            # Obtener solo columnas
├── SQL_GET_FULL_TABLE_STRUCTURE.sql    # Obtener estructura completa
├── SQL_DIAGNOSE_DATABASE_PERFORMANCE.sql # Diagnóstico de performance
├── SQL_CORREGIDO_TABLAS_FALTANTES.sql  # Corrección de tablas faltantes
├── SQL_FIX_DATABASE_COLUMNS.sql        # Corrección de columnas de BD
├── SQL_FIX_API_CREDENTIALS_STRUCTURE.sql # Corrección de estructura de credenciales
├── SQL_FIX_API_CREDENTIALS_RLS.sql     # Corrección de RLS de credenciales
└── SQL_CLEANUP_API_CREDENTIALS_POLICIES.sql # Limpieza de políticas
```

### 📋 **Archivos de Instrucciones**

```
├── INSTRUCCIONES_CREAR_TABLAS.md       # Instrucciones para crear tablas
├── MIGRACION_INSTRUCCIONES.md          # Instrucciones de migración
└── prepare-github.sh                   # Script de preparación para GitHub
```

---

## 🎯 ESTADO ACTUAL - v2.1.0

### ✅ **COMPLETADO - TODAS LAS FASES**

#### **Fase 1: Sistema Base** ✅ COMPLETADO
- ✅ Autenticación con Supabase
- ✅ Dashboard interactivo
- ✅ Gestión de usuarios y roles
- ✅ Sistema de navegación
- ✅ Configuración base

#### **Fase 2: Gestión de Clientes** ✅ COMPLETADO
- ✅ CRUD completo de clientes
- ✅ Perfiles detallados de clientes
- ✅ Historial de interacciones
- ✅ Segmentación de clientes
- ✅ Integración con campañas

#### **Fase 3: Gestión de Campañas** ✅ COMPLETADO
- ✅ Creación y edición de campañas
- ✅ Programación de contenido
- ✅ Seguimiento de métricas
- ✅ Presupuestos y objetivos
- ✅ Integración con redes sociales

#### **Fase 4: Generación de Contenido** ✅ COMPLETADO
- ✅ Generador de contenido con IA
- ✅ Templates personalizables
- ✅ Programación automática
- ✅ Múltiples formatos (texto, imagen, video)
- ✅ Integración con OpenAI

#### **Fase 5: Automatización Avanzada** ✅ COMPLETADO
- ✅ Programación Inteligente
- ✅ Automatización de Campañas
- ✅ A/B Testing Automático
- ✅ 13 tablas de base de datos implementadas
- ✅ Servicios de automatización funcionales

#### **Fase 6: Estrategias Premium** ✅ COMPLETADO
- ✅ Estrategias Avanzadas
- ✅ Optimización Avanzada
- ✅ Dream 100 Targets
- ✅ Value Ladders
- ✅ Webinar Scripts
- ✅ Psychological Triggers

### 📊 **Métricas de Éxito Actuales**
- ✅ **0 errores críticos** en producción
- ✅ **100% funcionalidad core** operativa
- ✅ **13 tablas de BD** implementadas
- ✅ **6 fases completadas** exitosamente
- ✅ **6 plataformas** de redes sociales integradas
- ✅ **4 proveedores** de generación de imágenes
- ✅ **3 proveedores** de generación de videos
- ✅ **Analytics en tiempo real** funcionando
- ✅ **A/B Testing** con Multi-Armed Bandit
- ✅ **Automatización** de campañas
- ✅ **Estrategias premium** implementadas

---

## 🚀 PRÓXIMOS PASOS - v2.2.0

### 🎯 **Objetivos Principales - Febrero 2025**

#### **🔗 Integraciones de Redes Sociales**
- [ ] **Twitter/X API Integration** - Mejorar integración existente
- [ ] **LinkedIn API Integration** - Expandir funcionalidades B2B
- [ ] **TikTok API Integration** - Completar integración de contenido viral

#### **🤖 IA Avanzada**
- [ ] **Predicción de Tendencias** - ML para anticipar tendencias
- [ ] **Optimización Automática** - IA que ajusta campañas en tiempo real
- [ ] **Análisis de Sentimientos** - IA para analizar comentarios

#### **📊 Reportes y Analytics**
- [ ] **Reportes Personalizados** - Constructor drag & drop
- [ ] **Exportación Avanzada** - PDF, Excel, PowerPoint
- [ ] **API REST Completa** - Endpoints para integraciones

#### **🔌 API y Integraciones**
- [ ] **Webhooks** - Notificaciones en tiempo real
- [ ] **Zapier Integration** - Automatización con 3000+ apps
- [ ] **CRM Integration** - Salesforce, HubSpot, Pipedrive

### 📅 **Cronograma v2.2.0**

#### **FEBRERO 2025**
- [ ] Twitter/X API Integration
- [ ] LinkedIn API Integration
- [ ] IA para predicción de tendencias
- [ ] Reportes personalizados básicos

#### **MARZO 2025**
- [ ] TikTok API Integration
- [ ] Optimización automática de campañas
- [ ] API REST completa
- [ ] Webhooks implementados

---

## 🎉 CONCLUSIÓN

**MarketPro GT v2.1.0** representa un hito significativo en el desarrollo del sistema. Con todas las fases 1-6 completadas exitosamente, el sistema está listo para uso en producción y puede manejar las necesidades de marketing digital de empresas guatemaltecas de todos los tamaños.

El roadmap hacia v2.4.0 se enfoca en expandir las capacidades de IA, integrar más plataformas, y crear un ecosistema completo de marketing digital automatizado.

---

**Desarrollado para empresas guatemaltecas 🇬🇹**  
*Última actualización: 12 de Enero, 2025*

---

## 📞 CONTACTO Y SOPORTE

Para preguntas sobre la estructura del proyecto o desarrollo:
- 📧 **Email:** [Tu email de contacto]
- 📱 **Teléfono:** [Tu teléfono]
- 🌐 **Website:** [Tu website]
- 📚 **Documentación:** Ver archivos en `documentacion-actual/`

---

*Este documento se actualiza automáticamente con cada cambio en la estructura del proyecto.*


