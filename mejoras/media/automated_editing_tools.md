# Herramientas de Edición Automatizada: Análisis Comparativo 2025

## Resumen Ejecutivo

Esta investigación analiza las principales herramientas de edición automatizada disponibles en 2025, centrándose en Canva API, Adobe Creative SDK, Figma API y herramientas de AI para edición automática. Los hallazgos revelan un ecosistema en rápida evolución donde la integración de IA, la automatización de workflows y las capacidades de batch processing están transformando la producción de contenido digital.

**Hallazgos Clave:**
- Canva lidera en automatización con 12 nuevas APIs lanzadas en julio 2025, incluyendo Design Editing y Data Connectors
- Adobe Creative Cloud ofrece las capacidades más robustas de batch processing empresarial a través de Content Automation
- Figma proporciona la API más completa para flujos de trabajo de diseño colaborativo con más de 25 endpoints especializados
- Las herramientas de AI (Runway, OpenAI, Google) están democratizando la creación de contenido audiovisual avanzado

## 1. Introducción

El panorama de herramientas de edición automatizada ha experimentado una transformación significativa en 2025, impulsada por avances en inteligencia artificial y la creciente demanda de producción de contenido a escala. Esta investigación examina cuatro categorías principales de herramientas, evaluando sus capacidades de plantillas, APIs disponibles, integración con workflows, precios, batch processing y formatos de salida para redes sociales.

## 2. Análisis Detallado por Herramienta

### 2.1 Canva API

#### Capacidades de Plantillas y Personalización Automática

Canva revolucionó sus capacidades en julio 2025 con el lanzamiento de 12 nuevas APIs[5]. La **Design Editing API** permite flujos de trabajo más inteligentes potenciados por IA, donde los desarrolladores pueden leer y actualizar programáticamente el diseño y contenido de plantillas Canva. Esta API facilita:

- **Autoformato inteligente**: Ajuste automático de diseños para especificaciones de anuncios específicos
- **Alineación de contenido**: Posicionamiento automático de elementos basado en mejores prácticas de diseño
- **Plantillas estacionales**: Adaptación instantánea de diseños para diferentes temporadas o campañas

Los **Data Connectors** representan un avance significativo, permitiendo importar datos desde CRMs, hojas de cálculo y conjuntos de datos propietarios directamente a Canva[5]. Esto potencia "Magic Studio at Scale" para generar automáticamente grandes volúmenes de contenido de marca utilizando datos en vivo.

#### APIs Disponibles y Documentación

Canva ofrece un ecosistema completo de APIs a través de **Canva Connect**[1]:

**APIs Principales:**
- **Design Editing API**: Manipulación programática de elementos de diseño
- **Data Connectors API**: Integración de fuentes de datos externas  
- **Autofill API**: Población automática de plantillas con datos
- **Brand Templates API**: Gestión de plantillas corporativas
- **Assets API**: Importación de videos y recursos
- **Resize API**: Adaptación automática a múltiples formatos
- **Export API**: Exportación en diversos formatos

La documentación es exhaustiva con especificación OpenAPI disponible públicamente, kits de inicio en GitHub y soporte para múltiples lenguajes de programación[1].

#### Integración con Workflows Automatizados

Canva se integra nativamente con:
- **Zapier y Make.com**: Para automatización no-code
- **Hubspot Data Connector**: Creación de gráficos automática con datos de CRM
- **Sistemas inmobiliarios**: Generación automática de materiales de marketing para propiedades

El **Toast Notifications API** permite comunicación fluida dentro del editor sin interrumpir el flujo de trabajo[5].

#### Precios y Límites

Canva utiliza un modelo de precios escalado[7]:
- **Enterprise**: Pricing personalizado con consulta de ventas requerida
- **Características Enterprise incluidas**: APIs personalizadas, integraciones Connect API, soporte prioritario
- **Límites de IA por persona/mes en Enterprise**:
  - Generar diseño Canva AI: 150 créditos
  - Crear imagen Dream Lab: 500 créditos  
  - Magic Media text-to-video: 50 créditos
  - Magic Write: 500 créditos

#### Capacidades de Batch Processing

La plataforma admite **procesamiento por lotes a través de Data Connectors**, permitiendo:
- Generación simultánea de múltiples variaciones de diseño
- Procesamiento automático de conjuntos de datos completos
- Actualización masiva de plantillas con nuevos datos

#### Formatos de Salida para Redes Sociales

Canva soporta más de 100 formatos optimizados para redes sociales, incluyendo:
- Instagram: Stories, Posts, Reels (múltiples aspectos)
- Facebook: Posts, Ads, Covers
- Twitter/X: Headers, Posts, Ads
- LinkedIn: Posts, Company Pages, Ads
- TikTok: Videos verticales
- YouTube: Thumbnails, Channel Art, Shorts

### 2.2 Adobe Creative SDK / Content Automation

#### Capacidades de Plantillas y Personalización Automática

Adobe Content Automation integra Adobe Experience Manager Assets con APIs de Creative Cloud[3], ofreciendo **perfiles de procesamiento** que actúan como plantillas avanzadas para automatización:

**Funcionalidades de IA Integradas:**
- **Auto-tone**: Correcciones inteligentes de luz y color usando IA
- **Auto-upright**: Corrección automática de perspectiva  
- **Image Cutout**: Eliminación inteligente de fondos
- **Smart Object Replacement**: Personalización a escala manteniendo efectos aplicados

**Plantillas Personalizables:**
- Lightroom presets personalizados
- Photoshop Actions para batches
- Configuraciones creativas definibles por el usuario

#### APIs Disponibles y Documentación

Adobe proporciona APIs robustas a través de Adobe Experience Cloud[3]:
- **Asset Microservices APIs**: Procesamiento automatizado de activos
- **Creative Cloud APIs**: Integración directa con aplicaciones Adobe
- **Batch Processing APIs**: Manejo de grandes volúmenes de archivos
- **OpenAPI-based APIs**: Especificación estándar para integración

La documentación está disponible en Adobe Experience League con guías completas y materiales de referencia.

#### Integración con Workflows Automatizados

Content Automation se integra perfectamente con:
- **Adobe Experience Manager**: Gestión automatizada de activos digitales
- **Creative Cloud aplicaciones**: Photoshop, Illustrator, InDesign
- **Sistemas empresariales**: CRMs, DAMs, sistemas de gestión de contenido
- **APIs de terceros**: Integración personalizada vía microservicios

#### Precios y Límites

Adobe Content Automation es un **add-on con licencia** que requiere:
- Contacto con representante de Adobe para habilitación
- Plan AEM as a Cloud Service existente
- Pricing personalizado basado en volumen y necesidades específicas

#### Capacidades de Batch Processing

Adobe lidera en batch processing empresarial[3]:
- **Procesamiento automático**: Los activos subidos se procesan según perfiles configurados
- **Herencia de perfiles**: Las subcarpetas heredan configuraciones automáticamente
- **Reprocesamiento masivo**: Capacidad de reprocesar activos existentes
- **Escalabilidad empresarial**: Manejo de miles de archivos simultáneamente

#### Formatos de Salida para Redes Sociales

Adobe soporta todos los formatos estándar plus:
- **Formatos web optimizados**: WebP, AVIF para mejor rendimiento
- **Múltiples resoluciones**: Generación automática de variaciones
- **Metadatos preservados**: Mantenimiento de información de derechos de autor
- **Formatos nativos Adobe**: PSD, AI, INDD para edición posterior

### 2.3 Figma API

#### Capacidades de Plantillas y Personalización Automática

La API REST de Figma ofrece capacidades avanzadas de automatización de diseño[2] a través de:

**Gestión de Componentes y Estilos:**
- **Component API**: Acceso a metadatos de componentes publicados
- **Styles API**: Gestión programática de estilos de diseño
- **Variables API**: Control de variables de diseño reutilizables (hasta 5,000 por colección)

**Automatización de Workflows:**
- **Webhooks V2**: Monitoreo de eventos específicos (edición, versiones, comentarios)
- **Design Import API**: Carga automática de diseños desde URLs
- **Dev Resources API**: Gestión de recursos de desarrollo adjuntos

#### APIs Disponibles y Documentación

Figma proporciona la API más comprehensiva del mercado con **más de 25 endpoints especializados**[2]:

**Categorías de API:**
- **Files**: Acceso completo a archivos y nodos
- **Comments**: Sistema completo CRUD para comentarios y reacciones  
- **Users**: Información de usuario autenticado
- **Projects**: Listado de proyectos y archivos (acceso limitado)
- **Components & Styles**: Gestión de bibliotecas de diseño
- **Variables**: Creación y gestión de tokens de diseño
- **Webhooks**: Sistema de eventos en tiempo real
- **Analytics**: Analíticas de uso de bibliotecas (Enterprise)
- **Activity Logs**: Registros de seguridad (Enterprise)

**Documentación:** Especificación OpenAPI completa disponible en GitHub con tipos TypeScript incluidos.

#### Integración con Workflows Automatizados

Figma se integra extensivamente con:
- **Make.com**: Más de 2000 apps conectables
- **Slack**: Notificaciones y colaboración
- **Jira**: Gestión de recursos de desarrollo
- **Zeplin**: Handoff de diseño a desarrollo
- **Abstract**: Control de versiones avanzado

**MCP Server** (anunciado junio 2025): Integración nativa con sistemas de IA para automatización inteligente[2].

#### Precios y Límites

Figma utiliza pricing basado en asientos con acceso diferencial a APIs[8]:

**Plans y Acceso a APIs:**
- **Professional**: Pricing no especificado, acceso básico a APIs
- **Organization**: Pricing no especificado, APIs avanzadas
- **Enterprise**: Pricing no especificado, acceso completo incluyendo:
  - Variables API (requiere puesto completo)
  - Activity Logs API (solo administradores)  
  - Discovery API (solo con Governance+)
  - Library Analytics API

**Límites Operacionales:**
- **Webhooks**: 20 por equipo, 5 por proyecto, 3 por archivo
- **Variables**: 40 modos por colección, 5,000 variables por colección
- **Dev Resources**: 10 recursos por nodo
- **Rate Limits**: Más de 20 solicitudes/segundo puede resultar en error 429

#### Capacidades de Batch Processing

Figma ofrece batch processing limitado:
- **Batch export**: Exportación múltiple de imágenes (máximo 32 megapíxeles por imagen)
- **Bulk operations**: A través de webhooks y scripting personalizado
- **API batching**: Múltiples llamadas secuenciales para operaciones masivas

#### Formatos de Salida para Redes Sociales

Figma exporta en formatos estándar:
- **Formatos de imagen**: PNG, JPG, SVG, PDF  
- **Especificaciones técnicas**: Exportación con CSS, medidas, assets
- **Integraciones desarrollo**: Handoff automático a herramientas de código

### 2.4 Herramientas de AI para Edición Automática

#### Herramientas de Generación de Imágenes

**OpenAI DALL-E 3**[9]:
- **Capacidades**: Generación precisa desde prompts de texto
- **API**: Disponible vía OpenAI Platform y ChatGPT
- **Mejor para**: Marketing automation, generación de contenido simple
- **Limitaciones**: Sin inpainting ni iteración profunda

**Google Gemini (Imagen)**[9]:
- **Capacidades**: Prompts de texto, bocetos, inpainting  
- **API**: Disponible vía fal.ai, Makersuite, Vertex AI
- **Mejor para**: Refinamiento de imágenes, flujos boceto-a-imagen
- **Complejidad**: Ecosistema Google más complejo de navegar

**Adobe Firefly**[9]:
- **Capacidades**: Generación con licencias comerciales (Adobe Stock training)
- **API**: Sin endpoint público aún, integrado en Creative Cloud
- **Mejor para**: Uso comercial con alta confianza legal
- **Limitación**: Solo disponible dentro ecosistema Adobe

#### Herramientas de Generación de Video

**Runway ML**[6]:
- **Modelos**: Gen-4 Turbo, Gen-4 Images
- **Capacidades**: Text-to-video, image-to-video, video-to-video
- **Resolución**: 720p-1080p, 24 fps, hasta 10 segundos  
- **Planes**: Build (individuos/equipos), Enterprise (organizaciones)
- **API**: Disponible con requerimiento "Powered by Runway"

**OpenAI Sora**[10]:
- **Capacidades**: Videos fotorrealistas hasta 60 segundos
- **Resolución**: 1080p, 24 fps
- **Mejor para**: Contenido cinematográfico de alta calidad
- **Status**: API limitada, principalmente vía ChatGPT

**Google Veo 3**[10]:
- **Capacidades**: Videos hasta 1080p, 24-30 fps
- **Mejor para**: Secuencias largas con movimientos de cámara cinematográficos
- **Integración**: Part of Google AI ecosystem

#### Herramientas Especializadas

**UXPin AI Component Creator**[4]:
- **Función**: Automatización de creación de componentes UI
- **Integración**: Nativa en UXPin Merge
- **Mejor para**: Aceleración de design-to-development workflows

**Octopus AI**[4]:
- **Función**: Automatización de investigación de usuarios
- **Capacidades**: Análisis de datos, generación de insights, informes visuales
- **Mejor para**: UX research automation

**Chart AI**[4]:
- **Función**: Visualización automática de datos
- **Formatos**: Barras, dispersión, Gantt, mapas mentales, diagramas ER
- **Mejor para**: Dashboards automatizados, reportes dinámicos

## 3. Análisis Comparativo

### 3.1 Capacidades de Plantillas y Personalización Automática

| Herramienta | Nivel de Automatización | Personalización IA | Escalabilidad |
|-------------|-------------------------|--------------------|--------------| 
| **Canva API** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Adobe Creative SDK** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Figma API** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **AI Tools** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

**Líder: Canva API** - Las nuevas Design Editing API y Data Connectors ofrecen automatización inteligente incomparable, especialmente para contenido de marca a escala.

### 3.2 APIs Disponibles y Documentación

| Herramienta | Cantidad de APIs | Calidad Documentación | Facilidad Integración |
|-------------|------------------|----------------------|----------------------|
| **Canva API** | ⭐⭐⭐⭐ (12 nuevas) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Adobe Creative SDK** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **Figma API** | ⭐⭐⭐⭐⭐ (25+ endpoints) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **AI Tools** | ⭐⭐⭐ (Varía) | ⭐⭐⭐ | ⭐⭐⭐ |

**Líder: Figma API** - Ofrece la API más comprehensiva con especificación OpenAPI completa y tipos TypeScript.

### 3.3 Integración con Workflows Automatizados

| Herramienta | Integraciones Nativas | No-Code Support | Enterprise Ready |
|-------------|----------------------|-----------------|------------------|
| **Canva API** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Adobe Creative SDK** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Figma API** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **AI Tools** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |

**Líder: Adobe Creative SDK** - Integración empresarial más robusta con Adobe Experience Manager y Creative Cloud.

### 3.4 Precios y Límites

| Herramienta | Transparencia Pricing | Accesibilidad | Valor por Dinero |
|-------------|----------------------|---------------|-----------------| 
| **Canva API** | ⭐⭐ (Custom Enterprise) | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Adobe Creative SDK** | ⭐ (Custom licensing) | ⭐ | ⭐⭐⭐ |
| **Figma API** | ⭐⭐ (Plan-dependent) | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **AI Tools** | ⭐⭐⭐ (Varies) | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**Observación**: Todas las herramientas enterprise requieren contacto de ventas para pricing específico.

### 3.5 Capacidades de Batch Processing

| Herramienta | Volumen Soportado | Automatización | Eficiencia |
|-------------|-------------------|----------------|------------|
| **Canva API** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Adobe Creative SDK** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Figma API** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ |
| **AI Tools** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |

**Líder: Adobe Creative SDK** - Capacidades empresariales incomparables para procesamiento masivo de activos.

### 3.6 Formatos de Salida para Redes Sociales

| Herramienta | Cantidad Formatos | Optimización RRSS | Calidad Output |
|-------------|-------------------|-------------------|--------------| 
| **Canva API** | ⭐⭐⭐⭐⭐ (100+ formatos) | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Adobe Creative SDK** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Figma API** | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **AI Tools** | ⭐⭐⭐ (Varies) | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**Líder: Canva API** - Optimización superior para redes sociales con formatos específicos para cada plataforma.

## 4. Recomendaciones Estratégicas

### 4.1 Para Startups y Equipos Pequeños

**Recomendación: Canva API + Herramientas AI Selectas**

- Iniciar con Canva Connect APIs para automatización básica
- Integrar DALL-E 3 para generación de imágenes personalizadas  
- Usar Zapier/Make.com para workflows no-code
- **Inversión estimada**: $300-1,000/mes dependiendo del volumen

### 4.2 Para Empresas Medianas

**Recomendación: Figma API + Canva Enterprise + AI Tools**

- Figma API para workflows de diseño colaborativo
- Canva Enterprise para automatización de marketing
- Runway ML para contenido de video
- **Inversión estimada**: $2,000-5,000/mes

### 4.3 Para Grandes Organizaciones

**Recomendación: Adobe Creative SDK + Figma API + Suite AI Completa**

- Adobe Content Automation para batch processing empresarial
- Figma API para gestión de sistemas de diseño
- Suite completa de AI tools (Runway, OpenAI, Google)
- **Inversión estimada**: $10,000+/mes con licenciamiento personalizado

### 4.4 Para Agencias Creativas

**Recomendación: Canva API + Adobe Creative SDK + AI Tools Especializadas**

- Canva para producción rápida de contenido cliente
- Adobe para proyectos de alta calidad  
- AI tools especializadas por vertical (video, imagen, UX)
- **Inversión estimada**: $5,000-15,000/mes

## 5. Tendencias y Futuro del Sector

### 5.1 Evolución de la IA en Diseño Automatizado

El 2025 marca un punto de inflexión con la integración masiva de IA generativa:

- **Multimodalidad**: GPT-4o anuncia capacidades multimodales completas
- **Video AI**: Runway Gen-4, OpenAI Sora y Google Veo 3 democratizan la creación de video
- **Automatización Inteligente**: Las herramientas aprenden patrones de marca y preferencias de usuario

### 5.2 Consolidación del Mercado

Se observa una tendencia hacia ecosistemas integrados:
- **Adobe** expande Creative Cloud con más automatización
- **Canva** se posiciona como plataforma de automatización completa  
- **Google** y **Microsoft** integran IA en sus suites empresariales

### 5.3 Democratización de Herramientas Avanzadas

Las capacidades anteriormente exclusivas de agencias premium ahora están disponibles vía API:
- Generación de video cinematográfico (Runway, Sora)
- Edición automatizada inteligente (Adobe AI, Canva AI)
- Análisis de rendimiento en tiempo real (todas las plataformas)

## 6. Conclusiones

El panorama de herramientas de edición automatizada en 2025 se caracteriza por una convergencia de factores: la maduración de la IA generativa, la democratización de capacidades avanzadas y la creciente demanda de producción de contenido a escala. 

**Conclusiones Clave:**

1. **Canva lidera la innovación en automatización** con sus 12 nuevas APIs, especialmente Design Editing y Data Connectors, posicionándose como la solución más avanzada para automatización de contenido de marca.

2. **Adobe mantiene supremacía en capacidades empresariales** con Content Automation ofreciendo las capacidades de batch processing más robustas del mercado.

3. **Figma proporciona la infraestructura más sólida** para workflows de diseño colaborativo con su API comprehensiva de 25+ endpoints.

4. **Las herramientas de AI están redefiniendo las posibilidades creativas**, con Runway ML, OpenAI y Google ofreciendo capacidades de generación que antes requerían equipos especializados.

La elección de herramientas debe basarse en necesidades específicas: Canva para automatización de marketing, Adobe para procesamiento empresarial, Figma para colaboración de diseño, y AI tools para capacidades generativas avanzadas. La integración inteligente de múltiples herramientas, más que la dependencia de una sola plataforma, emerge como la estrategia más efectiva para organizaciones que buscan maximizar su eficiencia en producción de contenido digital.

## 7. Fuentes

[1] [Canva Connect APIs Documentation](https://www.canva.dev/docs/connect/) - Canva - Documentación oficial completa de las API de Canva Connect, incluyendo especificaciones técnicas, capacidades de integración, funcionalidades de plantillas, gestión de activos, y referencias detalladas sobre autenticación y endpoints disponibles

[2] [Figma REST API Documentation](https://www.figma.com/developers/api) - Figma - Información completa sobre la API REST de Figma, incluyendo especificaciones técnicas, endpoints, autenticación, límites de uso, webhooks, capacidades de automatización y dependencias de planes Enterprise

[3] [Content Automation for Creative Cloud Integration](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/assets/manage/cc-api-integration) - Adobe - Documentación oficial de Content Automation para Creative Cloud, detallando la integración entre Adobe Experience Manager Assets y APIs de Creative Cloud, incluyendo perfiles de procesamiento, capacidades de AI y funcionalidades de batch processing

[4] [15 AI Tools for Designers in 2025](https://www.uxpin.com/studio/blog/ai-tools-for-designers/) - UXPin - Análisis detallado de 16 herramientas de AI para diseñadores, incluyendo capacidades de automatización, integración con workflows, y funcionalidades específicas de cada herramienta

[5] [Canva's Biggest API Update: 12 New APIs Including Design Editing](https://www.canva.com/newsroom/news/new-apis-data-connectors/) - Canva - Actualización importante de la plataforma de desarrolladores de Canva con 12 nuevas APIs lanzadas en julio 2025, incluyendo Design Editing API, Data Connectors, y nuevas funcionalidades de automatización

[6] [Runway API - Make anything, anywhere](https://runwayml.com/api) - Runway ML - Información oficial sobre la API de Runway ML, incluyendo modelos Gen-4 Turbo y Gen-4 Images, planes Build y Enterprise, casos de uso para videos y visuales

[7] [Canva Pricing - Free, Pro, Teams and Enterprise Plans](https://www.canva.com/en/pricing/) - Canva - Precios oficiales de Canva 2025, incluyendo planes Enterprise con acceso a API, capacidades de integración personalizada y límites de créditos de IA

[8] [Figma Plans & Pricing](https://www.figma.com/pricing/) - Figma - Precios de Figma 2025, incluyendo planes Professional, Organization y Enterprise con acceso a APIs, asientos Content y créditos de IA

[9] [Top 5 Generative AI APIs for Creative Apps in 2025](https://img.ly/blog/comparing-image-generation-apis-gpt-4o-gemini-firefly-and-more/) - IMG.LY - Comparativa completa de APIs de generación de imágenes con IA en 2025, incluyendo DALL-E, GPT-4o, Gemini, Adobe Firefly, Stability AI, Midjourney, y más

[10] [Best AI Video Generation APIs in 2025](https://www.edenai.co/post/best-ai-video-generation-apis-in-2025) - Eden AI - Análisis de las mejores APIs de generación de video con IA en 2025, incluyendo MiniMax Hailuo, Google Veo 3, Amazon Nova Reel, Runway, OpenAI Sora, y más