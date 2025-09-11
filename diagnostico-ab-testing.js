#!/usr/bin/env node

console.log('🔍 Diagnóstico de la página A/B Testing\n');

// Verificar si hay errores en la consola del navegador
console.log('📋 POSIBLES CAUSAS DEL PROBLEMA:\n');

console.log('1️⃣ AUTENTICACIÓN:');
console.log('   - La página /ab-testing requiere estar autenticado');
console.log('   - Si no estás logueado, te redirige a /login');
console.log('   - Verifica que tengas una sesión activa en Supabase\n');

console.log('2️⃣ CLIENTE ACTIVO:');
console.log('   - La página requiere un cliente activo seleccionado');
console.log('   - Si no hay clientes en la base de datos, la página no funcionará');
console.log('   - Verifica que existan clientes en la tabla "clients"\n');

console.log('3️⃣ BASE DE DATOS:');
console.log('   - Las tablas MAB deben existir en Supabase');
console.log('   - Verifica: mab_experiments, mab_arm_performance, etc.\n');

console.log('4️⃣ VARIABLES DE ENTORNO:');
console.log('   - VITE_SUPABASE_URL debe ser correcta');
console.log('   - VITE_SUPABASE_ANON_KEY debe ser válida\n');

console.log('🔧 SOLUCIONES:\n');

console.log('SOLUCIÓN 1: Verificar autenticación');
console.log('1. Ve a http://localhost:5173/');
console.log('2. Si te redirige a /login, inicia sesión');
console.log('3. Luego ve a /ab-testing\n');

console.log('SOLUCIÓN 2: Crear cliente de prueba');
console.log('1. Ve a http://localhost:5173/clients');
console.log('2. Crea un cliente de prueba');
console.log('3. Selecciona ese cliente como activo\n');

console.log('SOLUCIÓN 3: Verificar base de datos');
console.log('1. Ve a http://localhost:5173/');
console.log('2. Busca el componente "DatabaseStatus"');
console.log('3. Verifica que las tablas MAB existan\n');

console.log('SOLUCIÓN 4: Modo desarrollo sin autenticación');
console.log('1. Comenta la línea ProtectedRoute en App.tsx');
console.log('2. O crea datos demo en la página\n');

console.log('🎯 PRUEBA RÁPIDA:');
console.log('1. Abre http://localhost:5173/ en el navegador');
console.log('2. Abre las herramientas de desarrollador (F12)');
console.log('3. Ve a la pestaña "Console"');
console.log('4. Ve a http://localhost:5173/ab-testing');
console.log('5. Revisa si hay errores en la consola\n');

console.log('💡 Si ves errores de Supabase, el problema es la conexión a la base de datos');
console.log('💡 Si ves errores de autenticación, necesitas iniciar sesión');
console.log('💡 Si no hay errores, el problema puede ser que no hay datos demo\n');
