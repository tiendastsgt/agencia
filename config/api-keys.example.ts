// config/api-keys.example.ts
// Configuración de APIs para Generación de Contenido Visual
// Copia este archivo como api-keys.local.ts y configura tus claves en .env

export const API_CONFIG = {
  // APIs de Imágenes
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || 'sk-your-openai-api-key-here',
  STABILITY_API_KEY: import.meta.env.VITE_STABILITY_API_KEY || 'sk-your-stability-api-key-here',
  GOOGLE_AI_API_KEY: import.meta.env.VITE_GOOGLE_AI_API_KEY || 'your-google-ai-api-key-here',
  
  // APIs de Videos
  RUNWAY_API_KEY: import.meta.env.VITE_RUNWAY_API_KEY || 'your-runway-api-key-here',
  PIKA_API_KEY: import.meta.env.VITE_PIKA_API_KEY || 'your-pika-api-key-here',
  LUMA_API_KEY: import.meta.env.VITE_LUMA_API_KEY || 'your-luma-api-key-here',
  
  // Supabase Configuration
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key',
}

// Instrucciones de configuración:
// 1. Crea un archivo .env en la raíz del proyecto
// 2. Define las claves reales en .env (ej: VITE_OPENAI_API_KEY=sk-tu-clave)
// 3. Asegúrate de que .env y api-keys.local.ts estén en .gitignore
// 4. Las claves se cargarán automáticamente desde .env

export default API_CONFIG
