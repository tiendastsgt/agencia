/**
 * Sistema de logging profesional para MarketPro GT
 * 
 * Este módulo proporciona un sistema de logging estructurado que puede ser
 * configurado para diferentes entornos (desarrollo, producción) y niveles de verbosidad.
 * 
 * Características:
 * - Niveles de logging configurables (DEBUG, INFO, WARN, ERROR)
 * - Configuración por entorno (desarrollo vs producción)
 * - Posibilidad de envío remoto de logs
 * - Formateo estructurado con timestamps
 * - Fallback silencioso para evitar loops de error
 * 
 * @fileoverview Sistema de logging profesional
 * @version 2.4.0
 * @since 2025-01-27
 */

/**
 * Niveles de logging disponibles
 * @enum {number}
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4
}

/**
 * Configuración del sistema de logging
 * @interface LogConfig
 */
interface LogConfig {
  level: LogLevel
  enableConsole: boolean
  enableRemote: boolean
  remoteEndpoint?: string
}

/**
 * Clase principal del sistema de logging
 * 
 * Proporciona métodos para logging estructurado con diferentes niveles
 * y configuración por entorno.
 * 
 * @class Logger
 */
class Logger {
  private config: LogConfig

  constructor() {
    this.config = {
      level: import.meta.env.NODE_ENV === 'production' ? LogLevel.WARN : LogLevel.DEBUG,
      enableConsole: import.meta.env.NODE_ENV !== 'production',
      enableRemote: false
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level
  }

  private formatMessage(level: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString()
    const baseMessage = `[${timestamp}] ${level}: ${message}`
    
    if (data) {
      return `${baseMessage} ${JSON.stringify(data)}`
    }
    
    return baseMessage
  }

  private log(level: LogLevel, levelName: string, message: string, data?: any): void {
    if (!this.shouldLog(level)) return

    const formattedMessage = this.formatMessage(levelName, message, data)

    if (this.config.enableConsole) {
      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage)
          break
        case LogLevel.INFO:
          console.info(formattedMessage)
          break
        case LogLevel.WARN:
          console.warn(formattedMessage)
          break
        case LogLevel.ERROR:
          console.error(formattedMessage)
          break
      }
    }

    // En producción, podrías enviar logs a un servicio remoto
    if (this.config.enableRemote && this.config.remoteEndpoint) {
      this.sendToRemote(level, message, data)
    }
  }

  private async sendToRemote(level: LogLevel, message: string, data?: any): Promise<void> {
    try {
      await fetch(this.config.remoteEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level,
          message,
          data,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      })
    } catch (error) {
      // Fallback silencioso para evitar loops de error
    }
  }

  /**
   * Registra un mensaje de debug
   * @param {string} message - Mensaje a registrar
   * @param {any} [data] - Datos adicionales opcionales
   */
  debug(message: string, data?: any): void {
    this.log(LogLevel.DEBUG, 'DEBUG', message, data)
  }

  /**
   * Registra un mensaje informativo
   * @param {string} message - Mensaje a registrar
   * @param {any} [data] - Datos adicionales opcionales
   */
  info(message: string, data?: any): void {
    this.log(LogLevel.INFO, 'INFO', message, data)
  }

  /**
   * Registra un mensaje de advertencia
   * @param {string} message - Mensaje a registrar
   * @param {any} [data] - Datos adicionales opcionales
   */
  warn(message: string, data?: any): void {
    this.log(LogLevel.WARN, 'WARN', message, data)
  }

  /**
   * Registra un mensaje de error
   * @param {string} message - Mensaje a registrar
   * @param {any} [data] - Datos adicionales opcionales
   */
  error(message: string, data?: any): void {
    this.log(LogLevel.ERROR, 'ERROR', message, data)
  }

  /**
   * Configura el logger con nuevas opciones
   * @param {Partial<LogConfig>} config - Configuración parcial a aplicar
   */
  configure(config: Partial<LogConfig>): void {
    this.config = { ...this.config, ...config }
  }
}

/**
 * Instancia singleton del logger
 * @type {Logger}
 */
export const logger = new Logger()

/**
 * Función de conveniencia para logging de debug
 * @param {string} message - Mensaje a registrar
 * @param {any} [data] - Datos adicionales opcionales
 */
export const logDebug = (message: string, data?: any) => logger.debug(message, data)

/**
 * Función de conveniencia para logging informativo
 * @param {string} message - Mensaje a registrar
 * @param {any} [data] - Datos adicionales opcionales
 */
export const logInfo = (message: string, data?: any) => logger.info(message, data)

/**
 * Función de conveniencia para logging de advertencia
 * @param {string} message - Mensaje a registrar
 * @param {any} [data] - Datos adicionales opcionales
 */
export const logWarn = (message: string, data?: any) => logger.warn(message, data)

/**
 * Función de conveniencia para logging de error
 * @param {string} message - Mensaje a registrar
 * @param {any} [data] - Datos adicionales opcionales
 */
export const logError = (message: string, data?: any) => logger.error(message, data)

