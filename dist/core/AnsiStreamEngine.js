/**
 * AnsiStreamEngine.ts
 * EvaBot Online v0.0.1 MVP — Reactive ANSI Terminal Stream Engine
 *
 * Features:
 * - Line-by-line reactive streaming and chunk buffering
 * - Traffic light badges (🟢 🟡 🔴) and status indicators
 * - Clean headers, banners, dividers, and prompt symbols
 * - Robust monospace table formatter with auto-column width and border styles
 * - 1:1 parity across ANSI Terminal, Plain Text files, and Web HTML
 * - Strict financial standard: USD ($) & EUR (€) only
 */
import { EventEmitter } from 'node:events';
// ============================================================================
// ANSI Color and Style Codes
// ============================================================================
export const AnsiColors = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    dim: '\x1b[2m',
    italic: '\x1b[3m',
    underline: '\x1b[4m',
    inverse: '\x1b[7m',
    // Standard Foreground
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    // Bright / Zinc Foreground
    gray: '\x1b[90m',
    brightRed: '\x1b[91m',
    brightGreen: '\x1b[92m',
    brightYellow: '\x1b[93m',
    brightBlue: '\x1b[94m',
    brightMagenta: '\x1b[95m',
    brightCyan: '\x1b[96m',
    brightWhite: '\x1b[97m',
    // Standard Background
    bgBlack: '\x1b[40m',
    bgRed: '\x1b[41m',
    bgGreen: '\x1b[42m',
    bgYellow: '\x1b[43m',
    bgBlue: '\x1b[44m',
    bgMagenta: '\x1b[45m',
    bgCyan: '\x1b[46m',
    bgWhite: '\x1b[47m',
};
// ============================================================================
// ANSI & String Width Utilities (1:1 Parity Terminal / Plain / Web)
// ============================================================================
const ANSI_REGEX = new RegExp('[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)|(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))', 'g');
/**
 * Strips all ANSI escape sequences from a string to produce clean plain text
 */
export function stripAnsi(text) {
    return text.replace(ANSI_REGEX, '');
}
/**
 * Calculates visible terminal character width.
 * Accounts for 2-column emojis (🟢, 🟡, 🔴, etc.) and wide characters.
 */
export function visibleWidth(text) {
    const clean = stripAnsi(text);
    let width = 0;
    for (const char of clean) {
        const code = char.codePointAt(0) || 0;
        // Common 2-width emojis (traffic lights, checkmarks, sparkles, etc.)
        if ((code >= 0x1f300 && code <= 0x1f9ff) || // Misc Symbols & Pictographs, Supplemental Symbols
            (code >= 0x2600 && code <= 0x27bf) || // Misc symbols, Dingbats
            (code >= 0x1fa00 && code <= 0x1faff) || // Chess, Symbols & Pictographs Extended-A
            (code >= 0x2e80 && code <= 0x9fff) // CJK
        ) {
            width += 2;
        }
        else {
            width += 1;
        }
    }
    return width;
}
/**
 * Pads a string to a target visible width, taking ANSI escapes into account
 */
export function padEndVisible(text, targetWidth, padChar = ' ') {
    const current = visibleWidth(text);
    if (current >= targetWidth)
        return text;
    return text + padChar.repeat(targetWidth - current);
}
/**
 * Pads start of a string to a target visible width
 */
export function padStartVisible(text, targetWidth, padChar = ' ') {
    const current = visibleWidth(text);
    if (current >= targetWidth)
        return text;
    return padChar.repeat(targetWidth - current) + text;
}
/**
 * Converts ANSI colored text into sanitized HTML with inline CSS or classes
 * for 1:1 rendering in browser cyber-terminals.
 */
export function toHtml(ansiText) {
    const colorMap = {
        '30': 'color:#000000',
        '31': 'color:#ef4444',
        '32': 'color:#22c55e',
        '33': 'color:#eab308',
        '34': 'color:#3b82f6',
        '35': 'color:#a855f7',
        '36': 'color:#06b6d4',
        '37': 'color:#e4e4e7',
        '90': 'color:#71717a',
        '91': 'color:#f87171',
        '92': 'color:#4ade80',
        '93': 'color:#fde047',
        '94': 'color:#60a5fa',
        '95': 'color:#c084fc',
        '96': 'color:#22d3ee',
        '97': 'color:#ffffff',
        '1': 'font-weight:bold',
        '2': 'opacity:0.6',
        '3': 'font-style:italic',
        '4': 'text-decoration:underline',
    };
    // Escape basic HTML characters
    let escaped = ansiText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    // Replace ANSI SGR codes with spans
    escaped = escaped.replace(/\x1b\[([0-9;]+)m/g, (_match, p1) => {
        if (p1 === '0') {
            return '</span>';
        }
        const codes = p1.split(';');
        const styles = [];
        for (const code of codes) {
            if (colorMap[code]) {
                styles.push(colorMap[code]);
            }
        }
        if (styles.length > 0) {
            return `<span style="${styles.join(';')}">`;
        }
        return '';
    });
    return escaped;
}
/**
 * Converts ANSI text directly to plain text (strips ANSI codes)
 */
export function toPlainText(ansiText) {
    return stripAnsi(ansiText);
}
export function trafficLightIcon(status) {
    switch (status) {
        case 'green':
        case 'ok':
        case 'online':
        case 'free':
            return '🟢';
        case 'yellow':
        case 'warn':
        case 'standby':
        case 'paid':
            return '🟡';
        case 'red':
        case 'error':
        case 'offline':
            return '🔴';
        default:
            return '⚪';
    }
}
export function trafficLightColor(status) {
    switch (status) {
        case 'green':
        case 'ok':
        case 'online':
        case 'free':
            return AnsiColors.green;
        case 'yellow':
        case 'warn':
        case 'standby':
        case 'paid':
            return AnsiColors.yellow;
        case 'red':
        case 'error':
        case 'offline':
            return AnsiColors.red;
        default:
            return AnsiColors.white;
    }
}
/**
 * Generates standard cyber-terminal traffic light badge:
 * e.g. "🟢 ONLINE", "🟡 STANDBY", "🔴 OFFLINE", "🟢 FREE QUOTA"
 */
export function statusBadge(status, customLabel) {
    const icon = trafficLightIcon(status);
    const color = trafficLightColor(status);
    let label = customLabel;
    if (!label) {
        switch (status) {
            case 'green':
            case 'ok':
            case 'online':
                label = 'ONLINE';
                break;
            case 'yellow':
            case 'warn':
            case 'standby':
                label = 'STANDBY';
                break;
            case 'red':
            case 'error':
            case 'offline':
                label = 'OFFLINE';
                break;
            case 'free':
                label = '100% FREE QUOTA';
                break;
            case 'paid':
                label = 'PAID / METERED';
                break;
            default:
                label = String(status).toUpperCase();
        }
    }
    return `${icon} ${color}${AnsiColors.bold}[${label}]${AnsiColors.reset}`;
}
/**
 * Minimal inline badge
 */
export function badge(text, color = AnsiColors.cyan) {
    return `${AnsiColors.gray}[${AnsiColors.reset}${color}${text}${AnsiColors.reset}${AnsiColors.gray}]${AnsiColors.reset}`;
}
// ============================================================================
// Clean Headers, Dividers, and Prompt Symbols
// ============================================================================
export function divider(char = '─', width = 78, color = AnsiColors.gray) {
    return `${color}${char.repeat(width)}${AnsiColors.reset}`;
}
export function sectionHeader(title, tag = '', width = 78) {
    const cleanTitle = ` ${title.toUpperCase()} `;
    const cleanTag = tag ? ` [ ${tag} ] ` : '';
    const remaining = Math.max(4, width - visibleWidth(cleanTitle) - visibleWidth(cleanTag) - 2);
    const left = '──';
    const right = '─'.repeat(remaining);
    return `${AnsiColors.gray}┌${left}${AnsiColors.reset}${AnsiColors.bold}${AnsiColors.white}${cleanTitle}${AnsiColors.reset}${cleanTag ? `${AnsiColors.cyan}${cleanTag}${AnsiColors.reset}` : ''}${AnsiColors.gray}${right}┐${AnsiColors.reset}`;
}
export function sectionFooter(width = 78) {
    return `${AnsiColors.gray}└${'─'.repeat(width - 2)}┘${AnsiColors.reset}`;
}
export function formatBanner(lines, title = 'EVABOT ONLINE v0.0.1 MVP', width = 78) {
    const contentWidth = width - 4;
    const top = `${AnsiColors.gray}┌${'─'.repeat(width - 2)}┐${AnsiColors.reset}`;
    const bottom = `${AnsiColors.gray}└${'─'.repeat(width - 2)}┘${AnsiColors.reset}`;
    const renderedLines = [top];
    renderedLines.push(`${AnsiColors.gray}│${AnsiColors.reset} ${AnsiColors.bold}${AnsiColors.brightWhite}${padEndVisible(title, contentWidth - 1)}${AnsiColors.reset} ${AnsiColors.gray}│${AnsiColors.reset}`);
    renderedLines.push(`${AnsiColors.gray}├${'─'.repeat(width - 2)}┤${AnsiColors.reset}`);
    for (const line of lines) {
        const padded = padEndVisible(line, contentWidth - 1);
        renderedLines.push(`${AnsiColors.gray}│${AnsiColors.reset} ${padded} ${AnsiColors.gray}│${AnsiColors.reset}`);
    }
    renderedLines.push(bottom);
    return renderedLines.join('\n');
}
export function promptSymbol(mode = 'solo') {
    switch (mode.toLowerCase()) {
        case 'consilium':
            return `${AnsiColors.green}👥 ❯${AnsiColors.reset}`;
        case 'dialogue':
            return `${AnsiColors.cyan}💬 ❯${AnsiColors.reset}`;
        case 'broadcast':
            return `${AnsiColors.yellow}📡 ❯${AnsiColors.reset}`;
        default:
            return `${AnsiColors.brightGreen}❯${AnsiColors.reset}`;
    }
}
export function formatPrompt(options) {
    const mode = (options.mode || 'solo').toUpperCase();
    const model = options.model ? ` (${options.model})` : '';
    const role = options.role && options.role !== 'general_assistant' ? ` [${options.role}]` : '';
    const symbol = promptSymbol(options.mode);
    return `${AnsiColors.bold}${AnsiColors.white}eva${AnsiColors.reset}${AnsiColors.gray}${model}${role} ${AnsiColors.cyan}[${mode}]${AnsiColors.reset} ${symbol} `;
}
export class TableFormatter {
    /**
     * Formats rows into a clean, perfectly aligned monospace table
     */
    static render(rows, options) {
        const { columns, borderStyle = 'unicode', headerColor = `${AnsiColors.bold}${AnsiColors.white}`, borderColor = AnsiColors.gray, padding = 1, } = options;
        const pad = ' '.repeat(padding);
        // 1. Calculate column widths
        const colWidths = columns.map((col) => {
            let max = visibleWidth(col.header);
            if (col.minWidth)
                max = Math.max(max, col.minWidth);
            for (const row of rows) {
                const val = col.format
                    ? col.format(row[col.key], row)
                    : String(row[col.key] ?? '');
                max = Math.max(max, visibleWidth(val));
            }
            if (col.maxWidth)
                max = Math.min(max, col.maxWidth);
            return max;
        });
        // 2. Borders definition
        const chars = {
            unicode: {
                tl: '┌',
                tm: '┬',
                tr: '┐',
                ml: '├',
                mm: '┼',
                mr: '┤',
                bl: '└',
                bm: '┴',
                br: '┘',
                h: '─',
                v: '│',
            },
            ascii: {
                tl: '+',
                tm: '+',
                tr: '+',
                ml: '+',
                mm: '+',
                mr: '+',
                bl: '+',
                bm: '+',
                br: '+',
                h: '-',
                v: '|',
            },
            minimal: {
                tl: '',
                tm: '',
                tr: '',
                ml: '',
                mm: '',
                mr: '',
                bl: '',
                bm: '',
                br: '',
                h: '─',
                v: ' ',
            },
            none: {
                tl: '',
                tm: '',
                tr: '',
                ml: '',
                mm: '',
                mr: '',
                bl: '',
                bm: '',
                br: '',
                h: '',
                v: ' ',
            },
        }[borderStyle];
        const formatCell = (content, width, align = 'left') => {
            const vWidth = visibleWidth(content);
            if (vWidth >= width)
                return content;
            const diff = width - vWidth;
            if (align === 'right') {
                return ' '.repeat(diff) + content;
            }
            if (align === 'center') {
                const leftPad = Math.floor(diff / 2);
                const rightPad = diff - leftPad;
                return ' '.repeat(leftPad) + content + ' '.repeat(rightPad);
            }
            return content + ' '.repeat(diff);
        };
        const out = [];
        // Top border
        if (borderStyle === 'unicode' || borderStyle === 'ascii') {
            const topParts = colWidths.map((w) => chars.h.repeat(w + padding * 2));
            out.push(`${borderColor}${chars.tl}${topParts.join(chars.tm)}${chars.tr}${AnsiColors.reset}`);
        }
        // Header row
        const headerCells = columns.map((col, idx) => {
            const aligned = formatCell(col.header, colWidths[idx], col.align || 'left');
            return `${pad}${headerColor}${aligned}${AnsiColors.reset}${pad}`;
        });
        out.push(`${borderColor}${chars.v}${AnsiColors.reset}${headerCells.join(`${borderColor}${chars.v}${AnsiColors.reset}`)}${borderColor}${chars.v}${AnsiColors.reset}`);
        // Separator border
        if (borderStyle !== 'none') {
            const midParts = colWidths.map((w) => chars.h.repeat(w + padding * 2));
            const midLeft = borderStyle === 'minimal' ? '' : chars.ml;
            const midRight = borderStyle === 'minimal' ? '' : chars.mr;
            const midJoint = borderStyle === 'minimal' ? ' ' : chars.mm;
            out.push(`${borderColor}${midLeft}${midParts.join(midJoint)}${midRight}${AnsiColors.reset}`);
        }
        // Data rows
        for (const row of rows) {
            const dataCells = columns.map((col, idx) => {
                const raw = col.format
                    ? col.format(row[col.key], row)
                    : String(row[col.key] ?? '');
                const aligned = formatCell(raw, colWidths[idx], col.align || 'left');
                return `${pad}${aligned}${pad}`;
            });
            out.push(`${borderColor}${chars.v}${AnsiColors.reset}${dataCells.join(`${borderColor}${chars.v}${AnsiColors.reset}`)}${borderColor}${chars.v}${AnsiColors.reset}`);
        }
        // Bottom border
        if (borderStyle === 'unicode' || borderStyle === 'ascii') {
            const botParts = colWidths.map((w) => chars.h.repeat(w + padding * 2));
            out.push(`${borderColor}${chars.bl}${botParts.join(chars.bm)}${chars.br}${AnsiColors.reset}`);
        }
        return out.join('\n');
    }
}
export class MouseTracker {
    clickables = [];
    enabled = false;
    onData;
    constructor(onData) {
        this.onData = onData;
    }
    /**
     * Enable SGR mouse mode 1003 (all events) + mode 1006 (SGR coordinates)
     */
    enable() {
        if (this.enabled)
            return;
        this.enabled = true;
        process.stdout.write('\x1b[?1003h\x1b[?1006h');
    }
    /**
     * Disable SGR mouse tracking and restore terminal
     */
    disable() {
        if (!this.enabled)
            return;
        this.enabled = false;
        process.stdout.write('\x1b[?1003l\x1b[?1006l');
    }
    isEnabled() {
        return this.enabled;
    }
    /**
     * Parse raw input bytes for SGR mouse events.
     * SGR format: ESC [ < Cb ; Cc ; Cd M / m
     *   Cb = button (0-3 normal, 64=scroll up, 65=scroll down)
     *   Cc = column (1-based)
     *   Cd = row (1-based)
     *   M = press, m = release
     */
    parseBuffer(data) {
        const events = [];
        const str = data.toString('utf-8');
        let i = 0;
        while (i < str.length) {
            // Look for ESC [ <
            if (str[i] === '\x1b' && i + 2 < str.length && str[i + 1] === '[' && str[i + 2] === '<') {
                i += 3;
                let cbStr = '';
                let ccStr = '';
                let cdStr = '';
                let phase = 0;
                while (i < str.length) {
                    const ch = str[i];
                    if (ch === ';') {
                        phase++;
                        i++;
                        continue;
                    }
                    if (ch === 'M' || ch === 'm') {
                        const isRelease = ch === 'm';
                        const cb = parseInt(cbStr, 10) || 0;
                        const cc = parseInt(ccStr, 10) || 0;
                        const cd = parseInt(cdStr, 10) || 0;
                        const event = {
                            button: cb,
                            pressed: !isRelease,
                            col: cc,
                            row: cd,
                            isRelease,
                        };
                        events.push(event);
                        this.onData?.(event);
                        this.checkClickable(event);
                        i++;
                        break;
                    }
                    if (ch >= '0' && ch <= '9') {
                        if (phase === 0)
                            cbStr += ch;
                        else if (phase === 1)
                            ccStr += ch;
                        else if (phase === 2)
                            cdStr += ch;
                    }
                    i++;
                }
            }
            else {
                i++;
            }
        }
        return events;
    }
    /**
     * Register a clickable area
     */
    registerClickable(area) {
        this.clickables.push(area);
    }
    /**
     * Clear all registered clickables (call on each render cycle)
     */
    clearClickables() {
        this.clickables = [];
    }
    /**
     * Check if a mouse event hits a registered clickable
     */
    checkClickable(event) {
        if (event.isRelease)
            return;
        const hit = this.clickables.find((c) => event.row === c.row && event.col >= c.startCol && event.col <= c.endCol);
        if (hit) {
            hit.action();
        }
    }
    /**
     * Setup raw mode stdin listener for mouse events
     */
    attachStdin(stdin) {
        if (stdin.isTTY) {
            stdin.setRawMode(true);
        }
        stdin.resume();
        stdin.on('data', (data) => {
            this.parseBuffer(data);
        });
    }
    /**
     * Detach stdin listener
     */
    detachStdin(stdin) {
        stdin.removeAllListeners('data');
        if (stdin.isTTY) {
            stdin.setRawMode(false);
        }
    }
}
/**
 * Helper: render a clickable text span that registers coordinates for mouse hit-testing.
 * Returns the plain text (for screen output) and registers the clickable area.
 */
export function clickableText(tracker, text, row, startCol, id, action) {
    tracker.registerClickable({
        id,
        row,
        startCol,
        endCol: startCol + visibleWidth(text) - 1,
        label: text,
        action,
    });
    return text;
}
export class AnsiStreamWriter extends EventEmitter {
    lineBuffer = '';
    fullAnsiBuffer = '';
    lines = [];
    prefix;
    writeToStdout;
    onChunkCallback;
    onLineCallback;
    isStartOfLine = true;
    constructor(options = {}) {
        super();
        this.prefix = options.prefix ?? '';
        this.writeToStdout = options.writeToStdout ?? false;
        this.onChunkCallback = options.onChunk;
        this.onLineCallback = options.onLine;
    }
    /**
     * Set dynamic prefix for streamed lines (e.g. `│ ` or `▸ `)
     */
    setPrefix(prefix) {
        this.prefix = prefix;
    }
    /**
     * Appends a chunk to the stream, processing complete lines reactively
     */
    write(chunk) {
        this.fullAnsiBuffer += chunk;
        this.lineBuffer += chunk;
        if (this.onChunkCallback) {
            this.onChunkCallback(chunk);
        }
        this.emit('chunk', chunk);
        // Process newlines
        let nlIdx = this.lineBuffer.indexOf('\n');
        while (nlIdx !== -1) {
            const line = this.lineBuffer.slice(0, nlIdx);
            this.lineBuffer = this.lineBuffer.slice(nlIdx + 1);
            this.lines.push(line);
            if (this.writeToStdout) {
                if (this.isStartOfLine && this.prefix) {
                    process.stdout.write(this.prefix);
                }
                process.stdout.write(line + '\n');
                this.isStartOfLine = true;
            }
            if (this.onLineCallback) {
                this.onLineCallback(line);
            }
            this.emit('line', line);
            nlIdx = this.lineBuffer.indexOf('\n');
        }
        // Output partial line to stdout if enabled
        if (this.writeToStdout && this.lineBuffer.length > 0) {
            if (this.isStartOfLine && this.prefix) {
                process.stdout.write(this.prefix);
                this.isStartOfLine = false;
            }
        }
    }
    /**
     * Writes a complete line
     */
    writeLine(line = '') {
        this.write(line + '\n');
    }
    /**
     * Flushes any remaining content in the buffer
     */
    flush() {
        if (this.lineBuffer.length > 0) {
            const line = this.lineBuffer;
            this.lineBuffer = '';
            this.lines.push(line);
            if (this.writeToStdout) {
                if (this.isStartOfLine && this.prefix) {
                    process.stdout.write(this.prefix);
                }
                process.stdout.write(line + '\n');
                this.isStartOfLine = true;
            }
            if (this.onLineCallback) {
                this.onLineCallback(line);
            }
            this.emit('line', line);
        }
    }
    /**
     * Signals the end of the stream and flushes remaining content
     */
    end() {
        this.flush();
        this.emit('end', this.fullAnsiBuffer);
    }
    /**
     * Returns complete accumulated text formatted for ANSI, Plain Text, or HTML
     */
    getFullText(format = 'ansi') {
        switch (format) {
            case 'plain':
                return toPlainText(this.fullAnsiBuffer);
            case 'html':
                return toHtml(this.fullAnsiBuffer);
            default:
                return this.fullAnsiBuffer;
        }
    }
    /**
     * Returns all processed lines
     */
    getLines(format = 'ansi') {
        if (format === 'plain') {
            return this.lines.map(toPlainText);
        }
        return [...this.lines];
    }
    /**
     * Clears all internal buffers
     */
    clear() {
        this.lineBuffer = '';
        this.fullAnsiBuffer = '';
        this.lines = [];
        this.isStartOfLine = true;
    }
}
// ============================================================================
// Default Export
// ============================================================================
export const AnsiStreamEngine = {
    colors: AnsiColors,
    stripAnsi,
    visibleWidth,
    padEndVisible,
    padStartVisible,
    toHtml,
    toPlainText,
    trafficLightIcon,
    trafficLightColor,
    statusBadge,
    badge,
    divider,
    sectionHeader,
    sectionFooter,
    formatBanner,
    promptSymbol,
    formatPrompt,
    formatTable: TableFormatter.render,
    TableFormatter,
    AnsiStreamWriter,
    MouseTracker,
    clickableText,
};
export default AnsiStreamEngine;
