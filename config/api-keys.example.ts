// Configuración de APIs para Generación de Contenido Visual
// Copia este archivo como api-keys.ts y configura tus API keys

export const API_CONFIG = {
  // APIs de Imágenes
  OPENAI_API_KEY: 'sk-your-openai-api-key-here', // DALL-E 3
  STABILITY_API_KEY: 'sk-your-stability-api-key-here', // Stable Diffusion
  GOOGLE_AI_API_KEY: 'your-google-ai-api-key-here', // Google Imagen
  
  // APIs de Videos
  RUNWAY_API_KEY: 'your-runway-api-key-here', // RunwayML Gen-4
  PIKA_API_KEY: 'your-pika-api-key-here', // Pika Labs
  LUMA_API_KEY: 'your-luma-api-key-here', // Luma AI Dream Machine
  
  // Supabase Configuration
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-supabase-anon-key'
}

// Instrucciones de configuración:
// 1. Copia este archivo como api-keys.ts
// 2. Reemplaza las API keys con tus claves reales
// 3. Asegúrate de que api-keys.ts esté en .gitignore
// 4. Las API keys se cargarán automáticamente en la aplicación

export default API_CONFIG
