import React from 'react'
import PlaceholderPage from './PlaceholderPage'
import { Youtube } from 'lucide-react'

export default function YouTubePage() {
  return (
    <PlaceholderPage
      title="YouTube Analytics"
      description="Gestión completa de canales de YouTube"
      icon={Youtube}
      version="v2.3.0"
      features={[
        "Gestión de canales",
        "Análisis de videos",
        "Métricas de audiencia",
        "Optimización de SEO",
        "Programación de videos"
      ]}
      comingSoon={[
        "Análisis de competencia",
        "Optimización de thumbnails",
        "Predicción de tendencias",
        "Automatización de respuestas",
        "Monetización analytics"
      ]}
    />
  )
}