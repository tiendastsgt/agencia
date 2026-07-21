#!/usr/bin/env node

/**
 * Generador de Elementos Visuales para Infografías de Cursos
 * 
 * Este script genera elementos visuales usando la API de Gemini/Imagen
 * para crear fondos, ilustraciones, iconos y elementos decorativos
 * para las infografías de los cursos.
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración
const GEMINI_API_KEY = process.env.VITE_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'imagen-4.0-generate-001';

// Rutas
const DATA_DIR = path.join(__dirname, '..', 'data');
const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'visual-elements');

// Configuración de elementos visuales
const VISUAL_ELEMENTS_CONFIG = {
  backgrounds: {
    'autosuficiencia': {
      prompt: 'Professional gradient background for home self-sufficiency courses, warm earthy tones (golden, brown, green), modern clean design, no text, 1200x1600px',
      filename: 'background-autosuficiencia.png'
    },
    'libertad-financiera': {
      prompt: 'Professional gradient background for financial freedom courses, tech-inspired colors (blue, purple, green), modern clean design, no text, 1200x1600px',
      filename: 'background-libertad-financiera.png'
    },
    'crecimiento-personal': {
      prompt: 'Professional gradient background for personal growth courses, warm inspiring colors (gold, orange, white), modern clean design, no text, 1200x1600px',
      filename: 'background-crecimiento-personal.png'
    },
    'vida-espiritual': {
      prompt: 'Professional gradient background for spiritual life courses, celestial colors (blue, white, gold), peaceful modern design, no text, 1200x1600px',
      filename: 'background-vida-espiritual.png'
    }
  },
  
  illustrations: {
    'apicultura-urbana': {
      prompt: 'Clean modern illustration of urban beehive, educational style, golden and brown palette, professional design, no text, 800x600px',
      filename: 'illustration-apicultura-urbana.png'
    },
    'cocina-chapina': {
      prompt: 'Clean illustration of traditional Guatemalan kitchen, educational style, warm colors (orange, yellow, red), professional design, no text, 800x600px',
      filename: 'illustration-cocina-chapina.png'
    },
    'matematica-practica': {
      prompt: 'Clean illustration of calculator and measurement tools, educational style, blue professional palette, modern design, no text, 800x600px',
      filename: 'illustration-matematica-practica.png'
    },
    'ia-practica': {
      prompt: 'Clean illustration of digital brain with circuits, tech style, blue-purple-green palette, modern design, no text, 800x600px',
      filename: 'illustration-ia-practica.png'
    },
    'liderazgo-servicial': {
      prompt: 'Clean illustration of hands united in service, warm style, gold-orange-white palette, inspiring design, no text, 800x600px',
      filename: 'illustration-liderazgo-servicial.png'
    },
    'liturgia-viva': {
      prompt: 'Clean illustration of church with community, spiritual style, blue-white-gold palette, peaceful design, no text, 800x600px',
      filename: 'illustration-liturgia-viva.png'
    },
    'economia-comunion': {
      prompt: 'Clean illustration of community working together, solidarity style, green-blue-white palette, collaborative design, no text, 800x600px',
      filename: 'illustration-economia-comunion.png'
    }
  },
  
  icons: {
    'apicultura': [
      { prompt: 'Minimalist bee icon, golden color, clean design, no text, 128x128px', filename: 'icon-bee.png' },
      { prompt: 'Minimalist beehive icon, brown color, clean design, no text, 128x128px', filename: 'icon-beehive.png' },
      { prompt: 'Minimalist honey jar icon, golden color, clean design, no text, 128x128px', filename: 'icon-honey.png' },
      { prompt: 'Minimalist beekeeping tools icon, brown color, clean design, no text, 128x128px', filename: 'icon-tools.png' }
    ],
    'cocina': [
      { prompt: 'Minimalist cooking pot icon, orange color, clean design, no text, 128x128px', filename: 'icon-pot.png' },
      { prompt: 'Minimalist spoon icon, brown color, clean design, no text, 128x128px', filename: 'icon-spoon.png' },
      { prompt: 'Minimalist ingredients icon, colorful, clean design, no text, 128x128px', filename: 'icon-ingredients.png' },
      { prompt: 'Minimalist fire icon, red color, clean design, no text, 128x128px', filename: 'icon-fire.png' }
    ],
    'matematica': [
      { prompt: 'Minimalist calculator icon, blue color, clean design, no text, 128x128px', filename: 'icon-calculator.png' },
      { prompt: 'Minimalist numbers icon, blue color, clean design, no text, 128x128px', filename: 'icon-numbers.png' },
      { prompt: 'Minimalist graph icon, blue color, clean design, no text, 128x128px', filename: 'icon-graph.png' },
      { prompt: 'Minimalist ruler icon, blue color, clean design, no text, 128x128px', filename: 'icon-ruler.png' }
    ],
    'tecnologia': [
      { prompt: 'Minimalist robot icon, purple color, clean design, no text, 128x128px', filename: 'icon-robot.png' },
      { prompt: 'Minimalist computer icon, blue color, clean design, no text, 128x128px', filename: 'icon-computer.png' },
      { prompt: 'Minimalist chip icon, green color, clean design, no text, 128x128px', filename: 'icon-chip.png' },
      { prompt: 'Minimalist digital tools icon, blue color, clean design, no text, 128x128px', filename: 'icon-digital-tools.png' }
    ],
    'liderazgo': [
      { prompt: 'Minimalist heart icon, gold color, clean design, no text, 128x128px', filename: 'icon-heart.png' },
      { prompt: 'Minimalist community icon, orange color, clean design, no text, 128x128px', filename: 'icon-community.png' },
      { prompt: 'Minimalist leader icon, gold color, clean design, no text, 128x128px', filename: 'icon-leader.png' },
      { prompt: 'Minimalist service icon, white color, clean design, no text, 128x128px', filename: 'icon-service.png' }
    ],
    'espiritualidad': [
      { prompt: 'Minimalist cross icon, gold color, clean design, no text, 128x128px', filename: 'icon-cross.png' },
      { prompt: 'Minimalist chalice icon, gold color, clean design, no text, 128x128px', filename: 'icon-chalice.png' },
      { prompt: 'Minimalist book icon, blue color, clean design, no text, 128x128px', filename: 'icon-book.png' },
      { prompt: 'Minimalist community icon, white color, clean design, no text, 128x128px', filename: 'icon-spiritual-community.png' }
    ]
  },
  
  decorative: {
    'patterns': [
      { prompt: 'Subtle honeycomb pattern, golden color, transparent background, 400x400px', filename: 'pattern-honeycomb.png' },
      { prompt: 'Subtle geometric pattern, blue color, transparent background, 400x400px', filename: 'pattern-geometric.png' },
      { prompt: 'Subtle circuit pattern, purple color, transparent background, 400x400px', filename: 'pattern-circuit.png' },
      { prompt: 'Subtle connection pattern, gold color, transparent background, 400x400px', filename: 'pattern-connection.png' }
    ],
    'borders': [
      { prompt: 'Elegant border design, golden color, transparent background, 1200x100px', filename: 'border-golden.png' },
      { prompt: 'Elegant border design, blue color, transparent background, 1200x100px', filename: 'border-blue.png' },
      { prompt: 'Elegant border design, green color, transparent background, 1200x100px', filename: 'border-green.png' }
    ]
  }
};

/**
 * Genera una imagen usando la API de Imagen
 */
async function generateImage(prompt, filename, category) {
  try {
    console.log(`🎨 Generando ${category}: ${filename}`);
    console.log(`📝 Prompt: ${prompt.substring(0, 100)}...`);
    
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
    const mimeType = result.generated_images[0].image.mime_type;
    
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
 * Genera todos los elementos visuales
 */
async function generateAllElements() {
  console.log('🚀 Iniciando generación de elementos visuales...');
  console.log(`📁 Directorio de salida: ${ASSETS_DIR}`);
  
  if (!GEMINI_API_KEY) {
    console.error('❌ Error: VITE_GEMINI_API_KEY no está configurada');
    process.exit(1);
  }

  const results = {
    backgrounds: [],
    illustrations: [],
    icons: [],
    decorative: []
  };

  // Generar fondos
  console.log('\n🎨 Generando fondos...');
  for (const [key, config] of Object.entries(VISUAL_ELEMENTS_CONFIG.backgrounds)) {
    const result = await generateImage(config.prompt, config.filename, 'backgrounds');
    results.backgrounds.push(result);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Pausa entre requests
  }

  // Generar ilustraciones
  console.log('\n🖼️ Generando ilustraciones...');
  for (const [key, config] of Object.entries(VISUAL_ELEMENTS_CONFIG.illustrations)) {
    const result = await generateImage(config.prompt, config.filename, 'illustrations');
    results.illustrations.push(result);
    await new Promise(resolve => setTimeout(resolve, 2000)); // Pausa entre requests
  }

  // Generar iconos
  console.log('\n🔧 Generando iconos...');
  for (const [category, icons] of Object.entries(VISUAL_ELEMENTS_CONFIG.icons)) {
    console.log(`  📂 Categoría: ${category}`);
    for (const icon of icons) {
      const result = await generateImage(icon.prompt, icon.filename, 'icons');
      results.icons.push(result);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa entre requests
    }
  }

  // Generar elementos decorativos
  console.log('\n✨ Generando elementos decorativos...');
  for (const [type, elements] of Object.entries(VISUAL_ELEMENTS_CONFIG.decorative)) {
    console.log(`  📂 Tipo: ${type}`);
    for (const element of elements) {
      const result = await generateImage(element.prompt, element.filename, 'decorative');
      results.decorative.push(result);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa entre requests
    }
  }

  // Generar reporte
  console.log('\n📊 REPORTE DE GENERACIÓN:');
  console.log('========================');
  
  const totalElements = Object.values(results).flat().length;
  const successfulElements = Object.values(results).flat().filter(r => r.success).length;
  const failedElements = totalElements - successfulElements;
  
  console.log(`📈 Total de elementos: ${totalElements}`);
  console.log(`✅ Exitosos: ${successfulElements}`);
  console.log(`❌ Fallidos: ${failedElements}`);
  
  if (failedElements > 0) {
    console.log('\n❌ Elementos fallidos:');
    Object.values(results).flat()
      .filter(r => !r.success)
      .forEach(r => console.log(`  - ${r.filename}: ${r.error}`));
  }
  
  console.log('\n🎉 Generación completada!');
  console.log(`📁 Elementos guardados en: ${ASSETS_DIR}`);
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllElements().catch(console.error);
}

export { generateAllElements, generateImage, VISUAL_ELEMENTS_CONFIG };




