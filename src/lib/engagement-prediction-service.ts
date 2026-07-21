/**
 * Engagement Prediction Service
 * Servicio de predicción de engagement usando TensorFlow.js para MarketPro GT
 * Basado en: mejoras/jsons/tensorflowjs_content_prediction.json
 */

import * as tf from '@tensorflow/tfjs'

// Tipos para predicción de engagement
export interface ContentFeatures {
  platform: string
  content_type: 'text' | 'image' | 'video' | 'carousel'
  post_length: number
  hashtag_count: number
  mention_count: number
  emoji_count: number
  link_present: boolean
  time_of_day: number // 0-23
  day_of_week: number // 0-6
  follower_count: number
  account_age_days: number
  previous_engagement_rate: number
  content_sentiment: number // -1 to 1
  topic_relevance: number // 0 to 1
}

export interface EngagementPrediction {
  predicted_engagement_rate: number
  predicted_likes: number
  predicted_comments: number
  predicted_shares: number
  predicted_reach: number
  confidence_score: number
  factors: {
    positive_factors: string[]
    negative_factors: string[]
    recommendations: string[]
  }
}

export interface ModelTrainingData {
  features: ContentFeatures[]
  targets: {
    engagement_rate: number[]
    likes: number[]
    comments: number[]
    shares: number[]
    reach: number[]
  }
}

// Clase principal del servicio de predicción de engagement
export class EngagementPredictionService {
  private model: tf.LayersModel | null = null
  private isModelLoaded = false
  private modelPath = '/models/engagement-prediction-model.json'

  /**
   * Inicializa el modelo de predicción
   */
  async initializeModel(): Promise<void> {
    try {
      // Intentar cargar modelo pre-entrenado
      try {
        this.model = await tf.loadLayersModel(this.modelPath)
        this.isModelLoaded = true
        console.log('Modelo de predicción cargado exitosamente')
      } catch (error) {
        console.log('No se encontró modelo pre-entrenado, creando modelo nuevo')
        await this.createNewModel()
      }
    } catch (error) {
      console.error('Error inicializando modelo de predicción:', error)
      throw error
    }
  }

  /**
   * Crea un nuevo modelo de predicción
   */
  private async createNewModel(): Promise<void> {
    try {
      // Crear modelo secuencial
      this.model = tf.sequential({
        layers: [
          // Capa de entrada
          tf.layers.dense({
            inputShape: [13], // 13 características
            units: 64,
            activation: 'relu',
            name: 'input_layer'
          }),
          // Capas ocultas
          tf.layers.dense({
            units: 32,
            activation: 'relu',
            name: 'hidden_layer_1'
          }),
          tf.layers.dropout({
            rate: 0.2,
            name: 'dropout_1'
          }),
          tf.layers.dense({
            units: 16,
            activation: 'relu',
            name: 'hidden_layer_2'
          }),
          tf.layers.dropout({
            rate: 0.1,
            name: 'dropout_2'
          }),
          // Capa de salida (5 valores: engagement_rate, likes, comments, shares, reach)
          tf.layers.dense({
            units: 5,
            activation: 'linear',
            name: 'output_layer'
          })
        ]
      })

      // Compilar modelo
      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'meanSquaredError',
        metrics: ['meanAbsoluteError']
      })

      this.isModelLoaded = true
      console.log('Nuevo modelo de predicción creado')
    } catch (error) {
      console.error('Error creando modelo:', error)
      throw error
    }
  }

  /**
   * Entrena el modelo con datos históricos
   */
  async trainModel(trainingData: ModelTrainingData): Promise<void> {
    if (!this.model) {
      throw new Error('Modelo no inicializado')
    }

    try {
      // Preparar datos de entrenamiento
      const features = tf.tensor2d(trainingData.features.map(this.normalizeFeatures))
      const targets = tf.tensor2d(trainingData.targets.engagement_rate.map((rate, index) => [
        rate,
        trainingData.targets.likes[index],
        trainingData.targets.comments[index],
        trainingData.targets.shares[index],
        trainingData.targets.reach[index]
      ]))

      // Entrenar modelo
      const history = await this.model.fit(features, targets, {
        epochs: 100,
        batchSize: 32,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            if (epoch % 10 === 0) {
              console.log(`Epoch ${epoch}: loss = ${logs?.loss?.toFixed(4)}`)
            }
          }
        }
      })

      // Limpiar tensores
      features.dispose()
      targets.dispose()

      console.log('Modelo entrenado exitosamente')
    } catch (error) {
      console.error('Error entrenando modelo:', error)
      throw error
    }
  }

  /**
   * Predice el engagement para contenido dado
   */
  async predictEngagement(features: ContentFeatures): Promise<EngagementPrediction> {
    if (!this.model || !this.isModelLoaded) {
      throw new Error('Modelo no inicializado o no cargado')
    }

    try {
      // Normalizar características
      const normalizedFeatures = this.normalizeFeatures(features)
      const input = tf.tensor2d([normalizedFeatures])

      // Hacer predicción
      const prediction = this.model.predict(input) as tf.Tensor
      const predictionArray = await prediction.data()

      // Extraer resultados
      const [
        predicted_engagement_rate,
        predicted_likes,
        predicted_comments,
        predicted_shares,
        predicted_reach
      ] = Array.from(predictionArray)

      // Limpiar tensores
      input.dispose()
      prediction.dispose()

      // Calcular confianza basada en similitud con datos históricos
      const confidence_score = this.calculateConfidence(features)

      // Analizar factores
      const factors = this.analyzeFactors(features)

      return {
        predicted_engagement_rate: Math.max(0, predicted_engagement_rate),
        predicted_likes: Math.max(0, Math.round(predicted_likes)),
        predicted_comments: Math.max(0, Math.round(predicted_comments)),
        predicted_shares: Math.max(0, Math.round(predicted_shares)),
        predicted_reach: Math.max(0, Math.round(predicted_reach)),
        confidence_score,
        factors
      }
    } catch (error) {
      console.error('Error prediciendo engagement:', error)
      throw error
    }
  }

  /**
   * Normaliza las características para el modelo
   */
  private normalizeFeatures(features: ContentFeatures): number[] {
    return [
      this.normalizePlatform(features.platform),
      this.normalizeContentType(features.content_type),
      features.post_length / 1000, // Normalizar longitud del post
      features.hashtag_count / 30, // Normalizar hashtags
      features.mention_count / 10, // Normalizar menciones
      features.emoji_count / 20, // Normalizar emojis
      features.link_present ? 1 : 0,
      features.time_of_day / 23, // Normalizar hora
      features.day_of_week / 6, // Normalizar día
      Math.log(features.follower_count + 1) / 15, // Log normalizar seguidores
      features.account_age_days / 3650, // Normalizar edad de cuenta (10 años)
      features.previous_engagement_rate / 100, // Normalizar engagement previo
      (features.content_sentiment + 1) / 2, // Normalizar sentimiento (-1,1) -> (0,1)
      features.topic_relevance
    ]
  }

  /**
   * Normaliza la plataforma a un valor numérico
   */
  private normalizePlatform(platform: string): number {
    const platformMap: Record<string, number> = {
      'facebook': 0,
      'instagram': 1,
      'twitter': 2,
      'linkedin': 3,
      'youtube': 4,
      'tiktok': 5
    }
    return platformMap[platform] / 5 // Normalizar a 0-1
  }

  /**
   * Normaliza el tipo de contenido a un valor numérico
   */
  private normalizeContentType(contentType: string): number {
    const typeMap: Record<string, number> = {
      'text': 0,
      'image': 1,
      'video': 2,
      'carousel': 3
    }
    return typeMap[contentType] / 3 // Normalizar a 0-1
  }

  /**
   * Calcula la confianza de la predicción
   */
  private calculateConfidence(features: ContentFeatures): number {
    let confidence = 0.5 // Base confidence

    // Aumentar confianza basado en factores positivos
    if (features.follower_count > 10000) confidence += 0.1
    if (features.previous_engagement_rate > 5) confidence += 0.1
    if (features.hashtag_count >= 3 && features.hashtag_count <= 10) confidence += 0.05
    if (features.content_sentiment > 0.5) confidence += 0.05
    if (features.topic_relevance > 0.7) confidence += 0.1

    // Reducir confianza basado en factores negativos
    if (features.follower_count < 1000) confidence -= 0.1
    if (features.previous_engagement_rate < 1) confidence -= 0.1
    if (features.hashtag_count > 20) confidence -= 0.05
    if (features.content_sentiment < -0.5) confidence -= 0.05

    return Math.max(0, Math.min(1, confidence))
  }

  /**
   * Analiza factores que afectan el engagement
   */
  private analyzeFactors(features: ContentFeatures): {
    positive_factors: string[]
    negative_factors: string[]
    recommendations: string[]
  } {
    const positive_factors: string[] = []
    const negative_factors: string[] = []
    const recommendations: string[] = []

    // Analizar seguidores
    if (features.follower_count > 10000) {
      positive_factors.push('Audiencia grande y establecida')
    } else if (features.follower_count < 1000) {
      negative_factors.push('Audiencia pequeña')
      recommendations.push('Considera estrategias de crecimiento de audiencia')
    }

    // Analizar engagement previo
    if (features.previous_engagement_rate > 5) {
      positive_factors.push('Historial de alto engagement')
    } else if (features.previous_engagement_rate < 1) {
      negative_factors.push('Bajo engagement histórico')
      recommendations.push('Mejora la calidad del contenido')
    }

    // Analizar hashtags
    if (features.hashtag_count >= 3 && features.hashtag_count <= 10) {
      positive_factors.push('Uso óptimo de hashtags')
    } else if (features.hashtag_count > 20) {
      negative_factors.push('Demasiados hashtags')
      recommendations.push('Reduce el número de hashtags a 3-10')
    } else if (features.hashtag_count < 3) {
      recommendations.push('Agrega más hashtags relevantes')
    }

    // Analizar sentimiento
    if (features.content_sentiment > 0.5) {
      positive_factors.push('Contenido positivo')
    } else if (features.content_sentiment < -0.5) {
      negative_factors.push('Contenido negativo')
      recommendations.push('Considera un tono más positivo')
    }

    // Analizar relevancia del tema
    if (features.topic_relevance > 0.7) {
      positive_factors.push('Alta relevancia del tema')
    } else if (features.topic_relevance < 0.3) {
      negative_factors.push('Baja relevancia del tema')
      recommendations.push('Mejora la relevancia del contenido')
    }

    // Analizar tipo de contenido
    if (features.content_type === 'video') {
      positive_factors.push('Contenido de video (alto engagement)')
    } else if (features.content_type === 'text' && features.post_length > 500) {
      recommendations.push('Considera agregar elementos visuales')
    }

    // Analizar hora de publicación
    if (features.time_of_day >= 9 && features.time_of_day <= 17) {
      positive_factors.push('Hora óptima de publicación')
    } else {
      recommendations.push('Considera publicar en horario laboral')
    }

    return {
      positive_factors,
      negative_factors,
      recommendations
    }
  }

  /**
   * Guarda el modelo entrenado
   */
  async saveModel(): Promise<void> {
    if (!this.model) {
      throw new Error('Modelo no inicializado')
    }

    try {
      await this.model.save(`localstorage://${this.modelPath}`)
      console.log('Modelo guardado exitosamente')
    } catch (error) {
      console.error('Error guardando modelo:', error)
      throw error
    }
  }

  /**
   * Carga el modelo desde almacenamiento local
   */
  async loadModel(): Promise<void> {
    try {
      this.model = await tf.loadLayersModel(`localstorage://${this.modelPath}`)
      this.isModelLoaded = true
      console.log('Modelo cargado desde almacenamiento local')
    } catch (error) {
      console.log('No se pudo cargar modelo desde almacenamiento local')
      throw error
    }
  }

  /**
   * Verifica si el modelo está listo
   */
  isReady(): boolean {
    return this.isModelLoaded && this.model !== null
  }
}

// Función para crear una instancia del servicio
export function createEngagementPredictionService(): EngagementPredictionService {
  return new EngagementPredictionService()
}
