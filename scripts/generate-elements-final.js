#!/usr/bin/env node

/**
 * Generador Final de Elementos Visuales
 * Usa variables de entorno o configuración directa
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración - Usar variable de entorno o valor por defecto
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY || 'your-google-ai-api-key-here';
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'imagen-4.0-generate-001';

// Rutas
const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'visual-elements');

// Elementos para generar
const ELEMENTS_TO_GENERATE = [
  // Fondos
  {
    category: 'backgrounds',
    filename: 'background-autosuficiencia.png',
    prompt: 'Professional gradient background for home self-sufficiency courses, warm earthy tones (golden, brown, green), modern clean design, no text, 1200x1600px'
  },
  {
    category: 'backgrounds', 
    filename: 'background-libertad-financiera.png',
    prompt: 'Professional gradient background for financial freedom courses, tech-inspired colors (blue, purple, green), modern clean design, no text, 1200x1600px'
  },
  {
    category: 'backgrounds',
    filename: 'background-crecimiento-personal.png',
    prompt: 'Professional gradient background for personal growth courses, warm inspiring colors (gold, orange, white), modern clean design, no text, 1200x1600px'
  },
  {
    category: 'backgrounds',
    filename: 'background-vida-espiritual.png',
    prompt: 'Professional gradient background for spiritual life courses, celestial colors (blue, white, gold), peaceful modern design, no text, 1200x1600px'
  },
  
  // Ilustraciones principales
  {
    category: 'illustrations',
    filename: 'illustration-apicultura-urbana.png',
    prompt: 'Clean modern illustration of urban beehive, educational style, golden and brown palette, professional design, no text, 800x600px'
  },
  {
    category: 'illustrations',
    filename: 'illustration-cocina-chapina.png',
    prompt: 'Clean illustration of traditional Guatemalan kitchen, educational style, warm colors (orange, yellow, red), professional design, no text, 800x600px'
  },
  {
    category: 'illustrations',
    filename: 'illustration-matematica-practica.png',
    prompt: 'Clean illustration of calculator and measurement tools, educational style, blue professional palette, modern design, no text, 800x600px'
  },
  {
    category: 'illustrations',
    filename: 'illustration-ia-practica.png',
    prompt: 'Clean illustration of digital brain with circuits, tech style, blue-purple-green palette, modern design, no text, 800x600px'
  },
  
  // Iconos básicos
  {
    category: 'icons',
    filename: 'icon-bee.png',
    prompt: 'Minimalist bee icon, golden color, clean design, no text, 128x128px'
  },
  {
    category: 'icons',
    filename: 'icon-beehive.png',
    prompt: 'Minimalist beehive icon, brown color, clean design, no text, 128x128px'
  },
  {
    category: 'icons',
    filename: 'icon-calculator.png',
    prompt: 'Minimalist calculator icon, blue color, clean design, no text, 128x128px'
  },
  {
    category: 'icons',
    filename: 'icon-robot.png',
    prompt: 'Minimalist robot icon, purple color, clean design, no text, 128x128px'
  },
  
  // Elementos decorativos
  {
    category: 'decorative',
    filename: 'pattern-honeycomb.png',
    prompt: 'Subtle honeycomb pattern, golden color, transparent background, 400x400px'
  },
  {
    category: 'decorative',
    filename: 'pattern-geometric.png',
    prompt: 'Subtle geometric pattern, blue color, transparent background, 400x400px'
  }
];

/**
 * Genera una imagen usando la API de Imagen
 */
async function generateImage(prompt, filename, category) {
  try {
    console.log(`🎨 Generando ${category}: ${filename}`);
    console.log(`📝 Prompt: ${prompt.substring(0, 80)}...`);
    
    const response = await fetch(`${BASE_URL}/models/${MODEL}:generateImages?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        prompt: prompt,
        config: {
          number_of_images: 1,
          aspect_ratio: '16:9',
          negative_prompt: 'text, words, letters, watermark, blurry, ugly, deformed, noisy, jpeg artifacts, signature',
          person_generation: 'dont_allow'
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (!result.generated_images || result.generated_images.length === 0) {
      throw new Error('No se generaron imágenes');
    }

    const imageData = result.generated_images[0].image.base64_data;
    
    // Guardar la imagen
    const outputPath = path.join(ASSETS_DIR, category, filename);
    const imageBuffer = Buffer.from(imageData, 'base64');
    
    await fs.writeFile(outputPath, imageBuffer);
    
    console.log(`✅ Generado exitosamente: ${filename}`);
    return { success: true, filename, path: outputPath };
    
  } catch (error) {
    console.error(`❌ Error generando ${filename}:`, error.message);
    return { success: false, filename, error: error.message };
  }
}

/**
 * Genera todos los elementos
 */
async function generateAllElements() {
  console.log('🚀 Iniciando generación de elementos visuales...');
  console.log(`📁 Directorio de salida: ${ASSETS_DIR}`);
  console.log(`🔑 API Key configurada: ${GEMINI_API_KEY ? 'Sí' : 'No'}`);
  
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('your-')) {
    console.error('❌ Error: API Key no está configurada correctamente');
    console.log('💡 Opciones para configurar:');
    console.log('   1. Crear archivo .env.local con VITE_GEMINI_API_KEY=tu_api_key');
    console.log('   2. Ejecutar: $env:VITE_GEMINI_API_KEY="tu_api_key"');
    console.log('   3. Editar config/api-keys.ts con tu API key real');
    process.exit(1);
  }

  const results = [];

  for (let i = 0; i < ELEMENTS_TO_GENERATE.length; i++) {
    const element = ELEMENTS_TO_GENERATE[i];
    console.log(`\n📊 Progreso: ${i + 1}/${ELEMENTS_TO_GENERATE.length}`);
    
    const result = await generateImage(element.prompt, element.filename, element.category);
    results.push(result);
    
    // Pausa entre requests para evitar rate limits
    if (i < ELEMENTS_TO_GENERATE.length - 1) {
      console.log('⏳ Esperando 3 segundos...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Reporte final
  console.log('\n📊 REPORTE FINAL DE GENERACIÓN:');
  console.log('================================');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`📈 Total de elementos: ${results.length}`);
  console.log(`✅ Exitosos: ${successful}`);
  console.log(`❌ Fallidos: ${failed}`);
  
  if (successful > 0) {
    console.log('\n✅ Elementos generados exitosamente:');
    results.filter(r => r.success).forEach(r => {
      console.log(`  - ${r.filename} → ${r.path}`);
    });
  }
  
  if (failed > 0) {
    console.log('\n❌ Elementos fallidos:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.filename}: ${r.error}`);
    });
  }
  
  console.log('\n🎉 Generación completada!');
  console.log(`📁 Elementos guardados en: ${ASSETS_DIR}`);
  
  // Mostrar estructura de carpetas
  console.log('\n📂 Estructura generada:');
  try {
    const categories = ['backgrounds', 'illustrations', 'icons', 'decorative'];
    for (const category of categories) {
      const categoryPath = path.join(ASSETS_DIR, category);
      const files = await fs.readdir(categoryPath);
      console.log(`  ${category}/ (${files.length} archivos)`);
      files.forEach(file => console.log(`    - ${file}`));
    }
  } catch (error) {
    console.log('  (No se pudo leer la estructura de carpetas)');
  }
}

// Ejecutar
generateAllElements().catch(console.error);




