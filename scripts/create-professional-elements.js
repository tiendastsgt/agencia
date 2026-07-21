#!/usr/bin/env node

/**
 * Script para crear elementos visuales profesionales
 * 
 * Este script crea elementos visuales de alta calidad
 * para las infografías del sistema.
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

// Crear fondo profesional para autosuficiencia
function createProfessionalAutosuficienciaBackground() {
  return `<svg width="1200" height="1600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="autosuficienciaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
        <stop offset="30%" style="stop-color:#FFA500;stop-opacity:1" />
        <stop offset="70%" style="stop-color:#8B4513;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#228B22;stop-opacity:1" />
      </linearGradient>
      <pattern id="honeycombPattern" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
        <polygon points="30,2 50,15 50,37 30,50 10,37 10,15" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      </pattern>
      <filter id="glow">
        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
        <feMerge> 
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <rect width="1200" height="1600" fill="url(#autosuficienciaGrad)"/>
    <rect width="1200" height="1600" fill="url(#honeycombPattern)"/>
    
    <!-- Elementos decorativos -->
    <circle cx="100" cy="200" r="80" fill="rgba(255,255,255,0.1)" filter="url(#glow)"/>
    <circle cx="1100" cy="1400" r="120" fill="rgba(255,255,255,0.05)" filter="url(#glow)"/>
    <circle cx="600" cy="800" r="200" fill="rgba(255,255,255,0.03)" filter="url(#glow)"/>
    
    <!-- Líneas decorativas -->
    <path d="M0,400 Q600,300 1200,400" stroke="rgba(255,255,255,0.1)" stroke-width="2" fill="none"/>
    <path d="M0,1200 Q600,1100 1200,1200" stroke="rgba(255,255,255,0.1)" stroke-width="2" fill="none"/>
  </svg>`;
}

// Crear ilustración profesional de apicultura
function createProfessionalApiculturaIllustration() {
  return `<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="hiveGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#8B4513;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#654321;stop-opacity:1" />
      </linearGradient>
      <linearGradient id="beeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#FFA500;stop-opacity:1" />
      </linearGradient>
      <filter id="shadow">
        <feDropShadow dx="2" dy="2" stdDeviation="3" flood-opacity="0.3"/>
      </filter>
    </defs>
    
    <!-- Fondo -->
    <rect width="800" height="600" fill="#87CEEB"/>
    
    <!-- Colmena principal -->
    <rect x="300" y="200" width="200" height="300" fill="url(#hiveGrad)" filter="url(#shadow)"/>
    <rect x="320" y="180" width="160" height="40" fill="url(#hiveGrad)" filter="url(#shadow)"/>
    <rect x="340" y="160" width="120" height="40" fill="url(#hiveGrad)" filter="url(#shadow)"/>
    
    <!-- Entrada de la colmena -->
    <rect x="380" y="480" width="40" height="20" fill="#654321"/>
    
    <!-- Abejas volando -->
    <g transform="translate(100,100)">
      <circle cx="0" cy="0" r="8" fill="url(#beeGrad)"/>
      <rect x="-6" y="-3" width="12" height="6" fill="#8B4513"/>
      <path d="M-8,-8 Q0,-12 8,-8" stroke="#87CEEB" stroke-width="2" fill="none"/>
      <path d="M-8,8 Q0,12 8,8" stroke="#87CEEB" stroke-width="2" fill="none"/>
    </g>
    
    <g transform="translate(600,150)">
      <circle cx="0" cy="0" r="8" fill="url(#beeGrad)"/>
      <rect x="-6" y="-3" width="12" height="6" fill="#8B4513"/>
      <path d="M-8,-8 Q0,-12 8,-8" stroke="#87CEEB" stroke-width="2" fill="none"/>
      <path d="M-8,8 Q0,12 8,8" stroke="#87CEEB" stroke-width="2" fill="none"/>
    </g>
    
    <g transform="translate(200,300)">
      <circle cx="0" cy="0" r="8" fill="url(#beeGrad)"/>
      <rect x="-6" y="-3" width="12" height="6" fill="#8B4513"/>
      <path d="M-8,-8 Q0,-12 8,-8" stroke="#87CEEB" stroke-width="2" fill="none"/>
      <path d="M-8,8 Q0,12 8,8" stroke="#87CEEB" stroke-width="2" fill="none"/>
    </g>
    
    <!-- Flores -->
    <g transform="translate(150,450)">
      <circle cx="0" cy="0" r="15" fill="#FF69B4"/>
      <circle cx="-8" cy="-8" r="8" fill="#FFB6C1"/>
      <circle cx="8" cy="-8" r="8" fill="#FFB6C1"/>
      <circle cx="-8" cy="8" r="8" fill="#FFB6C1"/>
      <circle cx="8" cy="8" r="8" fill="#FFB6C1"/>
    </g>
    
    <g transform="translate(650,400)">
      <circle cx="0" cy="0" r="15" fill="#FF69B4"/>
      <circle cx="-8" cy="-8" r="8" fill="#FFB6C1"/>
      <circle cx="8" cy="-8" r="8" fill="#FFB6C1"/>
      <circle cx="-8" cy="8" r="8" fill="#FFB6C1"/>
      <circle cx="8" cy="8" r="8" fill="#FFB6C1"/>
    </g>
    
    <!-- Texto -->
    <text x="400" y="80" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="#8B4513" text-anchor="middle">🐝 Apicultura Urbana</text>
    <text x="400" y="550" font-family="Arial, sans-serif" font-size="18" fill="#654321" text-anchor="middle">Produce tu propia miel de forma sostenible</text>
  </svg>`;
}

// Crear icono profesional de abeja
function createProfessionalBeeIcon() {
  return `<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="beeBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#FFA500;stop-opacity:1" />
      </linearGradient>
      <filter id="beeShadow">
        <feDropShadow dx="1" dy="1" stdDeviation="2" flood-opacity="0.3"/>
      </filter>
    </defs>
    
    <!-- Cuerpo de la abeja -->
    <ellipse cx="64" cy="70" rx="25" ry="15" fill="url(#beeBodyGrad)" filter="url(#beeShadow)"/>
    
    <!-- Rayas -->
    <rect x="44" y="60" width="40" height="3" fill="#8B4513"/>
    <rect x="44" y="67" width="40" height="3" fill="#8B4513"/>
    <rect x="44" y="74" width="40" height="3" fill="#8B4513"/>
    
    <!-- Cabeza -->
    <circle cx="64" cy="45" r="12" fill="url(#beeBodyGrad)" filter="url(#beeShadow)"/>
    
    <!-- Ojos -->
    <circle cx="60" cy="42" r="3" fill="#000000"/>
    <circle cx="68" cy="42" r="3" fill="#000000"/>
    <circle cx="60" cy="41" r="1" fill="#FFFFFF"/>
    <circle cx="68" cy="41" r="1" fill="#FFFFFF"/>
    
    <!-- Antenas -->
    <line x1="58" y1="35" x2="55" y2="30" stroke="#8B4513" stroke-width="2"/>
    <line x1="70" y1="35" x2="73" y2="30" stroke="#8B4513" stroke-width="2"/>
    <circle cx="55" cy="30" r="2" fill="#8B4513"/>
    <circle cx="73" cy="30" r="2" fill="#8B4513"/>
    
    <!-- Alas -->
    <ellipse cx="50" cy="35" rx="8" ry="12" fill="rgba(255,255,255,0.8)" stroke="#E0E0E0" stroke-width="1"/>
    <ellipse cx="78" cy="35" rx="8" ry="12" fill="rgba(255,255,255,0.8)" stroke="#E0E0E0" stroke-width="1"/>
    
    <!-- Patas -->
    <line x1="50" y1="80" x2="45" y2="90" stroke="#8B4513" stroke-width="2"/>
    <line x1="78" y1="80" x2="83" y2="90" stroke="#8B4513" stroke-width="2"/>
    <line x1="55" y1="85" x2="50" y2="95" stroke="#8B4513" stroke-width="2"/>
    <line x1="73" y1="85" x2="78" y2="95" stroke="#8B4513" stroke-width="2"/>
  </svg>`;
}

// Crear patrón de panal profesional
function createProfessionalHoneycombPattern() {
  return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="honeyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FFD700;stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#FFA500;stop-opacity:0.6" />
      </linearGradient>
      <pattern id="honeycombPattern" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
        <polygon points="30,2 50,15 50,37 30,50 10,37 10,15" fill="url(#honeyGrad)" stroke="#FFD700" stroke-width="2"/>
      </pattern>
    </defs>
    <rect width="400" height="400" fill="url(#honeycombPattern)"/>
    
    <!-- Elementos decorativos -->
    <circle cx="200" cy="200" r="50" fill="rgba(255,255,255,0.1)"/>
    <text x="200" y="210" font-family="Arial, sans-serif" font-size="48" text-anchor="middle">🍯</text>
  </svg>`;
}

// Función principal
async function createProfessionalElements() {
  console.log('🎨 Creando elementos visuales profesionales...');
  
  try {
    // Crear directorios
    await ensureDirectories();
    
    // Crear fondos profesionales
    console.log('📐 Creando fondos profesionales...');
    const backgrounds = {
      'background-autosuficiencia.png': createProfessionalAutosuficienciaBackground()
    };
    
    for (const [filename, svgContent] of Object.entries(backgrounds)) {
      await fs.writeFile(`assets/visual-elements/backgrounds/${filename}`, svgContent);
      console.log(`✅ Fondo profesional creado: ${filename}`);
    }
    
    // Crear ilustraciones profesionales
    console.log('🖼️ Creando ilustraciones profesionales...');
    const illustrations = {
      'illustration-apicultura-urbana.png': createProfessionalApiculturaIllustration()
    };
    
    for (const [filename, svgContent] of Object.entries(illustrations)) {
      await fs.writeFile(`assets/visual-elements/illustrations/${filename}`, svgContent);
      console.log(`✅ Ilustración profesional creada: ${filename}`);
    }
    
    // Crear iconos profesionales
    console.log('🔧 Creando iconos profesionales...');
    const icons = {
      'icon-bee.png': createProfessionalBeeIcon()
    };
    
    for (const [filename, svgContent] of Object.entries(icons)) {
      await fs.writeFile(`assets/visual-elements/icons/${filename}`, svgContent);
      console.log(`✅ Icono profesional creado: ${filename}`);
    }
    
    // Crear elementos decorativos profesionales
    console.log('✨ Creando elementos decorativos profesionales...');
    const decorative = {
      'pattern-honeycomb.png': createProfessionalHoneycombPattern()
    };
    
    for (const [filename, svgContent] of Object.entries(decorative)) {
      await fs.writeFile(`assets/visual-elements/decorative/${filename}`, svgContent);
      console.log(`✅ Elemento decorativo profesional creado: ${filename}`);
    }
    
    console.log('🎉 ¡Elementos visuales profesionales creados exitosamente!');
    console.log('📁 Ubicación: assets/visual-elements/');
    
  } catch (error) {
    console.error('❌ Error creando elementos profesionales:', error);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  createProfessionalElements();
}

export { createProfessionalElements };




