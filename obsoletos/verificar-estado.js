#!/usr/bin/env node

console.log('🔍 Verificando estado real de MarketPro GT\n');

// Verificar configuración actual
import fs from 'fs';

console.log('📋 CONFIGURACIÓN ACTUAL:\n');

// 1. Verificar config/api-keys.ts
try {
  const apiKeys = fs.readFileSync('config/api-keys.ts', 'utf8');
  const hasPlaceholders = apiKeys.includes('your-project.supabase.co') || apiKeys.includes('your-supabase-anon-key');
  
  console.log('1️⃣ config/api-keys.ts:');
  if (hasPlaceholders) {
    console.log('   ❌ Tiene placeholders (no configurado)');
    console.log('   📝 Necesitas: URL y clave real de Supabase');
  } else {
    console.log('   ✅ Configurado con valores reales');
  }
} catch (error) {
  console.log('   ❌ Archivo no encontrado');
}

// 2. Verificar .env.local
try {
  const envFile = fs.readFileSync('.env.local', 'utf8');
  const hasPlaceholders = envFile.includes('your-project.supabase.co') || envFile.includes('your-supabase-anon-key');
  
  console.log('\n2️⃣ .env.local:');
  if (hasPlaceholders) {
    console.log('   ❌ Tiene placeholders (no configurado)');
  } else {
    console.log('   ✅ Configurado con valores reales');
  }
} catch (error) {
  console.log('   ❌ Archivo .env.local no encontrado');
}

// 3. Verificar build
try {
  const distExists = fs.existsSync('dist');
  console.log('\n3️⃣ Build de producción:');
  if (distExists) {
    console.log('   ✅ Directorio dist/ existe');
    const files = fs.readdirSync('dist');
    console.log(`   📁 Archivos: ${files.length}`);
  } else {
    console.log('   ❌ Directorio dist/ no existe');
    console.log('   📝 Ejecuta: pnpm build');
  }
} catch (error) {
  console.log('   ❌ Error verificando build');
}

// 4. Verificar Edge Functions
try {
  const functionsDir = fs.existsSync('supabase/functions');
  console.log('\n4️⃣ Edge Functions:');
  if (functionsDir) {
    const functions = fs.readdirSync('supabase/functions');
    console.log(`   ✅ ${functions.length} funciones creadas:`);
    functions.forEach(func => {
      console.log(`      - ${func}`);
    });
  } else {
    console.log('   ❌ Directorio supabase/functions no existe');
  }
} catch (error) {
  console.log('   ❌ Error verificando Edge Functions');
}

console.log('\n🎯 RESUMEN:');
console.log('Si tienes placeholders en config/api-keys.ts, necesitas:');
console.log('1. Crear proyecto en Supabase (si no lo tienes)');
console.log('2. Obtener URL y clave real');
console.log('3. Actualizar config/api-keys.ts');
console.log('4. Ejecutar pnpm dev para probar');
console.log('\nSi ya tienes configuración real, tu app debería funcionar! 🚀');
