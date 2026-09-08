# -*- coding: utf-8 -*-
from helpers import t

def get_nav_and_hero():
    return f'''
<header class="top-nav">
  <a href="https://evaline.online" class="brand-title">
    <span class="logo-gem">◆</span> EVALINE // EVANETWORK
  </a>

  <div class="top-controls">
    <div class="cluster-status-pill" id="cluster-status-indicator">
      <span class="pulse-dot"></span>
      {t("Кластер Активен: Франкфурт (8 vCPU) ⟷ Айова (Edge HTTP/3)",
         "Кластер Активний: Франкфурт (8 vCPU) ⟷ Айова (Edge HTTP/3)",
         "Cluster Online: Frankfurt (8 vCPU) ⟷ Iowa (Edge HTTP/3)")}
    </div>

    <!-- Accordion Global Controls -->
    <div class="accordion-controls">
      <button class="btn-accordion-toggle" onclick="toggleAllAccordions(true)" title="Expand all sections">
        <span>▾</span>
        {t("Развернуть всё", "Розгорнути все", "Expand All")}
      </button>
      <button class="btn-accordion-toggle" onclick="toggleAllAccordions(false)" title="Collapse all sections">
        <span>▸</span>
        {t("Свернуть всё", "Згорнути все", "Collapse All")}
      </button>
    </div>

    <!-- Instant Language Switcher -->
    <div class="lang-switcher" role="group" aria-label="Language Selector">
      <button class="lang-btn active" data-lang="ru" onclick="setLanguage('ru')">RU</button>
      <button class="lang-btn" data-lang="uk" onclick="setLanguage('uk')">UK</button>
      <button class="lang-btn" data-lang="en" onclick="setLanguage('en')">EN</button>
    </div>
  </div>
</header>

<div class="container">

  <!-- HERO SECTION -->
  <section class="hero">
    <div class="hero-eyebrow">
      {t("СУВЕРЕННАЯ АГЕНТСКАЯ ФАБРИКА & РЕАЛЬНОЕ ПРОИЗВОДСТВО ПОЛИМЕРОВ",
         "СУВЕРЕННА АГЕНТСЬКА ФАБРИКА ТА РЕАЛЬНЕ ВИРОБНИЦТВО ПОЛІМЕРІВ",
         "SOVEREIGN AGENT FACTORY & PHYSICAL POLYMER MANUFACTURING")}
    </div>
    <h1 class="hero-title">
      {t("МАНИФЕСТ EVALINE // АВТОНОМНЫЙ ШТАТ ИИ-АГЕНТОВ, СИСТЕМА «КОНСИЛИУМ» И МАТЕРИАЛЬНЫЙ СУВЕРЕНИТЕТ",
         "МАНІФЕСТ EVALINE // АВТОНОМНИЙ ШТАТ ШІ-АГЕНТІВ, СИСТЕМА «КОНСИЛІУМ» ТА МАТЕРІАЛЬНИЙ СУВЕРЕНІТЕТ",
         "EVALINE MANIFESTO // AUTONOMOUS AI AGENT FLEET, CONCILIUM CONSENSUS & PHYSICAL SOVEREIGNTY")}
    </h1>
    <p class="hero-desc">
      {t("Инженерно-производственный манифест первого суверенного альянса физической индустрии полимеров EVA и распределенной фабрики автономных цифровых сотрудников. Мы ликвидируем монополию одиночных чат-ботов, галлюцинации и человеческую рутину через состязательный дебат 94 языковых моделей и прямое роботизированное управление станками ЧПУ.",
         "Інженерно-виробничий маніфест першого суверенного альянсу фізичної індустрії полімерів EVA та розподіленої фабрики автономних цифрових співробітників. Ми ліквідуємо монополію одиночних чат-ботів, галюцинації та людську рутину через змагальний дебат 94 мовних моделей та пряме роботизоване керування верстатами ЧПК.",
         "Engineering and manufacturing manifesto of the first sovereign alliance uniting physical EVA polymer production with an autonomous digital employee factory. We eliminate single-chatbot monopolies, hallucinations, and routine human fatigue through adversarial consensus across 94 LLMs and direct CNC robotic execution.")}
    </p>

    <!-- Quick Jump Tags -->
    <div class="hero-links" style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 24px;">
      <a href="#models-matrix" class="btn-ctrl" style="text-decoration: none; padding: 8px 16px;">
        📊 {t("Матрица 94 LLM-моделей", "Матриця 94 LLM-моделей", "94-Model LLM Matrix")}
      </a>
      <a href="#business-solutions" class="btn-ctrl" style="text-decoration: none; padding: 8px 16px;">
        🏭 {t("Решения для бизнеса & Завод", "Рішення для бізнесу та Завод", "Business Solutions & Plant")}
      </a>
      <a href="#roi-calculator" class="btn-ctrl" style="text-decoration: none; padding: 8px 16px;">
        💰 {t("Калькулятор окупаемости ROI", "Калькулятор окупності ROI", "Interactive ROI Calculator")}
      </a>
      <a href="#glossary" class="btn-ctrl" style="text-decoration: none; padding: 8px 16px;">
        📖 {t("Глоссарий 20 терминов", "Глосарій 20 термінів", "20-Term Plain Glossary")}
      </a>
    </div>
  </section>
'''
