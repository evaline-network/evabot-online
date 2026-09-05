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
export declare const AnsiColors: {
    readonly reset: "\u001B[0m";
    readonly bold: "\u001B[1m";
    readonly dim: "\u001B[2m";
    readonly italic: "\u001B[3m";
    readonly underline: "\u001B[4m";
    readonly inverse: "\u001B[7m";
    readonly black: "\u001B[30m";
    readonly red: "\u001B[31m";
    readonly green: "\u001B[32m";
    readonly yellow: "\u001B[33m";
    readonly blue: "\u001B[34m";
    readonly magenta: "\u001B[35m";
    readonly cyan: "\u001B[36m";
    readonly white: "\u001B[37m";
    readonly gray: "\u001B[90m";
    readonly brightRed: "\u001B[91m";
    readonly brightGreen: "\u001B[92m";
    readonly brightYellow: "\u001B[93m";
    readonly brightBlue: "\u001B[94m";
    readonly brightMagenta: "\u001B[95m";
    readonly brightCyan: "\u001B[96m";
    readonly brightWhite: "\u001B[97m";
    readonly bgBlack: "\u001B[40m";
    readonly bgRed: "\u001B[41m";
    readonly bgGreen: "\u001B[42m";
    readonly bgYellow: "\u001B[43m";
    readonly bgBlue: "\u001B[44m";
    readonly bgMagenta: "\u001B[45m";
    readonly bgCyan: "\u001B[46m";
    readonly bgWhite: "\u001B[47m";
};
export type ColorName = keyof typeof AnsiColors;
/**
 * Strips all ANSI escape sequences from a string to produce clean plain text
 */
export declare function stripAnsi(text: string): string;
/**
 * Calculates visible terminal character width.
 * Accounts for 2-column emojis (🟢, 🟡, 🔴, etc.) and wide characters.
 */
export declare function visibleWidth(text: string): number;
/**
 * Pads a string to a target visible width, taking ANSI escapes into account
 */
export declare function padEndVisible(text: string, targetWidth: number, padChar?: string): string;
/**
 * Pads start of a string to a target visible width
 */
export declare function padStartVisible(text: string, targetWidth: number, padChar?: string): string;
/**
 * Converts ANSI colored text into sanitized HTML with inline CSS or classes
 * for 1:1 rendering in browser cyber-terminals.
 */
export declare function toHtml(ansiText: string): string;
/**
 * Converts ANSI text directly to plain text (strips ANSI codes)
 */
export declare function toPlainText(ansiText: string): string;
export type TrafficLightStatus = 'green' | 'yellow' | 'red' | 'ok' | 'warn' | 'error' | 'online' | 'standby' | 'offline' | 'free' | 'paid';
export declare function trafficLightIcon(status: TrafficLightStatus): string;
export declare function trafficLightColor(status: TrafficLightStatus): string;
/**
 * Generates standard cyber-terminal traffic light badge:
 * e.g. "🟢 ONLINE", "🟡 STANDBY", "🔴 OFFLINE", "🟢 FREE QUOTA"
 */
export declare function statusBadge(status: TrafficLightStatus, customLabel?: string): string;
/**
 * Minimal inline badge
 */
export declare function badge(text: string, color?: string): string;
export declare function divider(char?: string, width?: number, color?: "\u001B[90m"): string;
export declare function sectionHeader(title: string, tag?: string, width?: number): string;
export declare function sectionFooter(width?: number): string;
export declare function formatBanner(lines: string[], title?: string, width?: number): string;
export declare function promptSymbol(mode?: string): string;
export declare function formatPrompt(options: {
    model?: string;
    mode?: string;
    role?: string;
}): string;
export interface TableColumn<T = any> {
    key: keyof T | string;
    header: string;
    align?: 'left' | 'center' | 'right';
    minWidth?: number;
    maxWidth?: number;
    format?: (value: any, row: T) => string;
}
export interface TableOptions<T = any> {
    columns: TableColumn<T>[];
    borderStyle?: 'unicode' | 'ascii' | 'minimal' | 'none';
    headerColor?: string;
    borderColor?: string;
    padding?: number;
    maxWidth?: number;
}
export declare class TableFormatter {
    /**
     * Formats rows into a clean, perfectly aligned monospace table
     */
    static render<T extends Record<string, any>>(rows: T[], options: TableOptions<T>): string;
}
export interface SgrMouseEvent {
    button: number;
    pressed: boolean;
    col: number;
    row: number;
    isRelease: boolean;
}
export interface ClickableArea {
    id: string;
    row: number;
    startCol: number;
    endCol: number;
    label: string;
    action: () => void | Promise<void>;
}
export declare class MouseTracker {
    private clickables;
    private enabled;
    private onData?;
    constructor(onData?: (event: SgrMouseEvent) => void);
    /**
     * Enable SGR mouse mode 1003 (all events) + mode 1006 (SGR coordinates)
     */
    enable(): void;
    /**
     * Disable SGR mouse tracking and restore terminal
     */
    disable(): void;
    isEnabled(): boolean;
    /**
     * Parse raw input bytes for SGR mouse events.
     * SGR format: ESC [ < Cb ; Cc ; Cd M / m
     *   Cb = button (0-3 normal, 64=scroll up, 65=scroll down)
     *   Cc = column (1-based)
     *   Cd = row (1-based)
     *   M = press, m = release
     */
    parseBuffer(data: Buffer): SgrMouseEvent[];
    /**
     * Register a clickable area
     */
    registerClickable(area: ClickableArea): void;
    /**
     * Clear all registered clickables (call on each render cycle)
     */
    clearClickables(): void;
    /**
     * Check if a mouse event hits a registered clickable
     */
    private checkClickable;
    /**
     * Setup raw mode stdin listener for mouse events
     */
    attachStdin(stdin: NodeJS.ReadStream): void;
    /**
     * Detach stdin listener
     */
    detachStdin(stdin: NodeJS.ReadStream): void;
}
/**
 * Helper: render a clickable text span that registers coordinates for mouse hit-testing.
 * Returns the plain text (for screen output) and registers the clickable area.
 */
export declare function clickableText(tracker: MouseTracker, text: string, row: number, startCol: number, id: string, action: () => void | Promise<void>): string;
export interface AnsiStreamWriterOptions {
    prefix?: string;
    writeToStdout?: boolean;
    onChunk?: (chunk: string) => void;
    onLine?: (line: string) => void;
}
export declare class AnsiStreamWriter extends EventEmitter {
    private lineBuffer;
    private fullAnsiBuffer;
    private lines;
    private prefix;
    private writeToStdout;
    private onChunkCallback?;
    private onLineCallback?;
    private isStartOfLine;
    constructor(options?: AnsiStreamWriterOptions);
    /**
     * Set dynamic prefix for streamed lines (e.g. `│ ` or `▸ `)
     */
    setPrefix(prefix: string): void;
    /**
     * Appends a chunk to the stream, processing complete lines reactively
     */
    write(chunk: string): void;
    /**
     * Writes a complete line
     */
    writeLine(line?: string): void;
    /**
     * Flushes any remaining content in the buffer
     */
    flush(): void;
    /**
     * Signals the end of the stream and flushes remaining content
     */
    end(): void;
    /**
     * Returns complete accumulated text formatted for ANSI, Plain Text, or HTML
     */
    getFullText(format?: 'ansi' | 'plain' | 'html'): string;
    /**
     * Returns all processed lines
     */
    getLines(format?: 'ansi' | 'plain'): string[];
    /**
     * Clears all internal buffers
     */
    clear(): void;
}
export declare const AnsiStreamEngine: {
    colors: {
        readonly reset: "\u001B[0m";
        readonly bold: "\u001B[1m";
        readonly dim: "\u001B[2m";
        readonly italic: "\u001B[3m";
        readonly underline: "\u001B[4m";
        readonly inverse: "\u001B[7m";
        readonly black: "\u001B[30m";
        readonly red: "\u001B[31m";
        readonly green: "\u001B[32m";
        readonly yellow: "\u001B[33m";
        readonly blue: "\u001B[34m";
        readonly magenta: "\u001B[35m";
        readonly cyan: "\u001B[36m";
        readonly white: "\u001B[37m";
        readonly gray: "\u001B[90m";
        readonly brightRed: "\u001B[91m";
        readonly brightGreen: "\u001B[92m";
        readonly brightYellow: "\u001B[93m";
        readonly brightBlue: "\u001B[94m";
        readonly brightMagenta: "\u001B[95m";
        readonly brightCyan: "\u001B[96m";
        readonly brightWhite: "\u001B[97m";
        readonly bgBlack: "\u001B[40m";
        readonly bgRed: "\u001B[41m";
        readonly bgGreen: "\u001B[42m";
        readonly bgYellow: "\u001B[43m";
        readonly bgBlue: "\u001B[44m";
        readonly bgMagenta: "\u001B[45m";
        readonly bgCyan: "\u001B[46m";
        readonly bgWhite: "\u001B[47m";
    };
    stripAnsi: typeof stripAnsi;
    visibleWidth: typeof visibleWidth;
    padEndVisible: typeof padEndVisible;
    padStartVisible: typeof padStartVisible;
    toHtml: typeof toHtml;
    toPlainText: typeof toPlainText;
    trafficLightIcon: typeof trafficLightIcon;
    trafficLightColor: typeof trafficLightColor;
    statusBadge: typeof statusBadge;
    badge: typeof badge;
    divider: typeof divider;
    sectionHeader: typeof sectionHeader;
    sectionFooter: typeof sectionFooter;
    formatBanner: typeof formatBanner;
    promptSymbol: typeof promptSymbol;
    formatPrompt: typeof formatPrompt;
    formatTable: typeof TableFormatter.render;
    TableFormatter: typeof TableFormatter;
    AnsiStreamWriter: typeof AnsiStreamWriter;
    MouseTracker: typeof MouseTracker;
    clickableText: typeof clickableText;
};
export default AnsiStreamEngine;
