/**
 * Generador de Infografías con Estructura Profesional
 * 
 * Replica la estructura exacta del ejemplo proporcionado
 * con tipografía, tamaños y layout profesionales.
 */

import { InfographicData } from './types/infographic';

export interface ProfessionalStructureOptions {
  width: number;
  height: number;
  format: 'png' | 'jpg';
  quality: 'low' | 'medium' | 'high';
  includeWatermark: boolean;
}

export class ProfessionalStructureGenerator {
  private static instance: ProfessionalStructureGenerator;

  public static getInstance(): ProfessionalStructureGenerator {
    if (!ProfessionalStructureGenerator.instance) {
      ProfessionalStructureGenerator.instance = new ProfessionalStructureGenerator();
    }
    return ProfessionalStructureGenerator.instance;
  }

  /**
   * Genera una infografía con estructura profesional
   */
  async generateProfessionalStructure(
    data: InfographicData,
    options: ProfessionalStructureOptions = {
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
      
      // Dibujar fondo limpio
      this.drawCleanBackground(ctx, canvas, theme);
      
      // Dibujar header profesional
      this.drawProfessionalHeader(ctx, canvas, data, theme);
      
      // Dibujar sección de objetivos (2 columnas)
      this.drawObjectivesSection(ctx, canvas, data, theme);
      
      // Dibujar sección de información del curso
      this.drawCourseInfoSection(ctx, canvas, data, theme);
      
      // Dibujar sección de modalidad
      this.drawModalitySection(ctx, canvas, data, theme);
      
      // Dibujar footer
      this.drawFooter(ctx, canvas, theme);
      
      // Agregar watermark si se solicita
      if (options.includeWatermark) {
        this.drawWatermark(ctx, canvas);
      }

      return canvas.toDataURL(`image/${options.format}`, options.quality === 'high' ? 0.9 : options.quality === 'medium' ? 0.7 : 0.5);
    } catch (error) {
      console.error('Error generando estructura profesional:', error);
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
        primaryColor: '#2D5016', // Verde oscuro
        secondaryColor: '#4A7C59', // Verde medio
        accentColor: '#8FBC8F', // Verde claro
        backgroundColor: '#F0F8F0', // Verde muy claro
        textColor: '#1F2937', // Gris oscuro
        lightTextColor: '#FFFFFF', // Blanco
        cardBackground: '#FFFFFF', // Blanco puro
        borderColor: '#4A7C59', // Verde medio
        buttonColor: '#2D5016' // Verde oscuro para botones
      };
    }
    
    if (name.includes('cocina')) {
      return {
        name: 'cocina',
        primaryColor: '#8B4513', // Marrón
        secondaryColor: '#CD853F', // Marrón claro
        accentColor: '#F4A460', // Marrón muy claro
        backgroundColor: '#FFF8F0', // Marrón muy claro
        textColor: '#1F2937',
        lightTextColor: '#FFFFFF',
        cardBackground: '#FFFFFF',
        borderColor: '#CD853F',
        buttonColor: '#8B4513'
      };
    }
    
    if (name.includes('matemática') || name.includes('matematica')) {
      return {
        name: 'matematica',
        primaryColor: '#1E40AF', // Azul oscuro
        secondaryColor: '#3B82F6', // Azul
        accentColor: '#93C5FD', // Azul claro
        backgroundColor: '#EFF6FF', // Azul muy claro
        textColor: '#1F2937',
        lightTextColor: '#FFFFFF',
        cardBackground: '#FFFFFF',
        borderColor: '#3B82F6',
        buttonColor: '#1E40AF'
      };
    }
    
    if (name.includes('ia') || name.includes('inteligencia artificial')) {
      return {
        name: 'ia',
        primaryColor: '#7C2D12', // Rojo oscuro
        secondaryColor: '#DC2626', // Rojo
        accentColor: '#FCA5A5', // Rojo claro
        backgroundColor: '#FEF2F2', // Rojo muy claro
        textColor: '#1F2937',
        lightTextColor: '#FFFFFF',
        cardBackground: '#FFFFFF',
        borderColor: '#DC2626',
        buttonColor: '#7C2D12'
      };
    }
    
    // Tema por defecto
    return {
      name: 'default',
      primaryColor: '#374151',
      secondaryColor: '#6B7280',
      accentColor: '#D1D5DB',
      backgroundColor: '#F9FAFB',
      textColor: '#1F2937',
      lightTextColor: '#FFFFFF',
      cardBackground: '#FFFFFF',
      borderColor: '#6B7280',
      buttonColor: '#374151'
    };
  }

  /**
   * Dibuja fondo limpio
   */
  private drawCleanBackground(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, theme: any): void {
    ctx.fillStyle = theme.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Dibuja header profesional
   */
  private drawProfessionalHeader(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, theme: any): void {
    // Ruta en la esquina superior izquierda
    this.drawRouteBadge(ctx, canvas, theme);
    
    // Título principal
    this.drawMainTitle(ctx, canvas, data, theme);
    
    // Subtítulo
    this.drawSubtitle(ctx, canvas, data, theme);
    
    // Ilustración temática en la esquina superior derecha
    this.drawThemeIllustration(ctx, canvas, theme);
  }

  /**
   * Dibuja badge de ruta
   */
  private drawRouteBadge(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, theme: any): void {
    const badgeX = 40;
    const badgeY = 40;
    const badgeWidth = 200; // Reducido ya que ahora usamos dos líneas
    const badgeHeight = 60;
    
    // Fondo del badge
    ctx.fillStyle = theme.primaryColor;
    ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);
    
    // Icono temático
    ctx.fillStyle = theme.lightTextColor;
    ctx.font = '18px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.getThemeIcon(theme.name), badgeX + 20, badgeY + 25);
    
    // Texto de la ruta - dividido automáticamente en dos líneas
    const routeText = 'Ruta 3: Autosuficiencia del Hogar';
    const lines = this.splitRouteText(routeText);
    
    ctx.font = 'bold 11px Inter, Arial, sans-serif';
    ctx.fillStyle = theme.lightTextColor;
    ctx.textAlign = 'left';
    
    // Primera línea
    ctx.fillText(lines[0], badgeX + 35, badgeY + 20);
    
    // Segunda línea
    ctx.fillText(lines[1], badgeX + 35, badgeY + 35);
  }

  /**
   * Divide el texto de la ruta en dos líneas basándose en los dos puntos
   */
  private splitRouteText(text: string): string[] {
    const colonIndex = text.indexOf(':');
    if (colonIndex !== -1) {
      // Dividir en los dos puntos
      const firstLine = text.substring(0, colonIndex + 1); // Incluye los dos puntos
      const secondLine = text.substring(colonIndex + 2).trim(); // Excluye los dos puntos y el espacio
      return [firstLine, secondLine];
    }
    
    // Si no hay dos puntos, dividir por la mitad
    const words = text.split(' ');
    const midPoint = Math.ceil(words.length / 2);
    const firstLine = words.slice(0, midPoint).join(' ');
    const secondLine = words.slice(midPoint).join(' ');
    return [firstLine, secondLine];
  }

  /**
   * Dibuja título principal
   */
  private drawMainTitle(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, theme: any): void {
    ctx.fillStyle = theme.textColor;
    ctx.font = 'bold 36px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    
    // Dividir título en líneas si es muy largo
    const words = data.title.split(' ');
    const lines = [];
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 600 && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    if (currentLine) lines.push(currentLine);
    
    // Dibujar líneas del título - con más espacio para evitar superposición
    const startX = 40;
    const startY = 140; // Aumentado para dar más espacio después del badge de ruta
    lines.forEach((line, index) => {
      ctx.fillText(line, startX, startY + index * 45);
    });
  }

  /**
   * Dibuja subtítulo
   */
  private drawSubtitle(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, theme: any): void {
    if (data.subtitle) {
      ctx.font = '18px Inter, Arial, sans-serif';
      ctx.fillStyle = theme.secondaryColor;
      ctx.textAlign = 'left';
      ctx.fillText(data.subtitle, 40, 200); // Ajustado para mantener espaciado con el título
    }
  }

  /**
   * Dibuja ilustración temática
   */
  private drawThemeIllustration(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, theme: any): void {
    const illustrationX = canvas.width - 200;
    const illustrationY = 40;
    const illustrationWidth = 150;
    const illustrationHeight = 120;
    
    // Fondo de la ilustración
    ctx.fillStyle = theme.accentColor;
    ctx.fillRect(illustrationX, illustrationY, illustrationWidth, illustrationHeight);
    
    // Borde
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(illustrationX, illustrationY, illustrationWidth, illustrationHeight);
    
    // Icono temático grande
    ctx.fillStyle = theme.primaryColor;
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(this.getThemeIcon(theme.name), illustrationX + illustrationWidth / 2, illustrationY + illustrationHeight / 2 + 15);
  }

  /**
   * Dibuja sección de objetivos (2 columnas)
   */
  private drawObjectivesSection(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, theme: any): void {
    const sectionY = 250; // Ajustado para dar más espacio después del subtítulo
    const sectionHeight = 200;
    const columnWidth = (canvas.width - 120) / 2;
    
    // Columna izquierda - Objetivos
    this.drawObjectivesColumn(ctx, canvas, data, theme, 40, sectionY, columnWidth, sectionHeight);
    
    // Columna derecha - Público Objetivo
    this.drawTargetAudienceColumn(ctx, canvas, data, theme, 40 + columnWidth + 40, sectionY, columnWidth, sectionHeight);
  }

  /**
   * Dibuja columna de objetivos
   */
  private drawObjectivesColumn(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, theme: any, x: number, y: number, width: number, height: number): void {
    // Título de la sección
    ctx.fillStyle = theme.primaryColor;
    ctx.font = 'bold 20px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Objetivos', x, y + 30);
    
    // Icono - posicionado correctamente sin montarse en el texto
    ctx.fillStyle = theme.secondaryColor;
    ctx.font = '20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('📈', x + width - 10, y + 30);
    
    // Lista de objetivos
    const objectives = this.extractObjectives(data);
    objectives.forEach((objective, index) => {
      const itemY = y + 60 + index * 25;
      
      // Bullet point
      ctx.fillStyle = theme.primaryColor;
      ctx.beginPath();
      ctx.arc(x + 10, itemY - 5, 4, 0, 2 * Math.PI);
      ctx.fill();
      
      // Texto
      ctx.fillStyle = theme.textColor;
      ctx.font = '16px Inter, Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(objective, x + 25, itemY);
    });
  }

  /**
   * Dibuja columna de público objetivo
   */
  private drawTargetAudienceColumn(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, theme: any, x: number, y: number, width: number, height: number): void {
    // Título de la sección
    ctx.fillStyle = theme.primaryColor;
    ctx.font = 'bold 20px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Público Objetivo', x, y + 30);
    
    // Icono - posicionado correctamente sin montarse en el texto
    ctx.fillStyle = theme.secondaryColor;
    ctx.font = '20px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('👥', x + width - 10, y + 30);
    
    // Texto del público objetivo
    const targetAudience = this.extractTargetAudience(data);
    ctx.fillStyle = theme.textColor;
    ctx.font = '16px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(targetAudience, x, y + 60);
  }

  /**
   * Dibuja sección de información del curso
   */
  private drawCourseInfoSection(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, theme: any): void {
    const sectionY = 450; // Ajustado para mejor espaciado
    const sectionHeight = 360; // Aumentado para acomodar la nueva tarjeta de nivel
    const columnWidth = (canvas.width - 120) / 2;
    
    // Fondo de la sección
    ctx.fillStyle = theme.accentColor;
    ctx.fillRect(40, sectionY, canvas.width - 80, sectionHeight);
    
    // Columna izquierda
    this.drawCourseInfoLeftColumn(ctx, canvas, data, theme, 60, sectionY + 20, columnWidth - 20, sectionHeight - 40);
    
    // Columna derecha
    this.drawCourseInfoRightColumn(ctx, canvas, data, theme, 60 + columnWidth + 20, sectionY + 20, columnWidth - 20, sectionHeight - 40);
  }

  /**
   * Dibuja columna izquierda de información del curso
   */
  private drawCourseInfoLeftColumn(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, theme: any, x: number, y: number, width: number, height: number): void {
    // Público Objetivo (duplicado)
    this.drawInfoCard(ctx, canvas, theme, x, y, width, 60, 'Público Objetivo', '👥', this.extractTargetAudience(data));
    
    // Nivel del Curso
    this.drawInfoCard(ctx, canvas, theme, x, y + 80, width, 60, 'Nivel', '📊', this.extractLevel(data));
    
    // Resumen y Duración
    this.drawInfoCard(ctx, canvas, theme, x, y + 160, width, 80, 'Resumen y Duración', '🐝', this.extractDuration(data));
    
    // Modalidad Piloto
    this.drawModalityCard(ctx, canvas, theme, x, y + 260, width, 80);
  }

  /**
   * Dibuja columna derecha de información del curso
   */
  private drawCourseInfoRightColumn(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, theme: any, x: number, y: number, width: number, height: number): void {
    // Resumen del Curso
    this.drawInfoCard(ctx, canvas, theme, x, y, width, 80, 'Resumen del Curso', '📖', this.extractSummary(data));
    
    // Estructura y Duración
    this.drawInfoCard(ctx, canvas, theme, x, y + 100, width, 80, 'Estructura y Duración', '⚙️', this.extractStructure(data));
    
    // Valor Agregado
    this.drawInfoCard(ctx, canvas, theme, x, y + 200, width, 60, 'Valor Agregado', '🎓', this.extractValue(data));
  }

  /**
   * Dibuja tarjeta de información
   */
  private drawInfoCard(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, theme: any, x: number, y: number, width: number, height: number, title: string, icon: string, content: string): void {
    // Fondo de la tarjeta
    ctx.fillStyle = theme.cardBackground;
    ctx.fillRect(x, y, width, height);
    
    // Borde
    ctx.strokeStyle = theme.borderColor;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
    
    // Título
    ctx.fillStyle = theme.primaryColor;
    ctx.font = 'bold 16px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(title, x + 10, y + 20);
    
    // Icono
    ctx.fillStyle = theme.secondaryColor;
    ctx.font = '20px Arial';
    ctx.fillText(icon, x + width - 30, y + 20);
    
    // Contenido
    ctx.fillStyle = theme.textColor;
    ctx.font = '14px Inter, Arial, sans-serif';
    this.drawWrappedText(ctx, content, x + 10, y + 40, width - 20, 20);
  }

  /**
   * Dibuja tarjeta de modalidad
   */
  private drawModalityCard(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, theme: any, x: number, y: number, width: number, height: number): void {
    // Fondo de la tarjeta
    ctx.fillStyle = theme.cardBackground;
    ctx.fillRect(x, y, width, height);
    
    // Borde más grueso
    ctx.strokeStyle = theme.primaryColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, width, height);
    
    // Título
    ctx.fillStyle = theme.primaryColor;
    ctx.font = 'bold 16px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Modalidad Piloto:', x + 10, y + 20);
    
    // Contenido
    ctx.fillStyle = theme.textColor;
    ctx.font = '14px Inter, Arial, sans-serif';
    ctx.fillText('Taller de 3 horas "Introducción a la Apicultura Urbana"', x + 10, y + 40);
    
    // Botón de inscripción
    const buttonX = x + 10;
    const buttonY = y + 50;
    const buttonWidth = 120;
    const buttonHeight = 25;
    
    ctx.fillStyle = theme.buttonColor;
    ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
    
    ctx.fillStyle = theme.lightTextColor;
    ctx.font = 'bold 12px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('¡Inscríbete hoy!', buttonX + buttonWidth / 2, buttonY + 17);
  }

  /**
   * Dibuja sección de modalidad
   */
  private drawModalitySection(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, data: InfographicData, theme: any): void {
    // Esta sección ya se dibuja en drawCourseInfoSection
  }

  /**
   * Dibuja footer
   */
  private drawFooter(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, theme: any): void {
    const footerY = canvas.height - 80;
    const footerHeight = 80;
    
    // Fondo del footer
    ctx.fillStyle = theme.primaryColor;
    ctx.fillRect(0, footerY, canvas.width, footerHeight);
    
    // Texto del footer
    ctx.fillStyle = theme.lightTextColor;
    ctx.font = 'bold 18px Inter, Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Transforma tu hogar, impacta tu comunidad.', 40, footerY + 30);
    
    // QR Code placeholder
    const qrX = canvas.width - 100;
    const qrY = footerY + 10;
    const qrSize = 60;
    
    ctx.fillStyle = theme.lightTextColor;
    ctx.fillRect(qrX, qrY, qrSize, qrSize);
    
    ctx.fillStyle = theme.primaryColor;
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('QR', qrX + qrSize / 2, qrY + qrSize / 2 + 3);
    
    // Logo institucional
    ctx.fillStyle = theme.lightTextColor;
    ctx.font = 'bold 12px Inter, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Universidad de Guatemala', qrX + qrSize / 2, qrY + qrSize + 15);
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
   * Extrae objetivos del curso
   */
  private extractObjectives(data: InfographicData): string[] {
    const objectivesSection = data.sections?.find(section => section.title?.toLowerCase().includes('objetivo'));
    if (objectivesSection?.content?.list?.items) {
      return objectivesSection.content.list.items.map((item: any) => item.text);
    }
    return [
      'Iniciarse en la apicultura de forma segura y responsable',
      'Contribuir a la conservación de polinizadores',
      'Producir miel para consumo familiar',
      'Generar posible fuente de ingresos adicional'
    ];
  }

  /**
   * Extrae público objetivo
   */
  private extractTargetAudience(data: InfographicData): string {
    const audienceSection = data.sections?.find(section => section.title?.toLowerCase().includes('público'));
    if (audienceSection?.content?.text?.content) {
      return audienceSection.content.text.content;
    }
    return 'Jóvenes adultos y padres de familia interesados en sostenibilidad';
  }

  /**
   * Extrae nivel del curso
   */
  private extractLevel(data: InfographicData): string {
    const statsSection = data.sections?.find(section => section.type === 'stats');
    if (statsSection?.content?.stats?.items) {
      const level = statsSection.content.stats.items.find((item: any) => item.label?.toLowerCase().includes('nivel'));
      if (level) {
        return `${level.value}${level.unit || ''}`;
      }
    }
    return 'Básico';
  }

  /**
   * Extrae duración del curso
   */
  private extractDuration(data: InfographicData): string {
    const statsSection = data.sections?.find(section => section.type === 'stats');
    if (statsSection?.content?.stats?.items) {
      const duration = statsSection.content.stats.items.find((item: any) => item.label?.toLowerCase().includes('duración'));
      if (duration) {
        return `${duration.value} ${duration.unit}`;
      }
    }
    return '4 Módulos: 1. Fundamentos, 2. Instalación y Manejo (12 sesiones de 1 hora)';
  }

  /**
   * Extrae resumen del curso
   */
  private extractSummary(data: InfographicData): string {
    const summarySection = data.sections?.find(section => section.title?.toLowerCase().includes('resumen'));
    if (summarySection?.content?.text?.content) {
      return summarySection.content.text.content;
    }
    return 'Introducción a la apicultura urbana sostenible, combina autosuficiencia y cuidado ambiental';
  }

  /**
   * Extrae estructura del curso
   */
  private extractStructure(data: InfographicData): string {
    const statsSection = data.sections?.find(section => section.type === 'stats');
    if (statsSection?.content?.stats?.items) {
      const modules = statsSection.content.stats.items.find((item: any) => item.label?.toLowerCase().includes('módulo'));
      if (modules) {
        return `${modules.value} Módulos: 1. Instalación y Manejo, 4. Producción Sostenible. 6 semanas (12 sesiones de 1 hora)`;
      }
    }
    return '4 Módulos: 1. Instalación y Manejo, 4. Producción Sostenible. 6 semanas (12 sesiones de 1 hora)';
  }

  /**
   * Extrae valor agregado
   */
  private extractValue(data: InfographicData): string {
    const statsSection = data.sections?.find(section => section.type === 'stats');
    if (statsSection?.content?.stats?.items) {
      const credits = statsSection.content.stats.items.find((item: any) => item.label?.toLowerCase().includes('crédito'));
      if (credits) {
        return `Parte de Ruta 3: Autosuficiencia del Hogar. Otorga ${credits.value} créditos académicos`;
      }
    }
    return 'Parte de Ruta 3: Autosuficiencia del Hogar. Otorga 3 créditos académicos';
  }

  /**
   * Dibuja texto con salto de línea
   */
  private drawWrappedText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): void {
    const words = text.split(' ');
    let line = '';
    let lineY = y;
    
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && i > 0) {
        ctx.fillText(line, x, lineY);
        line = words[i] + ' ';
        lineY += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, lineY);
  }
}

export const professionalStructureGenerator = ProfessionalStructureGenerator.getInstance();
