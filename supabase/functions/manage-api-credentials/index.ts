import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

interface APICredentialsRequest {
  action: 'get' | 'set' | 'test' | 'delete';
  client_id: string;
  platform?: string;
  credentials?: any;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, client_id, platform, credentials }: APICredentialsRequest = await req.json();

    if (!client_id) {
      throw new Error('client_id es requerido');
    }

    switch (action) {
      case 'get':
        return await handleGetCredentials(supabase, client_id, platform);
      case 'set':
        return await handleSetCredentials(supabase, client_id, platform!, credentials);
      case 'test':
        return await handleTestCredentials(supabase, client_id, platform!, credentials);
      case 'delete':
        return await handleDeleteCredentials(supabase, client_id, platform!);
      default:
        throw new Error('Acción no válida');
    }

  } catch (error) {
    console.error('Error en manage-api-credentials:', error);
    
    const errorResponse = {
      error: {
        code: 'API_CREDENTIALS_ERROR',
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

async function handleGetCredentials(supabase: any, client_id: string, platform?: string) {
  let query = supabase
    .from('client_api_credentials')
    .select('platform, is_active, created_at, updated_at')
    .eq('client_id', client_id);

  if (platform) {
    query = query.eq('platform', platform);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error obteniendo credenciales: ${error.message}`);
  }

  return new Response(
    JSON.stringify({ data: data || [] }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleSetCredentials(supabase: any, client_id: string, platform: string, credentials: any) {
  if (!platform || !credentials) {
    throw new Error('Platform y credentials son requeridos');
  }

  // Verificar que el cliente existe
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('id')
    .eq('id', client_id)
    .single();

  if (clientError || !client) {
    throw new Error('Cliente no encontrado');
  }

  // Upsert de las credenciales
  const { data, error } = await supabase
    .from('client_api_credentials')
    .upsert({
      client_id,
      platform,
      credentials,
      is_active: true,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'client_id,platform'
    })
    .select();

  if (error) {
    throw new Error(`Error guardando credenciales: ${error.message}`);
  }

  return new Response(
    JSON.stringify({ 
      data: { 
        message: 'Credenciales guardadas correctamente',
        platform,
        saved_at: new Date().toISOString()
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleTestCredentials(supabase: any, client_id: string, platform: string, credentials?: any) {
  // Si no se proporcionan credenciales, obtenerlas de la base de datos
  if (!credentials) {
    const { data, error } = await supabase
      .from('client_api_credentials')
      .select('credentials')
      .eq('client_id', client_id)
      .eq('platform', platform)
      .single();

    if (error || !data) {
      throw new Error('Credenciales no encontradas');
    }

    credentials = data.credentials;
  }

  // Realizar una prueba básica según la plataforma
  let testResult = { success: false, message: '', details: {} };

  switch (platform) {
    case 'meta':
      testResult = await testFacebookCredentials(credentials);
      break;
    case 'twitter':
      testResult = await testTwitterCredentials(credentials);
      break;
    case 'linkedin':
      testResult = await testLinkedInCredentials(credentials);
      break;
    case 'tiktok':
      testResult = await testTikTokCredentials(credentials);
      break;
    case 'google_analytics':
      testResult = await testAnalyticsCredentials(credentials);
      break;
    default:
      throw new Error('Plataforma no soportada para testing');
  }

  return new Response(
    JSON.stringify({ data: testResult }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleDeleteCredentials(supabase: any, client_id: string, platform: string) {
  const { error } = await supabase
    .from('client_api_credentials')
    .delete()
    .eq('client_id', client_id)
    .eq('platform', platform);

  if (error) {
    throw new Error(`Error eliminando credenciales: ${error.message}`);
  }

  return new Response(
    JSON.stringify({ 
      data: { 
        message: 'Credenciales eliminadas correctamente',
        platform,
        deleted_at: new Date().toISOString()
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

// Funciones de testing para cada plataforma
async function testFacebookCredentials(credentials: any) {
  try {
    const { access_token, page_id } = credentials;
    
    if (!access_token || !page_id) {
      return {
        success: false,
        message: 'Credenciales incompletas: access_token y page_id son requeridos',
        details: {}
      };
    }

    // Prueba básica: obtener información de la página
    const response = await fetch(`https://graph.facebook.com/v18.0/${page_id}?fields=name,id&access_token=${access_token}`);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: `Error de Facebook API: ${data.error?.message || 'Error desconocido'}`,
        details: data
      };
    }

    return {
      success: true,
      message: 'Credenciales de Facebook válidas',
      details: {
        page_name: data.name,
        page_id: data.id
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Error probando credenciales: ${error.message}`,
      details: {}
    };
  }
}

async function testTwitterCredentials(credentials: any) {
  try {
    const { bearer_token, username } = credentials;
    
    if (!bearer_token || !username) {
      return {
        success: false,
        message: 'Credenciales incompletas: bearer_token y username son requeridos',
        details: {}
      };
    }

    // Limpiar username (remover @ si existe)
    const cleanUsername = username.replace('@', '');
    
    // Prueba básica: obtener información del usuario
    const response = await fetch(`https://api.twitter.com/2/users/by/username/${cleanUsername}?user.fields=id,name,username,public_metrics`, {
      headers: {
        'Authorization': `Bearer ${bearer_token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: `Error de Twitter API: ${data.error?.message || data.detail || 'Error desconocido'}`,
        details: data
      };
    }

    if (!data.data) {
      return {
        success: false,
        message: 'Usuario de Twitter no encontrado',
        details: data
      };
    }

    return {
      success: true,
      message: 'Credenciales de Twitter válidas',
      details: {
        username: `@${data.data.username}`,
        name: data.data.name,
        user_id: data.data.id,
        followers: data.data.public_metrics?.followers_count || 'N/A'
      }
    };
  } catch (error) {
    return {
      success: false,
      message: `Error probando credenciales: ${error.message}`,
      details: {}
    };
  }
}

async function testLinkedInCredentials(credentials: any) {
  // Por ahora devolver éxito simulado
  return {
    success: true,
    message: 'Test de credenciales de LinkedIn (simulado)',
    details: { note: 'Implementar prueba real de LinkedIn API' }
  };
}

async function testTikTokCredentials(credentials: any) {
  // Por ahora devolver éxito simulado
  return {
    success: true,
    message: 'Test de credenciales de TikTok (simulado)',
    details: { note: 'Implementar prueba real de TikTok API' }
  };
}

async function testAnalyticsCredentials(credentials: any) {
  // Por ahora devolver éxito simulado
  return {
    success: true,
    message: 'Test de credenciales de Google Analytics (simulado)',
    details: { note: 'Implementar prueba real de Google Analytics API' }
  };
}