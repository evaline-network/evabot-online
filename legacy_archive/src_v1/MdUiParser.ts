/**
 * md-ui: Markdown-to-Interface Parser Engine
 * Converts plain Markdown UI files (.ui.md) into Pure NO-CSS HTML TUI Grids and Accordions.
 */

export interface IMdUiParseResult {
  title: string;
  tabs: { id: string; title: string; contentHtml: string }[];
  rawHtml: string;
}

export class MdUiParser {
  private static instance: MdUiParser;

  public static getInstance(): MdUiParser {
    if (!MdUiParser.instance) {
      MdUiParser.instance = new MdUiParser();
    }
    return MdUiParser.instance;
  }

  public parse(markdown: string): IMdUiParseResult {
    const lines = markdown.split('\n');
    let title = 'EVABOT ONLINE // MD-UI DASHBOARD';
    const tabs: { id: string; title: string; contentHtml: string }[] = [];

    let currentTabId = '';
    let currentTabTitle = '';
    let currentTabLines: string[] = [];

    const flushTab = () => {
      if (currentTabId && currentTabLines.length > 0) {
        tabs.push({
          id: currentTabId,
          title: currentTabTitle,
          contentHtml: this.parseSectionLines(currentTabLines)
        });
        currentTabLines = [];
      }
    };

    for (const line of lines) {
      const trimmed = line.trim();

      if (trimmed.startsWith('# ')) {
        title = trimmed.replace('# ', '').trim();
      } else if (trimmed.startsWith('## ')) {
        flushTab();
        currentTabTitle = trimmed.replace('## ', '').trim();
        currentTabId = `tab-md-${tabs.length + 1}`;
      } else {
        if (currentTabId) {
          currentTabLines.push(line);
        }
      }
    }
    flushTab();

    // Generate Full HTML Grid Output
    let rawHtml = `<fieldset><legend><b>${title}</b></legend>`;
    rawHtml += `<table border="1" width="100%" cellpadding="6"><tr>`;
    tabs.forEach(t => {
      rawHtml += `<td align="center"><button onclick="window.evaApp.setScreen('${t.id}')"><b>${t.title}</b></button></td>`;
    });
    rawHtml += `</tr></table><hr>`;

    tabs.forEach((t, idx) => {
      const isHidden = idx > 0 ? 'hidden' : '';
      rawHtml += `<section id="${t.id}" ${isHidden}>${t.contentHtml}</section>`;
    });
    rawHtml += `</fieldset>`;

    return { title, tabs, rawHtml };
  }

  private parseSectionLines(lines: string[]): string {
    let html = '';
    let inTable = false;
    let tableLines: string[] = [];
    let inAccordion = false;
    let accordionLines: string[] = [];
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
        html += this.parseSectionLines(accordionLines);
        html += `</details><br>`;
        accordionLines = [];
      }
      inAccordion = false;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith('### ')) {
        if (inTable) flushTable();
        if (inAccordion) flushAccordion();
        inAccordion = true;
        accordionTitle = trimmed.replace('### ', '').trim();
      } else if (inAccordion && trimmed.startsWith('### ')) {
        flushAccordion();
        inAccordion = true;
        accordionTitle = trimmed.replace('### ', '').trim();
      } else if (trimmed.startsWith('|')) {
        if (inAccordion) {
          accordionLines.push(line);
        } else {
          inTable = true;
          tableLines.push(line);
        }
      } else {
        if (inTable && !trimmed.startsWith('|')) {
          flushTable();
        }

        if (inAccordion) {
          accordionLines.push(line);
        } else {
          // Process inline tokens
          html += this.parseLineTokens(line) + '\n';
        }
      }
    }

    if (inTable) flushTable();
    if (inAccordion) flushAccordion();

    return html;
  }

  private parseLineTokens(line: string): string {
    let result = line;

    // Convert Buttons: [Button Text](action:functionName)
    result = result.replace(/\[([^\]]+)\]\(action:([^\)]+)\)/g, '<button onclick="window.evaApp.$2(event)">$1</button>');

    // Convert Text Inputs: [input:id "Placeholder"]
    result = result.replace(/\[input:([a-zA-Z0-9_-]+)\s+"([^"]+)"\]/g, '<input type="text" id="$1" placeholder="$2">');

    // Convert Callouts: > [!NOTE] Message
    result = result.replace(/^>\s*\[!NOTE\]\s*(.*)$/gm, '<fieldset><legend><b>NOTE</b></legend>$1</fieldset>');
    result = result.replace(/^>\s*\[!IMPORTANT\]\s*(.*)$/gm, '<fieldset><legend><b>IMPORTANT</b></legend>$1</fieldset>');

    // Convert Bold text **bold**
    result = result.replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>');

    // Convert List items - item
    if (result.trim().startsWith('- ')) {
      result = `<li>${result.trim().substring(2)}</li>`;
    }

    return result;
  }

  private renderMarkdownTable(lines: string[]): string {
    if (lines.length < 2) return '';

    let tableHtml = '<table border="1" width="100%" cellpadding="6">';
    lines.forEach((line, idx) => {
      // Skip markdown separator line |---|---|
      if (line.includes('---')) return;

      const cells = line.split('|').filter(c => c !== '').map(c => c.trim());
      if (idx === 0) {
        tableHtml += '<thead><tr>' + cells.map(c => `<th>${c}</th>`).join('') + '</tr></thead><tbody>';
      } else {
        tableHtml += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
      }
    });
    tableHtml += '</tbody></table><br>';
    return tableHtml;
  }
}
