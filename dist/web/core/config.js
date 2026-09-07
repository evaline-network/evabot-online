export function defaultConfig() {
    return {
        siteId: 'unknown',
        siteKey: 'unknown',
        title: 'EVALINE NODE',
        tagline: '',
        section: { en: 'Unclassified', uk: 'Некласифіковано', ru: 'Неклассифицировано' },
        nodes: [],
        modules: { worklog: false, hopTest: false, telemetry: true, chat: false },
        accent: '#3fb950',
        apiBase: '',
    };
}
/** Reads the global site config injected by the host HTML. */
export function loadSiteConfig() {
    const w = window;
    if (w && w.__SITE_CONFIG__) {
        return { ...defaultConfig(), ...w.__SITE_CONFIG__ };
    }
    return defaultConfig();
}
