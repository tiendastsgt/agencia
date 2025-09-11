import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { supabase } from '@/lib/supabase'
import { Search, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

export default function CheckLiendrexData() {
  const [isChecking, setIsChecking] = useState(false)
  const [liendrexData, setLiendrexData] = useState<any>(null)
  const [errorCampaigns, setErrorCampaigns] = useState<any[]>([])

  const checkLiendrexData = async () => {
    try {
      setIsChecking(true)
      
      // Buscar el cliente Liendrex
      const { data: liendrexClient, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .ilike('name', '%liendrex%')
        .single()
      
      if (clientError) {
        console.error('Error al buscar cliente Liendrex:', clientError)
        return
      }
      
      if (!liendrexClient) {
        console.log('No se encontró el cliente Liendrex')
        return
      }
      
      setLiendrexData(liendrexClient)
      
      // Buscar campañas de Liendrex
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('client_id', liendrexClient.id)
      
      if (campaignsError) {
        console.error('Error al buscar campañas:', campaignsError)
        return
      }
      
      // Filtrar campañas erróneas
      const errorCampaigns = campaigns.filter(campaign => 
        campaign.name.toLowerCase().includes('marketing digital') ||
        campaign.description.toLowerCase().includes('marketing digital') ||
        campaign.objective.toLowerCase().includes('marketing digital')
      )
      
      setErrorCampaigns(errorCampaigns)
      
    } catch (error) {
      console.error('Error general:', error)
    } finally {
      setIsChecking(false)
    }
  }

  useEffect(() => {
    checkLiendrexData()
  }, [])

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Verificar Datos de Liendrex
        </CardTitle>
        <CardDescription>
          Revisa la información del cliente Liendrex y sus campañas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={checkLiendrexData}
          disabled={isChecking}
          className="w-full"
        >
          {isChecking ? (
            <>
              <Search className="h-4 w-4 mr-2 animate-spin" />
              Verificando...
            </>
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Verificar Datos
            </>
          )}
        </Button>

        {liendrexData && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Información del Cliente Liendrex</h3>
            <div className="space-y-1 text-sm text-blue-800">
              <p><strong>Nombre:</strong> {liendrexData.name}</p>
              <p><strong>Industria:</strong> {liendrexData.industry}</p>
              <p><strong>Descripción:</strong> {liendrexData.description}</p>
              <p><strong>Estado:</strong> 
                <Badge variant={liendrexData.is_active ? "default" : "secondary"} className="ml-2">
                  {liendrexData.is_active ? "Activo" : "Inactivo"}
                </Badge>
              </p>
            </div>
          </div>
        )}

        {errorCampaigns.length > 0 && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="h-5 w-5 text-red-600" />
              <h3 className="font-medium text-red-900">
                Campañas Erróneas Encontradas ({errorCampaigns.length})
              </h3>
            </div>
            <div className="space-y-2">
              {errorCampaigns.map((campaign) => (
                <div key={campaign.id} className="p-3 bg-white border border-red-200 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-red-900">{campaign.name}</h4>
                    <Badge variant="destructive">Errónea</Badge>
                  </div>
                  <p className="text-sm text-red-700 mb-2">{campaign.description}</p>
                  <p className="text-sm text-red-600">
                    <strong>Objetivo:</strong> {campaign.objective}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {liendrexData && errorCampaigns.length === 0 && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-medium text-green-900">
                ✅ No se encontraron campañas erróneas
              </h3>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Todas las campañas de Liendrex tienen información correcta sobre productos anti-piojos.
            </p>
          </div>
        )}

        {!liendrexData && !isChecking && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <h3 className="font-medium text-yellow-900">
                Cliente Liendrex no encontrado
              </h3>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              No se encontró un cliente con el nombre "Liendrex" en la base de datos.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
