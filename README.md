# MarketPro GT 🚀

**Sistema completo de gestión de marketing digital con inteligencia artificial para empresas guatemaltecas**

## 📋 Descripción

MarketPro GT es una plataforma integral diseñada para empresas guatemaltecas que buscan optimizar sus estrategias de marketing digital. Combina herramientas tradicionales de marketing con tecnologías avanzadas de IA y algoritmos de Multi-Armed Bandit (MAB) para maximizar el ROI de las campañas.

## ✨ Características Principales

### 🎯 **A/B Testing Inteligente**
- Algoritmos Multi-Armed Bandit (MAB) para optimización automática
- Distribución adaptativa de tráfico
- Métricas en tiempo real y análisis predictivo

### 🤖 **Inteligencia Artificial Integrada**
- Generación automática de contenido
- Análisis de mercado impulsado por IA
- Recomendaciones personalizadas para cada cliente

### 👥 **Gestión Multi-Cliente**
- Dashboard centralizado para múltiples clientes
- Perfiles personalizados por industria
- Configuración específica de objetivos y KPIs

### 📊 **Analytics Avanzados**
- Métricas de rendimiento en tiempo real
- Reportes automatizados
- Visualizaciones interactivas

### 🔗 **Integraciones**
- APIs de redes sociales
- Plataformas de email marketing
- Herramientas de analytics

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** + **TypeScript**
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Styling moderno
- **Radix UI** - Componentes accesibles
- **React Router** - Navegación
- **TanStack Query** - Gestión de estado del servidor
- **React Hook Form** - Manejo de formularios
- **Recharts** - Visualización de datos

### Backend
- **Supabase** - Backend-as-a-Service
  - Base de datos PostgreSQL
  - Autenticación
  - Edge Functions (Serverless)
  - Storage
  - Real-time subscriptions

### IA y ML
- **OpenAI API** - Generación de contenido
- **Algoritmos MAB** - Optimización de campañas

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ 
- pnpm (recomendado) o npm
- Cuenta en Supabase
- Clave API de OpenAI (opcional)

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/marketpro-gt.git
cd marketpro-gt
```

### 2. Instalar dependencias
```bash
pnpm install
# o
npm install
```

### 3. Configurar variables de entorno
```bash
# Copia el archivo de ejemplo
cp .env.example .env.local

# Edita .env.local con tus credenciales
```

**Configuración de .env.local:**
```env
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_aqui
VITE_OPENAI_API_KEY=sk-tu_clave_openai_aqui
```

### 4. Configurar Supabase

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta las migraciones de base de datos (scripts en `/supabase/migrations/`)
3. Configura las políticas RLS (Row Level Security)
4. Despliega las Edge Functions

### 5. Ejecutar en desarrollo
```bash
pnpm dev
# o
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
marketpro-gt/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── ui/             # Componentes base de UI
│   │   ├── ab-testing/     # Componentes específicos de A/B Testing
│   │   └── Layout.tsx      # Layout principal
│   ├── pages/              # Páginas de la aplicación
│   │   ├── Dashboard.tsx
│   │   ├── ClientsPage.tsx
│   │   ├── ABTestingPage.tsx
│   │   └── ...
│   ├── lib/                # Utilidades y configuración
│   │   ├── supabase.ts     # Cliente de Supabase
│   │   ├── auth.tsx        # Contexto de autenticación
│   │   └── utils.ts        # Funciones utilitarias
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Punto de entrada
├── supabase/               # Configuración de Supabase
│   ├── functions/          # Edge Functions
│   ├── migrations/         # Migraciones de DB
│   └── config.toml         # Configuración
├── public/                 # Archivos estáticos
└── docs/                   # Documentación
```

## 🎮 Uso

### 1. Configuración Inicial
1. Registra tu cuenta o inicia sesión
2. Crea tu primer cliente en la sección "Clientes"
3. Configura las integraciones API necesarias

### 2. Gestión de Clientes
- Agrega información detallada del cliente
- Define objetivos y KPIs específicos
- Configura integraciones personalizadas

### 3. A/B Testing
- Crea experimentos MAB
- Define variaciones de contenido
- Monitorea resultados en tiempo real
- Permite que el algoritmo optimice automáticamente

### 4. Generación de Contenido IA
- Genera copy para anuncios
- Crea contenido para redes sociales
- Optimiza textos existentes

## 🔧 Scripts Disponibles

```bash
# Desarrollo
pnpm dev

# Build para producción
pnpm build

# Preview del build
pnpm preview

# Linting
pnpm lint

# Limpiar node_modules
pnpm clean
```

## 🌐 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio con Vercel
2. Configura las variables de entorno
3. Deploy automático en cada push

### Netlify
1. Conecta tu repositorio
2. Build command: `pnpm build`
3. Publish directory: `dist`

### Otros proveedores
La aplicación es compatible con cualquier proveedor que soporte sitios estáticos.

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

**MarketPro GT Team**
- Email: contacto@marketpro.gt
- Website: [www.marketpro.gt](https://www.marketpro.gt)

## 🆘 Soporte

Si tienes problemas o preguntas:

1. Revisa la [documentación](./docs/)
2. Busca en los [Issues](https://github.com/tu-usuario/marketpro-gt/issues)
3. Crea un nuevo issue si no encuentras solución

## 🛣️ Roadmap

- [ ] **Q1 2025**: Integración con WhatsApp Business
- [ ] **Q2 2025**: Dashboard móvil nativo
- [ ] **Q3 2025**: Análisis predictivo avanzado
- [ ] **Q4 2025**: Automatización de campañas cross-platform

---

**Hecho con ❤️ para empresas guatemaltecas**