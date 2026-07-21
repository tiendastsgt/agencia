import { supabase } from './supabase';

export interface GeneticAlgorithmConfig {
  id: string;
  name: string;
  populationSize: number;
  generations: number;
  mutationRate: number;
  crossoverRate: number;
  selectionMethod: 'tournament' | 'roulette' | 'rank';
  fitnessFunction: string;
  parameters: OptimizationParameter[];
  status: 'draft' | 'running' | 'completed' | 'paused';
  results?: GeneticAlgorithmResults;
}

export interface OptimizationParameter {
  name: string;
  type: 'integer' | 'float' | 'boolean' | 'categorical';
  min?: number;
  max?: number;
  step?: number;
  categories?: string[];
  currentValue: any;
}

export interface GeneticAlgorithmResults {
  bestIndividual: Individual;
  bestFitness: number;
  averageFitness: number;
  convergenceGeneration: number;
  executionTime: number;
  fitnessHistory: number[];
  parameterHistory: Record<string, any[]>;
}

export interface Individual {
  id: string;
  parameters: Record<string, any>;
  fitness: number;
  generation: number;
  parentIds?: string[];
}

export interface BayesianOptimizationConfig {
  id: string;
  name: string;
  objectiveFunction: string;
  parameters: OptimizationParameter[];
  acquisitionFunction: 'ei' | 'pi' | 'ucb';
  nInitialPoints: number;
  nIterations: number;
  status: 'draft' | 'running' | 'completed' | 'paused';
  results?: BayesianOptimizationResults;
}

export interface BayesianOptimizationResults {
  bestParameters: Record<string, any>;
  bestObjective: number;
  nEvaluations: number;
  executionTime: number;
  convergenceHistory: number[];
  parameterHistory: Record<string, any[]>;
  uncertaintyHistory: number[];
}

export interface EvoPromptConfig {
  id: string;
  name: string;
  basePrompt: string;
  mutationOperators: string[];
  fitnessMetrics: string[];
  populationSize: number;
  generations: number;
  status: 'draft' | 'running' | 'completed' | 'paused';
  results?: EvoPromptResults;
}

export interface EvoPromptResults {
  bestPrompt: string;
  bestFitness: number;
  promptHistory: string[];
  fitnessHistory: number[];
  improvementRate: number;
}

export interface PromptVersion {
  id: string;
  version: string;
  prompt: string;
  performance: Record<string, number>;
  createdAt: Date;
  isActive: boolean;
}

export class AdvancedOptimizationService {
  private static instance: AdvancedOptimizationService;
  
  public static getInstance(): AdvancedOptimizationService {
    if (!AdvancedOptimizationService.instance) {
      AdvancedOptimizationService.instance = new AdvancedOptimizationService();
    }
    return AdvancedOptimizationService.instance;
  }

  /**
   * Configura y ejecuta un algoritmo genético
   */
  async runGeneticAlgorithm(config: GeneticAlgorithmConfig): Promise<GeneticAlgorithmResults> {
    try {
      const startTime = Date.now();
      
      // Inicializar población
      let population = this.initializePopulation(config);
      const fitnessHistory: number[] = [];
      const parameterHistory: Record<string, any[]> = {};

      // Configurar historial de parámetros
      config.parameters.forEach(param => {
        parameterHistory[param.name] = [];
      });

      let bestIndividual = population[0];
      let bestFitness = bestIndividual.fitness;

      for (let generation = 0; generation < config.generations; generation++) {
        // Evaluar fitness de la población
        population = await this.evaluatePopulation(population, config.fitnessFunction);

        // Encontrar el mejor individuo
        const currentBest = population.reduce((best, individual) => 
          individual.fitness > best.fitness ? individual : best
        );

        if (currentBest.fitness > bestFitness) {
          bestIndividual = currentBest;
          bestFitness = currentBest.fitness;
        }

        // Registrar historial
        fitnessHistory.push(bestFitness);
        config.parameters.forEach(param => {
          parameterHistory[param.name].push(bestIndividual.parameters[param.name]);
        });

        // Verificar convergencia
        if (this.hasConverged(fitnessHistory, generation)) {
          break;
        }

        // Seleccionar padres
        const parents = this.selectParents(population, config.selectionMethod);

        // Crear nueva generación
        population = this.createNewGeneration(parents, config);
      }

      const executionTime = Date.now() - startTime;
      const averageFitness = population.reduce((sum, ind) => sum + ind.fitness, 0) / population.length;

      const results: GeneticAlgorithmResults = {
        bestIndividual,
        bestFitness,
        averageFitness,
        convergenceGeneration: fitnessHistory.length,
        executionTime,
        fitnessHistory,
        parameterHistory
      };

      // Guardar resultados
      await this.saveGeneticAlgorithmResults(config.id, results);

      return results;
    } catch (error) {
      console.error('Error running genetic algorithm:', error);
      throw error;
    }
  }

  /**
   * Configura y ejecuta optimización bayesiana
   */
  async runBayesianOptimization(config: BayesianOptimizationConfig): Promise<BayesianOptimizationResults> {
    try {
      const startTime = Date.now();
      
      // Inicializar puntos
      const initialPoints = this.generateInitialPoints(config);
      const evaluatedPoints: Array<{ parameters: Record<string, any>; objective: number }> = [];
      
      const convergenceHistory: number[] = [];
      const parameterHistory: Record<string, any[]> = {};
      const uncertaintyHistory: number[] = [];

      // Configurar historial de parámetros
      config.parameters.forEach(param => {
        parameterHistory[param.name] = [];
      });

      // Evaluar puntos iniciales
      for (const point of initialPoints) {
        const objective = await this.evaluateObjective(point, config.objectiveFunction);
        evaluatedPoints.push({ parameters: point, objective });
      }

      let bestObjective = Math.max(...evaluatedPoints.map(p => p.objective));
      let bestParameters = evaluatedPoints.find(p => p.objective === bestObjective)?.parameters || {};

      // Iteraciones de optimización
      for (let iteration = 0; iteration < config.nIterations; iteration++) {
        // Encontrar siguiente punto a evaluar
        const nextPoint = this.acquireNextPoint(evaluatedPoints, config);
        
        // Evaluar nuevo punto
        const objective = await this.evaluateObjective(nextPoint, config.objectiveFunction);
        evaluatedPoints.push({ parameters: nextPoint, objective });

        // Actualizar mejor resultado
        if (objective > bestObjective) {
          bestObjective = objective;
          bestParameters = nextPoint;
        }

        // Registrar historial
        convergenceHistory.push(bestObjective);
        config.parameters.forEach(param => {
          parameterHistory[param.name].push(bestParameters[param.name]);
        });

        // Calcular incertidumbre (simulada)
        const uncertainty = this.calculateUncertainty(evaluatedPoints);
        uncertaintyHistory.push(uncertainty);
      }

      const executionTime = Date.now() - startTime;

      const results: BayesianOptimizationResults = {
        bestParameters,
        bestObjective,
        nEvaluations: evaluatedPoints.length,
        executionTime,
        convergenceHistory,
        parameterHistory,
        uncertaintyHistory
      };

      // Guardar resultados
      await this.saveBayesianOptimizationResults(config.id, results);

      return results;
    } catch (error) {
      console.error('Error running Bayesian optimization:', error);
      throw error;
    }
  }

  /**
   * Implementa EvoPrompt para optimización de prompts
   */
  async runEvoPrompt(config: EvoPromptConfig): Promise<EvoPromptResults> {
    try {
      const startTime = Date.now();
      
      // Inicializar población de prompts
      let population = this.initializePromptPopulation(config);
      const fitnessHistory: number[] = [];
      const promptHistory: string[] = [];

      let bestPrompt = config.basePrompt;
      let bestFitness = 0;

      for (let generation = 0; generation < config.generations; generation++) {
        // Evaluar fitness de cada prompt
        for (const individual of population) {
          individual.fitness = await this.evaluatePromptFitness(individual.prompt, config.fitnessMetrics);
        }

        // Encontrar el mejor prompt
        const currentBest = population.reduce((best, individual) => 
          individual.fitness > best.fitness ? individual : best
        );

        if (currentBest.fitness > bestFitness) {
          bestPrompt = currentBest.prompt;
          bestFitness = currentBest.fitness;
        }

        // Registrar historial
        fitnessHistory.push(bestFitness);
        promptHistory.push(bestPrompt);

        // Crear nueva generación
        population = this.evolvePromptPopulation(population, config);
      }

      const executionTime = Date.now() - startTime;
      const improvementRate = this.calculateImprovementRate(fitnessHistory);

      const results: EvoPromptResults = {
        bestPrompt,
        bestFitness,
        promptHistory,
        fitnessHistory,
        improvementRate
      };

      // Guardar resultados
      await this.saveEvoPromptResults(config.id, results);

      return results;
    } catch (error) {
      console.error('Error running EvoPrompt:', error);
      throw error;
    }
  }

  /**
   * Gestiona versionado de prompts
   */
  async createPromptVersion(
    basePrompt: string,
    performance: Record<string, number>
  ): Promise<PromptVersion> {
    try {
      const version = `v${Date.now()}`;
      
      const versionData = {
        version,
        prompt: basePrompt,
        performance,
        is_active: false
      };

      const { data, error } = await supabase
        .from('prompt_versions')
        .insert(versionData)
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        version: data.version,
        prompt: data.prompt,
        performance: data.performance,
        createdAt: new Date(data.created_at),
        isActive: data.is_active
      };
    } catch (error) {
      console.error('Error creating prompt version:', error);
      throw error;
    }
  }

  /**
   * Compara versiones de prompts y selecciona la mejor
   */
  async comparePromptVersions(versions: PromptVersion[]): Promise<{
    bestVersion: PromptVersion;
    comparison: Array<{
      version: string;
      overallScore: number;
      metrics: Record<string, number>;
    }>;
  }> {
    try {
      const comparison = versions.map(version => {
        const overallScore = this.calculateOverallScore(version.performance);
        return {
          version: version.version,
          overallScore,
          metrics: version.performance
        };
      });

      const bestVersion = versions.reduce((best, version) => {
        const bestScore = this.calculateOverallScore(best.performance);
        const currentScore = this.calculateOverallScore(version.performance);
        return currentScore > bestScore ? version : best;
      });

      return { bestVersion, comparison };
    } catch (error) {
      console.error('Error comparing prompt versions:', error);
      throw error;
    }
  }

  // Métodos privados para algoritmos genéticos

  private initializePopulation(config: GeneticAlgorithmConfig): Individual[] {
    const population: Individual[] = [];
    
    for (let i = 0; i < config.populationSize; i++) {
      const parameters: Record<string, any> = {};
      
      config.parameters.forEach(param => {
        switch (param.type) {
          case 'integer':
            parameters[param.name] = Math.floor(
              Math.random() * (param.max! - param.min! + 1) + param.min!
            );
            break;
          case 'float':
            parameters[param.name] = Math.random() * (param.max! - param.min!) + param.min!;
            break;
          case 'boolean':
            parameters[param.name] = Math.random() > 0.5;
            break;
          case 'categorical':
            parameters[param.name] = param.categories![
              Math.floor(Math.random() * param.categories!.length)
            ];
            break;
        }
      });

      population.push({
        id: `ind_${i}`,
        parameters,
        fitness: 0,
        generation: 0
      });
    }

    return population;
  }

  private async evaluatePopulation(
    population: Individual[],
    fitnessFunction: string
  ): Promise<Individual[]> {
    for (const individual of population) {
      individual.fitness = await this.evaluateFitness(individual.parameters, fitnessFunction);
    }
    return population;
  }

  private async evaluateFitness(parameters: Record<string, any>, fitnessFunction: string): Promise<number> {
    // Simular evaluación de fitness basada en la función especificada
    switch (fitnessFunction) {
      case 'engagement_rate':
        return Math.random() * 0.1 + 0.05; // 5-15%
      case 'conversion_rate':
        return Math.random() * 0.05 + 0.02; // 2-7%
      case 'click_through_rate':
        return Math.random() * 0.08 + 0.03; // 3-11%
      default:
        return Math.random();
    }
  }

  private selectParents(population: Individual[], method: string): Individual[] {
    switch (method) {
      case 'tournament':
        return this.tournamentSelection(population);
      case 'roulette':
        return this.rouletteSelection(population);
      case 'rank':
        return this.rankSelection(population);
      default:
        return this.tournamentSelection(population);
    }
  }

  private tournamentSelection(population: Individual[]): Individual[] {
    const parents: Individual[] = [];
    const tournamentSize = 3;

    for (let i = 0; i < population.length; i++) {
      const tournament = [];
      for (let j = 0; j < tournamentSize; j++) {
        const randomIndex = Math.floor(Math.random() * population.length);
        tournament.push(population[randomIndex]);
      }
      const winner = tournament.reduce((best, individual) => 
        individual.fitness > best.fitness ? individual : best
      );
      parents.push(winner);
    }

    return parents;
  }

  private rouletteSelection(population: Individual[]): Individual[] {
    const totalFitness = population.reduce((sum, ind) => sum + ind.fitness, 0);
    const parents: Individual[] = [];

    for (let i = 0; i < population.length; i++) {
      let random = Math.random() * totalFitness;
      let currentSum = 0;

      for (const individual of population) {
        currentSum += individual.fitness;
        if (currentSum >= random) {
          parents.push(individual);
          break;
        }
      }
    }

    return parents;
  }

  private rankSelection(population: Individual[]): Individual[] {
    const sortedPopulation = [...population].sort((a, b) => b.fitness - a.fitness);
    const parents: Individual[] = [];

    for (let i = 0; i < population.length; i++) {
      const rank = Math.floor(Math.random() * sortedPopulation.length);
      parents.push(sortedPopulation[rank]);
    }

    return parents;
  }

  private createNewGeneration(parents: Individual[], config: GeneticAlgorithmConfig): Individual[] {
    const newGeneration: Individual[] = [];

    for (let i = 0; i < parents.length; i += 2) {
      const parent1 = parents[i];
      const parent2 = parents[i + 1] || parents[0];

      // Crossover
      const [child1, child2] = this.crossover(parent1, parent2, config.crossoverRate);

      // Mutación
      const mutatedChild1 = this.mutate(child1, config.mutationRate, config.parameters);
      const mutatedChild2 = this.mutate(child2, config.mutationRate, config.parameters);

      newGeneration.push(mutatedChild1, mutatedChild2);
    }

    return newGeneration.slice(0, config.populationSize);
  }

  private crossover(parent1: Individual, parent2: Individual, crossoverRate: number): [Individual, Individual] {
    if (Math.random() > crossoverRate) {
      return [parent1, parent2];
    }

    const child1: Individual = {
      id: `child_${Date.now()}_1`,
      parameters: { ...parent1.parameters },
      fitness: 0,
      generation: parent1.generation + 1,
      parentIds: [parent1.id, parent2.id]
    };

    const child2: Individual = {
      id: `child_${Date.now()}_2`,
      parameters: { ...parent2.parameters },
      fitness: 0,
      generation: parent2.generation + 1,
      parentIds: [parent1.id, parent2.id]
    };

    // Crossover de un punto
    const paramNames = Object.keys(parent1.parameters);
    const crossoverPoint = Math.floor(Math.random() * paramNames.length);

    for (let i = crossoverPoint; i < paramNames.length; i++) {
      const paramName = paramNames[i];
      child1.parameters[paramName] = parent2.parameters[paramName];
      child2.parameters[paramName] = parent1.parameters[paramName];
    }

    return [child1, child2];
  }

  private mutate(
    individual: Individual,
    mutationRate: number,
    parameters: OptimizationParameter[]
  ): Individual {
    const mutated = { ...individual };

    parameters.forEach(param => {
      if (Math.random() < mutationRate) {
        switch (param.type) {
          case 'integer':
            mutated.parameters[param.name] = Math.floor(
              Math.random() * (param.max! - param.min! + 1) + param.min!
            );
            break;
          case 'float':
            mutated.parameters[param.name] = Math.random() * (param.max! - param.min!) + param.min!;
            break;
          case 'boolean':
            mutated.parameters[param.name] = !mutated.parameters[param.name];
            break;
          case 'categorical':
            mutated.parameters[param.name] = param.categories![
              Math.floor(Math.random() * param.categories!.length)
            ];
            break;
        }
      }
    });

    return mutated;
  }

  private hasConverged(fitnessHistory: number[], generation: number): boolean {
    if (generation < 10) return false;
    
    const recentGenerations = fitnessHistory.slice(-10);
    const improvement = Math.max(...recentGenerations) - Math.min(...recentGenerations);
    
    return improvement < 0.001; // Convergencia si mejora menos del 0.1%
  }

  // Métodos privados para optimización bayesiana

  private generateInitialPoints(config: BayesianOptimizationConfig): Record<string, any>[] {
    const points: Record<string, any>[] = [];
    
    for (let i = 0; i < config.nInitialPoints; i++) {
      const point: Record<string, any> = {};
      
      config.parameters.forEach(param => {
        switch (param.type) {
          case 'integer':
            point[param.name] = Math.floor(
              Math.random() * (param.max! - param.min! + 1) + param.min!
            );
            break;
          case 'float':
            point[param.name] = Math.random() * (param.max! - param.min!) + param.min!;
            break;
          case 'boolean':
            point[param.name] = Math.random() > 0.5;
            break;
          case 'categorical':
            point[param.name] = param.categories![
              Math.floor(Math.random() * param.categories!.length)
            ];
            break;
        }
      });
      
      points.push(point);
    }
    
    return points;
  }

  private async evaluateObjective(
    parameters: Record<string, any>,
    objectiveFunction: string
  ): Promise<number> {
    // Simular evaluación de función objetivo
    switch (objectiveFunction) {
      case 'maximize_engagement':
        return Math.random() * 0.2 + 0.1; // 10-30%
      case 'maximize_conversions':
        return Math.random() * 0.1 + 0.05; // 5-15%
      case 'minimize_cost':
        return Math.random() * 100 + 50; // 50-150
      default:
        return Math.random();
    }
  }

  private acquireNextPoint(
    evaluatedPoints: Array<{ parameters: Record<string, any>; objective: number }>,
    config: BayesianOptimizationConfig
  ): Record<string, any> {
    // Simular adquisición de siguiente punto usando función de adquisición
    const bestObjective = Math.max(...evaluatedPoints.map(p => p.objective));
    
    // Generar punto candidato
    const candidate: Record<string, any> = {};
    config.parameters.forEach(param => {
      switch (param.type) {
        case 'integer':
          candidate[param.name] = Math.floor(
            Math.random() * (param.max! - param.min! + 1) + param.min!
          );
          break;
        case 'float':
          candidate[param.name] = Math.random() * (param.max! - param.min!) + param.min!;
          break;
        case 'boolean':
          candidate[param.name] = Math.random() > 0.5;
          break;
        case 'categorical':
          candidate[param.name] = param.categories![
            Math.floor(Math.random() * param.categories!.length)
          ];
          break;
      }
    });
    
    return candidate;
  }

  private calculateUncertainty(evaluatedPoints: Array<{ parameters: Record<string, any>; objective: number }>): number {
    // Simular cálculo de incertidumbre
    const objectives = evaluatedPoints.map(p => p.objective);
    const mean = objectives.reduce((sum, obj) => sum + obj, 0) / objectives.length;
    const variance = objectives.reduce((sum, obj) => sum + Math.pow(obj - mean, 2), 0) / objectives.length;
    
    return Math.sqrt(variance);
  }

  // Métodos privados para EvoPrompt

  private initializePromptPopulation(config: EvoPromptConfig): Array<{ prompt: string; fitness: number }> {
    const population: Array<{ prompt: string; fitness: number }> = [];
    
    // Agregar prompt base
    population.push({ prompt: config.basePrompt, fitness: 0 });
    
    // Generar variaciones del prompt base
    for (let i = 1; i < config.populationSize; i++) {
      const mutatedPrompt = this.mutatePrompt(config.basePrompt, config.mutationOperators);
      population.push({ prompt: mutatedPrompt, fitness: 0 });
    }
    
    return population;
  }

  private mutatePrompt(basePrompt: string, operators: string[]): string {
    let mutatedPrompt = basePrompt;
    
    operators.forEach(operator => {
      switch (operator) {
        case 'add_emojis':
          mutatedPrompt = this.addEmojis(mutatedPrompt);
          break;
        case 'add_urgency':
          mutatedPrompt = this.addUrgency(mutatedPrompt);
          break;
        case 'add_social_proof':
          mutatedPrompt = this.addSocialProof(mutatedPrompt);
          break;
        case 'shorten':
          mutatedPrompt = this.shortenPrompt(mutatedPrompt);
          break;
        case 'lengthen':
          mutatedPrompt = this.lengthenPrompt(mutatedPrompt);
          break;
      }
    });
    
    return mutatedPrompt;
  }

  private addEmojis(prompt: string): string {
    const emojis = ['🚀', '💡', '✨', '🎯', '🔥', '⭐', '💪', '🎉'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    return `${randomEmoji} ${prompt}`;
  }

  private addUrgency(prompt: string): string {
    const urgencyPhrases = ['¡Urgente!', 'Solo por tiempo limitado', '¡No te lo pierdas!'];
    const randomPhrase = urgencyPhrases[Math.floor(Math.random() * urgencyPhrases.length)];
    return `${randomPhrase} ${prompt}`;
  }

  private addSocialProof(prompt: string): string {
    const socialProofPhrases = ['Más de 10,000 clientes satisfechos', 'Recomendado por expertos', 'Probado y comprobado'];
    const randomPhrase = socialProofPhrases[Math.floor(Math.random() * socialProofPhrases.length)];
    return `${prompt} ${randomPhrase}`;
  }

  private shortenPrompt(prompt: string): string {
    const words = prompt.split(' ');
    return words.slice(0, Math.floor(words.length * 0.8)).join(' ');
  }

  private lengthenPrompt(prompt: string): string {
    const extensions = ['Descubre más', 'Aprende más', 'Explora las posibilidades'];
    const randomExtension = extensions[Math.floor(Math.random() * extensions.length)];
    return `${prompt} ${randomExtension}`;
  }

  private async evaluatePromptFitness(prompt: string, metrics: string[]): Promise<number> {
    // Simular evaluación de fitness del prompt
    let totalFitness = 0;
    
    metrics.forEach(metric => {
      switch (metric) {
        case 'clarity':
          totalFitness += Math.random() * 0.3 + 0.7; // 70-100%
          break;
        case 'engagement':
          totalFitness += Math.random() * 0.4 + 0.6; // 60-100%
          break;
        case 'conversion_potential':
          totalFitness += Math.random() * 0.5 + 0.5; // 50-100%
          break;
      }
    });
    
    return totalFitness / metrics.length;
  }

  private evolvePromptPopulation(
    population: Array<{ prompt: string; fitness: number }>,
    config: EvoPromptConfig
  ): Array<{ prompt: string; fitness: number }> {
    // Seleccionar los mejores prompts
    const sortedPopulation = [...population].sort((a, b) => b.fitness - a.fitness);
    const elite = sortedPopulation.slice(0, Math.floor(config.populationSize * 0.2));
    
    const newGeneration: Array<{ prompt: string; fitness: number }> = [...elite];
    
    // Generar nuevos prompts basados en los mejores
    while (newGeneration.length < config.populationSize) {
      const parent = elite[Math.floor(Math.random() * elite.length)];
      const child = this.mutatePrompt(parent.prompt, config.mutationOperators);
      newGeneration.push({ prompt: child, fitness: 0 });
    }
    
    return newGeneration;
  }

  private calculateImprovementRate(fitnessHistory: number[]): number {
    if (fitnessHistory.length < 2) return 0;
    
    const initialFitness = fitnessHistory[0];
    const finalFitness = fitnessHistory[fitnessHistory.length - 1];
    
    return (finalFitness - initialFitness) / initialFitness;
  }

  private calculateOverallScore(performance: Record<string, number>): number {
    const weights = {
      engagement_rate: 0.3,
      conversion_rate: 0.4,
      click_through_rate: 0.2,
      cost_per_acquisition: 0.1
    };
    
    let totalScore = 0;
    let totalWeight = 0;
    
    Object.entries(performance).forEach(([metric, value]) => {
      const weight = weights[metric as keyof typeof weights] || 0.1;
      totalScore += value * weight;
      totalWeight += weight;
    });
    
    return totalScore / totalWeight;
  }

  // Métodos de guardado

  private async saveGeneticAlgorithmResults(configId: string, results: GeneticAlgorithmResults): Promise<void> {
    try {
      await supabase
        .from('genetic_algorithm_results')
        .insert({
          config_id: configId,
          results,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error saving genetic algorithm results:', error);
    }
  }

  private async saveBayesianOptimizationResults(configId: string, results: BayesianOptimizationResults): Promise<void> {
    try {
      await supabase
        .from('bayesian_optimization_results')
        .insert({
          config_id: configId,
          results,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error saving Bayesian optimization results:', error);
    }
  }

  private async saveEvoPromptResults(configId: string, results: EvoPromptResults): Promise<void> {
    try {
      await supabase
        .from('evoprompt_results')
        .insert({
          config_id: configId,
          results,
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error saving EvoPrompt results:', error);
    }
  }
}

export const advancedOptimizationService = AdvancedOptimizationService.getInstance();
