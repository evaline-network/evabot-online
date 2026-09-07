export function escapeHtml(s) {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}
export async function fetchWorklog(apiBase) {
    try {
        const url = (apiBase ?? '') + '/api/worklog';
        const res = await fetch(url);
        if (!res.ok)
            return [];
        const data = await res.json();
        if (!Array.isArray(data.rows))
            return [];
        return data.rows.map((raw) => {
            const r = raw;
            return {
                timestamp: String(r.timestamp ?? ''),
                host: String(r.host ?? ''),
                actor: String(r.actor ?? ''),
                category: String(r.category ?? ''),
                status: String(r.status ?? ''),
                event: String(r.event ?? ''),
            };
        });
    }
    catch {
        return [];
    }
}
export function renderWorklog(entries, i18n, limit) {
    const head = escapeHtml(i18n.t('worklog.head'));
    const max = limit ?? 15;
    if (entries.length === 0) {
        return `<pre>${head}\n(empty / offline)</pre>`;
    }
    const lines = entries.slice(0, max).map((e) => {
        return `[${escapeHtml(e.timestamp)}] ${escapeHtml(e.host)} | ${escapeHtml(e.actor)} | ${escapeHtml(e.status)} | ${escapeHtml(e.event)}`;
    });
    return `<pre>${head}\n${lines.join('\n')}</pre>`;
}
export function renderWorklogLinks(i18n) {
    return i18n.t('worklog.links');
}
