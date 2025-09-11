// Multi-Armed Bandit Algorithms Implementation
// Basado en la investigación de contextual bandits y MAB

export interface MABArm {
  id: string
  name: string
  configuration: any
  pulls: number
  rewards: number
  averageReward: number
}

export interface MABContext {
  userId?: string
  sessionId?: string
  timestamp: number
  userFeatures?: Record<string, any>
  deviceType?: string
  location?: string
  timeOfDay?: number
}

export interface MABResult {
  selectedArm: string
  armName: string
  confidence: number
  algorithm: string
  context?: MABContext
}

export interface MABStats {
  totalPulls: number
  totalRewards: number
  averageReward: number
  bestArm: string
  confidence: 'alta' | 'media' | 'baja'
  regret: number
}

// Base class for all MAB algorithms
export abstract class MABAlgorithm {
  protected arms: MABArm[]
  protected totalPulls: number = 0
  protected totalRewards: number = 0
  protected algorithmName: string

  constructor(arms: MABArm[], algorithmName: string) {
    this.arms = arms.map(arm => ({
      ...arm,
      pulls: 0,
      rewards: 0,
      averageReward: 0
    }))
    this.algorithmName = algorithmName
  }

  abstract selectArm(context?: MABContext): MABResult
  abstract updateReward(armId: string, reward: number, context?: MABContext): void

  getStats(): MABStats {
    const bestArm = this.arms.reduce((best, current) => 
      current.averageReward > best.averageReward ? current : best
    )

    const totalPossibleReward = this.totalPulls * 1.0 // Assuming max reward is 1
    const regret = totalPossibleReward - this.totalRewards

    let confidence: 'alta' | 'media' | 'baja' = 'baja'
    if (this.totalPulls > 1000) confidence = 'alta'
    else if (this.totalPulls > 100) confidence = 'media'

    return {
      totalPulls: this.totalPulls,
      totalRewards: this.totalRewards,
      averageReward: this.totalPulls > 0 ? this.totalRewards / this.totalPulls : 0,
      bestArm: bestArm.id,
      confidence,
      regret
    }
  }

  getArms(): MABArm[] {
    return [...this.arms]
  }
}

// Epsilon-Greedy Algorithm
export class EpsilonGreedy extends MABAlgorithm {
  private epsilon: number
  private decayRate: number

  constructor(arms: MABArm[], epsilon: number = 0.1, decayRate: number = 0.99) {
    super(arms, 'Epsilon-Greedy')
    this.epsilon = epsilon
    this.decayRate = decayRate
  }

  selectArm(context?: MABContext): MABResult {
    const shouldExplore = Math.random() < this.epsilon
    
    let selectedArm: MABArm
    
    if (shouldExplore || this.arms.every(arm => arm.pulls === 0)) {
      // Explore: select random arm
      const unexploredArms = this.arms.filter(arm => arm.pulls === 0)
      if (unexploredArms.length > 0) {
        selectedArm = unexploredArms[Math.floor(Math.random() * unexploredArms.length)]
      } else {
        selectedArm = this.arms[Math.floor(Math.random() * this.arms.length)]
      }
    } else {
      // Exploit: select best arm
      selectedArm = this.arms.reduce((best, current) => 
        current.averageReward > best.averageReward ? current : best
      )
    }

    // Decay epsilon
    this.epsilon *= this.decayRate

    return {
      selectedArm: selectedArm.id,
      armName: selectedArm.name,
      confidence: this.calculateConfidence(selectedArm),
      algorithm: this.algorithmName,
      context
    }
  }

  updateReward(armId: string, reward: number, context?: MABContext): void {
    const arm = this.arms.find(a => a.id === armId)
    if (!arm) return

    arm.pulls++
    arm.rewards += reward
    arm.averageReward = arm.rewards / arm.pulls

    this.totalPulls++
    this.totalRewards += reward
  }

  private calculateConfidence(arm: MABArm): number {
    if (arm.pulls === 0) return 0
    // Simple confidence based on number of pulls
    return Math.min(1, arm.pulls / 100)
  }
}

// Upper Confidence Bound (UCB) Algorithm
export class UpperConfidenceBound extends MABAlgorithm {
  private confidenceLevel: number

  constructor(arms: MABArm[], confidenceLevel: number = 2.0) {
    super(arms, 'Upper Confidence Bound')
    this.confidenceLevel = confidenceLevel
  }

  selectArm(context?: MABContext): MABResult {
    let selectedArm: MABArm

    // If any arm hasn't been pulled, select it
    const unexploredArms = this.arms.filter(arm => arm.pulls === 0)
    if (unexploredArms.length > 0) {
      selectedArm = unexploredArms[0]
    } else {
      // Calculate UCB values for all arms
      const ucbValues = this.arms.map(arm => {
        const confidenceInterval = this.confidenceLevel * 
          Math.sqrt(Math.log(this.totalPulls) / arm.pulls)
        return arm.averageReward + confidenceInterval
      })

      const bestIndex = ucbValues.indexOf(Math.max(...ucbValues))
      selectedArm = this.arms[bestIndex]
    }

    return {
      selectedArm: selectedArm.id,
      armName: selectedArm.name,
      confidence: this.calculateConfidence(selectedArm),
      algorithm: this.algorithmName,
      context
    }
  }

  updateReward(armId: string, reward: number, context?: MABContext): void {
    const arm = this.arms.find(a => a.id === armId)
    if (!arm) return

    arm.pulls++
    arm.rewards += reward
    arm.averageReward = arm.rewards / arm.pulls

    this.totalPulls++
    this.totalRewards += reward
  }

  private calculateConfidence(arm: MABArm): number {
    if (arm.pulls === 0) return 0
    const confidenceInterval = this.confidenceLevel * 
      Math.sqrt(Math.log(this.totalPulls) / arm.pulls)
    return Math.min(1, confidenceInterval)
  }
}

// Thompson Sampling Algorithm
export class ThompsonSampling extends MABAlgorithm {
  private alpha: number[]
  private beta: number[]

  constructor(arms: MABArm[], priorAlpha: number = 1, priorBeta: number = 1) {
    super(arms, 'Thompson Sampling')
    this.alpha = new Array(arms.length).fill(priorAlpha)
    this.beta = new Array(arms.length).fill(priorBeta)
  }

  selectArm(context?: MABContext): MABResult {
    // Sample from Beta distribution for each arm
    const samples = this.arms.map((arm, index) => {
      const alpha = this.alpha[index]
      const beta = this.beta[index]
      return this.sampleBeta(alpha, beta)
    })

    const bestIndex = samples.indexOf(Math.max(...samples))
    const selectedArm = this.arms[bestIndex]

    return {
      selectedArm: selectedArm.id,
      armName: selectedArm.name,
      confidence: this.calculateConfidence(selectedArm, bestIndex),
      algorithm: this.algorithmName,
      context
    }
  }

  updateReward(armId: string, reward: number, context?: MABContext): void {
    const armIndex = this.arms.findIndex(a => a.id === armId)
    if (armIndex === -1) return

    const arm = this.arms[armIndex]
    arm.pulls++
    arm.rewards += reward
    arm.averageReward = arm.rewards / arm.pulls

    // Update Beta distribution parameters
    if (reward > 0) {
      this.alpha[armIndex]++
    } else {
      this.beta[armIndex]++
    }

    this.totalPulls++
    this.totalRewards += reward
  }

  private sampleBeta(alpha: number, beta: number): number {
    // Simplified Beta sampling using Gamma distribution
    const gamma1 = this.sampleGamma(alpha, 1)
    const gamma2 = this.sampleGamma(beta, 1)
    return gamma1 / (gamma1 + gamma2)
  }

  private sampleGamma(shape: number, scale: number): number {
    // Simplified Gamma sampling (for demonstration)
    // In production, use a proper Gamma distribution library
    let sum = 0
    for (let i = 0; i < shape; i++) {
      sum -= Math.log(Math.random())
    }
    return sum * scale
  }

  private calculateConfidence(arm: MABArm, armIndex: number): number {
    if (arm.pulls === 0) return 0
    const alpha = this.alpha[armIndex]
    const beta = this.beta[armIndex]
    const variance = (alpha * beta) / ((alpha + beta) ** 2 * (alpha + beta + 1))
    return Math.min(1, 1 - variance)
  }
}

// Contextual Bandit using Linear UCB
export class ContextualBandit extends MABAlgorithm {
  private numFeatures: number
  private alpha: number
  private A: number[][][] // Covariance matrices for each arm
  private b: number[][] // Reward vectors for each arm
  private theta: number[][] // Parameter vectors for each arm

  constructor(arms: MABArm[], numFeatures: number, alpha: number = 2.0) {
    super(arms, 'Contextual Bandit (LinUCB)')
    this.numFeatures = numFeatures
    this.alpha = alpha
    this.initializeMatrices()
  }

  private initializeMatrices(): void {
    this.A = []
    this.b = []
    this.theta = []

    for (let i = 0; i < this.arms.length; i++) {
      // Initialize A as identity matrix
      this.A[i] = Array(this.numFeatures).fill(null).map(() => 
        Array(this.numFeatures).fill(0)
      )
      for (let j = 0; j < this.numFeatures; j++) {
        this.A[i][j][j] = 1
      }

      // Initialize b as zero vector
      this.b[i] = Array(this.numFeatures).fill(0)
      this.theta[i] = Array(this.numFeatures).fill(0)
    }
  }

  selectArm(context?: MABContext): MABResult {
    if (!context) {
      // Fallback to regular UCB if no context
      const ucb = new UpperConfidenceBound(this.arms)
      return ucb.selectArm()
    }

    const features = this.extractFeatures(context)
    let selectedArm: MABArm
    let maxUCB = -Infinity

    for (let i = 0; i < this.arms.length; i++) {
      const arm = this.arms[i]
      
      if (arm.pulls === 0) {
        // Select unexplored arm
        selectedArm = arm
        break
      }

      // Calculate UCB value
      const AInv = this.matrixInverse(this.A[i])
      const theta = this.matrixVectorMultiply(AInv, this.b[i])
      const ucbValue = this.dotProduct(theta, features) + 
        this.alpha * Math.sqrt(this.quadraticForm(features, AInv))

      if (ucbValue > maxUCB) {
        maxUCB = ucbValue
        selectedArm = arm
      }
    }

    return {
      selectedArm: selectedArm!.id,
      armName: selectedArm!.name,
      confidence: this.calculateConfidence(selectedArm!),
      algorithm: this.algorithmName,
      context
    }
  }

  updateReward(armId: string, reward: number, context?: MABContext): void {
    const armIndex = this.arms.findIndex(a => a.id === armId)
    if (armIndex === -1) return

    const arm = this.arms[armIndex]
    arm.pulls++
    arm.rewards += reward
    arm.averageReward = arm.rewards / arm.pulls

    if (context) {
      const features = this.extractFeatures(context)
      
      // Update A matrix
      for (let i = 0; i < this.numFeatures; i++) {
        for (let j = 0; j < this.numFeatures; j++) {
          this.A[armIndex][i][j] += features[i] * features[j]
        }
      }

      // Update b vector
      for (let i = 0; i < this.numFeatures; i++) {
        this.b[armIndex][i] += reward * features[i]
      }
    }

    this.totalPulls++
    this.totalRewards += reward
  }

  private extractFeatures(context: MABContext): number[] {
    // Convert context to feature vector
    const features = Array(this.numFeatures).fill(0)
    
    // Simple feature extraction
    if (context.userId) {
      features[0] = 1 // User presence
    }
    if (context.deviceType === 'mobile') {
      features[1] = 1
    }
    if (context.timeOfDay) {
      features[2] = context.timeOfDay / 24 // Normalize to [0,1]
    }
    if (context.location) {
      features[3] = 1 // Location presence
    }

    return features
  }

  private matrixInverse(matrix: number[][]): number[][] {
    // Simplified matrix inverse (for demonstration)
    // In production, use a proper linear algebra library
    const n = matrix.length
    const identity = Array(n).fill(null).map(() => Array(n).fill(0))
    for (let i = 0; i < n; i++) {
      identity[i][i] = 1
    }
    return identity // Simplified - return identity for now
  }

  private matrixVectorMultiply(matrix: number[][], vector: number[]): number[] {
    return matrix.map(row => this.dotProduct(row, vector))
  }

  private dotProduct(a: number[], b: number[]): number {
    return a.reduce((sum, val, i) => sum + val * b[i], 0)
  }

  private quadraticForm(vector: number[], matrix: number[][]): number {
    const result = this.matrixVectorMultiply(matrix, vector)
    return this.dotProduct(vector, result)
  }

  private calculateConfidence(arm: MABArm): number {
    if (arm.pulls === 0) return 0
    return Math.min(1, arm.pulls / 100)
  }
}

// Factory function to create MAB algorithms
export function createMABAlgorithm(
  type: 'epsilon-greedy' | 'ucb' | 'thompson' | 'contextual',
  arms: MABArm[],
  options: any = {}
): MABAlgorithm {
  switch (type) {
    case 'epsilon-greedy':
      return new EpsilonGreedy(arms, options.epsilon, options.decayRate)
    case 'ucb':
      return new UpperConfidenceBound(arms, options.confidenceLevel)
    case 'thompson':
      return new ThompsonSampling(arms, options.priorAlpha, options.priorBeta)
    case 'contextual':
      return new ContextualBandit(arms, options.numFeatures, options.alpha)
    default:
      throw new Error(`Unknown MAB algorithm type: ${type}`)
  }
}

