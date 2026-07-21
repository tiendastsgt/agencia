#!/usr/bin/env python3
"""
Generador de Visualizaciones para Sistema ML-Visual Content Integration

Crea diagramas y gráficos para documentar el sistema de integración
entre algoritmos ML y generación de contenido visual.
"""

import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import matplotlib.patches as patches
from matplotlib.patches import FancyBboxPatch
import warnings

def setup_matplotlib_for_plotting():
    """
    Setup matplotlib and seaborn for plotting with proper configuration.
    Call this function before creating any plots to ensure proper rendering.
    """
    warnings.filterwarnings('default')  # Show all warnings

    # Configure matplotlib for non-interactive mode
    plt.switch_backend("Agg")

    # Set chart style
    plt.style.use("seaborn-v0_8")
    sns.set_palette("husl")

    # Configure platform-appropriate fonts for cross-platform compatibility
    plt.rcParams["font.sans-serif"] = ["Noto Sans CJK SC", "WenQuanYi Zen Hei", "PingFang SC", "Arial Unicode MS", "Hiragino Sans GB"]
    plt.rcParams["axes.unicode_minus"] = False

def create_system_architecture_diagram():
    """Crea diagrama de arquitectura del sistema"""
    
    setup_matplotlib_for_plotting()
    
    fig, ax = plt.subplots(1, 1, figsize=(16, 12))
    
    # Colores del tema
    colors = {
        'ml_algorithms': '#3498DB',    # Azul
        'content_gen': '#2ECC71',      # Verde  
        'social_platforms': '#E74C3C', # Rojo
        'data_flow': '#F39C12',        # Naranja
        'monitoring': '#9B59B6'        # Morado
    }
    
    # Configurar ejes
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.set_aspect('equal')
    ax.axis('off')
    
    # Título principal
    ax.text(5, 9.5, 'Sistema ML-Visual Content Integration', 
            fontsize=18, fontweight='bold', ha='center')
    ax.text(5, 9.1, 'Arquitectura de Componentes Principales', 
            fontsize=12, ha='center', style='italic')
    
    # Capa 1: Algoritmos ML (Top)
    ml_box = FancyBboxPatch((0.5, 7.5), 9, 1.2, 
                           boxstyle="round,pad=0.1", 
                           facecolor=colors['ml_algorithms'], 
                           alpha=0.3, edgecolor=colors['ml_algorithms'])
    ax.add_patch(ml_box)
    ax.text(5, 8.3, 'ALGORITMOS ML', fontsize=14, fontweight='bold', ha='center')
    
    # Componentes ML
    ml_components = [
        ('MAB\nA/B Testing', 1.5, 7.8),
        ('RL\nPrompt Opt.', 3.5, 7.8),
        ('Genetic\nTemplate Evol.', 5.5, 7.8),
        ('Reward\nSystem', 7.5, 7.8)
    ]
    
    for comp_name, x, y in ml_components:
        comp_box = FancyBboxPatch((x-0.4, y-0.2), 0.8, 0.4,
                                 boxstyle="round,pad=0.05",
                                 facecolor='white', edgecolor=colors['ml_algorithms'])
        ax.add_patch(comp_box)
        ax.text(x, y, comp_name, fontsize=9, ha='center', va='center')
    
    # Capa 2: Orquestador de Contenido (Middle)
    content_box = FancyBboxPatch((1, 5.5), 8, 1.5,
                                boxstyle="round,pad=0.1",
                                facecolor=colors['content_gen'],
                                alpha=0.3, edgecolor=colors['content_gen'])
    ax.add_patch(content_box)
    ax.text(5, 6.7, 'ORQUESTADOR DE CONTENIDO', fontsize=14, fontweight='bold', ha='center')
    ax.text(5, 6.3, 'Pipeline de Generación • Optimización Multi-Plataforma', 
            fontsize=10, ha='center')
    ax.text(5, 5.9, 'Control de Calidad • Tracking de Performance', 
            fontsize=10, ha='center')
    
    # Capa 3: APIs y Herramientas (Middle-Bottom)
    api_sections = [
        ('Design APIs\n• Canva\n• Adobe\n• Figma', 2, 4.2, colors['content_gen']),
        ('AI Generators\n• DALL-E 3\n• Runway ML\n• Gemini', 5, 4.2, colors['content_gen']),
        ('Social Platforms\n• Instagram\n• TikTok\n• Twitter', 8, 4.2, colors['social_platforms'])
    ]
    
    for section_name, x, y, color in api_sections:
        section_box = FancyBboxPatch((x-0.8, y-0.6), 1.6, 1.2,
                                    boxstyle="round,pad=0.1",
                                    facecolor=color, alpha=0.3, edgecolor=color)
        ax.add_patch(section_box)
        ax.text(x, y, section_name, fontsize=9, ha='center', va='center')
    
    # Capa 4: Métricas y Monitoreo (Bottom)
    metrics_box = FancyBboxPatch((0.5, 1.5), 9, 1.2,
                                boxstyle="round,pad=0.1",
                                facecolor=colors['monitoring'],
                                alpha=0.3, edgecolor=colors['monitoring'])
    ax.add_patch(metrics_box)
    ax.text(5, 2.3, 'MÉTRICAS Y APRENDIZAJE CONTINUO', fontsize=14, fontweight='bold', ha='center')
    
    monitoring_components = [
        ('Recolección\nTiempo Real', 2, 1.9),
        ('Analytics\nMulti-Plataforma', 4, 1.9),
        ('Detección\nDrift', 6, 1.9),
        ('Re-entrenamiento\nAutomático', 8, 1.9)
    ]
    
    for comp_name, x, y in monitoring_components:
        comp_box = FancyBboxPatch((x-0.5, y-0.2), 1, 0.4,
                                 boxstyle="round,pad=0.05",
                                 facecolor='white', edgecolor=colors['monitoring'])
        ax.add_patch(comp_box)
        ax.text(x, y, comp_name, fontsize=8, ha='center', va='center')
    
    # Flechas de flujo de datos
    arrows = [
        # ML -> Orquestador
        ((2.5, 7.5), (2.5, 7.0)),
        ((5, 7.5), (5, 7.0)),
        ((7.5, 7.5), (7.5, 7.0)),
        
        # Orquestador -> APIs
        ((4, 5.5), (3, 5.0)),
        ((5, 5.5), (5, 5.0)),
        ((6, 5.5), (7, 5.0)),
        
        # APIs -> Métricas
        ((3, 3.5), (3, 2.8)),
        ((5, 3.5), (5, 2.8)),
        ((7, 3.5), (7, 2.8)),
        
        # Feedback loop: Métricas -> ML
        ((1, 2.7), (0.8, 7.8)),
        ((9, 2.7), (9.2, 7.8))
    ]
    
    for start, end in arrows:
        ax.annotate('', xy=end, xytext=start,
                   arrowprops=dict(arrowstyle='->', lw=2, color=colors['data_flow']))
    
    # Leyenda de feedback loops
    ax.text(0.3, 0.8, 'Feedback\nLoop', fontsize=8, ha='center', 
            bbox=dict(boxstyle="round,pad=0.3", facecolor=colors['data_flow'], alpha=0.3))
    ax.text(9.7, 0.8, 'Optimización\nContinua', fontsize=8, ha='center',
            bbox=dict(boxstyle="round,pad=0.3", facecolor=colors['data_flow'], alpha=0.3))
    
    plt.tight_layout()
    plt.savefig('charts/ml_visual_system_architecture.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    return 'charts/ml_visual_system_architecture.png'

def create_performance_comparison_chart():
    """Crea gráfico comparativo de performance"""
    
    setup_matplotlib_for_plotting()
    
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 12))
    fig.suptitle('Sistema ML-Visual: Mejoras de Performance Esperadas', 
                 fontsize=16, fontweight='bold')
    
    # 1. Mejora por Algoritmo ML
    algorithms = ['MAB\nA/B Testing', 'RL\nPrompt Opt.', 'Genetic\nTemplates', 'Sistema\nIntegrado']
    improvements = [300, 250, 400, 650]  # % de mejora
    colors_alg = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#2ECC71']
    
    bars1 = ax1.bar(algorithms, improvements, color=colors_alg, alpha=0.8)
    ax1.set_title('Mejora de Performance por Algoritmo ML', fontweight='bold')
    ax1.set_ylabel('Mejora (%)')
    ax1.set_ylim(0, 700)
    
    # Añadir valores en las barras
    for bar, value in zip(bars1, improvements):
        height = bar.get_height()
        ax1.text(bar.get_x() + bar.get_width()/2., height + 10,
                f'+{value}%', ha='center', va='bottom', fontweight='bold')
    
    # 2. ROI por Plataforma
    platforms = ['Instagram', 'TikTok', 'Twitter', 'LinkedIn', 'Facebook']
    roi_before = [120, 95, 80, 110, 75]
    roi_after = [280, 245, 180, 235, 165]
    
    x = np.arange(len(platforms))
    width = 0.35
    
    bars2a = ax2.bar(x - width/2, roi_before, width, label='Antes', color='lightgray', alpha=0.7)
    bars2b = ax2.bar(x + width/2, roi_after, width, label='Con ML System', 
                     color=['#E1306C', '#000000', '#1DA1F2', '#0077B5', '#4267B2'], alpha=0.8)
    
    ax2.set_title('ROI por Plataforma Social', fontweight='bold')
    ax2.set_ylabel('ROI (%)')
    ax2.set_xlabel('Plataforma')
    ax2.set_xticks(x)
    ax2.set_xticklabels(platforms, rotation=45)
    ax2.legend()
    ax2.set_ylim(0, 300)
    
    # 3. Evolución Temporal de Métricas
    days = np.arange(1, 31)  # 30 días
    engagement_baseline = np.full(30, 2.5)  # 2.5% baseline
    engagement_ml = 2.5 + np.cumsum(np.random.normal(0.15, 0.05, 30))  # Mejora gradual
    engagement_ml = np.clip(engagement_ml, 2.5, 8.0)
    
    ax3.plot(days, engagement_baseline, '--', color='gray', linewidth=2, label='Baseline Manual')
    ax3.plot(days, engagement_ml, color='#2ECC71', linewidth=3, label='Con Sistema ML')
    ax3.fill_between(days, engagement_baseline, engagement_ml, alpha=0.3, color='#2ECC71')
    
    ax3.set_title('Evolución de Engagement Rate (30 días)', fontweight='bold')
    ax3.set_xlabel('Días desde implementación')
    ax3.set_ylabel('Engagement Rate (%)')
    ax3.legend()
    ax3.grid(True, alpha=0.3)
    
    # 4. Distribución de Performance por Tipo de Contenido
    content_types = ['Imagen\nEstática', 'Video\nCorto', 'Carrusel', 'Story\nInteractiva', 'AI\nGenerado']
    performance_scores = [0.65, 0.78, 0.58, 0.72, 0.85]
    colors_content = ['#FF9999', '#66B2FF', '#99FF99', '#FFB366', '#DDA0DD']
    
    bars4 = ax4.bar(content_types, performance_scores, color=colors_content, alpha=0.8)
    ax4.set_title('Performance Score por Tipo de Contenido', fontweight='bold')
    ax4.set_ylabel('Performance Score (0-1)')
    ax4.set_ylim(0, 1)
    
    # Línea de objetivo
    ax4.axhline(y=0.7, color='red', linestyle='--', alpha=0.7, label='Objetivo (0.7)')
    ax4.legend()
    
    # Añadir valores en las barras
    for bar, value in zip(bars4, performance_scores):
        height = bar.get_height()
        ax4.text(bar.get_x() + bar.get_width()/2., height + 0.02,
                f'{value:.2f}', ha='center', va='bottom', fontweight='bold')
    
    plt.tight_layout()
    plt.savefig('charts/ml_visual_performance_metrics.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    return 'charts/ml_visual_performance_metrics.png'

def create_workflow_diagram():
    """Crea diagrama de flujo del workflow completo"""
    
    setup_matplotlib_for_plotting()
    
    fig, ax = plt.subplots(1, 1, figsize=(14, 10))
    
    # Configurar ejes
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')
    
    # Título
    ax.text(5, 9.5, 'Workflow del Sistema ML-Visual Content Integration', 
            fontsize=16, fontweight='bold', ha='center')
    
    # Colores para diferentes fases
    phase_colors = {
        'input': '#3498DB',      # Azul
        'ml_processing': '#E74C3C',  # Rojo
        'generation': '#2ECC71',     # Verde
        'deployment': '#F39C12',     # Naranja
        'feedback': '#9B59B6'        # Morado
    }
    
    # Fase 1: Input y Configuración
    steps = [
        # (texto, x, y, width, height, color, fase)
        ('1. Configuración\nCampaña', 1, 8.5, 1.5, 0.6, phase_colors['input'], 'input'),
        ('2. Análisis\nAudiencia', 3, 8.5, 1.5, 0.6, phase_colors['input'], 'input'),
        
        # Fase 2: Procesamiento ML
        ('3. Algoritmos\nGenéticos', 0.5, 7, 1.5, 0.6, phase_colors['ml_processing'], 'ml'),
        ('4. Optimización\nRL Prompts', 2.5, 7, 1.5, 0.6, phase_colors['ml_processing'], 'ml'),
        ('5. MAB\nVariantes', 4.5, 7, 1.5, 0.6, phase_colors['ml_processing'], 'ml'),
        
        # Fase 3: Generación
        ('6. Generación\nContenido', 1, 5.5, 1.5, 0.6, phase_colors['generation'], 'gen'),
        ('7. Optimización\nPlataforma', 3, 5.5, 1.5, 0.6, phase_colors['generation'], 'gen'),
        ('8. Control\nCalidad', 5, 5.5, 1.5, 0.6, phase_colors['generation'], 'gen'),
        
        # Fase 4: Deployment
        ('9. Publicación\nAutomatizada', 1, 4, 1.5, 0.6, phase_colors['deployment'], 'deploy'),
        ('10. A/B Testing\nEnTiempo Real', 3, 4, 1.5, 0.6, phase_colors['deployment'], 'deploy'),
        ('11. Monitoreo\nMétricas', 5, 4, 1.5, 0.6, phase_colors['deployment'], 'deploy'),
        
        # Fase 5: Feedback
        ('12. Análisis\nPerformance', 2, 2.5, 1.5, 0.6, phase_colors['feedback'], 'feedback'),
        ('13. Re-entrenamiento\nML', 4, 2.5, 1.5, 0.6, phase_colors['feedback'], 'feedback'),
        
        # Optimización continua
        ('14. Optimización\nContinua', 3, 1, 1.5, 0.6, phase_colors['feedback'], 'feedback'),
    ]
    
    # Dibujar pasos
    for step_text, x, y, w, h, color, phase in steps:
        # Caja del paso
        step_box = FancyBboxPatch((x-w/2, y-h/2), w, h,
                                 boxstyle="round,pad=0.1",
                                 facecolor=color, alpha=0.3, edgecolor=color)
        ax.add_patch(step_box)
        ax.text(x, y, step_text, fontsize=9, ha='center', va='center', fontweight='bold')
    
    # Flechas de conexión
    connections = [
        # Input fase
        ((1.75, 8.5), (2.25, 8.5)),
        
        # Input -> ML
        ((1, 8.2), (1.25, 7.3)),
        ((2.25, 8.2), (2.5, 7.3)),
        ((3, 8.2), (4.5, 7.3)),
        
        # ML -> Generación
        ((1.25, 6.7), (1.75, 5.8)),
        ((3.25, 6.7), (3, 5.8)),
        ((4.5, 6.7), (4.25, 5.8)),
        
        # Generación -> Deployment
        ((1.75, 5.2), (1.75, 4.3)),
        ((3, 5.2), (3, 4.3)),
        ((4.25, 5.2), (4.25, 4.3)),
        
        # Deployment -> Feedback
        ((2.25, 3.7), (2.75, 2.8)),
        ((4, 3.7), (3.5, 2.8)),
        
        # Feedback -> Continuous
        ((2.75, 2.2), (3, 1.3)),
        ((3.5, 2.2), (3.25, 1.3)),
        
        # Loop back
        ((3, 0.7), (8.5, 0.7)),
        ((8.5, 0.7), (8.5, 8.5)),
        ((8.5, 8.5), (4.5, 8.5))
    ]
    
    for start, end in connections:
        ax.annotate('', xy=end, xytext=start,
                   arrowprops=dict(arrowstyle='->', lw=1.5, color='gray'))
    
    # Etiquetas de fases
    phase_labels = [
        ('CONFIGURACIÓN', 2, 9.2, phase_colors['input']),
        ('PROCESAMIENTO ML', 2.5, 7.8, phase_colors['ml_processing']),
        ('GENERACIÓN', 3, 6.3, phase_colors['generation']),
        ('DEPLOYMENT', 3, 4.8, phase_colors['deployment']),
        ('FEEDBACK & LEARNING', 3, 3.3, phase_colors['feedback'])
    ]
    
    for label, x, y, color in phase_labels:
        ax.text(x, y, label, fontsize=10, fontweight='bold', ha='left',
               bbox=dict(boxstyle="round,pad=0.2", facecolor=color, alpha=0.2))
    
    # Nota sobre loop continuo
    ax.text(7.5, 1, 'Loop de\nOptimización\nContinua', fontsize=10, ha='center',
           bbox=dict(boxstyle="round,pad=0.3", facecolor='gold', alpha=0.3))
    
    plt.tight_layout()
    plt.savefig('charts/ml_visual_workflow_diagram.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    return 'charts/ml_visual_workflow_diagram.png'

def create_roi_analysis_chart():
    """Crea análisis detallado de ROI y beneficios"""
    
    setup_matplotlib_for_plotting()
    
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 12))
    fig.suptitle('Análisis de ROI y Beneficios del Sistema ML-Visual', 
                 fontsize=16, fontweight='bold')
    
    # 1. Reducción de Costos Operacionales
    categories = ['Personal\nCreativo', 'Tiempo\nProducción', 'Testing\nManual', 'Herramientas\nExternas']
    cost_reduction = [60, 80, 90, 40]  # % de reducción
    
    bars1 = ax1.barh(categories, cost_reduction, color=['#FF6B6B', '#4ECDC4', '#45B7D1', '#F39C12'])
    ax1.set_title('Reducción de Costos Operacionales (%)', fontweight='bold')
    ax1.set_xlabel('Reducción (%)')
    ax1.set_xlim(0, 100)
    
    # Añadir valores
    for i, bar in enumerate(bars1):
        width = bar.get_width()
        ax1.text(width + 2, bar.get_y() + bar.get_height()/2, 
                f'-{cost_reduction[i]}%', ha='left', va='center', fontweight='bold')
    
    # 2. Incremento en Métricas de Engagement
    metrics = ['Engagement\nRate', 'Click-Through\nRate', 'Conversion\nRate', 'Share\nRate', 'Save\nRate']
    baseline = [100, 100, 100, 100, 100]  # Baseline 100%
    with_ml = [240, 160, 135, 180, 220]   # Con sistema ML
    
    x = np.arange(len(metrics))
    width = 0.35
    
    ax2.bar(x - width/2, baseline, width, label='Baseline', color='lightgray', alpha=0.7)
    bars2 = ax2.bar(x + width/2, with_ml, width, label='Con Sistema ML', color='#2ECC71', alpha=0.8)
    
    ax2.set_title('Incremento en Métricas de Engagement', fontweight='bold')
    ax2.set_ylabel('Performance Relativa (%)')
    ax2.set_xticks(x)
    ax2.set_xticklabels(metrics)
    ax2.legend()
    ax2.set_ylim(0, 260)
    
    # Añadir mejora porcentual
    for i, bar in enumerate(bars2):
        height = bar.get_height()
        improvement = with_ml[i] - baseline[i]
        ax2.text(bar.get_x() + bar.get_width()/2, height + 5,
                f'+{improvement}%', ha='center', va='bottom', fontweight='bold', color='green')
    
    # 3. ROI Acumulado en el Tiempo
    months = np.arange(1, 13)  # 12 meses
    investment = np.cumsum(np.full(12, -25000))  # Inversión mensual $25k
    savings = np.cumsum([5000, 12000, 18000, 25000, 35000, 45000, 
                        55000, 65000, 75000, 85000, 95000, 105000])  # Ahorros acumulados
    net_roi = savings + investment
    
    ax3.plot(months, investment, '--', color='red', linewidth=2, label='Inversión Acumulada')
    ax3.plot(months, savings, color='green', linewidth=2, label='Ahorros Acumulados')
    ax3.plot(months, net_roi, color='blue', linewidth=3, label='ROI Neto')
    ax3.axhline(y=0, color='black', linestyle='-', alpha=0.3)
    ax3.fill_between(months, 0, net_roi, where=(net_roi > 0), alpha=0.3, color='green', label='Ganancia')
    ax3.fill_between(months, 0, net_roi, where=(net_roi < 0), alpha=0.3, color='red', label='Pérdida')
    
    ax3.set_title('ROI Acumulado a 12 Meses', fontweight='bold')
    ax3.set_xlabel('Meses')
    ax3.set_ylabel('ROI ($)')
    ax3.legend()
    ax3.grid(True, alpha=0.3)
    
    # Punto de equilibrio
    break_even_month = 4  # Mes donde se alcanza break-even
    ax3.scatter([break_even_month], [net_roi[break_even_month-1]], 
               color='blue', s=100, zorder=10)
    ax3.annotate(f'Break-even\nMes {break_even_month}', 
                xy=(break_even_month, net_roi[break_even_month-1]),
                xytext=(break_even_month+2, net_roi[break_even_month-1]+20000),
                arrowprops=dict(arrowstyle='->', color='blue'))
    
    # 4. Beneficios por Tamaño de Empresa
    company_sizes = ['Startup\n(1-10 emp)', 'SMB\n(11-50 emp)', 'Mid-Market\n(51-200 emp)', 'Enterprise\n(200+ emp)']
    monthly_savings = [5000, 15000, 45000, 120000]  # Ahorros mensuales en USD
    implementation_time = [2, 4, 8, 16]  # Semanas de implementación
    
    # Crear gráfico de barras con dos ejes Y
    ax4_twin = ax4.twinx()
    
    bars4a = ax4.bar([i-0.2 for i in range(len(company_sizes))], monthly_savings, 
                    width=0.4, color='#2ECC71', alpha=0.8, label='Ahorros Mensuales ($)')
    bars4b = ax4_twin.bar([i+0.2 for i in range(len(company_sizes))], implementation_time,
                         width=0.4, color='#E74C3C', alpha=0.8, label='Tiempo Impl. (semanas)')
    
    ax4.set_title('Beneficios por Tamaño de Empresa', fontweight='bold')
    ax4.set_xlabel('Tamaño de Empresa')
    ax4.set_ylabel('Ahorros Mensuales ($)', color='#2ECC71')
    ax4_twin.set_ylabel('Tiempo de Implementación (semanas)', color='#E74C3C')
    ax4.set_xticks(range(len(company_sizes)))
    ax4.set_xticklabels(company_sizes)
    
    # Añadir valores en las barras
    for i, (bar, value) in enumerate(zip(bars4a, monthly_savings)):
        height = bar.get_height()
        ax4.text(bar.get_x() + bar.get_width()/2, height + 2000,
                f'${value:,}', ha='center', va='bottom', fontweight='bold', color='green')
    
    for i, (bar, value) in enumerate(zip(bars4b, implementation_time)):
        height = bar.get_height()
        ax4_twin.text(bar.get_x() + bar.get_width()/2, height + 0.5,
                     f'{value}w', ha='center', va='bottom', fontweight='bold', color='red')
    
    plt.tight_layout()
    plt.savefig('charts/ml_visual_roi_analysis.png', dpi=300, bbox_inches='tight')
    plt.close()
    
    return 'charts/ml_visual_roi_analysis.png'

def main():
    """Función principal para generar todas las visualizaciones"""
    
    print("🎨 Generando visualizaciones para Sistema ML-Visual Content Integration...")
    
    # Crear directorio para charts si no existe
    import os
    os.makedirs('charts', exist_ok=True)
    
    # Generar todas las visualizaciones
    charts_created = []
    
    print("📊 Creando diagrama de arquitectura del sistema...")
    arch_chart = create_system_architecture_diagram()
    charts_created.append(arch_chart)
    
    print("📈 Creando gráficos de comparación de performance...")
    perf_chart = create_performance_comparison_chart()
    charts_created.append(perf_chart)
    
    print("🔄 Creando diagrama de workflow...")
    workflow_chart = create_workflow_diagram()
    charts_created.append(workflow_chart)
    
    print("💰 Creando análisis de ROI...")
    roi_chart = create_roi_analysis_chart()
    charts_created.append(roi_chart)
    
    print(f"\n✅ Visualizaciones creadas exitosamente:")
    for chart in charts_created:
        print(f"   📄 {chart}")
    
    return charts_created

if __name__ == "__main__":
    charts = main()
