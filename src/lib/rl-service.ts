// RL Service for Supabase Integration
// Maneja el almacenamiento y recuperación de datos de Reinforcement Learning

import { supabase } from './supabase'
import { RLState, RLAction, RLReward, RLEpisode, RLPolicy } from './rl-algorithms'
import { PromptRewriteSession, PromptEvaluation } from './prompt-rewrite-rl'

export interface RLExperiment {
  id: string
  name: string
  description: string
  algorithm_type: 'q-learning' | 'policy-gradient'
  reward_type: 'exact_match' | 'f1_score' | 'perplexity' | 'perplexity_f1' | 'length_diff' | 'engagement' | 'conversion'
  config: any
  status: 'active' | 'completed' | 'paused'
  created_at: string
  updated_at: string
  user_id: string
  client_id: string
}

export interface RLEpisodeRecord {
  id: string
  experiment_id: string
  episode_data: RLEpisode
  total_reward: number
  timestamp: string
}

export interface RLRewardRecord {
  id: string
  experiment_id: string
  episode_id: string
  reward_data: RLReward
  timestamp: string
}

export interface RLPolicyRecord {
  id: string
  experiment_id: string
  policy_data: RLPolicy
  performance_metrics: any
  updated_at: string
}

export interface PromptRewriteRecord {
  id: string
  experiment_id: string
  session_data: PromptRewriteSession
  evaluation_history: PromptEvaluation[]
  created_at: string
  updated_at: string
}

export class RLService {
  // Experiment Management
  async createExperiment(experiment: Omit<RLExperiment, 'id' | 'created_at' | 'updated_at'>): Promise<RLExperiment> {
    const { data, error } = await supabase
      .from('rl_experiments')
      .insert([{
        name: experiment.name,
        description: experiment.description,
        algorithm_type: experiment.algorithm_type,
        reward_type: experiment.reward_type,
        config: experiment.config,
        status: experiment.status,
        user_id: experiment.user_id,
        client_id: experiment.client_id
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getExperiments(userId: string, clientId?: string): Promise<RLExperiment[]> {
    let query = supabase
      .from('rl_experiments')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (clientId) {
      query = query.eq('client_id', clientId)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  async getExperiment(experimentId: string): Promise<RLExperiment | null> {
    const { data, error } = await supabase
      .from('rl_experiments')
      .select('*')
      .eq('id', experimentId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  }

  async updateExperiment(experimentId: string, updates: Partial<RLExperiment>): Promise<RLExperiment> {
    const { data, error } = await supabase
      .from('rl_experiments')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', experimentId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async deleteExperiment(experimentId: string): Promise<void> {
    const { error } = await supabase
      .from('rl_experiments')
      .delete()
      .eq('id', experimentId)

    if (error) throw error
  }

  // Episode Management
  async saveEpisode(episode: RLEpisode, experimentId: string): Promise<RLEpisodeRecord> {
    const { data, error } = await supabase
      .from('rl_episodes')
      .insert([{
        experiment_id: experimentId,
        episode_data: episode,
        total_reward: episode.totalReward,
        timestamp: new Date(episode.timestamp).toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getEpisodes(experimentId: string, limit: number = 100): Promise<RLEpisodeRecord[]> {
    const { data, error } = await supabase
      .from('rl_episodes')
      .select('*')
      .eq('experiment_id', experimentId)
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  async getEpisodeStats(experimentId: string): Promise<any> {
    const { data, error } = await supabase
      .from('rl_episodes')
      .select('total_reward, timestamp')
      .eq('experiment_id', experimentId)
      .order('timestamp', { ascending: true })

    if (error) throw error

    if (!data || data.length === 0) {
      return {
        totalEpisodes: 0,
        averageReward: 0,
        bestReward: 0,
        worstReward: 0,
        rewardTrend: []
      }
    }

    const rewards = data.map(ep => ep.total_reward)
    const averageReward = rewards.reduce((sum, reward) => sum + reward, 0) / rewards.length
    const bestReward = Math.max(...rewards)
    const worstReward = Math.min(...rewards)

    // Calculate reward trend (moving average over last 10 episodes)
    const rewardTrend = []
    const windowSize = Math.min(10, rewards.length)
    for (let i = windowSize - 1; i < rewards.length; i++) {
      const window = rewards.slice(i - windowSize + 1, i + 1)
      const avg = window.reduce((sum, r) => sum + r, 0) / window.length
      rewardTrend.push({
        episode: i + 1,
        averageReward: avg,
        timestamp: data[i].timestamp
      })
    }

    return {
      totalEpisodes: data.length,
      averageReward,
      bestReward,
      worstReward,
      rewardTrend
    }
  }

  // Policy Management
  async savePolicy(policy: RLPolicy, experimentId: string): Promise<RLPolicyRecord> {
    const { data, error } = await supabase
      .from('rl_policies')
      .upsert([{
        experiment_id: experimentId,
        policy_data: policy,
        performance_metrics: policy.performance,
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getPolicy(experimentId: string): Promise<RLPolicyRecord | null> {
    const { data, error } = await supabase
      .from('rl_policies')
      .select('*')
      .eq('experiment_id', experimentId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') return null
      throw error
    }
    return data
  }

  // Prompt Rewrite Management
  async savePromptRewriteSession(
    session: PromptRewriteSession, 
    experimentId: string,
    evaluationHistory: PromptEvaluation[]
  ): Promise<PromptRewriteRecord> {
    const { data, error } = await supabase
      .from('prompt_rewrite_sessions')
      .insert([{
        experiment_id: experimentId,
        session_data: session,
        evaluation_history: evaluationHistory,
        created_at: new Date(session.createdAt).toISOString(),
        updated_at: new Date(session.updatedAt).toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return data
  }

  async getPromptRewriteSessions(experimentId: string): Promise<PromptRewriteRecord[]> {
    const { data, error } = await supabase
      .from('prompt_rewrite_sessions')
      .select('*')
      .eq('experiment_id', experimentId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  async updatePromptRewriteSession(
    sessionId: string, 
    session: PromptRewriteSession,
    evaluationHistory: PromptEvaluation[]
  ): Promise<PromptRewriteRecord> {
    const { data, error } = await supabase
      .from('prompt_rewrite_sessions')
      .update({
        session_data: session,
        evaluation_history: evaluationHistory,
        updated_at: new Date(session.updatedAt).toISOString()
      })
      .eq('id', sessionId)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Analytics and Metrics
  async getExperimentAnalytics(experimentId: string): Promise<any> {
    const [episodeStats, policy, sessions] = await Promise.all([
      this.getEpisodeStats(experimentId),
      this.getPolicy(experimentId),
      this.getPromptRewriteSessions(experimentId)
    ])

    const experiment = await this.getExperiment(experimentId)
    if (!experiment) {
      throw new Error('Experiment not found')
    }

    // Calculate session statistics
    const sessionStats = {
      totalSessions: sessions.length,
      completedSessions: sessions.filter(s => s.session_data.status === 'completed').length,
      averageIterations: sessions.length > 0 
        ? sessions.reduce((sum, s) => sum + s.session_data.iterations, 0) / sessions.length 
        : 0,
      bestReward: sessions.length > 0 
        ? Math.max(...sessions.map(s => s.session_data.bestReward)) 
        : 0
    }

    return {
      experiment,
      episodeStats,
      policy: policy?.policy_data,
      sessionStats,
      sessions: sessions.map(s => ({
        id: s.id,
        status: s.session_data.status,
        iterations: s.session_data.iterations,
        bestReward: s.session_data.bestReward,
        createdAt: s.created_at,
        updatedAt: s.updated_at
      }))
    }
  }

  // Real-time updates
  subscribeToExperimentUpdates(experimentId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`rl_experiment_${experimentId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'rl_episodes',
          filter: `experiment_id=eq.${experimentId}`
        }, 
        callback
      )
      .subscribe()
  }

  subscribeToSessionUpdates(experimentId: string, callback: (payload: any) => void) {
    return supabase
      .channel(`rl_sessions_${experimentId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'prompt_rewrite_sessions',
          filter: `experiment_id=eq.${experimentId}`
        }, 
        callback
      )
      .subscribe()
  }
}

// Singleton instance
export const rlService = new RLService()













