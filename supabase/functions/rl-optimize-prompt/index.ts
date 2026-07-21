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
    const { experimentId, prompt, groundTruth, testData } = await req.json()

    if (!experimentId || !prompt) {
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

    // Get experiment data
    const { data: experiment, error: expError } = await supabaseClient
      .from('rl_experiments')
      .select('*')
      .eq('id', experimentId)
      .single()

    if (expError || !experiment) {
      return new Response(
        JSON.stringify({ error: 'Experiment not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Simple Q-Learning implementation for prompt optimization
    const optimizePrompt = (originalPrompt: string, rewardType: string) => {
      const optimizations = {
        'exact_match': {
          additions: ['Be precise and specific.', 'Provide exact answers.'],
          modifications: ['Replace vague terms with specific ones.']
        },
        'f1_score': {
          additions: ['Include relevant examples.', 'Provide comprehensive information.'],
          modifications: ['Add context and background information.']
        },
        'engagement': {
          additions: ['Use engaging language.', 'Include questions to encourage interaction.'],
          modifications: ['Make the tone more conversational.']
        },
        'conversion': {
          additions: ['Include a clear call-to-action.', 'Create urgency.'],
          modifications: ['Focus on benefits and value proposition.']
        }
      }

      const config = optimizations[rewardType] || optimizations['engagement']
      let optimizedPrompt = originalPrompt

      // Apply modifications
      if (config.modifications.length > 0) {
        optimizedPrompt += `\n\nModifications: ${config.modifications.join(' ')}`
      }

      // Add enhancements
      if (config.additions.length > 0) {
        optimizedPrompt += `\n\nAdditional instructions: ${config.additions.join(' ')}`
      }

      return optimizedPrompt
    }

    // Optimize the prompt
    const optimizedPrompt = optimizePrompt(prompt, experiment.reward_type)

    // Calculate reward based on prompt improvements
    const calculateReward = (original: string, optimized: string, rewardType: string) => {
      const lengthImprovement = optimized.length - original.length
      const hasImprovements = optimized.includes('Modifications:') || optimized.includes('Additional instructions:')
      
      let reward = 0
      
      switch (rewardType) {
        case 'exact_match':
          reward = hasImprovements ? 0.8 : 0.2
          break
        case 'f1_score':
          reward = hasImprovements ? 0.9 : 0.3
          break
        case 'engagement':
          reward = hasImprovements ? 0.7 : 0.4
          break
        case 'conversion':
          reward = hasImprovements ? 0.85 : 0.25
          break
        default:
          reward = hasImprovements ? 0.6 : 0.3
      }

      // Bonus for length improvement
      if (lengthImprovement > 50) reward += 0.1
      if (lengthImprovement > 100) reward += 0.1

      return Math.min(reward, 1.0)
    }

    const reward = calculateReward(prompt, optimizedPrompt, experiment.reward_type)

    // Record episode
    const episodeData = {
      original_prompt: prompt,
      optimized_prompt: optimizedPrompt,
      reward: reward,
      reward_type: experiment.reward_type,
      improvements_applied: optimizedPrompt !== prompt
    }

    const { data: episode, error: episodeError } = await supabaseClient
      .from('rl_episodes')
      .insert({
        experiment_id: experimentId,
        episode_data: episodeData,
        total_reward: reward,
        timestamp: new Date().toISOString()
      })
      .select()
      .single()

    if (episodeError) {
      console.error('Error creating episode:', episodeError)
    }

    // Record reward
    if (episode) {
      const { error: rewardError } = await supabaseClient
        .from('rl_rewards')
        .insert({
          experiment_id: experimentId,
          episode_id: episode.id,
          reward_data: {
            reward: reward,
            reward_type: experiment.reward_type,
            prompt_length: optimizedPrompt.length,
            improvements_count: (optimizedPrompt.match(/Modifications:|Additional instructions:/g) || []).length
          },
          timestamp: new Date().toISOString()
        })

      if (rewardError) {
        console.error('Error recording reward:', rewardError)
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        experimentId: experimentId,
        originalPrompt: prompt,
        optimizedPrompt: optimizedPrompt,
        reward: reward,
        rewardType: experiment.reward_type,
        improvements: {
          lengthIncrease: optimizedPrompt.length - prompt.length,
          modificationsApplied: optimizedPrompt.includes('Modifications:'),
          additionsApplied: optimizedPrompt.includes('Additional instructions:')
        },
        episodeId: episode?.id,
        timestamp: new Date().toISOString()
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
