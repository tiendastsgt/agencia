/**
 * Compositor de Infografías Reales
 * 
 * Este servicio compone infografías profesionales usando elementos visuales
 * generados por IA y los combina con texto del sistema.
 */

import { InfographicData } from './types/infographic';
import { aiVisualElementsGenerator, VisualElementResult } from './ai-visual-elements-generator';
import { logger } from './logger';

export interface RealInfographicOptions {
  width: number;
  height: number;
  format: 'png' | 'jpg';
  quality: 'low' | 'medium' | 'high';
  includeWatermark: boolean;
}

export class RealInfographicComposer {
  private static instance: RealInfographicComposer;

  public static getInstance(): RealInfographicComposer {
    if (!RealInfographicComposer.instance) {
      RealInfographicComposer.instance = new RealInfographicComposer();
    }
    return RealInfographicComposer.instance;
  }

  /**
   * Compone una infografía real usando elementos visuales de IA
   */
  async composeRealInfographic(
    data: InfographicData,
    options: RealInfographicOptions = {
      width: 1200,
      height: 1600,
      format: 'png',
      quality: 'high',
      includeWatermark: false
    }
  ): Promise<string> {
    try {
      logger.info('Composing real infographic with AI elements', {
        title: data.title,
        width: options.width,
        height: options.height
      });

      // Generar elementos visuales con IA
      const elements = await aiVisualElementsGenerator.generateInfographicElements(data);
      
      // Crear canvas para composición
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('No se pudo obtener el contexto del canvas');
      }

      canvas.width = options.width;
      canvas.height = options.height;

      // Cargar y dibujar elementos visuales
      await this.drawBackground(ctx, canvas, elements.background);
      await this.drawMainIllustration(ctx, canvas, elements.mainIllustration);
      await this.drawIcons(ctx, canvas, elements.icons);
      await this.drawCharts(ctx, canvas, elements.charts);
      
      // Dibujar texto del sistema (esto sí lo controlamos nosotros)
      this.drawSystemText(ctx, canvas, data);
      
      // Agregar watermark si se solicita
      if (options.includeWatermark) {
        this.drawWatermark(ctx, canvas);
      }

      return canvas.toDataURL(`image/${options.format}`, options.quality === 'high' ? 0.9 : options.quality === 'medium' ? 0.7 : 0.5);
    } catch (error) {
      logger.error('Error composing real infographic', error as Error, {
        title: data.title
      });
      throw error;
    }
  }

  /**
   * Dibuja el fondo generado por IA
   */
  private async drawBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, background: VisualElementResult): Promise<void> {
    if (background.success && background.imageUrl) {
      try {
        const img = await this.loadImage(background.imageUrl);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        logger.info('Background drawn successfully');
      } catch (error) {
        logger.warn('Failed to load background, using fallback', error as Error);
        this.drawFallbackBackground(ctx, canvas);
      }
    } else {
      this.drawFallbackBackground(ctx, canvas);
    }
  }

  /**
   * Dibuja la ilustración principal
   */
  private async drawMainIllustration(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, illustration: VisualElementResult): Promise<void> {
    if (illustration.success && illustration.imageUrl) {
      try {
        const img = await this.loadImage(illustration.imageUrl);
        // Posicionar en el header
        const x = canvas.width - 200;
        const y = 50;
        const size = 150;
        ctx.drawImage(img, x, y, size, size);
        logger.info('Main illustration drawn successfully');
      } catch (error) {
        logger.warn('Failed to load main illustration', error as Error);
      }
    }
  }

  /**
   * Dibuja los iconos
   */
  private async drawIcons(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, icons: VisualElementResult[]): Promise<void> {
    for (let i = 0; i < icons.length; i++) {
      const icon = icons[i];
      if (icon.success && icon.imageUrl) {
        try {
          const img = await this.loadImage(icon.imageUrl);
          // Posicionar iconos en diferentes secciones
          const positions = [
            { x: 100, y: 400 }, // Primera sección
            { x: 100, y: 800 }  // Segunda sección
          ];
          
          if (positions[i]) {
            const pos = positions[i];
            ctx.drawImage(img, pos.x, pos.y, 60, 60);
            logger.info(`Icon ${i} drawn successfully`);
          }
        } catch (error) {
          logger.warn(`Failed to load icon ${i}`, error as Error);
        }
      }
    }
  }

  /**
   * Dibuja los gráficos
   */
  private async drawCharts(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, charts: VisualElementResult[]): Promise<void> {
    for (let i = 0; i < charts.length; i++) {
      const chart = charts[i];
      if (chart.success && chart.imageUrl) {
        try {
          const img = await this.loadImage(chart.imageUrl);
          // Posicionar gráfico en una sección
          const x = 200;
          const y = 600 + (i * 300);
          const width = 400;
          const height = 200;
          ctx.drawImage(img, x, y, width, height);
          logger.info(`Chart ${i} drawn successfully`);
        } catch (error) {
          logger.warn(`Failed to load chart ${i}`, error as Error);
        }
      }
    }
  }

  /**
   * Dibuja el texto del sistema (esto sí lo controlamos)
   */
  private drawSystemText(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData): void {
    // Determinar tema para colores de texto
    const theme = this.determineTheme(data.title);
    
    // Header con texto
    this.drawHeaderText(ctx, canvas, data, theme);
    
    // Secciones con texto
    this.drawSectionsText(ctx, canvas, data, theme);
  }

  /**
   * Dibuja el texto del header
   */
  private drawHeaderText(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, theme: any): void {
    // Título principal
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;
    
    // Dividir título en líneas si es muy largo
    const words = data.title.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > canvas.width - 200 && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    
    // Dibujar líneas del título
    const startY = 100;
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + index * 60);
    });
    
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Subtítulo
    if (data.subtitle) {
      ctx.font = '28px Inter, Arial, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 10;
      ctx.fillText(data.subtitle, canvas.width / 2, startY + lines.length * 60 + 40);
      ctx.shadowBlur = 0;
    }
  }

  /**
   * Dibuja el texto de las secciones
   */
  private drawSectionsText(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, theme: any): void {
    let yPosition = 350;
    const sectionSpacing = 50;

    data.sections?.forEach((section, index) => {
      yPosition = this.drawSectionText(ctx, canvas, section, yPosition, theme);
      yPosition += sectionSpacing;
    });
  }

  /**
   * Dibuja el texto de una sección
   */
  private drawSectionText(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, section: any, yPosition: number, theme: any): number {
    const sectionWidth = canvas.width - 100;
    const sectionX = 50;
    const sectionHeight = 300;

    // Fondo semi-transparente para el texto
    ctx.fillStyle = 'rgba(255,255,255,0.95)';
    ctx.fillRect(sectionX, yPosition, sectionWidth, sectionHeight);
    
    // Borde
    ctx.strokeStyle = theme.primaryColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(sectionX, yPosition, sectionWidth, sectionHeight);

    // Título de la sección
    ctx.fillStyle = theme.primaryColor;
    ctx.font = 'bold 32px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(section.title, sectionX + 30, yPosition + 50);

    // Línea decorativa
    ctx.fillStyle = theme.accentColor;
    ctx.fillRect(sectionX + 30, yPosition + 60, 100, 4);

    // Contenido de la sección
    let contentY = yPosition + 100;
    
    switch (section.type) {
      case 'stats':
        contentY = this.drawStatsText(ctx, section, sectionX + 30, contentY, theme);
        break;
      case 'list':
        contentY = this.drawListText(ctx, section, sectionX + 30, contentY, theme);
        break;
      case 'text':
        contentY = this.drawTextContent(ctx, section, sectionX + 30, contentY, theme);
        break;
      default:
        contentY = this.drawGenericText(ctx, section, sectionX + 30, contentY, theme);
    }

    return contentY + 40;
  }

  /**
   * Dibuja texto de estadísticas
   */
  private drawStatsText(ctx: CanvasRenderingContext2D, section: any, x: number, y: number, theme: any): number {
    const stats = section.content?.stats?.items || [];
    const statsPerRow = 2;
    const statWidth = 250;
    const statHeight = 100;

    stats.forEach((stat: any, index: number) => {
      const col = index % statsPerRow;
      const row = Math.floor(index / statsPerRow);
      const statX = x + col * (statWidth + 30);
      const statY = y + row * (statHeight + 20);

      // Fondo de la tarjeta
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(statX, statY, statWidth, statHeight);
      ctx.strokeStyle = theme.primaryColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(statX, statY, statWidth, statHeight);

      // Valor
      ctx.fillStyle = theme.primaryColor;
      ctx.font = 'bold 36px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${stat.value}${stat.unit}`, statX + statWidth / 2, statY + 50);

      // Etiqueta
      ctx.fillStyle = theme.textColor;
      ctx.font = 'bold 18px Inter, Arial, sans-serif';
      ctx.fillText(stat.label, statX + statWidth / 2, statY + 80);
    });

    return y + Math.ceil(stats.length / statsPerRow) * (statHeight + 20);
  }

  /**
   * Dibuja texto de lista
   */
  private drawListText(ctx: CanvasRenderingContext2D, section: any, x: number, y: number, theme: any): number {
    const items = section.content?.list?.items || [];

    items.forEach((item: any, index: number) => {
      const itemY = y + index * 35;

      // Bullet point
      ctx.fillStyle = theme.primaryColor;
      ctx.beginPath();
      ctx.arc(x + 15, itemY - 5, 6, 0, 2 * Math.PI);
      ctx.fill();

      // Texto
      ctx.fillStyle = theme.textColor;
      ctx.font = '20px Inter, Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.text, x + 30, itemY);
    });

    return y + items.length * 35;
  }

  /**
   * Dibuja contenido de texto
   */
  private drawTextContent(ctx: CanvasRenderingContext2D, section: any, x: number, y: number, theme: any): number {
    const text = section.content?.text?.content || '';
    
    ctx.fillStyle = theme.textColor;
    ctx.font = '20px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    
    // Dividir texto en líneas
    const words = text.split(' ');
    let line = '';
    let lineY = y;
    const maxWidth = 1000;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, lineY);
        line = words[i] + ' ';
        lineY += 25;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, lineY);

    return lineY + 30;
  }

  /**
   * Dibuja contenido genérico
   */
  private drawGenericText(ctx: CanvasRenderingContext2D, section: any, x: number, y: number, theme: any): number {
    ctx.fillStyle = theme.textColor;
    ctx.font = '18px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Contenido de la sección ${section.type}`, x, y);
    return y + 30;
  }

  /**
   * Dibuja fondo de fallback
   */
  private drawFallbackBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, '#3B82F6');
    gradient.addColorStop(1, '#1E40AF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Dibuja watermark
   */
  private drawWatermark(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.font = '18px Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('MarketPro GT', canvas.width - 30, canvas.height - 30);
  }

  /**
   * Determina el tema
   */
  private determineTheme(title: string): any {
    const name = title.toLowerCase();
    
    if (name.includes('apicultura')) {
      return {
        primaryColor: '#FFD700',
        accentColor: '#228B22',
        textColor: '#2F4F4F'
      };
    }
    
    if (name.includes('cocina')) {
      return {
        primaryColor: '#FF6347',
        accentColor: '#FFD700',
        textColor: '#8B4513'
      };
    }
    
    if (name.includes('matemática') || name.includes('matematica')) {
      return {
        primaryColor: '#4169E1',
        accentColor: '#FFD700',
        textColor: '#191970'
      };
    }
    
    if (name.includes('ia') || name.includes('inteligencia artificial')) {
      return {
        primaryColor: '#9370DB',
        accentColor: '#00CED1',
        textColor: '#4B0082'
      };
    }
    
    return {
      primaryColor: '#3B82F6',
      accentColor: '#F59E0B',
      textColor: '#1F2937'
    };
  }

  /**
   * Carga una imagen desde URL
   */
  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }
}

export const realInfographicComposer = RealInfographicComposer.getInstance();




