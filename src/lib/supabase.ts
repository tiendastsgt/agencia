import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

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