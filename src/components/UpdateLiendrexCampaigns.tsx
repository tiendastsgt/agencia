import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { toast } from '@/components/ui/sonner'
import { RefreshCw, CheckCircle } from 'lucide-react'

export default function UpdateLiendrexCampaigns() {
  const [isUpdating, setIsUpdating] = useState(false)
  const [updated, setUpdated] = useState(false)

  const updateCampaigns = async () => {
    try {
      setIsUpdating(true)
      
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
      
      
      // Buscar campañas de Liendrex
      const { data: campaigns, error: campaignsError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('client_id', liendrexClient.id)
      
      if (campaignsError) {
        console.error('Error al buscar campañas:', campaignsError)
        toast.error('Error al buscar campañas')
        return
      }
      
      
      // Actualizar cada campaña
      for (const campaign of campaigns) {
        
        const updatedCampaign = {
          name: campaign.name.replace('marketing digital', 'productos anti-piojos naturales'),
          description: campaign.description.replace('marketing digital', 'productos anti-piojos naturales'),
          campaign_type: 'Product Launch',
          objective: 'Posicionar Liendrex como líder en productos anti-piojos naturales en Guatemala',
          target_audience: {
            primary: 'Madres de familia con hijos en edad escolar (25-45 años)',
            secondary: 'Padres preocupados por la salud de sus hijos',
            demographics: {
              age: '25-45 años',
              gender: 'Principalmente mujeres',
              location: 'Guatemala y Centroamérica',
              income: 'Clase media',
              interests: ['salud infantil', 'productos naturales', 'cuidado familiar']
            }
          },
          russell_brunson_framework: 'Dream 100 Strategy',
          value_ladder: {
            step1: 'Peine Lendrera (Q44.00) - Producto de entrada',
            step2: 'Shampoo Repelente (Q33.00) - Producto principal',
            step3: 'Gel Repelente (Q33.00) - Producto complementario',
            step4: 'Kit Completo - Oferta de valor agregado'
          },
          updated_at: new Date().toISOString()
        }
        
        const { error: updateError } = await supabase
          .from('campaigns')
          .update(updatedCampaign)
          .eq('id', campaign.id)
        
        if (updateError) {
          console.error(`Error al actualizar campaña ${campaign.name}:`, updateError)
          toast.error(`Error al actualizar campaña ${campaign.name}`)
        } else {
        }
      }
      
      setUpdated(true)
      toast.success(`✅ ${campaigns.length} campañas de Liendrex actualizadas correctamente`)
      
    } catch (error) {
      console.error('Error general:', error)
      toast.error('Error al actualizar las campañas')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Actualizar Campañas Liendrex
        </CardTitle>
        <CardDescription>
          Actualiza las campañas de Liendrex con la información correcta sobre productos anti-piojos
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={updateCampaigns}
          disabled={isUpdating || updated}
          className="w-full"
        >
          {isUpdating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Actualizando...
            </>
          ) : updated ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Actualizado
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar Campañas
            </>
          )}
        </Button>
        
        {updated && (
          <p className="text-sm text-green-600 mt-2">
            ✅ Las campañas han sido actualizadas. Recarga la página para ver los cambios.
          </p>
        )}
      </CardContent>
    </Card>
  )
}













