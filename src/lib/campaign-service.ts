import { supabase } from './supabase'
import { Campaign } from './supabase'

export interface CreateCampaignRequest {
  name: string
  description?: string
  campaign_type: string
  objective?: string
  budget?: number
  start_date: string
  end_date: string
  status?: 'draft' | 'active' | 'paused' | 'completed'
  target_audience?: any
  russell_brunson_framework?: string
  value_ladder?: any
}

export interface CampaignMetrics {
  campaign_id: string
  total_content: number
  published_content: number
  scheduled_content: number
  total_engagement: number
  total_reach: number
  total_clicks: number
  conversion_rate: number
  cost_per_acquisition: number
  roi: number
}

class CampaignService {
  /**
   * Crea una nueva campaña
   */
  async createCampaign(
    campaignData: CreateCampaignRequest,
    clientId: string,
    userId: string
  ): Promise<{ success: boolean; campaignId?: string; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{
          ...campaignData,
          client_id: clientId,
          created_by: userId
        }])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        campaignId: data.id
      }
    } catch (error) {
      console.error('Error creating campaign:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Obtiene campañas por cliente
   */
  async getCampaignsByClient(clientId: string): Promise<{ success: boolean; campaigns?: Campaign[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        campaigns: data || []
      }
    } catch (error) {
      console.error('Error getting campaigns by client:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Obtiene una campaña por ID
   */
  async getCampaignById(campaignId: string): Promise<{ success: boolean; campaign?: Campaign; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single()

      if (error) throw error

      return {
        success: true,
        campaign: data
      }
    } catch (error) {
      console.error('Error getting campaign by ID:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Actualiza una campaña
   */
  async updateCampaign(
    campaignId: string,
    updates: Partial<CreateCampaignRequest>
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Error updating campaign:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Elimina una campaña
   */
  async deleteCampaign(campaignId: string): Promise<{ success: boolean; error?: string }> {
    try {
      // Primero eliminar contenido asociado
      const { error: contentError } = await supabase
        .from('content')
        .delete()
        .eq('campaign_id', campaignId)

      if (contentError) throw contentError

      // Luego eliminar analytics asociados
      const { error: analyticsError } = await supabase
        .from('analytics')
        .delete()
        .eq('campaign_id', campaignId)

      if (analyticsError) throw analyticsError

      // Finalmente eliminar la campaña
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Error deleting campaign:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Obtiene métricas de una campaña
   */
  async getCampaignMetrics(campaignId: string): Promise<{ success: boolean; metrics?: CampaignMetrics; error?: string }> {
    try {
      // Obtener contenido de la campaña
      const { data: content, error: contentError } = await supabase
        .from('content')
        .select('id, status, engagement_metrics')
        .eq('campaign_id', campaignId)

      if (contentError) throw contentError

      // Obtener analytics de la campaña
      const { data: analytics, error: analyticsError } = await supabase
        .from('analytics')
        .select('*')
        .eq('campaign_id', campaignId)

      if (analyticsError) throw analyticsError

      // Calcular métricas
      const totalContent = content?.length || 0
      const publishedContent = content?.filter(c => c.status === 'published').length || 0
      const scheduledContent = content?.filter(c => c.status === 'scheduled').length || 0

      const totalEngagement = content?.reduce((sum, c) => {
        const metrics = c.engagement_metrics as any
        return sum + (metrics?.likes || 0) + (metrics?.comments || 0) + (metrics?.shares || 0)
      }, 0) || 0

      const totalReach = analytics?.reduce((sum, a) => sum + (a.reach || 0), 0) || 0
      const totalClicks = analytics?.reduce((sum, a) => sum + (a.clicks || 0), 0) || 0
      const totalConversions = analytics?.reduce((sum, a) => sum + (a.conversions || 0), 0) || 0

      const conversionRate = totalClicks > 0 ? (totalConversions / totalClicks) * 100 : 0

      // Obtener presupuesto de la campaña
      const { data: campaign, error: campaignError } = await supabase
        .from('campaigns')
        .select('budget')
        .eq('id', campaignId)
        .single()

      if (campaignError) throw campaignError

      const costPerAcquisition = totalConversions > 0 ? (campaign.budget || 0) / totalConversions : 0
      const roi = campaign.budget > 0 ? ((totalConversions * 100) - campaign.budget) / campaign.budget * 100 : 0

      const metrics: CampaignMetrics = {
        campaign_id: campaignId,
        total_content: totalContent,
        published_content: publishedContent,
        scheduled_content: scheduledContent,
        total_engagement: totalEngagement,
        total_reach: totalReach,
        total_clicks: totalClicks,
        conversion_rate: conversionRate,
        cost_per_acquisition: costPerAcquisition,
        roi: roi
      }

      return {
        success: true,
        metrics
      }
    } catch (error) {
      console.error('Error getting campaign metrics:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Cambia el estado de una campaña
   */
  async updateCampaignStatus(
    campaignId: string,
    status: 'draft' | 'active' | 'paused' | 'completed'
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('campaigns')
        .update({
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', campaignId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Error updating campaign status:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Duplica una campaña
   */
  async duplicateCampaign(
    campaignId: string,
    newName: string,
    clientId: string
  ): Promise<{ success: boolean; newCampaignId?: string; error?: string }> {
    try {
      // Obtener la campaña original
      const { data: originalCampaign, error: fetchError } = await supabase
        .from('campaigns')
        .select('*')
        .eq('id', campaignId)
        .single()

      if (fetchError) throw fetchError

      // Crear copia con nuevo nombre
      const { data, error } = await supabase
        .from('campaigns')
        .insert([{
          ...originalCampaign,
          id: undefined, // Generar nuevo ID
          name: newName,
          client_id: clientId,
          status: 'draft',
          created_at: undefined, // Generar nueva fecha
          updated_at: undefined
        }])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        newCampaignId: data.id
      }
    } catch (error) {
      console.error('Error duplicating campaign:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Obtiene campañas activas
   */
  async getActiveCampaigns(clientId: string): Promise<{ success: boolean; campaigns?: Campaign[]; error?: string }> {
    try {
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('client_id', clientId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        campaigns: data || []
      }
    } catch (error) {
      console.error('Error getting active campaigns:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }
}

export const campaignService = new CampaignService()
