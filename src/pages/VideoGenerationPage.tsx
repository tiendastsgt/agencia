import React from 'react'
import PlaceholderPage from './PlaceholderPage'
import { Video } from 'lucide-react'

export default function VideoGenerationPage() {
  return (
    <PlaceholderPage
      title="Generación de Videos"
      description="Creación de videos con inteligencia artificial"
      icon={Video}
      version="v2.3.0"
      features={[
        "Generación de videos cortos",
        "Edición automática",
        "Múltiples formatos",
        "Optimización para redes sociales",
        "Templates personalizados"
      ]}
      comingSoon={[
        "AI voiceover",
        "Motion graphics",
        "3D animations",
        "Real-time rendering",
        "Collaborative editing"
      ]}
    />
  )
}