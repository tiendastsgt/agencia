import React, { useState } from 'react'
import { useActiveClient } from '@/lib/client-context'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Loader2, Brain, TrendingUp, Users, Target, BarChart3, FileText, Download } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

export default function AIMarketAnalysis() {
  const { activeClient, clients } = useActiveClient()
  const [selectedClient, setSelectedClient] = useState<typeof activeClient>(activeClient)
  const [analysisType, setAnalysisType] = useState('')
  const [targetMarket, setTargetMarket] = useState('')
  const [competitors, setCompetitors] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState('')

  const analysisTypes = [
    { value: 'competitor_analysis', label: 'Análisis de Competidores' },
    { value: 'market_trends', label: 'Tendencias de Mercado' },
    { value: 'target_audience', label: 'Análisis de Audiencia Objetivo' },
    { value: 'swot_analysis', label: 'Análisis SWOT' },
    { value: 'market_size', label: 'Tamaño del Mercado' },
    { value: 'opportunity_assessment', label: 'Evaluación de Oportunidades' }
  ]

  const runAnalysis = async () => {
    if (!selectedClient || !analysisType || !targetMarket) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    setIsAnalyzing(true)
    setAnalysisResult('')

    try {
      // Simular análisis con IA
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const demoAnalysis = generateDemoAnalysis()
      setAnalysisResult(demoAnalysis)
      toast.success('¡Análisis completado exitosamente!')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al realizar el análisis')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateDemoAnalysis = () => {
    const clientName = selectedClient?.name || 'tu empresa'
    const businessType = selectedClient?.business_type || 'negocio'
    
    return `# Análisis de Mercado - ${clientName}

## 📊 Resumen Ejecutivo

${clientName} opera en el sector de ${businessType} en Guatemala. Este análisis revela oportunidades significativas de crecimiento y posicionamiento en el mercado local.

## 🎯 Análisis de Mercado Objetivo

**Mercado Principal:** ${targetMarket}

### Características Demográficas:
- **Edad:** 25-45 años
- **Ingresos:** Q5,000 - Q15,000 mensuales
- **Ubicación:** Área metropolitana de Guatemala
- **Comportamiento:** Activos en redes sociales, buscan calidad y precio

## 🏆 Análisis de Competencia

${competitors ? `**Competidores identificados:** ${competitors}` : 'Competidores principales en el mercado:'}

### Ventajas Competitivas:
1. **Precio competitivo** - Posicionamiento en rango medio
2. **Calidad del producto** - Estándares superiores
3. **Atención al cliente** - Servicio personalizado
4. **Innovación** - Tecnología y procesos modernos

## 📈 Tendencias del Mercado

### Oportunidades:
- Crecimiento del e-commerce en Guatemala (+25% anual)
- Mayor adopción de pagos digitales
- Demanda creciente de productos de calidad
- Expansión del mercado B2B

### Amenazas:
- Competencia de marcas internacionales
- Fluctuaciones económicas
- Cambios en regulaciones

## 💡 Recomendaciones Estratégicas

### Corto Plazo (3-6 meses):
1. **Optimizar presencia digital** - Mejorar SEO y redes sociales
2. **Programa de fidelización** - Retener clientes existentes
3. **Análisis de precios** - Revisar competitividad

### Mediano Plazo (6-12 meses):
1. **Expansión de productos** - Nuevas líneas de productos
2. **Partnerships estratégicos** - Alianzas comerciales
3. **Marketing digital** - Campañas dirigidas

### Largo Plazo (1-2 años):
1. **Expansión geográfica** - Nuevos mercados
2. **Tecnología** - Automatización y digitalización
3. **Marca** - Posicionamiento premium

## 📊 Métricas Clave a Monitorear

- **Market Share:** Objetivo 15% en 12 meses
- **Customer Acquisition Cost (CAC):** Reducir 20%
- **Customer Lifetime Value (CLV):** Aumentar 30%
- **Net Promoter Score (NPS):** Objetivo >70

---
*Análisis generado con IA para ${clientName} - ${new Date().toLocaleDateString()}*`
  }

  const downloadAnalysis = () => {
    const element = document.createElement('a')
    const file = new Blob([analysisResult], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `analisis-mercado-${selectedClient?.name || 'cliente'}-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
    toast.success('Análisis descargado exitosamente')
  }

  if (!activeClient) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Análisis de Mercado IA</h1>
          <p className="text-gray-600">Selecciona un cliente para realizar análisis</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Análisis de Mercado IA</h1>
          <p className="text-gray-600 mt-2">
            Análisis inteligente de mercado con inteligencia artificial
          </p>
        </div>
        <Badge variant="outline" className="flex items-center gap-2">
          <Brain className="h-4 w-4" />
          GPT-5 Nano 2025
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulario de Análisis */}
        <Card>
          <CardHeader>
            <CardTitle>Configuración del Análisis</CardTitle>
            <CardDescription>
              Define los parámetros para tu análisis de mercado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Selección de Cliente */}
            <div className="space-y-2">
              <Label htmlFor="client">Cliente</Label>
              <Select 
                value={selectedClient?.id || ''} 
                onValueChange={(value) => {
                  const client = clients.find(c => c.id === value)
                  setSelectedClient(client || null)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tipo de Análisis */}
            <div className="space-y-2">
              <Label htmlFor="analysisType">Tipo de Análisis</Label>
              <Select value={analysisType} onValueChange={setAnalysisType}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de análisis" />
                </SelectTrigger>
                <SelectContent>
                  {analysisTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mercado Objetivo */}
            <div className="space-y-2">
              <Label htmlFor="targetMarket">Mercado Objetivo</Label>
              <Input
                id="targetMarket"
                placeholder="Ej: Empresas B2B en Guatemala, Consumidores 25-40 años..."
                value={targetMarket}
                onChange={(e) => setTargetMarket(e.target.value)}
              />
            </div>

            {/* Competidores */}
            <div className="space-y-2">
              <Label htmlFor="competitors">Competidores (Opcional)</Label>
              <Textarea
                id="competitors"
                placeholder="Lista los principales competidores que quieres analizar..."
                value={competitors}
                onChange={(e) => setCompetitors(e.target.value)}
                rows={3}
              />
            </div>

            <Button 
              onClick={runAnalysis} 
              disabled={isAnalyzing || !selectedClient || !analysisType || !targetMarket}
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Brain className="mr-2 h-4 w-4" />
                  Ejecutar Análisis
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Resultado */}
        <Card>
          <CardHeader>
            <CardTitle>Resultado del Análisis</CardTitle>
            <CardDescription>
              Tu análisis de mercado aparecerá aquí
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysisResult ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">Análisis Completado</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadAnalysis}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Descargar
                  </Button>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800">
                    {analysisResult}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Brain className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>El análisis aparecerá aquí</p>
                <p className="text-sm">Completa el formulario y haz clic en "Ejecutar Análisis"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}