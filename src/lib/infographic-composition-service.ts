/**
 * Servicio de Composición de Infografías con Elementos Visuales
 * 
 * Este servicio integra los elementos visuales generados con el sistema
 * de infografías para crear composiciones profesionales y coherentes.
 */

import { InfographicData } from './types/infographic';
import { visualElementsService, InfographicComposition, VisualElement } from './visual-elements-service';
import { logger } from './logger';
import { AppError, ErrorCode } from './errors';

export interface CompositionRequest {
  courseData: any;
  useVisualElements?: boolean;
  compositionStyle?: 'modern' | 'classic' | 'minimalist' | 'creative';
  includeIcons?: boolean;
  includeDecorative?: boolean;
}

export interface CompositionResult {
  success: boolean;
  composition?: InfographicComposition;
  infographicData?: InfographicData;
  error?: string;
  metadata?: {
    elementsUsed: number;
    compositionTime: number;
    style: string;
  };
}

export class InfographicCompositionService {
  private static instance: InfographicCompositionService;

  public static getInstance(): InfographicCompositionService {
    if (!InfographicCompositionService.instance) {
      InfographicCompositionService.instance = new InfographicCompositionService();
    }
    return InfographicCompositionService.instance;
  }

  /**
   * Crea una composición de infografía usando elementos visuales
   */
  async createComposition(request: CompositionRequest): Promise<CompositionResult> {
    const startTime = Date.now();
    
    try {
      logger.info('🎨 Creando composición de infografía', {
        courseName: request.courseData.nombre,
        useVisualElements: request.useVisualElements,
        style: request.compositionStyle
      });

      // Crear composición visual
      const composition = await visualElementsService.createInfographicComposition(request.courseData);
      
      // Convertir a datos de infografía
      const infographicData = this.composeInfographicData(request.courseData, composition, request);
      
      const duration = Date.now() - startTime;
      
      logger.info('✅ Composición creada exitosamente', {
        courseName: request.courseData.nombre,
        elementsUsed: composition.icons.length + composition.decorativeElements.length,
        duration
      });

      return {
        success: true,
        composition,
        infographicData,
        metadata: {
          elementsUsed: composition.icons.length + composition.decorativeElements.length,
          compositionTime: duration,
          style: request.compositionStyle || 'modern'
        }
      };

    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error('❌ Error creando composición', error as Error, {
        courseName: request.courseData.nombre,
        duration
      });

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
        metadata: {
          elementsUsed: 0,
          compositionTime: duration,
          style: request.compositionStyle || 'modern'
        }
      };
    }
  }

  /**
   * Convierte la composición visual a datos de infografía
   */
  private composeInfographicData(
    courseData: any, 
    composition: InfographicComposition, 
    request: CompositionRequest
  ): InfographicData {
    
    const theme = this.createThemeFromComposition(composition, request.compositionStyle);
    
    const infographicData: InfographicData = {
      id: `infographic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: courseData.nombre,
      subtitle: courseData.resumen || 'Descripción del curso',
      theme,
      sections: this.createSectionsFromCourseData(courseData, composition, request),
      metadata: {
        created_at: new Date().toISOString(),
        course_id: this.extractCourseId(courseData.nombre),
        composition_style: request.compositionStyle || 'modern',
        visual_elements_used: composition.icons.length + composition.decorativeElements.length
      }
    };

    return infographicData;
  }

  /**
   * Crea el tema visual basado en la composición
   */
  private createThemeFromComposition(
    composition: InfographicComposition, 
    style?: string
  ): any {
    const backgroundColors = composition.background.metadata.colors || ['#3B82F6', '#1E40AF'];
    
    return {
      style: style || 'modern',
      primaryColor: backgroundColors[0] || '#3B82F6',
      secondaryColor: backgroundColors[1] || '#1E40AF',
      accentColor: backgroundColors[2] || '#F59E0B',
      backgroundColor: backgroundColors[0] || '#FFFFFF',
      textColor: '#333333',
      backgroundImage: composition.background.url,
      mainIllustration: composition.mainIllustration.url,
      icons: composition.icons.map(icon => icon.url),
      decorativeElements: composition.decorativeElements.map(decorative => decorative.url)
    };
  }

  /**
   * Crea las secciones de la infografía basadas en los datos del curso
   */
  private createSectionsFromCourseData(
    courseData: any, 
    composition: InfographicComposition, 
    request: CompositionRequest
  ): any[] {
    const sections: any[] = [];

    // Sección de objetivos
    if (courseData.objetivos && courseData.objetivos.length > 0) {
      sections.push({
        id: 'objetivos',
        type: 'list',
        title: 'Objetivos del Curso',
        content: {
          list: {
            items: courseData.objetivos.map((objetivo: string) => ({
              text: objetivo,
              icon: request.includeIcons ? composition.icons[0]?.url : undefined
            }))
          }
        }
      });
    }

    // Sección de contenido
    if (courseData.contenido && courseData.contenido.length > 0) {
      sections.push({
        id: 'contenido',
        type: 'text',
        title: 'Contenido del Curso',
        content: {
          text: {
            content: this.formatCourseContent(courseData.contenido)
          }
        }
      });
    }

    // Sección de estadísticas
    sections.push({
      id: 'estadisticas',
      type: 'stats',
      title: 'Información del Curso',
      content: {
        stats: {
          items: [
            {
              label: 'Duración',
              value: courseData.duración || 'No especificada',
              unit: '',
              icon: request.includeIcons ? composition.icons[1]?.url : undefined
            },
            {
              label: 'Créditos',
              value: courseData.créditos || 'No especificados',
              unit: '',
              icon: request.includeIcons ? composition.icons[2]?.url : undefined
            },
            {
              label: 'Modalidad',
              value: courseData.modalidad_piloto || 'No especificada',
              unit: '',
              icon: request.includeIcons ? composition.icons[3]?.url : undefined
            }
          ]
        }
      }
    });

    // Sección de público objetivo
    if (courseData.público_objetivo) {
      sections.push({
        id: 'publico',
        type: 'text',
        title: 'Público Objetivo',
        content: {
          text: {
            content: courseData.público_objetivo
          }
        }
      });
    }

    // Sección de razón para tomar el curso
    if (courseData.razón_para_tomarlo) {
      sections.push({
        id: 'razon',
        type: 'text',
        title: '¿Por qué tomar este curso?',
        content: {
          text: {
            content: courseData.razón_para_tomarlo
          }
        }
      });
    }

    return sections;
  }

  /**
   * Formatea el contenido del curso para la infografía
   */
  private formatCourseContent(contenido: any[]): string {
    return contenido.map(modulo => {
      const actividades = modulo.actividades ? 
        modulo.actividades.map((actividad: string) => `• ${actividad}`).join('\n') : 
        '';
      
      return `${modulo.módulo}:\n${actividades}`;
    }).join('\n\n');
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
   * Obtiene una composición predefinida para un curso específico
   */
  async getPredefinedComposition(courseId: string): Promise<CompositionResult> {
    try {
      const mapping = visualElementsService.getCourseVisualMapping(courseId);
      
      if (!mapping) {
        throw new AppError(ErrorCode.NOT_FOUND, `No se encontró composición predefinida para: ${courseId}`);
      }

      // Crear datos de curso simulados basados en el mapeo
      const courseData = {
        nombre: mapping.courseName,
        resumen: `Curso de ${mapping.category}`,
        objetivos: ['Objetivo 1', 'Objetivo 2', 'Objetivo 3'],
        contenido: [
          {
            módulo: 'Módulo 1',
            actividades: ['Actividad 1', 'Actividad 2']
          }
        ],
        duración: '4 semanas',
        modalidad_piloto: 'Taller presencial',
        créditos: 2,
        público_objetivo: 'Jóvenes adultos y padres de familia',
        razón_para_tomarlo: 'Aprende habilidades prácticas y útiles'
      };

      return await this.createComposition({
        courseData,
        useVisualElements: true,
        compositionStyle: 'modern',
        includeIcons: true,
        includeDecorative: true
      });

    } catch (error) {
      logger.error('Error obteniendo composición predefinida', error as Error, { courseId });
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      };
    }
  }

  /**
   * Lista todas las composiciones disponibles
   */
  async getAvailableCompositions(): Promise<string[]> {
    try {
      const elements = await visualElementsService.getAllVisualElements();
      const compositions: string[] = [];

      // Obtener composiciones basadas en ilustraciones disponibles
      const illustrations = elements.filter(el => el.category === 'illustrations');
      
      illustrations.forEach(illustration => {
        const courseId = this.extractCourseIdFromFilename(illustration.filename);
        if (courseId && courseId !== 'default') {
          compositions.push(courseId);
        }
      });

      return [...new Set(compositions)]; // Eliminar duplicados

    } catch (error) {
      logger.error('Error obteniendo composiciones disponibles', error as Error);
      return [];
    }
  }

  /**
   * Extrae el ID del curso desde el nombre del archivo
   */
  private extractCourseIdFromFilename(filename: string): string {
    if (filename.includes('apicultura')) return 'apicultura-urbana';
    if (filename.includes('cocina')) return 'cocina-chapina';
    if (filename.includes('matematica')) return 'matematica-practica';
    if (filename.includes('ia')) return 'ia-practica';
    if (filename.includes('liderazgo')) return 'liderazgo-servicial';
    if (filename.includes('liturgia')) return 'liturgia-viva';
    if (filename.includes('economia')) return 'economia-comunion';
    
    return 'default';
  }

  /**
   * Valida que una composición sea válida
   */
  validateComposition(composition: InfographicComposition): boolean {
    try {
      if (!composition.background || !composition.mainIllustration) {
        return false;
      }

      if (!composition.layout || !composition.layout.sections) {
        return false;
      }

      if (composition.layout.sections.length === 0) {
        return false;
      }

      return true;
    } catch (error) {
      logger.error('Error validando composición', error as Error);
      return false;
    }
  }
}

// Exportar instancia singleton
export const infographicCompositionService = InfographicCompositionService.getInstance();
export default infographicCompositionService;




