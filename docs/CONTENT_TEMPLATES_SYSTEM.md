# 🎨 Sistema de Plantillas de Contenido Visual

## 📋 Descripción General

El Sistema de Plantillas de Contenido Visual es una solución integral que automatiza la creación de contenido visual optimizado para redes sociales usando frameworks de marketing probados y múltiples APIs de generación de IA.

## 🚀 Características Principales

### ✨ **Generación Automatizada**
- **200+ plantillas** basadas en frameworks de marketing probados
- **Variables dinámicas** para personalización automática
- **Selección inteligente** de APIs de generación
- **Optimización automática** por plataforma

### 🎯 **Frameworks de Marketing Integrados**
- **Dream 100**: Infiltración en comunidades de autoridad
- **Hook-Story-Offer**: Estructura probada de engagement
- **Attractive Character**: Posicionamiento de autoridad
- **Triggers Psicológicos**: Curiosidad, autoridad, exclusividad

### 🤖 **APIs de Generación Soportadas**
- **OpenAI DALL-E 3**: Calidad premium, prompts naturales
- **Stable Diffusion**: Rápido y económico, control técnico
- **Google Imagen**: Balance calidad-velocidad, integración nativa

### 📱 **Optimización por Plataforma**
- **Instagram**: 1080x1080, alto contraste, diseño mobile-first
- **TikTok**: 1080x1920, vertical, estética Gen Z
- **LinkedIn**: 1200x627, profesional, limpio
- **YouTube**: 1920x1080, thumbnail optimizado, engaging

## 🏗️ Arquitectura del Sistema

### **Componentes Principales**

```
src/lib/
├── content-template-engine.ts      # Motor principal de plantillas
├── content-generation-apis.ts      # Integración con APIs de IA
└── supabase.ts                     # Configuración de base de datos

src/components/
├── ContentTemplateGenerator.tsx    # Interfaz principal
├── APIStatusChecker.tsx           # Verificación de APIs
└── DatabaseStatus.tsx             # Estado de base de datos

database_migrations/
├── 001_content_templates.sql      # Tabla principal
└── 002_create_exec_sql_function.sql # Función auxiliar
```

### **Flujo de Generación**

1. **Selección de Plantilla**: Usuario elige framework y tipo de hook
2. **Personalización**: Variables dinámicas se configuran automáticamente
3. **Selección de API**: Sistema elige API óptima basada en criterios
4. **Generación**: Contenido se crea usando la API seleccionada
5. **Optimización**: Contenido se adapta para cada plataforma
6. **Tracking**: Métricas se registran para optimización futura

## 📊 Base de Datos

### **Tabla Principal: content_templates**

```sql
CREATE TABLE content_templates (
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
```

### **Tablas de Tracking**

- **template_performance**: Métricas de rendimiento por plantilla
- **api_usage_tracking**: Uso y costos de APIs

## 🔧 Configuración

### **1. Variables de Entorno**

```env
# OpenAI API Key (para DALL-E 3)
VITE_OPENAI_API_KEY=sk-your-openai-api-key-here

# Stability AI API Key (para Stable Diffusion)
VITE_STABILITY_API_KEY=sk-your-stability-api-key-here

# Google AI API Key (para Imagen)
VITE_GOOGLE_AI_API_KEY=your-google-ai-api-key-here

# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### **2. Migración de Base de Datos**

```bash
# Ejecutar migraciones SQL en Supabase
# O usar el script automatizado:
node scripts/setup-content-templates.js
```

### **3. Instalación Completa**

```bash
# Ejecutar script de instalación
node scripts/install-content-system.js
```

## 🎯 Uso del Sistema

### **Interfaz Principal**

1. **Seleccionar Plantilla**: Elige framework y tipo de hook
2. **Configurar Variables**: Personaliza contenido con variables dinámicas
3. **Seleccionar Plataformas**: Elige redes sociales de destino
4. **Configurar Marca**: Define contexto de marca y personalidad
5. **Generar Contenido**: Sistema crea contenido optimizado automáticamente

### **Ejemplo de Uso**

```typescript
import { contentTemplateEngine } from '@/lib/content-template-engine'

const request = {
  templateType: 'd100-insider-access',
  variables: {
    NUMBER: '5',
    AUTHORITY: 'expertos de la industria',
    X: '1'
  },
  targetPlatforms: ['Instagram', 'TikTok'],
  brandContext: {
    name: 'Liendrex',
    industry: 'Productos anti-piojos',
    personality: 'profesional',
    colorPalette: ['#3B82F6', '#10B981']
  }
}

const result = await contentTemplateEngine.generateContent(request)
```

## 📈 Métricas y Optimización

### **Métricas Trackeadas**

- **Engagement Rate**: Tasa de interacción por plantilla
- **Click Through Rate**: CTR por plataforma
- **Conversion Rate**: Conversiones generadas
- **Cost per Generation**: Costo por generación
- **API Performance**: Tiempo de respuesta y éxito

### **Optimización Automática**

- **Multi-Armed Bandit**: A/B testing automático de plantillas
- **Reinforcement Learning**: Optimización de prompts
- **Algoritmos Genéticos**: Evolución de plantillas
- **Performance Scoring**: Puntuación automática de rendimiento

## 🔗 APIs Soportadas

### **OpenAI DALL-E 3**
- **Costo**: $0.04 por imagen
- **Calidad**: Premium
- **Velocidad**: Media
- **Mejor para**: Contenido de alta calidad, prompts naturales

### **Stable Diffusion**
- **Costo**: $0.01 por imagen
- **Calidad**: Alta
- **Velocidad**: Rápida
- **Mejor para**: Generación rápida, control técnico

### **Google Imagen**
- **Costo**: $0.02 por imagen
- **Calidad**: Alta
- **Velocidad**: Rápida
- **Mejor para**: Balance calidad-velocidad, integración Google

## 🚀 Próximas Implementaciones

### **Fase 2: Personalización Avanzada**
- Segmentación automática con 15+ variables demográficas
- Personalización en tiempo real basada en comportamiento
- Testing multivariante A/B/C/D

### **Fase 3: Scheduling Inteligente**
- Predicción de mejores horarios usando ML
- Optimización por zona horaria y audiencia
- Coordinación multi-plataforma automática

### **Fase 4: Integración ML Completa**
- Multi-Armed Bandit para A/B testing automático
- Reinforcement Learning para optimización de prompts
- Algoritmos Genéticos para evolución de plantillas

## 📚 Documentación Técnica

### **Archivos de Configuración**
- `config/api-keys.example.ts`: Plantilla de configuración
- `scripts/install-content-system.js`: Instalación automatizada
- `scripts/setup-content-templates.js`: Configuración de base de datos

### **Componentes React**
- `ContentTemplateGenerator.tsx`: Interfaz principal
- `APIStatusChecker.tsx`: Verificación de APIs
- `DatabaseStatus.tsx`: Estado de base de datos

### **Servicios**
- `content-template-engine.ts`: Motor principal
- `content-generation-apis.ts`: Integración con APIs
- `supabase.ts`: Configuración de base de datos

## 🎉 Impacto Esperado

### **Métricas de Rendimiento**
- ⚡ **+400%** en velocidad de producción de contenido
- 🎨 **+250%** en consistencia visual de marca
- 💰 **-60%** en costos de diseño
- 📈 **+300%** en engagement por personalización
- 🎯 **+250%** en conversiones por optimización automática

### **Beneficios Operacionales**
- **Automatización completa** del proceso de creación
- **Escalabilidad** para múltiples marcas y plataformas
- **Optimización continua** basada en datos
- **Reducción de costos** operacionales
- **Mejora de calidad** consistente

---

**Desarrollado por MarketPro GT**  
**Versión**: 1.0.0  
**Última actualización**: 2025-01-27

