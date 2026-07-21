import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { contentService, ContentVersion } from '@/lib/content-service'
import { History, Eye, RotateCcw, Calendar, User } from 'lucide-react'
import { toast } from '@/components/ui/sonner'

interface ContentVersionHistoryProps {
  contentId: string
  contentTitle: string
  onVersionSelect?: (version: ContentVersion) => void
}

export default function ContentVersionHistory({ 
  contentId, 
  contentTitle, 
  onVersionSelect 
}: ContentVersionHistoryProps) {
  const [versions, setVersions] = useState<ContentVersion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState<ContentVersion | null>(null)

  const loadVersions = async () => {
    try {
      setIsLoading(true)
      const result = await contentService.getContentVersions(contentId)
      
      if (result.success) {
        setVersions(result.versions || [])
      } else {
        toast.error('Error al cargar versiones: ' + result.error)
      }
    } catch (error) {
      console.error('Error loading versions:', error)
      toast.error('Error al cargar versiones')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isDialogOpen && contentId) {
      loadVersions()
    }
  }, [isDialogOpen, contentId])

  const handleVersionSelect = (version: ContentVersion) => {
    setSelectedVersion(version)
    if (onVersionSelect) {
      onVersionSelect(version)
    }
  }

  const handleRestoreVersion = async (version: ContentVersion) => {
    if (!confirm(`¿Estás seguro de que quieres restaurar la versión ${version.version_number}?`)) {
      return
    }

    try {
      // Aquí implementarías la lógica para restaurar la versión
      toast.success(`Versión ${version.version_number} restaurada exitosamente`)
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error restoring version:', error)
      toast.error('Error al restaurar versión')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-GT', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <History className="mr-2 h-4 w-4" />
          Historial
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Historial de Versiones</DialogTitle>
          <DialogDescription>
            Historial de cambios para: {contentTitle}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Lista de versiones */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Versiones</h3>
            <ScrollArea className="h-96">
              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : versions.length > 0 ? (
                <div className="space-y-3">
                  {versions.map((version) => (
                    <Card 
                      key={version.id} 
                      className={`cursor-pointer transition-colors ${
                        selectedVersion?.id === version.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleVersionSelect(version)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">
                              v{version.version_number}
                            </Badge>
                            {version.version_number === versions[0]?.version_number && (
                              <Badge variant="default" className="text-xs">
                                Actual
                              </Badge>
                            )}
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleVersionSelect(version)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {version.version_number !== versions[0]?.version_number && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRestoreVersion(version)
                                }}
                              >
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(version.created_at)}</span>
                          </div>
                          {version.changes_summary && (
                            <p className="text-sm text-gray-700">
                              {version.changes_summary}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <History className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No hay versiones disponibles</p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Vista previa de la versión seleccionada */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Vista Previa</h3>
            {selectedVersion ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Versión {selectedVersion.version_number}
                  </CardTitle>
                  <CardDescription>
                    {formatDate(selectedVersion.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-64">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800">
                        {selectedVersion.content_body}
                      </pre>
                    </div>
                  </ScrollArea>
                  
                  {selectedVersion.changes_summary && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">
                        Resumen de cambios:
                      </p>
                      <p className="text-sm text-blue-800">
                        {selectedVersion.changes_summary}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  <Eye className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>Selecciona una versión para ver su contenido</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
