export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3
}
export declare enum LogCategory {
    SYSTEM = "SYSTEM",
    HTTP = "HTTP",
    USER = "USER",
    LLM = "LLM",
    MODEL = "MODEL",
    KB = "KB",
    STORAGE = "STORAGE",
    AUTH = "AUTH",
    PROCESS = "PROCESS",
    DIAG = "DIAG",
    CLI = "CLI",
    BROWSER = "BROWSER"
}
export interface LogEntry {
    timestamp: string;
    level: string;
    category: string;
    tag: string;
    message: string;
    meta?: any;
    sessionId?: string;
    userId?: string;
    ip?: string;
    userAgent?: string;
    durationMs?: number;
}
export declare class Logger {
    private static instance;
    private logsDir;
    private mainLogPath;
    private userLogPath;
    private errorLogPath;
    private minLevel;
    private inMemoryBuffer;
    private maxBufferSize;
    private sessionId;
    private constructor();
    static getInstance(): Logger;
    setMinLevel(level: LogLevel): void;
    setSession(sessionId: string): void;
    getSession(): string;
    getRecentLogs(limit?: number, level?: LogLevel, category?: string): LogEntry[];
    getLogFiles(): {
        main: string;
        user: string;
        errors: string;
        dir: string;
    };
    readLogFile(filename: string, lines?: number): string;
    listLogFiles(): string[];
    private formatMessage;
    private write;
    debug(tag: string, message: string, meta?: any): void;
    debug(category: LogCategory, tag: string, message: string, meta?: any): void;
    info(tag: string, message: string, meta?: any): void;
    info(category: LogCategory, tag: string, message: string, meta?: any): void;
    warn(tag: string, message: string, meta?: any): void;
    warn(category: LogCategory, tag: string, message: string, meta?: any): void;
    error(tag: string, message: string, meta?: any): void;
    error(category: LogCategory, tag: string, message: string, meta?: any): void;
    logUserAction(action: string, details: any, ip?: string, userAgent?: string): void;
    logHttpRequest(method: string, path: string, status: number, durationMs: number, ip?: string, userAgent?: string): void;
    logLlmCall(model: string, provider: string, promptTokens: number, responseTokens: number, durationMs: number, cost?: number): void;
    startTimer(label: string): () => number;
}
export declare const logger: Logger;
