#!/usr/bin/env node

/**
 * Script para generar elementos visuales para infografías
 * 
 * Este script genera elementos visuales usando Canvas y los guarda
 * en la carpeta assets/visual-elements para ser usados por el sistema
 * de infografías.
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

// Generar fondo para autosuficiencia
function generateAutosuficienciaBackground() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 1200;
  canvas.height = 1600;
  
  // Gradiente dorado-verde
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#FFD700'); // Dorado
  gradient.addColorStop(0.5, '#8B4513'); // Marrón
  gradient.addColorStop(1, '#228B22'); // Verde
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Patrón de hexágonos (panal)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  
  const hexSize = 40;
  for (let x = 0; x < canvas.width + hexSize; x += hexSize * 1.5) {
    for (let y = 0; y < canvas.height + hexSize; y += hexSize * Math.sqrt(3)) {
      drawHexagon(ctx, x, y, hexSize);
    }
  }
  
  return canvas.toDataURL('image/png');
}

// Generar fondo para libertad financiera
function generateLibertadFinancieraBackground() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 1200;
  canvas.height = 1600;
  
  // Gradiente azul-púrpura
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#1E3A8A'); // Azul oscuro
  gradient.addColorStop(0.5, '#7C3AED'); // Púrpura
  gradient.addColorStop(1, '#059669'); // Verde esmeralda
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Patrón de circuitos
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 2;
  
  for (let i = 0; i < 20; i++) {
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }
  
  return canvas.toDataURL('image/png');
}

// Generar fondo para crecimiento personal
function generateCrecimientoPersonalBackground() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 1200;
  canvas.height = 1600;
  
  // Gradiente cálido
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#F59E0B'); // Ámbar
  gradient.addColorStop(0.5, '#EA580C'); // Naranja
  gradient.addColorStop(1, '#FFFFFF'); // Blanco
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Patrón de círculos
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = Math.random() * 30 + 10;
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  return canvas.toDataURL('image/png');
}

// Generar fondo para vida espiritual
function generateVidaEspiritualBackground() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 1200;
  canvas.height = 1600;
  
  // Gradiente celestial
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#1E40AF'); // Azul oscuro
  gradient.addColorStop(0.5, '#FFFFFF'); // Blanco
  gradient.addColorStop(1, '#FCD34D'); // Dorado claro
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Patrón de estrellas
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  for (let i = 0; i < 100; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 4 + 1;
    
    drawStar(ctx, x, y, size);
  }
  
  return canvas.toDataURL('image/png');
}

// Generar ilustración de apicultura
function generateApiculturaIllustration() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 800;
  canvas.height = 600;
  
  // Fondo
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Dibujar colmena
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(300, 200, 200, 300);
  
  // Dibujar abejas
  ctx.fillStyle = '#FFD700';
  for (let i = 0; i < 5; i++) {
    const x = 100 + i * 120;
    const y = 100 + Math.sin(i) * 50;
    drawBee(ctx, x, y);
  }
  
  // Texto
  ctx.fillStyle = '#8B4513';
  ctx.font = 'bold 48px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('🐝', canvas.width / 2, 100);
  
  return canvas.toDataURL('image/png');
}

// Generar icono de abeja
function generateBeeIcon() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 128;
  canvas.height = 128;
  
  // Fondo transparente
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Cuerpo de la abeja
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(40, 50, 48, 28);
  
  // Rayas
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(40, 50, 48, 4);
  ctx.fillRect(40, 58, 48, 4);
  ctx.fillRect(40, 66, 48, 4);
  
  // Cabeza
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(64, 40, 15, 0, 2 * Math.PI);
  ctx.fill();
  
  // Ojos
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(60, 35, 3, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(68, 35, 3, 0, 2 * Math.PI);
  ctx.fill();
  
  // Alas
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(50, 30, 12, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(78, 30, 12, 0, 2 * Math.PI);
  ctx.fill();
  
  return canvas.toDataURL('image/png');
}

// Generar icono de calculadora
function generateCalculatorIcon() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 128;
  canvas.height = 128;
  
  // Fondo transparente
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Cuerpo de la calculadora
  ctx.fillStyle = '#E5E7EB';
  ctx.fillRect(20, 20, 88, 88);
  
  // Pantalla
  ctx.fillStyle = '#1F2937';
  ctx.fillRect(30, 30, 68, 20);
  
  // Botones
  ctx.fillStyle = '#F3F4F6';
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 4; col++) {
      const x = 30 + col * 16;
      const y = 60 + row * 16;
      ctx.fillRect(x, y, 14, 14);
    }
  }
  
  return canvas.toDataURL('image/png');
}

// Generar patrón de panal
function generateHoneycombPattern() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  canvas.width = 400;
  canvas.height = 400;
  
  // Fondo transparente
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Patrón de hexágonos
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth = 3;
  ctx.fillStyle = 'rgba(255, 215, 0, 0.1)';
  
  const hexSize = 30;
  for (let x = 0; x < canvas.width + hexSize; x += hexSize * 1.5) {
    for (let y = 0; y < canvas.height + hexSize; y += hexSize * Math.sqrt(3)) {
      drawHexagon(ctx, x, y, hexSize);
    }
  }
  
  return canvas.toDataURL('image/png');
}

// Función auxiliar para dibujar hexágono
function drawHexagon(ctx, x, y, size) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3;
    const hx = x + size * Math.cos(angle);
    const hy = y + size * Math.sin(angle);
    if (i === 0) {
      ctx.moveTo(hx, hy);
    } else {
      ctx.lineTo(hx, hy);
    }
  }
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}

// Función auxiliar para dibujar abeja
function drawBee(ctx, x, y) {
  // Cuerpo
  ctx.fillStyle = '#FFD700';
  ctx.fillRect(x - 10, y - 5, 20, 10);
  
  // Rayas
  ctx.fillStyle = '#8B4513';
  ctx.fillRect(x - 10, y - 5, 20, 2);
  ctx.fillRect(x - 10, y + 1, 20, 2);
  ctx.fillRect(x - 10, y + 7, 20, 2);
  
  // Cabeza
  ctx.fillStyle = '#FFD700';
  ctx.beginPath();
  ctx.arc(x, y - 8, 6, 0, 2 * Math.PI);
  ctx.fill();
  
  // Alas
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(x - 8, y - 12, 8, 0, 2 * Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(x + 8, y - 12, 8, 0, 2 * Math.PI);
  ctx.fill();
}

// Función auxiliar para dibujar estrella
function drawStar(ctx, x, y, size) {
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const angle = (i * 4 * Math.PI) / 5;
    const radius = i % 2 === 0 ? size : size / 2;
    const hx = x + radius * Math.cos(angle - Math.PI / 2);
    const hy = y + radius * Math.sin(angle - Math.PI / 2);
    if (i === 0) {
      ctx.moveTo(hx, hy);
    } else {
      ctx.lineTo(hx, hy);
    }
  }
  ctx.closePath();
  ctx.fill();
}

// Función principal
async function generateVisualElements() {
  console.log('🎨 Iniciando generación de elementos visuales...');
  
  try {
    // Crear directorios
    await ensureDirectories();
    
    // Generar fondos
    console.log('📐 Generando fondos...');
    
    const backgrounds = {
      'background-autosuficiencia.png': generateAutosuficienciaBackground(),
      'background-libertad-financiera.png': generateLibertadFinancieraBackground(),
      'background-crecimiento-personal.png': generateCrecimientoPersonalBackground(),
      'background-vida-espiritual.png': generateVidaEspiritualBackground()
    };
    
    for (const [filename, dataUrl] of Object.entries(backgrounds)) {
      const base64 = dataUrl.split(',')[1];
      const buffer = Buffer.from(base64, 'base64');
      await fs.writeFile(`assets/visual-elements/backgrounds/${filename}`, buffer);
      console.log(`✅ Fondo generado: ${filename}`);
    }
    
    // Generar ilustraciones
    console.log('🖼️ Generando ilustraciones...');
    
    const illustrations = {
      'illustration-apicultura-urbana.png': generateApiculturaIllustration()
    };
    
    for (const [filename, dataUrl] of Object.entries(illustrations)) {
      const base64 = dataUrl.split(',')[1];
      const buffer = Buffer.from(base64, 'base64');
      await fs.writeFile(`assets/visual-elements/illustrations/${filename}`, buffer);
      console.log(`✅ Ilustración generada: ${filename}`);
    }
    
    // Generar iconos
    console.log('🔧 Generando iconos...');
    
    const icons = {
      'icon-bee.png': generateBeeIcon(),
      'icon-calculator.png': generateCalculatorIcon()
    };
    
    for (const [filename, dataUrl] of Object.entries(icons)) {
      const base64 = dataUrl.split(',')[1];
      const buffer = Buffer.from(base64, 'base64');
      await fs.writeFile(`assets/visual-elements/icons/${filename}`, buffer);
      console.log(`✅ Icono generado: ${filename}`);
    }
    
    // Generar elementos decorativos
    console.log('✨ Generando elementos decorativos...');
    
    const decorative = {
      'pattern-honeycomb.png': generateHoneycombPattern()
    };
    
    for (const [filename, dataUrl] of Object.entries(decorative)) {
      const base64 = dataUrl.split(',')[1];
      const buffer = Buffer.from(base64, 'base64');
      await fs.writeFile(`assets/visual-elements/decorative/${filename}`, buffer);
      console.log(`✅ Elemento decorativo generado: ${filename}`);
    }
    
    console.log('🎉 ¡Elementos visuales generados exitosamente!');
    console.log('📁 Ubicación: assets/visual-elements/');
    
  } catch (error) {
    console.error('❌ Error generando elementos visuales:', error);
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  generateVisualElements();
}

export { generateVisualElements };
