import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

interface AnalyticsMetricsRequest {
  client_id: string;
  date_range?: string;
  metrics?: string[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { client_id, date_range = 'last_7d' }: AnalyticsMetricsRequest = await req.json();

    if (!client_id) {
      throw new Error('client_id es requerido');
    }

    // Obtener credenciales de Google Analytics para este cliente
    const { data: credentials, error: credError } = await supabase
      .from('client_api_credentials')
      .select('credentials')
      .eq('client_id', client_id)
      .eq('platform', 'google_analytics')
      .eq('is_active', true)
      .single();

    if (credError || !credentials) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'NO_CREDENTIALS',
            message: 'No se encontraron credenciales de Google Analytics para este cliente',
            details: 'Configura las credenciales de Google Analytics en la sección de Configuración'
          }
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Por ahora devolvemos métricas simuladas hasta que se configuren las APIs reales
    const daysBack = date_range === 'last_30d' ? 30 : date_range === 'last_7d' ? 7 : 1;
    
    const simulatedMetrics = {
      website_info: {
        property_id: 'GA4-XXXXXXX-1',
        website_url: 'https://sitio-cliente.com',
        tracking_active: true
      },
      period_metrics: {
        days_analyzed: daysBack,
        total_users: Math.floor(Math.random() * 5000) + 1000,
        new_users: Math.floor(Math.random() * 3000) + 500,
        sessions: Math.floor(Math.random() * 6000) + 1200,
        page_views: Math.floor(Math.random() * 15000) + 3000,
        avg_session_duration: Math.round((Math.random() * 300 + 120) * 100) / 100,
        bounce_rate: Math.round((Math.random() * 30 + 40) * 100) / 100
      },
      traffic_sources: {
        organic_search: Math.round((Math.random() * 40 + 30) * 100) / 100,
        direct: Math.round((Math.random() * 25 + 15) * 100) / 100,
        social_media: Math.round((Math.random() * 20 + 10) * 100) / 100,
        referral: Math.round((Math.random() * 15 + 5) * 100) / 100,
        email: Math.round((Math.random() * 10 + 2) * 100) / 100
      },
      top_pages: [
        {
          page: '/',
          views: Math.floor(Math.random() * 2000) + 500,
          unique_views: Math.floor(Math.random() * 1500) + 300
        },
        {
          page: '/productos',
          views: Math.floor(Math.random() * 1000) + 200,
          unique_views: Math.floor(Math.random() * 800) + 150
        }
      ],
      conversions: {
        goal_completions: Math.floor(Math.random() * 50) + 10,
        conversion_rate: Math.round((Math.random() * 3 + 1) * 100) / 100,
        ecommerce_revenue: Math.round((Math.random() * 10000 + 2000) * 100) / 100
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
    console.error('Error en get-analytics-metrics:', error);
    
    const errorResponse = {
      error: {
        code: 'ANALYTICS_METRICS_ERROR',
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