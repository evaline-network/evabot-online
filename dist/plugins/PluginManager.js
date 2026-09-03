import { EventBus } from '../core/EventBus.js';
export class PluginManager {
    plugins = new Map();
    disabledPlugins = new Set();
    currentLanguage = 'en';
    activeScreenId = 'tab-chat';
    registerPlugin(plugin) {
        if (this.plugins.has(plugin.id)) {
            console.warn(`[PluginManager] Plugin "${plugin.id}" is already registered. Overwriting.`);
        }
        this.plugins.set(plugin.id, plugin);
        plugin.init(this);
        console.log(`[PluginManager] Registered plugin: ${plugin.name} v${plugin.version} [${plugin.id}]`);
    }
    getPlugins() {
        return Array.from(this.plugins.values());
    }
    getEnabledPlugins() {
        return Array.from(this.plugins.values()).filter(p => !this.disabledPlugins.has(p.id));
    }
    getPlugin(id) {
        return this.plugins.get(id);
    }
    isPluginEnabled(id) {
        return !this.disabledPlugins.has(id);
    }
    togglePluginState(id) {
        if (this.disabledPlugins.has(id)) {
            this.disabledPlugins.delete(id);
        }
        else {
            this.disabledPlugins.add(id);
        }
        this.renderAll();
    }
    setLanguage(lang) {
        this.currentLanguage = lang;
        this.renderAll();
        EventBus.getInstance().emit('language:changed', lang);
    }
    getLanguage() {
        return this.currentLanguage;
    }
    setScreen(screenId) {
        this.activeScreenId = screenId;
        this.getEnabledPlugins().forEach(plugin => {
            const el = document.getElementById(plugin.screenId);
            if (el) {
                el.hidden = (plugin.screenId !== screenId);
            }
        });
    }
    toggleAllAccordions(expand) {
        document.querySelectorAll('details').forEach(d => {
            d.open = expand;
        });
    }
    renderPluginControlPanel() {
        const plugins = this.getPlugins();
        let html = '<details class="app-acc"><summary>► [SYSTEM PLUGIN CONTROL PANEL / RUNTIME MODULES]</summary>';
        html += '<table border="1" width="100%" cellpadding="6"><thead><tr><th>PLUGIN ID</th><th>PLUGIN NAME</th><th>VERSION</th><th>SCREEN TARGET</th><th>RUNTIME STATUS</th><th>ACTION</th></tr></thead><tbody>';
        plugins.forEach(p => {
            const enabled = this.isPluginEnabled(p.id);
            const statusStr = enabled ? '[ENABLED] ACTIVE' : '[DISABLED] OFF';
            const btnText = enabled ? 'DISABLE' : 'ENABLE';
            html += `<tr><td>${p.id}</td><td>${p.name}</td><td>${p.version}</td><td>${p.screenId}</td><td>${statusStr}</td><td><button onclick="window.evaApp.togglePlugin('${p.id}')">${btnText}</button></td></tr>`;
        });
        html += '</tbody></table></details><br>';
        return html;
    }
    renderNavTabs() {
        const enabledPlugins = this.getEnabledPlugins();
        if (enabledPlugins.length === 0) {
            return '<table border="1" width="100%" cellpadding="6"><tr><td align="center"><b>NO PLUGINS ENABLED</b></td></tr></table>';
        }
        let html = '<table border="1" width="100%" cellpadding="6"><tr>';
        const widthPct = Math.floor(100 / enabledPlugins.length);
        enabledPlugins.forEach(plugin => {
            const title = plugin.tabTitle[this.currentLanguage] || plugin.tabTitle['en'];
            html += `<td width="${widthPct}%" align="center">`;
            html += `<button onclick="window.evaApp.setScreen('${plugin.screenId}')" id="nav-${plugin.id}"><b>${title}</b></button>`;
            html += `</td>`;
        });
        html += '</tr></table>';
        return html;
    }
    renderAll() {
        const controlPanel = document.getElementById('plugin-control-panel');
        const navContainer = document.getElementById('nav-container');
        const appRoot = document.getElementById('app-root');
        if (controlPanel) {
            controlPanel.innerHTML = this.renderPluginControlPanel();
        }
        if (navContainer) {
            navContainer.innerHTML = this.renderNavTabs();
        }
        if (appRoot) {
            let screensHtml = '';
            this.getEnabledPlugins().forEach(plugin => {
                const isHidden = plugin.screenId !== this.activeScreenId ? 'hidden' : '';
                screensHtml += `<section id="${plugin.screenId}" ${isHidden}>`;
                screensHtml += plugin.render(this.currentLanguage);
                screensHtml += `</section><br>`;
            });
            appRoot.innerHTML = screensHtml;
            // Bind events for enabled plugins after mounting DOM
            this.getEnabledPlugins().forEach(plugin => {
                if (plugin.bindEvents) {
                    plugin.bindEvents(this.currentLanguage);
                }
            });
        }
    }
}
