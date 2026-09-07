export interface DomainAccessLog {
    timeStr: string;
    host: string;
    method: string;
    uri: string;
    status: number;
    statusLevel: 'ok' | 'warn' | 'err';
    proto: string;
    ip: string;
    durationMs: number;
}
export interface SystemLogEntry {
    timeStr: string;
    level: string;
    levelClass: 'ok' | 'warn' | 'err';
    subsystem: string;
    message: string;
}
export interface ProcessInfo {
    name: string;
    role: string;
    node: string;
    pid: number;
    cpu: string;
    mem: string;
    status: string;
    statusClass: 'ok' | 'warn' | 'err';
}
export interface MicroVmRealMetrics {
    uptimeStr: string;
    loadAvg: string;
    cpuPct: number;
    memTotalMb: number;
    memUsedMb: number;
    memFreeMb: number;
    memAvailMb: number;
    caddyPid: number;
    caddyCpu: string;
    caddyMem: string;
    lastUpdated: string;
}
export declare class ClusterMonitor {
    private static domainLogs;
    private static isPolling;
    private static pollTimer;
    private static meshLatencyMs;
    private static microMetrics;
    static init(): void;
    private static refreshClusterData;
    static getDomainLogs(): DomainAccessLog[];
    static getSystemLogs(): SystemLogEntry[];
    static getProcesses(): ProcessInfo[];
    static getMicroMetrics(): MicroVmRealMetrics;
    static getMeshLatency(): number;
}
