import React from 'react'
import APICredentialsManager from '@/components/APICredentialsManager'

export default function ApiConnectionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Configuración de APIs</h1>
        <p className="text-gray-600 mt-1">
          Configura las credenciales de las APIs de redes sociales para obtener métricas en tiempo real.
        </p>
      </div>
      
      <APICredentialsManager />
    </div>
  )
}