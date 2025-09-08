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
      custom_prompt
    }: ContentRequest = await req.json();

    if (!client_id || !type) {
      throw new Error('client_id y type son requeridos');
    }

    if (!openaiApiKey) {
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
Industria: ${client.industry}
Descripción: ${client.description}
Propuesta de Valor: ${client.unique_value_proposition}
Sitio Web: ${client.website_url}
País: ${client.country}

=== AUDIENCIA OBJETIVO ===
${JSON.stringify(client.target_audience, null, 2)}

=== ANÁLISIS DE COMPETENCIA ===
${JSON.stringify(client.competitors, null, 2)}
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

Debes responder ÚNICAMENTE en formato JSON con esta estructura exacta:
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
  }
}`;
        
        userPrompt = `${clientInfo}

GENERA un post para ${platform} sobre "${topic || 'el negocio'}" con tono ${tone}.

El contenido debe ser ESPECÍFICO para ${client.name} y su audiencia. Usa sus datos reales, competencia y propuesta de valor.

${custom_prompt ? `INSTRUCCIONES ADICIONALES: ${custom_prompt}` : ''}

Responde SOLO en formato JSON.`;
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

GENERA una estrategia de marketing digital para "${topic || 'crecimiento general'}".

La estrategia debe ser ESPECÍFICA para ${client.name}, considerando:
- Su industria (${client.industry})
- Su audiencia objetivo
- Su competencia actual
- Su propuesta de valor única

${custom_prompt ? `CONSIDERACIONES ADICIONALES: ${custom_prompt}` : ''}

Responde SOLO en formato JSON.`;
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

REALIZA un análisis de mercado sobre "${topic || 'la industria y competencia'}".

El análisis debe ser ESPECÍFICO para ${client.name} en el contexto de:
- La industria ${client.industry}
- Su mercado objetivo en ${client.country}
- Sus competidores actuales
- Oportunidades únicas para su propuesta de valor

${custom_prompt ? `ENFOQUE ESPECIAL: ${custom_prompt}` : ''}

Responde SOLO en formato JSON.`;
        break;
        
      default:
        throw new Error('Tipo de contenido no válido');
    }

    console.log('Generando contenido con OpenAI para cliente:', client.name);

    // Llamada a OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
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
        max_completion_tokens: 2000
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData}`);
    }

    const openaiData = await openaiResponse.json();
    const generatedContent = openaiData.choices[0].message.content;

    console.log('Contenido generado exitosamente para:', client.name);

    // Parsear el JSON generado
    let contentData;
    try {
      // Limpiar el contenido si tiene formato markdown
      let cleanContent = generatedContent.replace(/```json\n?|```\n?/g, '').trim();
      contentData = JSON.parse(cleanContent);
      
      // Agregar metadatos del cliente
      contentData.client_info = {
        id: client_id,
        name: client.name,
        industry: client.industry
      };
      contentData.generation_timestamp = new Date().toISOString();
      contentData.content_type = type;
      contentData.platform = platform;
      
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw response that failed to parse:', generatedContent);
      
      // Crear contenido de fallback específico del cliente
      contentData = {
        client_info: {
          id: client_id,
          name: client.name,
          industry: client.industry
        },
        generation_timestamp: new Date().toISOString(),
        content_type: type,
        platform: platform,
        hook: `Descubre lo que ${client.name} tiene para ti`,
        story: `En ${client.name}, entendemos las necesidades específicas de ${client.target_audience?.primary || 'nuestros clientes'}. Por eso ofrecemos ${client.unique_value_proposition}`,
        offer: "Conoce más sobre nuestros productos y servicios. ¡Contáctanos hoy!",
        content_body: `🌟 Descubre lo que ${client.name} tiene para ti\n\nEn ${client.name}, entendemos las necesidades específicas de ${client.target_audience?.primary || 'nuestros clientes'}. Por eso ofrecemos ${client.unique_value_proposition}\n\n✨ Conoce más sobre nuestros productos y servicios. ¡Contáctanos hoy!\n\n#${client.name.replace(/\s+/g, '')} #${client.industry.replace(/\s+/g, '')}`,
        hashtags: [`#${client.name.replace(/\s+/g, '')}`, `#${client.industry.replace(/\s+/g, '')}`, '#CalidadYConfianza'],
        call_to_action: "¡Contáctanos para más información!",
        platform_optimization: {
          character_count: 200,
          optimal_posting_time: "18:00 - 20:00"
        },
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