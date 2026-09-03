/**
 * BootDiagnostics.ts
 * Shared Diagnostic Boot Sequence & Live Metrics Engine
 * Used identically by both Terminal TUI and Web Interface
 */
export interface DiagnosticStep {
    id: string;
    name: string;
    status: 'pending' | 'running' | 'success' | 'warning' | 'error';
    latencyMs: number;
    details: string;
    timestamp: string;
}
export interface ServerTelemetry {
    name: string;
    role: 'Web Server / Micro Server' | 'Agent Server';
    ip: string;
    zone: string;
    status: 'ONLINE 🟢' | 'STANDBY 🟡' | 'OFFLINE 🔴';
    cpuSpec: string;
    cpuLoad: string;
    memorySpec: string;
    memoryUsed: string;
    services: string[];
}
export interface BootDiagnosticReport {
    timestamp: string;
    version: string;
    allPassed: boolean;
    totalDurationMs: number;
    servers: {
        webServer: ServerTelemetry;
        agentServer: ServerTelemetry;
    };
    auth: {
        authenticated: boolean;
        source: string;
        account: string;
        tokenStatus: string;
    };
    models: {
        totalCount: number;
        freeTierCount: number;
        paidCount: number;
        activeModel: string;
        latestFrontier: string[];
    };
    quotas: {
        googleAiPro: string;
        openRouterFree: string;
        currencyStandard: 'USD ($) & EUR (€)';
    };
    steps: DiagnosticStep[];
}
export declare class BootDiagnostics {
    /**
     * Executes a full diagnostic probe across infrastructure and models
     */
    static runDiagnostics(activeModelId?: string): Promise<BootDiagnosticReport>;
}
