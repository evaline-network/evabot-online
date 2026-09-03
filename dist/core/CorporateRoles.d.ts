export interface CorporateRole {
    id: string;
    name: string;
    title: string;
    department: string;
    description: string;
    preferredModel: string;
    systemPrompt: string;
    suggestedTemperature: number;
    knowledgeAccessLevel: 'public' | 'internal' | 'confidential' | 'restricted';
}
export declare const CORPORATE_ROLES: Record<string, CorporateRole>;
export interface KnowledgeDocument {
    id: string;
    title: string;
    category: 'architecture' | 'infrastructure' | 'security' | 'database' | 'general';
    content: string;
    source: string;
    tags: string[];
    relevanceScore?: number;
}
export interface KnowledgeSearchOptions {
    category?: string;
    limit?: number;
    minScore?: number;
}
/**
 * Knowledge Base Connector Stub for EvaLine hybrid databases (PostgreSQL + Qdrant Vector Store)
 */
export declare class KnowledgeBaseConnector {
    private static companyDatabase;
    /**
     * Searches the hybrid database using keyword matching and simulated vector score
     */
    search(query: string, options?: KnowledgeSearchOptions): Promise<KnowledgeDocument[]>;
    /**
     * Retrieves a document by its unique ID
     */
    getDocumentById(id: string): Promise<KnowledgeDocument | null>;
    /**
     * Formats retrieved documents into a context block suitable for LLM injection
     */
    formatContextForPrompt(docs: KnowledgeDocument[]): string;
    /**
     * Lists all available knowledge base documents
     */
    listAllDocuments(): KnowledgeDocument[];
}
