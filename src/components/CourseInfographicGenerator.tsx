import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Progress } from '@/components/ui/progress'
import { Loader2, Upload, BookOpen, Calendar, Users, Target, CheckCircle, Sparkles, FileText, X, Eye } from 'lucide-react'
import { toast } from 'sonner'
import { InfographicData } from '@/lib/types/infographic'
import { infographicService } from '@/lib/infographic-service'
import { infographicImageService } from '@/lib/infographic-image-service'
import { infographicCompositionService } from '@/lib/infographic-composition-service'
import ProfessionalInfographicRenderer from './ProfessionalInfographicRenderer'

interface CourseData {
  nombre: string
  nivel: number
  objetivos: string[]
  resumen: string
  público_objetivo: string
  razón_para_tomarlo: string
  contenido: Array<{
    módulo: string
    actividades: string[]
  }>
  duración: string
  modalidad_piloto: string
  requisitos_profesor: string
  ruta: string
  créditos: number
}

interface CourseFile {
  file: File
  data: CourseData
  infographicData?: InfographicData
  status: 'pending' | 'converted' | 'generating' | 'completed' | 'error'
  error?: string
}

interface CourseInfographicGeneratorProps {
  onInfographicGenerated?: (infographicData: InfographicData) => void
}

export default function CourseInfographicGenerator({ onInfographicGenerated }: CourseInfographicGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [courseFiles, setCourseFiles] = useState<CourseFile[]>([])
  const [selectedProvider, setSelectedProvider] = useState<'dalle' | 'stability' | 'gemini'>('gemini')
  const [generatingProgress, setGeneratingProgress] = useState(0)
  const [previewInfographic, setPreviewInfographic] = useState<InfographicData | null>(null)
  const [useVisualElements, setUseVisualElements] = useState(true)
  const [compositionStyle, setCompositionStyle] = useState<'modern' | 'classic' | 'minimalist' | 'creative'>('modern')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const newCourseFiles: CourseFile[] = []

    for (const file of Array.from(files)) {
      if (file.type !== 'application/json') {
        toast.error(`El archivo ${file.name} no es un JSON válido`)
        continue
      }

      try {
        const text = await file.text()
        const courseData: CourseData = JSON.parse(text)
        
        newCourseFiles.push({
          file,
          data: courseData,
          status: 'pending'
        })
      } catch (error) {
        toast.error(`Error al procesar ${file.name}: Formato JSON inválido`)
      }
    }

    if (newCourseFiles.length > 0) {
      setCourseFiles(prev => [...prev, ...newCourseFiles])
      toast.success(`${newCourseFiles.length} archivo(s) cargado(s) correctamente`)
    }
  }

  const removeFile = (index: number) => {
    setCourseFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleDownloadInfographic = async (courseFile: CourseFile, provider: 'dalle' | 'stability' | 'gemini' = 'gemini') => {
    if (!courseFile.infographicData) {
      toast.error('No hay datos de infografía para descargar')
      return
    }

    try {
      await infographicImageService.downloadInfographicAsImage(
        courseFile.infographicData,
        `${courseFile.data.nombre.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_infografia.png`,
        provider
      )
      toast.success(`Infografía generada con ${provider.toUpperCase()} y descargada correctamente`)
    } catch (error) {
      console.error('Error al descargar infografía:', error)
      toast.error(`Error al descargar: ${error instanceof Error ? error.message : 'Error desconocido'}`)
    }
  }

  const handlePreviewInfographic = (courseFile: CourseFile) => {
    if (courseFile.infographicData) {
      setPreviewInfographic(courseFile.infographicData)
    }
  }

  const convertAllCourses = async () => {
    if (courseFiles.length === 0) {
      toast.error('Primero carga los archivos JSON de los cursos')
      return
    }

    try {
      setLoading(true)
      const updatedFiles = [...courseFiles]

      for (let i = 0; i < updatedFiles.length; i++) {
        const courseFile = updatedFiles[i]
        if (courseFile.status !== 'pending') continue

        try {
          // Usar el nuevo sistema de composición con elementos visuales
          const compositionResult = await infographicCompositionService.createComposition({
            courseData: courseFile.data,
            useVisualElements: useVisualElements,
            compositionStyle: compositionStyle,
            includeIcons: true,
            includeDecorative: true
          })

          if (compositionResult.success && compositionResult.infographicData) {
            updatedFiles[i] = {
              ...courseFile,
              infographicData: compositionResult.infographicData,
              status: 'converted'
            }
            
            toast.success(`✅ ${courseFile.data.nombre} convertido con elementos visuales`)
          } else {
            throw new Error(compositionResult.error || 'Error en la composición')
          }

          setCourseFiles([...updatedFiles])
        } catch (error) {
          console.error('Error al convertir curso:', error)
          updatedFiles[i] = {
            ...courseFile,
            status: 'error',
            error: `Error al convertir: ${error instanceof Error ? error.message : 'Error desconocido'}`
          }
          setCourseFiles([...updatedFiles])
        }
      }

      const convertedCount = updatedFiles.filter(f => f.status === 'converted').length
      const errorCount = updatedFiles.filter(f => f.status === 'error').length

      if (convertedCount > 0) {
        toast.success(`🎉 ${convertedCount} curso(s) convertido(s) con elementos visuales`)
      }
      if (errorCount > 0) {
        toast.error(`❌ ${errorCount} curso(s) fallaron en la conversión`)
      }

    } catch (error) {
      console.error('Error general al convertir cursos:', error)
      toast.error('Error al convertir cursos')
    } finally {
      setLoading(false)
    }
  }

  const generateAllInfographics = async () => {
    const convertedFiles = courseFiles.filter(f => f.status === 'converted')
    if (convertedFiles.length === 0) {
      toast.error('Primero convierte los cursos a infografías')
      return
    }

    try {
      setLoading(true)
      setGeneratingProgress(0)
      const updatedFiles = [...courseFiles]

      for (let i = 0; i < convertedFiles.length; i++) {
        const courseFile = convertedFiles[i]
        const fileIndex = courseFiles.findIndex(f => f.file.name === courseFile.file.name)
        
        try {
          // Actualizar estado a generando
          updatedFiles[fileIndex] = {
            ...courseFile,
            status: 'generating'
          }
          setCourseFiles([...updatedFiles])

          const response = await infographicService.generateInfographic({
            data: courseFile.infographicData!,
            provider: selectedProvider,
            size: '1024x1792',
            quality: 'hd',
            count: 1
          })

          if (response.success) {
            // Guardar la infografía en la base de datos
            try {
              const infographicRecord = {
                title: courseFile.infographicData!.title,
                data: courseFile.infographicData!,
                status: 'completed'
                // tags: courseFile.infographicData!.metadata?.tags || [], // Temporarily removed - column doesn't exist
                // generated_images: response.images, // Temporarily removed - column doesn't exist
                // description: courseFile.infographicData!.description || courseFile.infographicData!.subtitle || '', // Temporarily removed
                // category: courseFile.infographicData!.metadata?.category || 'education' // Temporarily removed
              }
              
              await infographicService.saveInfographic(infographicRecord)
              
              updatedFiles[fileIndex] = {
                ...courseFile,
                status: 'completed'
              }
              onInfographicGenerated?.(courseFile.infographicData!)
            } catch (saveError) {
              console.error('Error al guardar infografía:', saveError)
              updatedFiles[fileIndex] = {
                ...courseFile,
                status: 'error',
                error: `Error al guardar: ${saveError.message}`
              }
            }
          } else {
            updatedFiles[fileIndex] = {
              ...courseFile,
              status: 'error',
              error: response.error || 'Error al generar infografía'
            }
          }
        } catch (error) {
          updatedFiles[fileIndex] = {
            ...courseFile,
            status: 'error',
            error: 'Error al generar infografía'
          }
        }

        setCourseFiles([...updatedFiles])
        setGeneratingProgress(((i + 1) / convertedFiles.length) * 100)
      }

      const completed = updatedFiles.filter(f => f.status === 'completed').length
      const errors = updatedFiles.filter(f => f.status === 'error').length

      if (completed > 0) {
        toast.success(`${completed} infografía(s) generada(s) correctamente con ${selectedProvider.toUpperCase()}`)
      }
      if (errors > 0) {
        toast.error(`${errors} infografía(s) fallaron en la generación`)
      }

    } catch (error) {
      toast.error('Error al generar infografías')
    } finally {
      setLoading(false)
      setGeneratingProgress(0)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FileText className="h-4 w-4 text-gray-500" />
      case 'converted': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'generating': return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
      case 'completed': return <Sparkles className="h-4 w-4 text-green-600" />
      case 'error': return <X className="h-4 w-4 text-red-500" />
      default: return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-gray-100 text-gray-800'
      case 'converted': return 'bg-green-100 text-green-800'
      case 'generating': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Sparkles className="h-8 w-8 text-green-600" />
        <div>
          <h2 className="text-2xl font-bold">Generador de Infografías para Cursos</h2>
          <p className="text-muted-foreground">
            Sube archivos JSON de cursos y genera infografías profesionales automáticamente
          </p>
        </div>
      </div>

      {/* Panel de carga de archivos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Cargar Archivos JSON de Cursos
          </CardTitle>
          <CardDescription>
            Selecciona uno o múltiples archivos JSON con los datos de los cursos
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Arrastra archivos JSON aquí o haz clic para seleccionar</p>
            <p className="text-sm text-muted-foreground mb-4">
              Puedes seleccionar múltiples archivos a la vez
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
            >
              <Upload className="mr-2 h-4 w-4" />
              Seleccionar Archivos
            </Button>
          </div>

          {courseFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Archivos Cargados ({courseFiles.length})</Label>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {courseFiles.map((courseFile, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(courseFile.status)}
                      <div>
                        <p className="font-medium">{courseFile.data.nombre}</p>
                        <p className="text-sm text-muted-foreground">
                          {courseFile.data.duración} • {courseFile.data.contenido.length} módulos
                        </p>
                        {courseFile.error && (
                          <p className="text-sm text-red-600">{courseFile.error}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(courseFile.status)}>
                        {courseFile.status}
                      </Badge>
                      {courseFile.status === 'completed' && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePreviewInfographic(courseFile)}
                            title="Ver infografía"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadInfographic(courseFile)}
                            title="Descargar infografía"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Panel de acciones */}
      {courseFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Procesar Cursos</CardTitle>
            <CardDescription>
              Convierte los cursos a infografías y genera las imágenes
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="provider-select">Proveedor de IA</Label>
                <Select value={selectedProvider} onValueChange={(value: 'dalle' | 'stability' | 'gemini') => setSelectedProvider(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini">🤖 Google Gemini (Recomendado)</SelectItem>
                    <SelectItem value="dalle">🎨 DALL-E 3 (OpenAI)</SelectItem>
                    <SelectItem value="stability">⚡ Stability AI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="style-select">Estilo de Composición</Label>
                <Select value={compositionStyle} onValueChange={(value: 'modern' | 'classic' | 'minimalist' | 'creative') => setCompositionStyle(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estilo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modern">🎨 Moderno</SelectItem>
                    <SelectItem value="classic">📚 Clásico</SelectItem>
                    <SelectItem value="minimalist">✨ Minimalista</SelectItem>
                    <SelectItem value="creative">🎭 Creativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="use-visual-elements"
                checked={useVisualElements}
                onChange={(e) => setUseVisualElements(e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="use-visual-elements" className="text-sm font-medium">
                🎨 Usar elementos visuales generados (fondos, iconos, ilustraciones)
              </Label>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={convertAllCourses} 
                disabled={loading || courseFiles.filter(f => f.status === 'pending').length === 0}
                className="flex-1"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}
                Convertir a Infografías ({courseFiles.filter(f => f.status === 'pending').length})
              </Button>
              
              <Button 
                onClick={generateAllInfographics} 
                disabled={loading || courseFiles.filter(f => f.status === 'converted').length === 0}
                className="flex-1"
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generar Imágenes ({courseFiles.filter(f => f.status === 'converted').length})
              </Button>
            </div>

            {generatingProgress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Generando infografías...</span>
                  <span>{Math.round(generatingProgress)}%</span>
                </div>
                <Progress value={generatingProgress} className="w-full" />
              </div>
            )}

            <div className="text-sm text-muted-foreground space-y-2">
              <div>
                <p className="font-semibold">🎨 Elementos Visuales:</p>
                <p>• Fondos temáticos por categoría de curso</p>
                <p>• Ilustraciones principales personalizadas</p>
                <p>• Iconos temáticos específicos</p>
                <p>• Elementos decorativos y patrones</p>
              </div>
              <div>
                <p className="font-semibold">🤖 Proveedores de IA:</p>
                <p><strong>Gemini:</strong> Optimizado para infografías educativas y contenido profesional</p>
                <p><strong>DALL-E 3:</strong> Excelente para diseños creativos y artísticos</p>
                <p><strong>Stability AI:</strong> Rápido y eficiente para contenido masivo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Ejemplo de JSON */}
      <Card>
        <CardHeader>
          <CardTitle>Formato de Archivo JSON</CardTitle>
          <CardDescription>
            Cada archivo JSON debe contener los datos de un curso con esta estructura
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
{`{
  "nombre": "Apicultura Urbana: Produce tu Propia Miel",
  "nivel": 0,
  "objetivos": [
    "Iniciarse en la apicultura de forma segura",
    "Contribuir a la conservación de polinizadores",
    "Producir miel para consumo familiar"
  ],
  "resumen": "Curso introductorio sobre apicultura urbana...",
  "público_objetivo": "Jóvenes adultos y padres de familia",
  "contenido": [
    {
      "módulo": "Fundamentos de Apicultura",
      "actividades": ["Conocimiento de biología", "Taller de equipos"]
    }
  ],
  "duración": "6 semanas (12 sesiones de 2 horas)",
  "créditos": 3
}`}
          </pre>
        </CardContent>
      </Card>

      {/* Modal para vista previa de infografía */}
      {previewInfographic && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Vista Previa de la Infografía</h2>
                <Button variant="outline" onClick={() => setPreviewInfographic(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="border rounded-lg overflow-hidden">
                <ProfessionalInfographicRenderer 
                  data={previewInfographic} 
                  className="max-w-full"
                />
              </div>
              
              <div className="space-y-4 mt-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="provider-select">Proveedor de IA:</Label>
                  <Select defaultValue="gemini">
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Selecciona proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gemini">🤖 Google Gemini (Recomendado)</SelectItem>
                      <SelectItem value="dalle">🎨 DALL-E 3 (OpenAI)</SelectItem>
                      <SelectItem value="stability">⚡ Stability AI</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex gap-2">
                  <Button onClick={() => {
                    if (previewInfographic) {
                      handleDownloadInfographic({ data: { nombre: previewInfographic.title || 'Infografía' }, infographicData: previewInfographic } as CourseFile, 'gemini')
                    }
                  }}>
                    <FileText className="h-4 w-4 mr-2" />
                    Generar con Gemini
                  </Button>
                  <Button variant="outline" onClick={() => {
                    if (previewInfographic) {
                      handleDownloadInfographic({ data: { nombre: previewInfographic.title || 'Infografía' }, infographicData: previewInfographic } as CourseFile, 'dalle')
                    }
                  }}>
                    <FileText className="h-4 w-4 mr-2" />
                    Generar con DALL-E
                  </Button>
                  <Button variant="outline" onClick={() => setPreviewInfographic(null)}>
                    Cerrar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
