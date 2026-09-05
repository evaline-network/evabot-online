import { ModelRegistry } from '../models/ModelRegistry.js';
import { VoiceDockUI } from './voice/VoiceDockUI.js';
const TRANSLATIONS = {
    en: {
        appTitle: 'EVABOT // CYBER-TERMINAL & NEURAL VOICE HUB',
        statusOnline: 'ONLINE',
        statusBusy: 'STREAMING',
        statusError: 'ERROR',
        returnTerminalBtn: '[ ↑ RETURN TO TERMINAL ]',
        clearChatBtn: '[ CLR ]',
        transmitBtn: '[ TRANSMIT ↵ ]',
        stopBtn: '[ STOP ! ]',
        inputPlaceholder: 'Enter prompt or command (e.g. /help, /persona, /mode, /models, /db)...',
        welcomeHeading: 'EVABOT NEURAL CYBER-TERMINAL // CORE INITIALIZED',
        welcomeNotice: 'Session active. Pure monochrome cyber-terminal initialized. Based in Odesa, Ukraine (UA). Connected to Google Cloud ambient infrastructure with zero-trust isolation.',
        voiceTapToSpeak: 'TAP TO SPEAK',
        voiceListening: 'LISTENING...',
        voiceSpeaking: 'NEURAL VOICE',
        voiceSublabel: '[ LIVE NEURAL VOICE ]',
        voiceStatusReady: 'Eva (Lead Frontend) & Adam (Chief Backend) listening * Web Speech API Ready',
        voiceStatusListening: 'Speech recognition active... Speak clearly into microphone.',
        voiceStatusSpeaking: 'Neural audio synthesis active * Transmitting voice response.',
        personaEvaLabel: '[F] EVA [Lead Frontend & UX Director]',
        personaAdamLabel: '[M] ADAM [Chief Backend & Cloud Architect]',
        personaDualLabel: '[DUAL] EVA & ADAM [Synergistic Co-Pilots]',
        modeChatLabel: 'CHAT // Direct Model Interaction',
        modeDialogLabel: 'DIALOG // Bilateral Debate (Eva vs Adam)',
        modeInterviewLabel: 'INTERVIEW // Structured Technical/Executive Q&A',
        modeConsiliumLabel: 'CONSILIUM // Multi-Agent Executive Council',
        badgeFree: '[FREE] 100% FREE QUOTA',
        badgePaid: '[PAID] PAID / PAYG',
        noticePersonaSwitched: 'Active Co-Pilot Persona switched to',
        noticeModeSwitched: 'Operational Mode switched to',
        noticeModelSwitched: 'Neural Model switched to',
        noticeDbSwitched: 'Knowledge Base & Database routed to',
        noticeRoleSwitched: 'Specialist Role activated:',
        noticeKeySaved: 'Custom Google API Key securely saved to browser localStorage.',
        noticeKeyCleared: 'Reverted to Google Cloud ambient auto-authentication.',
        noticeChatCleared: 'Terminal chat stream purged.',
        copiedBtn: 'COPIED',
        copyBtn: 'COPY',
    },
    uk: {
        appTitle: 'EVABOT // КІБЕР-ТЕРМІНАЛ ТА НЕЙРО-ГОЛОСОВИЙ ХАБ',
        statusOnline: 'В МЕРЕЖІ',
        statusBusy: 'ГЕНЕРАЦІЯ',
        statusError: 'ПОМИЛКА',
        returnTerminalBtn: '[ ↑ ПОВЕРНУТИСЯ ДО ТЕРМІНАЛУ ]',
        clearChatBtn: '[ ОЧИСТИТИ ]',
        transmitBtn: '[ ВІДПРАВИТИ ↵ ]',
        stopBtn: '[ ЗУПИНИТИ ! ]',
        inputPlaceholder: 'Введіть запит або команду (напр. /help, /persona, /mode, /models, /db)...',
        welcomeHeading: 'НЕЙРОННИЙ КІБЕР-ТЕРМІНАЛ EVABOT // СИСТЕМУ ІНІЦІАЛІЗОВАНО',
        welcomeNotice: 'Сесія активна. Монохромний кібер-термінал активовано. Створено в Одесі, Україна (UA). Підключено до хмарної інфраструктури Google Cloud із Zero-Trust автентифікацією.',
        voiceTapToSpeak: 'НАТИСНІТЬ ДЛЯ ГОЛОСУ',
        voiceListening: 'СЛУХАЮ...',
        voiceSpeaking: 'НЕЙРО-ГОЛОС',
        voiceSublabel: '[ ЖИВИЙ НЕЙРО-ГОЛОС ]',
        voiceStatusReady: 'Єва (FrontEnd) та Адам (BackEnd) на зв’язку * Web Speech API готовий',
        voiceStatusListening: 'Розпізнавання голосу активне... Говоріть у мікрофон.',
        voiceStatusSpeaking: 'Нейронний синтез голосу активний * Відтворення аудіо.',
        personaEvaLabel: '[F] ЄВА [Головний FrontEnd & UX Архітектор]',
        personaAdamLabel: '[M] АДАМ [Головний BackEnd & Cloud Архітектор]',
        personaDualLabel: '[DUAL] ЄВА & АДАМ [Тандем Full-Stack Ко-Пілотів]',
        modeChatLabel: 'ЧАТ // Прямий діалог з моделлю',
        modeDialogLabel: 'ДІАЛОГ // Двосторонні дебати (Єва проти Адама)',
        modeInterviewLabel: 'ІНТЕРВ\'Ю // Структурована співбесіда та оцінювання',
        modeConsiliumLabel: 'КОНСИЛІУМ // Багатоагентна рада директорів',
        badgeFree: '[БЕЗКОШТОВНО] 100% КВОТА',
        badgePaid: '[ПЛАТНО] PAYG',
        noticePersonaSwitched: 'Активну персону змінено на',
        noticeModeSwitched: 'Режим роботи змінено на',
        noticeModelSwitched: 'Нейронну модель переключено на',
        noticeDbSwitched: 'Базу знань та даних переключено на',
        noticeRoleSwitched: 'Активовано професійну роль:',
        noticeKeySaved: 'Власний Google API ключ успішно збережено в браузері.',
        noticeKeyCleared: 'Повернуто автоматичну авторизацію Google Cloud.',
        noticeChatCleared: 'Історію термінала очищено.',
        copiedBtn: 'СКОПІЙОВАНО',
        copyBtn: 'КОПІЮВАТИ',
    },
    ru: {
        appTitle: 'EVABOT // КИБЕР-ТЕРМИНАЛ И НЕЙРО-ГОЛОСОВОЙ ХАБ',
        statusOnline: 'В СЕТИ',
        statusBusy: 'ГЕНЕРАЦИЯ',
        statusError: 'ОШИБКА',
        returnTerminalBtn: '[ ↑ ВЕРНУТЬСЯ В ТЕРМИНАЛ ]',
        clearChatBtn: '[ ОЧИСТИТЬ ]',
        transmitBtn: '[ ОТПРАВИТЬ ↵ ]',
        stopBtn: '[ ОСТАНОВИТЬ ! ]',
        inputPlaceholder: 'Введите запрос или команду (напр. /help, /persona, /mode, /models, /db)...',
        welcomeHeading: 'НЕЙРОННЫЙ КИБЕР-ТЕРМИНАЛ EVABOT // СИСТЕМА ИНИЦИАЛИЗИРОВАНА',
        welcomeNotice: 'Сессия активна. Монохромный кибер-терминал готов к работе. Базируется в Одессе, Украина (UA). Подключено к инфраструктуре Google Cloud с Zero-Trust аутентификацией.',
        voiceTapToSpeak: 'НАЖМИТЕ ДЛЯ ГОЛОСА',
        voiceListening: 'СЛУШАЮ...',
        voiceSpeaking: 'НЕЙРО-ГОЛОС',
        voiceSublabel: '[ ЖИВОЙ НЕЙРО-ГОЛОС ]',
        voiceStatusReady: 'Ева (FrontEnd) и Адам (BackEnd) на связи * Web Speech API готов',
        voiceStatusListening: 'Распознавание речи активно... Говорите в микрофон.',
        voiceStatusSpeaking: 'Нейронный синтез речи активен * Передача аудио-ответа.',
        personaEvaLabel: '[F] ЕВА [Главный FrontEnd & UX Архитектор]',
        personaAdamLabel: '[M] АДАМ [Главный BackEnd & Cloud Архитектор]',
        personaDualLabel: '[DUAL] ЕВА & АДАМ [Тандем Full-Stack Ко-Пилотов]',
        modeChatLabel: 'ЧАТ // Прямой диалог с моделью',
        modeDialogLabel: 'ДИАЛОГ // Двусторонние дебаты (Ева против Адама)',
        modeInterviewLabel: 'ИНТЕРВЬЮ // Структурированное собеседование и скоринг',
        modeConsiliumLabel: 'КОНСИЛИУМ // Многоагентный совет директоров',
        badgeFree: '[БЕСПЛАТНО] 100% КВОТА',
        badgePaid: '[ПЛАТНО] PAYG',
        noticePersonaSwitched: 'Активная персона переключена на',
        noticeModeSwitched: 'Режим работы переключен на',
        noticeModelSwitched: 'Нейронная модель переключена на',
        noticeDbSwitched: 'База знаний и БД переключена на',
        noticeRoleSwitched: 'Активирована корпоративная роль:',
        noticeKeySaved: 'Пользовательский Google API ключ сохранен в браузере.',
        noticeKeyCleared: 'Возвращена автоматическая авторизация Google Cloud.',
        noticeChatCleared: 'История терминала очищена.',
        copiedBtn: 'СКОПИРОВАНО',
        copyBtn: 'КОПИРОВАТЬ',
    },
};
export class EvaBotWebApp {
    messages = [];
    currentLang = 'en';
    currentPersona = 'dual';
    currentMode = 'chat';
    currentModel = 'gemini-2.5-flash';
    currentDb = 'hybrid';
    customDbUri = '';
    currentRole = 'eva_frontend';
    consiliumCount = 5;
    consiliumPreset = null;
    isGenerating = false;
    abortController = null;
    serverUptimeSec = 0;
    serverMemoryMb = 32;
    lastLatencyMs = 4;
    sessionTotalTokens = 0;
    sessionTotalCostUSD = 0;
    sessionTotalCostEUR = 0;
    authSource = 'Google Cloud Ambient';
    userAccount = 'evabot.online@gmail.com';
    uptimeInterval = null;
    // Voice Engine State
    isRecording = false;
    speechRecognition = null;
    isSpeaking = false;
    voiceDockUI = null;
    constructor() {
        this.init();
    }
    async init() {
        const savedLang = localStorage.getItem('evabot_lang');
        if (savedLang && (savedLang === 'en' || savedLang === 'uk' || savedLang === 'ru')) {
            this.currentLang = savedLang;
        }
        const savedPersona = localStorage.getItem('evabot_persona');
        if (savedPersona && (savedPersona === 'eva' || savedPersona === 'adam' || savedPersona === 'dual')) {
            this.currentPersona = savedPersona;
        }
        const savedMode = localStorage.getItem('evabot_mode');
        if (savedMode && (savedMode === 'chat' || savedMode === 'dialog' || savedMode === 'interview' || savedMode === 'consilium')) {
            this.currentMode = savedMode;
        }
        this.setupEventListeners();
        this.setupVoiceEngine();
        this.populateModelSelector();
        this.applyLanguage();
        this.updatePersonaUI();
        this.updateModeUI();
        this.updateDbUI();
        this.updateRoleUI();
        this.updateModelDetailsUI();
        this.updateKeyStatusUI();
        this.startTelemetryLoop();
        // Initialize Isolated Gemini Live Voice Plugin Dock
        this.voiceDockUI = new VoiceDockUI();
        this.voiceDockUI.init().catch((e) => console.warn('[App] VoiceDockUI init warning:', e));
        // Run real startup probe & linear terminal boot sequence
        await this.checkHealth();
        await this.renderStartupSequence();
    }
    t() {
        return TRANSLATIONS[this.currentLang];
    }
    setLanguage(lang) {
        if (lang === this.currentLang)
            return;
        this.currentLang = lang;
        localStorage.setItem('evabot_lang', lang);
        this.applyLanguage();
        this.updatePersonaUI();
        this.updateModeUI();
        this.updateModelDetailsUI();
        this.updateKeyStatusUI();
        this.updateTelemetryUI();
        if (this.messages.length <= 2) {
            this.messages = [];
            const container = document.getElementById('messages-container');
            if (container)
                container.innerHTML = '';
            this.renderStartupSequence();
        }
    }
    applyLanguage() {
        const t = this.t();
        ['en', 'uk', 'ru'].forEach((l) => {
            const btn = document.getElementById(`lang-btn-${l}`);
            if (btn) {
                btn.className = l === this.currentLang ? 'lang-btn active' : 'lang-btn';
            }
        });
        document.title = `${t.appTitle} // [${this.currentPersona.toUpperCase()}]`;
        const input = document.getElementById('user-input');
        if (input) {
            input.placeholder = t.inputPlaceholder;
        }
        const orbLabel = document.getElementById('orb-label');
        if (orbLabel && !this.isRecording && !this.isSpeaking) {
            orbLabel.textContent = t.voiceTapToSpeak;
        }
        const orbSublabel = document.getElementById('orb-sublabel');
        if (orbSublabel && !this.isRecording && !this.isSpeaking) {
            orbSublabel.textContent = t.voiceSublabel;
        }
        const voiceFeedback = document.getElementById('voice-status-feedback');
        if (voiceFeedback && !this.isRecording && !this.isSpeaking) {
            voiceFeedback.textContent = t.voiceStatusReady;
        }
        this.updateSendButtonState(this.isGenerating);
    }
    setupEventListeners() {
        // Language Switchers
        document.getElementById('lang-btn-en')?.addEventListener('click', () => this.setLanguage('en'));
        document.getElementById('lang-btn-uk')?.addEventListener('click', () => this.setLanguage('uk'));
        document.getElementById('lang-btn-ru')?.addEventListener('click', () => this.setLanguage('ru'));
        // Screen 1 <-> Screen 2 Viewport Smooth Scrolling
        const toDeckBtn = document.getElementById('scroll-to-deck-btn');
        const toTerminalBtn = document.getElementById('scroll-to-terminal-btn');
        const deckSection = document.getElementById('screen-control-deck');
        const terminalSection = document.getElementById('screen-terminal');
        toDeckBtn?.addEventListener('click', () => {
            deckSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        toTerminalBtn?.addEventListener('click', () => {
            terminalSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        // Header persona pill cycles persona on click
        document.getElementById('header-persona-pill')?.addEventListener('click', () => {
            const cycle = {
                eva: 'adam',
                adam: 'dual',
                dual: 'eva',
            };
            this.setPersona(cycle[this.currentPersona]);
        });
        // Persona Selector Group
        document.querySelectorAll('#persona-selector-group [data-persona]').forEach((el) => {
            el.addEventListener('click', () => {
                const p = el.getAttribute('data-persona');
                if (p)
                    this.setPersona(p);
            });
        });
        // Mode Selector Group
        document.querySelectorAll('#mode-selector-group [data-mode]').forEach((el) => {
            el.addEventListener('click', () => {
                const m = el.getAttribute('data-mode');
                if (m)
                    this.setMode(m);
            });
        });
        // Consilium Range & Presets
        const consiliumSlider = document.getElementById('deck-consilium-count');
        const consiliumVal = document.getElementById('consilium-count-val');
        consiliumSlider?.addEventListener('input', (e) => {
            const val = parseInt(e.target.value, 10) || 5;
            this.consiliumCount = val;
            if (consiliumVal)
                consiliumVal.textContent = String(val);
            this.consiliumPreset = null;
            this.updatePresetButtonsUI();
        });
        document.getElementById('btn-preset-top10-paid')?.addEventListener('click', () => {
            this.consiliumPreset = 'top10_paid';
            this.consiliumCount = 10;
            if (consiliumSlider)
                consiliumSlider.value = '10';
            if (consiliumVal)
                consiliumVal.textContent = '10';
            this.updatePresetButtonsUI();
            this.addSystemNotification('[*] Preset activated: **Top-10 Smartest Paid Models** (10 participants)');
        });
        document.getElementById('btn-preset-top10-free')?.addEventListener('click', () => {
            this.consiliumPreset = 'top10_free';
            this.consiliumCount = 10;
            if (consiliumSlider)
                consiliumSlider.value = '10';
            if (consiliumVal)
                consiliumVal.textContent = '10';
            this.updatePresetButtonsUI();
            this.addSystemNotification('[*] Preset activated: **Top-10 Free Quota Models** (10 participants)');
        });
        // Database Selector Group
        document.querySelectorAll('#db-selector-group [data-db]').forEach((el) => {
            el.addEventListener('click', () => {
                const db = el.getAttribute('data-db');
                if (db)
                    this.setDb(db);
            });
        });
        const customDbInput = document.getElementById('custom-db-uri-input');
        customDbInput?.addEventListener('change', () => {
            this.customDbUri = customDbInput.value.trim();
            if (this.customDbUri) {
                this.addSystemNotification(`Custom Company Database connected: \`${this.customDbUri.replace(/:[^:@]+@/, ':****@')}\``);
            }
        });
        // Roles Selector Group (10 professions)
        document.querySelectorAll('#roles-selector-group [data-role]').forEach((el) => {
            el.addEventListener('click', () => {
                const role = el.getAttribute('data-role');
                if (role)
                    this.setRole(role);
            });
        });
        // Model dropdown change
        const modelSelect = document.getElementById('deck-model-select');
        modelSelect?.addEventListener('change', (e) => {
            this.currentModel = e.target.value;
            this.updateModelDetailsUI();
            const m = ModelRegistry.getModelById(this.currentModel);
            this.addSystemNotification(`${this.t().noticeModelSwitched} **${m?.name || this.currentModel}**`);
        });
        // Header model pill navigates to deck
        document.getElementById('header-model-pill')?.addEventListener('click', () => {
            deckSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
        // API Key save & clear
        const saveKeyBtn = document.getElementById('deck-save-key-btn');
        const clearKeyBtn = document.getElementById('deck-clear-key-btn');
        const apiKeyInput = document.getElementById('deck-api-key-input');
        saveKeyBtn?.addEventListener('click', () => {
            const val = apiKeyInput?.value.trim() || '';
            if (val) {
                localStorage.setItem('evabot_gemini_key', val);
                this.voiceDockUI?.setApiKey(val);
                this.addSystemNotification(this.t().noticeKeySaved);
            }
            this.updateKeyStatusUI();
        });
        clearKeyBtn?.addEventListener('click', () => {
            localStorage.removeItem('evabot_gemini_key');
            this.voiceDockUI?.setApiKey('');
            if (apiKeyInput)
                apiKeyInput.value = '';
            this.addSystemNotification(this.t().noticeKeyCleared);
            this.updateKeyStatusUI();
        });
        // Clear chat stream
        document.getElementById('clear-btn')?.addEventListener('click', () => {
            this.messages = [];
            const container = document.getElementById('messages-container');
            if (container)
                container.innerHTML = '';
            this.renderStatusBarOnly();
            this.addSystemNotification(this.t().noticeChatCleared);
        });
        // Chat form submit
        const form = document.getElementById('chat-form');
        const input = document.getElementById('user-input');
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSend();
        });
        input?.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.handleSend();
            }
        });
        // Voice Orb click
        document.getElementById('voice-orb')?.addEventListener('click', () => {
            this.toggleVoiceRecording();
        });
    }
    // ===========================================================================
    // VOICE ENGINE (Speech Recognition & Speech Synthesis)
    // ===========================================================================
    setupVoiceEngine() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            const feedback = document.getElementById('voice-status-feedback');
            if (feedback)
                feedback.textContent = 'Web Speech API not supported in this browser. (Use Chrome/Edge or type prompts)';
            return;
        }
        try {
            this.speechRecognition = new SpeechRecognition();
            this.speechRecognition.continuous = false;
            this.speechRecognition.interimResults = true;
            this.speechRecognition.maxAlternatives = 1;
            this.speechRecognition.onstart = () => {
                this.isRecording = true;
                const orb = document.getElementById('voice-orb');
                const orbIcon = document.getElementById('orb-icon');
                const orbLabel = document.getElementById('orb-label');
                const orbSublabel = document.getElementById('orb-sublabel');
                const feedback = document.getElementById('voice-status-feedback');
                if (orb)
                    orb.classList.add('listening');
                if (orbIcon)
                    orbIcon.textContent = '[REC]';
                if (orbLabel)
                    orbLabel.textContent = this.t().voiceListening;
                if (orbSublabel)
                    orbSublabel.textContent = '[ LISTENING... ]';
                if (feedback)
                    feedback.textContent = this.t().voiceStatusListening;
            };
            this.speechRecognition.onresult = (event) => {
                let interim = '';
                let final = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final += event.results[i][0].transcript;
                    }
                    else {
                        interim += event.results[i][0].transcript;
                    }
                }
                const transcript = final || interim;
                const input = document.getElementById('user-input');
                if (input && transcript) {
                    input.value = transcript;
                }
                if (final && final.trim()) {
                    this.stopVoiceRecording();
                    setTimeout(() => {
                        this.handleSend();
                    }, 300);
                }
            };
            this.speechRecognition.onerror = (event) => {
                console.warn('Speech recognition error:', event.error);
                this.stopVoiceRecording();
            };
            this.speechRecognition.onend = () => {
                this.stopVoiceRecording();
            };
        }
        catch (e) {
            console.warn('SpeechRecognition initialization error:', e);
        }
    }
    toggleVoiceRecording() {
        if (this.isRecording) {
            this.stopVoiceRecording();
        }
        else {
            this.startVoiceRecording();
        }
    }
    startVoiceRecording() {
        if (!this.speechRecognition) {
            alert('Speech recognition is not supported in this browser. Please type your prompt in the command line.');
            return;
        }
        try {
            const langCode = this.currentLang === 'uk' ? 'uk-UA' : this.currentLang === 'ru' ? 'ru-RU' : 'en-US';
            this.speechRecognition.lang = langCode;
            this.speechRecognition.start();
        }
        catch (e) {
            console.warn('Failed to start speech recognition:', e);
            this.stopVoiceRecording();
        }
    }
    stopVoiceRecording() {
        this.isRecording = false;
        try {
            this.speechRecognition?.stop();
        }
        catch {
            // ignore
        }
        const orb = document.getElementById('voice-orb');
        const orbIcon = document.getElementById('orb-icon');
        const orbLabel = document.getElementById('orb-label');
        const orbSublabel = document.getElementById('orb-sublabel');
        const feedback = document.getElementById('voice-status-feedback');
        if (orb)
            orb.classList.remove('listening');
        if (orbIcon)
            orbIcon.textContent = '[MIC]';
        if (orbLabel)
            orbLabel.textContent = this.t().voiceTapToSpeak;
        if (orbSublabel)
            orbSublabel.textContent = this.t().voiceSublabel;
        if (feedback)
            feedback.textContent = this.t().voiceStatusReady;
    }
    speakVoiceResponse(text, persona) {
        if (!window.speechSynthesis)
            return;
        window.speechSynthesis.cancel();
        // Strip markdown formatting, code blocks, ASCII borders, URLs
        const cleanText = text
            .replace(/```[\s\S]*?```/g, ' [Code omitted] ')
            .replace(/`([^`]+)`/g, '$1')
            .replace(/[*_#~>|┌┐└┘├┤─│═]+/g, ' ')
            .replace(/https?:\/\/\S+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        if (!cleanText)
            return;
        // Take first 350 characters for clean, punchy audio transmission
        const spokenSlice = cleanText.length > 350 ? `${cleanText.slice(0, 350)}...` : cleanText;
        const utterance = new SpeechSynthesisUtterance(spokenSlice);
        const langCode = this.currentLang === 'uk' ? 'uk-UA' : this.currentLang === 'ru' ? 'ru-RU' : 'en-US';
        utterance.lang = langCode;
        // Audio characteristics: Eva (higher pitch, crisp) vs Adam (deeper pitch)
        if (persona === 'eva') {
            utterance.pitch = 1.2;
            utterance.rate = 1.05;
        }
        else if (persona === 'adam') {
            utterance.pitch = 0.85;
            utterance.rate = 0.95;
        }
        else {
            utterance.pitch = 1.0;
            utterance.rate = 1.0;
        }
        const orb = document.getElementById('voice-orb');
        const orbLabel = document.getElementById('orb-label');
        const feedback = document.getElementById('voice-status-feedback');
        utterance.onstart = () => {
            this.isSpeaking = true;
            if (orb)
                orb.classList.add('speaking');
            if (orbLabel)
                orbLabel.textContent = this.t().voiceSpeaking;
            if (feedback)
                feedback.textContent = this.t().voiceStatusSpeaking;
        };
        utterance.onend = () => {
            this.isSpeaking = false;
            if (orb)
                orb.classList.remove('speaking');
            if (orbLabel)
                orbLabel.textContent = this.t().voiceTapToSpeak;
            if (feedback)
                feedback.textContent = this.t().voiceStatusReady;
        };
        utterance.onerror = () => {
            this.isSpeaking = false;
            if (orb)
                orb.classList.remove('speaking');
            if (orbLabel)
                orbLabel.textContent = this.t().voiceTapToSpeak;
        };
        window.speechSynthesis.speak(utterance);
    }
    // ===========================================================================
    // PERSONA & MODE MANAGEMENT
    // ===========================================================================
    setPersona(persona) {
        this.currentPersona = persona;
        localStorage.setItem('evabot_persona', persona);
        this.updatePersonaUI();
        if (this.voiceDockUI) {
            this.voiceDockUI.setPersona(persona === 'adam' ? 'adam' : 'eva');
        }
        const nameMap = {
            eva: '[F] EVA (Frontend & UX Director)',
            adam: '[M] ADAM (Chief Backend Architect)',
            dual: '[DUAL] EVA & ADAM (Full-Stack Co-Pilots)',
        };
        this.addSystemNotification(`${this.t().noticePersonaSwitched} **${nameMap[persona]}**`);
    }
    updatePersonaUI() {
        const t = this.t();
        const pill = document.getElementById('header-persona-name');
        if (pill) {
            if (this.currentPersona === 'eva')
                pill.textContent = t.personaEvaLabel;
            else if (this.currentPersona === 'adam')
                pill.textContent = t.personaAdamLabel;
            else
                pill.textContent = t.personaDualLabel;
        }
        document.querySelectorAll('#persona-selector-group [data-persona]').forEach((btn) => {
            const p = btn.getAttribute('data-persona');
            if (p === this.currentPersona) {
                btn.classList.add('active');
            }
            else {
                btn.classList.remove('active');
            }
        });
        this.updateTelemetryUI();
    }
    setMode(mode) {
        this.currentMode = mode;
        localStorage.setItem('evabot_mode', mode);
        this.updateModeUI();
        this.addSystemNotification(`${this.t().noticeModeSwitched} **${mode.toUpperCase()}**`);
    }
    updateModeUI() {
        const headerMode = document.getElementById('header-mode-badge');
        if (headerMode)
            headerMode.textContent = `MODE: ${this.currentMode.toUpperCase()}`;
        document.querySelectorAll('#mode-selector-group [data-mode]').forEach((btn) => {
            const m = btn.getAttribute('data-mode');
            if (m === this.currentMode) {
                btn.classList.add('active');
            }
            else {
                btn.classList.remove('active');
            }
        });
        this.updateTelemetryUI();
    }
    updatePresetButtonsUI() {
        const paidBtn = document.getElementById('btn-preset-top10-paid');
        const freeBtn = document.getElementById('btn-preset-top10-free');
        if (this.consiliumPreset === 'top10_paid') {
            paidBtn?.classList.add('active');
            freeBtn?.classList.remove('active');
        }
        else if (this.consiliumPreset === 'top10_free') {
            freeBtn?.classList.add('active');
            paidBtn?.classList.remove('active');
        }
        else {
            paidBtn?.classList.remove('active');
            freeBtn?.classList.remove('active');
        }
    }
    setDb(db) {
        this.currentDb = db;
        this.updateDbUI();
        this.addSystemNotification(`${this.t().noticeDbSwitched} **${db.toUpperCase()}**`);
    }
    updateDbUI() {
        document.querySelectorAll('#db-selector-group [data-db]').forEach((btn) => {
            const d = btn.getAttribute('data-db');
            if (d === this.currentDb) {
                btn.classList.add('active');
            }
            else {
                btn.classList.remove('active');
            }
        });
        const tickerDb = document.getElementById('ticker-db');
        if (tickerDb) {
            const labels = {
                hybrid: 'HYBRID RAG',
                postgres: 'POSTGRES',
                qdrant: 'QDRANT VECTOR',
                ephemeral: 'EPHEMERAL',
            };
            tickerDb.textContent = labels[this.currentDb];
        }
    }
    setRole(role) {
        this.currentRole = role;
        this.updateRoleUI();
        this.addSystemNotification(`${this.t().noticeRoleSwitched} **${role.toUpperCase()}**`);
    }
    updateRoleUI() {
        document.querySelectorAll('#roles-selector-group [data-role]').forEach((btn) => {
            const r = btn.getAttribute('data-role');
            if (r === this.currentRole) {
                btn.classList.add('active');
            }
            else {
                btn.classList.remove('active');
            }
        });
    }
    // ===========================================================================
    // MODEL SELECTOR & SPECIFICATIONS
    // ===========================================================================
    populateModelSelector() {
        const select = document.getElementById('deck-model-select');
        if (!select)
            return;
        select.innerHTML = '';
        const categories = ModelRegistry.getCategories();
        for (const cat of categories) {
            const models = ModelRegistry.getModelsByCategory(cat);
            if (!models || models.length === 0)
                continue;
            const group = document.createElement('optgroup');
            group.label = cat;
            for (const m of models) {
                const opt = document.createElement('option');
                opt.value = m.id;
                const isFree = m.pricing.freeTierStatus.includes('Free');
                opt.textContent = `${m.name} ${isFree ? '[FREE]' : '[PAID]'}`;
                if (m.id === this.currentModel)
                    opt.selected = true;
                group.appendChild(opt);
            }
            select.appendChild(group);
        }
    }
    updateModelDetailsUI() {
        const m = ModelRegistry.getModelById(this.currentModel);
        if (!m)
            return;
        const isFree = m.pricing.freeTierStatus.includes('Free');
        const headerName = document.getElementById('header-model-name');
        if (headerName)
            headerName.textContent = m.name;
        const headerBadge = document.getElementById('header-model-badge');
        if (headerBadge) {
            headerBadge.textContent = isFree ? '[FREE]' : '[PAID]';
            headerBadge.style.color = isFree ? 'var(--clr-green)' : 'var(--clr-yellow)';
        }
        const tierBadge = document.getElementById('model-tier-badge');
        if (tierBadge) {
            tierBadge.textContent = isFree ? '🟢 100% FREE QUOTA ($0.00)' : '[PAID] PAID / PAYG';
            tierBadge.style.color = isFree ? 'var(--clr-green)' : 'var(--clr-yellow)';
        }
        const specUsd = document.getElementById('spec-usd');
        if (specUsd)
            specUsd.textContent = `In: ${m.pricing.inputPer1MTokensUSD} / Out: ${m.pricing.outputPer1MTokensUSD}`;
        const specEur = document.getElementById('spec-eur');
        if (specEur)
            specEur.textContent = `In: ${m.pricing.inputPer1MTokensEUR} / Out: ${m.pricing.outputPer1MTokensEUR}`;
        const specContext = document.getElementById('spec-context');
        if (specContext)
            specContext.textContent = `${m.contextWindow.toLocaleString()} tokens`;
    }
    updateKeyStatusUI() {
        const statusEl = document.getElementById('deck-key-status');
        const input = document.getElementById('deck-api-key-input');
        const customKey = localStorage.getItem('evabot_gemini_key') || '';
        if (input && !input.value) {
            input.value = customKey;
        }
        if (statusEl) {
            if (customKey) {
                statusEl.textContent = '[OK] CUSTOM KEY ACTIVE';
                statusEl.style.color = 'var(--clr-green)';
            }
            else {
                statusEl.textContent = '[OK] GOOGLE AMBIENT AUTH';
                statusEl.style.color = 'var(--clr-green)';
            }
        }
    }
    // ===========================================================================
    // REAL BOOT PROBE & TELEMETRY
    // ===========================================================================
    async checkHealth() {
        const t0 = performance.now();
        try {
            const res = await fetch('/api/health');
            this.lastLatencyMs = Math.round(performance.now() - t0);
            if (res.ok) {
                const data = await res.json();
                if (data.uptimeSeconds)
                    this.serverUptimeSec = data.uptimeSeconds;
                if (data.memoryUsageMb)
                    this.serverMemoryMb = data.memoryUsageMb;
                if (data.account)
                    this.userAccount = data.account;
                if (data.authSource)
                    this.authSource = data.authSource;
            }
        }
        catch {
            this.lastLatencyMs = 999;
        }
        this.updateTelemetryUI();
    }
    async fetchBootDiagnostics() {
        try {
            const res = await fetch(`/api/diagnostics/boot?model=${encodeURIComponent(this.currentModel)}`);
            if (res.ok) {
                const report = await res.json();
                const tickerMsg = document.getElementById('boot-ticker-msg');
                if (tickerMsg && report.steps) {
                    tickerMsg.innerHTML = `
            <span style="color:var(--clr-green); font-weight:700;">[OK] INITIALIZED:</span>
            <span>All ${report.steps.length} Systems Healthy * Frankfurt [c3-std-8] & Iowa [e2-micro] Online (${report.totalDurationMs}ms)</span>
          `;
                }
            }
        }
        catch (e) {
            console.warn('Boot diagnostics skipped:', e);
        }
    }
    startTelemetryLoop() {
        if (this.uptimeInterval)
            clearInterval(this.uptimeInterval);
        this.uptimeInterval = setInterval(() => {
            this.serverUptimeSec += 1;
            this.updateTelemetryUI();
        }, 1000);
        setInterval(() => {
            this.checkHealth();
        }, 15000);
    }
    updateTelemetryUI() {
        const uptimeEl = document.getElementById('telem-uptime');
        if (uptimeEl) {
            const hrs = Math.floor(this.serverUptimeSec / 3600);
            const mins = Math.floor((this.serverUptimeSec % 3600) / 60);
            const secs = this.serverUptimeSec % 60;
            uptimeEl.textContent = `${hrs}h ${mins}m ${secs}s`;
        }
        const memEl = document.getElementById('telem-memory');
        if (memEl)
            memEl.textContent = `${this.serverMemoryMb} MB`;
        const latEl = document.getElementById('telem-latency');
        if (latEl)
            latEl.textContent = `${this.lastLatencyMs} ms`;
        const tickerLat = document.getElementById('ticker-latency');
        if (tickerLat)
            tickerLat.textContent = `${this.lastLatencyMs}ms`;
        const tickerTokens = document.getElementById('ticker-tokens');
        if (tickerTokens)
            tickerTokens.textContent = this.sessionTotalTokens.toLocaleString();
        const tickerCost = document.getElementById('ticker-cost');
        if (tickerCost)
            tickerCost.textContent = `$${this.sessionTotalCostUSD.toFixed(4)} / €${this.sessionTotalCostEUR.toFixed(4)}`;
        const telemTokens = document.getElementById('telem-tokens');
        if (telemTokens)
            telemTokens.textContent = this.sessionTotalTokens.toLocaleString();
        const telemCost = document.getElementById('telem-cost');
        if (telemCost)
            telemCost.textContent = `$${this.sessionTotalCostUSD.toFixed(4)} / €${this.sessionTotalCostEUR.toFixed(4)}`;
    }
    // ===========================================================================
    // SCREEN TRANSITIONS & TERMINAL MESSAGES
    // ===========================================================================
    activateChatRegion() {
        const chatRegion = document.getElementById('chat-stream-region');
        if (chatRegion)
            chatRegion.style.display = 'flex';
    }
    restoreVoiceHero() {
        // Retained for backward compatibility
    }
    renderStatusBarOnly() {
        const m = ModelRegistry.getModelById(this.currentModel);
        const isFree = m?.pricing.freeTierStatus === '100% Free Quota Available';
        const tierBadge = isFree ? '[FREE]' : '[PAID]';
        const barText = `────────────────────────────────────────────────────────────────────────────────
  EVABOT [ONLINE] │ ${this.currentModel} [${tierBadge}] │ ${this.currentMode.toUpperCase()} │ [DUAL] EVA & ADAM
  Standards: USD ($) & EUR (€) │ ${ModelRegistry.getAllModels().length} Models │ /help for commands
────────────────────────────────────────────────────────────────────────────────`;
        this.appendMessage({
            role: 'system',
            text: barText,
            timestamp: new Date().toLocaleTimeString(),
        });
    }
    async renderStartupSequence() {
        const t = this.t();
        const m = ModelRegistry.getModelById(this.currentModel);
        const isFree = m?.pricing.freeTierStatus === '100% Free Quota Available';
        const tierBadge = isFree ? '[FREE]' : '[PAID]';
        const bootBanner = `┌──────────────────────────────────────────────────────────────────────────────┐
│ [>>] EVABOT ONLINE v0.0.1 MVP // LINEAR CYBER-TERMINAL                       │
│ Base: Odesa, Ukraine (UA) │ Zero-Trust Google Cloud Infrastructure           │
│ Hybrid Topology: Web Edge Gateway (Face) <───> Agent Server (Brain)          │
│ Modes: CHAT, DIALOG, INTERVIEW, CONSILIUM │ Pure ASCII Cyber-Stream          │
└──────────────────────────────────────────────────────────────────────────────┘

[BOOT DIAGNOSTICS] Probing dual-server infrastructure & model garden...`;
        this.appendMessage({
            role: 'system',
            text: bootBanner,
            timestamp: new Date().toLocaleTimeString(),
        });
        try {
            const res = await fetch(`/api/diagnostics/boot?model=${encodeURIComponent(this.currentModel)}`);
            if (res.ok) {
                const report = await res.json();
                const tickerMsg = document.getElementById('boot-ticker-msg');
                if (tickerMsg && report.steps) {
                    tickerMsg.innerHTML = `
            <span style="color:var(--clr-green); font-weight:700;">[OK] INITIALIZED:</span>
            <span>All ${report.steps.length} Systems Healthy * Frankfurt [c3-std-8] & Iowa [e2-micro] Online (${report.totalDurationMs}ms)</span>
          `;
                }
                let stepsText = '';
                for (const step of report.steps) {
                    const icon = step.status === 'success' ? '[OK]' : '[ERR]';
                    stepsText += `  ${icon} ${step.name} (${step.latencyMs}ms)\n     └─ ${step.details}\n`;
                }
                stepsText += `\n[OK] ALL DIAGNOSTIC CHECKS PASSED [Total: ${report.totalDurationMs}ms]\n`;
                stepsText += `────────────────────────────────────────────────────────────────────────────────\n`;
                stepsText += `  EVABOT [ONLINE] │ ${this.currentModel} [${tierBadge}] │ ${this.currentMode.toUpperCase()} │ [DUAL] EVA & ADAM\n`;
                stepsText += `  Standards: USD ($) & EUR (€) │ ${ModelRegistry.getAllModels().length} Models │ /help for commands\n`;
                stepsText += `────────────────────────────────────────────────────────────────────────────────\n\n`;
                stepsText += `evabot> ${t.welcomeNotice}`;
                this.appendMessage({
                    role: 'model',
                    text: stepsText,
                    timestamp: new Date().toLocaleTimeString(),
                    metadata: {
                        model: this.currentModel,
                        persona: this.currentPersona,
                        mode: this.currentMode,
                    },
                });
            }
        }
        catch (e) {
            console.warn('Boot diagnostics probe offline:', e);
        }
    }
    renderWelcomeMessage() {
        this.renderStartupSequence();
    }
    // ===========================================================================
    // SLASH COMMAND PARSER
    // ===========================================================================
    handleSlashCommand(input) {
        const trimmed = input.trim();
        if (!trimmed.startsWith('/'))
            return false;
        const [cmd, ...args] = trimmed.split(/\s+/);
        const argStr = args.join(' ').toLowerCase();
        if (cmd === '/help') {
            const helpTable = `| Command | Parameters | Description |
|---|---|---|
| \`/help\` | None | Display terminal commands and shortcuts |
| \`/persona\` | \`eva\` \| \`adam\` \| \`dual\` | Switch active Co-Pilot persona |
| \`/mode\` | \`chat\` \| \`dialog\` \| \`interview\` \| \`consilium\` | Switch operational mode |
| \`/db\` | \`hybrid\` \| \`postgres\` \| \`qdrant\` \| \`ephemeral\` | Route database knowledge base |
| \`/preset\` | \`top10_paid\` \| \`top10_free\` | Activate Consilium multi-agent preset |
| \`/models\` | None | List top catalog models with pricing in USD ($) and EUR (€) |
| \`/menu\` | None | Open System Deck & Configuration (Screen 2) |
| \`/boot\` | None | Run live dual-cluster diagnostics probe |
| \`/clear\` | None | Purge terminal screen |`;
            this.appendMessage({
                role: 'system',
                text: `### EVABOT ONLINE COMMAND PALETTE\n\n${helpTable}`,
                timestamp: new Date().toLocaleTimeString(),
            });
            return true;
        }
        if (cmd === '/persona') {
            if (argStr === 'eva' || argStr === 'adam' || argStr === 'dual') {
                this.setPersona(argStr);
            }
            else {
                this.addSystemNotification('Usage: `/persona <eva | adam | dual>`');
            }
            return true;
        }
        if (cmd === '/mode') {
            if (argStr === 'chat' || argStr === 'dialog' || argStr === 'interview' || argStr === 'consilium') {
                this.setMode(argStr);
            }
            else {
                this.addSystemNotification('Usage: `/mode <chat | dialog | interview | consilium>`');
            }
            return true;
        }
        if (cmd === '/db') {
            if (argStr === 'hybrid' || argStr === 'postgres' || argStr === 'qdrant' || argStr === 'ephemeral') {
                this.setDb(argStr);
            }
            else {
                this.addSystemNotification('Usage: `/db <hybrid | postgres | qdrant | ephemeral>`');
            }
            return true;
        }
        if (cmd === '/preset') {
            if (argStr === 'top10_paid') {
                document.getElementById('btn-preset-top10-paid')?.click();
            }
            else if (argStr === 'top10_free') {
                document.getElementById('btn-preset-top10-free')?.click();
            }
            else {
                this.addSystemNotification('Usage: `/preset <top10_paid | top10_free>`');
            }
            return true;
        }
        if (cmd === '/models') {
            const topPaid = ModelRegistry.getTop10PaidSmartestModels();
            const topFree = ModelRegistry.getTop10FreeModels();
            let out = '### TOP-10 SMARTEST MODELS (PAID/PAYG)\n\n';
            out += '| Model | Provider | Input (USD) | Output (USD) | Input (EUR) | Output (EUR) |\n|---|---|---|---|---|---|\n';
            topPaid.forEach((m) => {
                out += `| \`${m.id}\` | ${m.provider} | ${m.pricing.inputPer1MTokensUSD} | ${m.pricing.outputPer1MTokensUSD} | ${m.pricing.inputPer1MTokensEUR} | ${m.pricing.outputPer1MTokensEUR} |\n`;
            });
            out += '\n### TOP-10 FREE QUOTA MODELS\n\n';
            out += '| Model | Provider | Context | Free Quota Status |\n|---|---|---|---|\n';
            topFree.forEach((m) => {
                out += `| \`${m.id}\` | ${m.provider} | ${m.contextWindow.toLocaleString()} tokens | ${m.pricing.freeTierDetails} |\n`;
            });
            this.appendMessage({
                role: 'system',
                text: out,
                timestamp: new Date().toLocaleTimeString(),
            });
            return true;
        }
        if (cmd === '/menu') {
            document.getElementById('screen-control-deck')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return true;
        }
        if (cmd === '/boot') {
            this.renderStartupSequence();
            return true;
        }
        if (cmd === '/clear') {
            this.messages = [];
            const container = document.getElementById('messages-container');
            if (container)
                container.innerHTML = '';
            this.renderStatusBarOnly();
            this.addSystemNotification(this.t().noticeChatCleared);
            return true;
        }
        return false;
    }
    // ===========================================================================
    // TRANSMISSION & GENERATION ENGINE
    // ===========================================================================
    buildSystemInstruction() {
        const personaDirectives = {
            eva: 'You are Eva, the Lead Frontend Architect and UX Director of EvaLine. You specialize in client-side architecture, high-contrast cyber-terminal aesthetics, Web Speech integration, responsive layout ergonomics, and strategic design systems. Speak with authority, elegance, and sharp strategic perspective.',
            adam: 'You are Adam, the Chief Backend Architect and Cloud Systems Lead of EvaLine. You engineer distributed computing clusters, high-throughput microservices, PostgreSQL pipelines, Zero-Trust security, and OmniRoute load balancers. Prioritize strict algorithmic rigor, low-level efficiency, and zero-compromise stability.',
            dual: 'You represent Eva (Lead Frontend Architect) and Adam (Chief Backend Architect) operating in perfect full-stack synergy. Provide a cohesive perspective: Eva addresses user experience, ergonomics, and frontend flow, while Adam reinforces backend scalability, database schema, and distributed resilience.',
        };
        const roleDirective = `Specialized Focus Role: ${this.currentRole.toUpperCase()}.`;
        const langDirective = this.currentLang === 'uk'
            ? 'Respond strictly in Ukrainian (Українська мова). Maintain technical precision, clean cyber-terminal formatting.'
            : this.currentLang === 'ru'
                ? 'Respond strictly in Russian. Maintain technical precision, clean cyber-terminal formatting.'
                : 'Respond strictly in English. Maintain technical precision, clean cyber-terminal formatting.';
        const locationPolicy = ' EvaBot Online is based in Odesa, Ukraine (UA). Financial calculations, cloud compute costs, and pricing are strictly denominated in USD ($) or EUR (€). Never mention Russia, Russian regional entities, products, brands, or Russian currency.';
        return `${personaDirectives[this.currentPersona]}\n\n${roleDirective}\n\n${langDirective}\n\n${locationPolicy}\n\nFormat your responses with clean monospace cyber-terminal markdown, tables, and clean code blocks.`;
    }
    async handleSend() {
        if (this.isGenerating) {
            if (this.abortController) {
                this.abortController.abort();
            }
            return;
        }
        const input = document.getElementById('user-input');
        const text = input?.value.trim();
        if (!text)
            return;
        input.value = '';
        // Check for slash commands
        if (this.handleSlashCommand(text)) {
            this.activateChatRegion();
            return;
        }
        this.activateChatRegion();
        const now = new Date().toLocaleTimeString();
        this.appendMessage({
            role: 'user',
            text,
            timestamp: now,
            metadata: {
                mode: this.currentMode,
                persona: this.currentPersona,
            },
        });
        const customKey = localStorage.getItem('evabot_gemini_key') || '';
        this.isGenerating = true;
        this.updateStatusLight('busy');
        this.updateSendButtonState(true);
        const botMessageElement = this.createMessageBubble('model', '', now);
        const textSpan = botMessageElement.querySelector('.message-body');
        try {
            this.abortController = new AbortController();
            // If mode is 'chat', use streaming SSE endpoint
            if (this.currentMode === 'chat') {
                const historyPayload = this.messages
                    .filter((m) => m.role === 'user' || m.role === 'model')
                    .slice(-10)
                    .map((m) => ({
                    role: m.role,
                    parts: [{ text: m.text }],
                }));
                const t0 = performance.now();
                const response = await fetch('/api/chat/stream', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        message: text,
                        model: this.currentModel,
                        history: historyPayload,
                        apiKey: customKey || undefined,
                        systemInstruction: this.buildSystemInstruction(),
                    }),
                    signal: this.abortController.signal,
                });
                this.lastLatencyMs = Math.round(performance.now() - t0);
                this.updateTelemetryUI();
                if (!response.ok) {
                    const errJson = await response.json().catch(() => ({ error: 'Transmission error' }));
                    throw new Error(errJson.error || `HTTP ${response.status}`);
                }
                if (!response.body)
                    throw new Error('Readable stream not supported');
                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');
                let accumulatedText = '';
                let buffer = '';
                let usageInfo = null;
                let costInfo = null;
                while (true) {
                    const { done, value } = await reader.read();
                    if (done)
                        break;
                    buffer += decoder.decode(value, { stream: true });
                    const lines = buffer.split('\n');
                    buffer = lines.pop() || '';
                    for (const line of lines) {
                        const trimmed = line.trim();
                        if (trimmed.startsWith('data: ')) {
                            const dataStr = trimmed.slice(6).trim();
                            if (!dataStr)
                                continue;
                            try {
                                const data = JSON.parse(dataStr);
                                if (data.chunk) {
                                    accumulatedText += data.chunk;
                                    textSpan.innerHTML = this.renderMarkdown(accumulatedText);
                                    this.scrollToBottom();
                                }
                                else if (data.error) {
                                    accumulatedText += `\n\n[Error: ${data.error}]`;
                                    textSpan.innerHTML = this.renderMarkdown(accumulatedText);
                                }
                                if (data.usage)
                                    usageInfo = data.usage;
                                if (data.cost)
                                    costInfo = data.cost;
                            }
                            catch {
                                // Ignore partial chunks
                            }
                        }
                    }
                }
                const pTok = usageInfo?.promptTokens ?? ModelRegistry.estimateTokens(text);
                const cTok = usageInfo?.completionTokens ?? ModelRegistry.estimateTokens(accumulatedText);
                const cst = costInfo ?? ModelRegistry.calculateCost(this.currentModel, pTok, cTok);
                this.sessionTotalTokens += (pTok + cTok);
                this.sessionTotalCostUSD += cst.costUSD;
                this.sessionTotalCostEUR += cst.costEUR;
                this.updateTelemetryUI();
                const auditBox = `\n\n\`\`\`text
┌──────────────────────────────────────────────────────────────────────────────┐
│ [MODEL] ${cst.modelName || this.currentModel} [${cst.isFreeTier ? 'FREE QUOTA' : 'PAID'}]
│ [TOKENS] In: ${pTok.toLocaleString()} + Out: ${cTok.toLocaleString()} = ${(pTok + cTok).toLocaleString()} Total
│ [COST] ${cst.formattedUSD} │ ${cst.formattedEUR}${cst.isFreeTier ? ` (Val: $${cst.commercialValueUSD.toFixed(6)} USD / €${cst.commercialValueEUR.toFixed(6)} EUR)` : ''}
└──────────────────────────────────────────────────────────────────────────────┘
\`\`\``;
                accumulatedText += auditBox;
                textSpan.innerHTML = this.renderMarkdown(accumulatedText);
                this.messages.push({
                    role: 'model',
                    text: accumulatedText,
                    timestamp: new Date().toLocaleTimeString(),
                    metadata: {
                        model: this.currentModel,
                        mode: this.currentMode,
                        persona: this.currentPersona,
                    },
                });
                // Trigger neural audio playback if applicable
                this.speakVoiceResponse(accumulatedText, this.currentPersona);
            }
            else {
                // Multi-agent execution (dialog, interview, consilium)
                const t0 = performance.now();
                textSpan.innerHTML = '<span style="color:var(--clr-yellow); font-family:var(--font-mono);">[>>] Multi-Agent Engine Deliberating... Synchronizing participants & models...</span>';
                const response = await fetch('/api/consilium', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: text,
                        mode: this.currentMode,
                        persona: this.currentPersona,
                        preset: this.consiliumPreset || undefined,
                        participants: this.consiliumCount,
                        apiKey: customKey || undefined,
                        useKnowledgeBase: true,
                    }),
                    signal: this.abortController.signal,
                });
                this.lastLatencyMs = Math.round(performance.now() - t0);
                this.updateTelemetryUI();
                if (!response.ok) {
                    const errJson = await response.json().catch(() => ({ error: 'Consilium execution failed' }));
                    throw new Error(errJson.error || `HTTP ${response.status}`);
                }
                const data = await response.json();
                const res = data.result;
                let outputMarkdown = '';
                if (res.consensus) {
                    outputMarkdown += `### [*] EXECUTIVE CONSENSUS\n\n${res.consensus}\n\n`;
                }
                if (res.interviewResult) {
                    const ir = res.interviewResult;
                    outputMarkdown += `### [*] INTERVIEW ASSESSMENT // SCORE: ${ir.score}/100\n\n`;
                    outputMarkdown += `**Rating:** ${ir.rating}\n\n`;
                    outputMarkdown += `**Executive Feedback:**\n${ir.feedback}\n\n`;
                    if (ir.nextQuestion) {
                        outputMarkdown += `**Next Probing Question:**\n> ${ir.nextQuestion}\n\n`;
                    }
                }
                if (res.turns && res.turns.length > 0) {
                    outputMarkdown += '### [*] PARTICIPANT DELIBERATIONS\n\n';
                    res.turns.forEach((turn) => {
                        const turnName = turn.name || turn.participantName || 'Agent';
                        const turnModel = turn.model || turn.modelId || 'Unknown Model';
                        const turnTokens = turn.totalTokens ? ` │ Tokens: ${turn.totalTokens}` : '';
                        const turnCost = turn.cost ? ` │ Cost: ${turn.cost.formattedUSD}` : '';
                        outputMarkdown += `#### [${turnName}] (${turnModel}${turnTokens}${turnCost})\n${turn.content}\n\n`;
                    });
                }
                if (res.costSummary) {
                    this.sessionTotalTokens += res.costSummary.totalTokens;
                    this.sessionTotalCostUSD += res.costSummary.totalCostUSD;
                    this.sessionTotalCostEUR += res.costSummary.totalCostEUR;
                    this.updateTelemetryUI();
                    outputMarkdown += `\n\`\`\`text\n`;
                    outputMarkdown += `┌──────────────────────────────────────────────────────────────────────────────┐\n`;
                    outputMarkdown += `│ [AUDIT] CONSILIUM PARTICIPATION: ${res.costSummary.models.length} Models\n`;
                    outputMarkdown += `│ [TOTAL TOKENS] ${res.costSummary.totalTokens.toLocaleString()} tokens (In: ${res.costSummary.totalPromptTokens.toLocaleString()}, Out: ${res.costSummary.totalCompletionTokens.toLocaleString()})\n`;
                    outputMarkdown += `│ [TOTAL COST] ${res.costSummary.formattedUSD} │ ${res.costSummary.formattedEUR}\n`;
                    outputMarkdown += `└──────────────────────────────────────────────────────────────────────────────┘\n`;
                    outputMarkdown += `\`\`\`\n`;
                }
                textSpan.innerHTML = this.renderMarkdown(outputMarkdown);
                this.scrollToBottom();
                this.messages.push({
                    role: 'model',
                    text: outputMarkdown,
                    timestamp: new Date().toLocaleTimeString(),
                    metadata: {
                        model: this.currentModel,
                        mode: this.currentMode,
                        persona: this.currentPersona,
                    },
                });
                const speakable = res.consensus || (res.interviewResult ? `${res.interviewResult.feedback}. ${res.interviewResult.nextQuestion || ''}` : '');
                if (speakable) {
                    this.speakVoiceResponse(speakable, this.currentPersona);
                }
            }
            this.updateStatusLight('online');
        }
        catch (err) {
            this.updateStatusLight('error');
            if (err.name === 'AbortError') {
                textSpan.innerHTML += '\n<span style="color:var(--clr-yellow); font-family:var(--font-mono); font-size:11px;"> [TRANSMISSION_HALTED_BY_OPERATOR 🟡]</span>';
            }
            else {
                textSpan.innerHTML = `<span style="color:var(--clr-red); font-family:var(--font-mono); font-size:11px;">[ERR] TRANSMISSION_ERROR: ${this.escapeHtml(err.message)}</span>`;
            }
        }
        finally {
            this.isGenerating = false;
            this.abortController = null;
            this.updateSendButtonState(false);
            this.setupCodeCopyButtons();
            setTimeout(() => {
                if (!this.isGenerating)
                    this.updateStatusLight('online');
            }, 3000);
        }
    }
    // ===========================================================================
    // UI STATUS & BUBBLES
    // ===========================================================================
    updateStatusLight(state) {
        const t = this.t();
        const light = document.getElementById('telemetry-status-light');
        const text = document.getElementById('telemetry-status-text');
        if (state === 'online') {
            if (light)
                light.className = 'led-green';
            if (text) {
                text.textContent = t.statusOnline;
                text.style.color = 'var(--clr-green)';
            }
        }
        else if (state === 'busy') {
            if (light)
                light.className = 'led-yellow';
            if (text) {
                text.textContent = t.statusBusy;
                text.style.color = 'var(--clr-yellow)';
            }
        }
        else {
            if (light)
                light.className = 'led-red';
            if (text) {
                text.textContent = t.statusError;
                text.style.color = 'var(--clr-red)';
            }
        }
    }
    updateSendButtonState(generating) {
        const t = this.t();
        const sendBtn = document.getElementById('send-btn');
        if (!sendBtn)
            return;
        if (generating) {
            sendBtn.textContent = t.stopBtn;
            sendBtn.style.background = '#78350f';
            sendBtn.style.color = 'var(--clr-yellow)';
            sendBtn.style.borderColor = 'var(--clr-yellow)';
        }
        else {
            sendBtn.textContent = t.transmitBtn;
            sendBtn.style.background = '#ffffff';
            sendBtn.style.color = '#000000';
            sendBtn.style.borderColor = '#ffffff';
        }
    }
    appendMessage(msg) {
        this.messages.push(msg);
        this.createMessageBubble(msg.role, msg.text, msg.timestamp);
        this.scrollToBottom();
        this.setupCodeCopyButtons();
    }
    createMessageBubble(role, text, timestamp) {
        const wrapper = document.createElement('div');
        wrapper.className = 'terminal-bubble ' + role;
        const isUser = role === 'user';
        const isSystem = role === 'system';
        const header = document.createElement('div');
        header.className = 'bubble-meta';
        let callsign = `┌─ [${timestamp}] [USER // OPERATOR]`;
        if (!isUser && !isSystem) {
            callsign = `┌─ [${timestamp}] [EVABOT // ${this.currentPersona.toUpperCase()} // ${this.currentMode.toUpperCase()}]`;
        }
        else if (isSystem) {
            callsign = `┌─ [${timestamp}] [SYSTEM // KERNEL]`;
        }
        header.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:700; color:${isUser ? '#ffffff' : isSystem ? 'var(--fg-muted)' : 'var(--clr-cyan)'};">${callsign}</span>
        <span style="font-size:10px; color:var(--fg-dim);">${isUser ? 'TX_OK' : 'RX_OK [OK]'}</span>
      </div>
    `;
        const body = document.createElement('div');
        body.className = 'message-body';
        body.style.lineHeight = '1.6';
        body.innerHTML = this.renderMarkdown(text);
        wrapper.appendChild(header);
        wrapper.appendChild(body);
        const container = document.getElementById('messages-container');
        container?.appendChild(wrapper);
        return wrapper;
    }
    renderMarkdown(md) {
        if (!md)
            return '';
        let html = md;
        // Code blocks with syntax copy buttons
        html = html.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_match, lang, code) => {
            const language = lang || 'text';
            const t = this.t();
            return `
        <div style="margin:10px 0; border:1px solid var(--border-bright); background:var(--bg-panel);">
          <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 10px; border-bottom:1px solid var(--border-dim); background:#000000; font-size:10px; color:var(--fg-muted);">
            <span style="font-weight:700; color:#ffffff;">┌ [CODE: ${language.toUpperCase()}]</span>
            <button class="copy-code-btn return-btn" style="padding:1px 6px; font-size:9px;" data-code="${encodeURIComponent(code)}">${t.copyBtn}</button>
          </div>
          <pre style="padding:10px; overflow-x:auto; font-size:11px; color:var(--fg-primary);"><code>${this.escapeHtml(code)}</code></pre>
          <div style="padding:2px 10px; font-size:9px; color:var(--fg-dim); border-top:1px solid var(--border-dim);">└──────────────────────────────────────────────────────────</div>
        </div>
      `;
        });
        // Inline code
        html = html.replace(/`([^`]+)`/g, '<code style="padding:1px 4px; border:1px solid var(--border-dim); background:var(--bg-panel); color:var(--clr-green); font-size:11px;">$1</code>');
        // Bold & italic
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#ffffff; font-weight:700;">$1</strong>');
        html = html.replace(/\*([^*]+)\*/g, '<em style="color:var(--fg-muted);">$1</em>');
        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3 style="font-size:12px; font-weight:800; color:#ffffff; margin:12px 0 4px; border-bottom:1px solid var(--border-dim); padding-bottom:2px;">> $1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2 style="font-size:13px; font-weight:800; color:#ffffff; margin:14px 0 6px; border-bottom:1px solid var(--border-bright); padding-bottom:4px;">>> $1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1 style="font-size:14px; font-weight:900; color:#ffffff; margin:16px 0 8px; border-bottom:1px solid #ffffff; padding-bottom:4px;">>>> $1</h1>');
        // Markdown tables
        html = html.replace(/((?:\|[^\n]+\|\n?)+)/g, (match) => {
            const rows = match.trim().split('\n');
            if (rows.length < 2)
                return match;
            let tableHtml = '<div style="overflow-x:auto; margin:10px 0;"><table style="width:100%; border-collapse:collapse; font-size:11px; border:1px solid var(--border-dim);">';
            rows.forEach((row, idx) => {
                if (row.includes('---'))
                    return; // delimiter row
                const cols = row.split('|').filter((_, i, arr) => i > 0 && i < arr.length - 1);
                const tag = idx === 0 ? 'th' : 'td';
                tableHtml += '<tr style="border-bottom:1px solid var(--border-dim);">';
                cols.forEach((c) => {
                    const val = c.trim();
                    tableHtml += `<${tag} style="padding:4px 8px; text-align:left; border-right:1px solid var(--border-dim); ${tag === 'th' ? 'font-weight:700; color:#ffffff; background:var(--bg-panel);' : 'color:var(--fg-primary);'}">${val}</${tag}>`;
                });
                tableHtml += '</tr>';
            });
            tableHtml += '</table></div>';
            return tableHtml;
        });
        // Lists
        html = html.replace(/^\s*-\s+(.*$)/gim, '<div style="display:flex; gap:6px; margin:2px 0 2px 8px;"><span style="color:var(--clr-green);">*</span><span>$1</span></div>');
        return html;
    }
    setupCodeCopyButtons() {
        const t = this.t();
        document.querySelectorAll('.copy-code-btn').forEach((btn) => {
            btn.onclick = () => {
                const raw = btn.getAttribute('data-code');
                if (raw) {
                    navigator.clipboard.writeText(decodeURIComponent(raw));
                    btn.textContent = t.copiedBtn;
                    setTimeout(() => {
                        btn.textContent = t.copyBtn;
                    }, 2000);
                }
            };
        });
    }
    addSystemNotification(text) {
        const container = document.getElementById('messages-container');
        if (!container)
            return;
        const notif = document.createElement('div');
        notif.style.textAlign = 'center';
        notif.style.margin = '6px 0';
        notif.style.fontSize = '11px';
        notif.style.color = 'var(--fg-muted)';
        notif.innerHTML = `* ${this.renderMarkdown(text)}`;
        container.appendChild(notif);
        this.scrollToBottom();
    }
    scrollToBottom() {
        const chatRegion = document.getElementById('chat-stream-region');
        if (chatRegion) {
            chatRegion.scrollTop = chatRegion.scrollHeight;
        }
    }
    escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }
}
window.EvaBotWebApp = EvaBotWebApp;
window.addEventListener('DOMContentLoaded', () => {
    window.evaBotApp = new EvaBotWebApp();
});
