import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Loader2, TrendingUp, TrendingDown, Minus, BarChart3, Download, RefreshCw } from 'lucide-react'
import { sentimentAnalysisService } from '@/lib/sentiment-analysis-service'

interface SentimentResult {
  text: string
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  emotions?: {
    joy: number
    sadness: number
    anger: number
    fear: number
    surprise: number
  }
}

interface SentimentReport {
  totalComments: number
  positiveCount: number
  negativeCount: number
  neutralCount: number
  averageSentiment: number
  trendingEmotions: string[]
  topPositiveComments: any[]
  topNegativeComments: any[]
  recommendations: string[]
}

export default function SentimentAnalysis() {
  const [textToAnalyze, setTextToAnalyze] = useState('')
  const [analysisResult, setAnalysisResult] = useState<SentimentResult | null>(null)
  const [report, setReport] = useState<SentimentReport | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [selectedPlatform, setSelectedPlatform] = useState('')

  const analyzeText = async () => {
    if (!textToAnalyze.trim()) {
      setError('Por favor ingresa texto para analizar')
      return
    }

    try {
      setIsLoading(true)
      setError('')
      setSuccess('')

      const result = await sentimentAnalysisService.analyzeText(textToAnalyze)
      setAnalysisResult(result)
      setSuccess('Análisis completado exitosamente')
    } catch (error) {
      console.error('Error analizando texto:', error)
      setError('Error al analizar el texto')
    } finally {
      setIsLoading(false)
    }
  }

  const generateReport = async () => {
    try {
      setIsLoading(true)
      setError('')

      // Simular datos de comentarios para el reporte
      const mockComments = [
        { id: '1', text: '¡Excelente producto! Muy recomendado', author: 'Usuario1', platform: 'facebook', timestamp: '2025-01-12T10:00:00Z' },
        { id: '2', text: 'No me gustó para nada, muy caro', author: 'Usuario2', platform: 'instagram', timestamp: '2025-01-12T11:00:00Z' },
        { id: '3', text: 'Buen servicio, cumplió mis expectativas', author: 'Usuario3', platform: 'twitter', timestamp: '2025-01-12T12:00:00Z' },
        { id: '4', text: 'Regular, podría ser mejor', author: 'Usuario4', platform: 'linkedin', timestamp: '2025-01-12T13:00:00Z' },
        { id: '5', text: '¡Increíble! Superó todas mis expectativas', author: 'Usuario5', platform: 'facebook', timestamp: '2025-01-12T14:00:00Z' }
      ]

      const sentimentData = await sentimentAnalysisService.analyzeComments(mockComments)
      const reportResult = await sentimentAnalysisService.generateReport(sentimentData)
      
      setReport(reportResult)
      setSuccess('Reporte generado exitosamente')
    } catch (error) {
      console.error('Error generando reporte:', error)
      setError('Error al generar el reporte')
    } finally {
      setIsLoading(false)
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'negative': return <TrendingDown className="h-4 w-4 text-red-500" />
      default: return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 bg-green-50 border-green-200'
      case 'negative': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'joy': return 'text-yellow-600'
      case 'sadness': return 'text-blue-600'
      case 'anger': return 'text-red-600'
      case 'fear': return 'text-purple-600'
      case 'surprise': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const exportReport = () => {
    if (!report) return

    const reportData = {
      fecha: new Date().toLocaleDateString(),
      resumen: {
        totalComentarios: report.totalComments,
        sentimientoPromedio: report.averageSentiment,
        positivos: report.positiveCount,
        negativos: report.negativeCount,
        neutrales: report.neutralCount
      },
      emocionesTrending: report.trendingEmotions,
      recomendaciones: report.recommendations
    }

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `reporte-sentimientos-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Análisis de Sentimientos</h1>
          <p className="text-muted-foreground">
            Analiza el sentimiento de comentarios y menciones de tu marca
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="analyze" className="space-y-4">
        <TabsList>
          <TabsTrigger value="analyze">Analizar Texto</TabsTrigger>
          <TabsTrigger value="report">Reporte Completo</TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis Individual</CardTitle>
                <CardDescription>
                  Analiza el sentimiento de un texto específico
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Plataforma</label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="facebook">Facebook</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                      <SelectItem value="general">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Texto a Analizar</label>
                  <Textarea
                    value={textToAnalyze}
                    onChange={(e) => setTextToAnalyze(e.target.value)}
                    placeholder="Ingresa el texto que quieres analizar..."
                    className="min-h-[120px]"
                  />
                </div>

                <Button
                  onClick={analyzeText}
                  disabled={!textToAnalyze.trim() || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analizando...
                    </>
                  ) : (
                    'Analizar Sentimiento'
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resultado del Análisis</CardTitle>
                <CardDescription>
                  Sentimiento y emociones detectadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analysisResult ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg border ${getSentimentColor(analysisResult.sentiment)}`}>
                      <div className="flex items-center space-x-2 mb-2">
                        {getSentimentIcon(analysisResult.sentiment)}
                        <span className="font-semibold capitalize">{analysisResult.sentiment}</span>
                        <Badge variant="outline">
                          {(analysisResult.confidence * 100).toFixed(1)}% confianza
                        </Badge>
                      </div>
                      <p className="text-sm">{analysisResult.text}</p>
                    </div>

                    {analysisResult.emotions && (
                      <div>
                        <h4 className="font-medium mb-3">Emociones Detectadas</h4>
                        <div className="space-y-2">
                          {Object.entries(analysisResult.emotions).map(([emotion, value]) => (
                            <div key={emotion} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className={`capitalize ${getEmotionColor(emotion)}`}>
                                  {emotion}
                                </span>
                                <span>{(value * 100).toFixed(1)}%</span>
                              </div>
                              <Progress value={value * 100} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Ingresa texto para ver el análisis de sentimientos</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="report" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Reporte de Sentimientos</CardTitle>
                  <CardDescription>
                    Análisis completo de comentarios y menciones
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={generateReport}
                    disabled={isLoading}
                    variant="outline"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Generar Reporte
                  </Button>
                  {report && (
                    <Button onClick={exportReport} variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exportar
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : report ? (
                <div className="space-y-6">
                  {/* Resumen General */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{report.totalComments}</div>
                      <div className="text-sm text-muted-foreground">Total Comentarios</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{report.positiveCount}</div>
                      <div className="text-sm text-muted-foreground">Positivos</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-red-600">{report.negativeCount}</div>
                      <div className="text-sm text-muted-foreground">Negativos</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-gray-600">{report.neutralCount}</div>
                      <div className="text-sm text-muted-foreground">Neutrales</div>
                    </div>
                  </div>

                  {/* Sentimiento Promedio */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Sentimiento Promedio</h4>
                    <div className="flex items-center space-x-4">
                      <Progress 
                        value={((report.averageSentiment + 1) / 2) * 100} 
                        className="flex-1 h-3" 
                      />
                      <span className="text-sm font-medium">
                        {report.averageSentiment > 0.3 ? 'Positivo' : 
                         report.averageSentiment < -0.3 ? 'Negativo' : 'Neutral'}
                      </span>
                    </div>
                  </div>

                  {/* Emociones Trending */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Emociones Trending</h4>
                    <div className="flex flex-wrap gap-2">
                      {report.trendingEmotions.map((emotion, index) => (
                        <Badge key={index} variant="outline" className={getEmotionColor(emotion)}>
                          {emotion}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Comentarios Destacados */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-3 text-green-600">Comentarios Más Positivos</h4>
                      <div className="space-y-2">
                        {report.topPositiveComments.slice(0, 3).map((comment, index) => (
                          <div key={index} className="text-sm p-2 bg-green-50 rounded">
                            "{comment.text}"
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-3 text-red-600">Comentarios Más Negativos</h4>
                      <div className="space-y-2">
                        {report.topNegativeComments.slice(0, 3).map((comment, index) => (
                          <div key={index} className="text-sm p-2 bg-red-50 rounded">
                            "{comment.text}"
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Recomendaciones */}
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Recomendaciones</h4>
                    <ul className="space-y-2">
                      {report.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-sm flex items-start space-x-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{recommendation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Genera un reporte para ver el análisis completo</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
