/**
 * Unified trilingual (EN/UK/RU) dictionary shared by every node via the core
 * bundle. Nodes may extend with their own keys; core keys are merged on top.
 */
export const CORE_GLOSSARY = {
    en: {
        'nocss.on': '[ NOCSS: ACTIVE (PURE TERMINAL) — Click for CSS ]',
        'nocss.off': '[ CSS: ACTIVE — Click for NOCSS (Terminal) ]',
        'lang.label': '[ LANG:',
        'screen.label': 'SCREEN',
        'fullwidth': '100% FULL-WIDTH',
        'mesh.title': '[ EVALINE ECOSYSTEM MESH — PLATFORM NODES ]:',
        'mesh.current': '[CURRENT NODE]',
        'status.online': 'ONLINE // MESH OPERATIONAL',
        'status.offline': 'OFFLINE // NODE ISOLATED',
        'telemetry.head': '[ LIVE PLATFORM TELEMETRY ]:',
        'worklog.head': '[ MASTER CHRONICLE / RAW LOG (1 LINE = 1 EVENT) ]:',
        'worklog.links': '  -> <a href="/worklog.tsv">/worklog.tsv</a> | <a href="/worklog.log">/worklog.log</a> | <a href="/worklog.txt">/worklog.txt</a> | <a href="/api/worklog">/api/worklog</a> (JSON)',
        'worklog.load': '[ Load live worklog ]',
        'worklog.status': 'EVENTS:',
        'live': 'LIVE',
        'utc': 'UTC',
        'nav.footer': 'EVA MESH (EvaNet): EvaFace (Edge) <-> EvaBrain (Core) <-> EvaCell (Mobile) via WireGuard/Tailscale',
    },
    uk: {
        'nocss.on': '[ NOCSS: АКТИВНИЙ (ЧИСТИЙ ТЕРМІНАЛ) — Натисніть для CSS ]',
        'nocss.off': '[ CSS: АКТИВНИЙ — Натисніть для NOCSS (Термінал) ]',
        'lang.label': '[ МОВА:',
        'screen.label': 'ЕКРАН',
        'fullwidth': '100% FULL-WIDTH',
        'mesh.title': '[ МЕРЕЖА EVALINE ECOSYSTEM MESH — ВУЗЛИ ПЛАТФОРМИ ]:',
        'mesh.current': '[ПОТОЧНИЙ ВУЗОЛ]',
        'status.online': 'ONLINE // MESH OPERATIONAL',
        'status.offline': 'OFFLINE // ВУЗОЛ ІЗОЛЬОВАНО',
        'telemetry.head': '[ ЖИВА ТЕЛЕМЕТРІЯ ПЛАТФОРМИ ]:',
        'worklog.head': '[ ГОЛОВНА ХРОНІКА / СИРИЙ ЛОГ (1 РЯДОК = 1 ПОДІЯ) ]:',
        'worklog.links': '  -> <a href="/worklog.tsv">/worklog.tsv</a> | <a href="/worklog.log">/worklog.log</a> | <a href="/worklog.txt">/worklog.txt</a> | <a href="/api/worklog">/api/worklog</a> (JSON)',
        'worklog.load': '[ Завантажити живу хроніку ]',
        'worklog.status': 'ПОДІЙ:',
        'live': 'LIVE',
        'utc': 'UTC',
        'nav.footer': 'EVA MESH (EvaNet): EvaFace (Edge) <-> EvaBrain (Core) <-> EvaCell (Mobile) через WireGuard/Tailscale',
    },
    ru: {
        'nocss.on': '[ NOCSS: ВКЛЮЧЕН (ЧИСТЫЙ ТЕРМИНАЛ) — Нажмите для CSS ]',
        'nocss.off': '[ CSS: ВКЛЮЧЕН — Нажмите для перехода в NOCSS (Терминал) ]',
        'lang.label': '[ ЯЗЫК:',
        'screen.label': 'ЭКРАН',
        'fullwidth': '100% FULL-WIDTH',
        'mesh.title': '[ СЕТЬ EVALINE ECOSYSTEM MESH — УЗЛЫ ПЛАТФОРМЫ ]:',
        'mesh.current': '[ТЕКУЩИЙ УЗЕЛ]',
        'status.online': 'ONLINE // MESH OPERATIONAL',
        'status.offline': 'OFFLINE // УЗЕЛ ИЗОЛИРОВАН',
        'telemetry.head': '[ ЖИВАЯ ТЕЛЕМЕТРИЯ ПЛАТФОРМЫ ]:',
        'worklog.head': '[ ГЛАВНАЯ ХРОНИКА / СЫРОЙ ЛОГ (1 СТРОКА = 1 СОБЫТИЕ) ]:',
        'worklog.links': '  -> <a href="/worklog.tsv">/worklog.tsv</a> | <a href="/worklog.log">/worklog.log</a> | <a href="/worklog.txt">/worklog.txt</a> | <a href="/api/worklog">/api/worklog</a> (JSON)',
        'worklog.load': '[ Загрузить живую хронику ]',
        'worklog.status': 'СОБЫТИЙ:',
        'live': 'LIVE',
        'utc': 'UTC',
        'nav.footer': 'EVA MESH (EvaNet): EvaFace (Edge) <-> EvaBrain (Core) <-> EvaCell (Mobile) через WireGuard/Tailscale',
    },
};
export class I18n {
    lang;
    extra;
    constructor(extra = { en: {}, uk: {}, ru: {} }) {
        this.lang = this.resolveInitial();
        this.extra = extra;
    }
    resolveInitial() {
        const saved = localStorage.getItem('evaline_lang');
        if (saved === 'en' || saved === 'uk' || saved === 'ru')
            return saved;
        return (navigator.language || 'en').toLowerCase().startsWith('uk') ? 'uk'
            : (navigator.language || 'en').toLowerCase().startsWith('ru') ? 'ru'
                : 'en';
    }
    getLang() { return this.lang; }
    setLang(lang) {
        this.lang = lang;
        localStorage.setItem('evaline_lang', lang);
        document.documentElement.lang = lang;
    }
    t(key) {
        return (this.extra[this.lang] && this.extra[this.lang][key])
            ?? CORE_GLOSSARY[this.lang][key]
            ?? CORE_GLOSSARY.en[key]
            ?? key;
    }
    /** Applies translateable keys found on elements with [data-i18n]. */
    applyToDom(root = document) {
        const nodes = root.querySelectorAll('[data-i18n]');
        nodes.forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (!key)
                return;
            const placeholder = el.getAttribute('data-i18n-placeholder');
            if (placeholder) {
                el.setAttribute('placeholder', this.t(key));
            }
            else {
                el.textContent = this.t(key);
            }
        });
    }
}
