#!/usr/bin/env node

/**
 * Script para configurar Supabase en MarketPro GT
 * Este script ayuda a configurar las variables de entorno necesarias
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Configuración de Supabase para MarketPro GT\n');

// Verificar si existe .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

if (envExists) {
  console.log('✅ Archivo .env.local encontrado');
  const envContent = fs.readFileSync(envPath, 'utf8');
  
  // Verificar si las variables están configuradas
  const hasSupabaseUrl = envContent.includes('VITE_SUPABASE_URL=') && 
                        !envContent.includes('VITE_SUPABASE_URL=your_supabase_project_url_here');
  const hasSupabaseKey = envContent.includes('VITE_SUPABASE_ANON_KEY=') && 
                        !envContent.includes('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here');
  
  if (hasSupabaseUrl && hasSupabaseKey) {
    console.log('✅ Variables de Supabase configuradas correctamente');
    console.log('🚀 El sistema debería funcionar correctamente');
  } else {
    console.log('⚠️  Variables de Supabase no configuradas correctamente');
    console.log('\n📋 Para configurar Supabase:');
    console.log('1. Ve a https://supabase.com/dashboard');
    console.log('2. Selecciona tu proyecto');
    console.log('3. Ve a Settings > API');
    console.log('4. Copia la URL del proyecto y la clave anónima');
    console.log('5. Actualiza el archivo .env.local con los valores reales');
  }
} else {
  console.log('❌ Archivo .env.local no encontrado');
  console.log('\n📋 Creando archivo .env.local...');
  
  const envTemplate = `# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Encryption Key for API Credentials
VITE_ENCRYPTION_KEY=marketpro-gt-encryption-key-2025

# OpenAI Configuration (if needed)
VITE_OPENAI_API_KEY=your_openai_api_key_here
`;

  try {
    fs.writeFileSync(envPath, envTemplate);
    console.log('✅ Archivo .env.local creado');
    console.log('\n📋 Próximos pasos:');
    console.log('1. Ve a https://supabase.com/dashboard');
    console.log('2. Selecciona tu proyecto');
    console.log('3. Ve a Settings > API');
    console.log('4. Copia la URL del proyecto y la clave anónima');
    console.log('5. Actualiza el archivo .env.local con los valores reales');
    console.log('6. Reinicia el servidor de desarrollo');
  } catch (error) {
    console.error('❌ Error al crear .env.local:', error.message);
    console.log('\n📋 Crea manualmente el archivo .env.local con el siguiente contenido:');
    console.log(envTemplate);
  }
}

console.log('\n🔍 Verificando conexión a Supabase...');

// Verificar si las variables están disponibles en el proceso actual
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (supabaseUrl && supabaseKey && 
    !supabaseUrl.includes('your_supabase_project_url_here') &&
    !supabaseKey.includes('your_supabase_anon_key_here')) {
  console.log('✅ Variables de entorno cargadas correctamente');
  console.log('🚀 Sistema listo para funcionar');
} else {
  console.log('⚠️  Variables de entorno no cargadas');
  console.log('💡 Reinicia el servidor de desarrollo después de configurar .env.local');
}

console.log('\n📚 Documentación del proyecto:');
console.log('- Estado actual: Fase 2 Sprint 2.3 (Twitter/X Integration)');
console.log('- Base de datos: 15 tablas implementadas');
console.log('- APIs disponibles: 6 proveedores configurados');
console.log('- Sistema de credenciales: AES-256 encryption');
console.log('\n🎯 Próximo objetivo: Implementar Twitter/X API v2');
