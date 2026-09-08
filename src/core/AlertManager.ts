import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { logger, LogCategory } from './Logger.js';

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';
export type AlertChannel = 'console' | 'file' | 'webhook' | 'email' | 'syslog' | 'desktop';

interface ConsoleConfig { colors?: boolean }
interface FileConfig { path: string }
interface WebhookConfig { url: string; method?: string }
interface SyslogConfig { facility?: number; host?: string; port?: number }
interface EmailConfig { smtp?: unknown; to?: string[]; from?: string }
interface DesktopConfig { sound?: boolean }

type ChannelConfig = ConsoleConfig | FileConfig | WebhookConfig | SyslogConfig | EmailConfig | DesktopConfig;

export interface AlertEvent {
  id: string;
  timestamp: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  source: string;
  metadata?: Record<string, unknown>;
  channels: AlertChannel[];
}

export interface AlertChannelConfig {
  type: AlertChannel;
  enabled: boolean;
  config: ChannelConfig;
}

export interface AlertConfig {
  channels: AlertChannelConfig[];
  thresholds: {
    errorRate: number;
    suspiciousActivity: number;
    responseTimeMs: number;
  };
  rateLimit: {
    maxPerHour: number;
    cooldownMs: number;
  };
}

const DEFAULT_ALERT_CONFIG: AlertConfig = {
  channels: [
    { type: 'console', enabled: true, config: { colors: true } },
    { type: 'file', enabled: true, config: { path: 'logs/alerts.log' } },
    { type: 'syslog', enabled: false, config: { facility: 16 } },
    { type: 'webhook', enabled: false, config: { url: '', method: 'POST' } },
    { type: 'email', enabled: false, config: { smtp: {}, to: [], from: '' } },
    { type: 'desktop', enabled: false, config: { sound: true } },
  ],
  thresholds: {
    errorRate: 5,
    suspiciousActivity: 3,
    responseTimeMs: 5000,
  },
  rateLimit: {
    maxPerHour: 100,
    cooldownMs: 60_000,
  },
};

const SEVERITY_COLORS: Record<AlertSeverity, string> = {
  low: '\x1b[36m',
  medium: '\x1b[33m',
  high: '\x1b[31m',
  critical: '\x1b[1m\x1b[41m\x1b[37m',
};

const SEVERITY_EMOJI: Record<AlertSeverity, string> = {
  low: '[LOW]',
  medium: '[MED]',
  high: '[HIGH]',
  critical: '[CRIT]',
};

export class AlertManager {
  private static instance: AlertManager;
  private config: AlertConfig = DEFAULT_ALERT_CONFIG;
  private recentAlerts: Map<string, number> = new Map();
  private alerts: AlertEvent[] = [];
  private maxAlerts: number = 1000;

  private constructor() {
    this.loadConfig();
  }

  public static getInstance(): AlertManager {
    if (!AlertManager.instance) AlertManager.instance = new AlertManager();
    return AlertManager.instance;
  }

  private loadConfig(): void {
    try {
      const env = process.env;
      if (env.ALERT_WEBHOOK_URL) {
        const ch = this.config.channels.find((c) => c.type === 'webhook');
        if (ch) {
          ch.enabled = true;
          (ch.config as WebhookConfig).url = env.ALERT_WEBHOOK_URL;
        }
      }
      if (env.ALERT_EMAIL_TO) {
        const ch = this.config.channels.find((c) => c.type === 'email');
        if (ch) {
          ch.enabled = true;
          (ch.config as EmailConfig).to = env.ALERT_EMAIL_TO.split(',');
        }
      }
      if (env.SYSLOG_HOST) {
        const ch = this.config.channels.find((c) => c.type === 'syslog');
        if (ch) {
          ch.enabled = true;
          (ch.config as SyslogConfig).host = env.SYSLOG_HOST;
          (ch.config as SyslogConfig).port = parseInt(env.SYSLOG_PORT || '514', 10);
        }
      }
    } catch {
      // Use defaults
    }
  }

  public async alert(
    severity: AlertSeverity,
    title: string,
    message: string,
    source: string = 'system',
    metadata?: Record<string, unknown>,
  ): Promise<AlertEvent> {
    if (this.isRateLimited(title)) {
      logger.debug(LogCategory.SYSTEM, 'ALERT', `Rate limited: ${title}`);
      return {
        id: 'rate-limited', timestamp: new Date().toISOString(),
        severity, title, message, source, metadata, channels: [],
      };
    }

    const event: AlertEvent = {
      id: this.generateId(),
      timestamp: new Date().toISOString(),
      severity, title, message, source, metadata,
      channels: this.config.channels.filter((c) => c.enabled).map((c) => c.type),
    };

    this.alerts.push(event);
    if (this.alerts.length > this.maxAlerts) this.alerts.shift();

    await this.deliver(event);

    logger.warn(LogCategory.SYSTEM, 'ALERT', `${severity.toUpperCase()}: ${title} - ${message}`, metadata);
    return event;
  }

  public async low(title: string, message: string, source?: string, metadata?: Record<string, unknown>) {
    return this.alert('low', title, message, source, metadata);
  }
  public async medium(title: string, message: string, source?: string, metadata?: Record<string, unknown>) {
    return this.alert('medium', title, message, source, metadata);
  }
  public async high(title: string, message: string, source?: string, metadata?: Record<string, unknown>) {
    return this.alert('high', title, message, source, metadata);
  }
  public async critical(title: string, message: string, source?: string, metadata?: Record<string, unknown>) {
    return this.alert('critical', title, message, source, metadata);
  }

  private async deliver(event: AlertEvent): Promise<void> {
    for (const channel of this.config.channels.filter((c) => c.enabled)) {
      try {
        switch (channel.type) {
          case 'console': this.deliverConsole(event, channel.config as ConsoleConfig); break;
          case 'file': this.deliverFile(event, channel.config as FileConfig); break;
          case 'webhook': await this.deliverWebhook(event, channel.config as WebhookConfig); break;
          case 'email': await this.deliverEmail(event, channel.config as EmailConfig); break;
          case 'syslog': await this.deliverSyslog(event, channel.config as SyslogConfig); break;
          case 'desktop': this.deliverDesktop(event, channel.config as DesktopConfig); break;
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        logger.error(LogCategory.SYSTEM, 'ALERT_DELIVERY', `Failed to deliver to ${channel.type}: ${msg}`);
      }
    }
  }

  private deliverConsole(event: AlertEvent, config: ConsoleConfig): void {
    const color = SEVERITY_COLORS[event.severity];
    const emoji = SEVERITY_EMOJI[event.severity];
    const line = `${emoji} ${color}[${event.severity.toUpperCase()}]${'\x1b[0m'} ${event.title}\n   ${event.message}`;
    console.log(`\n${line}\n   Source: ${event.source} | ${event.timestamp}\n`);
    if (config.colors && event.severity === 'critical') {
      try { process.stdout.write('\x07'); } catch {}
    }
  }

  private deliverFile(event: AlertEvent, config: FileConfig): void {
    try {
      const logPath = path.resolve(process.cwd(), config.path);
      const dir = path.dirname(logPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const line = JSON.stringify(event) + '\n';
      fs.appendFileSync(logPath, line);
    } catch {}
  }

  private async deliverWebhook(event: AlertEvent, config: WebhookConfig): Promise<void> {
    if (!config.url) return;
    const payload = {
      event_type: 'evabot_alert',
      severity: event.severity,
      title: event.title,
      message: event.message,
      source: event.source,
      timestamp: event.timestamp,
      host: os.hostname(),
      metadata: event.metadata,
    };
    const response = await fetch(config.url, {
      method: config.method || 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  }

  private async deliverEmail(event: AlertEvent, config: EmailConfig): Promise<void> {
    // Реализация через SMTP (nodemailer в production)
    logger.info(LogCategory.SYSTEM, 'ALERT_EMAIL', `Email would be sent to ${config.to}: ${event.title}`);
  }

  private async deliverSyslog(event: AlertEvent, config: SyslogConfig): Promise<void> {
    const net = await import('node:dgram');
    const client = net.createSocket('udp4');
    const severity = { low: 6, medium: 4, high: 3, critical: 2 }[event.severity];
    const priority = (config.facility || 16) * 8 + severity;
    const msg = `<${priority}>${event.title}: ${event.message}`;
    client.send(msg, config.port || 514, config.host || 'localhost');
    client.close();
  }

  private deliverDesktop(event: AlertEvent, config: DesktopConfig): void {
    if (config.sound) {
      try { process.stdout.write('\x07\x07\x07'); } catch {}
    }
  }

  private isRateLimited(title: string): boolean {
    const key = `${title}`;
    const now = Date.now();
    const lastSent = this.recentAlerts.get(key);
    if (lastSent && (now - lastSent) < this.config.rateLimit.cooldownMs) {
      return true;
    }
    this.recentAlerts.set(key, now);
    return false;
  }

  private generateId(): string {
    return `alert-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }

  public getRecentAlerts(limit: number = 50, severity?: AlertSeverity): AlertEvent[] {
    let filtered = [...this.alerts];
    if (severity) filtered = filtered.filter((a) => a.severity === severity);
    return filtered.slice(-limit).reverse();
  }

  public getConfig(): AlertConfig {
    return this.config;
  }

  public setChannelEnabled(type: AlertChannel, enabled: boolean): void {
    const ch = this.config.channels.find((c) => c.type === type);
    if (ch) ch.enabled = enabled;
  }

  public getStats(): {
    totalAlerts: number;
    bySeverity: Record<AlertSeverity, number>;
    activeChannels: AlertChannel[];
  } {
    const bySeverity: Record<AlertSeverity, number> = { low: 0, medium: 0, high: 0, critical: 0 };
    for (const a of this.alerts) bySeverity[a.severity]++;
    return {
      totalAlerts: this.alerts.length,
      bySeverity,
      activeChannels: this.config.channels.filter((c) => c.enabled).map((c) => c.type),
    };
  }
}

export const alertManager = AlertManager.getInstance();
