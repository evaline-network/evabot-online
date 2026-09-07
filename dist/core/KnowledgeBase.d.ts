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
export declare class KnowledgeBase {
    private static instance;
    private documents;
    private activeBackend;
    private knowledgeBasePath;
    private initialized;
    private constructor();
    static getInstance(): KnowledgeBase;
    initialize(): Promise<void>;
    private loadFromEvaLine;
    private loadLanguageDirectory;
    private inferCategory;
    addDocument(doc: KnowledgeDocument): void;
    removeDocument(id: string): boolean;
    listDocuments(filter?: {
        language?: string;
        category?: string;
        tag?: string;
    }): KnowledgeDocument[];
    search(query: string, options?: {
        language?: string;
        category?: string;
        limit?: number;
        minScore?: number;
    }): KnowledgeDocument[];
    setBackend(backend: KnowledgeBackend): void;
    getBackend(): KnowledgeBackend;
    getStats(): KnowledgeBackendInfo;
    getAvailableBackends(): KnowledgeBackendInfo[];
    formatSearchResults(docs: KnowledgeDocument[], query: string): string;
}
export declare const knowledgeBase: KnowledgeBase;
