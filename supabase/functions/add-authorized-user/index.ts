import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

interface AddUserRequest {
  email: string;
  name?: string;
  role?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, name, role = 'admin' }: AddUserRequest = await req.json();

    if (!email) {
      throw new Error('email es requerido');
    }

    // Verificar si el usuario ya existe
    const { data: existingUser, error: checkError } = await supabase
      .from('authorized_users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return new Response(
        JSON.stringify({
          data: {
            message: 'Usuario ya existe',
            user: existingUser
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Agregar nuevo usuario autorizado
    const { data, error } = await supabase
      .from('authorized_users')
      .insert([
        {
          email,
          name: name || 'Usuario Autorizado',
          role,
          is_active: true
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(`Error agregando usuario: ${error.message}`);
    }

    return new Response(
      JSON.stringify({
        data: {
          message: 'Usuario agregado exitosamente',
          user: data
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error en add-authorized-user:', error);
    
    const errorResponse = {
      error: {
        code: 'ADD_USER_ERROR',
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

