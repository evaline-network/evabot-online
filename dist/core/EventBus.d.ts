/**
 * Decoupled EventBus for inter-plugin communication
 */
export type EventCallback = (payload?: any) => void;
export declare class EventBus {
    private static instance;
    private listeners;
    static getInstance(): EventBus;
    on(event: string, callback: EventCallback): void;
    off(event: string, callback: EventCallback): void;
    emit(event: string, payload?: any): void;
}
