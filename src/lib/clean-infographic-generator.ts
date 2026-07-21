/**
 * Generador de Infografías Limpias y Profesionales
 * 
 * Este generador crea infografías profesionales sin elementos de IA
 * que causan problemas de legibilidad y diseño.
 */

import { InfographicData } from './types/infographic';

export interface CleanInfographicOptions {
  width: number;
  height: number;
  format: 'png' | 'jpg';
  quality: 'low' | 'medium' | 'high';
  includeWatermark: boolean;
}

export class CleanInfographicGenerator {
  private static instance: CleanInfographicGenerator;

  public static getInstance(): CleanInfographicGenerator {
    if (!CleanInfographicGenerator.instance) {
      CleanInfographicGenerator.instance = new CleanInfographicGenerator();
    }
    return CleanInfographicGenerator.instance;
  }

  /**
   * Genera una infografía limpia y profesional
   */
  async generateCleanInfographic(
    data: InfographicData,
    options: CleanInfographicOptions = {
      width: 1200,
      height: 1600,
      format: 'png',
      quality: 'high',
      includeWatermark: false
    }
  ): Promise<string> {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('No se pudo obtener el contexto del canvas');
      }

      canvas.width = options.width;
      canvas.height = options.height;

      // Determinar tema basado en el título
      const theme = this.determineTheme(data.title);
      
      // Dibujar fondo limpio y profesional
      this.drawCleanBackground(ctx, canvas, theme);
      
      // Dibujar header profesional
      this.drawCleanHeader(ctx, canvas, data, theme);
      
      // Dibujar contenido principal
      this.drawCleanContent(ctx, canvas, data, theme);
      
      // Agregar watermark si se solicita
      if (options.includeWatermark) {
        this.drawWatermark(ctx, canvas);
      }

      return canvas.toDataURL(`image/${options.format}`, options.quality === 'high' ? 0.9 : options.quality === 'medium' ? 0.7 : 0.5);
    } catch (error) {
      console.error('Error generando infografía limpia:', error);
      throw error;
    }
  }

  /**
   * Determina el tema basado en el título del curso
   */
  private determineTheme(title: string): any {
    const name = title.toLowerCase();
    
    if (name.includes('apicultura')) {
      return {
        name: 'apicultura',
        primaryColor: '#D97706', // Naranja dorado
        secondaryColor: '#92400E', // Marrón oscuro
        accentColor: '#F59E0B', // Amarillo dorado
        backgroundColor: '#FEF3C7', // Amarillo muy claro
        textColor: '#1F2937', // Gris muy oscuro
        lightTextColor: '#FFFFFF', // Blanco
        cardBackground: '#FFFFFF', // Blanco puro
        borderColor: '#D97706' // Naranja dorado
      };
    }
    
    if (name.includes('cocina')) {
      return {
        name: 'cocina',
        primaryColor: '#DC2626', // Rojo
        secondaryColor: '#991B1B', // Rojo oscuro
        accentColor: '#F59E0B', // Amarillo
        backgroundColor: '#FEF2F2', // Rojo muy claro
        textColor: '#1F2937',
        lightTextColor: '#FFFFFF',
        cardBackground: '#FFFFFF',
        borderColor: '#DC2626'
      };
    }
    
    if (name.includes('matemática') || name.includes('matematica')) {
      return {
        name: 'matematica',
        primaryColor: '#2563EB', // Azul
        secondaryColor: '#1D4ED8', // Azul oscuro
        accentColor: '#3B82F6', // Azul claro
        backgroundColor: '#EFF6FF', // Azul muy claro
        textColor: '#1F2937',
        lightTextColor: '#FFFFFF',
        cardBackground: '#FFFFFF',
        borderColor: '#2563EB'
      };
    }
    
    if (name.includes('ia') || name.includes('inteligencia artificial')) {
      return {
        name: 'ia',
        primaryColor: '#7C3AED', // Púrpura
        secondaryColor: '#5B21B6', // Púrpura oscuro
        accentColor: '#8B5CF6', // Púrpura claro
        backgroundColor: '#F3E8FF', // Púrpura muy claro
        textColor: '#1F2937',
        lightTextColor: '#FFFFFF',
        cardBackground: '#FFFFFF',
        borderColor: '#7C3AED'
      };
    }
    
    // Tema por defecto
    return {
      name: 'default',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      accentColor: '#60A5FA',
      backgroundColor: '#F0F9FF',
      textColor: '#1F2937',
      lightTextColor: '#FFFFFF',
      cardBackground: '#FFFFFF',
      borderColor: '#3B82F6'
    };
  }

  /**
   * Dibuja un fondo limpio y profesional
   */
  private drawCleanBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, theme: any): void {
    // Fondo principal con gradiente sutil
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, theme.backgroundColor);
    gradient.addColorStop(0.5, '#FFFFFF');
    gradient.addColorStop(1, theme.backgroundColor);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Patrón sutil de fondo
    this.drawSubtlePattern(ctx, canvas, theme);
  }

  /**
   * Dibuja un patrón sutil
   */
  private drawSubtlePattern(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, theme: any): void {
    ctx.globalAlpha = 0.03;
    ctx.strokeStyle = theme.primaryColor;
    ctx.lineWidth = 1;
    
    // Líneas diagonales sutiles
    for (let i = -canvas.height; i < canvas.width + canvas.height; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + canvas.height, canvas.height);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
  }

  /**
   * Dibuja el header limpio y profesional
   */
  private drawCleanHeader(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, theme: any): void {
    const headerHeight = 280;
    
    // Fondo del header con gradiente
    const headerGradient = ctx.createLinearGradient(0, 0, 0, headerHeight);
    headerGradient.addColorStop(0, theme.primaryColor);
    headerGradient.addColorStop(0.5, theme.secondaryColor);
    headerGradient.addColorStop(1, theme.primaryColor);
    
    ctx.fillStyle = headerGradient;
    ctx.fillRect(0, 0, canvas.width, headerHeight);

    // Título principal con mejor tipografía
    ctx.fillStyle = theme.lightTextColor;
    ctx.font = 'bold 52px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.3)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Dividir título en líneas si es muy largo
    const words = data.title.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > canvas.width - 120 && currentLine) {
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
      ctx.fillText(line, canvas.width / 2, startY + index * 65);
    });
    
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Subtítulo mejorado
    if (data.subtitle) {
      ctx.font = '28px Inter, Arial, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 4;
      ctx.fillText(data.subtitle, canvas.width / 2, startY + lines.length * 65 + 50);
      ctx.shadowBlur = 0;
    }

    // Línea decorativa mejorada
    const lineWidth = 120;
    const lineX = (canvas.width - lineWidth) / 2;
    const lineY = startY + lines.length * 65 + 100;
    
    // Gradiente para la línea
    const lineGradient = ctx.createLinearGradient(lineX, lineY, lineX + lineWidth, lineY);
    lineGradient.addColorStop(0, 'transparent');
    lineGradient.addColorStop(0.5, theme.accentColor);
    lineGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = lineGradient;
    ctx.fillRect(lineX, lineY, lineWidth, 6);
    
    // Icono temático simple
    this.drawThemeIcon(ctx, canvas, theme, canvas.width - 80, 60);
  }

  /**
   * Dibuja un icono temático simple
   */
  private drawThemeIcon(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, theme: any, x: number, y: number): void {
    const size = 60;
    
    // Fondo del icono
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.beginPath();
    ctx.arc(x, y, size / 2, 0, 2 * Math.PI);
    ctx.fill();
    
    // Borde del icono
    ctx.strokeStyle = theme.accentColor;
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Icono temático simple
    ctx.fillStyle = theme.accentColor;
    ctx.font = '32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.getThemeIcon(theme.name), x, y + 10);
  }

  /**
   * Obtiene el icono temático
   */
  private getThemeIcon(themeName: string): string {
    switch (themeName) {
      case 'apicultura': return '🐝';
      case 'cocina': return '🍳';
      case 'matematica': return '📐';
      case 'ia': return '🤖';
      default: return '📊';
    }
  }

  /**
   * Dibuja el contenido principal
   */
  private drawCleanContent(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, theme: any): void {
    let yPosition = 320;
    const sectionSpacing = 60;

    // Dibujar secciones
    data.sections?.forEach((section, index) => {
      yPosition = this.drawCleanSection(ctx, canvas, section, yPosition, theme);
      yPosition += sectionSpacing;
    });
  }

  /**
   * Dibuja una sección limpia y profesional
   */
  private drawCleanSection(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, section: any, yPosition: number, theme: any): number {
    const sectionWidth = canvas.width - 80;
    const sectionX = 40;
    const sectionHeight = 280;

    // Fondo de la sección con sombra
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 5;
    
    ctx.fillStyle = theme.cardBackground;
    ctx.fillRect(sectionX, yPosition, sectionWidth, sectionHeight);
    
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    
    // Borde con gradiente
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(sectionX, yPosition, sectionWidth, sectionHeight);

    // Título de la sección
    ctx.fillStyle = theme.primaryColor;
    ctx.font = 'bold 32px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(section.title, sectionX + 30, yPosition + 50);

    // Línea decorativa
    const lineWidth = 80;
    const lineX = sectionX + 30;
    const lineY = yPosition + 65;
    
    ctx.fillStyle = theme.accentColor;
    ctx.fillRect(lineX, lineY, lineWidth, 4);
    
    // Icono temático a la derecha
    this.drawThemeIcon(ctx, canvas, theme, sectionX + sectionWidth - 50, yPosition + 30);

    // Contenido de la sección
    let contentY = yPosition + 100;
    
    switch (section.type) {
      case 'stats':
        contentY = this.drawCleanStatsContent(ctx, section, sectionX + 30, contentY, theme);
        break;
      case 'list':
        contentY = this.drawCleanListContent(ctx, section, sectionX + 30, contentY, theme);
        break;
      case 'text':
        contentY = this.drawCleanTextContent(ctx, section, sectionX + 30, contentY, theme);
        break;
      default:
        contentY = this.drawCleanGenericContent(ctx, section, sectionX + 30, contentY, theme);
    }

    return contentY + 40;
  }

  /**
   * Dibuja contenido de estadísticas limpio
   */
  private drawCleanStatsContent(ctx: CanvasRenderingContext2D, section: any, x: number, y: number, theme: any): number {
    const stats = section.content?.stats?.items || [];
    const statsPerRow = 2;
    const statWidth = 280;
    const statHeight = 120;

    stats.forEach((stat: any, index: number) => {
      const col = index % statsPerRow;
      const row = Math.floor(index / statsPerRow);
      const statX = x + col * (statWidth + 40);
      const statY = y + row * (statHeight + 30);

      // Fondo de la tarjeta con sombra
      ctx.shadowColor = 'rgba(0,0,0,0.08)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 4;
      
      ctx.fillStyle = theme.cardBackground;
      ctx.fillRect(statX, statY, statWidth, statHeight);
      
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Borde
      ctx.strokeStyle = theme.borderColor;
      ctx.lineWidth = 2;
      ctx.strokeRect(statX, statY, statWidth, statHeight);

      // Icono decorativo
      ctx.fillStyle = theme.accentColor;
      ctx.font = '28px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('📊', statX + statWidth / 2, statY + 35);

      // Valor
      ctx.fillStyle = theme.primaryColor;
      ctx.font = 'bold 36px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`${stat.value}${stat.unit}`, statX + statWidth / 2, statY + 75);

      // Etiqueta
      ctx.fillStyle = theme.textColor;
      ctx.font = 'bold 18px Inter, Arial, sans-serif';
      ctx.fillText(stat.label, statX + statWidth / 2, statY + 100);
    });

    return y + Math.ceil(stats.length / statsPerRow) * (statHeight + 30);
  }

  /**
   * Dibuja contenido de lista limpio
   */
  private drawCleanListContent(ctx: CanvasRenderingContext2D, section: any, x: number, y: number, theme: any): number {
    const items = section.content?.list?.items || [];

    items.forEach((item: any, index: number) => {
      const itemY = y + index * 40;

      // Bullet point temático
      ctx.fillStyle = theme.primaryColor;
      ctx.beginPath();
      ctx.arc(x + 15, itemY - 5, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Texto
      ctx.fillStyle = theme.textColor;
      ctx.font = '20px Inter, Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.text, x + 35, itemY);
    });

    return y + items.length * 40;
  }

  /**
   * Dibuja contenido de texto limpio
   */
  private drawCleanTextContent(ctx: CanvasRenderingContext2D, section: any, x: number, y: number, theme: any): number {
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
   * Dibuja contenido genérico limpio
   */
  private drawCleanGenericContent(ctx: CanvasRenderingContext2D, section: any, x: number, y: number, theme: any): number {
    ctx.fillStyle = theme.textColor;
    ctx.font = '18px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Contenido de la sección ${section.type}`, x, y);
    return y + 30;
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
}

export const cleanInfographicGenerator = CleanInfographicGenerator.getInstance();




