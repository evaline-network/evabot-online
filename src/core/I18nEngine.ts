export type SupportedLocale = 'en' | 'uk' | 'ru';

export interface LocaleDefinition {
  statusOnline: string;
  statusBusy: string;
  statusOffline: string;
  ping: string;
  mesh: string;
  live: string;
  model: string;
  mode: string;
  pool: string;
  lang: string;
  commandsLabel: string;
  databasesLabel: string;
  databasesValue: string;
  loadLabel: string;
  brainLabel: string;
  faceLabel: string;
  greeting: string;
  placeholder: string;
  helpTitle: string;
  helpCommands: Array<{ cmd: string; desc: string }>;
  langSwitched: string;
  unknownCommand: string;
}

const DICTIONARY: Record<SupportedLocale, LocaleDefinition> = {
  en: {
    statusOnline: 'ONLINE',
    statusBusy: 'BUSY',
    statusOffline: 'OFFLINE',
    ping: 'Ping:',
    mesh: 'Mesh:',
    live: 'Live:',
    model: 'Model:',
    mode: 'Mode:',
    pool: '78 models (/models)',
    lang: 'Lang:',
    commandsLabel: 'Commands:',
    databasesLabel: 'Databases:',
    databasesValue: 'Chroma Vector (1075 embeddings) [OK] · SQLite FTS5 (1086 chunks) [OK] · Memory KB (178 docs) [OK]',
    loadLabel: 'Load:',
    brainLabel: 'Brain(Frankfurt)',
    faceLabel: 'Face(Iowa)',
    greeting: 'Connected to neural core evabot.online (Frankfurt, 78 models). Type a message or command (/help).',
    placeholder: 'Type a message or command (/help)...',
    helpTitle: 'SYSTEM COMMANDS:',
    helpCommands: [
      { cmd: '/top [free|paid|speed]', desc: 'Top models leaderboard by quality and recency' },
      { cmd: '/models', desc: 'Full interactive catalog of 78 models' },
      { cmd: '/info <model>', desc: 'Technical passport, context limits & token pricing' },
      { cmd: '/company [evaline|free|paid]', desc: '10-Agent Autonomous AI Corporation' },
      { cmd: '/evaline', desc: 'EvaLine Enterprise Business Swarm (Mats, SCM, 24/7 Support)' },
      { cmd: '/cost', desc: 'Financial ledger, token burn & cluster OpEx' },
      { cmd: '/lang [en|uk|ru]', desc: 'Instant language switch (English, Ukrainian, Russian)' },
      { cmd: '/mcp', desc: 'Active 21 MCP tool servers status' },
      { cmd: '/lsp', desc: 'Active 4 Language Server Protocol daemons' },
      { cmd: '/free, /paid', desc: 'Filter models by tariff tier' },
      { cmd: '/mode [solo|consilium]', desc: 'Toggle single model or multi-agent consilium' },
      { cmd: '/consilium [topic]', desc: 'Run multi-agent deliberation and synthesis' },
      { cmd: '/clear', desc: 'Clear terminal screen' },
    ],
    langSwitched: 'Language switched to English (EN). Interface updated instantly.',
    unknownCommand: 'Unknown command: {cmd}. Type /help for assistance.',
  },
  uk: {
    statusOnline: 'ОНЛАЙН',
    statusBusy: 'ЗАЙНЯТИЙ',
    statusOffline: 'ОФЛАЙН',
    ping: 'Пінг:',
    mesh: 'Mesh:',
    live: 'Live:',
    model: 'Модель:',
    mode: 'Режим:',
    pool: '78 моделей (/models)',
    lang: 'Мова:',
    commandsLabel: 'Команди:',
    databasesLabel: 'Бази даних:',
    databasesValue: 'Chroma Vector (1075 ембедінгів) [OK] · SQLite FTS5 (1086 чанків) [OK] · Memory KB (178 док) [OK]',
    loadLabel: 'Навантаження:',
    brainLabel: 'Brain(Frankfurt)',
    faceLabel: 'Face(Iowa)',
    greeting: 'Підключено до нейроядра evabot.online (Frankfurt, 78 моделей). Введіть повідомлення або команду (/help).',
    placeholder: 'Введіть повідомлення або команду (/help)...',
    helpTitle: 'СИСТЕМНІ КОМАНДИ:',
    helpCommands: [
      { cmd: '/top [free|paid|speed]', desc: 'Рейтинг моделей за якістю та новизною' },
      { cmd: '/models', desc: 'Повний інтерактивний каталог із 78 моделей' },
      { cmd: '/info <model>', desc: 'Технічний паспорт, контекстне вікно та тарифи' },
      { cmd: '/company [evaline|free|paid]', desc: 'Ростер 10 автономних ШІ-агентів компанії' },
      { cmd: '/evaline', desc: 'Бізнес-система агентів EvaLine (Автоковрики, SCM, 24/7 Сапорт)' },
      { cmd: '/cost', desc: 'Бухгалтерія, витрати токенів та собівартість OpEx' },
      { cmd: '/lang [en|uk|ru]', desc: 'Миттєва зміна мови (English, Українська, Русский)' },
      { cmd: '/mcp', desc: 'Статус пулу з 21 MCP-сервера' },
      { cmd: '/lsp', desc: 'Статус 4 глобальних мовних серверів LSP' },
      { cmd: '/free, /paid', desc: 'Фільтри моделей за тарифом' },
      { cmd: '/mode [solo|consilium]', desc: 'Перемикання режиму solo / консиліум' },
      { cmd: '/consilium [тема]', desc: 'Колегіальний аналіз та синтез консиліуму' },
      { cmd: '/clear', desc: 'Очистити екран термінала' },
    ],
    langSwitched: 'Мову перемкнено на українську (UK). Інтерфейс оновлено миттєво.',
    unknownCommand: 'Невідома команда: {cmd}. Введіть /help для довідки.',
  },
  ru: {
    statusOnline: 'ОНЛАЙН',
    statusBusy: 'ЗАНЯТ',
    statusOffline: 'ОФФЛАЙН',
    ping: 'Пинг:',
    mesh: 'Mesh:',
    live: 'Live:',
    model: 'Модель:',
    mode: 'Режим:',
    pool: '78 моделей (/models)',
    lang: 'Язык:',
    commandsLabel: 'Команды:',
    databasesLabel: 'Базы данных:',
    databasesValue: 'Chroma Vector (1075 эмбеддингов) [OK] · SQLite FTS5 (1086 чанков) [OK] · Memory KB (178 док) [OK]',
    loadLabel: 'Нагрузка:',
    brainLabel: 'Brain(Frankfurt)',
    faceLabel: 'Face(Iowa)',
    greeting: 'Подключено к нейроядру evabot.online (Frankfurt, 78 моделей). Введите сообщение или команду (/help).',
    placeholder: 'Введите сообщение или команду (/help)...',
    helpTitle: 'СИСТЕМНЫЕ КОМАНДЫ:',
    helpCommands: [
      { cmd: '/top [free|paid|speed]', desc: 'Топ моделей по качеству и новизне' },
      { cmd: '/models', desc: 'Полный интерактивный каталог из 78 моделей' },
      { cmd: '/info <model>', desc: 'Паспорт, контекстное окно и квоты модели' },
      { cmd: '/company [evaline|free|paid]', desc: 'Ростер 10 автономных ИИ-агентов компании' },
      { cmd: '/evaline', desc: 'Бизнес-система агентов EvaLine (Автоковрики, SCM, 24/7 Саппорт)' },
      { cmd: '/cost', desc: 'Бухгалтерия, токены и себестоимость OpEx' },
      { cmd: '/lang [en|uk|ru]', desc: 'Мгновенное переключение языка (English, Украинский, Русский)' },
      { cmd: '/mcp', desc: 'Пул из 21 активного MCP-сервера' },
      { cmd: '/lsp', desc: 'Статус 4 языковых демонов LSP' },
      { cmd: '/free, /paid', desc: 'Фильтры моделей по тарифу' },
      { cmd: '/mode [solo|consilium]', desc: 'Смена режима solo / консилиум' },
      { cmd: '/consilium [тема]', desc: 'Запуск коллегиального анализа моделей' },
      { cmd: '/clear', desc: 'Очистить экран терминала' },
    ],
    langSwitched: 'Язык переключен на русский (RU). Интерфейс обновлен мгновенно.',
    unknownCommand: 'Неизвестная команда: {cmd}. Введите /help для справки.',
  },
};

export class I18nEngine {
  private static activeLocale: SupportedLocale = 'en';

  public static getLocale(): SupportedLocale {
    return this.activeLocale;
  }

  public static setLocale(localeInput: string): { locale: SupportedLocale; message: string } {
    const clean = localeInput.toLowerCase().trim();
    if (clean === 'uk' || clean === 'ua' || clean === 'ukr' || clean === 'ukrainian') {
      this.activeLocale = 'uk';
    } else if (clean === 'ru' || clean === 'rus' || clean === 'russian') {
      this.activeLocale = 'ru';
    } else {
      this.activeLocale = 'en';
    }

    return {
      locale: this.activeLocale,
      message: DICTIONARY[this.activeLocale].langSwitched,
    };
  }

  public static getStrings(locale?: SupportedLocale): LocaleDefinition {
    return DICTIONARY[locale || this.activeLocale] || DICTIONARY.en;
  }

  public static formatHelp(locale?: SupportedLocale): string {
    const s = this.getStrings(locale);
    const lines: string[] = [];
    lines.push('');
    lines.push('═'.repeat(78));
    lines.push(`  ⚡ ${s.helpTitle}`);
    lines.push('═'.repeat(78));
    for (const c of s.helpCommands) {
      lines.push(`  ${c.cmd.padEnd(30)} - ${c.desc}`);
    }
    lines.push('═'.repeat(78));
    return lines.join('\n');
  }
}
