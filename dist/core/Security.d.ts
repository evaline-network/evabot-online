export interface RateLimitEntry {
    count: number;
    resetAt: number;
    blockedUntil?: number;
}
export interface SecurityConfig {
    rateLimit: {
        windowMs: number;
        maxRequests: number;
    };
    suspiciousPaths: RegExp[];
    blockedIPs: Set<string>;
    autoBlockThreshold: number;
    autoBlockDurationMs: number;
}
export declare const securityConfig: SecurityConfig;
export declare class Security {
    static checkRateLimit(ip: string): {
        allowed: boolean;
        remaining: number;
        resetIn: number;
    };
    static isSuspicious(path: string, method: string): {
        suspicious: boolean;
        reason?: string;
    };
    static recordSuspicious(ip: string, reason: string): void;
    static blockIP(ip: string, reason: string, durationMs?: number): void;
    static unblockIP(ip: string): void;
    static getStats(): {
        blockedIPs: string[];
        suspiciousPatterns: number;
        totalTracked: number;
    };
    static getSecurityReport(): string;
}
