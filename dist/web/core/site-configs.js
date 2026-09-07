export const SITE_CONFIGS = [
    {
        siteId: 'evabot.online',
        siteKey: 'evabot',
        title: 'EVABOT.ONLINE',
        tagline: 'AI Neural Core',
        section: {
            en: 'AI Neural Core',
            uk: 'ШІ Нейро-Ядро',
            ru: 'AI Нейросетевое Ядро',
        },
        accent: '#58a6ff',
        apiBase: '',
        modules: { worklog: true, hopTest: false, telemetry: true, chat: true },
        nodes: [
            {
                id: 'evabot.online',
                url: 'https://evabot.online',
                label: {
                    en: 'AI Neural Core — compute & orchestration hub',
                    uk: 'ШІ Нейро-Ядро — хаб обчислень та оркестрації',
                    ru: 'AI Нейросетевое Ядро — хаб вычислений и оркестрации',
                },
            },
            {
                id: 'evaline.network',
                url: 'https://evaline.network',
                label: {
                    en: 'Edge Mesh & network routing',
                    uk: 'Edge Mesh та мережева маршрутизація',
                    ru: 'Edge Mesh и сетевая маршрутизация',
                },
            },
            {
                id: 'evaline.online',
                url: 'https://evaline.online',
                label: {
                    en: 'Security, IAM & microservices',
                    uk: 'Безпека, IAM та мікросервіси',
                    ru: 'Безопасность, IAM и микросервисы',
                },
            },
            {
                id: 'evaline.website',
                url: 'https://evaline.website',
                label: {
                    en: 'Master chronicle & worklog',
                    uk: 'Головна хроніка та worklog',
                    ru: 'Главная хроника и worklog',
                },
            },
        ],
    },
    {
        siteId: 'evaline.network',
        siteKey: 'network',
        title: 'EVALINE.NETWORK',
        tagline: 'Edge Mesh & Network Routing',
        section: {
            en: 'Edge Mesh & Network Routing',
            uk: 'Edge Mesh та Мережева Маршрутизація',
            ru: 'Edge Mesh и Сетевая Маршрутизация',
        },
        accent: '#3fb950',
        apiBase: '',
        modules: { worklog: true, hopTest: true, telemetry: true, chat: false },
        nodes: [
            {
                id: 'evabot.online',
                url: 'https://evabot.online',
                label: {
                    en: 'AI Neural Core — compute & orchestration hub',
                    uk: 'ШІ Нейро-Ядро — хаб обчислень та оркестрації',
                    ru: 'AI Нейросетевое Ядро — хаб вычислений и оркестрации',
                },
            },
            {
                id: 'evaline.network',
                url: 'https://evaline.network',
                label: {
                    en: 'Edge Mesh & network routing — latency & routing intelligence',
                    uk: 'Edge Mesh та мережева маршрутизація — аналіз затримок та маршрутизація',
                    ru: 'Edge Mesh и сетевая маршрутизация — анализ задержек и маршрутизация',
                },
            },
            {
                id: 'evaline.online',
                url: 'https://evaline.online',
                label: {
                    en: 'Security, IAM & microservices',
                    uk: 'Безпека, IAM та мікросервіси',
                    ru: 'Безопасность, IAM и микросервисы',
                },
            },
            {
                id: 'evaline.website',
                url: 'https://evaline.website',
                label: {
                    en: 'Master chronicle & worklog',
                    uk: 'Головна хроніка та worklog',
                    ru: 'Главная хроника и worklog',
                },
            },
        ],
    },
    {
        siteId: 'evaline.online',
        siteKey: 'security',
        title: 'EVALINE.ONLINE',
        tagline: 'Security, IAM & Microservices',
        section: {
            en: 'Security, IAM & Microservices',
            uk: 'Безпека, IAM та Мікросервіси',
            ru: 'Безопасность, IAM и Микросервисы',
        },
        accent: '#f0883e',
        apiBase: '',
        modules: { worklog: true, hopTest: false, telemetry: true, chat: false },
        nodes: [
            {
                id: 'evabot.online',
                url: 'https://evabot.online',
                label: {
                    en: 'AI Neural Core — compute & orchestration hub',
                    uk: 'ШІ Нейро-Ядро — хаб обчислень та оркестрації',
                    ru: 'AI Нейросетевое Ядро — хаб вычислений и оркестрации',
                },
            },
            {
                id: 'evaline.network',
                url: 'https://evaline.network',
                label: {
                    en: 'Edge Mesh & network routing',
                    uk: 'Edge Mesh та мережева маршрутизація',
                    ru: 'Edge Mesh и сетевая маршрутизация',
                },
            },
            {
                id: 'evaline.online',
                url: 'https://evaline.online',
                label: {
                    en: 'Security, IAM & microservices — auth, policies & service mesh',
                    uk: 'Безпека, IAM та мікросервіси — автентифікація, політики та сервісна сітка',
                    ru: 'Безопасность, IAM и микросервисы — аутентификация, политики и сервисная сеть',
                },
            },
            {
                id: 'evaline.website',
                url: 'https://evaline.website',
                label: {
                    en: 'Master chronicle & worklog',
                    uk: 'Головна хроніка та worklog',
                    ru: 'Главная хроника и worklog',
                },
            },
        ],
    },
    {
        siteId: 'evaline.website',
        siteKey: 'chronicle',
        title: 'EVALINE.WEBSITE',
        tagline: 'Master Chronicle & Worklog',
        section: {
            en: 'Master Chronicle & Worklog',
            uk: 'Головна Хроніка та Worklog',
            ru: 'Главная Хроника и Worklog',
        },
        accent: '#d2a8ff',
        apiBase: '',
        modules: { worklog: true, hopTest: false, telemetry: true, chat: false },
        nodes: [
            {
                id: 'evabot.online',
                url: 'https://evabot.online',
                label: {
                    en: 'AI Neural Core — compute & orchestration hub',
                    uk: 'ШІ Нейро-Ядро — хаб обчислень та оркестрації',
                    ru: 'AI Нейросетевое Ядро — хаб вычислений и оркестрации',
                },
            },
            {
                id: 'evaline.network',
                url: 'https://evaline.network',
                label: {
                    en: 'Edge Mesh & network routing',
                    uk: 'Edge Mesh та мережева маршрутизація',
                    ru: 'Edge Mesh и сетевая маршрутизация',
                },
            },
            {
                id: 'evaline.online',
                url: 'https://evaline.online',
                label: {
                    en: 'Security, IAM & microservices',
                    uk: 'Безпека, IAM та мікросервіси',
                    ru: 'Безопасность, IAM и микросервисы',
                },
            },
            {
                id: 'evaline.website',
                url: 'https://evaline.website',
                label: {
                    en: 'Master chronicle & worklog — project history & documentation',
                    uk: 'Головна хроніка та worklog — історія проекту та документація',
                    ru: 'Главная хроника и worklog — история проекта и документация',
                },
            },
        ],
    },
];
