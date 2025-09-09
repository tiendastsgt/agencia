# MarketPro GT - Plataforma de Marketing Digital

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![OpenAI](https://img.shields.io/badge/OpenAI-412991?logo=openai&logoColor=white)](https://openai.com/)

## 🚀 Descripción

**MarketPro GT** es una plataforma de marketing digital completa que permite a las agencias gestionar múltiples clientes, generar contenido con IA, crear estrategias de marketing y analizar métricas de rendimiento. La plataforma está diseñada específicamente para el mercado guatemalteco y centroamericano.

### 🎯 **Características Principales**
- ✅ **Generación de contenido con IA** usando OpenAI GPT-5-nano
- ✅ **Frameworks Russell Brunson** (Value Ladder, Perfect Webinar, Hook-Story-Offer, Dream 100)
- ✅ **Gestión multi-cliente** con dashboard centralizado
- ✅ **Adaptación local** para mercado guatemalteco/centroamericano
- ✅ **Autenticación segura** con whitelist de usuarios
- ✅ **Edge Functions** para procesamiento en tiempo real

## ✨ Características Principales

### 🤖 Generación de Contenido con IA
- **OpenAI GPT-5-nano** para generación de contenido de alta calidad
- **Framework Hook-Story-Offer** de Russell Brunson
- **Adaptación local** para mercado guatemalteco
- **Múltiples plataformas**: Facebook, Instagram, LinkedIn, TikTok, Twitter

### 🎯 Estrategias de Marketing
- **Frameworks de Russell Brunson** (Value Ladder, Perfect Webinar, Dream 100)
- **Estrategias personalizadas** por cliente e industria
- **Análisis de competencia** y posicionamiento
- **Métricas y KPIs** específicos del mercado local

### 📊 Gestión Multi-Cliente
- **Dashboard centralizado** para múltiples clientes
- **Autenticación segura** con whitelist de usuarios
- **Gestión de credenciales API** por cliente
- **Análisis de métricas** integrado

### 🔒 Seguridad
- **Autenticación JWT** con Supabase Auth
- **Row Level Security (RLS)** en base de datos
- **Variables de entorno** para credenciales sensibles
- **Validación de entrada** en todas las APIs

## 🛠️ Tecnologías

### Frontend
- **React 18** con TypeScript
- **Vite** para build y desarrollo
- **TailwindCSS** para estilos
- **React Query** para gestión de estado
- **React Router** para navegación

### Backend
- **Supabase** (PostgreSQL + Auth + Edge Functions)
- **OpenAI API** para generación de contenido
- **Edge Functions** en Deno para APIs

### Herramientas
- **pnpm** para gestión de paquetes
- **ESLint** para linting
- **TypeScript** para type safety

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- pnpm
- Cuenta de Supabase
- API Key de OpenAI

### 1. Clonar el Repositorio
```bash
git clone https://github.com/tu-usuario/marketpro-gt.git
cd marketpro-gt
```

### 2. Instalar Dependencias
```bash
pnpm install
```

### 3. Configurar Variables de Entorno
Crear archivo `.env.local`:
```env
# Supabase
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key

# OpenAI
VITE_OPENAI_API_KEY=tu_openai_api_key
```

### 4. Configurar Base de Datos
```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar proyecto
supabase init

# Aplicar migraciones
supabase db push
```

### 5. Desplegar Edge Functions
```bash
# Desplegar todas las funciones
supabase functions deploy

# O desplegar individualmente
supabase functions deploy generate-content
supabase functions deploy generate-marketing-strategy
supabase functions deploy auth-manager
```

### 6. Ejecutar en Desarrollo
```bash
pnpm dev
```

## 📁 Estructura del Proyecto

```
marketpro-gt/
├── src/
│   ├── components/          # Componentes reutilizables
│   ├── pages/              # Páginas principales
│   ├── lib/                # Utilidades y configuración
│   └── types/              # Definiciones de tipos
├── supabase/
│   ├── functions/          # Edge Functions
│   └── migrations/         # Migraciones de BD
├── public/                 # Archivos estáticos
└── docs/                   # Documentación
```

## 🔐 Seguridad

### Variables de Entorno
- **NUNCA** commitees archivos `.env` al repositorio
- Usa `.env.example` para documentar variables requeridas
- Rota las API keys regularmente

### Base de Datos
- **Row Level Security (RLS)** habilitado en todas las tablas
- **Políticas de acceso** específicas por usuario
- **Validación de entrada** en todas las queries

### APIs
- **Autenticación JWT** requerida para todas las Edge Functions
- **Validación de entrada** en todos los endpoints
- **Rate limiting** implementado
- **CORS** configurado correctamente

## 📊 Base de Datos

### Tablas Principales
- `clients` - Información de clientes
- `campaigns` - Campañas de marketing
- `content` - Contenido generado
- `strategies` - Estrategias de marketing
- `analytics` - Métricas y análisis
- `authorized_users` - Usuarios autorizados

### Relaciones
- Un cliente puede tener múltiples campañas
- Una campaña puede tener múltiples contenidos
- Un cliente puede tener múltiples estrategias

## 🤖 Edge Functions

### generate-content
Genera contenido para redes sociales usando OpenAI GPT-5-nano.

**Parámetros:**
- `client_id`: ID del cliente
- `type`: Tipo de contenido (post, strategy, analysis)
- `platform`: Plataforma objetivo
- `topic`: Tema del contenido
- `tone`: Tono del contenido

### generate-marketing-strategy
Genera estrategias de marketing usando frameworks de Russell Brunson.

**Parámetros:**
- `clientId`: ID del cliente
- `strategyType`: Tipo de estrategia
- `customObjectives`: Objetivos personalizados

### auth-manager
Gestiona autenticación y autorización de usuarios.

## 🚀 Despliegue

### Producción
```bash
# Build para producción
pnpm build

# Desplegar a Vercel/Netlify
vercel --prod
```

### Variables de Entorno de Producción
Configurar en tu plataforma de hosting:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY`

## 📝 Uso

### 1. Autenticación
- Solo usuarios autorizados pueden acceder
- Lista de emails autorizados en `src/lib/auth.tsx`

### 2. Gestión de Clientes
- Seleccionar cliente activo desde el header
- Cambiar entre clientes según necesidad

### 3. Generación de Contenido
- Ir a "Generar Contenido"
- Seleccionar cliente, plataforma y tipo
- Personalizar tema y tono
- Generar contenido con IA

### 4. Estrategias de Marketing
- Ir a "Estrategias"
- Seleccionar tipo de estrategia
- Configurar objetivos personalizados
- Generar estrategia completa

## 🧪 Testing

```bash
# Ejecutar tests
pnpm test

# Tests con coverage
pnpm test:coverage

# Tests de integración
pnpm test:integration
```

## 📈 Monitoreo

### Logs
- Edge Functions logs en Supabase Dashboard
- Console logs en desarrollo
- Error tracking con Sentry (opcional)

### Métricas
- Uso de APIs en Supabase Dashboard
- Métricas de OpenAI en su dashboard
- Analytics de la aplicación

## 🤝 Contribución

1. Fork el proyecto
2. Crear branch para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

### Estándares de Código
- Usar TypeScript estricto
- Seguir convenciones de ESLint
- Escribir tests para nuevas funcionalidades
- Documentar APIs y componentes

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

- **Documentación**: [Wiki del proyecto](https://github.com/tu-usuario/marketpro-gt/wiki)
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/marketpro-gt/issues)
- **Email**: soporte@marketpro-gt.com

## 🙏 Agradecimientos

- **OpenAI** por la API de generación de contenido
- **Supabase** por la infraestructura backend
- **Russell Brunson** por los frameworks de marketing
- **Comunidad React** por las herramientas y librerías

---

**Desarrollado con ❤️ para el mercado guatemalteco**