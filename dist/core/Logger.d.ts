export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
export declare class Logger {
    private static instance;
    private logFilePath;
    private minLevel;
    private constructor();
    static getInstance(): Logger;
    setMinLevel(level: LogLevel): void;
    private formatMessage;
    private write;
    debug(tag: string, message: string, meta?: any): void;
    info(tag: string, message: string, meta?: any): void;
    warn(tag: string, message: string, meta?: any): void;
    error(tag: string, message: string, meta?: any): void;
}
export declare const logger: Logger;
