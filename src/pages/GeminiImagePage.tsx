import React from 'react'
import ImageGenerator from '../components/ImageGenerator'

export default function GeminiImagePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Generador de Imágenes con Gemini
        </h1>
        <p className="text-gray-600">
          Crea imágenes profesionales usando Google Gemini Imagen con prompts avanzados
        </p>
      </div>
      
      <ImageGenerator />
    </div>
  )
}