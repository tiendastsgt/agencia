/**
 * Sistema de Configuración Centralizado
 * Mejores prácticas para gestión de configuración
 */

import { getSimpleConfig, isAPIKeyConfigured } from './simple-config'

export interface AIServiceConfig {
  provider: 'gemini' | 'dalle3' | 'stability' | 'midjourney'
  apiKey: string
  baseUrl?: string
  timeout: number
  retryAttempts: number
  retryDelay: number
}

export interface InfographicConfig {
  defaultSize: '1024x1024' | '1024x1792' | '1792x1024'
  defaultQuality: 'standard' | 'hd'
  fallbackEnabled: boolean
  maxRetries: number
  timeout: number
}

export interface AppConfig {
  ai: {
    gemini: AIServiceConfig
    dalle3: AIServiceConfig
    stability: AIServiceConfig
    midjourney: AIServiceConfig
  }
  infographic: InfographicConfig
  logging: {
    level: 'debug' | 'info' | 'warn' | 'error'
    enableConsole: boolean
    enableRemote: boolean
  }
}

class ConfigManager {
  private static instance: ConfigManager
  private config: AppConfig

  private constructor() {
    this.config = this.loadConfig()
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager()
    }
    return ConfigManager.instance
  }

  private loadConfig(): AppConfig {
    return getSimpleConfig()
  }


  public getConfig(): AppConfig {
    return this.config
  }

  public getAIConfig(provider: keyof AppConfig['ai']): AIServiceConfig {
    return this.config.ai[provider]
  }

  public getInfographicConfig(): InfographicConfig {
    return this.config.infographic
  }

  public updateConfig(updates: Partial<AppConfig>): void {
    this.config = { ...this.config, ...updates }
  }
}

export const configManager = ConfigManager.getInstance()
export default configManager
