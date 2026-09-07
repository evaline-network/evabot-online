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
      { cmd: '/products [category|query]', desc: 'EvaLine product catalog: stats, categories, search' },
      { cmd: '/who [role]', desc: 'Corporate knowledge matrix: who knows what & info exchange' },
      { cmd: '/cost', desc: 'Financial ledger, token burn & cluster OpEx' },
      { cmd: '/lang [en|uk|ru]', desc: 'Instant language switch (English, Ukrainian, Russian)' },
      { cmd: '/mcp', desc: 'Active 21 MCP tool servers status' },
      { cmd: '/lsp', desc: 'Active 4 Language Server Protocol daemons' },
      { cmd: '/free, /paid', desc: 'Filter models by tariff tier' },
      { cmd: '/mode [solo|consilium]', desc: 'Toggle single model or multi-agent consilium' },
      { cmd: '/consilium [topic]', desc: 'Run multi-agent deliberation and synthesis' },
      { cmd: '/sephirot [topic]', desc: 'Sephirot/Tetraxis consilium: 10 Tree-of-Life agents' },
      { cmd: '/history [N]', desc: 'Last N chat messages across all sessions' },
      { cmd: '/memory', desc: 'Memory stats: KB docs, FTS chunks, chat DB, pointers' },
      { cmd: '/search <query>', desc: 'Full-text search across chats and knowledge base' },
      { cmd: '/find <query>', desc: 'Alias of /search' },
      { cmd: '/services', desc: 'Systemd/docker services and DB backends status' },
      { cmd: '/servers', desc: 'Cluster view: evabot-agent-vm + evaline-micro-vm' },
      { cmd: '/news [tag]', desc: 'Curated Evaline news feed: war, odessa, economy, eva, trends' },
      { cmd: '/health', desc: 'LLM provider health: circuit breakers & last 5 errors' },
      { cmd: '/debug [on|off|full]', desc: 'Debug mode: latency footer in replies & /log debug entries' },
      { cmd: '/log [N] [filter]', desc: 'Operation log tail: filter by level/kind/text' },
      { cmd: '/monitor', desc: 'Model monitor: TOP-10 free/paid coding models' },
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
      { cmd: '/products [категорія|запит]', desc: 'Каталог продукції EvaLine: статистика, категорії, пошук' },
      { cmd: '/who [роль]', desc: 'Матриця знань компанії: хто що знає та обмін інформацією' },
      { cmd: '/cost', desc: 'Бухгалтерія, витрати токенів та собівартість OpEx' },
      { cmd: '/lang [en|uk|ru]', desc: 'Миттєва зміна мови (English, Українська, Русский)' },
      { cmd: '/mcp', desc: 'Статус пулу з 21 MCP-сервера' },
      { cmd: '/lsp', desc: 'Статус 4 глобальних мовних серверів LSP' },
      { cmd: '/free, /paid', desc: 'Фільтри моделей за тарифом' },
      { cmd: '/mode [solo|consilium]', desc: 'Перемикання режиму solo / консиліум' },
      { cmd: '/consilium [тема]', desc: 'Колегіальний аналіз та синтез консиліуму' },
      { cmd: '/sephirot [тема]', desc: 'Консиліум Сефірот/Тетраксис: 10 агентів Дерева Життя' },
      { cmd: '/history [N]', desc: 'Останні N повідомлень чату з усіх сесій' },
      { cmd: '/memory', desc: 'Статистика памʼяті: база знань, FTS чанки, чат-БД' },
      { cmd: '/search <запит>', desc: 'Полнотекстовий пошук по чатах і базі знань' },
      { cmd: '/find <запит>', desc: 'Синонім /search' },
      { cmd: '/services', desc: 'Статус systemd/docker сервісів і бекендів БД' },
      { cmd: '/servers', desc: 'Кластер: evabot-agent-vm + evaline-micro-vm' },
      { cmd: '/news [тег]', desc: 'Кураторські новини Evaline: war, odessa, economy, eva, trends' },
      { cmd: '/health', desc: 'Здоров’я LLM-провайдерів: circuit breakers та останні 5 помилок' },
      { cmd: '/debug [on|off|full]', desc: 'Режим налагодження: футер латентності у відповідях і debug-записи в /log' },
      { cmd: '/log [N] [фільтр]', desc: 'Журнал операцій: останні N записів, фільтр за рівнем/типом/текстом' },
      { cmd: '/monitor', desc: 'Модельний монітор: ТОП-10 free/paid моделей для кодингу' },
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
      { cmd: '/products [категория|запрос]', desc: 'Каталог продукции EvaLine: статистика, категории, поиск' },
      { cmd: '/who [роль]', desc: 'Матрица знаний компании: кто что знает и обмен информацией' },
      { cmd: '/cost', desc: 'Бухгалтерия, токены и себестоимость OpEx' },
      { cmd: '/lang [en|uk|ru]', desc: 'Мгновенное переключение языка (English, Украинский, Русский)' },
      { cmd: '/mcp', desc: 'Пул из 21 активного MCP-сервера' },
      { cmd: '/lsp', desc: 'Статус 4 языковых демонов LSP' },
      { cmd: '/free, /paid', desc: 'Фильтры моделей по тарифу' },
      { cmd: '/mode [solo|consilium]', desc: 'Смена режима solo / консилиум' },
      { cmd: '/consilium [тема]', desc: 'Запуск коллегиального анализа моделей' },
      { cmd: '/sephirot [тема]', desc: 'Консилиум Сфирот/Тетраксис: 10 агентов Древа Жизни' },
      { cmd: '/history [N]', desc: 'Последние N сообщений чата из всех сессий' },
      { cmd: '/memory', desc: 'Статистика памяти: база знаний, FTS чанки, чат-БД' },
      { cmd: '/search <запрос>', desc: 'Полнотекстовый поиск по чатам и базе знаний' },
      { cmd: '/find <запрос>', desc: 'Синоним /search' },
      { cmd: '/services', desc: 'Статус systemd/docker сервисов и бекендов БД' },
      { cmd: '/servers', desc: 'Кластер: evabot-agent-vm + evaline-micro-vm' },
      { cmd: '/news [тег]', desc: 'Кураторские новости Evaline: war, odessa, economy, eva, trends' },
      { cmd: '/health', desc: 'Здоровье LLM-провайдеров: circuit breakers и последние 5 ошибок' },
      { cmd: '/debug [on|off|full]', desc: 'Режим отладки: футер латентности в ответах и debug-записи в /log' },
      { cmd: '/log [N] [фильтр]', desc: 'Журнал операций: последние N записей, фильтр по уровню/типу/тексту' },
      { cmd: '/monitor', desc: 'Модельный монитор: ТОП-10 free/paid моделей для кодинга' },
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
