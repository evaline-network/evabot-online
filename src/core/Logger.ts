import fs from 'node:fs';
import path from 'node:path';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
};

const LEVEL_COLORS: Record<LogLevel, string> = {
  [LogLevel.DEBUG]: '\x1b[90m',
  [LogLevel.INFO]: '\x1b[36m',
  [LogLevel.WARN]: '\x1b[33m',
  [LogLevel.ERROR]: '\x1b[31m\x1b[1m',
};

const RESET_COLOR = '\x1b[0m';

export class Logger {
  private static instance: Logger;
  private logFilePath: string | null = null;
  private minLevel: LogLevel = LogLevel.INFO;

  private constructor() {
    try {
      const logsDir = path.resolve(process.cwd(), 'logs');
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
      }
      this.logFilePath = path.join(logsDir, 'evabot.log');
    } catch {
      // In browser or non-filesystem environments, skip file logging
      this.logFilePath = null;
    }
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public setMinLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  private formatMessage(level: LogLevel, tag: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${LEVEL_NAMES[level]}] [${tag}] ${message}`;
  }

  private write(level: LogLevel, tag: string, message: string, meta?: any): void {
    if (level < this.minLevel) return;

    const formatted = this.formatMessage(level, tag, message);
    const color = LEVEL_COLORS[level] || '';

    // Console output
    if (meta !== undefined) {
      console.log(`${color}${formatted}${RESET_COLOR}`, meta);
    } else {
      console.log(`${color}${formatted}${RESET_COLOR}`);
    }

    // Persistent file output
    if (this.logFilePath) {
      try {
        const fileContent = meta !== undefined 
          ? `${formatted} ${JSON.stringify(meta)}\n` 
          : `${formatted}\n`;
        fs.appendFileSync(this.logFilePath, fileContent, 'utf8');
      } catch {
        // Silently continue if writing to file fails
      }
    }
  }

  public debug(tag: string, message: string, meta?: any): void {
    this.write(LogLevel.DEBUG, tag, message, meta);
  }

  public info(tag: string, message: string, meta?: any): void {
    this.write(LogLevel.INFO, tag, message, meta);
  }

  public warn(tag: string, message: string, meta?: any): void {
    this.write(LogLevel.WARN, tag, message, meta);
  }

  public error(tag: string, message: string, meta?: any): void {
    this.write(LogLevel.ERROR, tag, message, meta);
  }
}

export const logger = Logger.getInstance();
