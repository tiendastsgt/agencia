/**
 * Sistema de Logging Estructurado
 * Mejores prácticas para logging y monitoreo
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  context?: Record<string, any>
  error?: Error
  service?: string
  userId?: string
  requestId?: string
}

class Logger {
  private static instance: Logger
  private logLevel: LogLevel
  private enableConsole: boolean
  private enableRemote: boolean

  private constructor() {
    this.logLevel = LogLevel.INFO
    this.enableConsole = true
    this.enableRemote = false
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  public configure(level: LogLevel, enableConsole: boolean = true, enableRemote: boolean = false): void {
    this.logLevel = level
    this.enableConsole = enableConsole
    this.enableRemote = enableRemote
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel
  }

  private formatMessage(entry: LogEntry): string {
    const timestamp = entry.timestamp
    const level = LogLevel[entry.level]
    const service = entry.service ? `[${entry.service}]` : ''
    const context = entry.context ? ` ${JSON.stringify(entry.context)}` : ''
    const error = entry.error ? `\nError: ${entry.error.message}\nStack: ${entry.error.stack}` : ''
    
    return `${timestamp} ${level}${service} ${entry.message}${context}${error}`
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error, service?: string): void {
    if (!this.shouldLog(level)) return

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error,
      service
    }

    if (this.enableConsole) {
      const formattedMessage = this.formatMessage(entry)
      
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

    if (this.enableRemote) {
      this.sendToRemote(entry)
    }
  }

  private async sendToRemote(entry: LogEntry): Promise<void> {
    try {
      // Implementar envío a servicio de logging remoto
      // Por ejemplo: Sentry, LogRocket, etc.
    } catch (error) {
      console.error('Failed to send log to remote service:', error)
    }
  }

  public debug(message: string, context?: Record<string, any>, service?: string): void {
    this.log(LogLevel.DEBUG, message, context, undefined, service)
  }

  public info(message: string, context?: Record<string, any>, service?: string): void {
    this.log(LogLevel.INFO, message, context, undefined, service)
  }

  public warn(message: string, context?: Record<string, any>, service?: string): void {
    this.log(LogLevel.WARN, message, context, undefined, service)
  }

  public error(message: string, error?: Error, context?: Record<string, any>, service?: string): void {
    this.log(LogLevel.ERROR, message, context, error, service)
  }
}

export const logger = Logger.getInstance()
export default logger




