import React from 'react'
import PlaceholderPage from './PlaceholderPage'
import { Image } from 'lucide-react'

export default function ImageGenerationPage() {
  return (
    <PlaceholderPage
      title="Generación de Imágenes"
      description="Sistema avanzado de generación de imágenes con IA"
      icon={Image}
      version="v2.2.0"
      features={[
        "DALL-E 3 integrado",
        "Múltiples estilos",
        "Optimización para redes sociales",
        "Batch processing",
        "API personalizada"
      ]}
      comingSoon={[
        "Stable Diffusion",
        "Midjourney integration",
        "Video generation",
        "3D model generation",
        "Real-time editing"
      ]}
    />
  )
}