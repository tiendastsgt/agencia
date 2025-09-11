import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/sonner'
import { Trash2, CheckCircle, AlertTriangle } from 'lucide-react'

export default function CleanLiendrexCampaigns() {
  const [isCleaning, setIsCleaning] = useState(false)
  const [cleaned, setCleaned] = useState(false)
  const [foundCampaigns, setFoundCampaigns] = useState<any[]>([])

  const findAndCleanCampaigns = async () => {
    try {
      setIsCleaning(true)
      
      // Buscar el cliente Liendrex
      const { data: liendrexClient, error: clientError } = await supabase
        .from('clients')
        .select('id, name')
        .ilike('name', '%liendrex%')
        .single()
      
      if (clientError) {
        console.error('Error al buscar cliente Liendrex:', clientError)
        toast.error('Error al buscar cliente Liendrex')
        return
      }
      
      if (!liendrexClient) {
        toast.error('No se encontró el cliente Liendrex')
        return
      }
      
      console.log(`Cliente encontrado: ${liendrexClient.name} (ID: ${liendrexClient.id})`)
      
      // Buscar campañas erróneas de Liendrex que mencionen "marketing digital"
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('client_id', liendrexClient.id)
        .or('name.ilike.%marketing digital%,description.ilike.%marketing digital%')
      
      if (campaignsError) {
        console.error('Error al buscar campañas:', campaignsError)
        toast.error('Error al buscar campañas')
        return
      }
      
      console.log(`Encontradas ${campaigns.length} campañas erróneas de Liendrex`)
      setFoundCampaigns(campaigns)
      
      if (campaigns.length === 0) {
        toast.success('✅ No se encontraron campañas erróneas de Liendrex')
        setCleaned(true)
        return
      }
      
      // Eliminar cada campaña errónea
      for (const campaign of campaigns) {
        console.log(`Eliminando campaña errónea: ${campaign.name}`)
        
        const { error: deleteError } = await supabase
          .from('campaigns')
          .delete()
          .eq('id', campaign.id)
        
        if (deleteError) {
          console.error(`Error al eliminar campaña ${campaign.name}:`, deleteError)
          toast.error(`Error al eliminar campaña ${campaign.name}`)
        } else {
          console.log(`✅ Campaña eliminada: ${campaign.name}`)
        }
      }
      
      setCleaned(true)
      toast.success(`✅ ${campaigns.length} campañas erróneas de Liendrex eliminadas correctamente`)
      
    } catch (error) {
      console.error('Error general:', error)
      toast.error('Error al limpiar las campañas')
    } finally {
      setIsCleaning(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="h-5 w-5" />
          Limpiar Campañas Erróneas de Liendrex
        </CardTitle>
        <CardDescription>
          Busca y elimina campañas de Liendrex que mencionen incorrectamente "marketing digital"
        </CardDescription>
      </CardHeader>
      <CardContent>
        {foundCampaigns.length > 0 && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                Campañas erróneas encontradas:
              </span>
            </div>
            <ul className="text-sm text-yellow-700 space-y-1">
              {foundCampaigns.map((campaign) => (
                <li key={campaign.id}>• {campaign.name}</li>
              ))}
            </ul>
          </div>
        )}
        
        <Button 
          onClick={findAndCleanCampaigns}
          disabled={isCleaning || cleaned}
          className="w-full"
          variant={foundCampaigns.length > 0 ? "destructive" : "default"}
        >
          {isCleaning ? (
            <>
              <Trash2 className="h-4 w-4 mr-2 animate-spin" />
              Limpiando...
            </>
          ) : cleaned ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Limpiado
            </>
          ) : (
            <>
              <Trash2 className="h-4 w-4 mr-2" />
              Buscar y Limpiar Campañas
            </>
          )}
        </Button>
        
        {cleaned && (
          <p className="text-sm text-green-600 mt-2">
            ✅ Las campañas erróneas han sido eliminadas. Recarga la página para ver los cambios.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
