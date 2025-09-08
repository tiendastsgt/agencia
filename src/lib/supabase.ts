import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://keiegxjpxexbwhqhpnpb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlaWVneGpweGV4YndocWhwbnBiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcyODgwNDksImV4cCI6MjA3Mjg2NDA0OX0.pybJ5bg55uzQDvWe8MtxOTYinM2_x1Ua9FmFcopHl0Q'

// Sistema de generación real con IA - YA NO ES DEMO
export const AI_ENABLED = true
export const TIENDASTS_CLIENT_ID = '9f7772b5-46ab-4c33-9258-2393244db69f'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Client {
  id: string
  name: string
  industry: string
  description: string
  website_url: string
  contact_email: string
  contact_phone: string
  address: string
  country: string
  target_audience: any
  competitors: any
  unique_value_proposition: string
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
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