// PRewrite Framework: Prompt Rewriting with Reinforcement Learning
// Basado en el framework PRewrite para optimización automática de prompts

import { RLAlgorithm, RLState, RLAction, RLReward, RLEpisode, RewardFunctions, createRLAlgorithm } from './rl-algorithms'
import { generateContentWithAI, ContentGenerationRequest } from './openai'

export interface PromptRewriteConfig {
  algorithm: 'q-learning' | 'policy-gradient'
  rewardType: 'exact_match' | 'f1_score' | 'perplexity' | 'perplexity_f1' | 'length_diff' | 'engagement' | 'conversion'
  maxIterations: number
  learningRate: number
  epsilon: number
  epsilonDecay: number
}

export interface PromptRewriteSession {
  id: string
  originalPrompt: string
  metaPrompt: string
  currentPrompt: string
  iterations: number
  bestPrompt: string
  bestReward: number
  config: PromptRewriteConfig
  episodes: RLEpisode[]
  status: 'active' | 'completed' | 'paused'
  createdAt: number
  updatedAt: number
}

export interface PromptEvaluation {
  prompt: string
  reward: RLReward
  generatedContent: string
  metadata: any
  timestamp: number
}

export class PromptRewriteRL {
  private rlAlgorithm: RLAlgorithm
  private session: PromptRewriteSession
  private evaluationHistory: PromptEvaluation[] = []

  constructor(session: PromptRewriteSession, rlAlgorithm: RLAlgorithm) {
    this.session = session
    this.rlAlgorithm = rlAlgorithm
  }

  async rewritePrompt(groundTruth?: string, testData?: any[]): Promise<PromptRewriteSession> {
    let iteration = 0
    let currentPrompt = this.session.originalPrompt
    let bestPrompt = this.session.originalPrompt
    let bestReward = 0

    while (iteration < this.session.config.maxIterations) {
      // Create current state
      const state = this.createState(currentPrompt, iteration)
      
      // Select action using RL algorithm
      const action = this.rlAlgorithm.selectAction(state)
      
      // Apply action to rewrite prompt
      const newPrompt = await this.applyAction(currentPrompt, action)
      
      // Evaluate the new prompt
      const evaluation = await this.evaluatePrompt(newPrompt, groundTruth, testData)
      
      // Create reward
      const reward = this.calculateReward(evaluation, groundTruth)
      
      // Create episode
      const episode = this.createEpisode(state, action, reward, newPrompt)
      
      // Update RL algorithm
      this.rlAlgorithm.updatePolicy(episode)
      
      // Update session
      this.session.currentPrompt = newPrompt
      this.session.iterations = iteration + 1
      this.session.episodes.push(episode)
      this.session.updatedAt = Date.now()
      
      // Check if this is the best prompt so far
      if (reward.value > bestReward) {
        bestReward = reward.value
        bestPrompt = newPrompt
        this.session.bestPrompt = bestPrompt
        this.session.bestReward = bestReward
      }
      
      // Store evaluation
      this.evaluationHistory.push(evaluation)
      
      // Update current prompt for next iteration
      currentPrompt = newPrompt
      iteration++
      
      // Early stopping if reward is very high
      if (reward.value > 0.95) {
        break
      }
    }
    
    this.session.status = 'completed'
    return this.session
  }

  private createState(prompt: string, iteration: number): RLState {
    // Extract features from prompt
    const features = this.extractPromptFeatures(prompt)
    
    return {
      id: `state_${iteration}`,
      prompt,
      context: {
        iteration,
        sessionId: this.session.id,
        timestamp: Date.now()
      },
      features,
      timestamp: Date.now()
    }
  }

  private async applyAction(prompt: string, action: RLAction): Promise<string> {
    switch (action.type) {
      case 'add_token':
        return this.addToken(prompt, action.parameters)
      case 'remove_token':
        return this.removeToken(prompt, action.parameters)
      case 'modify_token':
        return this.modifyToken(prompt, action.parameters)
      case 'reorder':
        return this.reorderTokens(prompt, action.parameters)
      case 'expand':
        return this.expandPrompt(prompt, action.parameters)
      case 'simplify':
        return this.simplifyPrompt(prompt, action.parameters)
      default:
        return prompt
    }
  }

  private async evaluatePrompt(
    prompt: string, 
    groundTruth?: string, 
    testData?: any[]
  ): Promise<PromptEvaluation> {
    try {
      // Generate content using the prompt
      const request: ContentGenerationRequest = {
        client: {
          name: 'Test Client',
          business_type: 'Technology',
          industry: 'AI/ML',
          target_audience: 'Developers',
          unique_value_proposition: 'AI-powered solutions',
          country: 'Guatemala'
        },
        contentType: 'social_media_post',
        platform: 'linkedin',
        topic: 'AI and Machine Learning',
        tone: 'professional'
      }

      const result = await generateContentWithAI(request)
      const generatedContent = result.success ? result.content : ''

      // Calculate reward based on configuration
      let reward: RLReward
      if (groundTruth) {
        switch (this.session.config.rewardType) {
          case 'exact_match':
            reward = RewardFunctions.exactMatch(generatedContent, groundTruth)
            break
          case 'f1_score':
            reward = RewardFunctions.f1Score(generatedContent, groundTruth)
            break
          case 'perplexity':
            reward = RewardFunctions.perplexity(generatedContent, 0.8) // Mock confidence
            break
          case 'perplexity_f1':
            reward = RewardFunctions.perplexityF1(generatedContent, groundTruth, 0.8)
            break
          case 'length_diff':
            reward = RewardFunctions.lengthDifference(generatedContent, groundTruth)
            break
          default:
            reward = RewardFunctions.f1Score(generatedContent, groundTruth)
        }
      } else {
        // Use engagement metrics if available
        reward = RewardFunctions.engagement({
          likes: Math.random() * 100,
          shares: Math.random() * 50,
          comments: Math.random() * 30,
          views: Math.random() * 1000
        })
      }

      return {
        prompt,
        reward,
        generatedContent,
        metadata: {
          success: result.success,
          error: result.error,
          testData: testData?.length || 0
        },
        timestamp: Date.now()
      }
    } catch (error) {
      return {
        prompt,
        reward: {
          value: 0,
          type: this.session.config.rewardType,
          metadata: { error: error.message },
          timestamp: Date.now()
        },
        generatedContent: '',
        metadata: { error: error.message },
        timestamp: Date.now()
      }
    }
  }

  private calculateReward(evaluation: PromptEvaluation, groundTruth?: string): RLReward {
    return evaluation.reward
  }

  private createEpisode(
    state: RLState, 
    action: RLAction, 
    reward: RLReward, 
    finalPrompt: string
  ): RLEpisode {
    const finalState = this.createState(finalPrompt, state.context.iteration + 1)
    
    return {
      id: `episode_${Date.now()}`,
      initialState: state,
      actions: [action],
      rewards: [reward],
      finalState,
      totalReward: reward.value,
      timestamp: Date.now()
    }
  }

  private extractPromptFeatures(prompt: string): number[] {
    const words = prompt.split(/\s+/)
    const sentences = prompt.split(/[.!?]+/)
    
    return [
      words.length, // Word count
      sentences.length, // Sentence count
      prompt.length, // Character count
      (prompt.match(/[A-Z]/g) || []).length, // Capital letters
      (prompt.match(/[0-9]/g) || []).length, // Numbers
      (prompt.match(/[!@#$%^&*(),.?":{}|<>]/g) || []).length, // Special characters
      words.length > 0 ? words.reduce((sum, word) => sum + word.length, 0) / words.length : 0, // Average word length
      sentences.length > 0 ? words.length / sentences.length : 0 // Words per sentence
    ]
  }

  // Action implementations
  private addToken(prompt: string, parameters: any): string {
    const tokens = prompt.split(' ')
    const position = parameters.position || Math.floor(Math.random() * tokens.length)
    const token = parameters.token || 'optimized'
    
    tokens.splice(position, 0, token)
    return tokens.join(' ')
  }

  private removeToken(prompt: string, parameters: any): string {
    const tokens = prompt.split(' ')
    if (tokens.length <= 1) return prompt
    
    const position = parameters.position || Math.floor(Math.random() * tokens.length)
    tokens.splice(position, 1)
    return tokens.join(' ')
  }

  private modifyToken(prompt: string, parameters: any): string {
    const tokens = prompt.split(' ')
    const position = parameters.position || Math.floor(Math.random() * tokens.length)
    const newToken = parameters.newToken || 'improved'
    
    if (position < tokens.length) {
      tokens[position] = newToken
    }
    return tokens.join(' ')
  }

  private reorderTokens(prompt: string, parameters: any): string {
    const tokens = prompt.split(' ')
    if (tokens.length <= 2) return prompt
    
    // Simple reordering: swap two random tokens
    const pos1 = Math.floor(Math.random() * tokens.length)
    const pos2 = Math.floor(Math.random() * tokens.length)
    
    if (pos1 !== pos2) {
      [tokens[pos1], tokens[pos2]] = [tokens[pos2], tokens[pos1]]
    }
    
    return tokens.join(' ')
  }

  private expandPrompt(prompt: string, parameters: any): string {
    const expansions = [
      'with detailed explanations',
      'including specific examples',
      'with step-by-step instructions',
      'providing comprehensive insights',
      'with practical applications'
    ]
    
    const expansion = parameters.expansion || expansions[Math.floor(Math.random() * expansions.length)]
    return `${prompt} ${expansion}`
  }

  private simplifyPrompt(prompt: string, parameters: any): string {
    // Remove common filler words
    const fillerWords = ['very', 'really', 'quite', 'rather', 'somewhat', 'fairly']
    let simplified = prompt
    
    fillerWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi')
      simplified = simplified.replace(regex, '')
    })
    
    // Clean up extra spaces
    return simplified.replace(/\s+/g, ' ').trim()
  }

  // Getters
  getSession(): PromptRewriteSession {
    return this.session
  }

  getEvaluationHistory(): PromptEvaluation[] {
    return [...this.evaluationHistory]
  }

  getRLStats() {
    return this.rlAlgorithm.getStats()
  }

  getBestPrompt(): string {
    return this.session.bestPrompt
  }

  getBestReward(): number {
    return this.session.bestReward
  }
}

// Service class for managing prompt rewrite sessions
export class PromptRewriteService {
  private sessions: Map<string, PromptRewriteRL> = new Map()

  async createSession(
    originalPrompt: string,
    config: PromptRewriteConfig,
    metaPrompt?: string
  ): Promise<PromptRewriteSession> {
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    const session: PromptRewriteSession = {
      id: sessionId,
      originalPrompt,
      metaPrompt: metaPrompt || 'Rewrite this prompt to be more effective and engaging.',
      currentPrompt: originalPrompt,
      iterations: 0,
      bestPrompt: originalPrompt,
      bestReward: 0,
      config,
      episodes: [],
      status: 'active',
      createdAt: Date.now(),
      updatedAt: Date.now()
    }

    // Create RL algorithm
    const policy = {
      id: `policy_${sessionId}`,
      name: `${config.algorithm} Policy`,
      parameters: config,
      performance: {
        totalRewards: 0,
        averageReward: 0,
        episodes: 0,
        lastUpdated: Date.now()
      }
    }
    
    const rlAlgorithm = createRLAlgorithm(config.algorithm, policy, config)

    // Create PRewrite instance
    const promptRewrite = new PromptRewriteRL(session, rlAlgorithm)
    this.sessions.set(sessionId, promptRewrite)

    return session
  }

  async rewritePrompt(
    sessionId: string, 
    groundTruth?: string, 
    testData?: any[]
  ): Promise<PromptRewriteSession> {
    const session = this.sessions.get(sessionId)
    if (!session) {
      throw new Error(`Session ${sessionId} not found`)
    }

    return await session.rewritePrompt(groundTruth, testData)
  }

  getSession(sessionId: string): PromptRewriteRL | undefined {
    return this.sessions.get(sessionId)
  }

  getAllSessions(): PromptRewriteSession[] {
    return Array.from(this.sessions.values()).map(session => session.getSession())
  }

  deleteSession(sessionId: string): boolean {
    return this.sessions.delete(sessionId)
  }
}

// Singleton instance
export const promptRewriteService = new PromptRewriteService()

