/**
 * md-ui: Markdown-to-Interface Parser Engine
 * Converts plain Markdown UI files (.ui.md) into Pure NO-CSS HTML TUI Grids and Accordions.
 */
export interface IMdUiParseResult {
    title: string;
    tabs: {
        id: string;
        title: string;
        contentHtml: string;
    }[];
    rawHtml: string;
}
export declare class MdUiParser {
    private static instance;
    static getInstance(): MdUiParser;
    parse(markdown: string): IMdUiParseResult;
    private parseSectionLines;
    private parseLineTokens;
    private renderMarkdownTable;
}
