/**
 * Generador de Elementos Visuales con IA
 * 
 * Este servicio genera elementos visuales reales usando IA
 * para crear infografías profesionales.
 */

import { configManager } from './config';
import { logger } from './logger';

export interface VisualElementRequest {
  type: 'background' | 'illustration' | 'icon' | 'chart' | 'decorative';
  theme: string;
  prompt: string;
  size: 'small' | 'medium' | 'large';
  style: 'realistic' | 'illustration' | 'minimal' | 'modern';
}

export interface VisualElementResult {
  success: boolean;
  imageUrl?: string;
  imageBase64?: string;
  error?: string;
  elementType: string;
  prompt: string;
}

export class AIVisualElementsGenerator {
  private static instance: AIVisualElementsGenerator;
  private apiKey: string;
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta';

  private constructor() {
    this.apiKey = configManager.getAIConfig('imagen').apiKey;
    if (!this.apiKey) {
      logger.error('AI API Key no configurada para elementos visuales');
      throw new Error('AI API Key no configurada');
    }
  }

  public static getInstance(): AIVisualElementsGenerator {
    if (!AIVisualElementsGenerator.instance) {
      AIVisualElementsGenerator.instance = new AIVisualElementsGenerator();
    }
    return AIVisualElementsGenerator.instance;
  }

  /**
   * Genera un elemento visual específico
   */
  async generateVisualElement(request: VisualElementRequest): Promise<VisualElementResult> {
    try {
      logger.info('Generating visual element with AI', {
        type: request.type,
        theme: request.theme,
        size: request.size
      });

      const enhancedPrompt = this.createEnhancedPrompt(request);
      
      const result = await this.callImagenAPI(enhancedPrompt, request.size);
      
      return {
        success: true,
        imageUrl: result.imageUrl,
        imageBase64: result.imageBase64,
        elementType: request.type,
        prompt: enhancedPrompt
      };
    } catch (error) {
      logger.error('Error generating visual element', error as Error, {
        type: request.type,
        theme: request.theme
      });
      
      return {
        success: false,
        error: (error as Error).message,
        elementType: request.type,
        prompt: request.prompt
      };
    }
  }

  /**
   * Genera todos los elementos visuales para una infografía
   */
  async generateInfographicElements(courseData: any): Promise<{
    background: VisualElementResult;
    mainIllustration: VisualElementResult;
    icons: VisualElementResult[];
    charts: VisualElementResult[];
  }> {
    const theme = this.determineTheme(courseData.title);
    
    logger.info('Generating complete infographic elements', {
      title: courseData.title,
      theme: theme.name
    });

    // Generar fondo temático
    const background = await this.generateVisualElement({
      type: 'background',
      theme: theme.name,
      prompt: this.createBackgroundPrompt(theme, courseData),
      size: 'large',
      style: 'modern'
    });

    // Generar ilustración principal
    const mainIllustration = await this.generateVisualElement({
      type: 'illustration',
      theme: theme.name,
      prompt: this.createMainIllustrationPrompt(theme, courseData),
      size: 'large',
      style: 'illustration'
    });

    // Generar iconos temáticos
    const icons = await Promise.all([
      this.generateVisualElement({
        type: 'icon',
        theme: theme.name,
        prompt: this.createIconPrompt(theme, 'main'),
        size: 'small',
        style: 'minimal'
      }),
      this.generateVisualElement({
        type: 'icon',
        theme: theme.name,
        prompt: this.createIconPrompt(theme, 'secondary'),
        size: 'small',
        style: 'minimal'
      })
    ]);

    // Generar gráficos si hay datos
    const charts = await this.generateCharts(courseData, theme);

    return {
      background,
      mainIllustration,
      icons,
      charts
    };
  }

  /**
   * Crea prompt mejorado para IA
   */
  private createEnhancedPrompt(request: VisualElementRequest): string {
    const sizeMap = {
      small: '512x512',
      medium: '1024x1024',
      large: '1792x1024'
    };

    const styleInstructions = {
      realistic: 'photorealistic, high detail, professional photography style',
      illustration: 'clean illustration, vector style, modern design',
      minimal: 'minimalist design, clean lines, simple shapes',
      modern: 'modern design, contemporary style, professional'
    };

    return `${request.prompt}

Style: ${styleInstructions[request.style]}
Size: ${sizeMap[request.size]}
Quality: high resolution, professional quality
Theme: ${request.theme}
Element type: ${request.type}

Technical requirements:
- Clean, professional design
- High contrast for readability
- Suitable for infographic use
- No text or words in the image
- Focus on visual communication
- Modern, contemporary aesthetic`;
  }

  /**
   * Determina el tema basado en el título
   */
  private determineTheme(title: string): any {
    const name = title.toLowerCase();
    
    if (name.includes('apicultura')) {
      return {
        name: 'apicultura',
        colors: ['gold', 'honey', 'green', 'brown'],
        elements: ['bees', 'honeycomb', 'flowers', 'honey'],
        mood: 'natural, sustainable, organic'
      };
    }
    
    if (name.includes('cocina')) {
      return {
        name: 'cocina',
        colors: ['orange', 'red', 'yellow', 'brown'],
        elements: ['kitchen', 'cooking', 'ingredients', 'utensils'],
        mood: 'warm, inviting, culinary'
      };
    }
    
    if (name.includes('matemática') || name.includes('matematica')) {
      return {
        name: 'matematica',
        colors: ['blue', 'purple', 'white', 'gray'],
        elements: ['numbers', 'equations', 'geometric shapes', 'calculations'],
        mood: 'precise, logical, analytical'
      };
    }
    
    if (name.includes('ia') || name.includes('inteligencia artificial')) {
      return {
        name: 'ia',
        colors: ['purple', 'blue', 'cyan', 'white'],
        elements: ['circuits', 'neural networks', 'technology', 'data'],
        mood: 'futuristic, technological, innovative'
      };
    }
    
    return {
      name: 'default',
      colors: ['blue', 'gray', 'white'],
      elements: ['abstract', 'geometric'],
      mood: 'professional, clean'
    };
  }

  /**
   * Crea prompt para fondo
   */
  private createBackgroundPrompt(theme: any, courseData: any): string {
    return `Create a professional infographic background for a course about "${courseData.title}".

Theme: ${theme.name}
Colors: ${theme.colors.join(', ')}
Elements: ${theme.elements.join(', ')}
Mood: ${theme.mood}

Design requirements:
- Subtle, non-distracting background
- Professional gradient or pattern
- Suitable for text overlay
- Modern, clean aesthetic
- High quality, high resolution
- No text or words
- Focus on visual atmosphere`;
  }

  /**
   * Crea prompt para ilustración principal
   */
  private createMainIllustrationPrompt(theme: any, courseData: any): string {
    return `Create a main illustration for an infographic about "${courseData.title}".

Theme: ${theme.name}
Subject: ${courseData.title}
Elements: ${theme.elements.join(', ')}
Style: Modern illustration, clean design

The illustration should:
- Represent the main concept of the course
- Be visually engaging and professional
- Work well in an infographic layout
- Use colors that complement the theme
- Be clear and recognizable
- No text or words in the image
- High quality, vector-style illustration`;
  }

  /**
   * Crea prompt para iconos
   */
  private createIconPrompt(theme: any, type: 'main' | 'secondary'): string {
    const iconTypes = {
      main: theme.elements[0] || 'main concept',
      secondary: theme.elements[1] || 'secondary element'
    };

    return `Create a professional icon representing "${iconTypes[type]}" for a ${theme.name} themed infographic.

Style: Minimalist icon design
Colors: ${theme.colors[0]} and ${theme.colors[1]}
Shape: Clean, simple, recognizable
Usage: Infographic icon

Requirements:
- Simple, clean design
- High contrast
- Recognizable at small sizes
- Professional appearance
- No text or words
- Vector-style icon`;
  }

  /**
   * Genera gráficos si hay datos
   */
  private async generateCharts(courseData: any, theme: any): Promise<VisualElementResult[]> {
    const charts: VisualElementResult[] = [];
    
    // Buscar datos de estadísticas en el curso
    const statsSection = courseData.sections?.find((s: any) => s.type === 'stats');
    if (statsSection?.content?.stats?.items) {
      const chart = await this.generateVisualElement({
        type: 'chart',
        theme: theme.name,
        prompt: this.createChartPrompt(statsSection.content.stats.items, theme),
        size: 'medium',
        style: 'modern'
      });
      charts.push(chart);
    }
    
    return charts;
  }

  /**
   * Crea prompt para gráficos
   */
  private createChartPrompt(stats: any[], theme: any): string {
    const data = stats.map(stat => `${stat.label}: ${stat.value}${stat.unit}`).join(', ');
    
    return `Create a professional infographic chart showing: ${data}

Theme: ${theme.name}
Colors: ${theme.colors.join(', ')}
Style: Modern data visualization

Requirements:
- Clean, professional chart design
- Easy to read and understand
- Suitable for infographic use
- Modern visualization style
- High quality, high resolution
- No text labels (visual only)
- Focus on data representation`;
  }

  /**
   * Llama a la API de Imagen
   */
  private async callImagenAPI(prompt: string, size: 'small' | 'medium' | 'large'): Promise<{imageUrl: string, imageBase64: string}> {
    const sizeMap = {
      small: '1:1',
      medium: '1:1', 
      large: '16:9'
    };

    const request = {
      instances: [
        {
          prompt: prompt,
          negative_prompt: "text, words, letters, watermark, blurry, ugly, deformed, noisy, jpeg artifacts, signature, low quality"
        }
      ],
      parameters: {
        sampleCount: 1,
        aspectRatio: sizeMap[size],
        sampleImageSize: '1K'
      }
    };

    const response = await fetch(
      `${this.baseUrl}/models/imagen-4.0-generate-001:predict`,
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(request)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    if (!result.predictions || result.predictions.length === 0) {
      throw new Error('No image generated');
    }

    const imageBase64 = result.predictions[0].bytesBase64Encoded;
    const imageUrl = `data:image/png;base64,${imageBase64}`;

    return { imageUrl, imageBase64 };
  }
}

export const aiVisualElementsGenerator = AIVisualElementsGenerator.getInstance();




