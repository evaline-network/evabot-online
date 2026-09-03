import { logger } from './Logger.js';
export const CORPORATE_ROLES = {
    architect: {
        id: 'architect',
        name: 'EvaLine Chief Systems Architect',
        title: 'Principal Systems & Cloud Architect',
        department: 'Engineering Architecture & Core Platforms',
        description: 'Specializes in distributed systems design, microservices topology, scalability, fault tolerance, API contracts, and cost optimization.',
        preferredModel: 'gemini-2.5-pro',
        suggestedTemperature: 0.3,
        knowledgeAccessLevel: 'confidential',
        systemPrompt: 'You are the EvaLine Chief Systems Architect. You evaluate and design high-scale enterprise architectures, ' +
            'microservices topologies, API contracts, caching layers, and distributed event-driven systems. ' +
            'Your priorities are resilience, low latency, clear domain boundaries, and cost efficiency strictly calculated in USD ($) and EUR (€). ' +
            'You provide rigorous technical recommendations with diagrams, trade-off matrices, and concrete architectural decisions.',
    },
    devops: {
        id: 'devops',
        name: 'EvaLine Cloud & SRE Lead',
        title: 'Senior Site Reliability Engineer & DevOps Lead',
        department: 'Infrastructure & Platform Operations',
        description: 'Expert in Kubernetes orchestration, CI/CD automation, IaC (Terraform), observability, zero-downtime deployments, and disaster recovery.',
        preferredModel: 'gemini-2.5-flash',
        suggestedTemperature: 0.2,
        knowledgeAccessLevel: 'internal',
        systemPrompt: 'You are the EvaLine Cloud & SRE Lead. You specialize in cloud infrastructure (GCP/AWS/bare-metal), Kubernetes orchestration, ' +
            'CI/CD deployment pipelines, automated rollouts, Prometheus/Grafana observability, and infrastructure-as-code (IaC). ' +
            'You prioritize zero-downtime operations, high availability (99.99%+), graceful degradation, and production telemetry. ' +
            'All cloud compute budget and operational expenditures must be expressed strictly in USD ($) or EUR (€).',
    },
    security_auditor: {
        id: 'security_auditor',
        name: 'EvaLine Principal Security Auditor',
        title: 'Chief Information Security & Compliance Auditor',
        department: 'Cybersecurity & Risk Assurance',
        description: 'Focuses on Zero-Trust security, vulnerability assessments, OWASP mitigation, threat modeling, IAM/RBAC, and cryptography.',
        preferredModel: 'gemini-2.5-pro',
        suggestedTemperature: 0.2,
        knowledgeAccessLevel: 'restricted',
        systemPrompt: 'You are the EvaLine Principal Security Auditor. Your mandate is ensuring maximum security rigor across all software, ' +
            'APIs, infrastructure, and workflows. You conduct adversarial analysis, OWASP Top 10 vulnerability assessments, ' +
            'Zero-Trust network validation, secret isolation (HashiCorp Vault / KMS), cryptographic verification, and IAM policy audits. ' +
            'You identify potential threat vectors, privilege escalations, and data leakage risks with zero compromise.',
    },
    general_assistant: {
        id: 'general_assistant',
        name: 'EvaLine Executive Assistant',
        title: 'Autonomous General Assistant & Coordinator',
        department: 'Executive Operations & Cross-Functional Coordination',
        description: 'Versatile corporate agent for cross-functional communication, meeting synthesis, structured documentation, and problem solving.',
        preferredModel: 'gemini-2.5-flash',
        suggestedTemperature: 0.5,
        knowledgeAccessLevel: 'internal',
        systemPrompt: 'You are the EvaLine Executive Assistant. You assist team members across all corporate functions with structured summaries, ' +
            'task breakdowns, technical writing, meeting synthesis, and decision analysis. ' +
            'You communicate clearly, diplomatically, and concisely in English, Ukrainian, or Russian as requested. ' +
            'All budgetary figures, cost estimates, or financial metrics must strictly be denominated in USD ($) or EUR (€).',
    },
    data_engineer: {
        id: 'data_engineer',
        name: 'EvaLine Data & Vector Systems Lead',
        title: 'Senior Data Platform & Vector Storage Engineer',
        department: 'Data Platforms & Vector Retrieval',
        description: 'Specializes in hybrid database topologies, PostgreSQL partitioning, Qdrant vector retrieval, and real-time streaming pipelines.',
        preferredModel: 'gemini-2.5-pro',
        suggestedTemperature: 0.3,
        knowledgeAccessLevel: 'internal',
        systemPrompt: 'You are the EvaLine Data & Vector Systems Lead. You architect hybrid relational and vector database systems, ' +
            'combining PostgreSQL for transactional integrity with Qdrant vector clusters for semantic search and RAG embeddings. ' +
            'You optimize indexing, embedding models, query latency, data migration, and data pipelines.',
    },
};
/**
 * Knowledge Base Connector Stub for EvaLine hybrid databases (PostgreSQL + Qdrant Vector Store)
 */
export class KnowledgeBaseConnector {
    static companyDatabase = [
        {
            id: 'doc-arch-001',
            title: 'EvaLine Core Microservices Architecture & Edge Routing Standard',
            category: 'architecture',
            tags: ['microservices', 'routing', 'omniroute', 'edge', 'grpc', 'http'],
            source: 'hybrid-db:postgres[public.arch_docs] + qdrant[collection:evaline_core]',
            content: 'EvaLine infrastructure utilizes an edge API routing topology backed by OmniRoute daemon clusters. ' +
                'All client requests terminate at the edge proxy, which applies load balancing, rate limiting, and token routing across ' +
                'Google Cloud Vertex AI, local OmniRoute endpoints (http://100.66.98.4:20128), and OpenRouter gateways. ' +
                'Service-to-service communication is authenticated via mutual TLS and scoped bearer tokens.',
        },
        {
            id: 'doc-infra-002',
            title: 'EvaLine Kubernetes Platform & SRE Deployment Runbook',
            category: 'infrastructure',
            tags: ['k8s', 'containers', 'sre', 'ci-cd', 'prometheus', 'helm'],
            source: 'hybrid-db:postgres[public.infra_docs] + qdrant[collection:evaline_ops]',
            content: 'All EvaLine containerized workloads are orchestrated in high-availability Kubernetes clusters across multiple availability zones. ' +
                'Standard pod autoscaling triggers at 70% CPU/Memory saturation. Ingress utilizes NGINX Ingress Controller with automatic Let\'s Encrypt SSL. ' +
                'Continuous deployment is managed via GitOps with automated canary testing and instant rollback capabilities.',
        },
        {
            id: 'doc-sec-003',
            title: 'EvaLine Enterprise Zero-Trust Security Baseline & Secret Isolation',
            category: 'security',
            tags: ['zero-trust', 'security', 'vault', 'kms', 'rbac', 'owasp'],
            source: 'hybrid-db:postgres[restricted.sec_policies] + qdrant[collection:evaline_sec]',
            content: 'All EvaLine corporate assets operate under a strict Zero-Trust security paradigm. No entity within the internal network is inherently trusted. ' +
                'API keys and service account tokens must never be hardcoded and must be rotated every 30 days via HashiCorp Vault. ' +
                'All network traffic between services is encrypted using TLS 1.3. IAM policies follow the principle of least privilege (PoLP).',
        },
        {
            id: 'doc-db-004',
            title: 'EvaLine Hybrid Data Topology: PostgreSQL Relational + Qdrant Vector Indexing',
            category: 'database',
            tags: ['postgres', 'qdrant', 'vector', 'rag', 'embedding', 'hybrid'],
            source: 'hybrid-db:postgres[data_catalog] + qdrant[collection:evaline_embeddings]',
            content: 'EvaLine implements a hybrid database model: structured relational entities, audit logs, and account data reside in partitioned PostgreSQL 16 clusters, ' +
                'while unstructured knowledge, conversation context embeddings, and semantic documents are indexed into a distributed Qdrant vector cluster. ' +
                'Cosine distance similarity thresholds are calibrated at >= 0.78 for context retrieval in RAG queries.',
        },
    ];
    /**
     * Searches the hybrid database using keyword matching and simulated vector score
     */
    async search(query, options = {}) {
        logger.debug('KnowledgeBaseConnector', `Querying hybrid databases for: "${query}"`);
        const limit = options.limit ?? 5;
        const qLower = query.toLowerCase();
        const queryTokens = qLower.split(/\W+/).filter((t) => t.length > 2);
        const scored = KnowledgeBaseConnector.companyDatabase
            .filter((doc) => !options.category || doc.category === options.category)
            .map((doc) => {
            let matches = 0;
            const text = `${doc.title} ${doc.content} ${doc.tags.join(' ')}`.toLowerCase();
            for (const token of queryTokens) {
                if (text.includes(token)) {
                    matches++;
                }
            }
            // Calculate simulated hybrid semantic score (base 0.5 + match boost)
            const relevanceScore = queryTokens.length > 0
                ? Math.min(0.99, 0.55 + (matches / queryTokens.length) * 0.44)
                : 0.6;
            return { ...doc, relevanceScore: parseFloat(relevanceScore.toFixed(3)) };
        });
        scored.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
        const minScore = options.minScore ?? 0.6;
        return scored.filter((d) => (d.relevanceScore || 0) >= minScore).slice(0, limit);
    }
    /**
     * Retrieves a document by its unique ID
     */
    async getDocumentById(id) {
        const doc = KnowledgeBaseConnector.companyDatabase.find((d) => d.id === id);
        return doc ? { ...doc } : null;
    }
    /**
     * Formats retrieved documents into a context block suitable for LLM injection
     */
    formatContextForPrompt(docs) {
        if (docs.length === 0)
            return '';
        const formatted = docs
            .map((d, i) => `[Document ${i + 1} - ${d.title}] (Score: ${d.relevanceScore}, Source: ${d.source})\n${d.content}`)
            .join('\n\n');
        return `\n--- EVALINE HYBRID DATABASE CONTEXT (PostgreSQL + Qdrant) ---\n${formatted}\n--- END CONTEXT ---\n`;
    }
    /**
     * Lists all available knowledge base documents
     */
    listAllDocuments() {
        return [...KnowledgeBaseConnector.companyDatabase];
    }
}
