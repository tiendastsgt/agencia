/**
 * Generador Profesional de Infografías
 * 
 * Este generador crea infografías de alta calidad usando Canvas
 * con elementos visuales profesionales y diseño temático.
 */

import { InfographicData } from './types/infographic';

export interface ProfessionalInfographicOptions {
  width: number;
  height: number;
  format: 'png' | 'jpg' | 'svg';
  quality: 'low' | 'medium' | 'high';
  includeWatermark: boolean;
}

export class ProfessionalInfographicGenerator {
  private static instance: ProfessionalInfographicGenerator;

  public static getInstance(): ProfessionalInfographicGenerator {
    if (!ProfessionalInfographicGenerator.instance) {
      ProfessionalInfographicGenerator.instance = new ProfessionalInfographicGenerator();
    }
    return ProfessionalInfographicGenerator.instance;
  }

  /**
   * Genera una infografía profesional
   */
  async generateProfessionalInfographic(
    data: InfographicData,
    options: ProfessionalInfographicOptions = {
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
      
      // Dibujar fondo temático
      this.drawThematicBackground(ctx, canvas, theme);
      
      // Dibujar header profesional
      this.drawProfessionalHeader(ctx, canvas, data, theme);
      
      // Dibujar contenido principal
      this.drawMainContent(ctx, canvas, data, theme);
      
      // Agregar elementos decorativos
      this.drawDecorativeElements(ctx, canvas, theme);
      
      // Agregar watermark si se solicita
      if (options.includeWatermark) {
        this.drawWatermark(ctx, canvas);
      }

      return canvas.toDataURL(`image/${options.format}`, options.quality === 'high' ? 0.9 : options.quality === 'medium' ? 0.7 : 0.5);
    } catch (error) {
      console.error('Error generando infografía profesional:', error);
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
        primaryColor: '#FFD700',
        secondaryColor: '#8B4513',
        accentColor: '#228B22',
        backgroundColor: '#FFF8DC',
        textColor: '#2F4F4F',
        icon: '🐝',
        pattern: 'honeycomb'
      };
    }
    
    if (name.includes('cocina')) {
      return {
        name: 'cocina',
        primaryColor: '#FF6347',
        secondaryColor: '#8B4513',
        accentColor: '#FFD700',
        backgroundColor: '#FFF5EE',
        textColor: '#8B4513',
        icon: '🍳',
        pattern: 'kitchen'
      };
    }
    
    if (name.includes('matemática') || name.includes('matematica')) {
      return {
        name: 'matematica',
        primaryColor: '#4169E1',
        secondaryColor: '#1E90FF',
        accentColor: '#FFD700',
        backgroundColor: '#F0F8FF',
        textColor: '#191970',
        icon: '📐',
        pattern: 'geometric'
      };
    }
    
    if (name.includes('ia') || name.includes('inteligencia artificial')) {
      return {
        name: 'ia',
        primaryColor: '#9370DB',
        secondaryColor: '#4B0082',
        accentColor: '#00CED1',
        backgroundColor: '#F8F8FF',
        textColor: '#4B0082',
        icon: '🤖',
        pattern: 'circuit'
      };
    }
    
    // Tema por defecto
    return {
      name: 'default',
      primaryColor: '#3B82F6',
      secondaryColor: '#1E40AF',
      accentColor: '#F59E0B',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      icon: '📊',
      pattern: 'modern'
    };
  }

  /**
   * Dibuja el fondo temático
   */
  private drawThematicBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, theme: any): void {
    // Gradiente principal
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, theme.primaryColor);
    gradient.addColorStop(0.5, theme.secondaryColor);
    gradient.addColorStop(1, theme.accentColor);
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Patrón temático
    this.drawThematicPattern(ctx, canvas, theme);
    
    // Elementos decorativos de fondo
    this.drawBackgroundDecorations(ctx, canvas, theme);
  }

  /**
   * Dibuja patrón temático
   */
  private drawThematicPattern(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, theme: any): void {
    ctx.globalAlpha = 0.1;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    
    switch (theme.pattern) {
      case 'honeycomb':
        this.drawHoneycombPattern(ctx, canvas);
        break;
      case 'geometric':
        this.drawGeometricPattern(ctx, canvas);
        break;
      case 'circuit':
        this.drawCircuitPattern(ctx, canvas);
        break;
      default:
        this.drawModernPattern(ctx, canvas);
    }
    
    ctx.globalAlpha = 1;
  }

  /**
   * Dibuja patrón de panal
   */
  private drawHoneycombPattern(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    const hexSize = 30;
    for (let x = 0; x < canvas.width + hexSize; x += hexSize * 1.5) {
      for (let y = 0; y < canvas.height + hexSize; y += hexSize * Math.sqrt(3)) {
        this.drawHexagon(ctx, x, y, hexSize);
      }
    }
  }

  /**
   * Dibuja patrón geométrico
   */
  private drawGeometricPattern(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    for (let x = 0; x < canvas.width; x += 60) {
      for (let y = 0; y < canvas.height; y += 60) {
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 30, y + 30);
        ctx.lineTo(x, y + 60);
        ctx.closePath();
        ctx.stroke();
      }
    }
  }

  /**
   * Dibuja patrón de circuitos
   */
  private drawCircuitPattern(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }
  }

  /**
   * Dibuja patrón moderno
   */
  private drawModernPattern(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement): void {
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 20 + 5;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }

  /**
   * Dibuja decoraciones de fondo
   */
  private drawBackgroundDecorations(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, theme: any): void {
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    
    // Círculos decorativos
    ctx.beginPath();
    ctx.arc(100, 200, 80, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(canvas.width - 100, canvas.height - 200, 120, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(canvas.width / 2, canvas.height / 2, 150, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.globalAlpha = 1;
  }

  /**
   * Dibuja header profesional
   */
  private drawProfessionalHeader(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, theme: any): void {
    const headerHeight = 300;
    
    // Fondo del header con gradiente
    const headerGradient = ctx.createLinearGradient(0, 0, 0, headerHeight);
    headerGradient.addColorStop(0, 'rgba(0,0,0,0.4)');
    headerGradient.addColorStop(0.5, 'rgba(0,0,0,0.2)');
    headerGradient.addColorStop(1, 'rgba(0,0,0,0.1)');
    
    ctx.fillStyle = headerGradient;
    ctx.fillRect(0, 0, canvas.width, headerHeight);

    // Título principal con mejor tipografía
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 56px Inter, Arial, sans-serif';
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
      if (metrics.width > canvas.width - 100 && currentLine) {
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
      ctx.fillText(line, canvas.width / 2, startY + index * 70);
    });
    
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;

    // Subtítulo mejorado
    if (data.subtitle) {
      ctx.font = '32px Inter, Arial, sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.95)';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 10;
      ctx.fillText(data.subtitle, canvas.width / 2, startY + lines.length * 70 + 50);
      ctx.shadowBlur = 0;
    }

    // Línea decorativa mejorada
    const lineWidth = 150;
    const lineX = (canvas.width - lineWidth) / 2;
    const lineY = startY + lines.length * 70 + 100;
    
    // Gradiente para la línea
    const lineGradient = ctx.createLinearGradient(lineX, lineY, lineX + lineWidth, lineY);
    lineGradient.addColorStop(0, 'transparent');
    lineGradient.addColorStop(0.5, theme.accentColor);
    lineGradient.addColorStop(1, 'transparent');
    
    ctx.fillStyle = lineGradient;
    ctx.fillRect(lineX, lineY, lineWidth, 8);
    
    // Agregar icono temático
    ctx.font = '64px Arial';
    ctx.fillStyle = theme.accentColor;
    ctx.fillText(theme.icon, canvas.width - 100, 80);
  }

  /**
   * Dibuja contenido principal
   */
  private drawMainContent(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, theme: any): void {
    let yPosition = 350;
    const sectionSpacing = 50;

    // Dibujar secciones
    data.sections?.forEach((section, index) => {
      yPosition = this.drawProfessionalSection(ctx, canvas, section, yPosition, theme);
      yPosition += sectionSpacing;
    });
  }

  /**
   * Dibuja una sección profesional
   */
  private drawProfessionalSection(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, section: any, yPosition: number, theme: any): number {
    const sectionWidth = canvas.width - 100;
    const sectionX = 50;
    const sectionHeight = 320;

    // Fondo de la sección con gradiente
    const sectionGradient = ctx.createLinearGradient(sectionX, yPosition, sectionX, yPosition + sectionHeight);
    sectionGradient.addColorStop(0, 'rgba(255,255,255,0.98)');
    sectionGradient.addColorStop(1, 'rgba(248,250,252,0.95)');
    
    ctx.fillStyle = sectionGradient;
    ctx.fillRect(sectionX, yPosition, sectionWidth, sectionHeight);
    
    // Borde con gradiente
    const borderGradient = ctx.createLinearGradient(sectionX, yPosition, sectionX + sectionWidth, yPosition);
    borderGradient.addColorStop(0, theme.primaryColor);
    borderGradient.addColorStop(0.5, theme.accentColor);
    borderGradient.addColorStop(1, theme.primaryColor);
    
    ctx.strokeStyle = borderGradient;
    ctx.lineWidth = 4;
    ctx.strokeRect(sectionX, yPosition, sectionWidth, sectionHeight);
    
    // Sombra mejorada
    ctx.shadowColor = 'rgba(0,0,0,0.2)';
    ctx.shadowBlur = 20;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 10;
    ctx.fillRect(sectionX, yPosition, sectionWidth, sectionHeight);
    ctx.shadowBlur = 0;

    // Título de la sección con mejor diseño
    ctx.fillStyle = theme.primaryColor;
    ctx.font = 'bold 36px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.shadowColor = 'rgba(0,0,0,0.1)';
    ctx.shadowBlur = 3;
    ctx.fillText(section.title, sectionX + 40, yPosition + 60);
    ctx.shadowBlur = 0;

    // Línea decorativa mejorada
    const lineWidth = 100;
    const lineX = sectionX + 40;
    const lineY = yPosition + 75;
    
    const lineGradient = ctx.createLinearGradient(lineX, lineY, lineX + lineWidth, lineY);
    lineGradient.addColorStop(0, theme.accentColor);
    lineGradient.addColorStop(0.5, theme.primaryColor);
    lineGradient.addColorStop(1, theme.accentColor);
    
    ctx.fillStyle = lineGradient;
    ctx.fillRect(lineX, lineY, lineWidth, 5);
    
    // Agregar icono temático a la sección
    ctx.font = '32px Arial';
    ctx.fillStyle = theme.accentColor;
    ctx.fillText(theme.icon, sectionX + sectionWidth - 60, yPosition + 60);

    // Contenido de la sección
    let contentY = yPosition + 110;
    
    switch (section.type) {
      case 'stats':
        contentY = this.drawProfessionalStatsContent(ctx, section, sectionX + 40, contentY, theme);
        break;
      case 'list':
        contentY = this.drawProfessionalListContent(ctx, section, sectionX + 40, contentY, theme);
        break;
      case 'text':
        contentY = this.drawProfessionalTextContent(ctx, section, sectionX + 40, contentY, theme);
        break;
      default:
        contentY = this.drawProfessionalGenericContent(ctx, section, sectionX + 40, contentY, theme);
    }

    return contentY + 40;
  }

  /**
   * Dibuja contenido de estadísticas profesional
   */
  private drawProfessionalStatsContent(ctx: CanvasRenderingContext2D, section: any, x: number, y: number, theme: any): number {
    const stats = section.content?.stats?.items || [];
    const statsPerRow = 2;
    const statWidth = 280;
    const statHeight = 120;

    stats.forEach((stat: any, index: number) => {
      const col = index % statsPerRow;
      const row = Math.floor(index / statsPerRow);
      const statX = x + col * (statWidth + 40);
      const statY = y + row * (statHeight + 30);

      // Fondo de la tarjeta con gradiente
      const cardGradient = ctx.createLinearGradient(statX, statY, statX, statY + statHeight);
      cardGradient.addColorStop(0, '#FFFFFF');
      cardGradient.addColorStop(1, theme.backgroundColor);
      
      ctx.fillStyle = cardGradient;
      ctx.fillRect(statX, statY, statWidth, statHeight);

      // Sombra de la tarjeta
      ctx.shadowColor = 'rgba(0,0,0,0.15)';
      ctx.shadowBlur = 12;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 6;
      ctx.fillRect(statX, statY, statWidth, statHeight);
      ctx.shadowBlur = 0;

      // Borde con gradiente
      ctx.strokeStyle = theme.primaryColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(statX, statY, statWidth, statHeight);

      // Icono decorativo
      ctx.font = '32px Arial';
      ctx.fillStyle = theme.accentColor;
      ctx.textAlign = 'center';
      ctx.fillText('📊', statX + statWidth / 2, statY + 40);

      // Valor con mejor tipografía
      ctx.fillStyle = theme.primaryColor;
      ctx.font = 'bold 42px Inter, Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.1)';
      ctx.shadowBlur = 2;
      ctx.fillText(`${stat.value}${stat.unit}`, statX + statWidth / 2, statY + 80);
      ctx.shadowBlur = 0;

      // Etiqueta mejorada
      ctx.fillStyle = theme.textColor;
      ctx.font = 'bold 20px Inter, Arial, sans-serif';
      ctx.fillText(stat.label, statX + statWidth / 2, statY + 105);
    });

    return y + Math.ceil(stats.length / statsPerRow) * (statHeight + 30);
  }

  /**
   * Dibuja contenido de lista profesional
   */
  private drawProfessionalListContent(ctx: CanvasRenderingContext2D, section: any, x: number, y: number, theme: any): number {
    const items = section.content?.list?.items || [];

    items.forEach((item: any, index: number) => {
      const itemY = y + index * 45;

      // Bullet point temático
      ctx.fillStyle = theme.primaryColor;
      ctx.beginPath();
      ctx.arc(x + 15, itemY - 5, 8, 0, 2 * Math.PI);
      ctx.fill();

      // Texto
      ctx.fillStyle = theme.textColor;
      ctx.font = '22px Inter, Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.text, x + 35, itemY);
    });

    return y + items.length * 45;
  }

  /**
   * Dibuja contenido de texto profesional
   */
  private drawProfessionalTextContent(ctx: CanvasRenderingContext2D, section: any, x: number, y: number, theme: any): number {
    const text = section.content?.text?.content || '';
    
    ctx.fillStyle = theme.textColor;
    ctx.font = '22px Inter, Arial, sans-serif';
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
        lineY += 30;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, lineY);

    return lineY + 30;
  }

  /**
   * Dibuja contenido genérico profesional
   */
  private drawProfessionalGenericContent(ctx: CanvasRenderingContext2D, section: any, x: number, y: number, theme: any): number {
    ctx.fillStyle = theme.textColor;
    ctx.font = '20px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Contenido de la sección ${section.type}`, x, y);
    return y + 40;
  }

  /**
   * Dibuja elementos decorativos
   */
  private drawDecorativeElements(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, theme: any): void {
    // Elementos decorativos en las esquinas
    ctx.globalAlpha = 0.1;
    ctx.fillStyle = theme.accentColor;
    
    // Esquina superior izquierda
    ctx.beginPath();
    ctx.arc(50, 50, 30, 0, 2 * Math.PI);
    ctx.fill();
    
    // Esquina inferior derecha
    ctx.beginPath();
    ctx.arc(canvas.width - 50, canvas.height - 50, 40, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.globalAlpha = 1;
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

export const professionalInfographicGenerator = ProfessionalInfographicGenerator.getInstance();




