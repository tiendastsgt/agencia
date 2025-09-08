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
    // Obtener claves de entorno
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    console.log('Iniciando migración de datos de TiendaSTS...');

    // Datos de TiendaSTS basados en el análisis completo
    const tiendaStsData = {
      client: {
        name: 'TiendaSTS.com',
        industry: 'E-commerce - Productos Naturales',
        description: 'E-commerce especializado en productos naturales para mujeres profesionales en Guatemala. Enfoque en bienestar, cuidado personal y productos para el hogar con ingredientes naturales y éticos.',
        website_url: 'https://tiendasts.com',
        contact_email: 'hola@tiendasts.com',
        contact_phone: '+502 2234-5678',
        address: 'Ciudad de Guatemala, Guatemala',
        country: 'Guatemala',
        target_audience: {
          primary: 'Sofía, la Profesional Consciente',
          demographics: {
            age_range: '28-45 años',
            gender: 'Mujeres',
            income_level: 'Ingresos medios-altos',
            location: 'Zonas urbanas de Guatemala, Antigua, cabeceras departamentales',
            education: 'Universitaria',
            occupation: 'Profesionales activas, posiblemente madres jóvenes'
          },
          psychographics: {
            values: [
              'Salud y bienestar personal',
              'Productos con ingredientes naturales',
              'Consumo consciente y ético',
              'Calidad sobre cantidad',
              'Eficiencia y conveniencia'
            ],
            pain_points: [
              'Falta de tiempo para cuidado personal',
              'Desconfianza en productos con químicos',
              'Dificultad para encontrar productos de calidad',
              'Necesidad de visitar múltiples tiendas especializadas',
              'Falta de información sobre ingredientes'
            ],
            desired_outcomes: [
              'Sentirse y verse bien',
              'Mantener un hogar saludable y armonioso',
              'Optimizar tiempo de compras',
              'Usar productos alineados con sus valores',
              'Simplificar rutinas de bienestar'
            ],
            digital_behavior: [
              'Activa en Facebook e Instagram',
              'Busca información en blogs de bienestar',
              'Sigue influencers de vida saludable',
              'Consume contenido sobre belleza natural'
            ]
          }
        },
        competitors: {
          main_competitors: [
            {
              name: 'pacifiko.com',
              positioning: 'Conveniencia y velocidad extrema',
              strengths: ['Entrega en 2 horas', 'Logística optimizada', 'Amplio catálogo'],
              weaknesses: ['Enfoque masivo, no especializado', 'Menos enfoque en productos naturales'],
              price_comparison: 'Similar en productos generales'
            },
            {
              name: 'kemik.gt',
              positioning: 'Acceso a productos de importación',
              strengths: ['Productos especializados', 'Integración con Amazon', 'Métodos de pago locales'],
              weaknesses: ['Menos construcción de marca', 'Dependiente de demanda existente'],
              price_comparison: 'Variable según producto'
            },
            {
              name: 'cropafresh.com',
              positioning: 'Supermercado digital completo',
              strengths: ['Amplio surtido', 'Marca propia', 'Modelo de recurrencia'],
              weaknesses: ['Enfoque general de supermercado', 'Menos especialización en naturales'],
              price_comparison: 'Competitivo en productos de hogar'
            }
          ],
          competitive_advantage: [
            'Especialización en productos naturales y conscientes',
            'Curada personalmente para mujeres profesionales',
            'Educación sobre ingredientes y beneficios',
            'Construcción de comunidad en torno a bienestar',
            'Historia personal autentica de la fundadora'
          ]
        },
        unique_value_proposition: 'Ayudamos a mujeres profesionales y ocupadas en Guatemala a simplificar sus rutinas de bienestar con una selección curada de productos de cuidado personal y del hogar, naturales y efectivos. Liberamos tiempo y energía para que puedan enfocarse en lo que realmente aman.',
        is_active: true
      },
      campaign: {
        name: 'Estrategia de Lanzamiento TiendaSTS 2025',
        description: 'Campaña integral de lanzamiento para posicionar TiendaSTS como la opción premium en productos naturales para mujeres profesionales guatemaltecas, utilizando frameworks de Russell Brunson.',
        campaign_type: 'Launch Campaign + Brand Building',
        status: 'planning',
        objective: 'Generar 500 leads cualificados mensualmente, establecer TiendaSTS como autoridad en bienestar natural, y lograr primeras 100 ventas en los primeros 90 días.',
        target_audience: {
          primary: 'Sofía, la Profesional Consciente (28-45 años)',
          secondary: 'Mujeres interesadas en vida saludable y productos naturales',
          channels: [
            'Grupos de Facebook sobre vida saludable',
            'Instagram de influencers de bienestar',
            'Blogs y podcasts sobre maternidad consciente',
            'Audiencias de Whole Foods Market (indicador psicográfico)'
          ]
        },
        budget: 15000.00,
        start_date: '2025-01-15',
        end_date: '2025-06-30',
        russell_brunson_framework: 'Hook-Story-Offer + Value Ladder + Dream 100',
        value_ladder: {
          level_1_bait: {
            name: 'Guía de Rutina de Belleza Nocturna en 5 Minutos',
            price: 0,
            description: 'Guía digital en PDF con rutina de belleza natural para mujeres ocupadas',
            delivery: 'PDF descargable + secuencia de email',
            objective: 'Generar leads altamente calificados, posicionar como experta',
            hook: 'Descubre cómo transformar tu piel mientras duermes con una rutina natural de solo 5 minutos'
          },
          level_2_tripwire: {
            name: 'Kit de Descubrimiento Bienestar STS',
            price: 49,
            description: 'Muestras de lujo de 3-4 productos clave para probar calidad y eficacia',
            includes: [
              'Muestras de productos estrella',
              'Guía digital "Cómo Leer Etiquetas de Cosméticos"',
              'Acceso a comunidad privada de Facebook'
            ],
            objective: 'Convertir lead en comprador, crear confianza, liquidar costo publicitario'
          },
          level_3_core: {
            name: 'Bundles de Bienestar de Tamaño Completo',
            price_range: '225-450',
            options: [
              'Kit Restauración Capilar Total',
              'Santuario en Casa (Aromaterapia + Limpieza)',
              'Rutina Completa de Cuidado Facial'
            ],
            objective: 'Generar beneficio principal, resolver problemas grandes del cliente'
          },
          level_4_premium: {
            name: 'Programa VIP Bienestar Personalizado',
            price: 650,
            description: 'Consultoría personalizada + productos + seguimiento mensual',
            includes: [
              'Evaluación personal de necesidades',
              'Selección curada mensual',
              'Consultas telefónicas mensuales',
              'Acceso prioritario a nuevos productos'
            ],
            objective: 'Maximizar lifetime value, servir clientes más comprometidos'
          },
          level_5_continuity: {
            name: 'La Caja Mensual Bienestar STS',
            price: 249,
            frequency: 'Mensual/Bimensual',
            description: 'Suscripción con selección curada de 3-5 productos + contenido exclusivo',
            objective: 'Crear ingresos predecibles y recurrentes, maximizar retención'
          }
        }
      }
    };

    // 1. Crear/actualizar cliente TiendaSTS
    console.log('Creando cliente TiendaSTS...');
    
    const clientResponse = await fetch(`${supabaseUrl}/rest/v1/clients`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        ...tiendaStsData.client,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    });

    if (!clientResponse.ok) {
      const errorText = await clientResponse.text();
      console.error('Error creating client:', errorText);
      throw new Error(`Error creando cliente: ${errorText}`);
    }

    const clientData = await clientResponse.json();
    const clientId = clientData[0].id;
    console.log(`Cliente TiendaSTS creado con ID: ${clientId}`);

    // 2. Crear campaña para TiendaSTS
    console.log('Creando campaña de TiendaSTS...');
    
    const campaignResponse = await fetch(`${supabaseUrl}/rest/v1/campaigns`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        ...tiendaStsData.campaign,
        client_id: clientId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    });

    if (!campaignResponse.ok) {
      const errorText = await campaignResponse.text();
      console.error('Error creating campaign:', errorText);
      throw new Error(`Error creando campaña: ${errorText}`);
    }

    const campaignData = await campaignResponse.json();
    const campaignId = campaignData[0].id;
    console.log(`Campaña TiendaSTS creada con ID: ${campaignId}`);

    // 3. Crear contenido de ejemplo para TiendaSTS
    console.log('Creando contenido de ejemplo...');
    
    const sampleContent = [
      {
        title: '¿Tu rutina de belleza se siente como una obligación? Existe una forma más simple',
        content_type: 'post',
        platform: 'facebook',
        hook: '¿Tu rutina de belleza se siente más como una obligación que como un placer?',
        story: 'Como muchas mujeres profesionales, mi vida era un torbellino de reuniones y responsabilidades. Mi piel se veía opaca, mi cabello sin vida, y me sentía culpable por usar productos llenos de químicos que no entendía. Hasta que descubrí que meritía algo mejor: productos efectivos, con ingredientes que pudiera entender.',
        offer: 'Descárgate nuestra guía gratuita "Rutina de Belleza Nocturna en 5 Minutos" y descubre cómo simplificar tu cuidado personal con ingredientes naturales.',
        content_body: '¿Tu rutina de belleza se siente más como una obligación que como un placer? 🤔\n\nComo muchas mujeres profesionales, mi vida era un torbellino de reuniones y responsabilidades. Mi piel se veía opaca, mi cabello sin vida, y me sentía culpable por usar productos llenos de químicos que no entendía.\n\nHasta que me di cuenta: meritía algo mejor. Productos efectivos, con ingredientes que pudiera entender, y que no me tomaran horas en aplicar. ✨\n\n¡Así nació TiendaSTS! Una selección curada de productos naturales para mujeres que, como tú, quieren brillar sin complicarse la vida.\n\n🌿 Descárgate nuestra guía gratuita "Rutina de Belleza Nocturna en 5 Minutos"\n\n¡Comenta "GUÍA" y te la enviamos al DM!',
        scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled'
      },
      {
        title: 'El secreto de las mujeres que siempre se ven radiantes',
        content_type: 'post',
        platform: 'instagram',
        hook: 'El secreto de las mujeres que siempre se ven radiantes (no es lo que piensas)',
        story: 'Durante años pensé que necesitaba 20 productos diferentes para tener una piel hermosa. Pero la verdad es más simple: menos productos, mejores ingredientes, rutina consistente.',
        offer: 'Conoce nuestro Kit de Descubrimiento por solo Q49. Prueba la diferencia de productos naturales curados especialmente para ti.',
        content_body: 'El secreto de las mujeres que siempre se ven radiantes (no es lo que piensas) ✨\n\nDurante años pensé que necesitaba 20 productos diferentes para tener una piel hermosa. 😅\n\nPero la verdad es más simple:\n• Menos productos, mejores ingredientes\n• Rutina consistente (no compleja)\n• Productos que nutren, no que "tapan"\n\nEn @tiendasts creemos que el cuidado personal debe ser un acto de amor propio, no una lista interminable de tareas. 🌿\n\n¿Quieres descubrir la diferencia? Nuestro Kit de Descubrimiento te permite probar productos naturales curados especialmente para mujeres profesionales como tú.\n\n📲 Link en bio o DM para info\n\n#BienestarNatural #CuidadoPersonal #MujeresGuatemala #VidaSaludable',
        scheduled_for: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        status: 'scheduled'
      }
    ];

    for (const content of sampleContent) {
      const contentResponse = await fetch(`${supabaseUrl}/rest/v1/content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...content,
          client_id: clientId,
          campaign_id: campaignId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      });

      if (!contentResponse.ok) {
        console.warn('Error creating content:', await contentResponse.text());
      }
    }

    // 4. Crear analytics de ejemplo
    console.log('Creando analytics de ejemplo...');
    
    const sampleAnalytics = [
      { metric_type: 'social_media', metric_name: 'reach', metric_value: 12500, platform: 'facebook' },
      { metric_type: 'social_media', metric_name: 'engagement_rate', metric_value: 5.8, platform: 'facebook' },
      { metric_type: 'social_media', metric_name: 'reach', metric_value: 8750, platform: 'instagram' },
      { metric_type: 'social_media', metric_name: 'engagement_rate', metric_value: 7.2, platform: 'instagram' },
      { metric_type: 'website', metric_name: 'sessions', metric_value: 2400, platform: 'google_analytics' },
      { metric_type: 'website', metric_name: 'conversion_rate', metric_value: 3.2, platform: 'google_analytics' }
    ];

    for (const metric of sampleAnalytics) {
      await fetch(`${supabaseUrl}/rest/v1/analytics`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'apikey': supabaseServiceKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...metric,
          client_id: clientId,
          metric_unit: metric.metric_name.includes('rate') ? 'percentage' : 'count',
          date_recorded: new Date().toISOString()
        })
      });
    }

    console.log('Migración de TiendaSTS completada exitosamente');

    return new Response(JSON.stringify({
      data: {
        success: true,
        client_id: clientId,
        campaign_id: campaignId,
        client_name: tiendaStsData.client.name,
        message: 'Datos de TiendaSTS migrados exitosamente',
        created_records: {
          client: 1,
          campaign: 1,
          content: sampleContent.length,
          analytics: sampleAnalytics.length
        }
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('TiendaSTS migration error:', error);

    const errorResponse = {
      error: {
        code: 'MIGRATION_FAILED',
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