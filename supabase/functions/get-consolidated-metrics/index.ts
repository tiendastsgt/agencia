import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

interface ConsolidatedMetricsRequest {
  client_id: string;
  platforms?: string[]; // ['meta', 'twitter', 'linkedin', 'tiktok', 'google_analytics']
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

    const { 
      client_id, 
      platforms = ['meta', 'twitter', 'linkedin', 'tiktok', 'google_analytics'],
      date_range = 'last_7d'
    }: ConsolidatedMetricsRequest = await req.json();

    if (!client_id) {
      throw new Error('client_id es requerido');
    }

    // Obtener información del cliente
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('name, industry')
      .eq('id', client_id)
      .single();

    if (clientError || !client) {
      throw new Error('Cliente no encontrado');
    }

    // Obtener métricas de cada plataforma en paralelo
    const metricsPromises = platforms.map(async (platform) => {
      try {
        const endpoint = getMetricsEndpoint(platform);
        const requestPayload = {
          client_id,
          date_range,
          ...(platform === 'twitter' && { days_back: date_range === 'last_30d' ? 30 : 7 })
        };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': req.headers.get('Authorization') || '',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestPayload)
        });

        if (response.ok) {
          const data = await response.json();
          return {
            platform,
            status: 'success',
            data: data.data,
            last_updated: new Date().toISOString()
          };
        } else {
          const error = await response.json();
          return {
            platform,
            status: 'error',
            error: error.error,
            last_updated: new Date().toISOString()
          };
        }
      } catch (error) {
        return {
          platform,
          status: 'error',
          error: {
            code: 'FETCH_ERROR',
            message: error.message
          },
          last_updated: new Date().toISOString()
        };
      }
    });

    const metricsResults = await Promise.all(metricsPromises);

    // Procesar resultados y calcular resumen
    const successfulMetrics = metricsResults.filter(m => m.status === 'success');
    const failedMetrics = metricsResults.filter(m => m.status === 'error');

    // Calcular métricas consolidadas
    const consolidatedSummary = calculateConsolidatedSummary(successfulMetrics);

    const response = {
      client_info: {
        id: client_id,
        name: client.name,
        industry: client.industry
      },
      date_range,
      summary: consolidatedSummary,
      platforms_data: metricsResults,
      platforms_status: {
        total: platforms.length,
        successful: successfulMetrics.length,
        failed: failedMetrics.length,
        success_rate: Math.round((successfulMetrics.length / platforms.length) * 100)
      },
      last_updated: new Date().toISOString()
    };

    return new Response(
      JSON.stringify({ data: response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en get-consolidated-metrics:', error);
    
    const errorResponse = {
      error: {
        code: 'CONSOLIDATED_METRICS_ERROR',
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

function getMetricsEndpoint(platform: string): string {
  const baseUrl = Deno.env.get('SUPABASE_URL')?.replace('/v1', '') || '';
  const endpoints = {
    'meta': `${baseUrl}/functions/v1/get-facebook-metrics`,
    'twitter': `${baseUrl}/functions/v1/get-twitter-metrics`,
    'linkedin': `${baseUrl}/functions/v1/get-linkedin-metrics`,
    'tiktok': `${baseUrl}/functions/v1/get-tiktok-metrics`,
    'google_analytics': `${baseUrl}/functions/v1/get-analytics-metrics`
  };
  
  return endpoints[platform] || '';
}

function calculateConsolidatedSummary(successfulMetrics: any[]): any {
  let totalFollowers = 0;
  let totalEngagement = 0;
  let totalReach = 0;
  let totalPosts = 0;
  let platforms = [];

  successfulMetrics.forEach(metric => {
    const { platform, data } = metric;
    platforms.push(platform);

    switch (platform) {
      case 'meta':
        totalFollowers += data.page_info?.followers_count || 0;
        totalReach += data.metrics?.page_impressions?.current_value || 0;
        break;
      case 'twitter':
        totalFollowers += data.account_info?.followers_count || 0;
        totalEngagement += data.period_metrics?.total_engagement || 0;
        totalPosts += data.period_metrics?.tweets_in_period || 0;
        break;
      case 'linkedin':
        totalFollowers += data.company_info?.follower_count || 0;
        totalPosts += data.period_metrics?.posts_in_period || 0;
        break;
      case 'tiktok':
        totalFollowers += data.account_info?.followers_count || 0;
        totalEngagement += data.period_metrics?.total_likes || 0;
        totalPosts += data.period_metrics?.videos_in_period || 0;
        break;
      case 'google_analytics':
        totalReach += data.period_metrics?.total_users || 0;
        break;
    }
  });

  return {
    total_followers: totalFollowers,
    total_engagement: totalEngagement,
    total_reach: totalReach,
    total_posts: totalPosts,
    avg_engagement_per_post: totalPosts > 0 ? Math.round((totalEngagement / totalPosts) * 100) / 100 : 0,
    platforms_connected: platforms,
    overall_health_score: calculateHealthScore(successfulMetrics.length, totalFollowers, totalEngagement)
  };
}

function calculateHealthScore(connectedPlatforms: number, followers: number, engagement: number): number {
  // Fórmula simple para calcular un puntaje de salud general
  const platformScore = (connectedPlatforms / 5) * 40; // 40% por plataformas conectadas
  const followersScore = Math.min((followers / 10000) * 30, 30); // 30% por seguidores (máx 10k)
  const engagementScore = Math.min((engagement / 1000) * 30, 30); // 30% por engagement (máx 1k)
  
  return Math.round(platformScore + followersScore + engagementScore);
}