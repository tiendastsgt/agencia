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
    const { clientId, campaignId, strategyType, customObjectives } = await req.json();

    if (!clientId || !strategyType) {
      throw new Error('clientId y strategyType son requeridos');
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

    // Obtener información de la campaña si está especificada
    let campaign = null;
    if (campaignId) {
      const campaignResponse = await fetch(`${supabaseUrl}/rest/v1/campaigns?id=eq.${campaignId}`, {
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
          'Content-Type': 'application/json'
        }
      });

      if (campaignResponse.ok) {
        const campaigns = await campaignResponse.json();
        if (campaigns && campaigns.length > 0) {
          campaign = campaigns[0];
        }
      }
    }

    // Construir prompt especializado para estrategias Russell Brunson
    const systemPrompt = `Eres un experto estratega de marketing digital especializado en los frameworks de Russell Brunson y DotCom Secrets.

Generas estrategias completas de marketing digital usando:
- Hook-Story-Offer Framework
- Value Ladder (Escalera de Valor)
- Perfect Webinar Script
- Dream 100 Strategy
- Traffic Temperature (Frío, Tibio, Caliente)
- Funnel Hacking Methodology
- Lead Magnets y Tripwires
- Maximizadores de Beneficios (Profit Maximizers)

Estructura de respuesta JSON requerida:
{
  "strategy_type": "${strategyType}",
  "client_name": "${client.name}",
  "framework_used": "Framework principal utilizado",
  "executive_summary": "Resumen ejecutivo de la estrategia",
  "dream_100_list": {
    "influencers": [],
    "media_outlets": [],
    "communities": [],
    "platforms": []
  },
  "value_ladder": {
    "bait_level": {
      "name": "",
      "price": 0,
      "description": "",
      "objective": ""
    },
    "frontend_level": {
      "name": "",
      "price": 0,
      "description": "",
      "objective": ""
    },
    "core_level": {
      "name": "",
      "price": 0,
      "description": "",
      "objective": ""
    },
    "premium_level": {
      "name": "",
      "price": 0,
      "description": "",
      "objective": ""
    }
  },
  "webinar_script": {
    "hook": "",
    "story": "",
    "content_secrets": [],
    "stack_and_close": "",
    "objection_handling": []
  },
  "traffic_temperature": {
    "cold_traffic": {
      "platforms": [],
      "hooks": [],
      "targeting": {},
      "budget_allocation": ""
    },
    "warm_traffic": {
      "retargeting_strategy": "",
      "email_sequences": [],
      "nurturing_content": []
    },
    "hot_traffic": {
      "conversion_optimization": "",
      "upsell_downsell": [],
      "retention_strategy": ""
    }
  },
  "psychological_triggers": {
    "scarcity_elements": [],
    "urgency_factors": [],
    "social_proof_strategies": [],
    "authority_building": []
  },
  "funnel_architecture": {
    "lead_capture": "",
    "tripwire_offer": "",
    "core_offer": "",
    "profit_maximizers": []
  },
  "implementation_timeline": {
    "week_1_2": [],
    "week_3_4": [],
    "month_2": [],
    "month_3_plus": []
  },
  "success_metrics": {
    "kpis": [],
    "conversion_goals": {},
    "revenue_projections": {}
  },
  "expected_outcomes": {
    "short_term": [],
    "medium_term": [],
    "long_term": []
  }
}`;

    const strategyPrompts = {
      value_ladder: "Diseña una Escalera de Valor completa con productos/servicios en cada nivel, desde lead magnet gratuito hasta oferta premium. Incluye precios estratégicos para el mercado guatemalteco.",
      perfect_webinar: "Desarrolla un script completo de Perfect Webinar adaptado al cliente, incluyendo hooks, historias, secretos de contenido y cierre de alta conversión.",
      dream_100: "Crea una lista Dream 100 personalizada con influencers, medios y comunidades específicas de Guatemala/Centroamérica relevantes para la audiencia objetivo.",
      funnel_optimization: "Diseña arquitectura completa de embudos de ventas con lead magnets, tripwires, core offers y profit maximizers optimizados para conversiones.",
      traffic_strategy: "Desarrolla estrategia integral de tráfico segmentada por temperatura (frío, tibio, caliente) con plataformas específicas y asignación de presupuesto.",
      conversion_optimization: "Crea estrategia de optimización de conversiones usando triggers psicológicos, pruebas sociales y elementos de urgencia/escasez."
    };

    const specificPrompt = strategyPrompts[strategyType] || "Desarrolla una estrategia integral de marketing digital";

    let clientPrompt = `
CLIENTE: ${client.name}
INDUSTRIA: ${client.industry}
DESCRIPCIÓN: ${client.description}
PROPUESTA DE VALOR: ${client.unique_value_proposition}

AUDIENCIA OBJETIVO:
${JSON.stringify(client.target_audience, null, 2)}

COMPETIDORES:
${JSON.stringify(client.competitors, null, 2)}

PAÍS: ${client.country}
SITIO WEB: ${client.website_url}`;

    if (campaign) {
      clientPrompt += `

CAMPAÑA ACTIVA: ${campaign.name}
OBJETIVO: ${campaign.objective}
PRESUPUESTO: Q${campaign.budget}
FRAMEWORK ACTUAL: ${campaign.russell_brunson_framework}`;
    }

    if (customObjectives) {
      clientPrompt += `

OBJETIVOS ESPECÍFICOS: ${customObjectives}`;
    }

    const finalPrompt = `${systemPrompt}

${clientPrompt}

TIPO DE ESTRATEGIA: ${specificPrompt}

Genera una estrategia completa y accionable usando los frameworks de Russell Brunson. La estrategia debe ser específica para el mercado guatemalteco/centroamericano con precios, plataformas y tácticas adaptadas al contexto local.`;

    console.log('Generando estrategia de marketing con OpenAI...');

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
            content: `Genera una estrategia de marketing tipo "${strategyType}" para ${client.name} usando frameworks de Russell Brunson. La estrategia debe ser específica, accionable y adaptada al mercado guatemalteco.`
          }
        ],
        max_completion_tokens: 4000
      })
    });

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData}`);
    }

    const openaiData = await openaiResponse.json();
    const generatedStrategy = openaiData.choices[0].message.content;

    console.log('Estrategia generada exitosamente');

    // Parsear el JSON generado
    let strategyData;
    try {
      let cleanContent = generatedStrategy.replace(/```json\n?|```\n?/g, '').trim();
      strategyData = JSON.parse(cleanContent);
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.log('Raw response:', generatedStrategy);
      throw new Error('Error procesando respuesta de estrategia de IA');
    }

    // Guardar estrategia en base de datos
    const strategyDbData = {
      client_id: clientId,
      campaign_id: campaignId || null,
      strategy_type: strategyType,
      framework_used: strategyData.framework_used || 'Russell Brunson Framework',
      strategy_details: strategyData,
      dream_100_list: strategyData.dream_100_list || {},
      value_ladder: strategyData.value_ladder || {},
      webinar_script: strategyData.webinar_script || {},
      traffic_temperature: strategyData.traffic_temperature || {},
      psychological_triggers: strategyData.psychological_triggers || {},
      expected_outcomes: strategyData.expected_outcomes || {},
      implementation_steps: strategyData.implementation_timeline || {},
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const saveResponse = await fetch(`${supabaseUrl}/rest/v1/strategies`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(strategyDbData)
    });

    if (!saveResponse.ok) {
      const errorText = await saveResponse.text();
      console.error('Failed to save strategy:', errorText);
      // No fallar si no se puede guardar, pero log el error
    }

    // Retornar datos estructurados
    return new Response(JSON.stringify({
      data: strategyData
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Marketing strategy generation error:', error);

    const errorResponse = {
      error: {
        code: 'STRATEGY_GENERATION_FAILED',
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