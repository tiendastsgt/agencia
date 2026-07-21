/**
 * Servicio de Elementos Visuales para Infografías
 * 
 * Este servicio maneja la integración de elementos visuales generados
 * con el sistema de infografías, proporcionando composición automática
 * y gestión de elementos visuales.
 */

import { logger } from './logger';
import { AppError, ErrorCode } from './errors';

// Interfaces para elementos visuales
export interface VisualElement {
  id: string;
  filename: string;
  category: 'backgrounds' | 'illustrations' | 'icons' | 'decorative';
  type: 'gradient' | 'illustration' | 'icon' | 'pattern';
  path: string;
  url: string;
  metadata: {
    colors?: string[];
    size?: { width: number; height: number };
    theme?: string;
    description?: string;
  };
}

export interface InfographicComposition {
  background: VisualElement;
  mainIllustration: VisualElement;
  icons: VisualElement[];
  decorativeElements: VisualElement[];
  layout: {
    width: number;
    height: number;
    sections: CompositionSection[];
  };
}

export interface CompositionSection {
  id: string;
  type: 'header' | 'content' | 'footer';
  position: { x: number; y: number; width: number; height: number };
  elements: VisualElement[];
  text?: {
    content: string;
    style: {
      fontSize: number;
      fontFamily: string;
      color: string;
      fontWeight: string;
    };
  };
}

export interface CourseVisualMapping {
  courseId: string;
  courseName: string;
  category: string;
  theme: string;
  elements: {
    background: string;
    illustration: string;
    icons: string[];
    decorative: string[];
  };
}

class VisualElementsService {
  private static instance: VisualElementsService;
  private elementsCache: Map<string, VisualElement> = new Map();
  private courseMappings: Map<string, CourseVisualMapping> = new Map();

  private constructor() {
    this.initializeCourseMappings();
  }

  public static getInstance(): VisualElementsService {
    if (!VisualElementsService.instance) {
      VisualElementsService.instance = new VisualElementsService();
    }
    return VisualElementsService.instance;
  }

  /**
   * Inicializa los mapeos de cursos con elementos visuales
   */
  private initializeCourseMappings(): void {
    const mappings: CourseVisualMapping[] = [
      {
        courseId: 'apicultura-urbana',
        courseName: 'Apicultura Urbana: Produce tu Propia Miel de Forma Sostenible',
        category: 'autosuficiencia',
        theme: 'nature-golden',
        elements: {
          background: 'background-autosuficiencia.png',
          illustration: 'illustration-apicultura-urbana.png',
          icons: ['icon-bee.png', 'icon-beehive.png'],
          decorative: ['pattern-honeycomb.png']
        }
      },
      {
        courseId: 'cocina-chapina',
        courseName: 'Cocina Chapina Inteligente: Sabor, Nutrición y Economía',
        category: 'autosuficiencia',
        theme: 'warm-culinary',
        elements: {
          background: 'background-autosuficiencia.png',
          illustration: 'illustration-cocina-chapina.png',
          icons: ['icon-calculator.png'],
          decorative: ['pattern-geometric.png']
        }
      },
      {
        courseId: 'matematica-practica',
        courseName: 'Matemática Práctica: Resuelve Problemas Reales del Día a Día',
        category: 'autosuficiencia',
        theme: 'professional-blue',
        elements: {
          background: 'background-autosuficiencia.png',
          illustration: 'illustration-matematica-practica.png',
          icons: ['icon-calculator.png'],
          decorative: ['pattern-geometric.png']
        }
      },
      {
        courseId: 'ia-practica',
        courseName: 'IA Práctica: Herramientas Inteligentes para Facilitar tu Vida',
        category: 'libertad-financiera',
        theme: 'tech-purple',
        elements: {
          background: 'background-libertad-financiera.png',
          illustration: 'illustration-ia-practica.png',
          icons: ['icon-robot.png'],
          decorative: ['pattern-geometric.png']
        }
      },
      {
        courseId: 'liderazgo-servicial',
        courseName: 'Liderazgo Servicial: Lidera desde el Corazón',
        category: 'crecimiento-personal',
        theme: 'warm-inspirational',
        elements: {
          background: 'background-crecimiento-personal.png',
          illustration: 'illustration-apicultura-urbana.png', // Usar como placeholder
          icons: ['icon-bee.png'], // Usar como placeholder
          decorative: ['pattern-honeycomb.png']
        }
      },
      {
        courseId: 'liturgia-viva',
        courseName: 'Liturgia Viva: Enriquece tu Experiencia de Fe',
        category: 'vida-espiritual',
        theme: 'celestial-blue',
        elements: {
          background: 'background-vida-espiritual.png',
          illustration: 'illustration-apicultura-urbana.png', // Usar como placeholder
          icons: ['icon-bee.png'], // Usar como placeholder
          decorative: ['pattern-honeycomb.png']
        }
      },
      {
        courseId: 'economia-comunion',
        courseName: 'Economía de Comunión: Trabajo como Vocación',
        category: 'vida-espiritual',
        theme: 'solidarity-green',
        elements: {
          background: 'background-vida-espiritual.png',
          illustration: 'illustration-apicultura-urbana.png', // Usar como placeholder
          icons: ['icon-bee.png'], // Usar como placeholder
          decorative: ['pattern-honeycomb.png']
        }
      }
    ];

    mappings.forEach(mapping => {
      this.courseMappings.set(mapping.courseId, mapping);
    });

    logger.info('🎨 Mapeos de cursos inicializados', { count: mappings.length });
  }

  /**
   * Obtiene un elemento visual por su nombre de archivo
   */
  public async getVisualElement(filename: string, category: string): Promise<VisualElement | null> {
    try {
      const cacheKey = `${category}/${filename}`;
      
      if (this.elementsCache.has(cacheKey)) {
        return this.elementsCache.get(cacheKey)!;
      }

      // Construir la URL del elemento
      const baseUrl = '/assets/visual-elements';
      const elementPath = `${baseUrl}/${category}/${filename}`;
      
      const element: VisualElement = {
        id: `element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        filename,
        category: category as any,
        type: this.getElementType(filename, category),
        path: elementPath,
        url: elementPath,
        metadata: this.getElementMetadata(filename, category)
      };

      this.elementsCache.set(cacheKey, element);
      return element;

    } catch (error) {
      logger.error('Error obteniendo elemento visual:', error);
      return null;
    }
  }

  /**
   * Obtiene el mapeo visual para un curso específico
   */
  public getCourseVisualMapping(courseId: string): CourseVisualMapping | null {
    return this.courseMappings.get(courseId) || null;
  }

  /**
   * Crea una composición de infografía para un curso
   */
  public async createInfographicComposition(courseData: any): Promise<InfographicComposition> {
    try {
      const courseId = this.extractCourseId(courseData.nombre);
      const mapping = this.getCourseVisualMapping(courseId);
      
      if (!mapping) {
        throw new AppError(ErrorCode.NOT_FOUND, `No se encontró mapeo visual para el curso: ${courseId}`);
      }

      logger.info('🎨 Creando composición de infografía', { courseId, courseName: courseData.nombre });

      // Obtener elementos visuales
      const background = await this.getVisualElement(mapping.elements.background, 'backgrounds');
      const mainIllustration = await this.getVisualElement(mapping.elements.illustration, 'illustrations');
      
      const icons: VisualElement[] = [];
      for (const iconFilename of mapping.elements.icons) {
        const icon = await this.getVisualElement(iconFilename, 'icons');
        if (icon) icons.push(icon);
      }

      const decorativeElements: VisualElement[] = [];
      for (const decorativeFilename of mapping.elements.decorative) {
        const decorative = await this.getVisualElement(decorativeFilename, 'decorative');
        if (decorative) decorativeElements.push(decorative);
      }

      if (!background || !mainIllustration) {
        throw new AppError(ErrorCode.NOT_FOUND, 'No se pudieron cargar los elementos visuales principales');
      }

      // Crear composición
      const composition: InfographicComposition = {
        background,
        mainIllustration,
        icons,
        decorativeElements,
        layout: {
          width: 1200,
          height: 1600,
          sections: this.createLayoutSections(courseData, mapping)
        }
      };

      logger.info('✅ Composición de infografía creada exitosamente', { 
        courseId, 
        elementsCount: {
          icons: icons.length,
          decorative: decorativeElements.length
        }
      });

      return composition;

    } catch (error) {
      logger.error('Error creando composición de infografía:', error);
      throw error;
    }
  }

  /**
   * Extrae el ID del curso desde el nombre
   */
  private extractCourseId(courseName: string): string {
    const name = courseName.toLowerCase();
    
    if (name.includes('apicultura')) return 'apicultura-urbana';
    if (name.includes('cocina') && name.includes('chapina')) return 'cocina-chapina';
    if (name.includes('matemática') || name.includes('matematica')) return 'matematica-practica';
    if (name.includes('ia') || name.includes('inteligencia artificial')) return 'ia-practica';
    if (name.includes('liderazgo')) return 'liderazgo-servicial';
    if (name.includes('liturgia')) return 'liturgia-viva';
    if (name.includes('economía') || name.includes('economia')) return 'economia-comunion';
    
    return 'default';
  }

  /**
   * Determina el tipo de elemento visual
   */
  private getElementType(filename: string, category: string): 'gradient' | 'illustration' | 'icon' | 'pattern' {
    if (category === 'backgrounds') return 'gradient';
    if (category === 'illustrations') return 'illustration';
    if (category === 'icons') return 'icon';
    if (category === 'decorative') return 'pattern';
    return 'gradient';
  }

  /**
   * Obtiene metadatos del elemento visual
   */
  private getElementMetadata(filename: string, category: string): any {
    const metadata: any = {};

    if (category === 'backgrounds') {
      if (filename.includes('autosuficiencia')) {
        metadata.colors = ['#FFD700', '#8B4513', '#228B22'];
        metadata.theme = 'nature-golden';
      } else if (filename.includes('libertad-financiera')) {
        metadata.colors = ['#1E3A8A', '#7C3AED', '#059669'];
        metadata.theme = 'tech-purple';
      } else if (filename.includes('crecimiento-personal')) {
        metadata.colors = ['#F59E0B', '#EA580C', '#FFFFFF'];
        metadata.theme = 'warm-inspirational';
      } else if (filename.includes('vida-espiritual')) {
        metadata.colors = ['#1E40AF', '#FFFFFF', '#FCD34D'];
        metadata.theme = 'celestial-blue';
      }
      metadata.size = { width: 1200, height: 1600 };
    } else if (category === 'illustrations') {
      metadata.size = { width: 800, height: 600 };
    } else if (category === 'icons') {
      metadata.size = { width: 128, height: 128 };
    } else if (category === 'decorative') {
      metadata.size = { width: 400, height: 400 };
    }

    return metadata;
  }

  /**
   * Crea las secciones del layout de la infografía
   */
  private createLayoutSections(courseData: any, mapping: CourseVisualMapping): CompositionSection[] {
    const sections: CompositionSection[] = [];

    // Header section
    sections.push({
      id: 'header',
      type: 'header',
      position: { x: 0, y: 0, width: 1200, height: 200 },
      elements: [],
      text: {
        content: courseData.nombre,
        style: {
          fontSize: 48,
          fontFamily: 'Inter, sans-serif',
          color: '#FFFFFF',
          fontWeight: 'bold'
        }
      }
    });

    // Main content section
    sections.push({
      id: 'main-content',
      type: 'content',
      position: { x: 0, y: 200, width: 1200, height: 1000 },
      elements: [],
      text: {
        content: courseData.resumen || 'Descripción del curso',
        style: {
          fontSize: 24,
          fontFamily: 'Inter, sans-serif',
          color: '#333333',
          fontWeight: 'normal'
        }
      }
    });

    // Footer section
    sections.push({
      id: 'footer',
      type: 'footer',
      position: { x: 0, y: 1200, width: 1200, height: 400 },
      elements: [],
      text: {
        content: `Duración: ${courseData.duración || 'No especificada'} | Créditos: ${courseData.créditos || 'No especificados'}`,
        style: {
          fontSize: 18,
          fontFamily: 'Inter, sans-serif',
          color: '#666666',
          fontWeight: 'normal'
        }
      }
    });

    return sections;
  }

  /**
   * Obtiene todos los elementos visuales disponibles
   */
  public async getAllVisualElements(): Promise<VisualElement[]> {
    try {
      const categories = ['backgrounds', 'illustrations', 'icons', 'decorative'];
      const elements: VisualElement[] = [];

      for (const category of categories) {
        // Simular obtención de archivos (en un caso real, se leería del sistema de archivos)
        const filenames = this.getFilenamesForCategory(category);
        
        for (const filename of filenames) {
          const element = await this.getVisualElement(filename, category);
          if (element) {
            elements.push(element);
          }
        }
      }

      return elements;
    } catch (error) {
      logger.error('Error obteniendo todos los elementos visuales:', error);
      return [];
    }
  }

  /**
   * Obtiene los nombres de archivo para una categoría
   */
  private getFilenamesForCategory(category: string): string[] {
    const filenames: { [key: string]: string[] } = {
      backgrounds: [
        'background-autosuficiencia.png',
        'background-libertad-financiera.png',
        'background-crecimiento-personal.png',
        'background-vida-espiritual.png'
      ],
      illustrations: [
        'illustration-apicultura-urbana.png',
        'illustration-cocina-chapina.png',
        'illustration-matematica-practica.png',
        'illustration-ia-practica.png'
      ],
      icons: [
        'icon-bee.png',
        'icon-beehive.png',
        'icon-calculator.png',
        'icon-robot.png'
      ],
      decorative: [
        'pattern-honeycomb.png',
        'pattern-geometric.png'
      ]
    };

    return filenames[category] || [];
  }

  /**
   * Limpia la caché de elementos visuales
   */
  public clearCache(): void {
    this.elementsCache.clear();
    logger.info('🧹 Caché de elementos visuales limpiada');
  }
}

// Exportar instancia singleton
export const visualElementsService = VisualElementsService.getInstance();
export default visualElementsService;




