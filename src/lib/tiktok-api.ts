/**
 * TikTok Business API Service
 * Implementación completa de la API de TikTok Business para MarketPro GT
 * Basado en: mejoras/jsons/tiktok_business_api_docs.json y mejoras/media/TikTok_Ad_Specs.json
 */

import { supabase } from './supabase'






// Tipos para la API de TikTok Business
export interface TikTokAdAccount {
  advertiser_id: string
  name: string
  currency: string
  timezone: string
  status: 'ACTIVE' | 'INACTIVE' | 'PENDING'
  created_time: string
  updated_time: string
}

export interface TikTokCampaign {
  campaign_id: string
  campaign_name: string
  objective: 'TRAFFIC' | 'CONVERSIONS' | 'APP_INSTALL' | 'REACH' | 'VIDEO_VIEWS' | 'LEAD_GENERATION'
  status: 'ENABLE' | 'DISABLE' | 'DELETE'
  budget_mode: 'BUDGET_MODE_DAY' | 'BUDGET_MODE_TOTAL'
  budget: number
  schedule_type: 'SCHEDULE_FROM_NOW' | 'SCHEDULE_START_END'
  schedule_start_time?: string
  schedule_end_time?: string
  created_time: string
  updated_time: string
}

export interface TikTokAdGroup {
  adgroup_id: string
  adgroup_name: string
  campaign_id: string
  placement_type: 'AUTOMATIC' | 'MANUAL'
  placement: string[]
  optimization_goal: 'CLICK' | 'CONVERSION' | 'IMPRESSION' | 'REACH' | 'VIDEO_VIEWS'
  bid_type: 'BID_TYPE_NO_BID' | 'BID_TYPE_CUSTOM' | 'BID_TYPE_CBO'
  bid_price: number
  budget_mode: 'BUDGET_MODE_DAY' | 'BUDGET_MODE_TOTAL'
  budget: number
  schedule_type: 'SCHEDULE_FROM_NOW' | 'SCHEDULE_START_END'
  schedule_start_time?: string
  schedule_end_time?: string
  status: 'ENABLE' | 'DISABLE' | 'DELETE'
  created_time: string
  updated_time: string
}

export interface TikTokAd {
  ad_id: string
  ad_name: string
  adgroup_id: string
  ad_format: 'SINGLE_VIDEO' | 'CAROUSEL' | 'SPARK_AD'
  call_to_action: 'LEARN_MORE' | 'SHOP_NOW' | 'SIGN_UP' | 'DOWNLOAD' | 'BOOK_TRAVEL' | 'GET_QUOTE' | 'ORDER_NOW' | 'LISTEN_MUSIC' | 'WATCH_MORE' | 'APPLY_NOW' | 'PLAY_GAME' | 'INSTALL_NOW' | 'USE_APP' | 'OPEN'
  landing_page_url: string
  display_name: string
  profile_image_url?: string
  video_id?: string
  image_ids?: string[]
  status: 'ENABLE' | 'DISABLE' | 'DELETE' | 'AUDIT' | 'AUDIT_DENIED'
  created_time: string
  updated_time: string
}

export interface TikTokVideo {
  video_id: string
  video_name: string
  video_url: string
  cover_image_url: string
  duration: number
  width: number
  height: number
  file_size: number
  format: string
  created_time: string
  updated_time: string
}

export interface TikTokAnalytics {
  date: string
  impressions: number
  clicks: number
  cost: number
  conversions: number
  video_views: number
  video_play_actions: number
  video_watched_2s: number
  video_watched_6s: number
  video_play_time: number
  ctr: number
  cpm: number
  cpc: number
  cpa: number
  roas: number
}

export interface TikTokReportRequest {
  advertiser_id: string
  service_type: 'AUCTION' | 'RESERVATION'
  report_type: 'BASIC' | 'AUDIENCE' | 'PLAYABLE_MATERIAL' | 'CATALOG'
  data_level: 'AUCTION_AD' | 'AUCTION_ADGROUP' | 'AUCTION_CAMPAIGN' | 'AUCTION_ADVERTISER'
  dimensions: string[]
  metrics: string[]
  start_date: string
  end_date: string
  order_field: string
  order_type: 'ASC' | 'DESC'
  page: number
  page_size: number
}

export interface TikTokReportResponse {
  list: Array<{
    [key: string]: any
  }>
  page_info: {
    page: number
    page_size: number
    total_number: number
    total_page: number
  }
}

// Clase principal del servicio de TikTok Business API
export class TikTokBusinessService {
  private baseURL = 'https://business-api.tiktok.com/open_api/v1.3'
  private accessToken: string
  private advertiserId: string

  constructor(accessToken: string, advertiserId: string) {
    this.accessToken = accessToken
    this.advertiserId = advertiserId
  }

  /**
   * Obtiene información de la cuenta de anuncios
   */
  async getAdAccount(): Promise<TikTokAdAccount> {
    const response = await this.makeRequest('/advertiser/info/', {
      advertiser_ids: JSON.stringify([this.advertiserId])
    })

    if (!response.data || response.data.length === 0) {
      throw new Error('Cuenta de anuncios no encontrada')
    }

    return response.data[0]
  }

  /**
   * Obtiene campañas de la cuenta
   */
  async getCampaigns(page = 1, pageSize = 100): Promise<{
    campaigns: TikTokCampaign[]
    total: number
  }> {
    const response = await this.makeRequest('/campaign/get/', {
      advertiser_id: this.advertiserId,
      page: page.toString(),
      page_size: pageSize.toString()
    })

    return {
      campaigns: response.data?.list || [],
      total: response.data?.page_info?.total_number || 0
    }
  }

  /**
   * Obtiene grupos de anuncios de una campaña
   */
  async getAdGroups(campaignId: string, page = 1, pageSize = 100): Promise<{
    adGroups: TikTokAdGroup[]
    total: number
  }> {
    const response = await this.makeRequest('/adgroup/get/', {
      advertiser_id: this.advertiserId,
      campaign_ids: JSON.stringify([campaignId]),
      page: page.toString(),
      page_size: pageSize.toString()
    })

    return {
      adGroups: response.data?.list || [],
      total: response.data?.page_info?.total_number || 0
    }
  }

  /**
   * Obtiene anuncios de un grupo de anuncios
   */
  async getAds(adGroupId: string, page = 1, pageSize = 100): Promise<{
    ads: TikTokAd[]
    total: number
  }> {
    const response = await this.makeRequest('/ad/get/', {
      advertiser_id: this.advertiserId,
      adgroup_ids: JSON.stringify([adGroupId]),
      page: page.toString(),
      page_size: pageSize.toString()
    })

    return {
      ads: response.data?.list || [],
      total: response.data?.page_info?.total_number || 0
    }
  }

  /**
   * Obtiene videos de la cuenta
   */
  async getVideos(page = 1, pageSize = 100): Promise<{
    videos: TikTokVideo[]
    total: number
  }> {
    const response = await this.makeRequest('/file/video/advertiser/get/', {
      advertiser_id: this.advertiserId,
      page: page.toString(),
      page_size: pageSize.toString()
    })

    return {
      videos: response.data?.list || [],
      total: response.data?.page_info?.total_number || 0
    }
  }

  /**
   * Obtiene analíticas de campañas
   */
  async getCampaignAnalytics(startDate: string, endDate: string): Promise<TikTokAnalytics[]> {
    const request: TikTokReportRequest = {
      advertiser_id: this.advertiserId,
      service_type: 'AUCTION',
      report_type: 'BASIC',
      data_level: 'AUCTION_CAMPAIGN',
      dimensions: ['campaign_id', 'stat_time_day'],
      metrics: [
        'impressions',
        'clicks',
        'cost',
        'conversions',
        'video_views',
        'video_play_actions',
        'video_watched_2s',
        'video_watched_6s',
        'video_play_time',
        'ctr',
        'cpm',
        'cpc',
        'cpa',
        'roas'
      ],
      start_date: startDate,
      end_date: endDate,
      order_field: 'stat_time_day',
      order_type: 'DESC',
      page: 1,
      page_size: 1000
    }

    const response = await this.makeReportRequest('/report/integrated/get/', request)
    
    return response.list.map((item: any) => ({
      date: item.stat_time_day,
      impressions: parseInt(item.impressions || '0'),
      clicks: parseInt(item.clicks || '0'),
      cost: parseFloat(item.cost || '0'),
      conversions: parseInt(item.conversions || '0'),
      video_views: parseInt(item.video_views || '0'),
      video_play_actions: parseInt(item.video_play_actions || '0'),
      video_watched_2s: parseInt(item.video_watched_2s || '0'),
      video_watched_6s: parseInt(item.video_watched_6s || '0'),
      video_play_time: parseFloat(item.video_play_time || '0'),
      ctr: parseFloat(item.ctr || '0'),
      cpm: parseFloat(item.cpm || '0'),
      cpc: parseFloat(item.cpc || '0'),
      cpa: parseFloat(item.cpa || '0'),
      roas: parseFloat(item.roas || '0')
    }))
  }

  /**
   * Obtiene analíticas de anuncios
   */
  async getAdAnalytics(startDate: string, endDate: string): Promise<TikTokAnalytics[]> {
    const request: TikTokReportRequest = {
      advertiser_id: this.advertiserId,
      service_type: 'AUCTION',
      report_type: 'BASIC',
      data_level: 'AUCTION_AD',
      dimensions: ['ad_id', 'stat_time_day'],
      metrics: [
        'impressions',
        'clicks',
        'cost',
        'conversions',
        'video_views',
        'video_play_actions',
        'video_watched_2s',
        'video_watched_6s',
        'video_play_time',
        'ctr',
        'cpm',
        'cpc',
        'cpa',
        'roas'
      ],
      start_date: startDate,
      end_date: endDate,
      order_field: 'stat_time_day',
      order_type: 'DESC',
      page: 1,
      page_size: 1000
    }

    const response = await this.makeReportRequest('/report/integrated/get/', request)
    
    return response.list.map((item: any) => ({
      date: item.stat_time_day,
      impressions: parseInt(item.impressions || '0'),
      clicks: parseInt(item.clicks || '0'),
      cost: parseFloat(item.cost || '0'),
      conversions: parseInt(item.conversions || '0'),
      video_views: parseInt(item.video_views || '0'),
      video_play_actions: parseInt(item.video_play_actions || '0'),
      video_watched_2s: parseInt(item.video_watched_2s || '0'),
      video_watched_6s: parseInt(item.video_watched_6s || '0'),
      video_play_time: parseFloat(item.video_play_time || '0'),
      ctr: parseFloat(item.ctr || '0'),
      cpm: parseFloat(item.cpm || '0'),
      cpc: parseFloat(item.cpc || '0'),
      cpa: parseFloat(item.cpa || '0'),
      roas: parseFloat(item.roas || '0')
    }))
  }

  /**
   * Crea una nueva campaña
   */
  async createCampaign(campaign: Partial<TikTokCampaign>): Promise<{ campaign_id: string }> {
    const response = await this.makeRequest('/campaign/create/', {
      advertiser_id: this.advertiserId,
      ...campaign
    })

    return { campaign_id: response.data?.campaign_id }
  }

  /**
   * Crea un nuevo grupo de anuncios
   */
  async createAdGroup(adGroup: Partial<TikTokAdGroup>): Promise<{ adgroup_id: string }> {
    const response = await this.makeRequest('/adgroup/create/', {
      advertiser_id: this.advertiserId,
      ...adGroup
    })

    return { adgroup_id: response.data?.adgroup_id }
  }

  /**
   * Crea un nuevo anuncio
   */
  async createAd(ad: Partial<TikTokAd>): Promise<{ ad_id: string }> {
    const response = await this.makeRequest('/ad/create/', {
      advertiser_id: this.advertiserId,
      ...ad
    })

    return { ad_id: response.data?.ad_id }
  }

  /**
   * Sube un video
   */
  async uploadVideo(videoFile: File): Promise<{ video_id: string }> {
    const formData = new FormData()
    formData.append('advertiser_id', this.advertiserId)
    formData.append('video_file', videoFile)

    const response = await fetch(`${this.baseURL}/file/video/advertiser/upload/`, {
      method: 'POST',
      headers: {
        'Access-Token': this.accessToken
      },
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`TikTok API Error: ${response.status} - ${errorData.message || response.statusText}`)
    }

    const data = await response.json()
    return { video_id: data.data?.video_id }
  }

  /**
   * Valida las credenciales de la API
   */
  async validateCredentials(): Promise<boolean> {
    try {
      await this.getAdAccount()
      return true
    } catch (error) {
      console.error('Error validando credenciales de TikTok Business:', error)
      return false
    }
  }

  /**
   * Realiza una petición a la API de TikTok Business
   */
  private async makeRequest(endpoint: string, params: any = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value.toString())
      }
    })

    const fullUrl = `${url}?${searchParams.toString()}`
    
    const response = await fetch(fullUrl, {
      headers: {
        'Access-Token': this.accessToken,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`TikTok Business API Error: ${response.status} - ${errorData.message || response.statusText}`)
    }

    return await response.json()
  }

  /**
   * Realiza una petición de reporte a la API de TikTok Business
   */
  private async makeReportRequest(endpoint: string, request: TikTokReportRequest): Promise<TikTokReportResponse> {
    const url = `${this.baseURL}${endpoint}`
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Access-Token': this.accessToken,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(`TikTok Business API Error: ${response.status} - ${errorData.message || response.statusText}`)
    }

    return await response.json()
  }
}

// Función para obtener credenciales de TikTok Business desde Supabase
export async function getTikTokCredentials(clientId?: string): Promise<{ accessToken: string; advertiserId: string } | null> {
  try {
    let query = supabase
      .from('api_credentials')
      .select('encrypted_value, config')
      .eq('provider', 'tiktok_business')
      .eq('is_active', true)
      .single()

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data, error } = await query

    if (error || !data) {
      console.warn('No se encontraron credenciales de TikTok Business:', error?.message)
      return null
    }

    // En un entorno real, aquí desencriptarías el valor
    const accessToken = data.encrypted_value
    const advertiserId = data.config?.advertiser_id || ''

    if (!accessToken || !advertiserId) {
      console.warn('Credenciales de TikTok Business incompletas')
      return null
    }

    return { accessToken, advertiserId }
  } catch (error) {
    console.warn('Error al obtener credenciales de TikTok Business:', error)
    return null
  }
}

// Función para crear una instancia del servicio de TikTok Business
export async function createTikTokService(clientId?: string): Promise<TikTokBusinessService | null> {
  const credentials = await getTikTokCredentials(clientId)
  
  if (!credentials) {
    console.warn('No se pudieron obtener las credenciales de TikTok Business')
    return null
  }

  return new TikTokBusinessService(credentials.accessToken, credentials.advertiserId)
}

// Función para validar credenciales de TikTok Business
export async function validateTikTokCredentials(accessToken: string, advertiserId: string): Promise<{ valid: boolean; account?: TikTokAdAccount; error?: string }> {
  try {
    const service = new TikTokBusinessService(accessToken, advertiserId)
    const account = await service.getAdAccount()
    return { valid: true, account }
  } catch (error: any) {
    return { valid: false, error: error.message }
  }
}
