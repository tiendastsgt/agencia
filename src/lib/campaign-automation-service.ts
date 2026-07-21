import { supabase } from './supabase';

export interface AutomatedCampaign {
  id: string;
  name: string;
  clientId: string;
  campaignType: 'awareness' | 'engagement' | 'conversion' | 'retention';
  status: 'active' | 'paused' | 'completed' | 'failed';
  triggerEvents: TriggerEvent[];
  automationRules: AutomationRule[];
  performanceMetrics: PerformanceMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface TriggerEvent {
  id: string;
  type: 'time_based' | 'performance_based' | 'audience_based' | 'external_event';
  conditions: Record<string, any>;
  actions: Action[];
  isActive: boolean;
}

export interface AutomationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  priority: number;
  isActive: boolean;
}

export interface Action {
  type: 'create_content' | 'schedule_post' | 'adjust_budget' | 'send_notification' | 'pause_campaign' | 'scale_campaign';
  parameters: Record<string, any>;
  delay?: number; // en minutos
}

export interface PerformanceMetrics {
  totalSpend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  engagementRate: number;
  conversionRate: number;
  roas: number;
  lastUpdated: Date;
}

export interface ABTestConfig {
  id: string;
  campaignId: string;
  testName: string;
  variants: ABTestVariant[];
  trafficSplit: number; // porcentaje de tráfico para el test
  successMetric: string;
  minimumSampleSize: number;
  confidenceLevel: number;
  status: 'draft' | 'running' | 'completed' | 'paused';
  results?: ABTestResults;
}

export interface ABTestVariant {
  id: string;
  name: string;
  content: any;
  trafficPercentage: number;
  performance: PerformanceMetrics;
}

export interface ABTestResults {
  winner: string;
  confidence: number;
  lift: number;
  statisticalSignificance: boolean;
  recommendations: string[];
}

export class CampaignAutomationService {
  private static instance: CampaignAutomationService;
  
  public static getInstance(): CampaignAutomationService {
    if (!CampaignAutomationService.instance) {
      CampaignAutomationService.instance = new CampaignAutomationService();
    }
    return CampaignAutomationService.instance;
  }

  /**
   * Crea una campaña automatizada
   */
  async createAutomatedCampaign(
    name: string,
    clientId: string,
    campaignType: string,
    triggerEvents: TriggerEvent[],
    automationRules: AutomationRule[]
  ): Promise<AutomatedCampaign> {
    try {
      const campaignData = {
        name,
        client_id: clientId,
        campaign_type: campaignType,
        status: 'active',
        trigger_events: triggerEvents,
        automation_rules: automationRules,
        performance_metrics: {
          totalSpend: 0,
          impressions: 0,
          clicks: 0,
          conversions: 0,
          engagementRate: 0,
          conversionRate: 0,
          roas: 0,
          lastUpdated: new Date().toISOString()
        }
      };

      const { data, error } = await supabase
        .from('automated_campaigns')
        .insert(campaignData)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        name: data.name,
        clientId: data.client_id,
        campaignType: data.campaign_type,
        status: data.status,
        triggerEvents: data.trigger_events,
        automationRules: data.automation_rules,
        performanceMetrics: data.performance_metrics,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (error) {
      console.error('Error creating automated campaign:', error);
      throw error;
    }
  }

  /**
   * Ejecuta reglas de automatización basadas en eventos
   */
  async executeAutomationRules(campaignId: string, eventData: any): Promise<void> {
    try {
      const { data: campaign, error } = await supabase
        .from('automated_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) throw error;

      for (const rule of campaign.automation_rules) {
        if (rule.isActive && this.evaluateCondition(rule.condition, eventData)) {
          await this.executeAction(rule.action, rule.parameters, campaignId);
        }
      }
    } catch (error) {
      console.error('Error executing automation rules:', error);
      throw error;
    }
  }

  /**
   * Crea y ejecuta un A/B test automático
   */
  async createABTest(
    campaignId: string,
    testName: string,
    variants: ABTestVariant[],
    successMetric: string,
    trafficSplit: number = 50
  ): Promise<ABTestConfig> {
    try {
      const abTestData = {
        campaign_id: campaignId,
        test_name: testName,
        variants,
        traffic_split: trafficSplit,
        success_metric: successMetric,
        minimum_sample_size: 1000,
        confidence_level: 0.95,
        status: 'running'
      };

      const { data, error } = await supabase
        .from('ab_tests')
        .insert(abTestData)
        .select()
        .single();

      if (error) throw error;

      // Iniciar el test automáticamente
      await this.startABTest(data.id);

      return {
        id: data.id,
        campaignId: data.campaign_id,
        testName: data.test_name,
        variants: data.variants,
        trafficSplit: data.traffic_split,
        successMetric: data.success_metric,
        minimumSampleSize: data.minimum_sample_size,
        confidenceLevel: data.confidence_level,
        status: data.status
      };
    } catch (error) {
      console.error('Error creating A/B test:', error);
      throw error;
    }
  }

  /**
   * Optimiza presupuestos automáticamente
   */
  async optimizeBudgets(campaignId: string): Promise<{
    recommendations: Array<{
      platform: string;
      currentBudget: number;
      recommendedBudget: number;
      expectedLift: number;
      reasoning: string;
    }>;
    totalSavings: number;
  }> {
    try {
      const { data: campaign, error } = await supabase
        .from('automated_campaigns')
        .select('*')
        .eq('id', campaignId)
        .single();

      if (error) throw error;

      const recommendations = [];
      let totalSavings = 0;

      // Analizar rendimiento por plataforma
      const platformPerformance = await this.analyzePlatformPerformance(campaignId);

      for (const [platform, performance] of Object.entries(platformPerformance)) {
        const currentBudget = performance.currentBudget;
        const roas = performance.roas;
        const engagementRate = performance.engagementRate;

        let recommendedBudget = currentBudget;
        let expectedLift = 0;
        let reasoning = '';

        if (roas > 4.0 && engagementRate > 0.05) {
          // Aumentar presupuesto para plataformas de alto rendimiento
          recommendedBudget = currentBudget * 1.2;
          expectedLift = 0.15;
          reasoning = 'Alto ROAS y engagement, recomendamos aumentar presupuesto';
        } else if (roas < 2.0 || engagementRate < 0.02) {
          // Reducir presupuesto para plataformas de bajo rendimiento
          recommendedBudget = currentBudget * 0.7;
          expectedLift = -0.1;
          reasoning = 'Bajo ROAS y engagement, recomendamos reducir presupuesto';
        } else {
          reasoning = 'Rendimiento estable, mantener presupuesto actual';
        }

        const savings = currentBudget - recommendedBudget;
        totalSavings += savings;

        recommendations.push({
          platform,
          currentBudget,
          recommendedBudget,
          expectedLift,
          reasoning
        });
      }

      return { recommendations, totalSavings };
    } catch (error) {
      console.error('Error optimizing budgets:', error);
      throw error;
    }
  }

  /**
   * Escala campañas exitosas automáticamente
   */
  async scaleSuccessfulCampaigns(clientId: string): Promise<{
    scaledCampaigns: Array<{
      campaignId: string;
      scaleFactor: number;
      expectedIncrease: number;
      reasoning: string;
    }>;
  }> {
    try {
      const { data: campaigns, error } = await supabase
        .from('automated_campaigns')
        .select('*')
        .eq('client_id', clientId)
        .eq('status', 'active');

      if (error) throw error;

      const scaledCampaigns = [];

      for (const campaign of campaigns || []) {
        const metrics = campaign.performance_metrics;
        
        // Criterios para escalar: ROAS > 3.0, engagement > 0.05, conversiones > 10
        if (metrics.roas > 3.0 && metrics.engagementRate > 0.05 && metrics.conversions > 10) {
          const scaleFactor = this.calculateScaleFactor(metrics);
          const expectedIncrease = this.calculateExpectedIncrease(metrics, scaleFactor);
          
          // Aplicar escalamiento
          await this.applyScaling(campaign.id, scaleFactor);

          scaledCampaigns.push({
            campaignId: campaign.id,
            scaleFactor,
            expectedIncrease,
            reasoning: `ROAS: ${metrics.roas.toFixed(2)}, Engagement: ${(metrics.engagementRate * 100).toFixed(1)}%, Conversiones: ${metrics.conversions}`
          });
        }
      }

      return { scaledCampaigns };
    } catch (error) {
      console.error('Error scaling successful campaigns:', error);
      throw error;
    }
  }

  /**
   * Monitorea y ajusta campañas en tiempo real
   */
  async monitorAndAdjustCampaigns(clientId: string): Promise<{
    adjustments: Array<{
      campaignId: string;
      adjustment: string;
      reason: string;
      impact: string;
    }>;
  }> {
    try {
      const { data: campaigns, error } = await supabase
        .from('automated_campaigns')
        .select('*')
        .eq('client_id', clientId)
        .eq('status', 'active');

      if (error) throw error;

      const adjustments = [];

      for (const campaign of campaigns || []) {
        const metrics = campaign.performance_metrics;
        const currentHour = new Date().getHours();

        // Ajustar basado en rendimiento actual
        if (metrics.engagementRate < 0.02) {
          await this.pauseCampaign(campaign.id, 'Bajo engagement');
          adjustments.push({
            campaignId: campaign.id,
            adjustment: 'Pausada',
            reason: 'Engagement muy bajo',
            impact: 'Prevención de desperdicio de presupuesto'
          });
        }

        // Ajustar horarios basado en rendimiento por hora
        if (this.isLowPerformanceHour(currentHour, metrics)) {
          await this.adjustSchedule(campaign.id, 'Reducir frecuencia en horario de bajo rendimiento');
          adjustments.push({
            campaignId: campaign.id,
            adjustment: 'Horario ajustado',
            reason: 'Bajo rendimiento en hora actual',
            impact: 'Optimización de horarios de publicación'
          });
        }

        // Ajustar targeting basado en conversiones
        if (metrics.conversionRate < 0.01) {
          await this.adjustTargeting(campaign.id, 'Expandir audiencia objetivo');
          adjustments.push({
            campaignId: campaign.id,
            adjustment: 'Targeting expandido',
            reason: 'Baja tasa de conversión',
            impact: 'Mayor alcance potencial'
          });
        }
      }

      return { adjustments };
    } catch (error) {
      console.error('Error monitoring and adjusting campaigns:', error);
      throw error;
    }
  }

  // Métodos privados

  private evaluateCondition(condition: string, eventData: any): boolean {
    try {
      // Evaluar condición usando un motor de reglas simple
      const conditions = condition.split(' AND ');
      
      for (const cond of conditions) {
        if (cond.includes('engagement_rate <')) {
          const threshold = parseFloat(cond.split('<')[1]);
          if (eventData.engagementRate >= threshold) return false;
        } else if (cond.includes('conversion_rate >')) {
          const threshold = parseFloat(cond.split('>')[1]);
          if (eventData.conversionRate <= threshold) return false;
        } else if (cond.includes('time_based')) {
          const targetHour = parseInt(cond.split('=')[1]);
          if (new Date().getHours() !== targetHour) return false;
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error evaluating condition:', error);
      return false;
    }
  }

  private async executeAction(action: string, parameters: any, campaignId: string): Promise<void> {
    try {
      switch (action) {
        case 'create_content':
          await this.createContent(parameters, campaignId);
          break;
        case 'schedule_post':
          await this.schedulePost(parameters, campaignId);
          break;
        case 'adjust_budget':
          await this.adjustBudget(parameters, campaignId);
          break;
        case 'send_notification':
          await this.sendNotification(parameters, campaignId);
          break;
        case 'pause_campaign':
          await this.pauseCampaign(campaignId, parameters.reason);
          break;
        case 'scale_campaign':
          await this.scaleCampaign(campaignId, parameters.scaleFactor);
          break;
      }
    } catch (error) {
      console.error('Error executing action:', error);
    }
  }

  private async startABTest(testId: string): Promise<void> {
    try {
      // Implementar lógica de inicio de A/B test
      console.log(`Starting A/B test: ${testId}`);
    } catch (error) {
      console.error('Error starting A/B test:', error);
    }
  }

  private async analyzePlatformPerformance(campaignId: string): Promise<Record<string, any>> {
    try {
      // Simular análisis de rendimiento por plataforma
      return {
        facebook: { currentBudget: 1000, roas: 3.5, engagementRate: 0.06 },
        instagram: { currentBudget: 800, roas: 4.2, engagementRate: 0.08 },
        twitter: { currentBudget: 500, roas: 1.8, engagementRate: 0.03 },
        linkedin: { currentBudget: 1200, roas: 5.1, engagementRate: 0.07 }
      };
    } catch (error) {
      console.error('Error analyzing platform performance:', error);
      return {};
    }
  }

  private calculateScaleFactor(metrics: PerformanceMetrics): number {
    // Calcular factor de escalamiento basado en métricas
    if (metrics.roas > 5.0) return 1.5;
    if (metrics.roas > 4.0) return 1.3;
    if (metrics.roas > 3.0) return 1.2;
    return 1.1;
  }

  private calculateExpectedIncrease(metrics: PerformanceMetrics, scaleFactor: number): number {
    // Calcular aumento esperado basado en factor de escalamiento
    return (scaleFactor - 1) * 100;
  }

  private async applyScaling(campaignId: string, scaleFactor: number): Promise<void> {
    try {
      // Aplicar escalamiento a la campaña
      console.log(`Scaling campaign ${campaignId} by factor ${scaleFactor}`);
    } catch (error) {
      console.error('Error applying scaling:', error);
    }
  }

  private isLowPerformanceHour(hour: number, metrics: PerformanceMetrics): boolean {
    // Determinar si es una hora de bajo rendimiento
    const lowPerformanceHours = [0, 1, 2, 3, 4, 5, 6, 23];
    return lowPerformanceHours.includes(hour) && metrics.engagementRate < 0.02;
  }

  private async pauseCampaign(campaignId: string, reason: string): Promise<void> {
    try {
      await supabase
        .from('automated_campaigns')
        .update({ status: 'paused' })
        .eq('id', campaignId);
      
      console.log(`Campaign ${campaignId} paused: ${reason}`);
    } catch (error) {
      console.error('Error pausing campaign:', error);
    }
  }

  private async adjustSchedule(campaignId: string, adjustment: string): Promise<void> {
    try {
      console.log(`Adjusting schedule for campaign ${campaignId}: ${adjustment}`);
    } catch (error) {
      console.error('Error adjusting schedule:', error);
    }
  }

  private async adjustTargeting(campaignId: string, adjustment: string): Promise<void> {
    try {
      console.log(`Adjusting targeting for campaign ${campaignId}: ${adjustment}`);
    } catch (error) {
      console.error('Error adjusting targeting:', error);
    }
  }

  private async createContent(parameters: any, campaignId: string): Promise<void> {
    try {
      console.log(`Creating content for campaign ${campaignId}:`, parameters);
    } catch (error) {
      console.error('Error creating content:', error);
    }
  }

  private async schedulePost(parameters: any, campaignId: string): Promise<void> {
    try {
      console.log(`Scheduling post for campaign ${campaignId}:`, parameters);
    } catch (error) {
      console.error('Error scheduling post:', error);
    }
  }

  private async adjustBudget(parameters: any, campaignId: string): Promise<void> {
    try {
      console.log(`Adjusting budget for campaign ${campaignId}:`, parameters);
    } catch (error) {
      console.error('Error adjusting budget:', error);
    }
  }

  private async sendNotification(parameters: any, campaignId: string): Promise<void> {
    try {
      console.log(`Sending notification for campaign ${campaignId}:`, parameters);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  private async scaleCampaign(campaignId: string, scaleFactor: number): Promise<void> {
    try {
      console.log(`Scaling campaign ${campaignId} by factor ${scaleFactor}`);
    } catch (error) {
      console.error('Error scaling campaign:', error);
    }
  }
}

export const campaignAutomationService = CampaignAutomationService.getInstance();
