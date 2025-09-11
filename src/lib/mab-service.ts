// Multi-Armed Bandit Service for Supabase Integration
import { supabase, MABExperiment, MABArm, MABArmPerformance } from './supabase'
import { 
  MABAlgorithm, 
  MABArm as AlgorithmArm, 
  MABContext, 
  MABResult,
  createMABAlgorithm 
} from './mab-algorithms'

export interface MABServiceConfig {
  experimentId: string
  algorithm: 'epsilon-greedy' | 'ucb' | 'thompson' | 'contextual'
  options?: any
}

export interface MABSelectionRequest {
  experimentId: string
  context?: MABContext
  userId?: string
}

export interface MABRewardRequest {
  experimentId: string
  armId: string
  reward: number
  context?: MABContext
  metadata?: any
}

export class MABService {
  private algorithms: Map<string, MABAlgorithm> = new Map()
  private experiments: Map<string, MABExperiment> = new Map()

  async initializeExperiment(experimentId: string): Promise<void> {
    try {
      // Load experiment from Supabase
      const { data: experiment, error } = await supabase
        .from('mab_experiments')
        .select('*')
        .eq('id', experimentId)
        .single()

      if (error) throw error
      if (!experiment) throw new Error('Experiment not found')

      this.experiments.set(experimentId, experiment)

      // Load arm performance data
      const { data: performances, error: perfError } = await supabase
        .from('mab_arm_performance')
        .select('*')
        .eq('experiment_id', experimentId)

      if (perfError) throw perfError

      // Convert to algorithm arms
      const algorithmArms: AlgorithmArm[] = experiment.arms.map(arm => {
        const performance = performances?.find(p => p.arm_id === arm.arm_id)
        return {
          id: arm.arm_id,
          name: arm.name,
          configuration: arm.configuration,
          pulls: performance?.pulls || 0,
          rewards: performance?.rewards || 0,
          averageReward: performance?.pulls > 0 ? performance.rewards / performance.pulls : 0
        }
      })

      // Create algorithm instance
      const algorithm = createMABAlgorithm(
        experiment.algorithm_type || 'epsilon-greedy',
        algorithmArms,
        experiment.algorithm_options || {}
      )

      this.algorithms.set(experimentId, algorithm)

    } catch (error) {
      console.error('Error initializing experiment:', error)
      throw error
    }
  }

  async selectArm(request: MABSelectionRequest): Promise<MABResult> {
    const { experimentId, context, userId } = request

    try {
      // Ensure experiment is initialized
      if (!this.algorithms.has(experimentId)) {
        await this.initializeExperiment(experimentId)
      }

      const algorithm = this.algorithms.get(experimentId)!
      const experiment = this.experiments.get(experimentId)!

      // Add user context if provided
      const fullContext: MABContext = {
        userId,
        timestamp: Date.now(),
        ...context
      }

      // Select arm using algorithm
      const result = algorithm.selectArm(fullContext)

      // Log selection to Supabase
      await this.logSelection(experimentId, result, fullContext)

      return result

    } catch (error) {
      console.error('Error selecting arm:', error)
      throw error
    }
  }

  async recordReward(request: MABRewardRequest): Promise<void> {
    const { experimentId, armId, reward, context, metadata } = request

    try {
      // Ensure experiment is initialized
      if (!this.algorithms.has(experimentId)) {
        await this.initializeExperiment(experimentId)
      }

      const algorithm = this.algorithms.get(experimentId)!

      // Update algorithm
      algorithm.updateReward(armId, reward, context)

      // Update Supabase
      await this.updateArmPerformance(experimentId, armId, reward, metadata)

      // Log reward
      await this.logReward(experimentId, armId, reward, context, metadata)

    } catch (error) {
      console.error('Error recording reward:', error)
      throw error
    }
  }

  async getExperimentStats(experimentId: string): Promise<any> {
    try {
      if (!this.algorithms.has(experimentId)) {
        await this.initializeExperiment(experimentId)
      }

      const algorithm = this.algorithms.get(experimentId)!
      const experiment = this.experiments.get(experimentId)!

      const stats = algorithm.getStats()
      const arms = algorithm.getArms()

      return {
        experiment: {
          id: experiment.id,
          name: experiment.name,
          status: experiment.status,
          algorithm: (algorithm as any).algorithmName
        },
        stats,
        arms: arms.map(arm => ({
          id: arm.id,
          name: arm.name,
          pulls: arm.pulls,
          rewards: arm.rewards,
          averageReward: arm.averageReward,
          conversionRate: arm.pulls > 0 ? (arm.rewards / arm.pulls) * 100 : 0
        }))
      }

    } catch (error) {
      console.error('Error getting experiment stats:', error)
      throw error
    }
  }

  private async logSelection(
    experimentId: string, 
    result: MABResult, 
    context: MABContext
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('mab_selections')
        .insert({
          experiment_id: experimentId,
          arm_id: result.selectedArm,
          context: context,
          algorithm: result.algorithm,
          confidence: result.confidence,
          timestamp: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Error logging selection:', error)
      // Don't throw - this is not critical
    }
  }

  private async logReward(
    experimentId: string,
    armId: string,
    reward: number,
    context?: MABContext,
    metadata?: any
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('mab_rewards')
        .insert({
          experiment_id: experimentId,
          arm_id: armId,
          reward: reward,
          context: context,
          metadata: metadata,
          timestamp: new Date().toISOString()
        })

      if (error) throw error
    } catch (error) {
      console.error('Error logging reward:', error)
      // Don't throw - this is not critical
    }
  }

  private async updateArmPerformance(
    experimentId: string,
    armId: string,
    reward: number,
    metadata?: any
  ): Promise<void> {
    try {
      // Get current performance
      const { data: current, error: fetchError } = await supabase
        .from('mab_arm_performance')
        .select('*')
        .eq('experiment_id', experimentId)
        .eq('arm_id', armId)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError
      }

      if (current) {
        // Update existing record
        const { error: updateError } = await supabase
          .from('mab_arm_performance')
          .update({
            pulls: current.pulls + 1,
            rewards: current.rewards + reward,
            total_reward: current.total_reward + reward,
            metadata: { ...current.metadata, ...metadata },
            updated_at: new Date().toISOString()
          })
          .eq('id', current.id)

        if (updateError) throw updateError
      } else {
        // Create new record
        const { error: insertError } = await supabase
          .from('mab_arm_performance')
          .insert({
            experiment_id: experimentId,
            arm_id: armId,
            arm_name: `Arm ${armId}`,
            pulls: 1,
            rewards: reward,
            total_reward: reward,
            metadata: metadata,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (insertError) throw insertError
      }
    } catch (error) {
      console.error('Error updating arm performance:', error)
      throw error
    }
  }

  // Utility methods
  async createExperiment(
    name: string,
    description: string,
    arms: MABArm[],
    algorithm: string = 'epsilon-greedy',
    options: any = {}
  ): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('mab_experiments')
        .insert({
          name,
          description,
          experiment_type: 'content',
          status: 'active',
          arms: arms,
          target_metric: 'conversion',
          algorithm_type: algorithm,
          algorithm_options: options,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select('id')
        .single()

      if (error) throw error
      return data.id
    } catch (error) {
      console.error('Error creating experiment:', error)
      throw error
    }
  }

  async getActiveExperiments(clientId: string): Promise<MABExperiment[]> {
    try {
      const { data, error } = await supabase
        .from('mab_experiments')
        .select('*')
        .eq('client_id', clientId)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error getting active experiments:', error)
      throw error
    }
  }
}

// Singleton instance
export const mabService = new MABService()

