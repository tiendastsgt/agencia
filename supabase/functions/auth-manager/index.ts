import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

interface AuthRequest {
  action: 'check_authorization' | 'get_active_client' | 'set_active_client' | 'get_clients';
  user_email?: string;
  client_id?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { action, user_email, client_id }: AuthRequest = await req.json();

    switch (action) {
      case 'check_authorization':
        return await handleCheckAuthorization(supabase, user_email!);
      case 'get_active_client':
        return await handleGetActiveClient(supabase, user_email!);
      case 'set_active_client':
        return await handleSetActiveClient(supabase, user_email!, client_id!);
      case 'get_clients':
        return await handleGetClients(supabase);
      default:
        throw new Error('Acción no válida');
    }

  } catch (error) {
    console.error('Error en auth-manager:', error);
    
    const errorResponse = {
      error: {
        code: 'AUTH_MANAGER_ERROR',
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

async function handleCheckAuthorization(supabase: any, user_email: string) {
  if (!user_email) {
    throw new Error('user_email es requerido');
  }

  const { data, error } = await supabase
    .from('authorized_users')
    .select('email, name, role, is_active')
    .eq('email', user_email)
    .eq('is_active', true)
    .single();

  const isAuthorized = !error && data;

  return new Response(
    JSON.stringify({
      data: {
        is_authorized: !!isAuthorized,
        user_info: isAuthorized ? data : null,
        message: isAuthorized ? 'Usuario autorizado' : 'Usuario no autorizado para acceder al sistema'
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetActiveClient(supabase: any, user_email: string) {
  if (!user_email) {
    throw new Error('user_email es requerido');
  }

  // Usar la función SQL para obtener o establecer cliente activo
  const { data, error } = await supabase
    .rpc('get_or_set_active_client', { user_email });

  if (error) {
    throw new Error(`Error obteniendo cliente activo: ${error.message}`);
  }

  let clientInfo = null;
  if (data) {
    const { data: client, error: clientError } = await supabase
      .from('clients')
      .select('id, name, industry, logo_url')
      .eq('id', data)
      .single();

    if (!clientError && client) {
      clientInfo = client;
    }
  }

  return new Response(
    JSON.stringify({
      data: {
        active_client_id: data,
        client_info: clientInfo
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleSetActiveClient(supabase: any, user_email: string, client_id: string) {
  if (!user_email || !client_id) {
    throw new Error('user_email y client_id son requeridos');
  }

  // Verificar que el cliente existe
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('id, name, industry')
    .eq('id', client_id)
    .single();

  if (clientError || !client) {
    throw new Error('Cliente no encontrado');
  }

  // Usar la función SQL para establecer cliente activo
  const { data, error } = await supabase
    .rpc('get_or_set_active_client', { 
      user_email, 
      new_client_id: client_id 
    });

  if (error) {
    throw new Error(`Error estableciendo cliente activo: ${error.message}`);
  }

  return new Response(
    JSON.stringify({
      data: {
        active_client_id: data,
        client_info: client,
        message: `Cliente activo cambiado a: ${client.name}`
      }
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}

async function handleGetClients(supabase: any) {
  const { data, error } = await supabase
    .from('clients')
    .select('id, name, industry, logo_url, is_active')
    .eq('is_active', true)
    .order('name');

  if (error) {
    throw new Error(`Error obteniendo clientes: ${error.message}`);
  }

  return new Response(
    JSON.stringify({
      data: data || []
    }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}