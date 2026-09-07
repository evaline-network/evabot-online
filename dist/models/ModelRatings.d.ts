import { GeminiModelInfo } from './ModelRegistry.js';
export type ModelRatingDimension = 'quality' | 'speed' | 'context' | 'cost';
export interface ModelRating {
    modelId: string;
    quality: number;
    speed: number;
    context: number;
    cost: number;
    composite: number;
}
export interface TopModelEntry {
    rank: number;
    model: GeminiModelInfo;
    rating: ModelRating;
    reason: string;
}
export declare class ModelRatings {
    static computeRating(model: GeminiModelInfo): ModelRating;
    private static computeQualityScore;
    private static computeSpeedScore;
    private static computeContextScore;
    private static computeCostScore;
    static rankByDimension(dimension: ModelRatingDimension, limit?: number, freeOnly?: boolean): TopModelEntry[];
    static getTopOverall(freeOnly?: boolean, limit?: number): TopModelEntry[];
    static getTopFree(limit?: number): TopModelEntry[];
    static getTopPaid(limit?: number): TopModelEntry[];
    static getTopBySpeed(freeOnly?: boolean, limit?: number): TopModelEntry[];
    static getTopByContext(freeOnly?: boolean, limit?: number): TopModelEntry[];
    private static getRankReason;
    static formatTopList(entries: TopModelEntry[], title: string): string;
}
export declare class ModelCommand {
    static execute(command: string): string;
    private static handleTop;
    private static handleFree;
    private static handlePaid;
    private static handleModels;
}
