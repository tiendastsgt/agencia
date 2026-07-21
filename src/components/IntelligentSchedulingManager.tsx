import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar, Clock, TrendingUp, Users, Target, Zap } from 'lucide-react';
import { intelligentSchedulingService, AudienceAnalysis, OptimalSchedule, CampaignSchedule } from '../lib/intelligent-scheduling-service';

interface IntelligentSchedulingManagerProps {
  clientId: string;
}

export const IntelligentSchedulingManager: React.FC<IntelligentSchedulingManagerProps> = ({ clientId }) => {
  const [audienceAnalysis, setAudienceAnalysis] = useState<AudienceAnalysis | null>(null);
  const [optimalSchedule, setOptimalSchedule] = useState<OptimalSchedule | null>(null);
  const [scheduledContent, setScheduledContent] = useState<CampaignSchedule[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>('facebook');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);

  const platforms = [
    { value: 'facebook', label: 'Facebook' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'twitter', label: 'Twitter/X' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'tiktok', label: 'TikTok' }
  ];

  useEffect(() => {
    loadScheduledContent();
  }, [clientId]);

  const loadScheduledContent = async () => {
    try {
      const schedules = await intelligentSchedulingService.getScheduledContent(clientId);
      setScheduledContent(schedules);
    } catch (error) {
      console.error('Error loading scheduled content:', error);
    }
  };

  const analyzeAudience = async () => {
    setIsAnalyzing(true);
    try {
      const analysis = await intelligentSchedulingService.analyzeAudience(selectedPlatform, clientId);
      setAudienceAnalysis(analysis);
    } catch (error) {
      console.error('Error analyzing audience:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateOptimalSchedule = async () => {
    try {
      const schedule = await intelligentSchedulingService.calculateOptimalSchedule(
        selectedPlatform,
        'sample-content-id',
        clientId
      );
      setOptimalSchedule(schedule);
    } catch (error) {
      console.error('Error calculating optimal schedule:', error);
    }
  };

  const scheduleContent = async () => {
    setIsScheduling(true);
    try {
      await intelligentSchedulingService.scheduleContent(
        'sample-campaign-id',
        'sample-content-id',
        selectedPlatform,
        clientId
      );
      await loadScheduledContent();
    } catch (error) {
      console.error('Error scheduling content:', error);
    } finally {
      setIsScheduling(false);
    }
  };

  const getTemperatureColor = (temperature: string) => {
    switch (temperature) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-GT', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Programación Inteligente</h2>
          <p className="text-gray-600">Optimiza el horario de publicación basado en análisis de audiencia</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {platforms.map(platform => (
                <SelectItem key={platform.value} value={platform.value}>
                  {platform.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={analyzeAudience} disabled={isAnalyzing}>
            {isAnalyzing ? 'Analizando...' : 'Analizar Audiencia'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="analysis" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analysis">Análisis de Audiencia</TabsTrigger>
          <TabsTrigger value="scheduling">Programación</TabsTrigger>
          <TabsTrigger value="calendar">Calendario</TabsTrigger>
        </TabsList>

        <TabsContent value="analysis" className="space-y-4">
          {audienceAnalysis && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Temperatura del Tráfico</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <Badge className={getTemperatureColor(audienceAnalysis.temperature)}>
                    {audienceAnalysis.temperature.toUpperCase()}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    Clasificación basada en engagement histórico
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tasa de Engagement</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {(audienceAnalysis.engagementRate * 100).toFixed(1)}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Promedio de los últimos 30 días
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tamaño de Audiencia</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {audienceAnalysis.audienceSize.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Alcance estimado
                  </p>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Horas Pico de Actividad</CardTitle>
                  <CardDescription>
                    Horarios con mayor engagement de la audiencia
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {audienceAnalysis.peakHours.map(hour => (
                      <Badge key={hour} variant="outline" className="px-3 py-1">
                        {hour}:00
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Demografía de la Audiencia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Grupos de Edad</h4>
                      {Object.entries(audienceAnalysis.demographics.ageGroups).map(([age, percentage]) => (
                        <div key={age} className="flex justify-between text-sm">
                          <span>{age}</span>
                          <span>{(percentage * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Intereses</h4>
                      {Object.entries(audienceAnalysis.demographics.interests).map(([interest, percentage]) => (
                        <div key={interest} className="flex justify-between text-sm">
                          <span>{interest}</span>
                          <span>{(percentage * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Ubicaciones</h4>
                      {Object.entries(audienceAnalysis.demographics.locations).map(([location, percentage]) => (
                        <div key={location} className="flex justify-between text-sm">
                          <span>{location}</span>
                          <span>{(percentage * 100).toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="scheduling" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Horarios Óptimos</h3>
            <Button onClick={calculateOptimalSchedule}>
              Calcular Horarios
            </Button>
          </div>

          {optimalSchedule && (
            <Card>
              <CardHeader>
                <CardTitle>Recomendaciones de Programación</CardTitle>
                <CardDescription>
                  Horarios calculados para máximo engagement
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Engagement Esperado</p>
                    <p className="text-2xl font-bold text-green-600">
                      {(optimalSchedule.expectedEngagement * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Confianza</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {(optimalSchedule.confidence * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Mejores Horarios</h4>
                  <div className="space-y-2">
                    {optimalSchedule.bestTimes.map((time, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatTime(time)}</span>
                        </div>
                        <Badge variant="outline">
                          Opción {index + 1}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Razonamiento</h4>
                  <p className="text-sm text-gray-600">{optimalSchedule.reasoning}</p>
                </div>

                <Button onClick={scheduleContent} disabled={isScheduling} className="w-full">
                  {isScheduling ? 'Programando...' : 'Programar Contenido'}
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Contenido Programado</h3>
            <Button onClick={loadScheduledContent}>
              Actualizar
            </Button>
          </div>

          {scheduledContent.length > 0 ? (
            <div className="space-y-4">
              {scheduledContent.map(schedule => (
                <Card key={schedule.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{schedule.platform}</p>
                          <p className="text-sm text-gray-600">
                            {formatTime(schedule.scheduledTime)}
                          </p>
                        </div>
                        <Badge variant={
                          schedule.status === 'scheduled' ? 'default' :
                          schedule.status === 'published' ? 'secondary' :
                          schedule.status === 'failed' ? 'destructive' : 'outline'
                        }>
                          {schedule.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          Editar
                        </Button>
                        <Button size="sm" variant="outline">
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No hay contenido programado</h3>
                <p className="text-gray-600 mb-4">
                  Programa contenido para verlo en el calendario
                </p>
                <Button onClick={() => document.querySelector('[value="scheduling"]')?.click()}>
                  Programar Contenido
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
