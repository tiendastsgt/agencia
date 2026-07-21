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
    const { experimentId, armId, reward, context, metadata } = await req.json()

    if (!experimentId || !armId || reward === undefined) {
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

    // Get current arm performance
    const { data: armPerformance, error: perfError } = await supabaseClient
      .from('mab_arm_performance')
      .select('*')
      .eq('experiment_id', experimentId)
      .eq('arm_id', armId)
      .single()

    if (perfError || !armPerformance) {
      return new Response(
        JSON.stringify({ error: 'Arm performance not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update arm performance
    const newRewards = armPerformance.rewards + 1
    const newTotalReward = armPerformance.total_reward + reward

    const { error: updateError } = await supabaseClient
      .from('mab_arm_performance')
      .update({
        rewards: newRewards,
        total_reward: newTotalReward,
        updated_at: new Date().toISOString()
      })
      .eq('id', armPerformance.id)

    if (updateError) {
      return new Response(
        JSON.stringify({ error: 'Failed to update arm performance' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Record reward
    const { error: rewardError } = await supabaseClient
      .from('mab_rewards')
      .insert({
        experiment_id: experimentId,
        arm_id: armId,
        reward: reward,
        context: context || {},
        metadata: metadata || {},
        timestamp: new Date().toISOString()
      })

    if (rewardError) {
      console.error('Error recording reward:', rewardError)
    }

    // Calculate conversion rate
    const conversionRate = newRewards / armPerformance.pulls
    const conversionPercentage = (conversionRate * 100).toFixed(2)

    return new Response(
      JSON.stringify({
        success: true,
        experimentId: experimentId,
        armId: armId,
        reward: reward,
        metadata: metadata || {},
        stats: {
          pulls: armPerformance.pulls,
          totalRewards: newRewards,
          totalRewardValue: newTotalReward,
          conversionRate: conversionRate,
          conversionPercentage: conversionPercentage + '%'
        },
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
