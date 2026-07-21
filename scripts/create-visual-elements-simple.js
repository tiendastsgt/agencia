#!/usr/bin/env node

/**
 * Script simple para crear elementos visuales básicos
 * 
 * Este script crea archivos de elementos visuales básicos
 * que serán usados por el sistema de infografías.
 */

import fs from 'fs/promises';
import path from 'path';

// Crear directorios si no existen
async function ensureDirectories() {
  const baseDir = 'assets/visual-elements';
  const categories = ['backgrounds', 'illustrations', 'icons', 'decorative'];
  
  for (const category of categories) {
    const dirPath = path.join(baseDir, category);
    try {
      await fs.mkdir(dirPath, { recursive: true });
      console.log(`✅ Directorio creado: ${dirPath}`);
    } catch (error) {
      console.log(`📁 Directorio ya existe: ${dirPath}`);
    }
  }
}

// Crear archivos de elementos visuales básicos
async function createBasicVisualElements() {
  console.log('🎨 Creando elementos visuales básicos...');
  
  try {
    // Crear directorios
    await ensureDirectories();
    
    // Crear archivos de fondo (SVG básicos)
    const backgrounds = {
      'background-autosuficiencia.png': createAutosuficienciaSVG(),
      'background-libertad-financiera.png': createLibertadFinancieraSVG(),
      'background-crecimiento-personal.png': createCrecimientoPersonalSVG(),
      'background-vida-espiritual.png': createVidaEspiritualSVG()
    };
    
    for (const [filename, svgContent] of Object.entries(backgrounds)) {
      await fs.writeFile(`assets/visual-elements/backgrounds/${filename}`, svgContent);
      console.log(`✅ Fondo creado: ${filename}`);
    }
    
    // Crear ilustraciones básicas
    const illustrations = {
      'illustration-apicultura-urbana.png': createApiculturaSVG()
    };
    
    for (const [filename, svgContent] of Object.entries(illustrations)) {
      await fs.writeFile(`assets/visual-elements/illustrations/${filename}`, svgContent);
      console.log(`✅ Ilustración creada: ${filename}`);
    }
    
    // Crear iconos básicos
    const icons = {
      'icon-bee.png': createBeeSVG(),
      'icon-calculator.png': createCalculatorSVG()
    };
    
    for (const [filename, svgContent] of Object.entries(icons)) {
      await fs.writeFile(`assets/visual-elements/icons/${filename}`, svgContent);
      console.log(`✅ Icono creado: ${filename}`);
    }
    
    // Crear elementos decorativos
    const decorative = {
      'pattern-honeycomb.png': createHoneycombSVG()
    };
    
    for (const [filename, svgContent] of Object.entries(decorative)) {
      await fs.writeFile(`assets/visual-elements/decorative/${filename}`, svgContent);
      console.log(`✅ Elemento decorativo creado: ${filename}`);
    }
    
    console.log('🎉 ¡Elementos visuales básicos creados exitosamente!');
    console.log('📁 Ubicación: assets/visual-elements/');
    
  } catch (error) {
    console.error('❌ Error creando elementos visuales:', error);
  }
}

// Crear SVG para fondo de autosuficiencia
function createAutosuficienciaSVG() {
  return `<svg width="1200" height="1600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="autosuficienciaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#8B4513;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#228B22;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="1200" height="1600" fill="url(#autosuficienciaGrad)"/>
    <text x="600" y="800" font-family="Arial" font-size="48" fill="white" text-anchor="middle">🌱 Autosuficiencia</text>
  </svg>`;
}

// Crear SVG para fondo de libertad financiera
function createLibertadFinancieraSVG() {
  return `<svg width="1200" height="1600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="libertadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1E3A8A;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#7C3AED;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#059669;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="1200" height="1600" fill="url(#libertadGrad)"/>
    <text x="600" y="800" font-family="Arial" font-size="48" fill="white" text-anchor="middle">💰 Libertad Financiera</text>
  </svg>`;
}

// Crear SVG para fondo de crecimiento personal
function createCrecimientoPersonalSVG() {
  return `<svg width="1200" height="1600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="crecimientoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#F59E0B;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#EA580C;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#FFFFFF;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="1200" height="1600" fill="url(#crecimientoGrad)"/>
    <text x="600" y="800" font-family="Arial" font-size="48" fill="white" text-anchor="middle">🚀 Crecimiento Personal</text>
  </svg>`;
}

// Crear SVG para fondo de vida espiritual
function createVidaEspiritualSVG() {
  return `<svg width="1200" height="1600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="espiritualGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#1E40AF;stop-opacity:1" />
        <stop offset="50%" style="stop-color:#FFFFFF;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#FCD34D;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="1200" height="1600" fill="url(#espiritualGrad)"/>
    <text x="600" y="800" font-family="Arial" font-size="48" fill="white" text-anchor="middle">✨ Vida Espiritual</text>
  </svg>`;
}

// Crear SVG para ilustración de apicultura
function createApiculturaSVG() {
  return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="600" fill="#FFD700"/>
    <rect x="300" y="200" width="200" height="300" fill="#8B4513"/>
    <text x="400" y="100" font-family="Arial" font-size="72" text-anchor="middle">🐝</text>
    <text x="400" y="550" font-family="Arial" font-size="24" fill="#8B4513" text-anchor="middle">Apicultura Urbana</text>
  </svg>`;
}

// Crear SVG para icono de abeja
function createBeeSVG() {
  return `<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
    <circle cx="64" cy="64" r="60" fill="#FFD700" stroke="#8B4513" stroke-width="4"/>
    <text x="64" y="80" font-family="Arial" font-size="48" text-anchor="middle">🐝</text>
  </svg>`;
}

// Crear SVG para icono de calculadora
function createCalculatorSVG() {
  return `<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
    <rect x="20" y="20" width="88" height="88" fill="#E5E7EB" stroke="#1F2937" stroke-width="2"/>
    <rect x="30" y="30" width="68" height="20" fill="#1F2937"/>
    <text x="64" y="45" font-family="Arial" font-size="12" fill="white" text-anchor="middle">123</text>
    <text x="64" y="100" font-family="Arial" font-size="24" text-anchor="middle">🧮</text>
  </svg>`;
}

// Crear SVG para patrón de panal
function createHoneycombSVG() {
  return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="honeycomb" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
        <polygon points="30,2 50,15 50,37 30,50 10,37 10,15" fill="none" stroke="#FFD700" stroke-width="2"/>
      </pattern>
    </defs>
    <rect width="400" height="400" fill="url(#honeycomb)"/>
    <text x="200" y="200" font-family="Arial" font-size="48" fill="#FFD700" text-anchor="middle">🍯</text>
  </svg>`;
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createBasicVisualElements();
}

export { createBasicVisualElements };




