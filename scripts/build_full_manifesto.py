#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generates the comprehensive, fluid, Roboto-powered EvaLine Manifesto
with deep Consilium explanations for general business and EvaLine physical production.
"""

import json
import re

# Load catalog
with open('/home/evabot/models_catalog.json', 'r', encoding='utf-8') as f:
    models = json.load(f)

def get_role_hint(m):
    name = m['name'].lower()
    prov = m['provider'].lower()
    q = m['quality']
    
    if '3.1 pro' in name or '2.5 pro' in name:
        return 'Главный системный архитектор и логический арбитр (Контекст 2M)'
    elif '3.8 flash' in name or '3.1 flash' in name:
        return 'Сверхбыстрый мультиагентный исполнитель и автономный роутер'
    elif 'claude 3.7' in name or 'claude 3.5 sonnet' in name:
        return 'Глубокий инженерный кодинг, архитектурный ревью и рефакторинг'
    elif 'claude 3.5 haiku' in name:
        return 'Быстрый синтаксический анализ, валидация JSON и микроагенты'
    elif 'r1' in name:
        return 'Пошаговые математические рассуждения и состязательный аудит логики'
    elif 'o1' in name or 'o3' in name:
        return 'Формальная верификация алгоритмов и доказательства безопасности'
    elif 'llama 3.1 405b' in name or 'llama 3.3' in name:
        return 'Суверенная независимая экспертиза открытых весов'
    elif 'mistral' in name:
        return 'Европейский суверенный аудит и мультиязычный анализ'
    elif 'gemma' in name:
        return 'Локальные легковесные задачи и вспомогательные микросервисы'
    elif q >= 90:
        return 'Сложные аналитические рассуждения и верификация гипотез'
    elif q >= 80:
        return 'Инженерная разработка, системная интеграция и тесты'
    else:
        return 'Высокоскоростная фоновая обработка и потоковый парсинг'

def parse_price(m):
    p_str = m.get('priceIn', '')
    match = re.search(r'\$([0-9.]+)', p_str)
    if match:
        return float(match.group(1))
    return 0.0

for m in models:
    m['roleHint'] = get_role_hint(m)
    m['numPrice'] = parse_price(m)

models_json_str = json.dumps(models, ensure_ascii=False)

def format_tokens(t):
    if t >= 2000000:
        return '2M токенов (~1.5M слов)'
    if t >= 1000000:
        return '1M токенов (~750k слов)'
    if t >= 500000:
        return '512k токенов'
    if t >= 200000:
        return '200k токенов'
    if t >= 128000:
        return '128k токенов'
    if t >= 64000:
        return '64k токенов'
    if t >= 32000:
        return '32k токенов'
    return f"{t} токенов" if t else "Стандарт"

def get_provider_class(p):
    s = (p or '').lower()
    if 'google' in s: return 'provider-google'
    if 'anthropic' in s: return 'provider-anthropic'
    if 'deepseek' in s: return 'provider-deepseek'
    if 'openai' in s: return 'provider-openai'
    if 'meta' in s: return 'provider-meta'
    if 'mistral' in s: return 'provider-mistral'
    if 'omniroute' in s: return 'provider-omniroute'
    return 'provider-default'

def get_recency_badge(r):
    if r >= 95: return '✨ 2026 Fleet'
    if r >= 80: return '2025 Frontier'
    return 'Standard Fleet'

# Pre-render initial free models
initial_free = [m for m in models if m['isFree']]
initial_free.sort(key=lambda m: (m['quality'], m['recency']), reverse=True)

prerendered_cards = []
for m in initial_free:
    p_class = get_provider_class(m['provider'])
    iq_badge = f'<span class="metric-pill iq">🧠 IQ: <strong>{m["quality"]}</strong>/100</span>'
    tier_badge = '<span class="metric-pill tier-free">🟢 Free Quota $0.00</span>'
    rec_badge = f'<span class="metric-pill">{get_recency_badge(m["recency"])}</span>'
    ctx_badge = f'<span class="metric-pill">📚 {format_tokens(m["context"])}</span>'
    free_details = m.get("freeDetails") or "Google AI Studio 15 RPM / 1M TPM / 1500 RPD"
    
    price_html = f'''<div class="model-pricing-box">
             <div><span class="price-tag free">100% Free Quota</span> • Себестоимость: $0.00</div>
             <div style="color: var(--fg-muted); font-size: 0.72rem;">{free_details}</div>
           </div>'''
           
    card = f'''        <div class="model-card">
          <div class="model-card-header">
            <div class="model-name">{m['name']}</div>
            <span class="provider-badge {p_class}">{m['provider']}</span>
          </div>
          <div class="model-metrics">
            {iq_badge}
            {tier_badge}
            {rec_badge}
            {ctx_badge}
          </div>
          <p class="model-desc">{m.get('desc', '')}</p>
          <div class="model-role">
            <strong>Роль в Консилиуме:</strong> {m['roleHint']}
          </div>
          {price_html}
        </div>'''
    prerendered_cards.append(card)

prerendered_html = "\n".join(prerendered_cards)

html_content = f"""<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Манифест EvaLine // Фабрика автономных ИИ-агентов, система «Консилиум» и суверенное производство EVA</title>
  <meta name="description" content="Технологический манифест EvaLine: фабрика автономных ИИ-агентов, коллегиальная система Консилиум, матрица из 94 LLM моделей и реальное производство полимеров EVA.">
  
  <!-- Complete Roboto Font Family: Roboto, Roboto Mono, Roboto Condensed, Roboto Slab (All weights & styles) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Roboto+Condensed:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Roboto+Mono:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&family=Roboto+Slab:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <style>
    :root {{
      --bg: #07090e;
      --bg-card: rgba(14, 18, 27, 0.82);
      --bg-card-hover: rgba(20, 26, 40, 0.96);
      --border: rgba(255, 255, 255, 0.08);
      --border-accent: rgba(0, 230, 118, 0.4);
      --border-cyan: rgba(0, 229, 255, 0.35);
      
      --fg: #e6edf3;
      --fg-muted: #8b949e;
      --fg-subtle: #57606a;
      
      --accent-green: #00e676;
      --accent-cyan: #00e5ff;
      --accent-blue: #38bdf8;
      --accent-amber: #ffd600;
      --accent-purple: #b388ff;
      
      /* Pure Roboto Typography Hierarchy */
      --font-sans: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      --font-display: 'Roboto Condensed', 'Roboto', sans-serif;
      --font-slab: 'Roboto Slab', serif;
      --font-mono: 'Roboto Mono', monospace;
    }}

    * {{ margin: 0; padding: 0; box-sizing: border-box; }}

    body {{
      background-color: var(--bg);
      color: var(--fg);
      font-family: var(--font-sans);
      font-weight: 400;
      font-size: 16px;
      line-height: 1.68;
      overflow-x: hidden;
      background-image: 
        radial-gradient(circle at 10% 10%, rgba(0, 230, 118, 0.05) 0%, transparent 40%),
        radial-gradient(circle at 90% 15%, rgba(0, 229, 255, 0.04) 0%, transparent 45%),
        radial-gradient(circle at 50% 85%, rgba(56, 189, 248, 0.03) 0%, transparent 50%);
      background-attachment: fixed;
    }}

    /* Fluid / Responsive Container */
    .container {{
      width: 100%;
      max-width: min(1540px, 94vw);
      margin: 0 auto;
      padding: clamp(24px, 4vw, 44px) clamp(16px, 3vw, 36px) 100px;
    }}

    /* Navigation */
    .nav-bar {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 22px;
      border-bottom: 1px solid var(--border);
      margin-bottom: clamp(32px, 5vw, 56px);
      flex-wrap: wrap;
      gap: 16px;
    }}

    .brand {{
      display: flex;
      align-items: center;
      gap: 12px;
      text-decoration: none;
      color: #fff;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 1.35rem;
      letter-spacing: -0.01em;
    }}

    .brand-logo {{
      width: 34px;
      height: 34px;
      background: linear-gradient(135deg, var(--accent-green), var(--accent-cyan));
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #000;
      font-family: var(--font-sans);
      font-weight: 900;
      font-size: 17px;
    }}

    .nav-links {{
      display: flex;
      gap: 20px;
      align-items: center;
      font-size: 0.94rem;
      font-family: var(--font-sans);
      font-weight: 500;
      flex-wrap: wrap;
    }}

    .nav-link {{
      color: var(--fg-muted);
      text-decoration: none;
      transition: color 0.2s;
    }}

    .nav-link:hover {{
      color: var(--accent-green);
    }}

    .cluster-badge {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      background: rgba(0, 230, 118, 0.08);
      border: 1px solid rgba(0, 230, 118, 0.28);
      border-radius: 20px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--accent-green);
    }}

    .pulse-dot {{
      width: 8px;
      height: 8px;
      background: var(--accent-green);
      border-radius: 50%;
      box-shadow: 0 0 10px var(--accent-green);
      animation: pulse 2s infinite;
    }}

    @keyframes pulse {{
      0%, 100% {{ opacity: 1; transform: scale(1); }}
      50% {{ opacity: 0.4; transform: scale(0.85); }}
    }}

    /* Hero Section */
    .hero {{
      margin-bottom: clamp(48px, 6vw, 72px);
    }}

    .hero-eyebrow {{
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: var(--font-mono);
      font-weight: 500;
      color: var(--accent-cyan);
      font-size: 0.84rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 18px;
      padding: 5px 12px;
      background: rgba(0, 229, 255, 0.08);
      border: 1px solid rgba(0, 229, 255, 0.22);
      border-radius: 4px;
    }}

    .hero-title {{
      font-family: var(--font-display);
      font-size: clamp(2.4rem, 5.5vw, 4.2rem);
      font-weight: 700;
      line-height: 1.12;
      letter-spacing: -0.02em;
      margin-bottom: 24px;
      color: #ffffff;
    }}

    .hero-title span {{
      background: linear-gradient(135deg, #ffffff 30%, var(--accent-cyan) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}

    .hero-subtitle {{
      font-family: var(--font-sans);
      font-weight: 300;
      font-size: clamp(1.15rem, 2vw, 1.35rem);
      color: #b8c4d4;
      max-width: 1040px;
      line-height: 1.65;
      margin-bottom: 36px;
    }}

    .key-facts-bar {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
      gap: 16px;
      padding: 24px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      backdrop-filter: blur(14px);
    }}

    .fact-item {{
      display: flex;
      flex-direction: column;
      gap: 4px;
    }}

    .fact-value {{
      font-family: var(--font-display);
      font-size: clamp(1.6rem, 2.5vw, 2.1rem);
      font-weight: 700;
      color: #fff;
    }}

    .fact-value.green {{ color: var(--accent-green); }}
    .fact-value.cyan {{ color: var(--accent-cyan); }}
    .fact-value.amber {{ color: var(--accent-amber); }}
    .fact-value.purple {{ color: var(--accent-purple); }}

    .fact-label {{
      font-family: var(--font-sans);
      font-weight: 400;
      font-size: 0.82rem;
      color: var(--fg-muted);
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }}

    /* Content Sections */
    .section {{
      margin-bottom: clamp(56px, 7vw, 84px);
    }}

    .section-header {{
      display: flex;
      align-items: center;
      gap: 16px;
      margin-bottom: 24px;
      flex-wrap: wrap;
    }}

    .section-num {{
      font-family: var(--font-mono);
      font-size: 0.95rem;
      font-weight: 600;
      color: var(--accent-green);
      padding: 4px 10px;
      background: rgba(0, 230, 118, 0.08);
      border: 1px solid rgba(0, 230, 118, 0.2);
      border-radius: 6px;
    }}

    .section-title {{
      font-family: var(--font-display);
      font-size: clamp(1.8rem, 3vw, 2.5rem);
      font-weight: 700;
      letter-spacing: -0.01em;
      color: #fff;
    }}

    .lead-text {{
      font-size: clamp(1.1rem, 1.8vw, 1.25rem);
      color: #d1d8e5;
      font-weight: 400;
      line-height: 1.7;
      margin-bottom: 22px;
    }}

    p {{
      margin-bottom: 18px;
      color: #9aa5b5;
      font-size: 1.02rem;
      line-height: 1.7;
    }}

    p strong {{
      color: #ffffff;
      font-weight: 600;
    }}

    /* Fluid Cards Grid */
    .cards-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
      gap: clamp(16px, 2vw, 24px);
      margin: 28px 0;
    }}

    .card {{
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: clamp(20px, 3vw, 28px);
      transition: transform 0.2s, border-color 0.2s, background 0.2s;
      backdrop-filter: blur(10px);
      display: flex;
      flex-direction: column;
    }}

    .card:hover {{
      transform: translateY(-2px);
      border-color: var(--border-accent);
      background: var(--bg-card-hover);
    }}

    .card-icon {{
      font-size: 2rem;
      margin-bottom: 16px;
    }}

    .card-title {{
      font-family: var(--font-display);
      font-size: 1.3rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 12px;
    }}

    .card-text {{
      font-size: 0.96rem;
      color: #9aa5b5;
      line-height: 1.65;
      margin-bottom: 0;
      flex-grow: 1;
    }}

    /* Workflow Diagram Container */
    .workflow-container {{
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: clamp(22px, 3vw, 36px);
      margin: 32px 0;
    }}

    .workflow-header {{
      font-family: var(--font-display);
      font-size: 1.4rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
    }}

    .workflow-sub {{
      font-size: 0.94rem;
      color: var(--fg-muted);
      margin-bottom: 24px;
    }}

    .workflow-steps {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 250px), 1fr));
      gap: 16px;
    }}

    .step-box {{
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 8px;
      padding: 22px;
    }}

    .step-num {{
      font-family: var(--font-mono);
      font-size: 0.78rem;
      font-weight: 600;
      color: var(--accent-cyan);
      letter-spacing: 0.06em;
      margin-bottom: 8px;
      text-transform: uppercase;
    }}

    .step-title {{
      font-family: var(--font-display);
      font-size: 1.15rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 8px;
    }}

    .step-desc {{
      font-size: 0.9rem;
      color: #9aa5b5;
      line-height: 1.55;
      margin-bottom: 0;
    }}

    /* Callout Box */
    .callout {{
      padding: clamp(20px, 3vw, 28px);
      background: rgba(0, 229, 255, 0.04);
      border: 1px solid rgba(0, 229, 255, 0.2);
      border-left: 4px solid var(--accent-cyan);
      border-radius: 8px;
      margin: 32px 0;
    }}

    .callout-title {{
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--accent-cyan);
      margin-bottom: 8px;
    }}

    .callout-body {{
      color: #d1d8e5;
      font-size: 1.02rem;
      line-height: 1.65;
      margin: 0;
    }}

    /* Production Specs Box */
    .production-box {{
      background: var(--bg-card);
      border: 1px solid rgba(0, 230, 118, 0.25);
      border-radius: 14px;
      padding: clamp(22px, 3vw, 36px);
      margin: 32px 0;
    }}

    .production-header {{
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }}

    .production-badge {{
      font-family: var(--font-mono);
      font-size: 0.8rem;
      padding: 4px 10px;
      background: rgba(0, 230, 118, 0.12);
      color: var(--accent-green);
      border: 1px solid rgba(0, 230, 118, 0.3);
      border-radius: 4px;
      font-weight: 600;
    }}

    /* Models Matrix Interactive UI */
    .matrix-controls {{
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: clamp(18px, 3vw, 26px);
      margin-bottom: 24px;
      display: flex;
      flex-direction: column;
      gap: 18px;
      backdrop-filter: blur(12px);
    }}

    .matrix-tabs {{
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border);
    }}

    .matrix-tab {{
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid var(--border);
      color: var(--fg-muted);
      padding: 10px 20px;
      border-radius: 8px;
      font-family: var(--font-display);
      font-size: 1.05rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }}

    .matrix-tab:hover {{
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
    }}

    .matrix-tab.active[data-filter="free"] {{
      background: rgba(0, 230, 118, 0.15);
      border-color: var(--accent-green);
      color: var(--accent-green);
      box-shadow: 0 0 16px rgba(0, 230, 118, 0.2);
    }}

    .matrix-tab.active[data-filter="paid"] {{
      background: rgba(0, 229, 255, 0.15);
      border-color: var(--accent-cyan);
      color: var(--accent-cyan);
      box-shadow: 0 0 16px rgba(0, 229, 255, 0.2);
    }}

    .matrix-tab.active[data-filter="all"] {{
      background: rgba(179, 136, 255, 0.15);
      border-color: var(--accent-purple);
      color: #fff;
      box-shadow: 0 0 16px rgba(179, 136, 255, 0.2);
    }}

    .matrix-sort-bar {{
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
    }}

    .sort-label {{
      font-family: var(--font-mono);
      font-size: 0.82rem;
      color: var(--fg-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-right: 4px;
      font-weight: 500;
    }}

    .sort-btn {{
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid var(--border);
      color: var(--fg-muted);
      padding: 7px 16px;
      border-radius: 6px;
      font-size: 0.88rem;
      font-family: var(--font-sans);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }}

    .sort-btn:hover {{
      background: rgba(255, 255, 255, 0.08);
      color: #fff;
    }}

    .sort-btn.active {{
      background: rgba(56, 189, 248, 0.15);
      border-color: var(--accent-blue);
      color: #fff;
    }}

    .matrix-search-box {{
      display: flex;
      align-items: center;
      gap: 14px;
      flex-wrap: wrap;
    }}

    .matrix-search-box input {{
      flex: 1;
      min-width: 260px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 12px 18px;
      color: #fff;
      font-family: var(--font-sans);
      font-size: 0.95rem;
      outline: none;
      transition: border-color 0.2s;
    }}

    .matrix-search-box input:focus {{
      border-color: var(--accent-cyan);
    }}

    .count-badge {{
      font-family: var(--font-mono);
      font-size: 0.84rem;
      color: var(--accent-green);
      background: rgba(0, 230, 118, 0.08);
      border: 1px solid rgba(0, 230, 118, 0.2);
      padding: 8px 14px;
      border-radius: 6px;
      white-space: nowrap;
      font-weight: 500;
    }}

    /* Responsive Models Grid */
    .models-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 330px), 1fr));
      gap: 18px;
      margin-top: 16px;
    }}

    .model-card {{
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 12px;
      padding: 22px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      transition: all 0.2s;
      position: relative;
    }}

    .model-card:hover {{
      transform: translateY(-2px);
      border-color: var(--border-accent);
      background: var(--bg-card-hover);
    }}

    .model-card.is-paid:hover {{
      border-color: var(--border-cyan);
    }}

    .model-card-header {{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 12px;
    }}

    .model-name {{
      font-family: var(--font-display);
      font-size: 1.2rem;
      font-weight: 700;
      color: #fff;
      line-height: 1.3;
    }}

    .provider-badge {{
      font-family: var(--font-mono);
      font-size: 0.74rem;
      padding: 4px 8px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
      font-weight: 600;
    }}

    .provider-google {{ background: rgba(66, 133, 244, 0.15); color: #60a5fa; border: 1px solid rgba(66, 133, 244, 0.3); }}
    .provider-anthropic {{ background: rgba(217, 119, 6, 0.15); color: #fbbf24; border: 1px solid rgba(217, 119, 6, 0.3); }}
    .provider-deepseek {{ background: rgba(14, 165, 233, 0.15); color: #38bdf8; border: 1px solid rgba(14, 165, 233, 0.3); }}
    .provider-openai {{ background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }}
    .provider-meta {{ background: rgba(168, 85, 247, 0.15); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }}
    .provider-mistral {{ background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.3); }}
    .provider-omniroute {{ background: rgba(0, 230, 118, 0.15); color: var(--accent-green); border: 1px solid rgba(0, 230, 118, 0.3); }}
    .provider-default {{ background: rgba(255, 255, 255, 0.1); color: #e6edf3; border: 1px solid var(--border); }}

    .model-metrics {{
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }}

    .metric-pill {{
      font-family: var(--font-mono);
      font-size: 0.76rem;
      padding: 3px 8px;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.07);
      color: var(--fg-muted);
    }}

    .metric-pill strong {{
      color: #fff;
    }}

    .metric-pill.iq {{
      background: rgba(0, 229, 255, 0.08);
      border-color: rgba(0, 229, 255, 0.25);
      color: var(--accent-cyan);
    }}

    .metric-pill.tier-free {{
      background: rgba(0, 230, 118, 0.08);
      border-color: rgba(0, 230, 118, 0.25);
      color: var(--accent-green);
    }}

    .metric-pill.tier-paid {{
      background: rgba(179, 136, 255, 0.08);
      border-color: rgba(179, 136, 255, 0.25);
      color: var(--accent-purple);
    }}

    .model-desc {{
      font-size: 0.9rem;
      color: #9aa5b5;
      line-height: 1.55;
      margin-bottom: 0;
      flex-grow: 1;
    }}

    .model-role {{
      font-size: 0.84rem;
      color: #cbd5e1;
      background: rgba(255, 255, 255, 0.03);
      border-left: 3px solid var(--accent-cyan);
      padding: 8px 12px;
      border-radius: 0 6px 6px 0;
    }}

    .model-pricing-box {{
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding-top: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      font-family: var(--font-mono);
      font-size: 0.78rem;
    }}

    .price-tag {{
      font-weight: 700;
      color: #fff;
    }}

    .price-tag.free {{ color: var(--accent-green); }}
    .price-tag.paid {{ color: var(--accent-cyan); }}

    /* Comparison Table */
    .table-container {{
      overflow-x: auto;
      margin: 32px 0;
      border: 1px solid var(--border);
      border-radius: 14px;
      background: var(--bg-card);
    }}

    table {{
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.94rem;
    }}

    th {{
      background: rgba(255, 255, 255, 0.03);
      color: var(--fg-muted);
      font-family: var(--font-mono);
      font-size: 0.82rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 16px 20px;
      border-bottom: 1px solid var(--border);
    }}

    td {{
      padding: 16px 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: #9aa5b5;
      vertical-align: top;
    }}

    tr:last-child td {{
      border-bottom: none;
    }}

    td strong {{
      color: #fff;
    }}

    .col-highlight {{
      color: var(--accent-green);
      font-weight: 500;
    }}

    /* Hub Links */
    .hub-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(min(100%, 260px), 1fr));
      gap: 16px;
      margin: 28px 0;
    }}

    .hub-item {{
      display: flex;
      flex-direction: column;
      padding: 22px;
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 10px;
      text-decoration: none;
      color: inherit;
      transition: all 0.2s;
    }}

    .hub-item:hover {{
      border-color: var(--accent-green);
      transform: translateY(-2px);
    }}

    .hub-item-badge {{
      font-family: var(--font-mono);
      font-size: 0.74rem;
      color: var(--accent-green);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 8px;
      font-weight: 600;
    }}

    .hub-item-domain {{
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
      margin-bottom: 6px;
    }}

    .hub-item-desc {{
      font-size: 0.88rem;
      color: var(--fg-muted);
      line-height: 1.48;
    }}

    /* Footer */
    footer {{
      margin-top: 60px;
      padding-top: 40px;
      border-top: 1px solid var(--border);
      text-align: center;
      color: var(--fg-subtle);
      font-size: 0.88rem;
      font-family: var(--font-mono);
      line-height: 1.6;
    }}

    footer a {{
      color: var(--fg-muted);
      text-decoration: none;
    }}

    footer a:hover {{
      color: var(--accent-green);
    }}

    @media (max-width: 768px) {{
      .matrix-search-box input {{ width: 100%; }}
    }}
  </style>
</head>
<body>

<div class="container">

  <!-- Top Navigation -->
  <header class="nav-bar">
    <a href="https://evaline.online" class="brand">
      <div class="brand-logo">E</div>
      <span>EVALINE // MANIFESTO</span>
    </a>
    <div class="nav-links">
      <a href="https://evabot.online" class="nav-link">EvaBot</a>
      <a href="https://evaline.network" class="nav-link">EvaNetwork</a>
      <a href="https://evaline.website" class="nav-link">Хаб сервисов</a>
      <a href="https://evabot.online/docs/" class="nav-link">База знаний</a>
      <div class="cluster-badge">
        <span class="pulse-dot"></span>
        <span id="cluster-status-text">КЛАСТЕР АКТИВЕН</span>
      </div>
    </div>
  </header>

  <!-- Hero Section -->
  <section class="hero">
    <div class="hero-eyebrow">Технологический манифест // Архитектура прикладного ИИ и реального сектора</div>
    <h1 class="hero-title">
      Фабрика автономных ИИ-агентов, <span>система «Консилиум»</span> и суверенное производство EvaLine
    </h1>
    <p class="hero-subtitle">
      Мы объединили полный цикл физического производства полимеров EVA (завод в Черноморске, логистический хаб в Братиславе) с передовой цифровой инфраструктурой автономных ИИ-агентов. Решения принимаются коллегиальным разумом Консилиума, а задачи выполняются в реальных IT-системах без галлюцинаций, простоев и лишних затрат.
    </p>

    <!-- Key Facts -->
    <div class="key-facts-bar">
      <div class="fact-item">
        <span class="fact-value green" id="stat-models">94 Модели</span>
        <span class="fact-label">Федеративный пул LLM</span>
      </div>
      <div class="fact-item">
        <span class="fact-value cyan">Консилиум</span>
        <span class="fact-label">Коллегиальная валидация</span>
      </div>
      <div class="fact-item">
        <span class="fact-value amber">21 MCP-Сервер</span>
        <span class="fact-label">Действия в коде и системах</span>
      </div>
      <div class="fact-item">
        <span class="fact-value purple">ISO 9001 & CE</span>
        <span class="fact-label">Завод и экспорт в ЕС</span>
      </div>
    </div>
  </section>

  <!-- Section 01: Почему чат-ботов недостаточно -->
  <section class="section">
    <div class="section-header">
      <span class="section-num">01</span>
      <h2 class="section-title">Проблема рынка: почему бизнесу недостаточно обычных чат-ботов</h2>
    </div>
    <p class="lead-text">
      Подавляющее большинство корпоративных внедрений ИИ сводится к примитивному окну веб-чата. На практике бизнес мгновенно упирается в системные тупики одиночных языковых моделей.
    </p>

    <div class="cards-grid">
      <div class="card">
        <div class="card-icon">❌</div>
        <h3 class="card-title">Цена слепых галлюцинаций</h3>
        <p class="card-text">
          Одиночная нейросеть всегда звучит предельно убедительно, даже когда грубо ошибается. В юриспруденции, финансах, системной архитектуре и производстве цена одной выдуманной нормы стандарта, ошибки в расчете рецептуры полимера или уязвимости в коде оборачивается колоссальными убытками.
        </p>
      </div>

      <div class="card">
        <div class="card-icon">🔒</div>
        <h3 class="card-title">Изоляция без «рук»</h3>
        <p class="card-text">
          Классический чат умеет лишь печатать текст. Он не способен подключиться к серверу по SSH, собрать контейнер Docker, выполнить рефакторинг в Git, отправить запрос к базе данных или сгенерировать управляющую программу для ЧПУ-раскроя. Человек остаётся ручным передатчиком между экраном и производством.
        </p>
      </div>

      <div class="card">
        <div class="card-icon">⛓️</div>
        <h3 class="card-title">Зависимость от монополий (Vendor Lock-in)</h3>
        <p class="card-text">
          Привязка к одной закрытой корпорации ставит компанию в зависимость от чужих ценовых политик, неожиданных блокировок и технических сбоев. Если калифорнийский провайдер меняет условия или отключает API, бизнес-процессы моментально парализуются.
        </p>
      </div>
    </div>
  </section>

  <!-- Section 02: Фабрика агентов EvaLine -->
  <section class="section">
    <div class="section-header">
      <span class="section-num">02</span>
      <h2 class="section-title">EvaNetwork: Фабрика агентов и автономное ИИ-агентство</h2>
    </div>
    <p class="lead-text">
      <strong>EvaLine</strong> проектирует не «ассистентов», а <strong>автономный штат специализированных цифровых сотрудников</strong>, объединённых строгими регламентами и общим контуром управления.
    </p>
    <p>
      Это работает по принципу высокотехнологичного агентства: под задачу бизнеса формируется команда агентов с четкими ролями, инструментами и перекрёстным контролем качества.
    </p>

    <div class="cards-grid">
      <div class="card">
        <div class="card-icon">👥</div>
        <h3 class="card-title">Штат ролевых специалистов</h3>
        <p class="card-text">
          Каждый агент наделён строгой специализацией: Главный системный архитектор (<strong>Architect</strong>), Ведущий бэкенд-инженер и шеф производства (<strong>Adam</strong>), Фронтенд-директор и амбассадор клиентского сервиса (<strong>Eva</strong>), Офицер безопасности (<strong>CISO</strong>), Аналитик данных (<strong>Data Engineer</strong>) и Стратег (<strong>CEO</strong>).
        </p>
      </div>

      <div class="card">
        <div class="card-icon">🛠️</div>
        <h3 class="card-title">Шина инструментов MCP (21 сервер)</h3>
        <p class="card-text">
          Благодаря промышленному протоколу Model Context Protocol агенты наделены полноценными руками: прямое выполнение команд Linux/Bash, управление Docker-контейнерами, работа с Git-репозиториями, взаимодействие с PostgreSQL/SQLite и автоматизация браузера Chrome DevTools.
        </p>
      </div>

      <div class="card">
        <div class="card-icon">🧠</div>
        <h3 class="card-title">Заземлённая корпоративная память (RAG)</h3>
        <p class="card-text">
          Агенты не забывают контекст компании: гибридная система объединяет графовую память связей, векторную базу ChromaDB и полнотекстовый поиск FTS5. Агенты оперируют только проверенными ГОСТами, стандартами ISO, контрактами и внутренней кодовой базой.
        </p>
      </div>
    </div>
  </section>

  <!-- Section 03: Система Евалайн Консилиум -->
  <section class="section">
    <div class="section-header">
      <span class="section-num">03</span>
      <h2 class="section-title">Система «Евалайн Консилиум»: Как работает коллегиальный разум</h2>
    </div>
    <p class="lead-text">
      Главное ядро платформы — <strong>Consilium Engine</strong>. Это алгоритмическая система многоагентных состязательных дебатов, взаимного аудита и синтеза консенсуса между независимыми нейросетевыми архитектурами.
    </p>

    <!-- Workflow Box: 4 Stages -->
    <div class="workflow-container">
      <div class="workflow-header">4 этапа выработки решения в системе «Евалайн Консилиум»</div>
      <div class="workflow-sub">От входящей бизнес-потребности до верифицированного внедрения</div>

      <div class="workflow-steps">
        <div class="step-box">
          <div class="step-num">Этап 01</div>
          <div class="step-title">Декомпозиция и контекст</div>
          <p class="step-desc">
            Архитектор и Бизнес-аналитик формулируют технические ограничения, критерии качества и извлекают регламенты из вечной памяти RAG.
          </p>
        </div>

        <div class="step-box">
          <div class="step-num">Этап 02</div>
          <div class="step-title">Параллельные дебаты гетерогенных LLM</div>
          <p class="step-desc">
            Google Gemini 3.1 Pro (архитектура), Claude 3.7 Sonnet (инженерия/код), DeepSeek R1 (математика) и OpenAI o1 (формальная верификация) предлагают независимые решения.
          </p>
        </div>

        <div class="step-box">
          <div class="step-num">Этап 03</div>
          <div class="step-title">Состязательный аудит (CISO / QA)</div>
          <p class="step-desc">
            Офицер безопасности и QA-инженер проводят стресс-тестирование: выявляют уязвимости OWASP, скрытые утечки данных, регуляторные риски и узкие места в расчётах.
          </p>
        </div>

        <div class="step-box">
          <div class="step-num">Этап 04</div>
          <div class="step-title">Консенсусный синтез и исполнение</div>
          <p class="step-desc">
            Движок ConsiliumEngine сопоставляет аргументы, отсекает до 99.4% галлюцинаций и формирует окончательный выверенный вердикт, готовый к запуску через шину MCP.
          </p>
        </div>
      </div>
    </div>

    <!-- How Consilium Works for ANY Business -->
    <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: #fff; margin: 36px 0 16px;">
      1. Как Консилиум работает для ЛЮБОГО бизнеса
    </h3>
    <p>
      Консилиум применим в любой индустрии, где цена ошибки высока, а рутинные процессы отнимают рабочие часы квалифицированных специалистов:
    </p>

    <div class="cards-grid">
      <div class="card">
        <div class="card-icon">💻</div>
        <h3 class="card-title">IT и разработка программного обеспечения</h3>
        <p class="card-text">
          Архитектор проектирует модули, Claude 3.7 пишет код, DeepSeek R1 проверяет алгоритмическую сложность, CISO валидирует права доступа, а DevOps формирует пайплайн развертывания. Без участия человека закрывается до 80% задач бэклога.
        </p>
      </div>

      <div class="card">
        <div class="card-icon">⚖️</div>
        <h3 class="card-title">Юриспруденция и международный комплаенс</h3>
        <p class="card-text">
          Перекрёстный аудит внешнеэкономических контрактов, проверка на соответствие европейским регламентам (GDPR, CE, таможенное право ЕС), поиск скрытых санкционных рисков и автоматическая подготовка двуязычных соглашений.
        </p>
      </div>

      <div class="card">
        <div class="card-icon">📊</div>
        <h3 class="card-title">Финансы, аудит и оценка себестоимости</h3>
        <p class="card-text">
          Сопоставление финансовых прогнозов независимыми моделями, стресс-тестирование маржинальности, предотвращение кассовых разрывов и верификация бухгалтерских проводок.
        </p>
      </div>

      <div class="card">
        <div class="card-icon">🌍</div>
        <h3 class="card-title">Омниканальные продажи и поддержка 24/7</h3>
        <p class="card-text">
          Голосовые и текстовые агенты общаются с клиентами на 6 языках без усталости, строго соблюдая скрипты и регламенты компании, мгновенно рассчитывая коммерческие предложения и логистику.
        </p>
      </div>
    </div>

    <!-- How Consilium Works for EvaLine Physical Production -->
    <h3 style="font-family: var(--font-display); font-size: 1.5rem; color: #fff; margin: 40px 0 16px;">
      2. Как Консилиум работает КОНКРЕТНО для компании EvaLine
    </h3>
    <p>
      Компания <strong>EvaLine</strong> — это первый в Украине производитель полного цикла экологически чистых полимерных материалов EVA (этиленвинилацетат) от исходных листов до готовой продукции. Производство расположено в <strong>г. Черноморск (ул. Промышленная, 1)</strong>, а европейский логистический склад — в <strong>г. Братислава (Obchodna 37, Словакия)</strong>.
    </p>

    <!-- Physical Production Box -->
    <div class="production-box">
      <div class="production-header">
        <span class="production-badge">РЕАЛЬНЫЙ СЕКТОР</span>
        <h4 style="font-family: var(--font-display); font-size: 1.3rem; color: #fff; margin: 0;">
          Материаловедение, продуктовая линейка и заводские стандарты EvaLine
        </h4>
      </div>
      <p style="color: #cbd5e1; margin-bottom: 16px;">
        Материал EVA — это вспененный полиолефин, который <strong>в 5 раз легче резины и в 4 раза легче ПВХ</strong>, не впитывает влагу, является диэлектриком, сохраняет упругость при температурах от <strong>-50°C до +70°C</strong> и устойчив к маслам, растворителям и дорожным реагентам.
      </p>

      <div class="cards-grid" style="margin: 20px 0 10px;">
        <div class="card" style="background: rgba(0,0,0,0.35);">
          <h4 style="color: var(--accent-green); font-family: var(--font-display); font-size: 1.15rem; margin-bottom: 8px;">
            🚗 Листы EVA для автоковриков («Ромб» и «Соты»)
          </h4>
          <p class="card-text">
            Глубокие ячейки (до 8 мм) собирают и удерживают до 2.5 литров воды, снега и песка. Салон всегда сухой. Консилиум автоматизирует раскрой под лекала более 1 200 моделей автомобилей для производителей ковриков по всей Европе.
          </p>
        </div>

        <div class="card" style="background: rgba(0,0,0,0.35);">
          <h4 style="color: var(--accent-cyan); font-family: var(--font-display); font-size: 1.15rem; margin-bottom: 8px;">
            🐄 Маты для животноводства «Бурьонка» (КРС)
          </h4>
          <p class="card-text">
            Сертифицированные маты для коровников, включённые в государственную программу компенсации 25% стоимости в Украине. Исключают травматизм копыт, предотвращают мастит у коров и повышают надои молока на 12–15%. Консилиум автоматически рассчитывает окупаемость для агрохолдингов.
          </p>
        </div>

        <div class="card" style="background: rgba(0,0,0,0.35);">
          <h4 style="color: var(--accent-amber); font-family: var(--font-display); font-size: 1.15rem; margin-bottom: 8px;">
            🥋 Спортивные татами и покрытия-пазлы
          </h4>
          <p class="card-text">
            Плотность 75–250 кг/м³, твердость от 20 до 75 по Шору А, замки «ласточкин хвост» (dovetail), толщина 10–50 мм для дзюдо, карате, самбо и детских комнат. Консилиум подбирает амортизацию под нормативы спортивных федераций.
          </p>
        </div>

        <div class="card" style="background: rgba(0,0,0,0.35);">
          <h4 style="color: var(--accent-purple); font-family: var(--font-display); font-size: 1.15rem; margin-bottom: 8px;">
            ⚓ Искусственный тик EVA для катеров и яхт
          </h4>
          <p class="card-text">
            Палубное покрытие с клеевым слоем 3M, устойчивое к ультрафиолету, соленой морской воде и механическому истиранию.
          </p>
        </div>
      </div>

      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: 8px; padding: 16px; margin-top: 16px; font-size: 0.92rem; color: #9aa5b5;">
        <strong style="color: #fff;">Сертификация и доверие:</strong> EvaLine — официальный участник Всеукраинской сети добропорядочности и комплаенса <strong>UNIC</strong> (куда входят лишь 52 компании Украины), обладатель международного сертификата менеджмента качества <strong>ISO 9001</strong>, европейского знака <strong>CE</strong> и гигиенических заключений СЭС МОЗ Украины. Предприятие выполняет контрактное производство <strong>Private Label (OEM/ODM)</strong> под ключ.
      </div>
    </div>

    <div class="callout">
      <div class="callout-title">🏭 Консилиум в действии на производстве EvaLine:</div>
      <p class="callout-body">
        <strong>Adam (Бэкенд-инженер и шеф производства)</strong> оптимизирует рецептуры вспенивания полимера, рассчитывает карты раскроя для ЧПУ-плоттеров и управляет защищённой базой лекал.<br>
        <strong>Eva (Директор фронтенда и амбассадор бренда)</strong> общается с B2B-партнёрами из Польши, Германии, Румынии и Украины на 6 языках, мгновенно формируя коммерческие предложения с логистикой из Братиславы или Черноморска.<br>
        <strong>Zero-OpEx Routing</strong>: рутинный подбор параметров ковриков обрабатывается бесплатными моделями Gemini Flash ($0 себестоимости), а сложная экспортная документация и согласование Private Label — Консилиумом на Gemini 3.1 Pro и Claude 3.7 Sonnet.
      </p>
    </div>
  </section>

  <!-- Section 04: Федеративная матрица LLM: Бесплатные и Платные модели -->
  <section class="section" id="models-matrix">
    <div class="section-header">
      <span class="section-num">04</span>
      <h2 class="section-title">Федеративная матрица LLM: 94 модели (Бесплатные и Платные)</h2>
    </div>
    <p class="lead-text">
      EvaLine не привязана к одной платформе. Наша фабрика агентов объединяет <strong>94 языковые модели от 10 провайдеров</strong>: Google DeepMind, Anthropic, DeepSeek, OpenAI, Meta, Mistral, Cohere и специализированных демонов OmniRoute.
    </p>
    <p>
      Система автоматически разделяет нагрузку: <strong>62 бесплатные модели</strong> с нулевой себестоимостью закрывают 80% рутинных агентских операций (Zero-OpEx), а <strong>32 коммерческих флагмана</strong> подключаются «Консилиумом» для глубоких рассуждений, аудита безопасности и финального синтеза решений.
    </p>

    <!-- Interactive Filters & Controls -->
    <div class="matrix-controls">
      <!-- Tabs for Free vs Paid vs All -->
      <div class="matrix-tabs">
        <button class="matrix-tab active" data-filter="free">🟢 Бесплатные модели (62)</button>
        <button class="matrix-tab" data-filter="paid">💎 Платные флагманы (32)</button>
        <button class="matrix-tab" data-filter="all">🌐 Все модели (94)</button>
      </div>

      <!-- Sorting Buttons -->
      <div class="matrix-sort-bar">
        <span class="sort-label">Сортировка:</span>
        <button class="sort-btn active" data-sort="quality">🧠 По уму и мощности (IQ)</button>
        <button class="sort-btn" data-sort="recency">✨ По новизне (2026 Fleet)</button>
        <button class="sort-btn" data-sort="cost">💰 По стоимости (Дорогие / Бесплатные)</button>
        <button class="sort-btn" data-sort="context">📚 По контексту (до 2M)</button>
      </div>

      <!-- Search Input -->
      <div class="matrix-search-box">
        <input type="text" id="model-search" placeholder="🔍 Поиск модели или провайдера (Gemini, Claude, DeepSeek, OpenAI, Llama...)" autocomplete="off">
        <span id="models-count-badge" class="count-badge">Показано: 62 бесплатных моделей</span>
      </div>
    </div>

    <!-- Models Grid Container with Prerendered Fallback -->
    <div class="models-grid" id="models-container">
{prerendered_html}
    </div>
  </section>

  <!-- Section 05: Сравнительная таблица -->
  <section class="section">
    <div class="section-header">
      <span class="section-num">05</span>
      <h2 class="section-title">Сравнение подходов: Одиночный ИИ vs Фабрика Агентов EvaLine</h2>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Критерий</th>
            <th>Классический чат-бот (ChatGPT / Claude)</th>
            <th>Фабрика Агентов EvaLine с Консилиумом</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Формат работы</strong></td>
            <td>Одиночные ответы в окне чата без интеграции.</td>
            <td class="col-highlight">Автономный штат специалистов, работающих сквозным циклом.</td>
          </tr>
          <tr>
            <td><strong>Устойчивость к галлюцинациям</strong></td>
            <td>Низкая: модель склонна уверенно выдумывать факты.</td>
            <td class="col-highlight">Высокая: перекрёстный аудит несколькими независимыми LLM (точность 99.4%).</td>
          </tr>
          <tr>
            <td><strong>Выполнение действий в IT</strong></td>
            <td>Невозможно (только советы и сниппеты текста).</td>
            <td class="col-highlight">Прямое управление серверами, кодом, ЧПУ-раскроем и Docker через MCP.</td>
          </tr>
          <tr>
            <td><strong>Безопасность данных</strong></td>
            <td>Утечка коммерческой тайны на сервера сторонней компании.</td>
            <td class="col-highlight">Суверенная архитектура: закрытый WireGuard контур и изолированные БД.</td>
          </tr>
          <tr>
            <td><strong>Зависимость от одного провайдера</strong></td>
            <td>100% зависимость: при сбое провайдера процесс встаёт.</td>
            <td class="col-highlight">Федерация из 94 моделей с автоматическим переключением резерва.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>

  <!-- Section 06: Инфраструктурный фундамент и военная устойчивость -->
  <section class="section">
    <div class="section-header">
      <span class="section-num">06</span>
      <h2 class="section-title">Военная устойчивость, блэкаут-резистентность и кластер двух узлов</h2>
    </div>
    <p class="lead-text">
      Инфраструктура EvaLine спроектирована для работы в условиях полномасштабных вызовов: ракетных ударов по энергосистеме, блэкаутов и мобилизационного дефицита кадров.
    </p>

    <div class="cards-grid">
      <div class="card">
        <div class="card-icon">🇩🇪</div>
        <h3 class="card-title">EvaBrain — Вычислительное ядро (Франкфурт)</h3>
        <p class="card-text">
          Мощный compute-сервер (8 vCPU Intel Xeon, 32 GB RAM) в защищённой европейской зоне НАТО. Здесь непрерывно функционируют агенты, компиляторы, локальные языковые серверы LSP и графовая память. 100% аптайм даже при блэкауте в Украине.
        </p>
      </div>

      <div class="card">
        <div class="card-icon">🇺🇸</div>
        <h3 class="card-title">EvaFace — Краевой защитный шлюз (Айова)</h3>
        <p class="card-text">
          Облегчённый edge-узел на стеке Caddy HTTP/3 QUIC и автоматическом TLS 1.3. Принимает глобальный трафик пользователей, отсекает атаки и мгновенно перенаправляет запросы в ядро.
        </p>
      </div>

      <div class="card">
        <div class="card-icon">🌐</div>
        <h3 class="card-title">Магистраль WireGuard Mesh (ChaCha20-Poly1305)</h3>
        <p class="card-text">
          Шифрованная магистраль без публично открытых системных портов. Автоматические сторожевые службы (Watchdog каждые 3 минуты) и защита ядра (EarlyOOM) исключают зависания процессов.
        </p>
      </div>
    </div>
  </section>

  <!-- Section 07: Каталог экосистемы -->
  <section class="section">
    <div class="section-header">
      <span class="section-num">07</span>
      <h2 class="section-title">Единая экосистема: Каталог доменов и сервисов</h2>
    </div>
    <p class="lead-text">
      Каждый домен кластера специализирован под свою функциональную роль в рамках агентской сети:
    </p>

    <div class="hub-grid">
      <a href="https://evabot.online" class="hub-item">
        <span class="hub-item-badge">Рабочая станция ИИ</span>
        <div class="hub-item-domain">evabot.online</div>
        <div class="hub-item-desc">Главный терминал EvaBot: мультимодельный диалог, запуск Консилиума и голосовое взаимодействие.</div>
      </a>

      <a href="https://evaline.network" class="hub-item">
        <span class="hub-item-badge">Телеметрия кластера</span>
        <div class="hub-item-domain">evaline.network</div>
        <div class="hub-item-desc">Высокотехнологичный TUI-дашборд: мониторинг процессов, задержки сети и состояния 94 LLM моделей.</div>
      </a>

      <a href="https://evaline.online" class="hub-item">
        <span class="hub-item-badge">Манифест и философия</span>
        <div class="hub-item-domain">evaline.online</div>
        <div class="hub-item-desc">Официальный манифест фабрики агентов, системы Консилиум и принципов суверенного интеллекта.</div>
      </a>

      <a href="https://evaline.website" class="hub-item">
        <span class="hub-item-badge">Центральный портал</span>
        <div class="hub-item-domain">evaline.website</div>
        <div class="hub-item-desc">Единый навигационный каталог всех сервисов, продуктов, инструментов и точек входа компании.</div>
      </a>
    </div>

    <div style="display: flex; gap: 16px; flex-wrap: wrap; margin-top: 16px;">
      <a href="https://evabot.online/docs/" class="hub-item" style="flex: 1; min-width: 260px;">
        <span class="hub-item-badge">База знаний Quartz</span>
        <div class="hub-item-domain">Документация // Docs</div>
        <div class="hub-item-desc">360+ технических статей: архитектура кластера, ролевые профили агентов, спецификации API.</div>
      </a>
      <a href="https://evabot.online/voice/docs" class="hub-item" style="flex: 1; min-width: 260px;">
        <span class="hub-item-badge">Интерактивный REST API</span>
        <div class="hub-item-domain">EvaVoice Swagger UI</div>
        <div class="hub-item-desc">Спецификация голосового микросервиса FastAPI для синтеза и распознавания речи в реальном времени.</div>
      </a>
    </div>
  </section>

  <!-- Footer -->
  <footer>
    <p>EVALINE NETWORK & EVABOT ONLINE // СУВЕРЕННАЯ ФАБРИКА АВТОНОМНЫХ ИИ-АГЕНТОВ & ПРОИЗВОДСТВО ПОЛИМЕРОВ EVA</p>
    <p style="margin-top: 8px;">
      Производство: Украина, г. Черноморск, ул. Промышленная, 1 • Склад в ЕС: Словакия, г. Братислава, Obchodna 37 • Сертификация ISO 9001 & CE
    </p>
    <p style="margin-top: 8px; color: var(--fg-subtle);">
      Кластер: Франкфурт (8 vCPU) ⟷ Айова (Ingress) ⟷ Защищённый WireGuard Mesh-контур.
    </p>
  </footer>

</div>

<!-- EMBEDDED MODELS REGISTRY DATA & INTERACTIVE SCRIPT -->
<script>
  const RAW_MODELS = {models_json_str};

  let currentFilter = 'free';
  let currentSort = 'quality';
  let searchQuery = '';

  function formatTokens(t) {{
    if (t >= 2000000) return '2M токенов (~1.5M слов)';
    if (t >= 1000000) return '1M токенов (~750k слов)';
    if (t >= 500000) return '512k токенов';
    if (t >= 200000) return '200k токенов';
    if (t >= 128000) return '128k токенов';
    if (t >= 64000) return '64k токенов';
    if (t >= 32000) return '32k токенов';
    return t ? t + ' токенов' : 'Стандарт';
  }}

  function getProviderClass(p) {{
    const s = (p || '').toLowerCase();
    if (s.includes('google')) return 'provider-google';
    if (s.includes('anthropic')) return 'provider-anthropic';
    if (s.includes('deepseek')) return 'provider-deepseek';
    if (s.includes('openai')) return 'provider-openai';
    if (s.includes('meta')) return 'provider-meta';
    if (s.includes('mistral')) return 'provider-mistral';
    if (s.includes('omniroute')) return 'provider-omniroute';
    return 'provider-default';
  }}

  function getRecencyBadge(r) {{
    if (r >= 95) return '✨ 2026 Fleet';
    if (r >= 80) return '2025 Frontier';
    return 'Standard Fleet';
  }}

  function renderModels() {{
    const container = document.getElementById('models-container');
    if (!container) return;

    // Filter
    let list = RAW_MODELS.filter(m => {{
      if (currentFilter === 'free' && !m.isFree) return false;
      if (currentFilter === 'paid' && m.isFree) return false;
      if (searchQuery) {{
        const q = searchQuery.toLowerCase();
        const match = m.name.toLowerCase().includes(q) ||
                      m.provider.toLowerCase().includes(q) ||
                      (m.desc && m.desc.toLowerCase().includes(q)) ||
                      (m.roleHint && m.roleHint.toLowerCase().includes(q));
        if (!match) return false;
      }}
      return true;
    }});

    // Sort
    list.sort((a, b) => {{
      if (currentSort === 'quality') return b.quality - a.quality || b.recency - a.recency;
      if (currentSort === 'recency') return b.recency - a.recency || b.quality - a.quality;
      if (currentSort === 'cost') {{
        return b.numPrice - a.numPrice || b.quality - a.quality;
      }}
      if (currentSort === 'context') return b.context - a.context || b.quality - a.quality;
      return 0;
    }});

    // Update count badge
    const countBadge = document.getElementById('models-count-badge');
    if (countBadge) {{
      const typeLabel = currentFilter === 'free' ? 'бесплатных' : currentFilter === 'paid' ? 'платных' : 'всего';
      countBadge.textContent = `Показано: ${{list.length}} ${{typeLabel}} моделей`;
    }}

    // Render HTML
    container.innerHTML = list.map(m => {{
      const pClass = getProviderClass(m.provider);
      const isPaidClass = m.isFree ? '' : 'is-paid';
      const tierBadge = m.isFree
        ? `<span class="metric-pill tier-free">🟢 Free Quota $0.00</span>`
        : `<span class="metric-pill tier-paid">💎 Коммерческая</span>`;
      const recencyBadge = `<span class="metric-pill">${{getRecencyBadge(m.recency)}}</span>`;
      const iqBadge = `<span class="metric-pill iq">🧠 IQ: <strong>${{m.quality}}</strong>/100</span>`;
      const ctxBadge = `<span class="metric-pill">📚 ${{formatTokens(m.context)}}</span>`;

      const priceHtml = m.isFree
        ? `<div class="model-pricing-box">
             <div><span class="price-tag free">100% Free Quota</span> • Себестоимость: $0.00</div>
             <div style="color: var(--fg-muted); font-size: 0.72rem;">${{m.freeDetails || 'Google AI Studio 15 RPM / 1M TPM / 1500 RPD'}}</div>
           </div>`
        : `<div class="model-pricing-box">
             <div><span class="price-tag paid">Вход: ${{m.priceIn}}</span> / 1M токенов</div>
             <div style="color: var(--fg-muted); font-size: 0.72rem;">Выход: ${{m.priceOut}} / 1M • Enterprise SLA</div>
           </div>`;

      return `
        <div class="model-card ${{isPaidClass}}">
          <div class="model-card-header">
            <div class="model-name">${{m.name}}</div>
            <span class="provider-badge ${{pClass}}">${{m.provider}}</span>
          </div>
          <div class="model-metrics">
            ${{iqBadge}}
            ${{tierBadge}}
            ${{recencyBadge}}
            ${{ctxBadge}}
          </div>
          <p class="model-desc">${{m.desc || ''}}</p>
          <div class="model-role">
            <strong>Роль в Консилиуме:</strong> ${{m.roleHint}}
          </div>
          ${{priceHtml}}
        </div>
      `;
    }}).join('');
  }}

  // Setup Event Listeners
  document.addEventListener('DOMContentLoaded', () => {{
    // Tab filters
    document.querySelectorAll('.matrix-tab').forEach(btn => {{
      btn.addEventListener('click', () => {{
        document.querySelectorAll('.matrix-tab').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.getAttribute('data-filter');
        renderModels();
      }});
    }});

    // Sort buttons
    document.querySelectorAll('.sort-btn').forEach(btn => {{
      btn.addEventListener('click', () => {{
        document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentSort = btn.getAttribute('data-sort');
        renderModels();
      }});
    }});

    // Search input
    const searchInput = document.getElementById('model-search');
    if (searchInput) {{
      searchInput.addEventListener('input', (e) => {{
        searchQuery = e.target.value;
        renderModels();
      }});
    }}

    renderModels();
  }});

  // Live cluster status telemetry
  async function checkCluster() {{
    try {{
      const res = await fetch('https://evabot.online/api/health', {{ cache: 'no-store' }});
      if (res.ok) {{
        const d = await res.json();
        const el = document.getElementById('cluster-status-text');
        if (el) {{
          const lat = (d.telemetry && d.telemetry.meshLatencyMs) ? d.telemetry.meshLatencyMs : 124;
          el.textContent = 'КЛАСТЕР АКТИВЕН (' + lat + 'мс RTT)';
        }}
        const mEl = document.getElementById('stat-models');
        if (mEl && d.availableModels) {{
          mEl.textContent = d.availableModels + ' Моделей';
        }}
      }}
    }} catch (e) {{}}
  }}
  checkCluster();
  setInterval(checkCluster, 10000);
</script>

</body>
</html>
"""

# Write to /var/www/evabot-backend/public/manifesto.html
with open('/var/www/evabot-backend/public/manifesto.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

# Also write to /home/evabot/evaline-online/index.html and /home/evabot/evaline-online/public/manifesto.html
import os
os.makedirs('/home/evabot/evaline-online/public', exist_ok=True)

with open('/home/evabot/evaline-online/index.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

with open('/home/evabot/evaline-online/public/manifesto.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

with open('/home/evabot/evaline-online/models_catalog.json', 'w', encoding='utf-8') as f:
    json.dump(models, f, ensure_ascii=False, indent=2)

print("Successfully generated fluid, Roboto-powered Manifesto!")
