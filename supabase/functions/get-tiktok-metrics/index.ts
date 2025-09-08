import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

interface TikTokMetricsRequest {
  client_id: string;
  days_back?: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { client_id, days_back = 7 }: TikTokMetricsRequest = await req.json();

    if (!client_id) {
      throw new Error('client_id es requerido');
    }

    // Obtener credenciales de TikTok para este cliente
    const { data: credentials, error: credError } = await supabase
      .from('client_api_credentials')
      .select('credentials')
      .eq('client_id', client_id)
      .eq('platform', 'tiktok')
      .eq('is_active', true)
      .single();

    if (credError || !credentials) {
      return new Response(
        JSON.stringify({
          error: {
            code: 'NO_CREDENTIALS',
            message: 'No se encontraron credenciales de TikTok para este cliente',
            details: 'Configura las credenciales de TikTok en la sección de Configuración'
          }
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Por ahora devolvemos métricas simuladas hasta que se configuren las APIs reales
    const simulatedMetrics = {
      account_info: {
        username: '@cliente_tiktok',
        display_name: 'Cliente TikTok',
        followers_count: Math.floor(Math.random() * 50000) + 5000,
        following_count: Math.floor(Math.random() * 500) + 50,
        video_count: Math.floor(Math.random() * 200) + 30,
        likes_count: Math.floor(Math.random() * 100000) + 10000
      },
      period_metrics: {
        days_analyzed: days_back,
        videos_in_period: Math.floor(Math.random() * 10) + 2,
        total_views: Math.floor(Math.random() * 500000) + 50000,
        total_likes: Math.floor(Math.random() * 25000) + 2500,
        total_shares: Math.floor(Math.random() * 1000) + 100,
        total_comments: Math.floor(Math.random() * 2000) + 200,
        avg_engagement_rate: Math.round((Math.random() * 5 + 2) * 100) / 100
      },
      top_videos: [
        {
          id: '1',
          views: Math.floor(Math.random() * 100000) + 10000,
          likes: Math.floor(Math.random() * 5000) + 500,
          shares: Math.floor(Math.random() * 200) + 50,
          comments: Math.floor(Math.random() * 300) + 30
        }
      ],
      date_range: {
        period: `${days_back} días`
      },
      last_updated: new Date().toISOString(),
      status: 'simulated'
    };

    return new Response(
      JSON.stringify({ data: simulatedMetrics }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en get-tiktok-metrics:', error);
    
    const errorResponse = {
      error: {
        code: 'TIKTOK_METRICS_ERROR',
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