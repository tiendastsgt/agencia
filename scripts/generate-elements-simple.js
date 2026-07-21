#!/usr/bin/env node

/**
 * Generador Simple de Elementos Visuales
 * Usa la configuración existente del proyecto
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Importar configuración
const { API_CONFIG } = await import('../config/api-keys.ts');

// Configuración
const GEMINI_API_KEY = API_CONFIG.GOOGLE_AI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta';
const MODEL = 'imagen-4.0-generate-001';

// Rutas
const ASSETS_DIR = path.join(__dirname, '..', 'assets', 'visual-elements');

// Elementos básicos para generar
const BASIC_ELEMENTS = [
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
    category: 'illustrations',
    filename: 'illustration-apicultura-urbana.png',
    prompt: 'Clean modern illustration of urban beehive, educational style, golden and brown palette, professional design, no text, 800x600px'
  },
  {
    category: 'icons',
    filename: 'icon-bee.png',
    prompt: 'Minimalist bee icon, golden color, clean design, no text, 128x128px'
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
 * Genera elementos básicos
 */
async function generateBasicElements() {
  console.log('🚀 Iniciando generación de elementos básicos...');
  console.log(`📁 Directorio de salida: ${ASSETS_DIR}`);
  
  if (!GEMINI_API_KEY || GEMINI_API_KEY.includes('your-')) {
    console.error('❌ Error: GOOGLE_AI_API_KEY no está configurada en config/api-keys.ts');
    console.log('💡 Por favor, edita el archivo config/api-keys.ts y agrega tu API key real');
    process.exit(1);
  }

  const results = [];

  for (const element of BASIC_ELEMENTS) {
    const result = await generateImage(element.prompt, element.filename, element.category);
    results.push(result);
    
    // Pausa entre requests para evitar rate limits
    await new Promise(resolve => setTimeout(resolve, 3000));
  }

  // Reporte
  console.log('\n📊 REPORTE DE GENERACIÓN:');
  console.log('========================');
  
  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  
  console.log(`✅ Exitosos: ${successful}`);
  console.log(`❌ Fallidos: ${failed}`);
  
  if (failed > 0) {
    console.log('\n❌ Elementos fallidos:');
    results.filter(r => !r.success).forEach(r => {
      console.log(`  - ${r.filename}: ${r.error}`);
    });
  }
  
  console.log('\n🎉 Generación completada!');
  console.log(`📁 Elementos guardados en: ${ASSETS_DIR}`);
}

// Ejecutar
generateBasicElements().catch(console.error);
