import { logger, LogCategory } from './Logger.js';
const SUSPICIOUS_PATTERNS = [
    /^\/wp-/i, // WordPress paths
    /^\/wordpress/i,
    /^\/blog\/wp-/i,
    /wp-json/i, // WordPress REST API
    /xmlrpc\.php/i, // WordPress XML-RPC
    /\/admin\//i, // Admin panels
    /phpmyadmin/i, // phpMyAdmin
    /\.env$/i, // .env files
    /\.git/i, // .git exposure
    /backup/i, // Backup files
    /\/\.ssh/i, // SSH keys
    /\/etc\/passwd/i, // LFI attempts
    /\/proc\//i, // /proc/ exposure
    /eval\s*\(/i, // eval() injection
    /base64_decode\s*\(/i, // base64 decode
    /\/cgi-bin/i, // CGI shellshock
    /\.php$/i, // PHP files (we don't use)
];
export const securityConfig = {
    rateLimit: {
        windowMs: 60_000,
        maxRequests: 100,
    },
    suspiciousPaths: SUSPICIOUS_PATTERNS.map(p => new RegExp(p.source, p.flags)),
    blockedIPs: new Set([
        '45.148.10.9',
        '43.157.188.74',
        '159.195.17.105',
        '67.205.2.98',
        '43.166.136.202',
        '43.165.2.110',
        '43.164.1.211',
        '43.156.232.154',
    ]),
    autoBlockThreshold: 20,
    autoBlockDurationMs: 24 * 60 * 60 * 1000,
};
const ipStore = new Map();
export class Security {
    static checkRateLimit(ip) {
        if (securityConfig.blockedIPs.has(ip)) {
            return { allowed: false, remaining: 0, resetIn: -1 };
        }
        const now = Date.now();
        let entry = ipStore.get(ip);
        if (!entry || entry.resetAt < now) {
            entry = { count: 1, resetAt: now + securityConfig.rateLimit.windowMs };
            ipStore.set(ip, entry);
            return { allowed: true, remaining: securityConfig.rateLimit.maxRequests - 1, resetIn: securityConfig.rateLimit.windowMs };
        }
        entry.count++;
        const remaining = Math.max(0, securityConfig.rateLimit.maxRequests - entry.count);
        const allowed = entry.count <= securityConfig.rateLimit.maxRequests;
        if (!allowed) {
            const suspiciousCount = entry.suspiciousCount || 0;
            if (suspiciousCount >= securityConfig.autoBlockThreshold) {
                entry.blockedUntil = now + securityConfig.autoBlockDurationMs;
                securityConfig.blockedIPs.add(ip);
                logger.error(LogCategory.SYSTEM, 'SECURITY', `AUTO-BLOCKED IP: ${ip} (too many suspicious requests)`, {
                    totalCount: entry.count,
                    suspiciousCount,
                });
            }
        }
        return { allowed, remaining, resetIn: entry.resetAt - now };
    }
    static isSuspicious(path, method) {
        for (const pattern of securityConfig.suspiciousPaths) {
            if (pattern.test(path)) {
                const reason = `${method} ${path} matches ${pattern.source}`;
                return { suspicious: true, reason };
            }
        }
        return { suspicious: false };
    }
    static recordSuspicious(ip, reason) {
        const entry = ipStore.get(ip);
        if (entry) {
            entry.suspiciousCount = (entry.suspiciousCount || 0) + 1;
        }
        logger.warn(LogCategory.SYSTEM, 'SECURITY', `Suspicious request from ${ip}: ${reason}`);
    }
    static blockIP(ip, reason, durationMs = securityConfig.autoBlockDurationMs) {
        securityConfig.blockedIPs.add(ip);
        const entry = ipStore.get(ip) || { count: 0, resetAt: Date.now() + securityConfig.rateLimit.windowMs };
        entry.blockedUntil = Date.now() + durationMs;
        ipStore.set(ip, entry);
        logger.warn(LogCategory.SYSTEM, 'SECURITY', `MANUAL BLOCK: ${ip} for ${durationMs}ms`, { reason });
    }
    static unblockIP(ip) {
        securityConfig.blockedIPs.delete(ip);
        const entry = ipStore.get(ip);
        if (entry)
            entry.blockedUntil = undefined;
        logger.info(LogCategory.SYSTEM, 'SECURITY', `UNBLOCKED: ${ip}`);
    }
    static getStats() {
        return {
            blockedIPs: Array.from(securityConfig.blockedIPs),
            suspiciousPatterns: securityConfig.suspiciousPaths.length,
            totalTracked: ipStore.size,
        };
    }
    static getSecurityReport() {
        const stats = this.getStats();
        const lines = [];
        lines.push('');
        lines.push('═'.repeat(78));
        lines.push('  🛡️  SECURITY STATUS REPORT');
        lines.push('═'.repeat(78));
        lines.push('');
        lines.push(`  Blocked IPs:       ${stats.blockedIPs.length}`);
        if (stats.blockedIPs.length > 0) {
            for (const ip of stats.blockedIPs) {
                lines.push(`    🚫 ${ip}`);
            }
        }
        else {
            lines.push('    (none)');
        }
        lines.push('');
        lines.push(`  Suspicious patterns: ${stats.suspiciousPatterns} regex rules`);
        lines.push(`  Tracked IPs:         ${stats.totalTracked}`);
        lines.push('');
        lines.push('  Rate Limit Config:');
        lines.push(`    Window: ${securityConfig.rateLimit.windowMs / 1000}s`);
        lines.push(`    Max requests: ${securityConfig.rateLimit.maxRequests}`);
        lines.push(`    Auto-block threshold: ${securityConfig.autoBlockThreshold} suspicious requests`);
        lines.push(`    Auto-block duration: ${securityConfig.autoBlockDurationMs / (60 * 60 * 1000)}h`);
        lines.push('');
        return lines.join('\n');
    }
}
