#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 MarketPro GT - Script de Despliegue\n');

// Verificar que el build existe
if (!fs.existsSync('dist')) {
  console.log('❌ No se encontró el directorio dist. Ejecutando build...\n');
  try {
    execSync('pnpm build', { stdio: 'inherit' });
    console.log('✅ Build completado exitosamente\n');
  } catch (error) {
    console.error('❌ Error en el build:', error.message);
    process.exit(1);
  }
}

// Mostrar opciones de despliegue
console.log('📋 Opciones de despliegue disponibles:\n');
console.log('1. 🌐 Vercel (Recomendado)');
console.log('2. 🟢 Netlify');
console.log('3. 📁 GitHub Pages');
console.log('4. 🔥 Firebase Hosting');
console.log('5. 📦 Crear archivo ZIP para despliegue manual\n');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Selecciona una opción (1-5): ', (option) => {
  switch (option) {
    case '1':
      deployVercel();
      break;
    case '2':
      deployNetlify();
      break;
    case '3':
      deployGitHubPages();
      break;
    case '4':
      deployFirebase();
      break;
    case '5':
      createZip();
      break;
    default:
      console.log('❌ Opción inválida');
      rl.close();
  }
});

function deployVercel() {
  console.log('\n🌐 Desplegando en Vercel...\n');
  console.log('📝 Instrucciones:');
  console.log('1. Ejecuta: npx vercel login');
  console.log('2. Ejecuta: npx vercel --prod');
  console.log('3. Configura las variables de entorno en el dashboard de Vercel\n');
  
  console.log('🔧 Variables de entorno requeridas:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- VITE_SUPABASE_ANON_KEY');
  console.log('- VITE_OPENAI_API_KEY (opcional)\n');
  
  rl.close();
}

function deployNetlify() {
  console.log('\n🟢 Desplegando en Netlify...\n');
  console.log('📝 Instrucciones:');
  console.log('1. Ejecuta: npx netlify-cli login');
  console.log('2. Ejecuta: npx netlify-cli deploy --prod --dir=dist');
  console.log('3. Configura las variables de entorno en el dashboard de Netlify\n');
  
  console.log('🔧 Variables de entorno requeridas:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- VITE_SUPABASE_ANON_KEY');
  console.log('- VITE_OPENAI_API_KEY (opcional)\n');
  
  rl.close();
}

function deployGitHubPages() {
  console.log('\n📁 Desplegando en GitHub Pages...\n');
  
  try {
    // Instalar gh-pages si no está instalado
    console.log('📦 Instalando gh-pages...');
    execSync('pnpm add -D gh-pages', { stdio: 'inherit' });
    
    // Agregar script al package.json
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    if (!packageJson.scripts.deploy) {
      packageJson.scripts.deploy = 'gh-pages -d dist';
      fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
      console.log('✅ Script de deploy agregado al package.json');
    }
    
    console.log('🚀 Ejecutando despliegue...');
    execSync('pnpm run deploy', { stdio: 'inherit' });
    
    console.log('✅ Despliegue en GitHub Pages completado');
    console.log('🌐 Tu sitio estará disponible en: https://tu-usuario.github.io/tu-repositorio');
    
  } catch (error) {
    console.error('❌ Error en el despliegue:', error.message);
  }
  
  rl.close();
}

function deployFirebase() {
  console.log('\n🔥 Desplegando en Firebase...\n');
  console.log('📝 Instrucciones:');
  console.log('1. Ejecuta: npm install -g firebase-tools');
  console.log('2. Ejecuta: firebase login');
  console.log('3. Ejecuta: firebase init hosting');
  console.log('4. Configura firebase.json con:');
  console.log('   {');
  console.log('     "hosting": {');
  console.log('       "public": "dist",');
  console.log('       "rewrites": [{"source": "**", "destination": "/index.html"}]');
  console.log('     }');
  console.log('   }');
  console.log('5. Ejecuta: firebase deploy\n');
  
  rl.close();
}

function createZip() {
  console.log('\n📦 Creando archivo ZIP para despliegue manual...\n');
  
  try {
    const archiver = require('archiver');
    const output = fs.createWriteStream('marketpro-gt-deploy.zip');
    const archive = archiver('zip', { zlib: { level: 9 } });
    
    output.on('close', () => {
      console.log(`✅ Archivo ZIP creado: marketpro-gt-deploy.zip (${archive.pointer()} bytes)`);
      console.log('\n📋 Instrucciones para despliegue manual:');
      console.log('1. Sube el archivo ZIP a tu proveedor de hosting');
      console.log('2. Extrae el contenido en el directorio público');
      console.log('3. Configura las variables de entorno en tu servidor');
      console.log('4. Asegúrate de que el servidor sirva index.html para todas las rutas\n');
    });
    
    archive.on('error', (err) => {
      throw err;
    });
    
    archive.pipe(output);
    archive.directory('dist/', false);
    archive.finalize();
    
  } catch (error) {
    console.error('❌ Error creando ZIP:', error.message);
    console.log('💡 Alternativa: Comprime manualmente la carpeta dist/');
  }
  
  rl.close();
}
