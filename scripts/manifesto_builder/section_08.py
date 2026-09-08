# -*- coding: utf-8 -*-
from helpers import t, accordion_section, sub_accordion

def get_section_08():
    # 8.1 Physical Manufacturing & Solving Business Pains
    sub1_content = f'''
      <div class="factory-overview-card">
        <div class="factory-header-row">
          <div>
            <div class="hero-eyebrow">{t("МАТЕРИАЛЬНЫЙ СУВЕРЕНИТЕТ // PHYSICAL ASSETS", "МАТЕРІАЛЬНИЙ СУВЕРЕНІТЕТ // PHYSICAL ASSETS", "PHYSICAL SOVEREIGNTY // ASSETS")}</div>
            <h4 style="color:#fff; font-size: 1.25rem; margin: 4px 0;">
              {t("Завод полимеров EvaLine (Черноморск) & Логистический хаб ЕС (Братислава)",
                 "Завод полімерів EvaLine (Чорноморськ) та Логістичний хаб ЄС (Братислава)",
                 "EvaLine Polymer Factory (Chornomorsk) & EU Logistics Hub (Bratislava)")}
            </h4>
          </div>
          <span class="sub-badge">{t("ISO 9001:2015 & CE", "ISO 9001:2015 & CE", "ISO 9001:2015 & CE")}</span>
        </div>
        <p style="color: var(--fg-muted); margin-bottom: 16px;">
          {t("EvaLine — это не просто виртуальный софт, а физический промышленный гигант: собственная фабрика площадью 2.8 гектара в Черноморске (Одесская область), 100+ квалифицированных инженеров и операторов, ежемесячный выпуск более 550 тонн полимерного листа ЭВА, 8 автоматизированных линий вспенивания и 4 раскройных плоттера ЧПУ. Европейский склад в Братиславе (Obchodna 37) гарантирует беспошлинную экспресс-доставку по странам ЕС за 24–48 часов.",
             "EvaLine — це не просто віртуальний софт, а фізичний промисловий гігант: власна фабрика площею 2.8 гектара в Чорноморську (Одеська область), 100+ кваліфікованих інженерів та операторів, щомісячний випуск понад 550 тонн полімерного листа ЕВА, 8 автоматизованих ліній спінювання та 4 розкрійні плотери ЧПК. Європейський склад у Братиславі (Obchodna 37) гарантує безмитну експрес-доставку країнами ЄС за 24–48 годин.",
             "EvaLine is not merely a digital platform, but a heavy physical manufacturer: an owned 2.8-hectare industrial plant in Chornomorsk (Odesa region), 100+ engineers and machine operators, over 550 tons of EVA polymer sheets produced monthly, 8 automated foaming lines, and 4 high-precision CNC cutting tables. An EU distribution warehouse in Bratislava (Obchodna 37) delivers duty-free 24-48h dispatch across the European Union.")}
        </p>

        <!-- Product Line Badges -->
        <div class="product-tags-row" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;">
          <span class="pill-tech">🚗 {t("Автоковрики EvaLine Drive (Ромб/Соты 8мм)", "Автокилимки EvaLine Drive (Ромб/Стільники 8мм)", "EvaLine Drive Auto Mats (Diamond/Cells)")}</span>
          <span class="pill-tech">🐄 {t("Маты для КРС «Бурьонка» (Компенсация 25%)", "Мати для ВРХ «Бурьонка» (Компенсація 25%)", "Buryonka Cow Mats (25% Subsidy)")}</span>
          <span class="pill-tech">⛵ {t("Морской тик Marine Teak (3M VHB, УФ-стойкий)", "Морський тік Marine Teak (3M VHB, УФ-стійкий)", "Marine Teak Decking (3M VHB UV)")}</span>
          <span class="pill-tech">🥋 {t("Татами «Ласточкин хвост» (75-250 кг/м³)", "Татамі «Ластівчин хвіст» (75-250 кг/м³)", "Tatami Puzzle Mats (75-250 kg/m³)")}</span>
        </div>
      </div>

      <!-- 6 Pain & Solution Cards -->
      <div class="biz-grid" style="margin-top: 20px;">
        <div class="biz-card">
          <div class="biz-card-header">
            <div class="biz-card-icon">⚡</div>
            <div class="biz-card-title">{t("Медленный саппорт и потеря клиентов", "Повільний саппорт та втрата клієнтів", "Slow Support & Lost Sales Deals")}</div>
          </div>
          <div class="biz-pain-box">
            <strong>{t("Боль бизнеса:", "Біль бізнесу:", "Pain:")}</strong> {t(
              "Менеджеры отвечают по 40–90 минут, ночью заявки простаивают, B2B-клиенты уходят к конкурентам. Текучка кадров, обучение новичка занимает до 3 месяцев.",
              "Менеджери відповідають по 40–90 хвилин, вночі заявки простоюють, B2B-клієнти йдуть до конкурентів. Плинність кадрів, навчання новачка триває до 3 місяців.",
              "Managers take 40–90 minutes to respond, night inquiries expire, and B2B clients defect to rivals. Staff turnover requires 3 months of costly training."
            )}
          </div>
          <div class="biz-solution-box">
            <strong>{t("Решение EvaBot:", "Рішення EvaBot:", "EvaBot Solution:")}</strong> {t(
              "Ролевые агенты Адам (инженер/B2B) и Ева (продажи/забота на 6 языках). Время первого квалифицированного ответа — 1.2 секунды в режиме 24/7/365 с проверкой реальных складских остатков.",
              "Рольові агенти Адам (інженер/B2B) та Єва (продажі/турбота 6 мовами). Час першої кваліфікованої відповіді — 1.2 секунди в режимі 24/7/365 з перевіркою реальних залишків на складі.",
              "Role-based agents Adam (engineering/B2B) and Eva (omnichannel sales in 6 languages). First qualified response in 1.2 seconds, 24/7/365, with live inventory verification."
            )}
          </div>
        </div>

        <div class="biz-card">
          <div class="biz-card-header">
            <div class="biz-card-icon">📐</div>
            <div class="biz-card-title">{t("Брак в раскрое и сметных спецификациях", "Брак у розкрої та сметних специфікаціях", "Scrap in CNC Cutting & Quoting")}</div>
          </div>
          <div class="biz-pain-box">
            <strong>{t("Боль производства:", "Біль виробництва:", "Manufacturing Pain:")}</strong> {t(
              "Ошибки мастеров при расчете выкроек ковриков или татами приводят к перерасходу полимерного листа до 12% и накоплению обрезков.",
              "Помилки майстрів при розрахунку викрійок килимків або татамі призводять до перевитрати полімерного листа до 12% та накопичення обрізків.",
              "Manual geometric calculation errors lead to up to 12% polymer sheet scrap and piles of unsellable offcut waste."
            )}
          </div>
          <div class="biz-solution-box">
            <strong>{t("Решение EvaBot:", "Рішення EvaBot:", "EvaBot Solution:")}</strong> {t(
              "Встроенный математический калькулятор раскроя листа ЭВА (2000×1250 мм, ячейки Ромб/Соты). Автоматическая генерация файлов для плоттеров ЧПУ с браком менее 0.01%.",
              "Вбудований математичний калькулятор розкрою листа ЕВА (2000×1250 мм, комірки Ромб/Стільники). Автоматична генерація файлів для плотерів ЧПК із браком менше 0.01%.",
              "Embedded algorithmic nesting calculator for EVA sheets (2000×1250mm, Shore 30-75A). Direct CNC G-code path generation with scrap rate under 0.01%."
            )}
          </div>
        </div>

        <div class="biz-card">
          <div class="biz-card-header">
            <div class="biz-card-icon">🧠</div>
            <div class="biz-card-title">{t("Галлюцинации и ненадежность одиночного ИИ", "Галюцинації та ненадійність одиночного ШІ", "Hallucinations of Standalone AI")}</div>
          </div>
          <div class="biz-pain-box">
            <strong>{t("Боль бизнеса:", "Біль бізнесу:", "Pain:")}</strong> {t(
              "Обычный бот уверенно выдумывает несуществующие статьи законов, занижает цены или обещает невыполнимые сроки, подставляя бизнес под иски.",
              "Звичайний бот упевнено вигадує неіснуючі статті законів, занижує ціни або обіцяє нездійсненні терміни, підставляючи бізнес під позови.",
              "Generic chatbots hallucinate non-existent statutes, misquote prices, or promise impossible fulfillment dates, creating legal liabilities."
            )}
          </div>
          <div class="biz-solution-box">
            <strong>{t("Решение EvaBot:", "Рішення EvaBot:", "EvaBot Solution:")}</strong> {t(
              "Евалайн Консилиум. Ни один важный документ не отдается одной модели. Решение вырабатывается состязательным спором 4–6 разнородных LLM с финальным аудитом CISO.",
              "Євалайн Консиліум. Жоден важливий документ не довіряється одній моделі. Рішення виробляється змагальним спором 4–6 різнорідних LLM з фінальним аудитом CISO.",
              "The EvaLine Consilium. No mission-critical document is left to a single model. Consensus is reached through adversarial debate of 4–6 heterogeneous LLMs plus CISO audit."
            )}
          </div>
        </div>

        <div class="biz-card">
          <div class="biz-card-header">
            <div class="biz-card-icon">🔌</div>
            <div class="biz-card-title">{t("Разрозненность софта («Зоопарк систем»)", "Розрізненість софту («Зоопарк систем»)", "Software Fragmentation ('Tool Zoo')")}</div>
          </div>
          <div class="biz-pain-box">
            <strong>{t("Боль бизнеса:", "Біль бізнесу:", "Pain:")}</strong> {t(
              "1С, CRM Битрикс, Telegram-каналы, складской софт и Excel живут изолированно. Менеджеры вручную копируют строки, порождая хаос и недостачи.",
              "1С, CRM Бітрікс, Telegram-канали, складський софт та Excel живуть ізольовано. Менеджери вручну копіюють рядки, породжуючи хаос і нестачі.",
              "1C:Enterprise, Bitrix24 CRM, Telegram groups, and spreadsheets operate in silos. Manual copy-pasting creates missing orders and inventory discrepancies."
            )}
          </div>
          <div class="biz-solution-box">
            <strong>{t("Решение EvaBot:", "Рішення EvaBot:", "EvaBot Solution:")}</strong> {t(
              "Единая шина из 21 MCP-сервера и модульных API. Агенты нативно обращаются к базам SQLite, PostgreSQL, ERP, складским таблицам и мессенджерам без посредников.",
              "Єдина шина з 21 MCP-сервера та модульних API. Агенти нативно звертаються до баз SQLite, PostgreSQL, ERP, складських таблиць і месенджерів без посередників.",
              "Unified bus of 21 Model Context Protocol servers and modular REST endpoints. Agents natively query databases, ERPs, inventory tables, and messengers without intermediaries."
            )}
          </div>
        </div>

        <div class="biz-card">
          <div class="biz-card-header">
            <div class="biz-card-icon">⚖️</div>
            <div class="biz-card-title">{t("Юридические риски экспорта в ЕС", "Юридичні ризики експорту в ЄС", "EU Export Compliance & Customs Risks")}</div>
          </div>
          <div class="biz-pain-box">
            <strong>{t("Боль бизнеса:", "Біль бізнесу:", "Pain:")}</strong> {t(
              "Подготовка внешнеэкономических контрактов (ВЭД), проверка регламентов ЕС, кодов УКТВЭД, стандартов ISO 9001, CE и норм UNIC отнимает дни юристов.",
              "Підготовка зовнішньоекономічних контрактів (ЗЕД), перевірка регламентів ЄС, кодів УКТЗЕД, стандартів ISO 9001, CE та норм UNIC забирає дні юристів.",
              "Export documentation, customs codes (HS codes), CE directives, ISO 9001 certifications, and UNIC anti-corruption audits demand days of legal counsel review."
            )}
          </div>
          <div class="biz-solution-box">
            <strong>{t("Решение EvaBot:", "Рішення EvaBot:", "EvaBot Solution:")}</strong> {t(
              "Агент Legal Compliance. Проверяет контрактные спецификации за 40 секунд по обновляемой базе европейских нормативов логистического хаба в Братиславе.",
              "Агент Legal Compliance. Перевіряє контрактні специфікації за 40 секунд за оновлюваною базою європейських нормативів логістичного хабу в Братиславі.",
              "Legal Compliance Agent. Audits trade contracts and dispatch declarations in 40 seconds against live EU regulatory databases at our Bratislava hub."
            )}
          </div>
        </div>

        <div class="biz-card">
          <div class="biz-card-header">
            <div class="biz-card-icon">🛡️</div>
            <div class="biz-card-title">{t("Уязвимость перед блэкаутами", "Вразливість перед блекаутами", "Grid Vulnerability & Blackouts")}</div>
          </div>
          <div class="biz-pain-box">
            <strong>{t("Боль производства:", "Біль виробництва:", "Manufacturing Pain:")}</strong> {t(
              "Военные риски, аварии энергосетей и обрывы связи замораживают работу предприятия, приводя к штрафам за срыв поставок.",
              "Військові ризики, аварії енергомереж та обриви зв'язку заморожують роботу підприємства, призводячи до штрафів за зрив поставок.",
              "Grid outages, infrastructure disruptions, and telecom drops freeze sales and manufacturing, risking severe delivery breach penalties."
            )}
          </div>
          <div class="biz-solution-box">
            <strong>{t("Решение EvaBot:", "Рішення EvaBot:", "EvaBot Solution:")}</strong> {t(
              "Двухузловой отказоустойчивый кластер (Франкфурт ⟷ Айова) на закрытой магистрали WireGuard Mesh. Облачные агенты продолжают прием заказов, а дизели питают цех.",
              "Двовузловий відмовостійкий кластер (Франкфурт ⟷ Айова) на закритій магістралі WireGuard Mesh. Хмарні агенти продовжують прийом замовлень, а дизелі живлять цех.",
              "Dual-node resilient cluster (Frankfurt ⟷ Iowa) across encrypted WireGuard tunnels. Cloud agents run uninterrupted while on-site industrial generators power the machines."
            )}
          </div>
        </div>
      </div>
    '''
    sub1 = sub_accordion(
        "sub-8-1", "🏭",
        "Суверенное производство полимеров EvaLine и решение 6 болей бизнеса",
        "Суверенне виробництво полімерів EvaLine та вирішення 6 болей бізнесу",
        "Physical Polymer Production at EvaLine Plant & Solving 6 Core Pains",
        "Завод 2.8 га", "Завод 2.8 га", "2.8 Ha Plant",
        sub1_content
    )

    # 8.2 End-to-End Autonomous Dataflow Pipeline
    sub2_content = f'''
      <p style="color: var(--fg-muted); margin-bottom: 20px;">
        {t("Каждая транзакция, входящий звонок или чертеж детали проходит 7-ступенчатую защищенную магистраль обработки в реальном времени:",
           "Кожна транзакція, вхідний дзвінок або креслення деталі проходить 7-ступеневу захищену магістраль обробки в реальному часі:",
           "Every customer transaction, VoIP call, or CAD blueprint traverses a 7-stage authenticated real-time processing pipeline:")}
      </p>

      <div class="pipeline-flow">
        <div class="pipe-step">
          <span class="pipe-badge">{t("Шаг 01 // Омниканал", "Крок 01 // Омніканал", "Step 01 // Omnichannel")}</span>
          <div class="pipe-name">{t("Клиентский вход", "Клієнтський вхід", "Client Ingestion")}</div>
          <div class="pipe-desc">{t(
            "Входящий звонок (EvaVoice), Telegram, WhatsApp, B2B-портал или вебхук из 1С/CRM.",
            "Вхідний дзвінок (EvaVoice), Telegram, WhatsApp, B2B-портал або вебхук з 1С/CRM.",
            "Inbound VoIP call (EvaVoice), Telegram, WhatsApp, B2B portal, or ERP/CRM webhook."
          )}</div>
          <div class="pipe-tech">FastAPI • WebSpeech • REST API</div>
        </div>

        <div class="pipe-step">
          <span class="pipe-badge">{t("Шаг 02 // Защита", "Крок 02 // Захист", "Step 02 // Edge Shield")}</span>
          <div class="pipe-name">{t("Фильтрация трафика", "Фільтрація трафіку", "Traffic Filtering")}</div>
          <div class="pipe-desc">{t(
            "Краевой шлюз EvaFace (Айова) отсекает DDoS, валидирует JWT-токены и шифрует туннель.",
            "Крайовий шлюз EvaFace (Айова) відсікає DDoS, валідує JWT-токени та шифрує тунель.",
            "EvaFace edge gateway (Iowa) blocks DDoS bursts, validates JWT signatures, and tunnels data."
          )}</div>
          <div class="pipe-tech">Caddy HTTP/3 • TLS 1.3 • WireGuard</div>
        </div>

        <div class="pipe-step">
          <span class="pipe-badge">{t("Шаг 03 // Маршрутизатор", "Крок 03 // Маршрутизатор", "Step 03 // Router")}</span>
          <div class="pipe-name">{t("OmniRoute селектор", "OmniRoute селектор", "OmniRoute Selector")}</div>
          <div class="pipe-desc">{t(
            "Анализ сложности задачи за 15 мс и выбор: бесплатный пул ($0) или платный флагман.",
            "Аналіз складності завдання за 15 мс та вибір: безкоштовний пул ($0) або платний флагман.",
            "Task complexity parsing in 15ms: selects zero-cost tier ($0) or commercial frontier models."
          )}</div>
          <div class="pipe-tech">Token Classifier • TTFT Monitor</div>
        </div>

        <div class="pipe-step">
          <span class="pipe-badge">{t("Шаг 04 // Память", "Крок 04 // Пам'ять", "Step 04 // Memory")}</span>
          <div class="pipe-name">{t("RAG и контекст", "RAG та контекст", "RAG & Knowledge")}</div>
          <div class="pipe-desc">{t(
            "Извлечение цен, чертежей и регламентов ISO/ТУ из базы ChromaDB и таблиц SQLite.",
            "Вилучення цін, креслень та регламентів ISO/ТУ з бази ChromaDB та таблиць SQLite.",
            "Retrieves live pricing, CAD files, and ISO standards from ChromaDB and SQLite FTS5."
          )}</div>
          <div class="pipe-tech">ChromaDB • SQLite FTS5 • Memory Graph</div>
        </div>

        <div class="pipe-step">
          <span class="pipe-badge">{t("Шаг 05 // Консилиум", "Крок 05 // Консиліум", "Step 05 // Consilium")}</span>
          <div class="pipe-name">{t("Коллегиальный дебат", "Колегіальний дебат", "Collegiate Debate")}</div>
          <div class="pipe-desc">{t(
            "Параллельный опрос моделей Google, Anthropic, DeepSeek. Синтез консенсуса без галлюцинаций.",
            "Паралельне опитування моделей Google, Anthropic, DeepSeek. Синтез консенсусу без галюцинацій.",
            "Parallel query across Google, Anthropic, DeepSeek. Consensus synthesis with 0% hallucinations."
          )}</div>
          <div class="pipe-tech">Gemini 3.1 Pro • Claude 3.7 • DeepSeek R1</div>
        </div>

        <div class="pipe-step">
          <span class="pipe-badge">{t("Шаг 06 // Аудит", "Крок 06 // Аудит", "Step 06 // CISO & QA")}</span>
          <div class="pipe-name">{t("Контроль безопасности", "Контроль безпеки", "Security Gate")}</div>
          <div class="pipe-desc">{t(
            "Проверка сметных лимитов, соблюдения норм UNIC, ISO 9001 и коммерческой тайны.",
            "Перевірка лімітів кошторису, дотримання норм UNIC, ISO 9001 та комерційної таємниці.",
            "Validates budget caps, UNIC integrity regulations, ISO 9001 rules, and data privacy."
          )}</div>
          <div class="pipe-tech">RulesEngine • OWASP Guard • Token Budget</div>
        </div>

        <div class="pipe-step">
          <span class="pipe-badge">{t("Шаг 07 // Исполнение", "Крок 07 // Виконання", "Step 07 // Action")}</span>
          <div class="pipe-name">{t("Физическое действие", "Фізична дія", "Physical Execution")}</div>
          <div class="pipe-desc">{t(
            "Запись накладной в 1С, отправка файла раскроя на плоттер ЧПУ и голосовой ответ клиенту.",
            "Запис накладної в 1С, відправка файлу розкрою на плотер ЧПК та голосова відповідь клієнту.",
            "Records invoice in 1C/ERP, dispatches cutting files to CNC, and speaks back to customer."
          )}</div>
          <div class="pipe-tech">21 MCP Servers • ЧПУ Плоттер • ERP/1C</div>
        </div>
      </div>
    '''
    sub2 = sub_accordion(
        "sub-8-2", "🔄",
        "Сквозной автономный конвейер данных: от звонка до станка ЧПУ и отгрузки",
        "Наскрізний автономний конвеєр даних: від дзвінка до верстата ЧПК та відвантаження",
        "End-to-End Autonomous Dataflow: From Omnichannel Lead to CNC & Shipping",
        "7 ступеней конвейера", "7 ступенів конвеєра", "7-Step Pipeline",
        sub2_content
    )

    # 8.3 Enterprise Integration Architecture
    sub3_content = f'''
      <div class="cards-grid">
        <div class="card">
          <div class="card-icon">💼</div>
          <h4 class="card-title">{t("1С:Предприятие & МойСклад", "1С:Підприємство та МійСклад", "1C:Enterprise & MoySklad ERP")}</h4>
          <p class="card-text">{t(
            "Двусторонний обмен через OData / REST API. Агенты считывают складские остатки листов ЭВА, формируют счета, регистрируют оплаты и списывают сырье без участия бухгалтера.",
            "Двосторонній обмін через OData / REST API. Агенти зчитують залишки листів ЕВА, формують рахунки, реєструють оплати та списують сировину без участі бухгалтера.",
            "Bi-directional sync via OData/REST. Agents query EVA sheet inventory, generate invoices, register payments, and debit raw materials automatically."
          )}</p>
        </div>

        <div class="card">
          <div class="card-icon">👥</div>
          <h4 class="card-title">{t("CRM Битрикс24 / amoCRM / HubSpot", "CRM Бітрікс24 / amoCRM / HubSpot", "Bitrix24 / amoCRM / HubSpot")}</h4>
          <p class="card-text">{t(
            "Автоматическое ведение лидов, парсинг входящих сообщений, продвижение сделок по воронке, генерация коммерческих предложений и контроль SLA ответов менеджеров.",
            "Автоматичне ведення лідів, парсинг вхідних повідомлень, пересування угод за воронкою, генерація комерційних пропозицій та контроль SLA менеджерів.",
            "Automated lead creation, omnichannel message ingestion, pipeline progression, PDF quotation generation, and SLA response time enforcement."
          )}</p>
        </div>

        <div class="card">
          <div class="card-icon">💬</div>
          <h4 class="card-title">{t("Мессенджеры Telegram & WhatsApp", "Месенджери Telegram та WhatsApp", "Telegram & WhatsApp Gateways")}</h4>
          <p class="card-text">{t(
            "Прямая поддержка клиентов и дилеров: боты принимают размеры салонов авто, отправляют фото образцов ячеек Ромб/Соты и принимают оплату по QR-кодам.",
            "Пряма підтримка клієнтів та дилерів: боти приймають розміри салонів авто, надсилають фото зразків комірок Ромб/Стільники та приймають оплату за QR-кодом.",
            "Direct dealer and customer support: accepts vehicle dimensions, shares high-res swatch photos of diamond/cell textures, and processes QR payments."
          )}</p>
        </div>

        <div class="card">
          <div class="card-icon">🏭</div>
          <h4 class="card-title">{t("Промышленный контур ЧПУ & CAM", "Промисловий контур ЧПК та CAM", "Industrial CNC & CAM Machine Bus")}</h4>
          <p class="card-text">{t(
            "Генерация DXF/G-кода для цифровых раскройных комплексов (плоттеров). Оптимизация схемы раскладки (раскроя) листа минимизирует краевые отходы.",
            "Генерація DXF/G-коду для цифрових розкрійних комплексів (плотерів). Оптимізація схеми розкладки листа мінімізує відходи сировини.",
            "Automated DXF/G-code vector generation for digital flatbed CNC cutting systems. Optimal nesting geometry minimizes edge trim waste."
          )}</p>
        </div>
      </div>
    '''
    sub3 = sub_accordion(
        "sub-8-3", "🔌",
        "Архитектура универсальной интеграции в IT-ландшафт предприятия",
        "Архітектура універсальної інтеграції в IT-ландшафт підприємства",
        "Universal Enterprise Integration Architecture (ERP, CRM, CNC, Meshes)",
        "21 MCP Коннектор", "21 MCP Конектор", "21 MCP Adapters",
        sub3_content
    )

    # 8.4 Interactive ROI Calculator
    sub4_content = f'''
      <div class="roi-calc-box" id="roi-calculator">
        <div class="roi-calc-header">
          <div>
            <h3 style="color:#fff; margin: 0 0 4px 0;">
              {t("Интерактивный калькулятор окупаемости внедрения EvaBot",
                 "Інтерактивний калькулятор окупності впровадження EvaBot",
                 "Interactive EvaBot Investment & ROI Payback Calculator")}
            </h3>
            <p style="color: var(--fg-muted); margin: 0; font-size: 0.92rem;">
              {t("Передвигайте ползунки под реальные параметры вашей компании:",
                 "Пересувайте повзунки під реальні параметри вашої компанії:",
                 "Adjust sliders to reflect your organization's real parameters:")}
            </p>
          </div>
          <div class="roi-badge">⚡ Real-time OpEx Engine</div>
        </div>

        <div class="roi-layout">
          <div class="roi-sliders">
            <div class="roi-field">
              <div class="roi-field-header">
                <span>{t("Сотрудников в отделе (продажи, саппорт, сметчики):", "Співробітників у відділі (продажі, саппорт, кошторис):", "Department Staff (Sales, Support, Estimators):")}</span>
                <span class="roi-field-val" id="val-staff">5 человек</span>
              </div>
              <input type="range" id="slider-staff" class="roi-slider" min="1" max="50" value="5" oninput="updateRoiCalc()">
            </div>

            <div class="roi-field">
              <div class="roi-field-header">
                <span>{t("Обращений и заказов в месяц:", "Звернень та замовлень на місяць:", "Monthly Inquiries & Orders:")}</span>
                <span class="roi-field-val" id="val-tickets">3 500 заявок</span>
              </div>
              <input type="range" id="slider-tickets" class="roi-slider" min="200" max="30000" step="100" value="3500" oninput="updateRoiCalc()">
            </div>

            <div class="roi-field">
              <div class="roi-field-header">
                <span>{t("Средняя стоимость часа специалиста:", "Середня вартість години фахівця:", "Average Hourly Wage of Specialist:")}</span>
                <span class="roi-field-val" id="val-wage">$15 / час</span>
              </div>
              <input type="range" id="slider-wage" class="roi-slider" min="5" max="60" step="1" value="15" oninput="updateRoiCalc()">
            </div>
          </div>

          <div class="roi-results">
            <div class="roi-result-card">
              <span class="roi-result-label">{t("Чистая экономия бюджета в месяц:", "Чиста економія бюджету на місяць:", "Net Monthly Cost Savings:")}</span>
              <span class="roi-result-val green" id="res-savings">$7,625</span>
              <span style="font-size: 0.74rem; color: var(--fg-subtle);">{t("С учетом снижения OpEx на 80%+", "З урахуванням зниження OpEx на 80%+", "Reflects an 80%+ OpEx reduction")}</span>
            </div>

            <div class="roi-result-card">
              <span class="roi-result-label">{t("Высвобождено рабочих часов:", "Вивільнено робочих годин:", "Work Hours Liberated:")}</span>
              <span class="roi-result-val cyan" id="res-hours">525 ч/мес</span>
              <span style="font-size: 0.74rem; color: var(--fg-subtle);">{t("Направлено на развитие и сделки", "Спрямовано на розвиток та угоди", "Reinvested into growth & closures")}</span>
            </div>

            <div class="roi-result-card">
              <span class="roi-result-label">{t("Прогнозируемый ROI платформы:", "Прогнозований ROI платформи:", "Projected Platform ROI:")}</span>
              <span class="roi-result-val amber" id="res-roi">420%</span>
              <span style="font-size: 0.74rem; color: var(--fg-subtle);">{t("Возврат инвестиций в первый же месяц", "Повернення інвестицій у перший же місяць", "Capital return within the first 30 days")}</span>
            </div>

            <div class="roi-result-card">
              <span class="roi-result-label">{t("Срок полной окупаемости:", "Термін повної окупності:", "Full Payback Horizon:")}</span>
              <span class="roi-result-val" id="res-payback" style="color: #a78bfa;">18 дней</span>
              <span style="font-size: 0.74rem; color: var(--fg-subtle);">{t("За счет гибридных бесплатных квот", "Завдяки гібридним безкоштовним квотам", "Enabled by zero-cost hybrid quotas")}</span>
            </div>
          </div>
        </div>
      </div>
    '''
    sub4 = sub_accordion(
        "sub-8-4", "💰",
        "Интерактивный калькулятор экономической окупаемости внедрения (ROI)",
        "Інтерактивний калькулятор економічної окупності впровадження (ROI)",
        "Interactive ROI & Financial Payback Calculator",
        "Экономия OpEx", "Економія OpEx", "OpEx Savings",
        sub4_content
    )

    # 8.5 Transformation Metrics
    sub5_content = f'''
      <div class="compare-grid">
        <div class="compare-card">
          <div class="compare-metric-title">
            <span>{t("Скорость первого ответа", "Швидкість першої відповіді", "First Response Speed")}</span>
            <span class="compare-delta">-99.9%</span>
          </div>
          <div class="compare-row before">
            <span>{t("До (Человек):", "До (Людина):", "Before (Human):")}</span>
            <span>{t("45 минут", "45 хвилин", "45 minutes")}</span>
          </div>
          <div class="compare-row after">
            <span>{t("С EvaBot (Автономно):", "З EvaBot (Автономно):", "With EvaBot (Autonomous):")}</span>
            <span>{t("1.2 секунды", "1.2 секунди", "1.2 seconds")}</span>
          </div>
          <div class="compare-bar-wrap">
            <div class="compare-bar-fill" style="width: 98%;"></div>
          </div>
        </div>

        <div class="compare-card">
          <div class="compare-metric-title">
            <span>{t("Себестоимость заявки", "Собівартість заявки", "Cost per Inbound Ticket")}</span>
            <span class="compare-delta">-99.5%</span>
          </div>
          <div class="compare-row before">
            <span>{t("До (Оператор):", "До (Оператор):", "Before (Operator):")}</span>
            <span>$4.50 / {t("заявка", "заявка", "ticket")}</span>
          </div>
          <div class="compare-row after">
            <span>{t("С EvaBot (Гибрид):", "З EvaBot (Гібрид):", "With EvaBot (Hybrid):")}</span>
            <span>$0.02 / {t("заявка", "заявка", "ticket")}</span>
          </div>
          <div class="compare-bar-wrap">
            <div class="compare-bar-fill" style="width: 96%;"></div>
          </div>
        </div>

        <div class="compare-card">
          <div class="compare-metric-title">
            <span>{t("Брак в сметах и раскрое", "Брак у кошторисах і розкрої", "Nesting & Quoting Scrap")}</span>
            <span class="compare-delta">-99.8%</span>
          </div>
          <div class="compare-row before">
            <span>{t("До (Ручной счет):", "До (Ручний рахунок):", "Before (Manual):")}</span>
            <span>8.4% {t("ошибок", "помилок", "errors")}</span>
          </div>
          <div class="compare-row after">
            <span>{t("С EvaBot (ЧПУ/CAM):", "З EvaBot (ЧПК/CAM):", "With EvaBot (CNC/CAM):")}</span>
            <span>&lt; 0.01% {t("брака", "браку", "scrap")}</span>
          </div>
          <div class="compare-bar-wrap">
            <div class="compare-bar-fill" style="width: 99%;"></div>
          </div>
        </div>

        <div class="compare-card">
          <div class="compare-metric-title">
            <span>{t("Режим доступности", "Режим доступності", "Operating Availability")}</span>
            <span class="compare-delta">+320%</span>
          </div>
          <div class="compare-row before">
            <span>{t("До внедрения:", "До впровадження:", "Before:")}</span>
            <span>40 {t("ч / неделю", "год / тиждень", "hrs / week")}</span>
          </div>
          <div class="compare-row after">
            <span>{t("С EvaBot:", "З EvaBot:", "With EvaBot:")}</span>
            <span>168 {t("ч / нед (24/7)", "год / тижд (24/7)", "hrs / wk (24/7)")}</span>
          </div>
          <div class="compare-bar-wrap">
            <div class="compare-bar-fill" style="width: 100%;"></div>
          </div>
        </div>

        <div class="compare-card">
          <div class="compare-metric-title">
            <span>{t("Проверка экспортного ВЭД", "Перевірка експортного ЗЕД", "Export Trade Verification")}</span>
            <span class="compare-delta">-99.8%</span>
          </div>
          <div class="compare-row before">
            <span>{t("До (Юристы):", "До (Юристи):", "Before (Lawyers):")}</span>
            <span>3 {t("рабочих дня", "робочі дні", "business days")}</span>
          </div>
          <div class="compare-row after">
            <span>{t("С EvaBot (Legal):", "З EvaBot (Legal):", "With EvaBot (Legal):")}</span>
            <span>40 {t("секунд", "секунд", "seconds")}</span>
          </div>
          <div class="compare-bar-wrap">
            <div class="compare-bar-fill" style="width: 97%;"></div>
          </div>
        </div>

        <div class="compare-card">
          <div class="compare-metric-title">
            <span>{t("Мультиязычный охват", "Багатомовне охоплення", "Multilingual Support")}</span>
            <span class="compare-delta">6 {t("Языков", "Мов", "Languages")}</span>
          </div>
          <div class="compare-row before">
            <span>{t("До внедрения:", "До впровадження:", "Before:")}</span>
            <span>1–2 {t("языка со словарем", "мови зі словником", "languages with dictionary")}</span>
          </div>
          <div class="compare-row after">
            <span>{t("С EvaBot:", "З EvaBot:", "With EvaBot:")}</span>
            <span>UK, EN, DE, PL, RO, RU</span>
          </div>
          <div class="compare-bar-wrap">
            <div class="compare-bar-fill" style="width: 100%;"></div>
          </div>
        </div>
      </div>
    '''
    sub5 = sub_accordion(
        "sub-8-5", "📈",
        "Измеримые метрики бизнес-трансформации: «До» и «После» внедрения",
        "Вимірювані метрики бізнес-трансформації: «До» та «Після» впровадження",
        "Measurable Transformation Metrics: Before vs. After Implementation",
        "99.4% точность", "99.4% точність", "99.4% Precision",
        sub5_content
    )

    # 8.6 5-Phase Onboarding Protocol
    sub6_content = f'''
      <p style="color: var(--fg-muted); margin-bottom: 20px;">
        {t("Внедрение EvaBot не требует остановки производства или переписывания софта. Процесс разбит на 5 четких фаз (2–4 недели):",
           "Впровадження EvaBot не потребує зупинки виробництва або переписування софту. Процес розбитий на 5 чітких фаз (2–4 тижні):",
           "Deploying EvaBot requires zero production downtime or disruptive software rewrites. It executes across 5 phased stages (2–4 weeks):")}
      </p>

      <div class="phase-timeline">
        <div class="phase-card">
          <div class="phase-badge-col">
            <div class="phase-circle">1</div>
            <span class="phase-days">{t("Дни 1–3", "Дні 1–3", "Days 1–3")}</span>
          </div>
          <div class="phase-body">
            <h4>{t("Фаза 1: Семантический аудит и оцифровка корпоративной памяти",
                    "Фаза 1: Семантичний аудит та оцифрування корпоративної пам'яті",
                    "Phase 1: Semantic Audit & Knowledge Digitalization")}</h4>
            <p>{t(
              "Сбор и векторизация прайс-листов, регламентов ГОСТ/ISO/ТУ, коммерческих условий и архивов переписки в векторную базу ChromaDB и индекс SQLite FTS5.",
              "Збір та векторизація прайс-листів, регламентів ДСТУ/ISO/ТУ, комерційних умов та архівів листування у векторну базу ChromaDB та індекс SQLite FTS5.",
              "Ingestion and vectorization of pricing sheets, ISO/TU standards, sales playbooks, and correspondence logs into ChromaDB and SQLite FTS5."
            )}</p>
            <div class="phase-deliverables">
              <span class="phase-pill">RAG-индекс</span>
              <span class="phase-pill">PII Security</span>
              <span class="phase-pill">Entity Graph</span>
            </div>
          </div>
        </div>

        <div class="phase-card">
          <div class="phase-badge-col">
            <div class="phase-circle">2</div>
            <span class="phase-days">{t("Дни 4–7", "Дні 4–7", "Days 4–7")}</span>
          </div>
          <div class="phase-body">
            <h4>{t("Фаза 2: Подключение операционных инструментов через 21 MCP-сервер",
                    "Фаза 2: Підключення операційних інструментів через 21 MCP-сервер",
                    "Phase 2: Connecting Operational Tools via 21 MCP Servers")}</h4>
            <p>{t(
              "Безопасное развертывание MCP-коннекторов к 1С:Предприятие, CRM Битрикс24/amoCRM, базам PostgreSQL/MySQL и защищенным мессенджерам.",
              "Безпечне розгортання MCP-конекторів до 1С:Підприємство, CRM Бітрікс24/amoCRM, баз PostgreSQL/MySQL та захищених месенджерів.",
              "Sandboxed deployment of MCP adapters to 1C:Enterprise, Bitrix24/amoCRM, SQL databases, and secure omnichannel messaging gateways."
            )}</p>
            <div class="phase-deliverables">
              <span class="phase-pill">21 MCP Sandbox</span>
              <span class="phase-pill">1C/CRM API</span>
              <span class="phase-pill">Omnichannel Webhooks</span>
            </div>
          </div>
        </div>

        <div class="phase-card">
          <div class="phase-badge-col">
            <div class="phase-circle">3</div>
            <span class="phase-days">{t("Дни 8–14", "Дні 8–14", "Days 8–14")}</span>
          </div>
          <div class="phase-body">
            <h4>{t("Фаза 3: Развертывание ролевых агентов и калибровка Консилиума",
                    "Фаза 3: Розгортання рольових агентів та калібрування Консиліуму",
                    "Phase 3: Deploying Agent Fleet & Consilium Calibration")}</h4>
            <p>{t(
              "Настройка системных промптов Адама (инженерия/смета/CISO) и Евы (клиентский сервис/продажи). Подбор оптимального пула из 94 LLM под целевой бюджет.",
              "Налаштування системних промптів Адама (інженерія/кошторис/CISO) та Єви (клієнтський сервіс/продажі). Підбір оптимального пулу з 94 LLM під бюджет.",
              "Fine-tuning prompt boundaries for Adam (CISO/engineering/quoting) and Eva (CXO/sales). Calibration of the 94-LLM router to target budgets."
            )}</p>
            <div class="phase-deliverables">
              <span class="phase-pill">Adam & Eva Personas</span>
              <span class="phase-pill">Consilium Consensus</span>
              <span class="phase-pill">Token Optimization</span>
            </div>
          </div>
        </div>

        <div class="phase-card">
          <div class="phase-badge-col">
            <div class="phase-circle">4</div>
            <span class="phase-days">{t("Дни 15–21", "Дні 15–21", "Days 15–21")}</span>
          </div>
          <div class="phase-body">
            <h4>{t("Фаза 4: Пилотный режим Shadow Mode (Параллельная работа без риска)",
                    "Фаза 4: Пілотний режим Shadow Mode (Паралельна робота без ризику)",
                    "Phase 4: Zero-Risk Pilot in Shadow Mode")}</h4>
            <p>{t(
              "Агенты обрабатывают реальные заявки параллельно с живыми сотрудниками: генерируют черновики смет и накладных для проверки в 1 клик.",
              "Агенти обробляють реальні заявки паралельно з живими працівниками: генерують чернетки кошторисів та накладних для перевірки в 1 клік.",
              "Agents shadow human operators on live inquiries: generating draft quotes and cutting nests verified with single-click human confirmation."
            )}</p>
            <div class="phase-deliverables">
              <span class="phase-pill">Zero-Risk Shadowing</span>
              <span class="phase-pill">Precision Analytics</span>
              <span class="phase-pill">Staff AI Training</span>
            </div>
          </div>
        </div>

        <div class="phase-card">
          <div class="phase-badge-col">
            <div class="phase-circle">5</div>
            <span class="phase-days">{t("День 22+", "День 22+", "Day 22+")}</span>
          </div>
          <div class="phase-body">
            <h4>{t("Фаза 5: Полномасштабный автономный продакшн и финансовый учет",
                    "Фаза 5: Повномасштабний автономний продакшн та фінансовий облік",
                    "Phase 5: Full-Scale Autonomous Production & OpEx Monitoring")}</h4>
            <p>{t(
              "Перевод 85%+ рутины на автономное исполнение 24/7/365. Подключение дашборда evaline.network и посекундного учета затрат AccountingEngine.",
              "Переведення 85%+ рутини на автономне виконання 24/7/365. Підключення дашборда evaline.network та обліку витрат AccountingEngine.",
              "Full handover of 85%+ routine operations to autonomous 24/7 execution with real-time telemetry on evaline.network and sub-second token accounting."
            )}</p>
            <div class="phase-deliverables">
              <span class="phase-pill">24/7 Autonomy</span>
              <span class="phase-pill">evaline.network</span>
              <span class="phase-pill">AccountingEngine</span>
            </div>
          </div>
        </div>
      </div>
    '''
    sub6 = sub_accordion(
        "sub-8-6", "📋",
        "5-фазный регламентированный протокол интеграции на предприятие (от 2 до 4 недель)",
        "5-фазний регламентований протокол інтеграції на підприємство (від 2 до 4 тижнів)",
        "5-Phase Enterprise Onboarding & Integration Protocol (2 to 4 Weeks)",
        "Методология внедрения", "Методологія впровадження", "Onboarding Roadmap",
        sub6_content
    )

    # 8.7 Sephirot 10-Tier Decision Tree
    sephirot_items = [
        ("01", "👑", "Кетер (Kether) — Высший замысел", "Кетер (Kether) — Вищий задум", "Kether (Crown) — Sovereign Vision",
         "Высший замысел собственника, стратегические цели компании и корпоративные аксиомы.",
         "Вищий задум власника, стратегічні цілі компанії та корпоративні аксіоми.",
         "The founder's sovereign vision, macro corporate objectives, and immutable principles.",
         "Gemini 3.1 Pro (2M Context)"),
        ("02", "💡", "Хокма (Chokmah) — Стратегия", "Хокма (Chokmah) — Стратегія", "Chokmah (Wisdom) — Strategy",
         "Трансформация видения в 2–3 смелые стратегические гипотезы с оценкой рисков.",
         "Трансформація задуму в 2–3 сміливі стратегічні гіпотези з оцінкою ризиків.",
         "Synthesizing visionary intent into actionable hypotheses with risk/reward models.",
         "Gemini 3.8 Flash • Speed"),
        ("03", "📐", "Бина (Binah) — Архитектура", "Бина (Binah) — Архітектура", "Binah (Understanding) — Architecture",
         "Строгая декомпозиция, формальные спецификации, схемы БД и технологические ограничения.",
         "Сувора декомпозиція, формальні специфікації, схеми БД та технологічні обмеження.",
         "Formal architectural decomposition, relational DB schemas, and technical bounds.",
         "Claude 3.7 Sonnet • Refactoring"),
        ("04", "🤝", "Хесед (Chesed) — Экспансия", "Хесед (Chesed) — Експансія", "Chesed (Mercy) — Expansion",
         "Продажи, мультиязычный маркетинг, забота о клиентах и партнерские программы B2B.",
         "Продажі, багатомовний маркетинг, турбота про клієнтів та партнерські програми B2B.",
         "Omnichannel sales, multilingual marketing, customer success, and partner relations.",
         "Agent Eva • 6 Languages"),
        ("05", "🛡️", "Гевура (Gevurah) — CISO & Аудит", "Гевура (Gevurah) — CISO та Аудит", "Gevurah (Severity) — CISO & Audit",
         "Бескомпромиссный контроль безопасности, лимитов смет, комплаенса UNIC/ISO.",
         "Безкомпромісний контроль безпеки, лімітів кошторису, комплаєнсу UNIC/ISO.",
         "Zero-trust security enforcement, budget guardrails, UNIC compliance, and PII shields.",
         "Agent Adam • CISO & Rules"),
        ("06", "⚖️", "Тиферет (Tifereth) — Синтез", "Тиферет (Tifereth) — Синтез", "Tifereth (Beauty) — Consensus",
         "Гармонизация компромиссов: сведение аргументов Хесед (продажи) и Гевура (CISO) в консенсус.",
         "Гармонізація компромісів: зведення аргументів Хесед (продажі) та Гевура (CISO) в консенсус.",
         "Harmonizing trade-offs: balancing aggressive growth (Chesed) with security (Gevurah).",
         "Consilium Arbiter Engine"),
        ("07", "⚡", "Нецах (Netzach) — DevOps & CI/CD", "Нецах (Netzach) — DevOps та CI/CD", "Netzach (Victory) — DevOps & SRE",
         "Непрерывная интеграция, мониторинг контейнеров, деплой без простоев.",
         "Безперервна інтеграція, моніторинг контейнерів, деплой без простоїв.",
         "Continuous integration, container orchestration, zero-downtime rolling deploys.",
         "SRE Daemon • Mesh Watchdog"),
        ("08", "🎙️", "Ход (Hod) — Коммуникация", "Ход (Hod) — Комунікація", "Hod (Splendor) — Speech & UI",
         "Голосовой движок EvaVoice, интерактивные веб-интерфейсы, документация API.",
         "Голосовий рушій EvaVoice, інтерактивні веб-інтерфейси, документація API.",
         "EvaVoice speech synthesis, responsive cybernetic interfaces, and API docs.",
         "EvaVoice FastAPI :8000"),
        ("09", "💾", "Йесод (Yesod) — Память & RAG", "Йесод (Yesod) — Пам'ять та RAG", "Yesod (Foundation) — Grounded Memory",
         "Векторный фундамент ChromaDB, таблицы SQLite, сессионная память и архив знаний.",
         "Векторний фундамент ChromaDB, таблиці SQLite, сесійна пам'ять та архів знань.",
         "High-density ChromaDB vector collections, SQLite FTS5 index, and episodic graphs.",
         "ChromaDB + SQLite FTS5"),
        ("10", "🏭", "Малхут (Malkuth) — Завод & Материя", "Малхут (Malkuth) — Завод та Матерія", "Malkuth (Kingdom) — Physical World",
         "Реальное воплощение: раскрой на ЧПУ, пресс-формы в Черноморске, хаб в Братиславе.",
         "Реальне втілення: розкрій на ЧПК, прес-форми в Чорноморську, хаб у Братиславі.",
         "Physical materialization: CNC flatbed cutting, foaming presses, and EU deliveries.",
         "EvaLine Chornomorsk Plant")
    ]

    sephirot_cards = []
    for num, icon, title_ru, title_uk, title_en, desc_ru, desc_uk, desc_en, model in sephirot_items:
        c = f'''        <div class="sephira-card">
          <div class="sephira-tag">
            <span class="sephira-level">{t(f"Ступень {num}", f"Ступінь {num}", f"Tier {num}")}</span>
            <span>{icon}</span>
          </div>
          <div class="sephira-title">{t(title_ru, title_uk, title_en)}</div>
          <div class="sephira-desc">{t(desc_ru, desc_uk, desc_en)}</div>
          <div class="sephira-model">{model}</div>
        </div>'''
        sephirot_cards.append(c)

    sephirot_html = "\n".join(sephirot_cards)

    sub7_content = f'''
      <div class="sephirot-box">
        <div class="sephirot-header">
          <div class="hero-eyebrow">{t("АРХИТЕКТУРА SEPHIROT ENGINE // 10 УРОВНЕЙ ИНТЕЛЛЕКТА", "АРХІТЕКТУРА SEPHIROT ENGINE // 10 РІВНІВ ІНТЕЛЕКТУ", "SEPHIROT ENGINE ARCHITECTURE // 10 TIERS OF INTELLIGENCE")}</div>
          <h4 style="font-family: var(--font-display); font-size: 1.3rem; color: #fff; margin: 4px 0 8px;">
            {t("10 ступеней принятия решений: От высшего замысла до станка ЧПУ",
               "10 ступенів прийняття рішень: Від вищого задуму до верстата ЧПК",
               "10 Spheres of Corporate Intelligence: From Sovereign Vision to CNC Fabric")}
          </h4>
          <p style="max-width: 800px; margin: 0 auto; color: var(--fg-muted);">
            {t("В ядре EvaBot реализована классическая 10-уровневая структура каскадного делегирования решений:",
               "У ядрі EvaBot реалізована класична 10-рівнева структура каскадного делегування рішень:",
               "At the core of EvaBot lies a formal 10-tier cascading delegation hierarchy:")}
          </p>
        </div>

        <div class="sephirot-grid">
{sephirot_html}
        </div>
      </div>
    '''
    sub7 = sub_accordion(
        "sub-8-7", "✡️",
        "Анатомия системы: Древо корпоративного интеллекта Sephirot (10 ступеней)",
        "Анатомія системи: Древо корпоративного інтелекту Sephirot (10 ступенів)",
        "EvaBot System Anatomy: The 10-Tier Sephirot Decision Tree",
        "10 ступеней разума", "10 ступенів розуму", "10 Decision Tiers",
        sub7_content
    )

    lead = t(
        "<strong>EvaLine</strong> объединяет тяжелую физическую индустрию полимеров EVA и передовую распределенную фабрику автономных агентов:",
        "<strong>EvaLine</strong> об'єднує важку фізичну індустрію полімерів EVA та передову розподілену фабрику автономних агентів:",
        "<strong>EvaLine</strong> uniquely fuses physical industrial polymer manufacturing with an autonomous distributed agent factory:"
    )

    content = f'''      <p class="lead-text">{lead}</p>
      {sub1}
      {sub2}
      {sub3}
      {sub4}
      {sub5}
      {sub6}
      {sub7}'''

    return accordion_section(
        "business-solutions", "08",
        "Решение задач бизнеса, интеграция производства и анатомия EvaBot",
        "Рішення для бізнесу, інтеграція виробництва та анатомія EvaBot",
        "Business Solutions, Manufacturing Integration & EvaBot Anatomy",
        "Практическое внедрение", "Практичне впровадження", "Production Reality",
        content, open=True
    )
