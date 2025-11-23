/**
 * Simple logging service for Vale Chronicles
 * 
 * This replaces direct console.* calls throughout the app
 * In production, logs can be sent to external services
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: unknown;
  timestamp: Date;
  context?: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV !== 'production';
  private context?: string;

  constructor(context?: string) {
    this.context = context;
  }

  private log(level: LogLevel, message: string, data?: unknown): void {
    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date(),
      context: this.context,
    };

    // In development, log to console
    if (this.isDevelopment) {
      const consoleMethod = entry.level === 'error' ? 'error' : entry.level === 'warn' ? 'warn' : 'log';
      const prefix = entry.context ? `[${entry.context}]` : '';

      if (entry.data !== undefined) {
        console[consoleMethod](`${prefix} ${entry.message}`, entry.data);
      } else {
        console[consoleMethod](`${prefix} ${entry.message}`);
      }
    }

    // In production, you could send to external service
    // Example: sendToLoggingService(entry);
  }

  debug(message: string, data?: unknown): void {
    this.log('debug', message, data);
  }

  info(message: string, data?: unknown): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: unknown): void {
    this.log('warn', message, data);
  }

  error(message: string, data?: unknown): void {
    this.log('error', message, data);
  }

  /**
   * Create a child logger with additional context
   */
  child(context: string): Logger {
    const childContext = this.context ? `${this.context}.${context}` : context;
    return new Logger(childContext);
  }
}

// Export singleton instance
export const logger = new Logger();

// Export factory for component-specific loggers
export function createLogger(context: string): Logger {
  return new Logger(context);
}