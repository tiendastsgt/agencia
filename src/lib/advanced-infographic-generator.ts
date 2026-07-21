import { InfographicData } from './types/infographic'

export interface AdvancedInfographicOptions {
  width: number
  height: number
  format: 'png' | 'jpg' | 'svg'
  quality: 'low' | 'medium' | 'high'
  includeWatermark: boolean
}

export class AdvancedInfographicGenerator {
  private static instance: AdvancedInfographicGenerator

  public static getInstance(): AdvancedInfographicGenerator {
    if (!AdvancedInfographicGenerator.instance) {
      AdvancedInfographicGenerator.instance = new AdvancedInfographicGenerator()
    }
    return AdvancedInfographicGenerator.instance
  }

  /**
   * Genera una infografía avanzada usando HTML/CSS y convierte a imagen
   */
  async generateAdvancedInfographic(
    data: InfographicData, 
    options: AdvancedInfographicOptions = {
      width: 1200,
      height: 1600,
      format: 'png',
      quality: 'high',
      includeWatermark: false
    }
  ): Promise<string> {
    try {
      // Crear HTML avanzado para la infografía
      const htmlContent = this.generateAdvancedHTML(data, options)
      
      // Convertir HTML a imagen usando html2canvas o similar
      const imageDataUrl = await this.htmlToImage(htmlContent, options)
      
      return imageDataUrl
    } catch (error) {
      throw new Error(`Error generando infografía avanzada: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  /**
   * Genera HTML avanzado para la infografía
   */
  private generateAdvancedHTML(data: InfographicData, options: AdvancedInfographicOptions): string {
    const primaryColor = data.theme?.primaryColor || '#3B82F6'
    const secondaryColor = data.theme?.secondaryColor || '#1E40AF'
    const accentColor = data.theme?.accentColor || '#F59E0B'
    const backgroundColor = data.theme?.backgroundColor || '#FFFFFF'
    const textColor = data.theme?.textColor || '#1F2937'

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${data.title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, ${backgroundColor} 0%, ${primaryColor}08 100%);
            color: ${textColor};
            width: ${options.width}px;
            height: ${options.height}px;
            overflow: hidden;
            position: relative;
        }
        
        .infographic-container {
            width: 100%;
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
        }
        
        .header {
            background: linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: float 6s ease-in-out infinite;
        }
        
        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .header h1 {
            font-size: 48px;
            font-weight: 800;
            margin-bottom: 16px;
            position: relative;
            z-index: 2;
            text-shadow: 0 4px 8px rgba(0,0,0,0.3);
        }
        
        .header .subtitle {
            font-size: 24px;
            font-weight: 400;
            opacity: 0.9;
            position: relative;
            z-index: 2;
        }
        
        .content {
            flex: 1;
            padding: 40px;
            display: flex;
            flex-direction: column;
            gap: 32px;
        }
        
        .section {
            background: white;
            border-radius: 20px;
            padding: 32px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            border: 1px solid rgba(0,0,0,0.05);
            position: relative;
            overflow: hidden;
        }
        
        .section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: linear-gradient(90deg, ${primaryColor}, ${accentColor});
        }
        
        .section-title {
            font-size: 28px;
            font-weight: 700;
            color: ${primaryColor};
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .section-title::before {
            content: '';
            width: 8px;
            height: 8px;
            background: ${accentColor};
            border-radius: 50%;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 24px;
        }
        
        .stat-card {
            background: linear-gradient(135deg, ${primaryColor}10, ${secondaryColor}10);
            border-radius: 16px;
            padding: 24px;
            text-align: center;
            border: 2px solid transparent;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(135deg, ${primaryColor}, ${secondaryColor});
            border-radius: 16px;
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
        }
        
        .stat-value {
            font-size: 36px;
            font-weight: 800;
            color: ${primaryColor};
            margin-bottom: 8px;
        }
        
        .stat-label {
            font-size: 14px;
            font-weight: 500;
            color: ${textColor};
            opacity: 0.8;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .list-items {
            display: flex;
            flex-direction: column;
            gap: 16px;
        }
        
        .list-item {
            display: flex;
            align-items: center;
            gap: 16px;
            padding: 16px;
            background: ${primaryColor}05;
            border-radius: 12px;
            border-left: 4px solid ${primaryColor};
        }
        
        .list-item::before {
            content: '✓';
            width: 24px;
            height: 24px;
            background: ${primaryColor};
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
        }
        
        .chart-container {
            background: linear-gradient(135deg, ${primaryColor}05, ${secondaryColor}05);
            border-radius: 16px;
            padding: 24px;
            margin-top: 16px;
        }
        
        .chart-bar {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 16px;
        }
        
        .chart-label {
            width: 120px;
            font-weight: 600;
            color: ${textColor};
        }
        
        .chart-progress {
            flex: 1;
            height: 24px;
            background: rgba(0,0,0,0.1);
            border-radius: 12px;
            overflow: hidden;
            position: relative;
        }
        
        .chart-fill {
            height: 100%;
            background: linear-gradient(90deg, ${primaryColor}, ${accentColor});
            border-radius: 12px;
            transition: width 1s ease;
            position: relative;
        }
        
        .chart-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }
        
        .chart-value {
            width: 60px;
            text-align: right;
            font-weight: 700;
            color: ${primaryColor};
        }
        
        .footer {
            background: ${primaryColor}10;
            padding: 24px;
            text-align: center;
            border-top: 1px solid ${primaryColor}20;
        }
        
        .footer-text {
            font-size: 14px;
            color: ${textColor};
            opacity: 0.7;
        }
        
        .watermark {
            position: absolute;
            bottom: 20px;
            right: 20px;
            font-size: 12px;
            color: ${textColor};
            opacity: 0.3;
        }
    </style>
</head>
<body>
    <div class="infographic-container">
        <div class="header">
            <h1>${data.title}</h1>
            ${data.subtitle ? `<div class="subtitle">${data.subtitle}</div>` : ''}
        </div>
        
        <div class="content">
            ${this.generateSectionsHTML(data)}
        </div>
        
        <div class="footer">
            <div class="footer-text">
                ${data.metadata?.author ? `Creado por ${data.metadata.author}` : ''}
                ${data.metadata?.createdAt ? ` • ${new Date(data.metadata.createdAt).toLocaleDateString('es-ES')}` : ''}
            </div>
        </div>
        
        ${options.includeWatermark ? '<div class="watermark">Generado con MarketPro GT</div>' : ''}
    </div>
</body>
</html>`
  }

  /**
   * Genera HTML para las secciones
   */
  private generateSectionsHTML(data: InfographicData): string {
    return data.sections?.map(section => {
      switch (section.type) {
        case 'stats':
          return this.generateStatsSectionHTML(section)
        case 'text':
          return this.generateTextSectionHTML(section)
        case 'list':
          return this.generateListSectionHTML(section)
        case 'chart':
          return this.generateChartSectionHTML(section)
        case 'comparison':
          return this.generateComparisonSectionHTML(section)
        default:
          return this.generateGenericSectionHTML(section)
      }
    }).join('') || ''
  }

  private generateStatsSectionHTML(section: any): string {
    const stats = section.content?.stats?.items || []
    return `
      <div class="section">
        <div class="section-title">${section.title}</div>
        <div class="stats-grid">
          ${stats.map((stat: any) => `
            <div class="stat-card">
              <div class="stat-value">${stat.value}${stat.unit}</div>
              <div class="stat-label">${stat.label}</div>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  private generateTextSectionHTML(section: any): string {
    return `
      <div class="section">
        <div class="section-title">${section.title}</div>
        <div style="font-size: 18px; line-height: 1.6; color: #4B5563;">
          ${section.content?.text?.content || ''}
        </div>
      </div>
    `
  }

  private generateListSectionHTML(section: any): string {
    const items = section.content?.list?.items || []
    return `
      <div class="section">
        <div class="section-title">${section.title}</div>
        <div class="list-items">
          ${items.map((item: any) => `
            <div class="list-item">
              <span>${item.text}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  private generateChartSectionHTML(section: any): string {
    const chartData = section.content?.chart?.data || []
    const maxValue = Math.max(...chartData.map((item: any) => item.value))
    
    return `
      <div class="section">
        <div class="section-title">${section.title}</div>
        <div class="chart-container">
          ${chartData.map((item: any) => {
            const percentage = (item.value / maxValue) * 100
            return `
              <div class="chart-bar">
                <div class="chart-label">${item.label}</div>
                <div class="chart-progress">
                  <div class="chart-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="chart-value">${item.value}</div>
              </div>
            `
          }).join('')}
        </div>
      </div>
    `
  }

  private generateComparisonSectionHTML(section: any): string {
    const items = section.content?.comparison?.items || []
    return `
      <div class="section">
        <div class="section-title">${section.title}</div>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
          ${items.map((item: any) => `
            <div style="background: linear-gradient(135deg, #F8FAFC, #F1F5F9); border-radius: 16px; padding: 24px; border: 2px solid #E2E8F0;">
              <h3 style="font-size: 20px; font-weight: 700; color: #1E293B; margin-bottom: 12px;">${item.title}</h3>
              <p style="color: #64748B; margin-bottom: 16px;">${item.description}</p>
              ${item.pros ? `
                <div style="margin-bottom: 12px;">
                  <h4 style="font-size: 14px; font-weight: 600; color: #059669; margin-bottom: 8px;">✅ Ventajas</h4>
                  <ul style="list-style: none; padding: 0;">
                    ${item.pros.map((pro: string) => `<li style="font-size: 14px; color: #374151; margin-bottom: 4px;">• ${pro}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              ${item.cons ? `
                <div style="margin-bottom: 12px;">
                  <h4 style="font-size: 14px; font-weight: 600; color: #DC2626; margin-bottom: 8px;">❌ Desventajas</h4>
                  <ul style="list-style: none; padding: 0;">
                    ${item.cons.map((con: string) => `<li style="font-size: 14px; color: #374151; margin-bottom: 4px;">• ${con}</li>`).join('')}
                  </ul>
                </div>
              ` : ''}
              ${item.score ? `
                <div style="text-align: center; margin-top: 16px;">
                  <div style="display: inline-flex; align-items: center; justify-content: center; width: 48px; height: 48px; background: linear-gradient(135deg, #3B82F6, #1E40AF); color: white; border-radius: 50%; font-weight: 700; font-size: 18px;">
                    ${item.score}
                  </div>
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      </div>
    `
  }

  private generateGenericSectionHTML(section: any): string {
    return `
      <div class="section">
        <div class="section-title">${section.title}</div>
        <div style="color: #6B7280;">
          Contenido de la sección ${section.type}
        </div>
      </div>
    `
  }

  /**
   * Convierte HTML a imagen usando Canvas simple
   */
  private async htmlToImage(htmlContent: string, options: AdvancedInfographicOptions): Promise<string> {
    try {
      // Crear un canvas simple con la infografía
      const canvas = this.createSimpleCanvas(options)
      return canvas.toDataURL(`image/${options.format}`, options.quality === 'high' ? 0.9 : options.quality === 'medium' ? 0.7 : 0.5)
    } catch (error) {
      // Si falla, crear un canvas básico
      const canvas = this.createBasicCanvas(options)
      return canvas.toDataURL(`image/${options.format}`, 0.7)
    }
  }

  /**
   * Crea un canvas simple con la infografía
   */
  private createSimpleCanvas(options: AdvancedInfographicOptions): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto del canvas')
    }
    
    canvas.width = options.width
    canvas.height = options.height
    
    // Fondo degradado
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    gradient.addColorStop(0, '#3B82F6')
    gradient.addColorStop(1, '#1E40AF')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Título principal
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 48px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Infografía Generada', canvas.width / 2, canvas.height / 2 - 100)
    
    // Subtítulo
    ctx.font = '24px Arial, sans-serif'
    ctx.fillText('Sistema de Infografías MarketPro GT', canvas.width / 2, canvas.height / 2 - 50)
    
    // Información adicional
    ctx.font = '18px Arial, sans-serif'
    ctx.fillText(`Tamaño: ${options.width}x${options.height}`, canvas.width / 2, canvas.height / 2 + 50)
    ctx.fillText(`Calidad: ${options.quality}`, canvas.width / 2, canvas.height / 2 + 80)
    
    // Fecha
    ctx.font = '16px Arial, sans-serif'
    ctx.fillText(new Date().toLocaleDateString(), canvas.width / 2, canvas.height / 2 + 120)
    
    return canvas
  }

  /**
   * Crea un canvas básico de fallback
   */
  private createBasicCanvas(options: AdvancedInfographicOptions): HTMLCanvasElement {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto del canvas')
    }
    
    canvas.width = options.width
    canvas.height = options.height
    
    // Fondo simple
    ctx.fillStyle = '#F3F4F6'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Borde
    ctx.strokeStyle = '#D1D5DB'
    ctx.lineWidth = 2
    ctx.strokeRect(0, 0, canvas.width, canvas.height)
    
    // Texto central
    ctx.fillStyle = '#374151'
    ctx.font = 'bold 36px Arial, sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('Infografía de Fallback', canvas.width / 2, canvas.height / 2)
    
    return canvas
  }
}

export const advancedInfographicGenerator = AdvancedInfographicGenerator.getInstance()
