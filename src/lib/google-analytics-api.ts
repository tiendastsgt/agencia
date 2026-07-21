/**
 * Google Analytics 4 API Service
 * Implementación completa de la API de Google Analytics 4 para MarketPro GT
 * Basado en: mejoras/jsons/google_analytics_api_social.json
 */

import { supabase } from './supabase'






// Tipos para la API de Google Analytics 4
export interface GA4Property {
  name: string
  displayName: string
  propertyId: string
  timeZone: string
  currencyCode: string
  createTime: string
  updateTime: string
  parent: string
  industryCategory: string
  serviceLevel: string
  deleteTime?: string
  expireTime?: string
}

export interface GA4ReportRequest {
  property: string
  dateRanges: Array<{
    startDate: string
    endDate: string
  }>
  dimensions?: Array<{
    name: string
  }>
  metrics: Array<{
    name: string
  }>
  dimensionFilter?: {
    filter: {
      fieldName: string
      stringFilter?: {
        matchType: 'EXACT' | 'BEGINS_WITH' | 'ENDS_WITH' | 'CONTAINS' | 'FULL_REGEXP' | 'PARTIAL_REGEXP'
        value: string
        caseSensitive?: boolean
      }
      inListFilter?: {
        values: string[]
        caseSensitive?: boolean
      }
      numericFilter?: {
        operation: 'EQUAL' | 'LESS_THAN' | 'LESS_THAN_OR_EQUAL' | 'GREATER_THAN' | 'GREATER_THAN_OR_EQUAL' | 'BETWEEN'
        value: {
          int64Value?: string
          doubleValue?: number
        }
      }
    }
  }
  metricFilter?: {
    filter: {
      fieldName: string
      numericFilter: {
        operation: 'EQUAL' | 'LESS_THAN' | 'LESS_THAN_OR_EQUAL' | 'GREATER_THAN' | 'GREATER_THAN_OR_EQUAL' | 'BETWEEN'
        value: {
          int64Value?: string
          doubleValue?: number
        }
      }
    }
  }
  orderBys?: Array<{
    dimension?: {
      dimensionName: string
      orderType: 'ALPHANUMERIC' | 'CASE_INSENSITIVE_ALPHANUMERIC' | 'NUMERIC'
    }
    metric?: {
      metricName: string
    }
    desc: boolean
  }>
  limit?: number
  offset?: number
  metricAggregations?: Array<'TOTAL' | 'MINIMUM' | 'MAXIMUM' | 'COUNT'>
  keepEmptyRows?: boolean
  returnPropertyQuota?: boolean
}

export interface GA4ReportResponse {
  dimensionHeaders: Array<{
    name: string
  }>
  metricHeaders: Array<{
    name: string
    type: 'TYPE_UNSPECIFIED' | 'TYPE_INTEGER' | 'TYPE_FLOAT' | 'TYPE_SECONDS' | 'TYPE_MILLISECONDS' | 'TYPE_MINUTES' | 'TYPE_HOURS' | 'TYPE_STANDARD' | 'TYPE_CURRENCY' | 'TYPE_FEET' | 'TYPE_MILES' | 'TYPE_METERS' | 'TYPE_KILOMETERS'
  }>
  rows: Array<{
    dimensionValues: Array<{
      value: string
    }>
    metricValues: Array<{
      value: string
    }>
  }>
  rowCount: number
  metadata?: {
    currencyCode: string
    timeZone: string
    emptyReason?: string
    subjectToThresholding?: boolean
  }
  propertyQuota?: {
    tokensPerDay?: {
      consumed: number
      remaining: number
    }
    tokensPerHour?: {
      consumed: number
      remaining: number
    }
    concurrentRequests?: {
      consumed: number
      remaining: number
    }
    serverErrorsPerProjectPerHour?: {
      consumed: number
      remaining: number
    }
    potentiallyThresholdedRequestsPerHour?: {
      consumed: number
      remaining: number
    }
  }
  kind: string
}

export interface GA4Audience {
  name: string
  displayName: string
  description: string
  membershipDurationDays: number
  adsPersonalizationEnabled: boolean
  eventTrigger?: {
    eventName: string
    logCondition: 'AUDIENCE_JOINED' | 'AUDIENCE_MEMBERSHIP_RENEWED'
  }
  exclusionDurationMode: 'EXCLUSION_DURATION_UNSPECIFIED' | 'EXCLUDE_TEMPORARILY' | 'EXCLUDE_PERMANENTLY'
  filterClauses: Array<{
    andGroup?: {
      expressions: Array<{
        orGroup?: {
          expressions: Array<{
            notExpression?: {
              dimensionOrMetricFilter?: {
                fieldName: string
                stringFilter?: {
                  matchType: 'EXACT' | 'BEGINS_WITH' | 'ENDS_WITH' | 'CONTAINS' | 'FULL_REGEXP' | 'PARTIAL_REGEXP'
                  value: string
                  caseSensitive?: boolean
                }
                inListFilter?: {
                  values: string[]
                  caseSensitive?: boolean
                }
                numericFilter?: {
                  operation: 'EQUAL' | 'LESS_THAN' | 'LESS_THAN_OR_EQUAL' | 'GREATER_THAN' | 'GREATER_THAN_OR_EQUAL' | 'BETWEEN'
                  value: {
                    int64Value?: string
                    doubleValue?: number
                  }
                }
                betweenFilter?: {
                  fromValue: {
                    int64Value?: string
                    doubleValue?: number
                  }
                  toValue: {
                    int64Value?: string
                    doubleValue?: number
                  }
                }
              }
            }
          }>
        }
      }>
    }
  }>
  membershipValueSettings?: {
    value: number
    currencyCode: string
  }
}

export interface GA4ConversionEvent {
  name: string
  eventName: string
  createTime: string
  deletable: boolean
  custom: boolean
  countingMethod: 'CONVERSION_COUNTING_METHOD_UNSPECIFIED' | 'ONCE_PER_EVENT' | 'ONCE_PER_SESSION'
  defaultConversionValue?: {
    currencyCode: string
    value: number
  }
}

export interface GA4CustomDimension {
  name: string
  parameterName: string
  displayName: string
  description: string
  scope: 'DIMENSION_SCOPE_UNSPECIFIED' | 'EVENT' | 'USER'
  disallowAdsPersonalization: boolean
}

export interface GA4CustomMetric {
  name: string
  parameterName: string
  displayName: string
  description: string
  measurementUnit: 'MEASUREMENT_UNIT_UNSPECIFIED' | 'STANDARD' | 'CURRENCY' | 'FEET' | 'METERS' | 'KILOMETERS' | 'MILES' | 'MILLISECONDS' | 'SECONDS' | 'MINUTES' | 'HOURS'
  scope: 'METRIC_SCOPE_UNSPECIFIED' | 'EVENT'
  restrictedMetricType: Array<'RESTRICTED_METRIC_TYPE_UNSPECIFIED' | 'COST_DATA' | 'REVENUE_DATA'>
}

// Clase principal del servicio de Google Analytics 4 API
export class GoogleAnalytics4Service {
  private baseURL = 'https://analyticsdata.googleapis.com/v1beta'
  private managementURL = 'https://analyticsadmin.googleapis.com/v1beta'
  private accessToken: string
  private propertyId: string

  constructor(accessToken: string, propertyId: string) {
    this.accessToken = accessToken
    this.propertyId = propertyId
  }

  /**
   * Obtiene información de la propiedad
   */
  async getProperty(): Promise<GA4Property> {
    const response = await this.makeManagementRequest(`/properties/${this.propertyId}`)
    return response
  }

  /**
   * Obtiene un reporte de GA4
   */
  async getReport(request: GA4ReportRequest): Promise<GA4ReportResponse> {
    const response = await this.makeRequest(`/properties/${this.propertyId}:runReport`, {
      method: 'POST',
      body: JSON.stringify(request)
    })
    return response
  }

  /**
   * Obtiene métricas básicas del sitio web
   */
  async getBasicMetrics(dateRange: { startDate: string; endDate: string }): Promise<{
    sessions: number
    users: number
    pageViews: number
    bounceRate: number
    averageSessionDuration: number
    newUsers: number
    returningUsers: number
  }> {
    const request: GA4ReportRequest = {
      property: `properties/${this.propertyId}`,
      dateRanges: [dateRange],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'screenPageViews' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' },
        { name: 'newUsers' }
      ]
    }

    const response = await this.getReport(request)
    
    if (response.rows.length === 0) {
      return {
        sessions: 0,
        users: 0,
        pageViews: 0,
        bounceRate: 0,
        averageSessionDuration: 0,
        newUsers: 0,
        returningUsers: 0
      }
    }

    const row = response.rows[0]
    const sessions = parseInt(row.metricValues[0]?.value || '0')
    const users = parseInt(row.metricValues[1]?.value || '0')
    const pageViews = parseInt(row.metricValues[2]?.value || '0')
    const bounceRate = parseFloat(row.metricValues[3]?.value || '0')
    const averageSessionDuration = parseFloat(row.metricValues[4]?.value || '0')
    const newUsers = parseInt(row.metricValues[5]?.value || '0')

    return {
      sessions,
      users,
      pageViews,
      bounceRate,
      averageSessionDuration,
      newUsers,
      returningUsers: users - newUsers
    }
  }

  /**
   * Obtiene métricas de tráfico por canal
   */
  async getTrafficByChannel(dateRange: { startDate: string; endDate: string }): Promise<Array<{
    channel: string
    sessions: number
    users: number
    bounceRate: number
    averageSessionDuration: number
  }>> {
    const request: GA4ReportRequest = {
      property: `properties/${this.propertyId}`,
      dateRanges: [dateRange],
      dimensions: [{ name: 'defaultChannelGroup' }],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'bounceRate' },
        { name: 'averageSessionDuration' }
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
    }

    const response = await this.getReport(request)
    
    return response.rows.map(row => ({
      channel: row.dimensionValues[0]?.value || 'Unknown',
      sessions: parseInt(row.metricValues[0]?.value || '0'),
      users: parseInt(row.metricValues[1]?.value || '0'),
      bounceRate: parseFloat(row.metricValues[2]?.value || '0'),
      averageSessionDuration: parseFloat(row.metricValues[3]?.value || '0')
    }))
  }

  /**
   * Obtiene métricas de dispositivos
   */
  async getDeviceMetrics(dateRange: { startDate: string; endDate: string }): Promise<Array<{
    device: string
    sessions: number
    users: number
    bounceRate: number
  }>> {
    const request: GA4ReportRequest = {
      property: `properties/${this.propertyId}`,
      dateRanges: [dateRange],
      dimensions: [{ name: 'deviceCategory' }],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' },
        { name: 'bounceRate' }
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }]
    }

    const response = await this.getReport(request)
    
    return response.rows.map(row => ({
      device: row.dimensionValues[0]?.value || 'Unknown',
      sessions: parseInt(row.metricValues[0]?.value || '0'),
      users: parseInt(row.metricValues[1]?.value || '0'),
      bounceRate: parseFloat(row.metricValues[2]?.value || '0')
    }))
  }

  /**
   * Obtiene métricas de ubicación geográfica
   */
  async getLocationMetrics(dateRange: { startDate: string; endDate: string }): Promise<Array<{
    country: string
    city: string
    sessions: number
    users: number
  }>> {
    const request: GA4ReportRequest = {
      property: `properties/${this.propertyId}`,
      dateRanges: [dateRange],
      dimensions: [
        { name: 'country' },
        { name: 'city' }
      ],
      metrics: [
        { name: 'sessions' },
        { name: 'totalUsers' }
      ],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 50
    }

    const response = await this.getReport(request)
    
    return response.rows.map(row => ({
      country: row.dimensionValues[0]?.value || 'Unknown',
      city: row.dimensionValues[1]?.value || 'Unknown',
      sessions: parseInt(row.metricValues[0]?.value || '0'),
      users: parseInt(row.metricValues[1]?.value || '0')
    }))
  }

  /**
   * Obtiene páginas más visitadas
   */
  async getTopPages(dateRange: { startDate: string; endDate: string }): Promise<Array<{
    page: string
    pageViews: number
    uniquePageViews: number
    averageTimeOnPage: number
    bounceRate: number
  }>> {
    const request: GA4ReportRequest = {
      property: `properties/${this.propertyId}`,
      dateRanges: [dateRange],
      dimensions: [{ name: 'pagePath' }],
      metrics: [
        { name: 'screenPageViews' },
        { name: 'uniquePageviews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' }
      ],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 20
    }

    const response = await this.getReport(request)
    
    return response.rows.map(row => ({
      page: row.dimensionValues[0]?.value || 'Unknown',
      pageViews: parseInt(row.metricValues[0]?.value || '0'),
      uniquePageViews: parseInt(row.metricValues[1]?.value || '0'),
      averageTimeOnPage: parseFloat(row.metricValues[2]?.value || '0'),
      bounceRate: parseFloat(row.metricValues[3]?.value || '0')
    }))
  }

  /**
   * Obtiene eventos personalizados
   */
  async getCustomEvents(dateRange: { startDate: string; endDate: string }): Promise<Array<{
    eventName: string
    eventCount: number
    totalUsers: number
  }>> {
    const request: GA4ReportRequest = {
      property: `properties/${this.propertyId}`,
      dateRanges: [dateRange],
      dimensions: [{ name: 'eventName' }],
      metrics: [
        { name: 'eventCount' },
        { name: 'totalUsers' }
      ],
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: 50
    }

    const response = await this.getReport(request)
    
    return response.rows.map(row => ({
      eventName: row.dimensionValues[0]?.value || 'Unknown',
      eventCount: parseInt(row.metricValues[0]?.value || '0'),
      totalUsers: parseInt(row.metricValues[1]?.value || '0')
    }))
  }

  /**
   * Obtiene audiencias
   */
  async getAudiences(): Promise<GA4Audience[]> {
    const response = await this.makeManagementRequest(`/properties/${this.propertyId}/audiences`)
    return response.audiences || []
  }

  /**
   * Obtiene eventos de conversión
   */
  async getConversionEvents(): Promise<GA4ConversionEvent[]> {
    const response = await this.makeManagementRequest(`/properties/${this.propertyId}/conversionEvents`)
    return response.conversionEvents || []
  }

  /**
   * Obtiene dimensiones personalizadas
   */
  async getCustomDimensions(): Promise<GA4CustomDimension[]> {
    const response = await this.makeManagementRequest(`/properties/${this.propertyId}/customDimensions`)
    return response.customDimensions || []
  }

  /**
   * Obtiene métricas personalizadas
   */
  async getCustomMetrics(): Promise<GA4CustomMetric[]> {
    const response = await this.makeManagementRequest(`/properties/${this.propertyId}/customMetrics`)
    return response.customMetrics || []
  }

  /**
   * Valida las credenciales de la API
   */
  async validateCredentials(): Promise<boolean> {
    try {
      await this.getProperty()
      return true
    } catch (error) {
      console.error('Error validando credenciales de Google Analytics 4:', error)
      return false
    }
  }

  /**
   * Realiza una petición a la API de Google Analytics 4 Data
   */
  private async makeRequest(endpoint: string, options: any = {}): Promise<any> {
    const url = `${this.baseURL}${endpoint}`
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    }

    const config: RequestInit = {
      method: options.method || 'GET',
      headers
    }

    if (options.body) {
      config.body = options.body
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Google Analytics 4 API Error: ${response.status} - ${errorData.error?.message || response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error en petición a Google Analytics 4 API:', error)
      throw error
    }
  }

  /**
   * Realiza una petición a la API de Google Analytics 4 Management
   */
  private async makeManagementRequest(endpoint: string, options: any = {}): Promise<any> {
    const url = `${this.managementURL}${endpoint}`
    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    }

    const config: RequestInit = {
      method: options.method || 'GET',
      headers
    }

    if (options.body) {
      config.body = options.body
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(`Google Analytics 4 Management API Error: ${response.status} - ${errorData.error?.message || response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error en petición a Google Analytics 4 Management API:', error)
      throw error
    }
  }
}

// Función para obtener credenciales de Google Analytics 4 desde Supabase
export async function getGA4Credentials(clientId?: string): Promise<{ accessToken: string; propertyId: string } | null> {
  try {
    let query = supabase
      .from('api_credentials')
      .select('encrypted_value, config')
      .eq('provider', 'google_analytics')
      .eq('is_active', true)
      .single()

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data, error } = await query

    if (error || !data) {
      console.warn('No se encontraron credenciales de Google Analytics 4:', error?.message)
      return null
    }

    // En un entorno real, aquí desencriptarías el valor
    const accessToken = data.encrypted_value
    const propertyId = data.config?.property_id || ''

    if (!accessToken || !propertyId) {
      console.warn('Credenciales de Google Analytics 4 incompletas')
      return null
    }

    return { accessToken, propertyId }
  } catch (error) {
    console.warn('Error al obtener credenciales de Google Analytics 4:', error)
    return null
  }
}

// Función para crear una instancia del servicio de Google Analytics 4
export async function createGA4Service(clientId?: string): Promise<GoogleAnalytics4Service | null> {
  const credentials = await getGA4Credentials(clientId)
  
  if (!credentials) {
    console.warn('No se pudieron obtener las credenciales de Google Analytics 4')
    return null
  }

  return new GoogleAnalytics4Service(credentials.accessToken, credentials.propertyId)
}

// Función para validar credenciales de Google Analytics 4
export async function validateGA4Credentials(accessToken: string, propertyId: string): Promise<{ valid: boolean; property?: GA4Property; error?: string }> {
  try {
    const service = new GoogleAnalytics4Service(accessToken, propertyId)
    const property = await service.getProperty()
    return { valid: true, property }
  } catch (error: any) {
    return { valid: false, error: error.message }
  }
}
