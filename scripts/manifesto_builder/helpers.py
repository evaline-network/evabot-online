# -*- coding: utf-8 -*-
"""
Helper formatting functions for the Trilingual Manifesto.
"""

def t(ru, uk, en, tag="span", cls=""):
    c = f' class="{cls} ' if cls else ' class="'
    return f'<{tag}{c}t-ru">{ru}</{tag}><{tag}{c}t-uk">{uk}</{tag}><{tag}{c}t-en">{en}</{tag}>'

def p_t(ru, uk, en, cls=""):
    return t(ru, uk, en, tag="p", cls=cls)

def div_t(ru, uk, en, cls=""):
    return t(ru, uk, en, tag="div", cls=cls)

def accordion_section(sec_id, num, title_ru, title_uk, title_en, badge_ru, badge_uk, badge_en, content, open=True):
    op = ' open' if open else ''
    return f'''  <!-- =========================================================================
       SECTION {num}: {sec_id.upper()}
       ========================================================================= -->
  <details class="accordion-section"{op} id="{sec_id}">
    <summary class="accordion-summary">
      <div class="summary-left">
        <span class="summary-chevron">▾</span>
        <span class="summary-num">{num}</span>
        <h2 class="summary-title">
          {t(title_ru, title_uk, title_en, tag="span")}
        </h2>
      </div>
      <div class="summary-badge">
        {t(badge_ru, badge_uk, badge_en, tag="span")}
      </div>
    </summary>
    <div class="accordion-content">
{content}
    </div>
  </details>
'''

def sub_accordion(sub_id, icon, title_ru, title_uk, title_en, badge_ru, badge_uk, badge_en, content, open=True):
    op = ' open' if open else ''
    badge_html = f'<span class="sub-badge">{t(badge_ru, badge_uk, badge_en, tag="span")}</span>' if badge_ru else ''
    return f'''    <details class="sub-accordion"{op} id="{sub_id}">
      <summary class="sub-summary">
        <div class="sub-summary-left">
          <span class="sub-chevron">▾</span>
          <span class="sub-icon">{icon}</span>
          <h3 class="sub-title">
            {t(title_ru, title_uk, title_en, tag="span")}
          </h3>
        </div>
        {badge_html}
      </summary>
      <div class="sub-content">
{content}
      </div>
    </details>
'''
