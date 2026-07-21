import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { formatCurrency } from '../utils/formatters';
import { 
  Bot, 
  Play, 
  Pause, 
  Settings, 
  TrendingUp, 
  Target, 
  Zap, 
  BarChart3,
  DollarSign,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { 
  campaignAutomationService, 
  AutomatedCampaign, 
  ABTestConfig, 
  PerformanceMetrics 
} from '../lib/campaign-automation-service';

interface CampaignAutomationManagerProps {
  clientId: string;
}

export const CampaignAutomationManager: React.FC<CampaignAutomationManagerProps> = ({ clientId }) => {
  const [campaigns, setCampaigns] = useState<AutomatedCampaign[]>([]);
  const [abTests, setAbTests] = useState<ABTestConfig[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<AutomatedCampaign | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [budgetRecommendations, setBudgetRecommendations] = useState<any>(null);
  const [scalingResults, setScalingResults] = useState<any>(null);
  const [monitoringResults, setMonitoringResults] = useState<any>(null);

  const campaignTypes = [
    { value: 'awareness', label: 'Conciencia de Marca' },
    { value: 'engagement', label: 'Engagement' },
    { value: 'conversion', label: 'Conversión' },
    { value: 'retention', label: 'Retención' }
  ];

  const triggerTypes = [
    { value: 'time_based', label: 'Basado en Tiempo' },
    { value: 'performance_based', label: 'Basado en Rendimiento' },
    { value: 'audience_based', label: 'Basado en Audiencia' },
    { value: 'external_event', label: 'Evento Externo' }
  ];

  useEffect(() => {
    loadCampaigns();
    loadABTests();
  }, [clientId]);

  const loadCampaigns = async () => {
    try {
      // Simular carga de campañas
      const mockCampaigns: AutomatedCampaign[] = [
        {
          id: '1',
          name: 'Campaña de Conciencia Q1',
          clientId,
          campaignType: 'awareness',
          status: 'active',
          triggerEvents: [],
          automationRules: [],
          performanceMetrics: {
            totalSpend: 2500,
            impressions: 125000,
            clicks: 3500,
            conversions: 85,
            engagementRate: 0.065,
            conversionRate: 0.024,
            roas: 3.2,
            lastUpdated: new Date()
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      setCampaigns(mockCampaigns);
    } catch (error) {
      console.error('Error loading campaigns:', error);
    }
  };

  const loadABTests = async () => {
    try {
      // Simular carga de A/B tests
      const mockABTests: ABTestConfig[] = [
        {
          id: '1',
          campaignId: '1',
          testName: 'Test de Headlines',
          variants: [],
          trafficSplit: 50,
          successMetric: 'conversion_rate',
          minimumSampleSize: 1000,
          confidenceLevel: 0.95,
          status: 'running'
        }
      ];
      setAbTests(mockABTests);
    } catch (error) {
      console.error('Error loading A/B tests:', error);
    }
  };

  const createAutomatedCampaign = async (campaignData: any) => {
    setIsCreating(true);
    try {
      const campaign = await campaignAutomationService.createAutomatedCampaign(
        campaignData.name,
        clientId,
        campaignData.campaignType,
        campaignData.triggerEvents,
        campaignData.automationRules
      );
      setCampaigns(prev => [...prev, campaign]);
    } catch (error) {
      console.error('Error creating campaign:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const optimizeBudgets = async (campaignId: string) => {
    setIsOptimizing(true);
    try {
      const recommendations = await campaignAutomationService.optimizeBudgets(campaignId);
      setBudgetRecommendations(recommendations);
    } catch (error) {
      console.error('Error optimizing budgets:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const scaleSuccessfulCampaigns = async () => {
    try {
      const results = await campaignAutomationService.scaleSuccessfulCampaigns(clientId);
      setScalingResults(results);
    } catch (error) {
      console.error('Error scaling campaigns:', error);
    }
  };

  const monitorAndAdjust = async () => {
    try {
      const results = await campaignAutomationService.monitorAndAdjustCampaigns(clientId);
      setMonitoringResults(results);
    } catch (error) {
      console.error('Error monitoring campaigns:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automatización de Campañas</h2>
          <p className="text-gray-600">Automatiza y optimiza tus campañas con IA</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button onClick={scaleSuccessfulCampaigns}>
            <TrendingUp className="h-4 w-4 mr-2" />
            Escalar Exitosas
          </Button>
          <Button onClick={monitorAndAdjust}>
            <Zap className="h-4 w-4 mr-2" />
            Monitorear
          </Button>
        </div>
      </div>

      <Tabs defaultValue="campaigns" className="space-y-4">
        <TabsList>
          <TabsTrigger value="campaigns">Campañas</TabsTrigger>
          <TabsTrigger value="ab-tests">A/B Tests</TabsTrigger>
          <TabsTrigger value="optimization">Optimización</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoreo</TabsTrigger>
        </TabsList>

        <TabsContent value="campaigns" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Campañas Automatizadas</h3>
            <Button onClick={() => setIsCreating(true)}>
              <Bot className="h-4 w-4 mr-2" />
              Nueva Campaña
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {campaigns.map(campaign => (
              <Card key={campaign.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{campaign.name}</CardTitle>
                    <Badge className={getStatusColor(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    {campaignTypes.find(t => t.value === campaign.campaignType)?.label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Gasto Total</span>
                      <span className="font-medium">{formatCurrency(campaign.performanceMetrics.totalSpend)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">ROAS</span>
                      <span className="font-medium text-green-600">
                        {campaign.performanceMetrics.roas.toFixed(2)}x
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Conversiones</span>
                      <span className="font-medium">{campaign.performanceMetrics.conversions}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Engagement</span>
                      <span className="font-medium">
                        {(campaign.performanceMetrics.engagementRate * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2 mt-4">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Settings className="h-3 w-3 mr-1" />
                      Configurar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Ver Stats
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ab-tests" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">A/B Tests Automáticos</h3>
            <Button>
              <Target className="h-4 w-4 mr-2" />
              Nuevo Test
            </Button>
          </div>

          <div className="space-y-4">
            {abTests.map(test => (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{test.testName}</CardTitle>
                    <Badge variant="outline">
                      {test.status}
                    </Badge>
                  </div>
                  <CardDescription>
                    Métrica: {test.successMetric} | División: {test.trafficSplit}%
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Muestra Mínima</p>
                      <p className="font-medium">{test.minimumSampleSize}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Nivel de Confianza</p>
                      <p className="font-medium">{(test.confidenceLevel * 100).toFixed(0)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Variantes</p>
                      <p className="font-medium">{test.variants.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Progreso</p>
                      <p className="font-medium">45%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Optimización de Presupuestos</h3>
            <Button onClick={() => optimizeBudgets('1')} disabled={isOptimizing}>
              {isOptimizing ? 'Optimizando...' : 'Optimizar Presupuestos'}
            </Button>
          </div>

          {budgetRecommendations && (
            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones de Presupuesto</CardTitle>
                <CardDescription>
                  Ahorro total estimado: {formatCurrency(budgetRecommendations.totalSavings)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {budgetRecommendations.recommendations.map((rec: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">{rec.platform}</h4>
                        <Badge variant={rec.expectedLift > 0 ? 'default' : 'destructive'}>
                          {rec.expectedLift > 0 ? '+' : ''}{(rec.expectedLift * 100).toFixed(1)}%
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <p className="text-sm text-gray-600">Presupuesto Actual</p>
                          <p className="font-medium">{formatCurrency(rec.currentBudget)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Presupuesto Recomendado</p>
                          <p className="font-medium">{formatCurrency(rec.recommendedBudget)}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{rec.reasoning}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="monitoring" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Monitoreo en Tiempo Real</h3>
            <Button onClick={monitorAndAdjust}>
              <Clock className="h-4 w-4 mr-2" />
              Ejecutar Ajustes
            </Button>
          </div>

          {monitoringResults && (
            <Card>
              <CardHeader>
                <CardTitle>Ajustes Realizados</CardTitle>
                <CardDescription>
                  {monitoringResults.adjustments.length} ajustes aplicados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {monitoringResults.adjustments.map((adjustment: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Campaña {adjustment.campaignId}</h4>
                        <div className="flex items-center space-x-2">
                          {adjustment.adjustment === 'Pausada' ? (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                          <Badge variant="outline">{adjustment.adjustment}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{adjustment.reason}</p>
                      <p className="text-sm text-blue-600">{adjustment.impact}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {scalingResults && (
            <Card>
              <CardHeader>
                <CardTitle>Escalamiento de Campañas Exitosas</CardTitle>
                <CardDescription>
                  {scalingResults.scaledCampaigns.length} campañas escaladas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {scalingResults.scaledCampaigns.map((campaign: any, index: number) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium">Campaña {campaign.campaignId}</h4>
                        <Badge variant="default">
                          Factor: {campaign.scaleFactor}x
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-2">
                        <div>
                          <p className="text-sm text-gray-600">Aumento Esperado</p>
                          <p className="font-medium text-green-600">
                            +{campaign.expectedIncrease.toFixed(1)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Razón</p>
                          <p className="font-medium text-sm">{campaign.reasoning}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
