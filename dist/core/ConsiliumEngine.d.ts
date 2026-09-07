import { LlmProvider } from './UniversalLlmClient.js';
import { TokenCostEstimate } from '../models/ModelRegistry.js';
export type ConsiliumMode = 'chat' | 'dialog' | 'interview' | 'consilium' | 'solo' | 'broadcast' | 'dialogue';
export type PersonaId = 'eva' | 'adam' | 'dual';
export interface ConsiliumParticipant {
    id: string;
    model: string;
    roleId?: string;
    name?: string;
    title?: string;
    systemPrompt?: string;
    temperature?: number;
    provider?: LlmProvider;
}
export interface ConsiliumTurn {
    round: number;
    participantId: string;
    name: string;
    model: string;
    role?: string;
    content: string;
    timestamp: string;
    durationMs: number;
    promptTokens?: number;
    completionTokens?: number;
    totalTokens?: number;
    cost?: TokenCostEstimate;
}
export interface ConsiliumProgressEvent {
    type: 'turn_start' | 'turn_complete' | 'round_complete' | 'synthesis_start' | 'synthesis_complete' | 'error';
    round?: number;
    participantId?: string;
    turn?: ConsiliumTurn;
    message?: string;
}
export interface ConsiliumRunOptions {
    mode: ConsiliumMode;
    persona?: PersonaId;
    prompt: string;
    models?: string[];
    participants?: ConsiliumParticipant[];
    rounds?: number;
    preset?: 'top10_paid' | 'top10_free';
    synthesizerModel?: string;
    systemInstruction?: string;
    apiKey?: string;
    useKnowledgeBase?: boolean;
    onProgress?: (event: ConsiliumProgressEvent) => void;
    signal?: AbortSignal;
}
export interface ConsiliumResult {
    mode: ConsiliumMode;
    prompt: string;
    participants: ConsiliumParticipant[];
    turns: ConsiliumTurn[];
    synthesis?: string;
    totalRounds: number;
    durationMs: number;
    knowledgeBaseContextIncluded: boolean;
    totalPromptTokens?: number;
    totalCompletionTokens?: number;
    totalTokens?: number;
    totalCostUSD?: number;
    totalCostEUR?: number;
    costSummary?: {
        totalPromptTokens: number;
        totalCompletionTokens: number;
        totalTokens: number;
        totalCostUSD: number;
        totalCostEUR: number;
        formattedUSD: string;
        formattedEUR: string;
        models: Array<{
            model: string;
            tokens: number;
            costUSD: number;
            costEUR: number;
            formattedUSD: string;
            formattedEUR: string;
        }>;
    };
}
export declare class ConsiliumEngine {
    private client;
    private kbConnector;
    constructor(apiKey?: string);
    /**
     * Main entrypoint for running any Consilium engine mode
     */
    run(options: ConsiliumRunOptions): Promise<ConsiliumResult>;
    /**
     * Resolves and enriches participants list with corporate roles and defaults
     */
    resolveParticipants(options: ConsiliumRunOptions): ConsiliumParticipant[];
    /**
     * Validates and bounds participants for Consilium mode (strictly between 3 and 10 participants)
     */
    validateConsiliumParticipants(participants: ConsiliumParticipant[]): ConsiliumParticipant[];
    /**
     * Mode 1: Solo Mode (Standard 1-on-1 execution)
     */
    private runSolo;
    /**
     * Mode: Interview Mode (Structured technical or executive interview)
     */
    private runInterview;
    /**
     * Mode 2: Broadcast Mode (Query N models concurrently)
     */
    private runBroadcast;
    /**
     * Mode 3: Dual-model Dialogue Mode (2 models exchange arguments over K rounds)
     */
    private runDialogue;
    /**
     * Mode 4: Consilium Mode (3 to 10 models discuss in rounds, then synthesizer produces consensus)
     */
    private runConsilium;
    private createTurn;
    private calculateCostSummary;
}
