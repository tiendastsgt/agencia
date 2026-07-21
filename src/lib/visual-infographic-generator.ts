/**
 * Generador de Infografías con Elementos Visuales - REFACTORIZADO
 * 
 * Este generador crea infografías profesionales usando los elementos visuales
 * generados y los integra con el contenido del curso.
 * 
 * REFACTORIZADO: Dividido en funciones más pequeñas (<50 líneas cada una)
 */

import { InfographicData } from './types/infographic';
import { visualElementsService } from './visual-elements-service';
import { logError, logDebug } from '../utils/logger';

export interface VisualInfographicOptions {
  width: number;
  height: number;
  format: 'png' | 'jpg' | 'svg';
  quality: 'low' | 'medium' | 'high';
  includeWatermark: boolean;
  useVisualElements: boolean;
}

export class VisualInfographicGenerator {
  private static instance: VisualInfographicGenerator;

  public static getInstance(): VisualInfographicGenerator {
    if (!VisualInfographicGenerator.instance) {
      VisualInfographicGenerator.instance = new VisualInfographicGenerator();
    }
    return VisualInfographicGenerator.instance;
  }

  /**
   * Genera una infografía usando elementos visuales
   */
  async generateVisualInfographic(
    data: InfographicData,
    options: VisualInfographicOptions = {
      width: 1200,
      height: 1600,
      format: 'png',
      quality: 'high',
      includeWatermark: false,
      useVisualElements: true
    }
  ): Promise<string> {
    try {
      if (options.useVisualElements) {
        return await this.generateWithVisualElements(data, options);
      } else {
        return await this.generateSimpleInfographic(data, options);
      }
    } catch (error) {
      logError('Error generando infografía visual:', error);
      return await this.generateSimpleInfographic(data, options);
    }
  }

  /**
   * Genera infografía usando elementos visuales
   */
  private async generateWithVisualElements(data: InfographicData, options: VisualInfographicOptions): Promise<string> {
    const canvas = this.createCanvas(options);
    const ctx = this.getCanvasContext(canvas);
    
    const courseId = this.extractCourseId(data.title);
    const mapping = visualElementsService.getCourseVisualMapping(courseId);

    if (mapping) {
      await this.drawInfographicWithMapping(ctx, canvas, data, mapping);
    } else {
      await this.drawSimpleInfographic(ctx, canvas, data);
    }

    this.addWatermarkIfNeeded(ctx, canvas, options);
    return this.exportCanvas(canvas, options);
  }

  /**
   * Crea el canvas con las dimensiones especificadas
   */
  private createCanvas(options: VisualInfographicOptions): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    canvas.width = options.width;
    canvas.height = options.height;
    return canvas;
  }

  /**
   * Obtiene el contexto del canvas
   */
  private getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto del canvas');
    }
    return ctx;
  }

  /**
   * Dibuja la infografía usando el mapeo de elementos visuales
   */
  private async drawInfographicWithMapping(
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    data: InfographicData, 
    mapping: any
  ): Promise<void> {
    const background = await visualElementsService.getVisualElement(mapping.elements.background, 'backgrounds');
    const mainIllustration = await visualElementsService.getVisualElement(mapping.elements.illustration, 'illustrations');
    
    if (background) {
      await this.drawBackground(ctx, canvas, background);
    }

    await this.drawHeader(ctx, canvas, data, mapping);
    await this.drawMainContent(ctx, canvas, data, mapping);

    if (mainIllustration) {
      await this.drawMainIllustration(ctx, canvas, mainIllustration);
    }

    await this.drawIcons(ctx, canvas, mapping.elements.icons);
    await this.drawDecorativeElements(ctx, canvas, mapping.elements.decorative);
  }

  /**
   * Dibuja los iconos de la infografía
   */
  private async drawIcons(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, icons: string[]): Promise<void> {
    for (const iconFilename of icons) {
      const icon = await visualElementsService.getVisualElement(iconFilename, 'icons');
      if (icon) {
        await this.drawIcon(ctx, canvas, icon);
      }
    }
  }

  /**
   * Dibuja los elementos decorativos
   */
  private async drawDecorativeElements(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, decorative: string[]): Promise<void> {
    for (const decorativeFilename of decorative) {
      const decorativeElement = await visualElementsService.getVisualElement(decorativeFilename, 'decorative');
      if (decorativeElement) {
        await this.drawDecorativeElement(ctx, canvas, decorativeElement);
      }
    }
  }

  /**
   * Agrega watermark si es necesario
   */
  private addWatermarkIfNeeded(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, options: VisualInfographicOptions): void {
    if (options.includeWatermark) {
      this.drawWatermark(ctx, canvas);
    }
  }

  /**
   * Exporta el canvas como imagen
   */
  private exportCanvas(canvas: HTMLCanvasElement, options: VisualInfographicOptions): string {
    const quality = options.quality === 'high' ? 0.9 : options.quality === 'medium' ? 0.7 : 0.5;
    return canvas.toDataURL(`image/${options.format}`, quality);
  }

  /**
   * Dibuja el fondo usando elementos visuales
   */
  private async drawBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, background: any): Promise<void> {
    const colors = background.metadata?.colors || ['#FFD700', '#8B4513', '#228B22'];
    const gradient = this.createGradient(ctx, canvas, colors);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    this.drawHexagonPattern(ctx, canvas);
  }

  /**
   * Crea un gradiente lineal con los colores especificados
   */
  private createGradient(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, colors: string[]): CanvasGradient {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    
    colors.forEach((color: string, index: number) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });
    
    return gradient;
  }

  /**
   * Dibuja un patrón de hexágonos sutil
   */
  private drawHexagonPattern(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    const hexSize = 40;
    for (let x = 0; x < canvas.width + hexSize; x += hexSize * 1.5) {
      for (let y = 0; y < canvas.height + hexSize; y += hexSize * Math.sqrt(3)) {
        this.drawHexagon(ctx, x, y, hexSize);
      }
    }
    
    ctx.globalAlpha = 1;
  }

  /**
   * Dibuja un hexágono individual
   */
  private drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const px = x + size * Math.cos(angle);
      const py = y + size * Math.sin(angle);
      
      if (i === 0) {
        ctx.moveTo(px, py);
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }

  /**
   * Dibuja el header de la infografía
   */
  private async drawHeader(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, mapping: any): Promise<void> {
    const headerHeight = 200;
    const headerY = 50;
    
    // Fondo del header
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(50, headerY, canvas.width - 100, headerHeight);
    
    // Título principal
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(data.title, canvas.width / 2, headerY + 80);
    
    // Subtítulo
    if (data.subtitle) {
      ctx.fillStyle = '#7F8C8D';
      ctx.font = '24px Arial';
      ctx.fillText(data.subtitle, canvas.width / 2, headerY + 120);
    }
    
    // Logo o elemento visual del header
    if (mapping.elements.logo) {
      await this.drawLogo(ctx, canvas, mapping.elements.logo, headerY);
    }
  }

  /**
   * Dibuja el logo en el header
   */
  private async drawLogo(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, logoFilename: string, headerY: number): Promise<void> {
    const logo = await visualElementsService.getVisualElement(logoFilename, 'logos');
    if (logo) {
      const logoSize = 80;
      const logoX = canvas.width - 150;
      const logoY = headerY + 20;
      
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    }
  }

  /**
   * Dibuja el contenido principal de la infografía
   */
  private async drawMainContent(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, mapping: any): Promise<void> {
    const contentY = 300;
    const contentHeight = canvas.height - contentY - 100;
    
    // Fondo del contenido
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.fillRect(50, contentY, canvas.width - 100, contentHeight);
    
    // Título de sección
    ctx.fillStyle = '#34495E';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Contenido del Curso', 80, contentY + 50);
    
    // Lista de temas
    this.drawTopicsList(ctx, canvas, data.topics, contentY + 80);
    
    // Estadísticas
    this.drawStatistics(ctx, canvas, data.statistics, contentY + 300);
  }

  /**
   * Dibuja la lista de temas
   */
  private drawTopicsList(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, topics: string[], startY: number): void {
    ctx.fillStyle = '#2C3E50';
    ctx.font = '20px Arial';
    
    topics.forEach((topic, index) => {
      const y = startY + (index * 35);
      ctx.fillText(`• ${topic}`, 100, y);
    });
  }

  /**
   * Dibuja las estadísticas
   */
  private drawStatistics(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, statistics: any, startY: number): void {
    if (!statistics) return;
    
    ctx.fillStyle = '#27AE60';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    
    const statsX = canvas.width / 2;
    ctx.fillText(`Duración: ${statistics.duration}`, statsX, startY);
    ctx.fillText(`Nivel: ${statistics.level}`, statsX, startY + 40);
    ctx.fillText(`Estudiantes: ${statistics.students}`, statsX, startY + 80);
  }

  /**
   * Dibuja la ilustración principal
   */
  private async drawMainIllustration(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, illustration: any): Promise<void> {
    const illustrationWidth = 300;
    const illustrationHeight = 200;
    const x = canvas.width - 350;
    const y = canvas.height - 250;
    
    ctx.drawImage(illustration, x, y, illustrationWidth, illustrationHeight);
  }

  /**
   * Dibuja un icono individual
   */
  private async drawIcon(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, icon: any): Promise<void> {
    const iconSize = 40;
    const x = Math.random() * (canvas.width - iconSize);
    const y = Math.random() * (canvas.height - iconSize);
    
    ctx.drawImage(icon, x, y, iconSize, iconSize);
  }

  /**
   * Dibuja un elemento decorativo
   */
  private async drawDecorativeElement(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, decorative: any): Promise<void> {
    const size = 60;
    const x = Math.random() * (canvas.width - size);
    const y = Math.random() * (canvas.height - size);
    
    ctx.globalAlpha = 0.3;
    ctx.drawImage(decorative, x, y, size, size);
    ctx.globalAlpha = 1;
  }

  /**
   * Dibuja el watermark
   */
  private drawWatermark(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.font = '16px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('MarketPro GT', canvas.width - 20, canvas.height - 20);
  }

  /**
   * Genera una infografía simple sin elementos visuales
   */
  private async generateSimpleInfographic(data: InfographicData, options: VisualInfographicOptions): Promise<string> {
    const canvas = this.createCanvas(options);
    const ctx = this.getCanvasContext(canvas);
    
    await this.drawSimpleInfographic(ctx, canvas, data);
    return this.exportCanvas(canvas, options);
  }

  /**
   * Dibuja una infografía simple
   */
  private async drawSimpleInfographic(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData): Promise<void> {
    // Fondo simple
    ctx.fillStyle = '#F8F9FA';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Título
    ctx.fillStyle = '#2C3E50';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(data.title, canvas.width / 2, 100);
    
    // Contenido básico
    ctx.fillStyle = '#34495E';
    ctx.font = '24px Arial';
    ctx.textAlign = 'left';
    
    let y = 200;
    data.topics.forEach((topic, index) => {
      ctx.fillText(`${index + 1}. ${topic}`, 100, y);
      y += 40;
    });
  }

  /**
   * Extrae el ID del curso del título
   */
  private extractCourseId(title: string): string {
    // Lógica simplificada para extraer ID del curso
    return title.toLowerCase().replace(/\s+/g, '-');
  }
}

export interface VisualInfographicOptions {
  width: number;
  height: number;
  format: 'png' | 'jpg' | 'svg';
  quality: 'low' | 'medium' | 'high';
  includeWatermark: boolean;
  useVisualElements: boolean;
}

export class VisualInfographicGenerator {
  private static instance: VisualInfographicGenerator;

  public static getInstance(): VisualInfographicGenerator {
    if (!VisualInfographicGenerator.instance) {
      VisualInfographicGenerator.instance = new VisualInfographicGenerator();
    }
    return VisualInfographicGenerator.instance;
  }

  /**
   * Genera una infografía usando elementos visuales
   */
  async generateVisualInfographic(
    data: InfographicData,
    options: VisualInfographicOptions = {
      width: 1200,
      height: 1600,
      format: 'png',
      quality: 'high',
      includeWatermark: false,
      useVisualElements: true
    }
  ): Promise<string> {
    try {
      if (options.useVisualElements) {
        return await this.generateWithVisualElements(data, options);
      } else {
        return await this.generateSimpleInfographic(data, options);
      }
    } catch (error) {
      console.error('Error generando infografía visual:', error);
      return await this.generateSimpleInfographic(data, options);
    }
  }

  /**
   * Genera infografía usando elementos visuales
   */
  private async generateWithVisualElements(data: InfographicData, options: VisualInfographicOptions): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto del canvas');
    }

    canvas.width = options.width;
    canvas.height = options.height;

    // Obtener elementos visuales para el curso
    const courseId = this.extractCourseId(data.title);
    const mapping = visualElementsService.getCourseVisualMapping(courseId);

    if (mapping) {
      // Cargar elementos visuales
      const background = await visualElementsService.getVisualElement(mapping.elements.background, 'backgrounds');
      const mainIllustration = await visualElementsService.getVisualElement(mapping.elements.illustration, 'illustrations');
      
      // Aplicar fondo
      if (background) {
        await this.drawBackground(ctx, canvas, background);
      }

      // Dibujar header con elementos visuales
      await this.drawHeader(ctx, canvas, data, mapping);

      // Dibujar contenido principal
      await this.drawMainContent(ctx, canvas, data, mapping);

      // Dibujar ilustración principal
      if (mainIllustration) {
        await this.drawMainIllustration(ctx, canvas, mainIllustration);
      }

      // Dibujar iconos
      for (const iconFilename of mapping.elements.icons) {
        const icon = await visualElementsService.getVisualElement(iconFilename, 'icons');
        if (icon) {
          await this.drawIcon(ctx, canvas, icon);
        }
      }

      // Dibujar elementos decorativos
      for (const decorativeFilename of mapping.elements.decorative) {
        const decorative = await visualElementsService.getVisualElement(decorativeFilename, 'decorative');
        if (decorative) {
          await this.drawDecorativeElement(ctx, canvas, decorative);
        }
      }

    } else {
      // Fallback sin elementos visuales
      await this.drawSimpleInfographic(ctx, canvas, data);
    }

    // Agregar watermark si se solicita
    if (options.includeWatermark) {
      this.drawWatermark(ctx, canvas);
    }

    return canvas.toDataURL(`image/${options.format}`, options.quality === 'high' ? 0.9 : options.quality === 'medium' ? 0.7 : 0.5);
  }

  /**
   * Dibuja el fondo usando elementos visuales
   */
  private async drawBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, background: any): Promise<void> {
    // Crear gradiente profesional basado en los colores del elemento visual
    const colors = background.metadata?.colors || ['#FFD700', '#8B4513', '#228B22'];
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    
    colors.forEach((color: string, index: number) => {
      gradient.addColorStop(index / (colors.length - 1), color);
    });

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Agregar patrón de panal sutil
    ctx.globalAlpha = 0.15;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    const hexSize = 40;
    for (let x = 0; x < canvas.width + hexSize; x += hexSize * 1.5) {
      for (let y = 0; y < canvas.height + hexSize; y += hexSize * Math.sqrt(3)) {
        this.drawHexagon(ctx, x, y, hexSize);
      }
    }
    
    // Agregar elementos decorativos
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    
    // Círculos decorativos
    ctx.beginPath();
    ctx.arc(100, 200, 80, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(canvas.width - 100, canvas.height - 200, 120, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 200, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.globalAlpha = 1;
  }

  /**
   * Dibuja el header de la infografía
   */
  private async drawHeader(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, mapping: any): Promise<void> {
    const headerHeight = 250;
    
    // Fondo del header con gradiente más profesional
    const headerGradient = ctx.createLinearGradient(0, 0, 0, headerHeight);
    headerGradient.addColorStop(0, 'rgba(0,0,0,0.4)');
    headerGradient.addColorStop(0.5, 'rgba(0,0,0,0.2)');
    headerGradient.addColorStop(1, 'rgba(0,0,0,0.1)');
    
    ctx.fillStyle = headerGradient;
    ctx.fillRect(0, 0, canvas.width, headerHeight);

    // Agregar patrón sutil al header
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#FFFFFF';
    for (let i = 0; i < canvas.width; i += 20) {
      for (let j = 0; j < headerHeight; j += 20) {
        if ((i + j) % 40 === 0) {
          ctx.fillRect(i, j, 2, 2);
        }
      }
    }
    ctx.globalAlpha = 1;

    // Título principal con mejor tipografía
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 52px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Dividir título en líneas si es muy largo
    const words = data.title.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > canvas.width - 100 && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    
    // Dibujar líneas del título
    const startY = 80;
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + index * 60);
    });
    
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Subtítulo mejorado
    if (data.subtitle) {
      ctx.font = '28px Inter, Arial, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 8;
      ctx.fillText(data.subtitle, canvas.width / 2, startY + lines.length * 60 + 40);
      ctx.shadowBlur = 0;
    }

    // Línea decorativa mejorada
    const lineWidth = 120;
    const lineX = (canvas.width - lineWidth) / 2;
    const lineY = startY + lines.length * 60 + 80;
    
    // Gradiente para la línea
    const lineGradient = ctx.createLinearGradient(lineX, lineY, lineX + lineWidth, lineY);
    lineGradient.addColorStop(0, 'transparent');
    lineGradient.addColorStop(0.5, '#F59E0B');
    lineGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = lineGradient;
    ctx.fillRect(lineX, lineY, lineWidth, 6);
    
    // Agregar icono decorativo
    ctx.font = '48px Arial';
    ctx.fillStyle = '#F59E0B';
    ctx.fillText('🐝', canvas.width - 80, 60);
  }

  /**
   * Dibuja el contenido principal
   */
  private async drawMainContent(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, mapping: any): Promise<void> {
    let yPosition = 250;
    const sectionSpacing = 40;

    // Dibujar secciones
    data.sections?.forEach((section, index) => {
      yPosition = this.drawSection(ctx, canvas, section, yPosition, mapping);
      yPosition += sectionSpacing;
    });
  }

  /**
   * Dibuja una sección específica
   */
  private drawSection(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, section: any, yPosition: number, mapping: any): number {
    const sectionWidth = canvas.width - 80;
    const sectionX = 40;
    const sectionHeight = 280;

    // Fondo de la sección con gradiente sutil
    const sectionGradient = ctx.createLinearGradient(sectionX, yPosition, sectionX, yPosition + sectionHeight);
    sectionGradient.addColorStop(0, 'rgba(255,255,255,0.98)');
    sectionGradient.addColorStop(1, 'rgba(248,250,252,0.95)');
    
    ctx.fillStyle = sectionGradient;
    ctx.fillRect(sectionX, yPosition, sectionWidth, sectionHeight);
    
    // Borde sutil
    ctx.strokeStyle = 'rgba(0,0,0,0.1)';
    ctx.lineWidth = 1;
    ctx.strokeRect(sectionX, yPosition, sectionWidth, sectionHeight);
    
    // Sombra mejorada
    ctx.shadowColor = 'rgba(0,0,0,0.15)';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 8;
    ctx.fillRect(sectionX, yPosition, sectionWidth, sectionHeight);
    ctx.shadowBlur = 0;

    // Título de la sección con mejor diseño
    ctx.fillStyle = '#1E40AF';
    ctx.font = 'bold 32px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 3;
    ctx.fillText(section.title, sectionX + 30, yPosition + 50);
    ctx.shadowBlur = 0;

    // Línea decorativa mejorada
    const lineWidth = 80;
    const lineX = sectionX + 30;
    const lineY = yPosition + 60;
    
    const lineGradient = ctx.createLinearGradient(lineX, lineY, lineX + lineWidth, lineY);
    lineGradient.addColorStop(0, '#F59E0B');
    lineGradient.addColorStop(0.5, '#FFD700');
    lineGradient.addColorStop(1, '#F59E0B');
    
    ctx.fillStyle = lineGradient;
    ctx.fillRect(lineX, lineY, lineWidth, 4);
    
    // Agregar icono a la sección
    ctx.font = '24px Arial';
    ctx.fillStyle = '#F59E0B';
    ctx.fillText('📊', sectionX + sectionWidth - 50, yPosition + 50);

    // Contenido de la sección
    let contentY = yPosition + 90;
    
    switch (section.type) {
      case 'stats':
        contentY = this.drawStatsContent(ctx, section, sectionX + 30, contentY);
        break;
      case 'list':
        contentY = this.drawListContent(ctx, section, sectionX + 30, contentY);
        break;
      case 'text':
        contentY = this.drawTextContent(ctx, section, sectionX + 30, contentY);
        break;
      default:
        contentY = this.drawGenericContent(ctx, section, sectionX + 30, contentY);
    }

    return contentY + 30;
  }

  /**
   * Dibuja contenido de estadísticas
   */
  private drawStatsContent(ctx: CanvasRenderingContext2D, section: any, x: number, y: number): number {
    const stats = section.content?.stats?.items || [];
    const statsPerRow = 2;
    const statWidth = 240;
    const statHeight = 100;

    stats.forEach((stat: any, index: number) => {
      const col = index % statsPerRow;
      const row = Math.floor(index / statsPerRow);
      const statX = x + col * (statWidth + 30);
      const statY = y + row * (statHeight + 25);

      // Fondo de la tarjeta con gradiente
      const cardGradient = ctx.createLinearGradient(statX, statY, statX, statY + statHeight);
      cardGradient.addColorStop(0, '#FFFFFF');
      cardGradient.addColorStop(1, '#F8FAFC');
      
      ctx.fillStyle = cardGradient;
      ctx.fillRect(statX, statY, statWidth, statHeight);

      // Sombra de la tarjeta
      ctx.shadowColor = 'rgba(0,0,0,0.1)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
      ctx.fillRect(statX, statY, statWidth, statHeight);
      ctx.shadowBlur = 0;

      // Borde con gradiente
      ctx.strokeStyle = '#E2E8F0';
      ctx.lineWidth = 2;
      ctx.strokeRect(statX, statY, statWidth, statHeight);

      // Icono decorativo
      ctx.font = '24px Arial';
      ctx.fillStyle = '#F59E0B';
      ctx.textAlign = 'center';
      ctx.fillText('📈', statX + statWidth / 2, statY + 30);

      // Valor con mejor tipografía
      ctx.fillStyle = '#1E40AF';
      ctx.font = 'bold 36px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.1)';
      ctx.shadowBlur = 2;
      ctx.fillText(`${stat.value}${stat.unit}`, statX + statWidth / 2, statY + 60);
      ctx.shadowBlur = 0;

      // Etiqueta mejorada
      ctx.fillStyle = '#64748B';
      ctx.font = 'bold 18px Inter, Arial, sans-serif';
      ctx.fillText(stat.label, statX + statWidth / 2, statY + 85);
    });

    return y + Math.ceil(stats.length / statsPerRow) * (statHeight + 25);
  }

  /**
   * Dibuja contenido de lista
   */
  private drawListContent(ctx: CanvasRenderingContext2D, section: any, x: number, y: number): number {
    const items = section.content?.list?.items || [];

    items.forEach((item: any, index: number) => {
      const itemY = y + index * 35;

      // Bullet point
      ctx.fillStyle = '#1E40AF';
      ctx.beginPath();
      ctx.arc(x + 10, itemY - 5, 6, 0, 2 * Math.PI);
      ctx.fill();

      // Texto
      ctx.fillStyle = '#374151';
      ctx.font = '18px Inter, Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.text, x + 30, itemY);
    });

    return y + items.length * 35;
  }

  /**
   * Dibuja contenido de texto
   */
  private drawTextContent(ctx: CanvasRenderingContext2D, section: any, x: number, y: number): number {
    const text = section.content?.text?.content || '';
    
    ctx.fillStyle = '#4B5563';
    ctx.font = '18px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    
    // Dividir texto en líneas
    const words = text.split(' ');
    let line = '';
    let lineY = y;
    const maxWidth = 800;

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

    return lineY + 20;
  }

  /**
   * Dibuja contenido genérico
   */
  private drawGenericContent(ctx: CanvasRenderingContext2D, section: any, x: number, y: number): number {
    ctx.fillStyle = '#6B7280';
    ctx.font = '16px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Contenido de la sección ${section.type}`, x, y);
    return y + 30;
  }

  /**
   * Dibuja la ilustración principal
   */
  private async drawMainIllustration(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, illustration: any): Promise<void> {
    // Posicionar la ilustración en la esquina superior derecha
    const illustrationSize = 200;
    const x = canvas.width - illustrationSize - 40;
    const y = 40;

    // Fondo para la ilustración
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillRect(x - 10, y - 10, illustrationSize + 20, illustrationSize + 20);

    // Simular la ilustración con un ícono
    ctx.fillStyle = '#F59E0B';
    ctx.font = `${illustrationSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('🎨', x + illustrationSize / 2, y + illustrationSize / 2 + 50);
  }

  /**
   * Dibuja iconos
   */
  private async drawIcon(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, icon: any): Promise<void> {
    // Posicionar iconos en diferentes lugares
    const iconSize = 40;
    const positions = [
      { x: 60, y: canvas.height - 100 },
      { x: 120, y: canvas.height - 100 },
      { x: 180, y: canvas.height - 100 }
    ];

    const positionIndex = Math.floor(Math.random() * positions.length);
    const pos = positions[positionIndex];

    // Fondo del icono
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(pos.x + iconSize / 2, pos.y + iconSize / 2, iconSize / 2 + 5, 0, 2 * Math.PI);
    ctx.fill();

    // Icono
    ctx.fillStyle = '#1E40AF';
    ctx.font = `${iconSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('🔧', pos.x + iconSize / 2, pos.y + iconSize / 2 + 15);
  }

  /**
   * Dibuja elementos decorativos
   */
  private async drawDecorativeElement(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, decorative: any): Promise<void> {
    // Dibujar patrón decorativo
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = '#F59E0B';
    
    for (let i = 0; i < canvas.width; i += 30) {
      for (let j = 0; j < canvas.height; j += 30) {
        if ((i + j) % 60 === 0) {
          ctx.beginPath();
          ctx.arc(i, j, 3, 0, 2 * Math.PI);
          ctx.fill();
        }
      }
    }
    
    ctx.globalAlpha = 1;
  }

  /**
   * Dibuja infografía simple sin elementos visuales
   */
  private async drawSimpleInfographic(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData): Promise<void> {
    // Fondo simple
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#3B82F6');
    gradient.addColorStop(1, '#1E40AF');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Título
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(data.title, canvas.width / 2, canvas.height / 2 - 50);

    // Subtítulo
    if (data.subtitle) {
      ctx.font = '24px Arial, sans-serif';
      ctx.fillText(data.subtitle, canvas.width / 2, canvas.height / 2 + 20);
    }
  }

  /**
   * Dibuja watermark
   */
  private drawWatermark(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.font = '16px Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('MarketPro GT', canvas.width - 20, canvas.height - 20);
  }

  /**
   * Genera infografía simple
   */
  private async generateSimpleInfographic(data: InfographicData, options: VisualInfographicOptions): Promise<string> {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto del canvas');
    }

    canvas.width = options.width;
    canvas.height = options.height;

    await this.drawSimpleInfographic(ctx, canvas, data);

    if (options.includeWatermark) {
      this.drawWatermark(ctx, canvas);
    }

    return canvas.toDataURL(`image/${options.format}`, options.quality === 'high' ? 0.9 : options.quality === 'medium' ? 0.7 : 0.5);
  }

  /**
   * Extrae el ID del curso desde el título
   */
  private extractCourseId(title: string): string {
    const name = title.toLowerCase();
    
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
   * Dibuja un hexágono
   */
  private drawHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
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
  }
}

export const visualInfographicGenerator = VisualInfographicGenerator.getInstance();
