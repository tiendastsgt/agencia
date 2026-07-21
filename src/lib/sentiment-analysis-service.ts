import { supabase } from './supabase'

// Interfaces para análisis de sentimientos
export interface SentimentResult {
  text: string
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  emotions?: {
    joy: number
    sadness: number
    anger: number
    fear: number
    surprise: number
  }
}

export interface Comment {
  id: string
  text: string
  author: string
  platform: string
  timestamp: string
  postId?: string
}

export interface BrandMention {
  id: string
  text: string
  brand: string
  platform: string
  timestamp: string
  sentiment: SentimentResult
}

export interface SentimentReport {
  totalComments: number
  positiveCount: number
  negativeCount: number
  neutralCount: number
  averageSentiment: number
  trendingEmotions: string[]
  topPositiveComments: Comment[]
  topNegativeComments: Comment[]
  brandMentions: BrandMention[]
  recommendations: string[]
}

export interface SentimentData {
  id: string
  text: string
  sentiment: SentimentResult
  timestamp: string
  platform: string
}

export class SentimentAnalysisService {
  private openaiApiKey: string

  constructor(openaiApiKey?: string) {
    this.openaiApiKey = openaiApiKey || ''
  }

  // Analizar sentimientos de comentarios usando OpenAI
  async analyzeComments(comments: Comment[]): Promise<SentimentData[]> {
    try {
      const results: SentimentData[] = []

      // Procesar comentarios en lotes para optimizar
      const batchSize = 10
      for (let i = 0; i < comments.length; i += batchSize) {
        const batch = comments.slice(i, i + batchSize)
        const batchResults = await this.analyzeBatch(batch)
        results.push(...batchResults)
      }

      return results
    } catch (error) {
      console.error('Error analizando comentarios:', error)
      return []
    }
  }

  // Analizar un lote de comentarios
  private async analyzeBatch(comments: Comment[]): Promise<SentimentData[]> {
    try {
      const prompt = this.createSentimentPrompt(comments)
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-5-nano',
          messages: [
            {
              role: 'system',
              content: 'You are an expert in sentiment analysis. Analyze the sentiment of each comment and return only a valid JSON with the results.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.1,
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error('Error en la API de OpenAI')
      }

      const data = await response.json()
      const analysisResult = JSON.parse(data.choices[0].message.content)

      return comments.map((comment, index) => ({
        id: comment.id,
        text: comment.text,
        sentiment: analysisResult[index],
        timestamp: comment.timestamp,
        platform: comment.platform
      }))
    } catch (error) {
      console.error('Error analizando lote de comentarios:', error)
      return comments.map(comment => ({
        id: comment.id,
        text: comment.text,
        sentiment: {
          text: comment.text,
          sentiment: 'neutral' as const,
          confidence: 0.5
        },
        timestamp: comment.timestamp,
        platform: comment.platform
      }))
    }
  }

  // Crear prompt para análisis de sentimientos usando técnicas avanzadas
  private createSentimentPrompt(comments: Comment[]): string {
    const commentTexts = comments.map((comment, index) => 
      `${index + 1}. "${comment.text}"`
    ).join('\n')

    // Aplicar técnicas avanzadas de prompt engineering
    return `
Act as an expert in sentiment analysis and emotional intelligence with deep understanding of consumer psychology, especially for Guatemalan market context.

CRITICAL TASK: This sentiment analysis is crucial for understanding customer satisfaction and improving our marketing strategy. The accuracy of your analysis directly impacts our business decisions and customer relationships.

Think step by step:
1) Identify emotional indicators and cultural context
2) Analyze sentiment patterns and underlying intent  
3) Consider Guatemalan cultural values and communication styles
4) Provide actionable insights for marketing optimization

Analyze the sentiment of the following comments and return a JSON with the format:
[
  {
    "text": "comment text",
    "sentiment": "positive|negative|neutral",
    "confidence": 0.0-1.0,
    "emotions": {
      "joy": 0.0-1.0,
      "sadness": 0.0-1.0,
      "anger": 0.0-1.0,
      "fear": 0.0-1.0,
      "surprise": 0.0-1.0,
      "trust": 0.0-1.0,
      "satisfaction": 0.0-1.0
    },
    "cultural_insights": "insights about Guatemalan cultural context",
    "actionable_recommendations": ["recommendation1", "recommendation2"]
  }
]

Comments to analyze:
${commentTexts}

IMPORTANT: Consider Guatemalan cultural values: family importance, trust in natural products, respect for traditional medicine, and preference for authentic, caring brands. Provide insights that help us better serve our Guatemalan customers.

Return only the JSON, without additional text.`
  }

  // Analizar menciones de marca
  async analyzeBrandMentions(mentions: BrandMention[]): Promise<BrandMention[]> {
    try {
      const results: BrandMention[] = []

      for (const mention of mentions) {
        const sentiment = await this.analyzeText(mention.text)
        results.push({
          ...mention,
          sentiment
        })
      }

      return results
    } catch (error) {
      console.error('Error analizando menciones de marca:', error)
      return mentions
    }
  }

  // Analizar texto individual
  async analyzeText(text: string): Promise<SentimentResult> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'gpt-5-nano',
          messages: [
            {
              role: 'system',
              content: 'You are an expert in sentiment analysis. Analyze the sentiment of the text and return only a valid JSON. Respond in Spanish for Guatemala.'
            },
            {
              role: 'user',
              content: `Analyze the sentiment of this text: "${text}"`
            }
          ],
          temperature: 0.1,
          max_tokens: 500
        })
      })

      if (!response.ok) {
        throw new Error('Error en la API de OpenAI')
      }

      const data = await response.json()
      return JSON.parse(data.choices[0].message.content)
    } catch (error) {
      console.error('Error analizando texto:', error)
      return {
        text,
        sentiment: 'neutral',
        confidence: 0.5
      }
    }
  }

  // Generar reporte de sentimientos
  async generateSentimentReport(data: SentimentData[]): Promise<SentimentReport> {
    try {
      const totalComments = data.length
      const positiveCount = data.filter(d => d.sentiment.sentiment === 'positive').length
      const negativeCount = data.filter(d => d.sentiment.sentiment === 'negative').length
      const neutralCount = data.filter(d => d.sentiment.sentiment === 'neutral').length

      // Calcular sentimiento promedio
      const sentimentScores = data.map(d => {
        switch (d.sentiment.sentiment) {
          case 'positive': return 1
          case 'negative': return -1
          default: return 0
        }
      })
      const averageSentiment = sentimentScores.reduce((a, b) => a + b, 0) / totalComments

      // Obtener emociones trending
      const allEmotions = data.flatMap(d => d.sentiment.emotions ? Object.keys(d.sentiment.emotions) : [])
      const emotionCounts = allEmotions.reduce((acc, emotion) => {
        acc[emotion] = (acc[emotion] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      const trendingEmotions = Object.entries(emotionCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([emotion]) => emotion)

      // Obtener comentarios más positivos y negativos
      const topPositiveComments = data
        .filter(d => d.sentiment.sentiment === 'positive')
        .sort((a, b) => b.sentiment.confidence - a.sentiment.confidence)
        .slice(0, 5)
        .map(d => ({
          id: d.id,
          text: d.text,
          author: 'Usuario',
          platform: d.platform,
          timestamp: d.timestamp
        }))

      const topNegativeComments = data
        .filter(d => d.sentiment.sentiment === 'negative')
        .sort((a, b) => b.sentiment.confidence - a.sentiment.confidence)
        .slice(0, 5)
        .map(d => ({
          id: d.id,
          text: d.text,
          author: 'Usuario',
          platform: d.platform,
          timestamp: d.timestamp
        }))

      // Generar recomendaciones
      const recommendations = this.generateRecommendations(averageSentiment, positiveCount, negativeCount)

      return {
        totalComments,
        positiveCount,
        negativeCount,
        neutralCount,
        averageSentiment,
        trendingEmotions,
        topPositiveComments,
        topNegativeComments,
        brandMentions: [], // Se puede implementar por separado
        recommendations
      }
    } catch (error) {
      console.error('Error generando reporte de sentimientos:', error)
      throw error
    }
  }

  // Generar recomendaciones basadas en el análisis
  private generateRecommendations(averageSentiment: number, positiveCount: number, negativeCount: number): string[] {
    const recommendations: string[] = []

    if (averageSentiment < -0.3) {
      recommendations.push('El sentimiento general es negativo. Considera revisar tu estrategia de comunicación.')
      recommendations.push('Implementa acciones para mejorar la percepción de tu marca.')
    } else if (averageSentiment > 0.3) {
      recommendations.push('El sentimiento general es positivo. Mantén la estrategia actual.')
      recommendations.push('Aprovecha los comentarios positivos para crear contenido adicional.')
    } else {
      recommendations.push('El sentimiento es neutral. Busca formas de generar más engagement positivo.')
    }

    if (negativeCount > positiveCount) {
      recommendations.push('Hay más comentarios negativos que positivos. Revisa las quejas más comunes.')
    }

    if (positiveCount > negativeCount * 2) {
      recommendations.push('Excelente ratio de sentimientos positivos. Considera amplificar este contenido.')
    }

    return recommendations
  }

  // Guardar análisis en la base de datos
  async saveSentimentAnalysis(data: SentimentData[], campaignId?: string): Promise<void> {
    try {
      const sentimentRecords = data.map(d => ({
        text: d.text,
        sentiment: d.sentiment.sentiment,
        confidence: d.sentiment.confidence,
        emotions: d.sentiment.emotions,
        platform: d.platform,
        timestamp: d.timestamp,
        campaign_id: campaignId
      }))

      const { error } = await supabase
        .from('sentiment_analysis')
        .insert(sentimentRecords)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Error guardando análisis de sentimientos:', error)
      throw error
    }
  }

  // Obtener análisis históricos
  async getHistoricalSentiment(campaignId?: string, days = 30): Promise<SentimentData[]> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      let query = supabase
        .from('sentiment_analysis')
        .select('*')
        .gte('timestamp', startDate.toISOString())

      if (campaignId) {
        query = query.eq('campaign_id', campaignId)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return data?.map(record => ({
        id: record.id,
        text: record.text,
        sentiment: {
          text: record.text,
          sentiment: record.sentiment,
          confidence: record.confidence,
          emotions: record.emotions
        },
        timestamp: record.timestamp,
        platform: record.platform
      })) || []
    } catch (error) {
      console.error('Error obteniendo análisis histórico:', error)
      return []
    }
  }
}

// Función para obtener API key de OpenAI
export async function getOpenAIKey(): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('api_credentials')
      .select('encrypted_value')
      .eq('provider', 'openai')
      .eq('is_active', true)
      .single()

    if (error || !data) {
      console.warn('No se encontró API key de OpenAI')
      return null
    }

    return data.encrypted_value
  } catch (error) {
    console.error('Error obteniendo API key de OpenAI:', error)
    return null
  }
}

// Función para crear instancia del servicio
export async function createSentimentAnalysisService(): Promise<SentimentAnalysisService> {
  const apiKey = await getOpenAIKey()
  return new SentimentAnalysisService(apiKey || undefined)
}

// Exportar servicio como objeto
export const sentimentAnalysisService = {
  createService: createSentimentAnalysisService,
  analyzeComments: async (comments: Comment[]) => {
    const service = await createSentimentAnalysisService()
    return service.analyzeComments(comments)
  },
  generateReport: async (data: SentimentData[]) => {
    const service = await createSentimentAnalysisService()
    return service.generateSentimentReport(data)
  }
}