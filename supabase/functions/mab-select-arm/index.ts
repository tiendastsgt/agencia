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
    const { experimentId, context, userId } = await req.json()

    if (!experimentId || !context || !userId) {
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
      .from('mab_experiments')
      .select('*')
      .eq('id', experimentId)
      .single()

    if (expError || !experiment) {
      return new Response(
        JSON.stringify({ error: 'Experiment not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get arm performance data
    const { data: armPerformance, error: perfError } = await supabaseClient
      .from('mab_arm_performance')
      .select('*')
      .eq('experiment_id', experimentId)

    if (perfError) {
      return new Response(
        JSON.stringify({ error: 'Failed to fetch arm performance' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // UCB Algorithm Implementation
    const selectArmUCB = (arms: any[], totalPulls: number) => {
      if (arms.length === 0) return null
      if (totalPulls < arms.length) {
        // Return arms that haven't been pulled yet
        const unpulledArms = arms.filter(arm => arm.pulls === 0)
        return unpulledArms[0] || arms[0]
      }

      const c = 1.414 // Exploration parameter
      let bestArm = arms[0]
      let bestUCB = -Infinity

      for (const arm of arms) {
        if (arm.pulls === 0) continue

        const avgReward = arm.total_reward / arm.pulls
        const confidence = c * Math.sqrt(Math.log(totalPulls) / arm.pulls)
        const ucb = avgReward + confidence

        if (ucb > bestUCB) {
          bestUCB = ucb
          bestArm = arm
        }
      }

      return bestArm
    }

    // Calculate total pulls
    const totalPulls = armPerformance.reduce((sum, arm) => sum + arm.pulls, 0)

    // Select arm using UCB
    const selectedArm = selectArmUCB(armPerformance, totalPulls)

    if (!selectedArm) {
      return new Response(
        JSON.stringify({ error: 'No arms available' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Record selection
    const { error: selectionError } = await supabaseClient
      .from('mab_selections')
      .insert({
        experiment_id: experimentId,
        arm_id: selectedArm.arm_id,
        context: context,
        algorithm: 'ucb',
        confidence: 0.95,
        timestamp: new Date().toISOString()
      })

    if (selectionError) {
      console.error('Error recording selection:', selectionError)
    }

    // Update arm pulls
    const { error: updateError } = await supabaseClient
      .from('mab_arm_performance')
      .update({ 
        pulls: selectedArm.pulls + 1,
        updated_at: new Date().toISOString()
      })
      .eq('id', selectedArm.id)

    if (updateError) {
      console.error('Error updating arm pulls:', updateError)
    }

    return new Response(
      JSON.stringify({
        success: true,
        selectedArm: selectedArm.arm_id,
        armName: selectedArm.arm_name,
        experimentName: experiment.name,
        experimentType: experiment.experiment_type,
        targetMetric: experiment.target_metric,
        totalPulls: totalPulls + 1,
        timestamp: new Date().toISOString(),
        ucbStats: {
          totalArms: armPerformance.length,
          algorithm: 'ucb'
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
