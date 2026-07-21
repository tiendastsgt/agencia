import React from 'react'
import SentimentAnalyzer from '@/components/SentimentAnalyzer'

export default function SentimentAnalysisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Análisis de Sentimientos</h1>
        <p className="text-gray-600">Analiza el sentimiento de textos usando múltiples APIs de IA</p>
      </div>
      
      <SentimentAnalyzer />
    </div>
  )
}
