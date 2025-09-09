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
    console.log('Function started');
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    console.log('Supabase URL:', supabaseUrl ? 'Set' : 'Not set');
    console.log('Service Key:', supabaseServiceKey ? 'Set' : 'Not set');
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { 
      client_id, 
      type, 
      topic, 
      platform = 'general', 
      tone = 'profesional',
      custom_prompt
    }: ContentRequest = await req.json();

    console.log('Request params:', { client_id, type, topic, platform, tone });

    if (!client_id || !type) {
      throw new Error('client_id y type son requeridos');
    }

    // Obtener información del cliente específico
    console.log('Fetching client data...');
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('*')
      .eq('id', client_id)
      .single();

    if (clientError || !client) {
      console.log('Client error:', clientError);
      throw new Error('Cliente no encontrado');
    }

    console.log('Client found:', client.name);

    // Generar contenido simple sin OpenAI
    const contentData = {
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
      test_mode: true
    };

    console.log('Content generated successfully');

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

