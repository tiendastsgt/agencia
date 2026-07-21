import React from 'react'
import PlaceholderPage from './PlaceholderPage'
import { BarChart3 } from 'lucide-react'

export default function GoogleAnalyticsPage() {
  return (
    <PlaceholderPage
      title="Google Analytics"
      description="Integración completa con Google Analytics 4"
      icon={BarChart3}
      version="v2.3.0"
      features={[
        "Integración con GA4",
        "Análisis de tráfico web",
        "Conversiones y objetivos",
        "Audiencias personalizadas",
        "Reportes automáticos"
      ]}
      comingSoon={[
        "Predicción de comportamiento",
        "Optimización automática",
        "Integración con Google Ads",
        "Análisis de embudo",
        "Reportes personalizados"
      ]}
    />
  )
}