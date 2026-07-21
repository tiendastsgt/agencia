import { credentialsService } from './credentials-service'

export interface SentimentResult {
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  scores: {
    positive: number
    negative: number
    neutral: number
  }
  provider: string
  timestamp: string
}

export interface SentimentAnalysisRequest {
  text: string
  language?: string
  provider?: 'google' | 'azure' | 'openai' | 'eden' | 'auto'
}

export interface SentimentProvider {
  id: string
  name: string
  isAvailable: boolean
  confidence: number
  cost: number
}

class SentimentAnalysisService {
  private providers: SentimentProvider[] = [
    { id: 'google', name: 'Google Cloud', isAvailable: false, confidence: 0.95, cost: 0.001 },
    { id: 'azure', name: 'Microsoft Azure', isAvailable: false, confidence: 0.92, cost: 0.001 },
    { id: 'openai', name: 'OpenAI', isAvailable: false, confidence: 0.90, cost: 0.002 },
    { id: 'eden', name: 'Eden AI', isAvailable: false, confidence: 0.88, cost: 0.0005 }
  ]

  constructor() {
    this.checkProviderAvailability()
  }

  private async checkProviderAvailability() {
    try {
      // Verificar Google Cloud
      const googleCreds = await credentialsService.getCredentials('google-cloud')
      this.providers[0].isAvailable = googleCreds && googleCreds.length > 0

      // Verificar Azure
      const azureCreds = await credentialsService.getCredentials('azure')
      this.providers[1].isAvailable = azureCreds && azureCreds.length > 0

      // Verificar OpenAI
      const openaiCreds = await credentialsService.getCredentials('openai')
      this.providers[2].isAvailable = openaiCreds && openaiCreds.length > 0

      // Verificar Eden AI
      const edenCreds = await credentialsService.getCredentials('eden-ai')
      this.providers[3].isAvailable = edenCreds && edenCreds.length > 0

    } catch (error) {
      console.error('Error checking sentiment provider availability:', error)
    }
  }

  /**
   * Analiza el sentimiento de un texto usando el proveedor especificado o automáticamente
   */
  async analyzeSentiment(request: SentimentAnalysisRequest): Promise<{ success: boolean; result?: SentimentResult; error?: string }> {
    try {
      const { text, language = 'es', provider = 'auto' } = request

      if (!text.trim()) {
        throw new Error('El texto no puede estar vacío')
      }

      let selectedProvider = provider
      
      if (provider === 'auto') {
        selectedProvider = this.selectBestProvider()
      }

      switch (selectedProvider) {
        case 'google':
          return await this.analyzeWithGoogle(text, language)
        case 'azure':
          return await this.analyzeWithAzure(text, language)
        case 'openai':
          return await this.analyzeWithOpenAI(text, language)
        case 'eden':
          return await this.analyzeWithEdenAI(text, language)
        default:
          throw new Error(`Proveedor no soportado: ${selectedProvider}`)
      }

    } catch (error) {
      console.error('Error analyzing sentiment:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido'
      }
    }
  }

  /**
   * Analiza sentimiento con Google Cloud Natural Language API
   */
  private async analyzeWithGoogle(text: string, language: string): Promise<{ success: boolean; result?: SentimentResult; error?: string }> {
    try {
      const credentials = await credentialsService.getCredentials('google-cloud')
      if (!credentials || credentials.length === 0) {
        throw new Error('Google Cloud credentials not configured')
      }

      const cred = credentials[0]
      const apiKey = cred.api_key

      const response = await fetch(
        `https://language.googleapis.com/v1/documents:analyzeSentiment?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            document: {
              type: 'PLAIN_TEXT',
              content: text,
              language: language
            },
            encodingType: 'UTF8'
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Error en Google Cloud API')
      }

      const data = await response.json()
      const sentiment = data.documentSentiment

      const result: SentimentResult = {
        sentiment: this.mapGoogleSentiment(sentiment.score),
        confidence: Math.abs(sentiment.magnitude),
        scores: {
          positive: sentiment.score > 0 ? sentiment.score : 0,
          negative: sentiment.score < 0 ? Math.abs(sentiment.score) : 0,
          neutral: sentiment.score === 0 ? 1 : 0
        },
        provider: 'google',
        timestamp: new Date().toISOString()
      }

      return { success: true, result }

    } catch (error) {
      console.error('Error with Google Cloud sentiment analysis:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error con Google Cloud'
      }
    }
  }

  /**
   * Analiza sentimiento con Microsoft Azure Cognitive Services
   */
  private async analyzeWithAzure(text: string, language: string): Promise<{ success: boolean; result?: SentimentResult; error?: string }> {
    try {
      const credentials = await credentialsService.getCredentials('azure')
      if (!credentials || credentials.length === 0) {
        throw new Error('Azure credentials not configured')
      }

      const cred = credentials[0]
      const endpoint = cred.api_key // En Azure, esto sería el endpoint
      const apiKey = cred.api_secret

      const response = await fetch(
        `${endpoint}/text/analytics/v3.1/sentiment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': apiKey
          },
          body: JSON.stringify({
            documents: [{
              id: '1',
              text: text,
              language: language
            }]
          })
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Error en Azure API')
      }

      const data = await response.json()
      const document = data.documents[0]

      const result: SentimentResult = {
        sentiment: document.sentiment.toLowerCase() as 'positive' | 'negative' | 'neutral',
        confidence: Math.max(...Object.values(document.confidenceScores)),
        scores: {
          positive: document.confidenceScores.positive,
          negative: document.confidenceScores.negative,
          neutral: document.confidenceScores.neutral
        },
        provider: 'azure',
        timestamp: new Date().toISOString()
      }

      return { success: true, result }

    } catch (error) {
      console.error('Error with Azure sentiment analysis:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error con Azure'
      }
    }
  }

  /**
   * Analiza sentimiento con OpenAI
   */
  private async analyzeWithOpenAI(text: string, language: string): Promise<{ success: boolean; result?: SentimentResult; error?: string }> {
    try {
      const credentials = await credentialsService.getCredentials('openai')
      if (!credentials || credentials.length === 0) {
        throw new Error('OpenAI credentials not configured')
      }

      const cred = credentials[0]
      const apiKey = cred.api_key

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Analiza el sentimiento del siguiente texto y responde SOLO con un JSON válido en este formato exacto:
              {
                "sentiment": "positive|negative|neutral",
                "confidence": 0.0-1.0,
                "scores": {
                  "positive": 0.0-1.0,
                  "negative": 0.0-1.0,
                  "neutral": 0.0-1.0
                }
              }`
            },
            {
              role: 'user',
              content: `Analiza el sentimiento de este texto: "${text}"`
            }
          ],
          temperature: 0.1,
          max_completion_tokens: 150
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Error en OpenAI API')
      }

      const data = await response.json()
      const content = data.choices[0].message.content

      try {
        const sentimentData = JSON.parse(content)
        
        const result: SentimentResult = {
          sentiment: sentimentData.sentiment,
          confidence: sentimentData.confidence,
          scores: sentimentData.scores,
          provider: 'openai',
          timestamp: new Date().toISOString()
        }

        return { success: true, result }

      } catch (parseError) {
        throw new Error('Error parsing OpenAI response')
      }

    } catch (error) {
      console.error('Error with OpenAI sentiment analysis:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error con OpenAI'
      }
    }
  }

  /**
   * Analiza sentimiento con Eden AI (fallback provider)
   */
  private async analyzeWithEdenAI(text: string, language: string): Promise<{ success: boolean; result?: SentimentResult; error?: string }> {
    try {
      const credentials = await credentialsService.getCredentials('eden-ai')
      if (!credentials || credentials.length === 0) {
        throw new Error('Eden AI credentials not configured')
      }

      const cred = credentials[0]
      const apiKey = cred.api_key

      const response = await fetch('https://api.edenai.co/v2/text/sentiment_analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          text: text,
          language: language,
          providers: 'google,azure,openai'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error?.message || 'Error en Eden AI API')
      }

      const data = await response.json()
      
      // Eden AI devuelve múltiples proveedores, tomamos el primero disponible
      const providerResults = Object.values(data).find((result: any) => result.status === 'success')
      
      if (!providerResults) {
        throw new Error('No hay proveedores disponibles en Eden AI')
      }

      const result = providerResults as any
      const sentiment = result.result

      const sentimentResult: SentimentResult = {
        sentiment: this.mapEdenSentiment(sentiment.general_sentiment),
        confidence: sentiment.general_sentiment_rate,
        scores: {
          positive: sentiment.general_sentiment === 'positive' ? sentiment.general_sentiment_rate : 0,
          negative: sentiment.general_sentiment === 'negative' ? sentiment.general_sentiment_rate : 0,
          neutral: sentiment.general_sentiment === 'neutral' ? sentiment.general_sentiment_rate : 0
        },
        provider: 'eden',
        timestamp: new Date().toISOString()
      }

      return { success: true, result: sentimentResult }

    } catch (error) {
      console.error('Error with Eden AI sentiment analysis:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error con Eden AI'
      }
    }
  }

  /**
   * Selecciona el mejor proveedor disponible
   */
  private selectBestProvider(): string {
    const availableProviders = this.providers.filter(p => p.isAvailable)
    
    if (availableProviders.length === 0) {
      throw new Error('No hay proveedores de análisis de sentimientos configurados')
    }

    // Ordenar por confianza y costo
    const bestProvider = availableProviders.sort((a, b) => {
      const scoreA = a.confidence - (a.cost * 1000)
      const scoreB = b.confidence - (b.cost * 1000)
      return scoreB - scoreA
    })[0]

    return bestProvider.id
  }

  /**
   * Mapea el sentimiento de Google Cloud a nuestro formato
   */
  private mapGoogleSentiment(score: number): 'positive' | 'negative' | 'neutral' {
    if (score > 0.1) return 'positive'
    if (score < -0.1) return 'negative'
    return 'neutral'
  }

  /**
   * Mapea el sentimiento de Eden AI a nuestro formato
   */
  private mapEdenSentiment(sentiment: string): 'positive' | 'negative' | 'neutral' {
    const lowerSentiment = sentiment.toLowerCase()
    if (lowerSentiment.includes('positive')) return 'positive'
    if (lowerSentiment.includes('negative')) return 'negative'
    return 'neutral'
  }

  /**
   * Obtiene la lista de proveedores disponibles
   */
  getAvailableProviders(): SentimentProvider[] {
    return this.providers.filter(p => p.isAvailable)
  }

  /**
   * Analiza múltiples textos en lote
   */
  async analyzeBatch(texts: string[], language: string = 'es'): Promise<{ success: boolean; results?: SentimentResult[]; error?: string }> {
    try {
      const results: SentimentResult[] = []
      
      for (const text of texts) {
        const result = await this.analyzeSentiment({ text, language })
        if (result.success && result.result) {
          results.push(result.result)
        } else {
          // Si falla un análisis, continuamos con los demás
          console.warn(`Failed to analyze text: ${text.substring(0, 50)}...`)
        }
      }

      return { success: true, results }

    } catch (error) {
      console.error('Error in batch sentiment analysis:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error en análisis por lotes'
      }
    }
  }

  /**
   * Obtiene estadísticas de sentimiento de un conjunto de resultados
   */
  getSentimentStats(results: SentimentResult[]): {
    total: number
    positive: number
    negative: number
    neutral: number
    averageConfidence: number
    dominantSentiment: 'positive' | 'negative' | 'neutral'
  } {
    const total = results.length
    const positive = results.filter(r => r.sentiment === 'positive').length
    const negative = results.filter(r => r.sentiment === 'negative').length
    const neutral = results.filter(r => r.sentiment === 'neutral').length
    const averageConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / total

    let dominantSentiment: 'positive' | 'negative' | 'neutral' = 'neutral'
    if (positive > negative && positive > neutral) dominantSentiment = 'positive'
    else if (negative > positive && negative > neutral) dominantSentiment = 'negative'

    return {
      total,
      positive,
      negative,
      neutral,
      averageConfidence,
      dominantSentiment
    }
  }
}

export const sentimentService = new SentimentAnalysisService()
