import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      client, 
      contentType, 
      platform, 
      topic, 
      tone, 
      templateId,
      variables 
    } = await req.json()

    if (!client || !contentType || !platform || !topic) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get content template if provided
    let template = null
    if (templateId) {
      const { data: templateData, error: templateError } = await supabaseClient
        .from('content_templates')
        .select('*')
        .eq('id', templateId)
        .single()

      if (!templateError && templateData) {
        template = templateData
      }
    }

    // Generate content using OpenAI API
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Build prompt based on template or default
    let prompt = ''
    
    if (template) {
      // Use template-based generation
      const hook = template.visual_elements?.opening_frame?.text_overlay || ''
      const story = template.visual_elements?.authority_proof?.content || ''
      const offer = template.visual_elements?.revelation_moment?.text || ''
      
      prompt = `Generate ${contentType} content for ${platform} using this template:

Hook: ${hook}
Story: ${story}
Offer: ${offer}

Client: ${client.name}
Industry: ${client.industry}
Target Audience: ${client.target_audience}
Tone: ${tone}
Topic: ${topic}

Apply variables: ${JSON.stringify(variables || {})}

Generate engaging, conversion-focused content that follows the template structure.`
    } else {
      // Default content generation
      prompt = `Generate ${contentType} content for ${platform}:

Client: ${client.name}
Business Type: ${client.business_type}
Industry: ${client.industry}
Target Audience: ${client.target_audience}
Unique Value Proposition: ${client.unique_value_proposition}
Country: ${client.country}

Content Requirements:
- Type: ${contentType}
- Platform: ${platform}
- Topic: ${topic}
- Tone: ${tone}

Generate engaging, professional content that resonates with the target audience and drives conversions.`
    }

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert marketing copywriter specializing in high-converting content for social media and digital marketing campaigns.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!openaiResponse.ok) {
      const errorData = await openaiResponse.json()
      return new Response(
        JSON.stringify({ error: 'OpenAI API error: ' + errorData.error?.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const openaiData = await openaiResponse.json()
    const generatedContent = openaiData.choices[0]?.message?.content || ''

    // Track API usage
    const { error: trackingError } = await supabaseClient
      .from('api_usage_tracking')
      .insert({
        api_name: 'openai',
        template_id: templateId,
        cost: 0.02, // Approximate cost
        response_time_ms: Date.now(),
        success: true,
        generated_content_url: null,
        user_id: req.headers.get('x-user-id')
      })

    if (trackingError) {
      console.error('Error tracking API usage:', trackingError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        content: generatedContent,
        template: template ? {
          id: template.id,
          name: template.name,
          framework: template.framework
        } : null,
        metadata: {
          contentType: contentType,
          platform: platform,
          topic: topic,
          tone: tone,
          client: client.name,
          generatedAt: new Date().toISOString(),
          wordCount: generatedContent.split(' ').length,
          characterCount: generatedContent.length
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
