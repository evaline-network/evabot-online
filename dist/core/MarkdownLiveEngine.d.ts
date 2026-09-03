/**
 * MarkdownLiveEngine (markdown-live)
 * Reactive Engine for Live Metrics, ASCII Progress Bars, and Dual-View NO-CSS TUI Rendering.
 */
export interface ILiveMetricState {
    frankfurtCpu: string;
    frankfurtRam: string;
    frankfurtRamPct: number;
    iowaCpu: string;
    iowaRam: string;
    iowaRamPct: number;
    totalOpexUsd: string;
    totalOpexEur: string;
    caddyStatus: string;
    geminiModelStatus: string;
}
export declare class MarkdownLiveEngine {
    private static instance;
    private metricsState;
    static getInstance(): MarkdownLiveEngine;
    getMetrics(): ILiveMetricState;
    generateProgressBar(current: number, total?: number, width?: number): string;
    processLiveMarkdown(markdown: string): string;
    renderHtmlPreview(liveMarkdown: string): string;
    private parseLineTokens;
    private renderMarkdownTable;
}
