/**
 * LiveMarkdownEngine
 * Pure Live-Markdown Core Engine supporting 3 Distinct Viewing Modes:
 * Mode 1: BEAUTIFUL_HYPER_UI (Tailwind-Powered Ultra Sleek Cyberpunk Dashboard)
 * Mode 2: PURE_NO_CSS_TUI (Classic Native HTML Table & Accordion TUI)
 * Mode 3: RAW_MARKDOWN (Raw Reactive Markdown Source Code)
 */
import { Language } from './Types.js';
export type ViewMode = 'BEAUTIFUL_HYPER_UI' | 'PURE_NO_CSS_TUI' | 'RAW_MARKDOWN';
export interface ITelemetryState {
    uptimeSeconds: number;
    frankfurtCpuPct: number;
    frankfurtRamUsedMb: number;
    frankfurtRamTotalMb: number;
    iowaCpuPct: number;
    iowaRamUsedMb: number;
    iowaRamTotalMb: number;
    totalOpexUsd: number;
    totalOpexEur: number;
    caddyActive: boolean;
    geminiActive: boolean;
    voiceActive: boolean;
}
export interface IChatMessage {
    sender: 'USER' | 'EVABOT';
    text: string;
    time: string;
}
export declare class LiveMarkdownEngine {
    private static instance;
    private telemetry;
    private chatHistory;
    private currentLanguage;
    private currentViewMode;
    static getInstance(): LiveMarkdownEngine;
    tick(): void;
    getTelemetry(): ITelemetryState;
    toggleVoice(): boolean;
    setLanguage(lang: Language): void;
    getLanguage(): Language;
    setViewMode(mode: ViewMode): void;
    getViewMode(): ViewMode;
    addChatMessage(text: string): void;
    generateProgressBar(current: number, total?: number, width?: number): string;
    processLiveMarkdown(markdownTemplate: string): string;
    private render3DCyberFaceBlock;
    private renderLiveChatBlock;
    private renderLiveAccountingBlock;
    private renderLiveKanbanBlock;
    renderByMode(liveMarkdown: string, mode: ViewMode): string;
    private compileToRawMarkdownView;
    compileToHtml(liveMarkdown: string): string;
    compileToBeautifulHtml(liveMarkdown: string): string;
    private parseLineTokens;
    private parseBeautifulLineTokens;
    private renderMarkdownTable;
    private renderBeautifulTable;
}
