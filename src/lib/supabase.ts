import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://yitczogktdykcwjnejrt.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpdGN6b2drdGR5a2N3am5lanJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNTI3MDEsImV4cCI6MjA3MjkyODcwMX0.balGnL7rsSxA9SXVEnpbIgSwdNdUg71fU4U-c4gdYsY'

// Sistema de generación real con IA - YA NO ES DEMO
export const AI_ENABLED = true
export const TIENDASTS_CLIENT_ID = '9f7772b5-46ab-4c33-9258-2393244db69f'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Client {
  id: string
  name: string
  business_type: string
  description: string
  website_url: string
  logo_url: string | null
  target_audience: string
  primary_goal: string
  social_profiles: any
  api_credentials: any
  is_active: boolean
  user_id: string
  created_at: string
  updated_at: string
  // Campos adicionales que existen en la BD
  industry: string
  contact_email: string
  contact_phone: string
  address: string
  country: string
  competitors: string[]
  unique_value_proposition: string
  created_by: string
}

export interface Campaign {
  id: string
  client_id: string
  name: string
  description: string
  campaign_type: string
  status: string
  objective: string
  target_audience: any
  budget: number
  start_date: string
  end_date: string
  russell_brunson_framework: string
  value_ladder: any
  created_by: string
  created_at: string
  updated_at: string
}

export interface Content {
  id: string
  campaign_id: string
  client_id: string
  title: string
  content_type: string
  platform: string
  hook: string
  story: string
  offer: string
  content_body: string
  media_urls: any
  scheduled_for: string
  status: string
  engagement_metrics: any
  created_by: string
  created_at: string
  updated_at: string
}

export interface Analytics {
  id: string
  client_id: string
  campaign_id: string
  metric_type: string
  metric_name: string
  metric_value: number
  metric_unit: string
  platform: string
  date_recorded: string
  additional_data: any
  created_at: string
}

export interface MarketResearch {
  id: string
  client_id: string
  research_type: string
  title: string
  findings: any
  market_size_data: any
  competitor_analysis: any
  target_audience_insights: any
  trends_analysis: any
  opportunity_assessment: any
  threat_analysis: any
  recommendations: any
  status: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface Strategy {
  id: string
  client_id: string
  campaign_id: string
  strategy_type: string
  framework_used: string
  strategy_details: any
  dream_100_list: any
  value_ladder: any
  webinar_script: any
  traffic_temperature: any
  psychological_triggers: any
  expected_outcomes: any
  implementation_steps: any
  status: string
  created_by: string
  created_at: string
  updated_at: string
}

// Multi-Armed Bandit Types
export interface MABExperiment {
  id: string
  client_id: string
  name: string
  description: string
  experiment_type: 'content' | 'campaign' | 'strategy'
  status: 'active' | 'paused' | 'completed'
  arms: MABArm[]
  target_metric: 'ctr' | 'conversion' | 'engagement'
  total_traffic: number
  start_date: string
  end_date: string | null
  created_by: string
  created_at: string
  updated_at: string
  mab_arm_performance?: MABArmPerformance[]
  stats?: {
    total_pulls: number
    total_arms: number
    winning_arm: {
      arm_id: string
      arm_name: string
      conversion_rate: number
      pulls: number
    } | null
    confidence_level: 'alta' | 'media' | 'baja'
  }
}

export interface MABArmPerformance {
  id: string
  experiment_id: string
  arm_id: string
  arm_name: string
  pulls: number
  rewards: number
  total_reward: number
  client_id: string
  metadata: any
  created_at: string
  updated_at: string
}

export interface MABArm {
  arm_id: string
  name: string
  configuration: any
}

// MAB Edge Function Response Types
export interface MABSelectionResponse {
  success: boolean
  selected_arm: string
  arm_name: string
  experiment_name: string
  experiment_type: string
  target_metric: string
  total_pulls: number
  timestamp: string
  ucb_stats: {
    total_arms: number
    algorithm: string
  }
}

export interface MABRewardResponse {
  success: boolean
  experiment_id: string
  arm_id: string
  reward: number
  metadata: any
  stats: {
    pulls: number
    total_rewards: number
    total_reward_value: number
    conversion_rate: number
    conversion_percentage: string
  }
  timestamp: string
}
