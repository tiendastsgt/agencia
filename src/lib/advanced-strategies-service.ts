import { supabase } from './supabase';

export interface Dream100Strategy {
  id: string;
  clientId: string;
  name: string;
  targetAudience: string;
  dream100List: Dream100Target[];
  currentPhase: 'research' | 'engagement' | 'relationship' | 'promotion';
  progress: number;
  results: Dream100Results;
  createdAt: Date;
  updatedAt: Date;
}

export interface Dream100Target {
  id: string;
  name: string;
  platform: string;
  url: string;
  audienceSize: number;
  engagementRate: number;
  contactInfo: string;
  relationshipStatus: 'identified' | 'contacted' | 'engaged' | 'partner' | 'advocate';
  notes: string;
  priority: number;
}

export interface Dream100Results {
  totalTargets: number;
  contacted: number;
  engaged: number;
  partnerships: number;
  advocates: number;
  trafficGenerated: number;
  conversions: number;
  roas: number;
}

export interface ValueLadder {
  id: string;
  clientId: string;
  name: string;
  steps: ValueLadderStep[];
  currentStep: number;
  conversionRates: Record<string, number>;
  totalRevenue: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ValueLadderStep {
  id: string;
  name: string;
  type: 'lead_magnet' | 'tripwire' | 'core_offer' | 'upsell' | 'downsell' | 'vip';
  price: number;
  description: string;
  targetAudience: string;
  conversionGoal: number;
  currentConversions: number;
  conversionRate: number;
  revenue: number;
}

export interface WebinarScript {
  id: string;
  clientId: string;
  title: string;
  duration: number; // en minutos
  sections: WebinarSection[];
  psychologicalTriggers: string[];
  conversionGoals: ConversionGoal[];
  performance: WebinarPerformance;
  createdAt: Date;
  updatedAt: Date;
}

export interface WebinarSection {
  id: string;
  name: string;
  duration: number;
  content: string;
  psychologicalTriggers: string[];
  callToAction?: string;
  order: number;
}

export interface ConversionGoal {
  id: string;
  name: string;
  type: 'registration' | 'purchase' | 'upsell' | 'email_signup';
  target: number;
  current: number;
  conversionRate: number;
}

export interface WebinarPerformance {
  totalRegistrations: number;
  attendanceRate: number;
  engagementScore: number;
  conversionRate: number;
  revenue: number;
  feedback: string[];
}

export interface PsychologicalTrigger {
  id: string;
  name: string;
  description: string;
  category: 'urgency' | 'scarcity' | 'social_proof' | 'authority' | 'reciprocity' | 'commitment' | 'liking';
  effectiveness: number;
  examples: string[];
  bestUseCases: string[];
}

export class AdvancedStrategiesService {
  private static instance: AdvancedStrategiesService;
  
  public static getInstance(): AdvancedStrategiesService {
    if (!AdvancedStrategiesService.instance) {
      AdvancedStrategiesService.instance = new AdvancedStrategiesService();
    }
    return AdvancedStrategiesService.instance;
  }

  /**
   * Implementa la estrategia Dream 100
   */
  async implementDream100Strategy(
    clientId: string,
    name: string,
    targetAudience: string,
    dream100List: Dream100Target[]
  ): Promise<Dream100Strategy> {
    try {
      const strategyData = {
        client_id: clientId,
        name,
        target_audience: targetAudience,
        dream100_list: dream100List,
        current_phase: 'research',
        progress: 0,
        results: {
          totalTargets: dream100List.length,
          contacted: 0,
          engaged: 0,
          partnerships: 0,
          advocates: 0,
          trafficGenerated: 0,
          conversions: 0,
          roas: 0
        }
      };

      const { data, error } = await supabase
        .from('dream100_strategies')
        .insert(strategyData)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        clientId: data.client_id,
        name: data.name,
        targetAudience: data.target_audience,
        dream100List: data.dream100_list,
        currentPhase: data.current_phase,
        progress: data.progress,
        results: data.results,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error implementing Dream 100 strategy:', error);
      throw error;
    }
  }

  /**
   * Avanza la estrategia Dream 100 al siguiente paso
   */
  async advanceDream100Phase(strategyId: string, newPhase: string): Promise<Dream100Strategy> {
    try {
      const { data, error } = await supabase
        .from('dream100_strategies')
        .update({
          current_phase: newPhase,
          progress: this.calculateProgress(newPhase),
          updated_at: new Date().toISOString()
        })
        .eq('id', strategyId)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        clientId: data.client_id,
        name: data.name,
        targetAudience: data.target_audience,
        dream100List: data.dream100_list,
        currentPhase: data.current_phase,
        progress: data.progress,
        results: data.results,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error advancing Dream 100 phase:', error);
      throw error;
    }
  }

  /**
   * Crea una escalera de valor
   */
  async createValueLadder(
    clientId: string,
    name: string,
    steps: ValueLadderStep[]
  ): Promise<ValueLadder> {
    try {
      const ladderData = {
        client_id: clientId,
        name,
        steps,
        current_step: 0,
        conversion_rates: {},
        total_revenue: 0
      };

      const { data, error } = await supabase
        .from('value_ladders')
        .insert(ladderData)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        clientId: data.client_id,
        name: data.name,
        steps: data.steps,
        currentStep: data.current_step,
        conversionRates: data.conversion_rates,
        totalRevenue: data.total_revenue,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error creating value ladder:', error);
      throw error;
    }
  }

  /**
   * Optimiza la escalera de valor basada en datos de conversión
   */
  async optimizeValueLadder(ladderId: string): Promise<{
    optimizations: Array<{
      stepId: string;
      currentRate: number;
      optimizedRate: number;
      improvement: number;
      recommendations: string[];
    }>;
    expectedRevenueIncrease: number;
  }> {
    try {
      const { data: ladder, error } = await supabase
        .from('value_ladders')
        .select('*')
        .eq('id', ladderId)
        .single();

      if (error) throw error;

      const optimizations = [];
      let totalRevenueIncrease = 0;

      for (const step of ladder.steps) {
        const currentRate = step.conversionRate;
        const optimizedRate = this.calculateOptimalConversionRate(step);
        const improvement = optimizedRate - currentRate;
        
        const recommendations = this.generateStepRecommendations(step, optimizedRate);
        
        optimizations.push({
          stepId: step.id,
          currentRate,
          optimizedRate,
          improvement,
          recommendations
        });

        totalRevenueIncrease += this.calculateRevenueIncrease(step, improvement);
      }

      return { optimizations, expectedRevenueIncrease: totalRevenueIncrease };
    } catch (error) {
      console.error('Error optimizing value ladder:', error);
      throw error;
    }
  }

  /**
   * Crea un script de webinar optimizado
   */
  async createWebinarScript(
    clientId: string,
    title: string,
    duration: number,
    targetAudience: string
  ): Promise<WebinarScript> {
    try {
      const sections = this.generateWebinarSections(duration, targetAudience);
      const psychologicalTriggers = this.selectOptimalTriggers(targetAudience);
      const conversionGoals = this.defineConversionGoals();

      const scriptData = {
        client_id: clientId,
        title,
        duration,
        sections,
        psychological_triggers: psychologicalTriggers,
        conversion_goals: conversionGoals,
        performance: {
          totalRegistrations: 0,
          attendanceRate: 0,
          engagementScore: 0,
          conversionRate: 0,
          revenue: 0,
          feedback: []
        }
      };

      const { data, error } = await supabase
        .from('webinar_scripts')
        .insert(scriptData)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        clientId: data.client_id,
        title: data.title,
        duration: data.duration,
        sections: data.sections,
        psychologicalTriggers: data.psychological_triggers,
        conversionGoals: data.conversion_goals,
        performance: data.performance,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error creating webinar script:', error);
      throw error;
    }
  }

  /**
   * Optimiza un script de webinar basado en rendimiento
   */
  async optimizeWebinarScript(
    scriptId: string,
    performanceData: WebinarPerformance
  ): Promise<{
    optimizations: Array<{
      sectionId: string;
      currentEngagement: number;
      optimizedEngagement: number;
      improvements: string[];
    }>;
    expectedImprovement: number;
  }> {
    try {
      const { data: script, error } = await supabase
        .from('webinar_scripts')
        .select('*')
        .eq('id', scriptId)
        .single();

      if (error) throw error;

      const optimizations = [];
      let totalImprovement = 0;

      for (const section of script.sections) {
        const currentEngagement = this.calculateSectionEngagement(section, performanceData);
        const optimizedEngagement = this.optimizeSectionEngagement(section, performanceData);
        const improvement = optimizedEngagement - currentEngagement;
        
        const improvements = this.generateSectionImprovements(section, performanceData);
        
        optimizations.push({
          sectionId: section.id,
          currentEngagement,
          optimizedEngagement,
          improvements
        });

        totalImprovement += improvement;
      }

      return { optimizations, expectedImprovement: totalImprovement };
    } catch (error) {
      console.error('Error optimizing webinar script:', error);
      throw error;
    }
  }

  /**
   * Aplica triggers psicológicos a contenido
   */
  async applyPsychologicalTriggers(
    content: string,
    targetAudience: string,
    goals: string[]
  ): Promise<{
    optimizedContent: string;
    triggersApplied: string[];
    expectedImpact: number;
  }> {
    try {
      const availableTriggers = await this.getAvailableTriggers();
      const selectedTriggers = this.selectTriggersForContent(availableTriggers, targetAudience, goals);
      
      let optimizedContent = content;
      const triggersApplied = [];

      for (const trigger of selectedTriggers) {
        optimizedContent = this.applyTriggerToContent(optimizedContent, trigger);
        triggersApplied.push(trigger.name);
      }

      const expectedImpact = this.calculateExpectedImpact(selectedTriggers);

      return {
        optimizedContent,
        triggersApplied,
        expectedImpact
      };
    } catch (error) {
      console.error('Error applying psychological triggers:', error);
      throw error;
    }
  }

  // Métodos privados

  private calculateProgress(phase: string): number {
    const phaseProgress = {
      'research': 25,
      'engagement': 50,
      'relationship': 75,
      'promotion': 100
    };
    return phaseProgress[phase as keyof typeof phaseProgress] || 0;
  }

  private calculateOptimalConversionRate(step: ValueLadderStep): number {
    // Calcular tasa de conversión óptima basada en tipo de paso y datos históricos
    const baseRates = {
      'lead_magnet': 0.15,
      'tripwire': 0.08,
      'core_offer': 0.05,
      'upsell': 0.20,
      'downsell': 0.12,
      'vip': 0.30
    };

    const baseRate = baseRates[step.type as keyof typeof baseRates] || 0.10;
    const priceFactor = step.price < 50 ? 1.2 : step.price > 500 ? 0.8 : 1.0;
    
    return Math.min(0.50, baseRate * priceFactor);
  }

  private generateStepRecommendations(step: ValueLadderStep, targetRate: number): string[] {
    const recommendations = [];

    if (step.conversionRate < targetRate * 0.5) {
      recommendations.push('Mejorar copy de ventas');
      recommendations.push('Agregar testimonios y pruebas sociales');
    }

    if (step.price > 200 && step.conversionRate < 0.05) {
      recommendations.push('Considerar dividir en pasos más pequeños');
      recommendations.push('Agregar garantía de devolución');
    }

    if (step.type === 'upsell' && step.conversionRate < 0.15) {
      recommendations.push('Mejorar timing de la oferta');
      recommendations.push('Aumentar valor percibido');
    }

    return recommendations;
  }

  private calculateRevenueIncrease(step: ValueLadderStep, improvement: number): number {
    return step.price * improvement * 1000; // Asumiendo 1000 visitantes
  }

  private generateWebinarSections(duration: number, targetAudience: string): WebinarSection[] {
    const sections: WebinarSection[] = [
      {
        id: 'intro',
        name: 'Introducción y Hook',
        duration: Math.round(duration * 0.1),
        content: 'Capturar atención y establecer credibilidad',
        psychologicalTriggers: ['authority', 'social_proof'],
        order: 1
      },
      {
        id: 'problem',
        name: 'Identificación del Problema',
        duration: Math.round(duration * 0.2),
        content: 'Agitar el dolor y crear urgencia',
        psychologicalTriggers: ['urgency', 'scarcity'],
        order: 2
      },
      {
        id: 'solution',
        name: 'Presentación de la Solución',
        duration: Math.round(duration * 0.4),
        content: 'Mostrar la solución y sus beneficios',
        psychologicalTriggers: ['authority', 'liking'],
        order: 3
      },
      {
        id: 'offer',
        name: 'Oferta y CTA',
        duration: Math.round(duration * 0.2),
        content: 'Presentar oferta irresistible con urgencia',
        psychologicalTriggers: ['urgency', 'scarcity', 'commitment'],
        callToAction: 'Únete ahora con descuento especial',
        order: 4
      },
      {
        id: 'close',
        name: 'Cierre y Bonos',
        duration: Math.round(duration * 0.1),
        content: 'Cerrar la venta con bonos adicionales',
        psychologicalTriggers: ['reciprocity', 'scarcity'],
        order: 5
      }
    ];

    return sections;
  }

  private selectOptimalTriggers(targetAudience: string): string[] {
    const triggerMap = {
      'professionals': ['authority', 'social_proof', 'commitment'],
      'entrepreneurs': ['urgency', 'scarcity', 'authority'],
      'students': ['liking', 'reciprocity', 'social_proof'],
      'general': ['urgency', 'scarcity', 'social_proof', 'authority']
    };

    return triggerMap[targetAudience as keyof typeof triggerMap] || triggerMap.general;
  }

  private defineConversionGoals(): ConversionGoal[] {
    return [
      {
        id: 'registration',
        name: 'Registros',
        type: 'registration',
        target: 100,
        current: 0,
        conversionRate: 0
      },
      {
        id: 'purchase',
        name: 'Ventas',
        type: 'purchase',
        target: 20,
        current: 0,
        conversionRate: 0
      },
      {
        id: 'email_signup',
        name: 'Suscripciones Email',
        type: 'email_signup',
        target: 80,
        current: 0,
        conversionRate: 0
      }
    ];
  }

  private calculateSectionEngagement(section: WebinarSection, performance: WebinarPerformance): number {
    // Calcular engagement basado en duración y triggers
    const baseEngagement = 0.5;
    const triggerBonus = section.psychologicalTriggers.length * 0.1;
    const durationFactor = Math.min(1.0, section.duration / 10);
    
    return Math.min(1.0, baseEngagement + triggerBonus + durationFactor * 0.2);
  }

  private optimizeSectionEngagement(section: WebinarSection, performance: WebinarPerformance): number {
    // Optimizar engagement basado en rendimiento actual
    const currentEngagement = this.calculateSectionEngagement(section, performance);
    const optimizationFactor = 1.2; // 20% de mejora
    
    return Math.min(1.0, currentEngagement * optimizationFactor);
  }

  private generateSectionImprovements(section: WebinarSection, performance: WebinarPerformance): string[] {
    const improvements = [];

    if (section.duration < 5) {
      improvements.push('Aumentar duración para mayor impacto');
    }

    if (section.psychologicalTriggers.length < 2) {
      improvements.push('Agregar más triggers psicológicos');
    }

    if (!section.callToAction && section.name.includes('Oferta')) {
      improvements.push('Agregar call-to-action claro');
    }

    return improvements;
  }

  public async getAvailableTriggers(): Promise<PsychologicalTrigger[]> {
    // Retornar triggers psicológicos disponibles
    return [
      {
        id: 'urgency',
        name: 'Urgencia',
        description: 'Crear sensación de tiempo limitado',
        category: 'urgency',
        effectiveness: 0.8,
        examples: ['Solo por tiempo limitado', 'Oferta expira en...'],
        bestUseCases: ['Ofertas especiales', 'Lanzamientos']
      },
      {
        id: 'scarcity',
        name: 'Escasez',
        description: 'Limitación de cantidad disponible',
        category: 'scarcity',
        effectiveness: 0.7,
        examples: ['Solo quedan 5 disponibles', 'Edición limitada'],
        bestUseCases: ['Productos exclusivos', 'Eventos']
      },
      {
        id: 'social_proof',
        name: 'Prueba Social',
        description: 'Mostrar que otros ya lo han comprado',
        category: 'social_proof',
        effectiveness: 0.9,
        examples: ['Más de 10,000 clientes satisfechos', 'Testimonios'],
        bestUseCases: ['Productos nuevos', 'Servicios']
      }
    ];
  }

  private selectTriggersForContent(
    triggers: PsychologicalTrigger[],
    targetAudience: string,
    goals: string[]
  ): PsychologicalTrigger[] {
    // Seleccionar triggers más efectivos para la audiencia y objetivos
    return triggers
      .sort((a, b) => b.effectiveness - a.effectiveness)
      .slice(0, 3);
  }

  private applyTriggerToContent(content: string, trigger: PsychologicalTrigger): string {
    // Aplicar trigger específico al contenido
    switch (trigger.id) {
      case 'urgency':
        return content + '\n\n⏰ ¡Oferta por tiempo limitado!';
      case 'scarcity':
        return content + '\n\n🔥 Solo quedan pocas unidades disponibles';
      case 'social_proof':
        return content + '\n\n👥 Únete a más de 10,000 clientes satisfechos';
      default:
        return content;
    }
  }

  private calculateExpectedImpact(triggers: PsychologicalTrigger[]): number {
    // Calcular impacto esperado basado en triggers aplicados
    return triggers.reduce((total, trigger) => total + trigger.effectiveness, 0) / triggers.length;
  }
}

export const advancedStrategiesService = AdvancedStrategiesService.getInstance();
