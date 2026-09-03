/**
 * MarkdownLiveEngine (markdown-live)
 * Reactive Engine for Live Metrics, ASCII Progress Bars, and Dual-View NO-CSS TUI Rendering.
 */
export class MarkdownLiveEngine {
    static instance;
    metricsState = {
        frankfurtCpu: '3.2%',
        frankfurtRam: '5.8 GB / 32.0 GB (18.1%)',
        frankfurtRamPct: 18.1,
        iowaCpu: '1.4%',
        iowaRam: '412 MB / 1.0 GB (41.2%)',
        iowaRamPct: 41.2,
        totalOpexUsd: '$325.00 / mo',
        totalOpexEur: '€300.00 / mo',
        caddyStatus: '[ONLINE] TLS 1.3 (HTTP/3 Active)',
        geminiModelStatus: '[ONLINE] Gemini 2.0 Pro (2M Context)'
    };
    static getInstance() {
        if (!MarkdownLiveEngine.instance) {
            MarkdownLiveEngine.instance = new MarkdownLiveEngine();
        }
        return MarkdownLiveEngine.instance;
    }
    getMetrics() {
        return { ...this.metricsState };
    }
    generateProgressBar(current, total = 100, width = 20) {
        const pct = Math.min(Math.max(current / total, 0), 1);
        const filledChars = Math.round(pct * width);
        const emptyChars = width - filledChars;
        const bar = '█'.repeat(filledChars) + '░'.repeat(emptyChars);
        const pctLabel = `${Math.round(pct * 100)}%`;
        return `[${bar}] ${pctLabel}`;
    }
    processLiveMarkdown(markdown) {
        let output = markdown;
        // Substitute Metrics
        output = output.replace(/\[metric:frankfurt_cpu\]/g, this.metricsState.frankfurtCpu);
        output = output.replace(/\[metric:frankfurt_ram\]/g, this.metricsState.frankfurtRam);
        output = output.replace(/\[metric:iowa_cpu\]/g, this.metricsState.iowaCpu);
        output = output.replace(/\[metric:iowa_ram\]/g, this.metricsState.iowaRam);
        output = output.replace(/\[metric:opex_usd\]/g, this.metricsState.totalOpexUsd);
        output = output.replace(/\[metric:opex_eur\]/g, this.metricsState.totalOpexEur);
        output = output.replace(/\[metric:caddy_status\]/g, this.metricsState.caddyStatus);
        output = output.replace(/\[metric:gemini_status\]/g, this.metricsState.geminiModelStatus);
        // Substitute Dynamic Progress Bars: [progress:val max "Label"]
        output = output.replace(/\[progress:(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s+"([^"]+)"\]/g, (_, cur, tot, label) => {
            const bar = this.generateProgressBar(parseFloat(cur), parseFloat(tot));
            return `**${label}:** ${bar}`;
        });
        // Substitute Data Source badges: [source:name "Target"]
        output = output.replace(/\[source:([a-zA-Z0-9_-]+)\s+"([^"]+)"\]/g, '`[SRC: $1 ($2)]`');
        return output;
    }
    renderHtmlPreview(liveMarkdown) {
        const lines = liveMarkdown.split('\n');
        let html = '';
        let inTable = false;
        let tableLines = [];
        let inAccordion = false;
        let accordionLines = [];
        let accordionTitle = '';
        const flushTable = () => {
            if (tableLines.length > 0) {
                html += this.renderMarkdownTable(tableLines);
                tableLines = [];
            }
            inTable = false;
        };
        const flushAccordion = () => {
            if (accordionLines.length > 0) {
                html += `<details class="app-acc" open>`;
                html += `<summary>► ${accordionTitle}</summary>`;
                html += this.renderHtmlPreview(accordionLines.join('\n'));
                html += `</details><br>`;
                accordionLines = [];
            }
            inAccordion = false;
        };
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const trimmed = line.trim();
            if (trimmed.startsWith('# ')) {
                html += `<h1>${trimmed.replace('# ', '').trim()}</h1>`;
            }
            else if (trimmed.startsWith('## ')) {
                html += `<h2>${trimmed.replace('## ', '').trim()}</h2>`;
            }
            else if (trimmed.startsWith('### ')) {
                if (inTable)
                    flushTable();
                if (inAccordion)
                    flushAccordion();
                inAccordion = true;
                accordionTitle = trimmed.replace('### ', '').trim();
            }
            else if (inAccordion && trimmed.startsWith('### ')) {
                flushAccordion();
                inAccordion = true;
                accordionTitle = trimmed.replace('### ', '').trim();
            }
            else if (trimmed.startsWith('|')) {
                if (inAccordion) {
                    accordionLines.push(line);
                }
                else {
                    inTable = true;
                    tableLines.push(line);
                }
            }
            else {
                if (inTable && !trimmed.startsWith('|')) {
                    flushTable();
                }
                if (inAccordion) {
                    accordionLines.push(line);
                }
                else {
                    html += this.parseLineTokens(line) + '<br>\n';
                }
            }
        }
        if (inTable)
            flushTable();
        if (inAccordion)
            flushAccordion();
        return html;
    }
    parseLineTokens(line) {
        let result = line;
        result = result.replace(/\[([^\]]+)\]\(action:([^\)]+)\)/g, '<button onclick="window.evaApp.$2(event)">$1</button>');
        result = result.replace(/\[input:([a-zA-Z0-9_-]+)\s+"([^"]+)"\]/g, '<input type="text" id="$1" placeholder="$2">');
        result = result.replace(/^>\s*\[!NOTE\]\s*(.*)$/gm, '<fieldset><legend><b>NOTE</b></legend>$1</fieldset>');
        result = result.replace(/^>\s*\[!IMPORTANT\]\s*(.*)$/gm, '<fieldset><legend><b>IMPORTANT</b></legend>$1</fieldset>');
        result = result.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');
        result = result.replace(/`([^`]+)`/g, '<code>$1</code>');
        if (result.trim().startsWith('- ')) {
            result = `<li>${result.trim().substring(2)}</li>`;
        }
        return result;
    }
    renderMarkdownTable(lines) {
        if (lines.length < 2)
            return '';
        let tableHtml = '<table border="1" width="100%" cellpadding="6">';
        lines.forEach((line, idx) => {
            if (line.includes('---'))
                return;
            const cells = line.split('|').filter(c => c !== '').map(c => c.trim());
            if (idx === 0) {
                tableHtml += '<thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
            }
            else {
                tableHtml += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
            }
        });
        tableHtml += '</tbody></table><br>';
        return tableHtml;
    }
}
