#!/usr/bin/env node

/**
 * Generador de Elementos Visuales - Usando el endpoint que funciona
 * Basado en el código de image-generation-service.ts
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración - Usar variable de entorno
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
const API_URL = 'https://generativelanguage.googleapis.com/v1beta';
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
 * Mejora el prompt con estilo específico
 */
function enhancePrompt(prompt, style = 'realistic') {
  const styleEnhancements = {
    realistic: 'photorealistic, high quality, detailed, professional photography, sharp focus, perfect lighting, commercial quality',
    artistic: 'artistic, creative, expressive, unique style, digital art, vibrant colors, imaginative composition',
    cartoon: 'cartoon style, colorful, fun, animated, character design, playful, cheerful, kid-friendly',
    minimalist: 'minimalist, clean, simple, modern, geometric, elegant, sophisticated, uncluttered',
    vintage: 'vintage style, retro, classic, aged, nostalgic, timeless, traditional, authentic'
  };

  const enhancement = styleEnhancements[style] || '';
  const basePrompt = enhancement ? `${prompt}, ${enhancement}` : prompt;
  
  const additionalEnhancements = [
    'high resolution',
    'detailed',
    'well-composed',
    'visually appealing'
  ];
  
  return `${basePrompt}, ${additionalEnhancements.join(', ')}`;
}

/**
 * Genera una imagen usando la API de Imagen (endpoint que funciona)
 */
async function generateImage(prompt, filename, category) {
  try {
    console.log(`🎨 Generando ${category}: ${filename}`);
    console.log(`📝 Prompt: ${prompt.substring(0, 80)}...`);
    
    const enhancedPrompt = enhancePrompt(prompt, 'realistic');
    console.log(`✨ Prompt mejorado: ${enhancedPrompt.substring(0, 100)}...`);
    
    const response = await fetch(
      `${API_URL}/models/${MODEL}:predict`,
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': GEMINI_API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: enhancedPrompt
            }
          ],
          parameters: {
            sampleCount: 1,
            aspectRatio: '16:9',
            sampleImageSize: '1K',
            personGeneration: 'allow_adult'
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Error desconocido'}`);
    }

    const data = await response.json();
    console.log(`🔍 Respuesta de API recibida para ${filename}`);
    
    // Verificar que la respuesta tiene la estructura esperada
    if (!data.predictions || !Array.isArray(data.predictions)) {
      console.error('❌ Estructura de respuesta inesperada:', data);
      throw new Error('Respuesta de API no tiene la estructura esperada');
    }
    
    // Procesar la imagen generada
    const prediction = data.predictions[0];
    if (!prediction.bytesBase64Encoded) {
      console.error('❌ Predicción sin imagen:', prediction);
      throw new Error(`Predicción no contiene imagen`);
    }
    
    // Guardar la imagen
    const outputPath = path.join(ASSETS_DIR, category, filename);
    const imageBuffer = Buffer.from(prediction.bytesBase64Encoded, 'base64');
    
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
  console.log(`🌐 Endpoint: ${API_URL}/models/${MODEL}:predict`);
  
  if (!GEMINI_API_KEY) {
    console.error('❌ Error: VITE_GEMINI_API_KEY no está configurada');
    console.log('💡 Configura la variable de entorno:');
    console.log('   $env:VITE_GEMINI_API_KEY="tu_api_key_aqui"');
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
      console.log('⏳ Esperando 2 segundos...');
      await new Promise(resolve => setTimeout(resolve, 2000));
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




