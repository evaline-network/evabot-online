import fs from 'node:fs';
import path from 'node:path';
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (LogLevel = {}));
export var LogCategory;
(function (LogCategory) {
    LogCategory["SYSTEM"] = "SYSTEM";
    LogCategory["HTTP"] = "HTTP";
    LogCategory["USER"] = "USER";
    LogCategory["LLM"] = "LLM";
    LogCategory["MODEL"] = "MODEL";
    LogCategory["KB"] = "KB";
    LogCategory["STORAGE"] = "STORAGE";
    LogCategory["AUTH"] = "AUTH";
    LogCategory["PROCESS"] = "PROCESS";
    LogCategory["DIAG"] = "DIAG";
    LogCategory["CLI"] = "CLI";
    LogCategory["BROWSER"] = "BROWSER";
})(LogCategory || (LogCategory = {}));
const LEVEL_NAMES = {
    [LogLevel.DEBUG]: 'DEBUG',
    [LogLevel.INFO]: 'INFO',
    [LogLevel.WARN]: 'WARN',
    [LogLevel.ERROR]: 'ERROR',
};
const LEVEL_COLORS = {
    [LogLevel.DEBUG]: '\x1b[90m',
    [LogLevel.INFO]: '\x1b[36m',
    [LogLevel.WARN]: '\x1b[33m',
    [LogLevel.ERROR]: '\x1b[31m\x1b[1m',
};
const CATEGORY_COLORS = {
    [LogCategory.SYSTEM]: '\x1b[35m',
    [LogCategory.HTTP]: '\x1b[34m',
    [LogCategory.USER]: '\x1b[32m',
    [LogCategory.LLM]: '\x1b[33m',
    [LogCategory.MODEL]: '\x1b[36m',
    [LogCategory.KB]: '\x1b[95m',
    [LogCategory.STORAGE]: '\x1b[93m',
    [LogCategory.AUTH]: '\x1b[91m',
    [LogCategory.PROCESS]: '\x1b[96m',
    [LogCategory.DIAG]: '\x1b[37m',
    [LogCategory.CLI]: '\x1b[32m',
    [LogCategory.BROWSER]: '\x1b[94m',
};
const RESET_COLOR = '\x1b[0m';
export class Logger {
    static instance;
    logsDir = null;
    mainLogPath = null;
    userLogPath = null;
    errorLogPath = null;
    minLevel = LogLevel.DEBUG;
    inMemoryBuffer = [];
    maxBufferSize = 1000;
    sessionId = '';
    constructor() {
        try {
            this.logsDir = path.resolve(process.cwd(), 'logs');
            if (!fs.existsSync(this.logsDir)) {
                fs.mkdirSync(this.logsDir, { recursive: true });
            }
            const date = new Date().toISOString().split('T')[0];
            this.mainLogPath = path.join(this.logsDir, 'evabot.log');
            this.userLogPath = path.join(this.logsDir, `user-actions-${date}.log`);
            this.errorLogPath = path.join(this.logsDir, `errors-${date}.log`);
        }
        catch {
            this.logsDir = null;
        }
    }
    static getInstance() {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }
    setMinLevel(level) {
        this.minLevel = level;
    }
    setSession(sessionId) {
        this.sessionId = sessionId;
    }
    getSession() {
        return this.sessionId;
    }
    getRecentLogs(limit = 100, level, category) {
        let entries = [...this.inMemoryBuffer];
        if (level !== undefined) {
            entries = entries.filter(e => e.level === LEVEL_NAMES[level]);
        }
        if (category !== undefined) {
            entries = entries.filter(e => e.category === category);
        }
        return entries.slice(-limit).reverse();
    }
    getLogFiles() {
        return {
            main: this.mainLogPath || '',
            user: this.userLogPath || '',
            errors: this.errorLogPath || '',
            dir: this.logsDir || '',
        };
    }
    readLogFile(filename, lines = 200) {
        if (!this.logsDir)
            return '';
        const filePath = path.join(this.logsDir, filename);
        if (!fs.existsSync(filePath))
            return '';
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const allLines = content.split('\n');
            return allLines.slice(-lines).join('\n');
        }
        catch (e) {
            return `[ERROR] Cannot read log: ${e.message}`;
        }
    }
    listLogFiles() {
        if (!this.logsDir)
            return [];
        try {
            return fs.readdirSync(this.logsDir).filter(f => f.endsWith('.log'));
        }
        catch {
            return [];
        }
    }
    formatMessage(level, category, tag, message, meta) {
        return {
            timestamp: new Date().toISOString(),
            level: LEVEL_NAMES[level],
            category,
            tag,
            message,
            meta,
            sessionId: this.sessionId || undefined,
        };
    }
    write(level, category, tag, message, meta) {
        if (level < this.minLevel)
            return;
        const entry = this.formatMessage(level, category, tag, message, meta);
        this.inMemoryBuffer.push(entry);
        if (this.inMemoryBuffer.length > this.maxBufferSize) {
            this.inMemoryBuffer.shift();
        }
        const sessionStr = this.sessionId ? ` [${this.sessionId}]` : '';
        const line = `[${entry.timestamp}] [${entry.level}] [${category}]${sessionStr} [${tag}] ${message}`;
        const metaStr = meta !== undefined ? ` ${JSON.stringify(meta)}` : '';
        const fullLine = line + metaStr;
        const color = LEVEL_COLORS[level] || '';
        console.log(`${color}${line}${RESET_COLOR}${meta ? ` ${color}${JSON.stringify(meta)}${RESET_COLOR}` : ''}`);
        if (this.mainLogPath) {
            try {
                fs.appendFileSync(this.mainLogPath, fullLine + '\n', 'utf8');
            }
            catch { }
        }
        if (category === LogCategory.USER && this.userLogPath) {
            try {
                fs.appendFileSync(this.userLogPath, fullLine + '\n', 'utf8');
            }
            catch { }
        }
        if (level === LogLevel.ERROR && this.errorLogPath) {
            try {
                fs.appendFileSync(this.errorLogPath, fullLine + '\n', 'utf8');
            }
            catch { }
        }
    }
    debug(arg1, arg2, arg3, arg4) {
        if (typeof arg1 === 'string') {
            this.write(LogLevel.DEBUG, LogCategory.SYSTEM, arg1, arg2, arg3);
        }
        else {
            this.write(LogLevel.DEBUG, arg1, arg2, arg3, arg4);
        }
    }
    info(arg1, arg2, arg3, arg4) {
        if (typeof arg1 === 'string') {
            this.write(LogLevel.INFO, LogCategory.SYSTEM, arg1, arg2, arg3);
        }
        else {
            this.write(LogLevel.INFO, arg1, arg2, arg3, arg4);
        }
    }
    warn(arg1, arg2, arg3, arg4) {
        if (typeof arg1 === 'string') {
            this.write(LogLevel.WARN, LogCategory.SYSTEM, arg1, arg2, arg3);
        }
        else {
            this.write(LogLevel.WARN, arg1, arg2, arg3, arg4);
        }
    }
    error(arg1, arg2, arg3, arg4) {
        if (typeof arg1 === 'string') {
            this.write(LogLevel.ERROR, LogCategory.SYSTEM, arg1, arg2, arg3);
        }
        else {
            this.write(LogLevel.ERROR, arg1, arg2, arg3, arg4);
        }
    }
    logUserAction(action, details, ip, userAgent) {
        this.write(LogLevel.INFO, LogCategory.USER, 'USER_ACTION', action, {
            ...details,
            ip,
            userAgent,
        });
    }
    logHttpRequest(method, path, status, durationMs, ip, userAgent) {
        this.write(LogLevel.INFO, LogCategory.HTTP, 'REQUEST', `${method} ${path}`, {
            method, path, status, durationMs, ip, userAgent,
        });
    }
    logLlmCall(model, provider, promptTokens, responseTokens, durationMs, cost) {
        this.write(LogLevel.INFO, LogCategory.LLM, 'LLM_CALL', `${model} via ${provider}`, {
            model, provider, promptTokens, responseTokens, durationMs, cost,
        });
    }
    startTimer(label) {
        const start = Date.now();
        return () => {
            const duration = Date.now() - start;
            this.debug(LogCategory.PROCESS, label, `Completed in ${duration}ms`);
            return duration;
        };
    }
}
export const logger = Logger.getInstance();
