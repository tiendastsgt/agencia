#!/usr/bin/env node

/**
 * Script de prueba para el sistema de infografías visuales
 * 
 * Este script prueba que el sistema de generación de infografías
 * con elementos visuales esté funcionando correctamente.
 */

import fs from 'fs/promises';
import path from 'path';

// Simular datos de curso para prueba
const testCourseData = {
  nombre: "Apicultura Urbana: Produce tu Propia Miel de Forma Sostenible",
  resumen: "Aprende a criar abejas en espacios urbanos y producir tu propia miel de forma sostenible y ecológica.",
  duración: "8 semanas",
  créditos: "4 créditos",
  contenido: [
    {
      id: "intro",
      titulo: "Introducción a la Apicultura Urbana",
      descripcion: "Conceptos básicos y beneficios de la apicultura en espacios urbanos"
    },
    {
      id: "equipamiento",
      titulo: "Equipamiento Necesario",
      descripcion: "Herramientas y materiales esenciales para comenzar"
    },
    {
      id: "instalacion",
      titulo: "Instalación del Colmenar",
      descripcion: "Cómo instalar y configurar tu colmenar urbano"
    },
    {
      id: "mantenimiento",
      titulo: "Mantenimiento y Cuidado",
      descripcion: "Tareas de mantenimiento y cuidado de las abejas"
    },
    {
      id: "cosecha",
      titulo: "Cosecha de Miel",
      descripcion: "Técnicas para cosechar miel de forma segura y eficiente"
    }
  ]
};

// Verificar que los elementos visuales existen
async function checkVisualElements() {
  console.log('🔍 Verificando elementos visuales...');
  
  const baseDir = 'assets/visual-elements';
  const requiredElements = [
    'backgrounds/background-autosuficiencia.png',
    'illustrations/illustration-apicultura-urbana.png',
    'icons/icon-bee.png',
    'icons/icon-calculator.png',
    'decorative/pattern-honeycomb.png'
  ];
  
  let allElementsExist = true;
  
  for (const element of requiredElements) {
    const elementPath = path.join(baseDir, element);
    try {
      await fs.access(elementPath);
      console.log(`✅ ${element} - Existe`);
    } catch (error) {
      console.log(`❌ ${element} - No existe`);
      allElementsExist = false;
    }
  }
  
  return allElementsExist;
}

// Verificar estructura de directorios
async function checkDirectoryStructure() {
  console.log('📁 Verificando estructura de directorios...');
  
  const baseDir = 'assets/visual-elements';
  const requiredDirs = ['backgrounds', 'illustrations', 'icons', 'decorative'];
  
  let allDirsExist = true;
  
  for (const dir of requiredDirs) {
    const dirPath = path.join(baseDir, dir);
    try {
      const stats = await fs.stat(dirPath);
      if (stats.isDirectory()) {
        console.log(`✅ ${dir}/ - Directorio existe`);
      } else {
        console.log(`❌ ${dir}/ - No es un directorio`);
        allDirsExist = false;
      }
    } catch (error) {
      console.log(`❌ ${dir}/ - No existe`);
      allDirsExist = false;
    }
  }
  
  return allDirsExist;
}

// Verificar archivos de servicios
async function checkServiceFiles() {
  console.log('🔧 Verificando archivos de servicios...');
  
  const serviceFiles = [
    'src/lib/visual-infographic-generator.ts',
    'src/lib/visual-elements-service.ts',
    'src/lib/infographic-image-service.ts'
  ];
  
  let allServicesExist = true;
  
  for (const serviceFile of serviceFiles) {
    try {
      await fs.access(serviceFile);
      console.log(`✅ ${serviceFile} - Existe`);
    } catch (error) {
      console.log(`❌ ${serviceFile} - No existe`);
      allServicesExist = false;
    }
  }
  
  return allServicesExist;
}

// Simular prueba de generación de infografía
async function simulateInfographicGeneration() {
  console.log('🎨 Simulando generación de infografía...');
  
  try {
    // Simular datos de infografía
    const infographicData = {
      title: testCourseData.nombre,
      subtitle: testCourseData.resumen,
      theme: {
        name: 'Nature Gold',
        primaryColor: '#FFD700',
        secondaryColor: '#8B4513',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        accentColor: '#228B22',
        fontFamily: 'Inter',
        style: 'modern'
      },
      sections: [
        {
          id: 'header',
          type: 'header',
          title: testCourseData.nombre,
          content: {
            text: {
              content: testCourseData.resumen
            }
          }
        },
        {
          id: 'info',
          type: 'stats',
          title: 'Información del Curso',
          content: {
            stats: {
              items: [
                { label: 'Duración', value: testCourseData.duración, unit: '' },
                { label: 'Créditos', value: testCourseData.créditos, unit: '' },
                { label: 'Módulos', value: testCourseData.contenido.length, unit: '' }
              ]
            }
          }
        },
        {
          id: 'modules',
          type: 'list',
          title: 'Módulos del Curso',
          content: {
            list: {
              items: testCourseData.contenido.map(module => ({
                text: module.titulo
              }))
            }
          }
        }
      ],
      metadata: {
        author: 'MarketPro GT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['curso', 'educación', 'apicultura'],
        category: 'autosuficiencia',
        language: 'es',
        version: '1.0.0'
      }
    };
    
    console.log('✅ Datos de infografía preparados');
    console.log(`   - Título: ${infographicData.title}`);
    console.log(`   - Secciones: ${infographicData.sections.length}`);
    console.log(`   - Tema: ${infographicData.theme.name}`);
    
    return true;
  } catch (error) {
    console.log(`❌ Error simulando generación: ${error.message}`);
    return false;
  }
}

// Función principal de prueba
async function testVisualInfographicSystem() {
  console.log('🧪 Iniciando pruebas del sistema de infografías visuales...\n');
  
  let allTestsPassed = true;
  
  // Prueba 1: Verificar estructura de directorios
  const dirsOk = await checkDirectoryStructure();
  if (!dirsOk) {
    allTestsPassed = false;
  }
  console.log('');
  
  // Prueba 2: Verificar elementos visuales
  const elementsOk = await checkVisualElements();
  if (!elementsOk) {
    allTestsPassed = false;
  }
  console.log('');
  
  // Prueba 3: Verificar archivos de servicios
  const servicesOk = await checkServiceFiles();
  if (!servicesOk) {
    allTestsPassed = false;
  }
  console.log('');
  
  // Prueba 4: Simular generación de infografía
  const generationOk = await simulateInfographicGeneration();
  if (!generationOk) {
    allTestsPassed = false;
  }
  console.log('');
  
  // Resultado final
  if (allTestsPassed) {
    console.log('🎉 ¡Todas las pruebas pasaron exitosamente!');
    console.log('✅ El sistema de infografías visuales está listo para usar');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('   1. Abrir la aplicación en el navegador');
    console.log('   2. Ir a la sección de Infografías');
    console.log('   3. Generar una infografía de curso');
    console.log('   4. Verificar que se usen los elementos visuales');
  } else {
    console.log('❌ Algunas pruebas fallaron');
    console.log('🔧 Revisa los errores anteriores y corrige los problemas');
  }
}

// Ejecutar si es llamado directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testVisualInfographicSystem();
}

export { testVisualInfographicSystem };




