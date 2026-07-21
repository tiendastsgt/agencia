// Reinforcement Learning Algorithms for Prompt Optimization
// Basado en el framework PRewrite y técnicas de RL para marketing

export interface RLState {
  id: string
  prompt: string
  context: any
  features: number[]
  timestamp: number
}

export interface RLAction {
  id: string
  type: 'add_token' | 'remove_token' | 'modify_token' | 'reorder' | 'expand' | 'simplify'
  description: string
  parameters: any
}

export interface RLReward {
  value: number
  type: 'exact_match' | 'f1_score' | 'perplexity' | 'perplexity_f1' | 'length_diff' | 'engagement' | 'conversion'
  metadata: any
  timestamp: number
}

export interface RLPolicy {
  id: string
  name: string
  parameters: any
  performance: {
    totalRewards: number
    averageReward: number
    episodes: number
    lastUpdated: number
  }
}

export interface RLEpisode {
  id: string
  initialState: RLState
  actions: RLAction[]
  rewards: RLReward[]
  finalState: RLState
  totalReward: number
  timestamp: number
}

// Base class for RL algorithms
export abstract class RLAlgorithm {
  protected policy: RLPolicy
  protected episodes: RLEpisode[] = []
  protected algorithmName: string

  constructor(policy: RLPolicy, algorithmName: string) {
    this.policy = policy
    this.algorithmName = algorithmName
  }

  abstract selectAction(state: RLState): RLAction
  abstract updatePolicy(episode: RLEpisode): void
  abstract getQValue(state: RLState, action: RLAction): number

  getPolicy(): RLPolicy {
    return this.policy
  }

  getEpisodes(): RLEpisode[] {
    return [...this.episodes]
  }

  getStats() {
    const totalRewards = this.episodes.reduce((sum, ep) => sum + ep.totalReward, 0)
    const averageReward = this.episodes.length > 0 ? totalRewards / this.episodes.length : 0
    
    return {
      algorithm: this.algorithmName,
      totalEpisodes: this.episodes.length,
      totalRewards,
      averageReward,
      lastEpisode: this.episodes[this.episodes.length - 1]?.timestamp || 0
    }
  }
}

// Q-Learning Algorithm
export class QLearning extends RLAlgorithm {
  private qTable: Map<string, Map<string, number>> = new Map()
  private learningRate: number
  private discountFactor: number
  private epsilon: number
  private epsilonDecay: number

  constructor(
    policy: RLPolicy,
    learningRate: number = 0.1,
    discountFactor: number = 0.9,
    epsilon: number = 0.1,
    epsilonDecay: number = 0.995
  ) {
    super(policy, 'Q-Learning')
    this.learningRate = learningRate
    this.discountFactor = discountFactor
    this.epsilon = epsilon
    this.epsilonDecay = epsilonDecay
  }

  selectAction(state: RLState): RLAction {
    const stateKey = this.getStateKey(state)
    
    // Epsilon-greedy action selection
    if (Math.random() < this.epsilon) {
      return this.getRandomAction()
    }

    // Select best action based on Q-values
    const qValues = this.qTable.get(stateKey) || new Map()
    let bestAction: RLAction | null = null
    let bestValue = -Infinity

    for (const [actionKey, value] of qValues) {
      if (value > bestValue) {
        bestValue = value
        bestAction = this.getActionFromKey(actionKey)
      }
    }

    return bestAction || this.getRandomAction()
  }

  updatePolicy(episode: RLEpisode): void {
    const { initialState, actions, rewards } = episode

    for (let i = 0; i < actions.length; i++) {
      const state = i === 0 ? initialState : this.getStateFromAction(actions[i-1], initialState)
      const action = actions[i]
      const reward = rewards[i]?.value || 0
      const nextState = i < actions.length - 1 ? this.getStateFromAction(action, state) : episode.finalState

      this.updateQValue(state, action, reward, nextState)
    }

    // Decay epsilon
    this.epsilon *= this.epsilonDecay

    // Store episode
    this.episodes.push(episode)
  }

  getQValue(state: RLState, action: RLAction): number {
    const stateKey = this.getStateKey(state)
    const actionKey = this.getActionKey(action)
    const qValues = this.qTable.get(stateKey) || new Map()
    return qValues.get(actionKey) || 0
  }

  private updateQValue(state: RLState, action: RLAction, reward: number, nextState: RLState): void {
    const stateKey = this.getStateKey(state)
    const actionKey = this.getActionKey(action)
    const nextStateKey = this.getStateKey(nextState)

    if (!this.qTable.has(stateKey)) {
      this.qTable.set(stateKey, new Map())
    }

    const qValues = this.qTable.get(stateKey)!
    const currentQ = qValues.get(actionKey) || 0

    // Find max Q-value for next state
    const nextQValues = this.qTable.get(nextStateKey) || new Map()
    const maxNextQ = nextQValues.size > 0 ? Math.max(...nextQValues.values()) : 0

    // Q-learning update rule
    const newQ = currentQ + this.learningRate * (reward + this.discountFactor * maxNextQ - currentQ)
    qValues.set(actionKey, newQ)
  }

  private getStateKey(state: RLState): string {
    // Create a hash of the state features
    return state.features.join(',')
  }

  private getActionKey(action: RLAction): string {
    return `${action.type}_${action.id}`
  }

  private getActionFromKey(actionKey: string): RLAction {
    const [type, id] = actionKey.split('_')
    return {
      id,
      type: type as RLAction['type'],
      description: `Action ${id}`,
      parameters: {}
    }
  }

  private getStateFromAction(action: RLAction, previousState: RLState): RLState {
    // Simplified state transition
    return {
      ...previousState,
      id: `${previousState.id}_${action.id}`,
      timestamp: Date.now()
    }
  }

  private getRandomAction(): RLAction {
    const actionTypes: RLAction['type'][] = ['add_token', 'remove_token', 'modify_token', 'reorder', 'expand', 'simplify']
    const randomType = actionTypes[Math.floor(Math.random() * actionTypes.length)]
    
    return {
      id: `random_${Date.now()}`,
      type: randomType,
      description: `Random ${randomType} action`,
      parameters: {}
    }
  }
}

// Policy Gradient Algorithm
export class PolicyGradient extends RLAlgorithm {
  private policyNetwork: Map<string, number> = new Map()
  private learningRate: number
  private baseline: number = 0

  constructor(policy: RLPolicy, learningRate: number = 0.01) {
    super(policy, 'Policy Gradient')
    this.learningRate = learningRate
  }

  selectAction(state: RLState): RLAction {
    const stateKey = this.getStateKey(state)
    const actionProbabilities = this.getActionProbabilities(stateKey)
    
    // Sample action based on probabilities
    const random = Math.random()
    let cumulativeProbability = 0
    
    for (const [actionKey, probability] of actionProbabilities) {
      cumulativeProbability += probability
      if (random <= cumulativeProbability) {
        return this.getActionFromKey(actionKey)
      }
    }

    return this.getRandomAction()
  }

  updatePolicy(episode: RLEpisode): void {
    const { initialState, actions, rewards } = episode
    const totalReward = episode.totalReward

    // Update baseline (exponential moving average)
    this.baseline = 0.9 * this.baseline + 0.1 * totalReward

    // Update policy for each action in the episode
    for (let i = 0; i < actions.length; i++) {
      const state = i === 0 ? initialState : this.getStateFromAction(actions[i-1], initialState)
      const action = actions[i]
      const reward = rewards[i]?.value || 0

      this.updatePolicyGradient(state, action, reward - this.baseline)
    }

    this.episodes.push(episode)
  }

  getQValue(state: RLState, action: RLAction): number {
    const stateKey = this.getStateKey(state)
    const actionKey = this.getActionKey(action)
    const key = `${stateKey}_${actionKey}`
    return this.policyNetwork.get(key) || 0
  }

  private updatePolicyGradient(state: RLState, action: RLAction, advantage: number): void {
    const stateKey = this.getStateKey(state)
    const actionKey = this.getActionKey(action)
    const key = `${stateKey}_${actionKey}`

    const currentValue = this.policyNetwork.get(key) || 0
    const newValue = currentValue + this.learningRate * advantage
    this.policyNetwork.set(key, newValue)
  }

  private getActionProbabilities(stateKey: string): Map<string, number> {
    const probabilities = new Map<string, number>()
    const actions = ['add_token', 'remove_token', 'modify_token', 'reorder', 'expand', 'simplify']
    
    let totalWeight = 0
    const weights = new Map<string, number>()

    for (const action of actions) {
      const key = `${stateKey}_${action}`
      const weight = Math.exp(this.policyNetwork.get(key) || 0)
      weights.set(action, weight)
      totalWeight += weight
    }

    for (const [action, weight] of weights) {
      probabilities.set(action, weight / totalWeight)
    }

    return probabilities
  }

  private getStateKey(state: RLState): string {
    return state.features.join(',')
  }

  private getActionKey(action: RLAction): string {
    return action.type
  }

  private getActionFromKey(actionKey: string): RLAction {
    return {
      id: `pg_${Date.now()}`,
      type: actionKey as RLAction['type'],
      description: `Policy gradient ${actionKey} action`,
      parameters: {}
    }
  }

  private getStateFromAction(action: RLAction, previousState: RLState): RLState {
    return {
      ...previousState,
      id: `${previousState.id}_${action.id}`,
      timestamp: Date.now()
    }
  }

  private getRandomAction(): RLAction {
    const actionTypes: RLAction['type'][] = ['add_token', 'remove_token', 'modify_token', 'reorder', 'expand', 'simplify']
    const randomType = actionTypes[Math.floor(Math.random() * actionTypes.length)]
    
    return {
      id: `random_${Date.now()}`,
      type: randomType,
      description: `Random ${randomType} action`,
      parameters: {}
    }
  }
}

// Reward Functions
export class RewardFunctions {
  static exactMatch(predicted: string, groundTruth: string): RLReward {
    const isExact = predicted.toLowerCase().trim() === groundTruth.toLowerCase().trim()
    return {
      value: isExact ? 1 : 0,
      type: 'exact_match',
      metadata: { predicted, groundTruth, isExact },
      timestamp: Date.now()
    }
  }

  static f1Score(predicted: string, groundTruth: string): RLReward {
    const predictedTokens = predicted.toLowerCase().split(/\s+/)
    const groundTruthTokens = groundTruth.toLowerCase().split(/\s+/)
    
    const intersection = predictedTokens.filter(token => groundTruthTokens.includes(token))
    const precision = intersection.length / predictedTokens.length
    const recall = intersection.length / groundTruthTokens.length
    
    const f1 = (precision + recall === 0) ? 0 : (2 * precision * recall) / (precision + recall)
    
    return {
      value: f1,
      type: 'f1_score',
      metadata: { predicted, groundTruth, precision, recall, f1 },
      timestamp: Date.now()
    }
  }

  static perplexity(predicted: string, confidence: number): RLReward {
    // Simplified perplexity calculation
    const tokens = predicted.split(/\s+/).length
    const perplexity = Math.exp(-confidence / tokens)
    
    return {
      value: 1 / (1 + perplexity), // Convert to reward (higher is better)
      type: 'perplexity',
      metadata: { predicted, confidence, perplexity, tokens },
      timestamp: Date.now()
    }
  }

  static perplexityF1(predicted: string, groundTruth: string, confidence: number): RLReward {
    const f1Reward = this.f1Score(predicted, groundTruth)
    const perplexityReward = this.perplexity(predicted, confidence)
    
    const combinedReward = (f1Reward.value + perplexityReward.value) / 2
    
    return {
      value: combinedReward,
      type: 'perplexity_f1',
      metadata: { 
        f1: f1Reward.value, 
        perplexity: perplexityReward.value, 
        combined: combinedReward 
      },
      timestamp: Date.now()
    }
  }

  static lengthDifference(predicted: string, groundTruth: string): RLReward {
    const predictedLength = predicted.length
    const groundTruthLength = groundTruth.length
    const difference = Math.abs(predictedLength - groundTruthLength)
    const maxLength = Math.max(predictedLength, groundTruthLength)
    
    const reward = maxLength > 0 ? 1 - (difference / maxLength) : 0
    
    return {
      value: reward,
      type: 'length_diff',
      metadata: { predictedLength, groundTruthLength, difference, reward },
      timestamp: Date.now()
    }
  }

  static engagement(metrics: { likes: number, shares: number, comments: number, views: number }): RLReward {
    const { likes, shares, comments, views } = metrics
    const engagementRate = views > 0 ? (likes + shares + comments) / views : 0
    
    return {
      value: Math.min(engagementRate, 1), // Cap at 1
      type: 'engagement',
      metadata: { likes, shares, comments, views, engagementRate },
      timestamp: Date.now()
    }
  }

  static conversion(conversions: number, impressions: number): RLReward {
    const conversionRate = impressions > 0 ? conversions / impressions : 0
    
    return {
      value: Math.min(conversionRate, 1), // Cap at 1
      type: 'conversion',
      metadata: { conversions, impressions, conversionRate },
      timestamp: Date.now()
    }
  }
}

// Factory function to create RL algorithms
export function createRLAlgorithm(
  type: 'q-learning' | 'policy-gradient',
  policy: RLPolicy,
  options: any = {}
): RLAlgorithm {
  switch (type) {
    case 'q-learning':
      return new QLearning(
        policy,
        options.learningRate,
        options.discountFactor,
        options.epsilon,
        options.epsilonDecay
      )
    case 'policy-gradient':
      return new PolicyGradient(policy, options.learningRate)
    default:
      throw new Error(`Unknown RL algorithm type: ${type}`)
  }
}













