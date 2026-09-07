export interface DomainMeta {
    domain: string;
    badge: string;
    role: string;
    infra: string;
    target?: string;
}
export declare const DOMAINS_CONFIG: DomainMeta[];
export declare class TuiRenderer {
    private static pagesDir;
    static loadPageTemplate(cleanHost: string): {
        meta: DomainMeta;
        body: string;
    };
    static getRawTemplate(targetDomain: string): string;
    static getRawTextTemplate(targetDomain: string): string;
    static resolveDomain(hostHeader?: string): DomainMeta;
    private static formatSecs;
    private static makeBar;
    static renderText(targetDomain: string): string;
    static renderHtml(targetDomain: string): string;
}
