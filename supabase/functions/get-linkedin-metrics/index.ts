import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

interface LinkedInMetricsRequest {
  client_id: string;
  date_range?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { client_id, date_range = 'last_7d' }: LinkedInMetricsRequest = await req.json();

    if (!client_id) {
      throw new Error('client_id es requerido');
    }

    // Obtener credenciales de LinkedIn para este cliente
    const { data: credentials, error: credError } = await supabase
      .from('client_api_credentials')
      .select('credentials')
      .eq('client_id', client_id)
      .eq('platform', 'linkedin')
      .eq('is_active', true)
      .single();

    if (credError || !credentials) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'NO_CREDENTIALS',
            message: 'No se encontraron credenciales de LinkedIn para este cliente',
            details: 'Configura las credenciales de LinkedIn en la sección de Configuración'
          }
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Por ahora devolvemos métricas simuladas hasta que se configuren las APIs reales
    const daysBack = date_range === 'last_30d' ? 30 : 7;
    
    const simulatedMetrics = {
      company_info: {
        name: 'Empresa del Cliente',
        description: 'Descripción de la empresa del cliente',
        follower_count: Math.floor(Math.random() * 3000) + 500,
        staff_count: Math.floor(Math.random() * 100) + 10
      },
      period_metrics: {
        days_analyzed: daysBack,
        posts_in_period: Math.floor(Math.random() * 15) + 3,
        avg_posts_per_day: Math.round((Math.random() * 2 + 0.2) * 100) / 100,
        total_impressions: Math.floor(Math.random() * 10000) + 2000,
        total_clicks: Math.floor(Math.random() * 500) + 100,
        total_reactions: Math.floor(Math.random() * 200) + 50
      },
      date_range: {
        period: date_range
      },
      last_updated: new Date().toISOString(),
      status: 'simulated'
    };

    return new Response(
      JSON.stringify({ data: simulatedMetrics }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en get-linkedin-metrics:', error);
    
    const errorResponse = {
      error: {
        code: 'LINKEDIN_METRICS_ERROR',
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