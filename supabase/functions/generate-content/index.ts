import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

interface ContentRequest {
  client_id: string;
  type: 'post' | 'strategy' | 'analysis';
  topic?: string;
  platform?: string;
  tone?: string;
  custom_prompt?: string;
  openai_api_key?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { 
      client_id, 
      type, 
      topic, 
      platform = 'general', 
      tone = 'profesional',
      custom_prompt,
      openai_api_key
    }: ContentRequest = await req.json();

    if (!client_id || !type) {
      throw new Error('client_id y type son requeridos');
    }

    const finalOpenaiApiKey = openai_api_key || openaiApiKey;
    if (!finalOpenaiApiKey) {
      throw new Error('OpenAI API key no configurada');
    }

    // Obtener información del cliente específico
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', client_id)
      .single();

    if (clientError || !client) {
      throw new Error('Cliente no encontrado');
    }

    // Construir información detallada del cliente
    const clientInfo = `
=== INFORMACIÓN DEL CLIENTE ===
Empresa: ${client.name}
Industria: ${client.industry || client.business_type}
Descripción: ${client.description}
Propuesta de Valor: ${client.unique_value_proposition || client.primary_goal}
Sitio Web: ${client.website_url}
País: ${client.country || 'No especificado'}

=== AUDIENCIA OBJETIVO ===
${JSON.stringify(client.target_audience, null, 2)}

=== ANÁLISIS DE COMPETENCIA ===
${JSON.stringify(client.competitors, null, 2)}

=== PERFILES SOCIALES ===
${JSON.stringify(client.social_profiles, null, 2)}
`;

    // Construir el prompt según el tipo de contenido
    let systemPrompt = '';
    let userPrompt = '';
    
    switch (type) {
      case 'post':
        systemPrompt = `Eres un experto en marketing digital especializado en el framework "Hook-Story-Offer" de Russell Brunson.

Generas contenido de alta conversión para redes sociales que:
1. HOOK: Captura atención en los primeros 3 segundos
2. STORY: Conecta emocionalmente con narrativas persuasivas
3. OFFER: Impulsa acción con ofertas irresistibles

IMPORTANTE: Responde ÚNICAMENTE con un JSON válido. NO incluyas texto adicional, explicaciones, o formato markdown. Solo el JSON.

Estructura JSON requerida:
{
  "hook": "Gancho que para el scroll",
  "story": "Historia que conecta emocionalmente",
  "offer": "Oferta específica con llamada a la acción",
  "content_body": "Contenido final optimizado para ${platform}",
  "hashtags": ["#hashtag1", "#hashtag2", "#hashtag3"],
  "call_to_action": "CTA específico",
  "platform_optimization": {
    "character_count": 0,
    "optimal_posting_time": "Mejor horario para publicar"
  },
  "optimal_posting_time": "Mejor horario para publicar en ${platform}",
  "engagement_prediction": {
    "predicted_engagement_rate": "X%",
    "expected_reach": "X personas",
    "estimated_likes": "X likes",
    "estimated_comments": "X comentarios"
  },
  "hashtag_suggestions": ["#hashtag1", "#hashtag2", "#hashtag3", "#hashtag4", "#hashtag5"],
  "suggested_media": [
    "Tipo de imagen/video sugerido 1",
    "Tipo de imagen/video sugerido 2",
    "Tipo de imagen/video sugerido 3"
  ]
}`;
        
        userPrompt = `${clientInfo}

=== CONFIGURACIÓN ESPECÍFICA DEL CONTENIDO ===
PLATAFORMA: ${platform}
TIPO DE CONTENIDO: ${type}
TEMA: ${topic || 'el negocio'}
TONO: ${tone}
CATEGORÍA DE CONTENIDO: ${topic || 'general'}

=== INSTRUCCIONES ESPECÍFICAS ===
GENERA un post para ${platform} sobre "${topic || 'el negocio'}" con tono ${tone}.

REQUISITOS OBLIGATORIOS:
1. ADAPTA TODO al mercado guatemalteco/centroamericano
2. Usa datos REALES de ${client.name} (no inventes información)
3. Incluye referencias específicas a su industria: ${client.industry || client.business_type}
4. Menciona su propuesta de valor única: ${client.unique_value_proposition || client.primary_goal}
5. Dirige el contenido a su audiencia específica: ${client.target_audience}
6. Incluye elementos culturales locales cuando sea relevante
7. Usa precios en Quetzales (Q) si mencionas costos
8. Incluye hashtags relevantes para Guatemala/Centroamérica

ADAPTACIÓN POR PLATAFORMA:
- ${platform === 'facebook' ? 'FACEBOOK: Usa formato de post largo, incluye preguntas para engagement, menciona eventos locales' : ''}
- ${platform === 'instagram' ? 'INSTAGRAM: Usa emojis, hashtags relevantes, formato visual atractivo' : ''}
- ${platform === 'linkedin' ? 'LINKEDIN: Tono profesional, enfoque en B2B, menciona logros y métricas' : ''}
- ${platform === 'tiktok' ? 'TIKTOK: Contenido dinámico, tendencias locales, formato vertical' : ''}
- ${platform === 'twitter' ? 'TWITTER: Mensaje conciso, hashtags trending, formato de hilo si es necesario' : ''}

ADAPTACIÓN POR TIPO:
- ${type === 'post' ? 'POST: Contenido educativo o promocional balanceado' : ''}
- ${type === 'story' ? 'STORY: Contenido más personal, behind the scenes' : ''}
- ${type === 'video' ? 'VIDEO: Script para video, incluye call-to-action visual' : ''}
- ${type === 'carousel' ? 'CARRUSEL: Múltiples puntos clave, formato secuencial' : ''}
- ${type === 'ad' ? 'ANUNCIO: Enfoque en conversión, CTA claro, elementos de urgencia' : ''}

CAMPOS ESPECÍFICOS REQUERIDOS:
- optimal_posting_time: Horario específico para ${platform} en Guatemala (ej: "18:00 - 20:00")
- engagement_prediction: Predicción realista basada en la audiencia de ${client.name}
- hashtag_suggestions: 5 hashtags específicos para ${client.name} y su industria
- suggested_media: 3 sugerencias específicas de tipo de contenido visual para ${platform}

${custom_prompt ? `INSTRUCCIONES ADICIONALES: ${custom_prompt}` : ''}

El contenido debe ser tan específico que parezca escrito por alguien que conoce profundamente ${client.name} y su mercado local.

CRÍTICO: Responde ÚNICAMENTE con un JSON válido. NO incluyas texto adicional, explicaciones, comentarios, o formato markdown. Solo el JSON con la estructura exacta especificada.`;
        break;
        
      case 'strategy':
        systemPrompt = `Eres un estratega de marketing digital experto que crea estrategias basadas en datos reales del cliente.

Debes responder ÚNICAMENTE en formato JSON con esta estructura exacta:
{
  "strategy_title": "Título de la estrategia",
  "objectives": ["Objetivo 1", "Objetivo 2", "Objetivo 3"],
  "target_analysis": "Análisis detallado de la audiencia objetivo",
  "competitive_advantage": "Ventaja competitiva específica",
  "tactics": [
    {
      "name": "Táctica 1",
      "description": "Descripción detallada",
      "timeline": "Cronograma",
      "expected_result": "Resultado esperado"
    }
  ],
  "metrics": ["KPI 1", "KPI 2", "KPI 3"],
  "budget_allocation": {
    "content_creation": "30%",
    "paid_advertising": "40%",
    "tools_and_software": "20%",
    "other": "10%"
  },
  "implementation_steps": ["Paso 1", "Paso 2", "Paso 3"]
}`;
        
        userPrompt = `${clientInfo}

=== INSTRUCCIONES ESPECÍFICAS ===
GENERA una estrategia de marketing digital para "${topic || 'crecimiento general'}".

REQUISITOS OBLIGATORIOS:
1. ADAPTA TODO al mercado guatemalteco/centroamericano
2. Usa datos REALES de ${client.name} (no inventes información)
3. Incluye referencias específicas a su industria: ${client.industry || client.business_type}
4. Considera su audiencia objetivo específica: ${client.target_audience}
5. Analiza su competencia real: ${JSON.stringify(client.competitors, null, 2)}
6. Basa la estrategia en su propuesta de valor: ${client.unique_value_proposition || client.primary_goal}
7. Incluye tácticas específicas para el mercado local
8. Usa precios en Quetzales (Q) para presupuestos
9. Menciona plataformas populares en Guatemala (Facebook, Instagram, WhatsApp Business)

${custom_prompt ? `CONSIDERACIONES ADICIONALES: ${custom_prompt}` : ''}

La estrategia debe ser tan específica que el cliente pueda implementarla inmediatamente sin investigación adicional.

Responde SOLO en formato JSON válido.`;
        break;
        
      case 'analysis':
        systemPrompt = `Eres un analista de mercado experto que realiza análisis profundos basados en datos del cliente.

Debes responder ÚNICAMENTE en formato JSON con esta estructura exacta:
{
  "analysis_title": "Título del análisis",
  "market_overview": "Visión general del mercado",
  "industry_trends": ["Tendencia 1", "Tendencia 2", "Tendencia 3"],
  "competitive_landscape": {
    "main_competitors": ["Competidor 1", "Competidor 2"],
    "competitive_gaps": ["Oportunidad 1", "Oportunidad 2"],
    "market_positioning": "Posicionamiento recomendado"
  },
  "target_audience_insights": {
    "demographics": "Datos demográficos clave",
    "psychographics": "Aspectos psicográficos",
    "pain_points": ["Dolor 1", "Dolor 2", "Dolor 3"],
    "opportunities": ["Oportunidad 1", "Oportunidad 2"]
  },
  "recommendations": [
    {
      "category": "Categoría",
      "recommendation": "Recomendación específica",
      "priority": "Alta/Media/Baja",
      "impact": "Impacto esperado"
    }
  ],
  "key_metrics_to_track": ["Métrica 1", "Métrica 2", "Métrica 3"]
}`;
        
        userPrompt = `${clientInfo}

=== INSTRUCCIONES ESPECÍFICAS ===
REALIZA un análisis de mercado sobre "${topic || 'la industria y competencia'}".

REQUISITOS OBLIGATORIOS:
1. ADAPTA TODO al mercado guatemalteco/centroamericano
2. Usa datos REALES de ${client.name} (no inventes información)
3. Analiza específicamente la industria: ${client.industry || client.business_type}
4. Enfócate en el mercado de ${client.country || 'Guatemala'}
5. Incluye análisis detallado de sus competidores reales: ${JSON.stringify(client.competitors, null, 2)}
6. Identifica oportunidades únicas basadas en su propuesta de valor: ${client.unique_value_proposition || client.primary_goal}
7. Incluye tendencias específicas del mercado local
8. Menciona regulaciones o características del mercado guatemalteco
9. Proporciona recomendaciones accionables para el contexto local

${custom_prompt ? `ENFOQUE ESPECIAL: ${custom_prompt}` : ''}

El análisis debe ser tan específico que proporcione insights únicos para ${client.name} en su mercado local.

Responde SOLO en formato JSON válido.`;
        break;
        
      default:
        throw new Error('Tipo de contenido no válido');
    }

    console.log('Generando contenido con OpenAI para cliente:', client.name);
    console.log('API Key length:', finalOpenaiApiKey.length);
    console.log('System prompt length:', systemPrompt.length);
    console.log('User prompt length:', userPrompt.length);

    // Llamada a OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${finalOpenaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-5-nano',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        max_completion_tokens: 2000,
        temperature: 1
      })
    });

    console.log('OpenAI response status:', openaiResponse.status);
    
    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error('OpenAI API error:', errorData);
      console.error('Response headers:', Object.fromEntries(openaiResponse.headers.entries()));
      throw new Error(`OpenAI API error: ${errorData}`);
    }

    const openaiData = await openaiResponse.json();
    const generatedContent = openaiData.choices[0].message.content;

    console.log('Contenido generado exitosamente con OpenAI para:', client.name);
    console.log('Raw OpenAI response:', generatedContent);

    // Parsear el JSON generado
    let contentData;
    try {
      // Limpiar el contenido si tiene formato markdown
      let cleanContent = generatedContent.replace(/```json\n?|```\n?/g, '').trim();
      
      // Remover cualquier texto antes o después del JSON
      const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanContent = jsonMatch[0];
      }
      
      // Limpiar caracteres problemáticos
      cleanContent = cleanContent.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
      
      console.log('Cleaned content for parsing:', cleanContent);
      contentData = JSON.parse(cleanContent);
      console.log('Successfully parsed JSON:', contentData);
      
      // Agregar metadatos del cliente
      contentData.client_info = {
        id: client_id,
        name: client.name,
        industry: client.industry || client.business_type
      };
      contentData.generation_timestamp = new Date().toISOString();
      contentData.content_type = type;
      contentData.platform = platform;
      
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw response that failed to parse:', generatedContent);
      
      // Crear contenido de fallback específico del cliente con TODOS los campos requeridos
      contentData = {
        client_info: {
          id: client_id,
          name: client.name,
          industry: client.industry || client.business_type
        },
        generation_timestamp: new Date().toISOString(),
        content_type: type,
        platform: platform,
        hook: `Descubre lo que ${client.name} tiene para ti`,
        story: `En ${client.name}, entendemos las necesidades específicas de ${client.target_audience || 'nuestros clientes'}. Por eso ofrecemos ${client.unique_value_proposition || client.primary_goal}`,
        offer: "Conoce más sobre nuestros productos y servicios. ¡Contáctanos hoy!",
        content_body: `🌟 Descubre lo que ${client.name} tiene para ti\n\nEn ${client.name}, entendemos las necesidades específicas de ${client.target_audience || 'nuestros clientes'}. Por eso ofrecemos ${client.unique_value_proposition || client.primary_goal}\n\n✨ Conoce más sobre nuestros productos y servicios. ¡Contáctanos hoy!\n\n#${client.name.replace(/\s+/g, '')} #${(client.industry || client.business_type).replace(/\s+/g, '')}`,
        hashtags: [`#${client.name.replace(/\s+/g, '')}`, `#${(client.industry || client.business_type).replace(/\s+/g, '')}`, '#CalidadYConfianza'],
        call_to_action: "¡Contáctanos para más información!",
        platform_optimization: {
          character_count: 200,
          optimal_posting_time: "18:00 - 20:00"
        },
        // CAMPOS ADICIONALES REQUERIDOS POR EL FRONTEND
        optimal_posting_time: "18:00 - 20:00",
        engagement_prediction: {
          predicted_engagement_rate: "8-12%",
          expected_reach: "500-800 personas",
          estimated_likes: "40-60 likes",
          estimated_comments: "5-10 comentarios"
        },
        hashtag_suggestions: [
          `#${client.name.replace(/\s+/g, '')}`,
          `#${(client.industry || client.business_type).replace(/\s+/g, '')}`,
          '#Guatemala',
          '#CalidadYConfianza',
          '#MercadoLocal'
        ],
        suggested_media: [
          `Imagen promocional de ${client.name} con productos destacados`,
          `Video testimonial de clientes satisfechos`,
          `Infografía con beneficios de ${client.name}`
        ],
        fallback: true
      };
      console.log('Using client-specific fallback content');
    }

    // Retornar datos estructurados
    return new Response(JSON.stringify({
      data: contentData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Content generation error:', error);

    const errorResponse = {
      error: {
        code: 'CONTENT_GENERATION_FAILED',
        message: error.message,
        timestamp: new Date().toISOString()
      }
    };

    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});