import fs from 'node:fs';
import path from 'node:path';
export var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 0] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 1] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 3] = "ERROR";
})(LogLevel || (LogLevel = {}));
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
const RESET_COLOR = '\x1b[0m';
export class Logger {
    static instance;
    logFilePath = null;
    minLevel = LogLevel.INFO;
    constructor() {
        try {
            const logsDir = path.resolve(process.cwd(), 'logs');
            if (!fs.existsSync(logsDir)) {
                fs.mkdirSync(logsDir, { recursive: true });
            }
            this.logFilePath = path.join(logsDir, 'evabot.log');
        }
        catch {
            // In browser or non-filesystem environments, skip file logging
            this.logFilePath = null;
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
    formatMessage(level, tag, message) {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] [${LEVEL_NAMES[level]}] [${tag}] ${message}`;
    }
    write(level, tag, message, meta) {
        if (level < this.minLevel)
            return;
        const formatted = this.formatMessage(level, tag, message);
        const color = LEVEL_COLORS[level] || '';
        // Console output
        if (meta !== undefined) {
            console.log(`${color}${formatted}${RESET_COLOR}`, meta);
        }
        else {
            console.log(`${color}${formatted}${RESET_COLOR}`);
        }
        // Persistent file output
        if (this.logFilePath) {
            try {
                const fileContent = meta !== undefined
                    ? `${formatted} ${JSON.stringify(meta)}\n`
                    : `${formatted}\n`;
                fs.appendFileSync(this.logFilePath, fileContent, 'utf8');
            }
            catch {
                // Silently continue if writing to file fails
            }
        }
    }
    debug(tag, message, meta) {
        this.write(LogLevel.DEBUG, tag, message, meta);
    }
    info(tag, message, meta) {
        this.write(LogLevel.INFO, tag, message, meta);
    }
    warn(tag, message, meta) {
        this.write(LogLevel.WARN, tag, message, meta);
    }
    error(tag, message, meta) {
        this.write(LogLevel.ERROR, tag, message, meta);
    }
}
export const logger = Logger.getInstance();
