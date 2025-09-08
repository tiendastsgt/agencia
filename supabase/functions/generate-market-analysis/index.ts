Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
    'Access-Control-Max-Age': '86400',
    'Access-Control-Allow-Credentials': 'false'
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { clientId, analysisType, customRequirements } = await req.json();

    if (!clientId || !analysisType) {
      throw new Error('clientId y analysisType son requeridos');
    }

    // Obtener claves de entorno
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!openaiApiKey) {
      throw new Error('OpenAI API key no configurada');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    // Obtener información del cliente
    const clientResponse = await fetch(`${supabaseUrl}/rest/v1/clients?id=eq.${clientId}`, {
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json'
      }
    });

    if (!clientResponse.ok) {
      throw new Error('No se pudo obtener información del cliente');
    }

    const clients = await clientResponse.json();
    if (!clients || clients.length === 0) {
      throw new Error('Cliente no encontrado');
    }

    const client = clients[0];

    // Construir prompt especializado para análisis de mercado
    const systemPrompt = `Eres un experto analista de mercado y estratega de marketing digital especializado en Guatemala y Centroamérica.

Generas análisis profundos de mercado usando metodologías avanzadas:
- Análisis competitivo detallado
- Identificación de oportunidades de mercado
- Segmentación de audiencias
- Tendencias de consumo regional
- Estrategias de posicionamiento
- Análisis de precios y valor percibido

Estructura de respuesta JSON requerida:
{
  "analysis_type": "${analysisType}",
  "client_name": "${client.name}",
  "executive_summary": "Resumen ejecutivo del análisis",
  "market_size_analysis": {
    "total_addressable_market": "Tamaño total del mercado",
    "serviceable_addressable_market": "Mercado direccionable",
    "growth_projections": "Proyecciones de crecimiento"
  },
  "competitive_landscape": {
    "direct_competitors": [],
    "indirect_competitors": [],
    "competitive_advantages": [],
    "market_gaps": []
  },
  "target_audience_analysis": {
    "primary_segments": [],
    "psychographic_profiles": [],
    "pain_points": [],
    "buying_behaviors": []
  },
  "opportunity_assessment": {
    "immediate_opportunities": [],
    "medium_term_opportunities": [],
    "potential_threats": [],
    "recommendations": []
  },
  "digital_marketing_insights": {
    "platform_preferences": {},
    "content_consumption_patterns": [],
    "engagement_drivers": [],
    "conversion_factors": []
  },
  "pricing_strategy": {
    "current_positioning": "",
    "recommended_approach": "",
    "value_perception_drivers": []
  },
  "action_plan": {
    "short_term_actions": [],
    "medium_term_strategies": [],
    "success_metrics": []
  }
}`;

    const analysisPrompts = {
      competitive: "Analiza profundamente el panorama competitivo, identifica ventajas competitivas únicas y oportunidades de diferenciación.",
      market_opportunity: "Identifica y cuantifica oportunidades de mercado no explotadas, nichos potenciales y estrategias de expansión.",
      audience_segmentation: "Realiza segmentación avanzada de audiencias, perfiles psicográficos y estrategias de targeting personalizadas.",
      digital_trends: "Analiza tendencias digitales específicas para Guatemala, comportamientos de consumo online y oportunidades emergentes.",
      pricing_strategy: "Desarrolla estrategia de precios basada en valor percibido, análisis competitivo y elasticidad de demanda regional."
    };

    const specificPrompt = analysisPrompts[analysisType] || "Realiza un análisis integral de mercado";

    let clientPrompt = `
CLIENTE A ANALIZAR: ${client.name}
INDUSTRIA: ${client.industry}
DESCRIPCIÓN: ${client.description}
PROPUESTA DE VALOR ACTUAL: ${client.unique_value_proposition}

AUDIENCIA OBJETIVO ACTUAL:
${JSON.stringify(client.target_audience, null, 2)}

COMPETIDORES CONOCIDOS:
${JSON.stringify(client.competitors, null, 2)}

PAÍS DE OPERACIÓN: ${client.country}
SITIO WEB: ${client.website_url}`;

    if (customRequirements) {
      clientPrompt += `

REQUERIMIENTOS ESPECÍFICOS: ${customRequirements}`;
    }

    const finalPrompt = `${systemPrompt}

${clientPrompt}

TIPO DE ANÁLISIS: ${specificPrompt}

Realiza un análisis exhaustivo y específico para el mercado guatemalteco/centroamericano. Proporciona insights accionables y recomendaciones concretas basadas en la realidad del mercado local.`;

    console.log('Generando análisis de mercado con OpenAI...');

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
            content: finalPrompt
          },
          {
            role: 'user',
            content: `Genera un análisis de mercado tipo "${analysisType}" para ${client.name}. El análisis debe ser específico para el contexto guatemalteco y centroamericano, con insights accionables y recomendaciones concretas.`
          }
        ],
        max_completion_tokens: 3000
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData}`);
    }

    const openaiData = await openaiResponse.json();
    const generatedAnalysis = openaiData.choices[0].message.content;

    console.log('Análisis generado exitosamente');

    // Parsear el JSON generado
    let analysisData;
    try {
      let cleanContent = generatedAnalysis.replace(/```json\n?|```\n?/g, '').trim();
      analysisData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw response:', generatedAnalysis);
      throw new Error('Error procesando respuesta de análisis de IA');
    }

    // Guardar análisis en base de datos
    const researchData = {
      client_id: clientId,
      research_type: analysisType,
      title: `Análisis de ${analysisType} - ${client.name}`,
      findings: analysisData,
      market_size_data: analysisData.market_size_analysis || {},
      competitor_analysis: analysisData.competitive_landscape || {},
      target_audience_insights: analysisData.target_audience_analysis || {},
      opportunity_assessment: analysisData.opportunity_assessment || {},
      recommendations: analysisData.action_plan || {},
      status: 'completed',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const saveResponse = await fetch(`${supabaseUrl}/rest/v1/market_research`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(researchData)
    });

    if (!saveResponse.ok) {
      const errorText = await saveResponse.text();
      console.error('Failed to save market research:', errorText);
      // No fallar si no se puede guardar, pero log el error
    }

    // Retornar datos estructurados
    return new Response(JSON.stringify({
      data: analysisData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Market analysis generation error:', error);

    const errorResponse = {
      error: {
        code: 'MARKET_ANALYSIS_FAILED',
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