import fs from 'node:fs';
import path from 'node:path';
import { logger, LogCategory } from './Logger.js';

export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  category: string;
  language: 'en' | 'uk' | 'ru' | 'pl' | 'ro' | 'de';
  tags: string[];
  source: string;
  metadata?: Record<string, any>;
}

export type KnowledgeBackend = 'memory' | 'json' | 'sqlite' | 'vector';

export interface KnowledgeBackendInfo {
  id: KnowledgeBackend;
  name: string;
  description: string;
  enabled: boolean;
  documentCount: number;
  languages: string[];
  sources: string[];
}

export class KnowledgeBase {
  private static instance: KnowledgeBase;
  private documents: Map<string, KnowledgeDocument> = new Map();
  private activeBackend: KnowledgeBackend = 'memory';
  private knowledgeBasePath: string;
  private initialized: boolean = false;

  private constructor() {
    this.knowledgeBasePath = path.resolve(process.cwd(), 'knowledge-base');
  }

  public static getInstance(): KnowledgeBase {
    if (!KnowledgeBase.instance) {
      KnowledgeBase.instance = new KnowledgeBase();
    }
    return KnowledgeBase.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized) return;
    
    logger.info(LogCategory.KB, 'INIT', 'Initializing Knowledge Base', {
      path: this.knowledgeBasePath,
      backends: ['memory', 'json', 'sqlite', 'vector'],
    });

    await this.loadFromEvaLine();
    this.initialized = true;
    
    logger.info(LogCategory.KB, 'INIT', 'Knowledge Base initialized', {
      totalDocs: this.documents.size,
      activeBackend: this.activeBackend,
    });
  }

  private async loadFromEvaLine(): Promise<void> {
    const evalinePath = path.join(this.knowledgeBasePath, 'evaline-com-ua');
    if (!fs.existsSync(evalinePath)) {
      logger.warn(LogCategory.KB, 'LOAD', 'EvaLine path not found', { path: evalinePath });
      return;
    }

    const sitePath = path.join(evalinePath, 'site');
    if (fs.existsSync(sitePath)) {
      const languages = ['en', 'uk', 'ru', 'pl', 'ro', 'de'];
      for (const lang of languages) {
        const langPath = path.join(sitePath, lang);
        if (fs.existsSync(langPath)) {
          await this.loadLanguageDirectory(langPath, lang as any);
        }
      }
    }

    const summaryPath = path.join(evalinePath, 'site', 'SUMMARY.md');
    if (fs.existsSync(summaryPath)) {
      this.addDocument({
        id: 'evaline-summary',
        title: 'EvaLine Company Summary',
        content: fs.readFileSync(summaryPath, 'utf8'),
        category: 'company-overview',
        language: 'en',
        tags: ['summary', 'evaline', 'overview'],
        source: 'evaline-com-ua/site/SUMMARY.md',
      });
    }

    const conversionPath = path.join(evalinePath, 'site', 'conversion_stats.json');
    if (fs.existsSync(conversionPath)) {
      try {
        const stats = JSON.parse(fs.readFileSync(conversionPath, 'utf8'));
        this.addDocument({
          id: 'evaline-conversion-stats',
          title: 'EvaLine Conversion Statistics',
          content: JSON.stringify(stats, null, 2),
          category: 'analytics',
          language: 'en',
          tags: ['conversion', 'analytics', 'stats'],
          source: 'evaline-com-ua/site/conversion_stats.json',
          metadata: stats,
        });
      } catch (e: any) {
        logger.warn(LogCategory.KB, 'LOAD', 'Failed to parse conversion_stats.json', { error: e.message });
      }
    }

    for (const lang of ['en', 'ru', 'uk'] as const) {
      const readmePath = path.join(this.knowledgeBasePath, 'evaline-com-ua', `README.${lang}.md`);
      if (fs.existsSync(readmePath)) {
        this.addDocument({
          id: `evaline-readme-${lang}`,
          title: `EvaLine README (${lang.toUpperCase()})`,
          content: fs.readFileSync(readmePath, 'utf8'),
          category: 'company-overview',
          language: lang,
          tags: ['readme', 'evaline', 'docs', lang],
          source: `evaline-com-ua/README.${lang}.md`,
        });
      }
    }

    for (const lang of ['en', 'ru', 'uk'] as const) {
      const reportFile = path.join(this.knowledgeBasePath, 'evaline-com-ua', `REPORT.${lang}.md`);
      if (fs.existsSync(reportFile)) {
        this.addDocument({
          id: `evaline-report-${lang}`,
          title: `EvaLine Report (${lang.toUpperCase()})`,
          content: fs.readFileSync(reportFile, 'utf8'),
          category: 'company-report',
          language: lang,
          tags: ['report', 'evaline', 'business', lang],
          source: `evaline-com-ua/REPORT.${lang}.md`,
        });
      }
    }
  }

  private async loadLanguageDirectory(dirPath: string, language: 'en' | 'uk' | 'ru' | 'pl' | 'ro' | 'de'): Promise<void> {
    const items = fs.readdirSync(dirPath);
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isFile() && item.endsWith('.md')) {
        const id = `evaline-${language}-${item.replace('.md', '').toLowerCase()}`;
        const content = fs.readFileSync(itemPath, 'utf8');
        const titleMatch = content.match(/^#\s+(.+)$/m);
        const title = titleMatch ? titleMatch[1] : item.replace('.md', '');
        
        this.addDocument({
          id,
          title,
          content,
          category: this.inferCategory(itemPath),
          language,
          tags: [language, 'evaline', 'product'],
          source: path.relative(this.knowledgeBasePath, itemPath),
        });
      } else if (stat.isDirectory()) {
        await this.loadLanguageDirectory(itemPath, language);
      }
    }
  }

  private inferCategory(filePath: string): string {
    const lower = filePath.toLowerCase();
    if (lower.includes('b2b')) return 'b2b';
    if (lower.includes('b2c')) return 'b2c';
    if (lower.includes('certif')) return 'certificates';
    if (lower.includes('contact') || lower.includes('kontakt')) return 'contact';
    if (lower.includes('about') || lower.includes('pro-nas') || lower.includes('uber')) return 'about';
    if (lower.includes('wholesale') || lower.includes('poshuk-partneriv') || lower.includes('poisk-partnerov')) return 'wholesale';
    if (lower.includes('donate') || lower.includes('dopomoga')) return 'donate';
    if (lower.includes('news') || lower.includes('novini')) return 'news';
    if (lower.includes('index')) return 'home';
    return 'general';
  }

  public addDocument(doc: KnowledgeDocument): void {
    this.documents.set(doc.id, doc);
    logger.debug(LogCategory.KB, 'ADD', `Document added: ${doc.id}`, {
      title: doc.title,
      category: doc.category,
      language: doc.language,
      size: doc.content.length,
    });
  }

  public removeDocument(id: string): boolean {
    const removed = this.documents.delete(id);
    if (removed) {
      logger.info(LogCategory.KB, 'REMOVE', `Document removed: ${id}`);
    }
    return removed;
  }

  public listDocuments(filter?: { language?: string; category?: string; tag?: string }): KnowledgeDocument[] {
    let docs = Array.from(this.documents.values());
    if (filter?.language) {
      docs = docs.filter(d => d.language === filter.language);
    }
    if (filter?.category) {
      docs = docs.filter(d => d.category === filter.category);
    }
    if (filter?.tag) {
      docs = docs.filter(d => d.tags.includes(filter.tag!));
    }
    return docs;
  }

  public search(query: string, options?: { language?: string; category?: string; limit?: number; minScore?: number }): KnowledgeDocument[] {
    const limit = options?.limit || 5;
    const minScore = options?.minScore || 0.1;
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2);

    const results: Array<{ doc: KnowledgeDocument; score: number }> = [];

    for (const doc of this.documents.values()) {
      if (options?.language && doc.language !== options.language) continue;
      if (options?.category && doc.category !== options.category) continue;

      const contentLower = (doc.title + ' ' + doc.content + ' ' + doc.tags.join(' ')).toLowerCase();
      let score = 0;
      let matches = 0;

      for (const word of queryWords) {
        const count = (contentLower.match(new RegExp(word, 'g')) || []).length;
        if (count > 0) {
          score += count * 0.1;
          matches++;
        }
      }

      if (queryLower.includes(doc.title.toLowerCase())) score += 0.5;
      for (const tag of doc.tags) {
        if (queryLower.includes(tag)) score += 0.2;
      }

      if (matches > 0) {
        score = Math.min(0.99, score);
        if (score >= minScore) {
          results.push({ doc, score });
        }
      }
    }

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, limit).map(r => r.doc);
  }

  public setBackend(backend: KnowledgeBackend): void {
    const old = this.activeBackend;
    this.activeBackend = backend;
    logger.info(LogCategory.KB, 'BACKEND', `Backend switched: ${old} -> ${backend}`);
  }

  public getBackend(): KnowledgeBackend {
    return this.activeBackend;
  }

  public getStats(): KnowledgeBackendInfo {
    const docs = Array.from(this.documents.values());
    const languages = new Set<string>();
    const sources = new Set<string>();
    
    for (const doc of docs) {
      languages.add(doc.language);
      sources.add(doc.source);
    }

    const BACKEND_INFO: Record<KnowledgeBackend, { name: string; description: string }> = {
      memory: { name: 'In-Memory', description: 'Documents loaded into RAM (fastest, no persistence)' },
      json: { name: 'JSON File', description: 'Documents saved as JSON files in ./knowledge-base/' },
      sqlite: { name: 'SQLite FTS5', description: 'FTS5 full-text search (offline, persistent, fast)' },
      vector: { name: 'Vector Database', description: 'ChromaDB / Qdrant for semantic search (requires embeddings)' },
    };

    const info = BACKEND_INFO[this.activeBackend];
    return {
      id: this.activeBackend,
      name: info.name,
      description: info.description,
      enabled: true,
      documentCount: docs.length,
      languages: Array.from(languages),
      sources: Array.from(sources),
    };
  }

  public getAvailableBackends(): KnowledgeBackendInfo[] {
    const stats = this.getStats();
    return [
      {
        id: 'memory',
        name: 'In-Memory',
        description: 'Documents loaded into RAM (fastest, no persistence)',
        enabled: true,
        documentCount: stats.documentCount,
        languages: [...stats.languages],
        sources: [...stats.sources],
      },
      {
        id: 'json',
        name: 'JSON File Storage',
        description: 'Documents saved as JSON files in ./knowledge-base/',
        enabled: true,
        documentCount: 0,
        languages: [],
        sources: [],
      },
      {
        id: 'sqlite',
        name: 'SQLite Database',
        description: 'FTS5 full-text search (offline, persistent, fast)',
        enabled: false,
        documentCount: 0,
        languages: [],
        sources: [],
      },
      {
        id: 'vector',
        name: 'Vector Database',
        description: 'ChromaDB / Qdrant for semantic search (requires embeddings)',
        enabled: false,
        documentCount: 0,
        languages: [],
        sources: [],
      },
    ];
  }

  public formatSearchResults(docs: KnowledgeDocument[], query: string): string {
    if (docs.length === 0) {
      return `\n[KB] No results for: "${query}"\n`;
    }

    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push(`  📚 KNOWLEDGE BASE RESULTS (${docs.length} documents)`);
    lines.push(`  Query: "${query}"`);
    lines.push(`  Backend: ${this.getStats().name}`);
    lines.push('═'.repeat(78));
    
    for (let i = 0; i < docs.length; i++) {
      const doc = docs[i];
      lines.push('');
      lines.push(`  [${i + 1}] ${doc.title}`);
      lines.push(`      ID: ${doc.id}`);
      lines.push(`      Category: ${doc.category} | Language: ${doc.language.toUpperCase()}`);
      lines.push(`      Tags: ${doc.tags.join(', ')}`);
      lines.push(`      Source: ${doc.source}`);
      const preview = doc.content.substring(0, 200).replace(/\n/g, ' ');
      lines.push(`      Preview: ${preview}${doc.content.length > 200 ? '...' : ''}`);
    }
    
    return lines.join('\n');
  }
}

export const knowledgeBase = KnowledgeBase.getInstance();
