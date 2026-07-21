// Cliente OpenAI para generación de contenido
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Solo para desarrollo, en producción usar backend
})

export interface ContentGenerationRequest {
  client: {
    name: string
    business_type: string
    industry: string
    target_audience: string
    unique_value_proposition: string
    country: string
  }
  contentType: string
  platform: string
  topic: string
  tone: string
}

export interface ContentGenerationResponse {
  content: string
  success: boolean
  error?: string
}

export async function generateContentWithAI(request: ContentGenerationRequest): Promise<ContentGenerationResponse> {
  try {
    const { client, contentType, platform, topic, tone } = request

    // Crear el prompt personalizado basado en el cliente y parámetros
    const prompt = createContentPrompt(client, contentType, platform, topic, tone)

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Usando GPT-4o Mini para mejor rendimiento
      messages: [
        {
          role: "system",
          content: `Eres un experto en marketing digital y copywriting. Generas contenido de marketing profesional, creativo y efectivo para empresas guatemaltecas. Tu contenido debe ser:

1. **Auténtico y personalizado** para cada cliente
2. **Culturalmente relevante** para el mercado guatemalteco
3. **Optimizado para engagement** en redes sociales
4. **Profesional pero accesible**
5. **Incluir call-to-actions claros**
6. **Usar hashtags relevantes**

Formato de respuesta: Genera contenido estructurado con:
- Hook atractivo
- Contenido principal
- Call-to-action
- Hashtags relevantes
- Tono apropiado para la plataforma`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_completion_tokens: 1000,
      temperature: 0.7,
    })

    const generatedContent = completion.choices[0]?.message?.content || ''
    
    if (!generatedContent) {
      throw new Error('No se pudo generar contenido')
    }

    return {
      content: generatedContent,
      success: true
    }

  } catch (error) {
    console.error('Error generando contenido con OpenAI:', error)
    return {
      content: '',
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido'
    }
  }
}

function createContentPrompt(
  client: ContentGenerationRequest['client'],
  contentType: string,
  platform: string,
  topic: string,
  tone: string
): string {
  const contentTypeLabels = {
    'social_post': 'post de red social',
    'blog_post': 'artículo de blog',
    'email': 'email marketing',
    'ad_copy': 'copia publicitaria',
    'story': 'story/historia',
    'video_script': 'guión de video'
  }

  const platformGuidelines = {
    'facebook': 'Facebook: Contenido conversacional, preguntas para engagement, emojis moderados',
    'instagram': 'Instagram: Visual, hashtags abundantes, emojis, stories dinámicas',
    'linkedin': 'LinkedIn: Profesional, insights de industria, networking',
    'twitter': 'Twitter: Conciso, trending topics, conversaciones rápidas',
    'tiktok': 'TikTok: Creativo, viral, tendencias, música y hashtags',
    'youtube': 'YouTube: Educativo, entretenido, descripción detallada'
  }

  const toneGuidelines = {
    'professional': 'Tono profesional y formal',
    'casual': 'Tono casual y relajado',
    'friendly': 'Tono amigable y cercano',
    'authoritative': 'Tono autoritario y experto',
    'humorous': 'Tono humorístico y divertido',
    'inspirational': 'Tono inspiracional y motivador'
  }

  return `
Genera un ${contentTypeLabels[contentType as keyof typeof contentTypeLabels] || contentType} para ${platform.toUpperCase()} sobre "${topic}".

**INFORMACIÓN DEL CLIENTE:**
- Empresa: ${client.name}
- Tipo de negocio: ${client.business_type}
- Industria: ${client.industry}
- Audiencia objetivo: ${client.target_audience}
- Propuesta de valor: ${client.unique_value_proposition}
- País: ${client.country}

**ESPECIFICACIONES:**
- Plataforma: ${platformGuidelines[platform as keyof typeof platformGuidelines] || platform}
- Tono: ${toneGuidelines[tone as keyof typeof toneGuidelines] || tone}
- Tema: ${topic}

**REQUISITOS:**
1. El contenido debe ser específico para ${client.name} y su industria
2. Debe resonar con el mercado guatemalteco
3. Incluir elementos culturales relevantes cuando sea apropiado
4. Optimizado para ${platform}
5. Incluir call-to-action claro
6. Hashtags relevantes para Guatemala y la industria
7. Longitud apropiada para ${platform}

Genera contenido que sea auténtico, engaging y que refleje la personalidad de ${client.name}.`
}

