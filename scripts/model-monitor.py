#!/usr/bin/env python3
"""EvaBot Model Monitor — свежие бесплатные и платные модели, топ для кодинга.

Источники (прямо живые, обновляются провайдерами/лидбордами):
  1. LiteLLM model DB (github BerriAI)     — цены, контекст, провайдеры всех моделей мира
  2. OpenRouter /api/v1/models             — живые :free слаги + цены платных
  3. OpenRouter /rankings                  — популярность (реальное использование)
  4. Groq /models                          — free-tier каталог Groq
  5. Cerebras /models                      — free-tier каталог Cerebras
  6. Z.ai /models                          — каталог Z.ai (GLM)
  7. HuggingFace trending API              — тренды открытых моделей
  8. Aider leaderboard (github raw)        — бенчмарк кодинга (edit format, % correct)
  9. LiveBench / SWE-bench (best-effort)   — HTML, если доступны
 10. Локальные замеры EvaBot               — docs/reports/OMNIROUTE_* (наши latency-замеры)

Выход:
  data/model-monitor/REPORT.md    — TOP-10 FREE coding + TOP-10 PAID coding + источники + diff
  data/model-monitor/snapshot.json
  data/model-monitor/history.jsonl

Запуск: python3 scripts/model-monitor.py [--json]
Таймер: systemd evabot-model-monitor.timer (каждые 12ч) — см. config/
"""

import json
import os
import re
import sys
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
OUT = REPO / "data" / "model-monitor"
OUT.mkdir(parents=True, exist_ok=True)

UA = {"User-Agent": "Mozilla/5.0 (EvaBot-Monitor/1.0)"}

# API keys from omniroute env (same keys, no new secrets)
def load_env():
    env = {}
    p = Path("/opt/omniroute/omniroute.env")
    if p.exists():
        for line in p.read_text().splitlines():
            if "=" in line:
                k, _, v = line.partition("=")
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env

ENV = load_env()


def fetch(url, timeout=12, headers=None, expect_json=True):
    try:
        req = urllib.request.Request(url, headers={**UA, **(headers or {})})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            data = r.read().decode("utf-8", "replace")
        if expect_json:
            return json.loads(data), None
        return data, None
    except Exception as e:
        return None, f"{type(e).__name__}: {e}"


# ---------- source collectors ----------

def src_litellm_prices():
    data, err = fetch("https://raw.githubusercontent.com/BerriAI/litellm/main/model_prices_and_context_window.json")
    if not data:
        return {}, err
    out = {}
    for name, meta in data.items():
        if not isinstance(meta, dict):
            continue
        out[name] = {
            "in": meta.get("input_cost_per_token"),
            "out": meta.get("output_cost_per_token"),
            "ctx": meta.get("max_input_tokens") or meta.get("max_tokens"),
            "updated": meta.get("last_updated"),
        }
    return out, None


def src_openrouter():
    h = {}
    if ENV.get("OPENROUTER_API_KEY"):
        h["Authorization"] = f"Bearer {ENV['OPENROUTER_API_KEY']}"
    data, err = fetch("https://openrouter.ai/api/v1/models", headers=h)
    if not data:
        return [], err
    models = []
    for m in data.get("data", []):
        pricing = m.get("pricing") or {}
        is_free = m["id"].endswith(":free") or (
            float(pricing.get("prompt") or 1) == 0 and float(pricing.get("completion") or 1) == 0
        )
        models.append({
            "id": m["id"],
            "name": m.get("name", m["id"]),
            "free": is_free,
            "ctx": m.get("context_length"),
            "created": m.get("created"),
            "in_price": float(pricing.get("prompt") or 0) * 1_000_000,
            "out_price": float(pricing.get("completion") or 0) * 1_000_000,
        })
    return models, None


def src_provider(base, header_name=None, key=None):
    h = {header_name: f"Bearer {key}"} if header_name and key else {}
    data, err = fetch(base, headers=h)
    if not data:
        return [], err
    return [m["id"] for m in data.get("data", [])], None


def src_hf_trending():
    data, err = fetch(
        "https://huggingface.co/api/models?sort=trendingScore&direction=-1&limit=60&filter=text-generation",
        headers={"Authorization": f"Bearer {ENV['HF_TOKEN']}"} if ENV.get("HF_TOKEN") else {},
    )
    if not data:
        return [], err
    return [m["id"] for m in data], None


def src_aider():
    # Aider leaderboards: structured YAML with pass_rate_2 per model (edit + polyglot suites)
    paths = [
        "https://raw.githubusercontent.com/Aider-AI/aider/main/aider/website/_data/edit_leaderboard.yml",
        "https://raw.githubusercontent.com/Aider-AI/aider/main/aider/website/_data/polyglot_leaderboard.yml",
    ]
    try:
        import yaml as _yaml
    except ImportError:
        _yaml = None
    rows = {}
    for u in paths:
        data, err = fetch(u, expect_json=False)
        if not data or _yaml is None:
            continue
        try:
            for row in _yaml.safe_load(data):
                model = str(row.get("model", "")).strip().lower()
                rate = row.get("pass_rate_2") or row.get("pass_rate_1")
                if model and rate:
                    rows[model] = max(rows.get(model, 0), float(rate))
        except Exception:
            continue
    if rows:
        return rows, None
    return {}, "aider leaderboard not parseable"


def src_or_rankings():
    data, err = fetch("https://openrouter.ai/rankings", expect_json=False)
    if not data:
        return [], err
    # best-effort: model slugs appearing in HTML
    ids = set(re.findall(r'"(?:id|slug)":"([a-z0-9_.\-]+/[a-z0-9_.\-:]+)"', data))
    popular = [i for i in ids if not i.startswith("_")]
    return popular, None


# ---------- scoring ----------

CODING_FAMILY = re.compile(
    r"codestral|coder|code|devstral|gpt-oss|compound|deepseek|qwen|glm|kimi|codex|"
    r"nemotron|inkling|laguna|ling|granite|minimax|sonnet|claude|gpt-|o[34]-|gemini|grok|phind"
)


def recency_score(created):
    if not created:
        return 0
    days = max(0, (time.time() - float(created)) / 86400)
    return 15 if days <= 45 else 10 if days <= 120 else 5 if days <= 365 else 0


def ctx_score(ctx):
    c = ctx or 0
    return 15 if c >= 262_144 else 10 if c >= 131_072 else 5 if c >= 32_768 else 0


def score_model(m, aider_rows, popular_set, hf_set):
    """Blended 0-100 coding score: leaderboard 45 / popularity 15 / family 15 / ctx 15 / recency 10."""
    s = 0.0
    key = m["id"].split("/")[-1].lower()
    base = m["id"].lower()
    norm = lambda t: re.sub(r"[^a-z0-9]", "", t)  # noqa: E731
    base_n = norm(base)
    aider_best = 0.0
    for rk, rv in aider_rows.items():
        probe = norm(rk.split("(")[0].strip())
        if probe and (probe in base_n or base_n in probe or norm(key) in probe or probe in norm(key)):
            aider_best = max(aider_best, rv)
    s += (aider_best / 100) * 45 if aider_best else 0
    if m["id"] in popular_set or any(m["id"].startswith(p.split("/")[0]) and key in p for p in popular_set):
        s += 15
    if CODING_FAMILY.search(base):
        s += 15
    s += ctx_score(m.get("ctx"))
    s += recency_score(m.get("created"))
    if any(key in h.lower() for h in hf_set):
        s += 10  # community momentum
    return round(s, 1)


# ---------- main ----------

def main():
    report_time = datetime.now(timezone.utc)
    sources = {}
    results = {}

    prices, e = src_litellm_prices();      sources["litellm_prices"] = e or f"OK ({len(prices)} models)"
    or_models, e = src_openrouter();       sources["openrouter"] = e or f"OK ({len(or_models)} models)"
    groq, e = src_provider("https://api.groq.com/openai/v1/models", "Authorization", ENV.get("GROQ_API_KEY"))
    sources["groq"] = e or f"OK ({len(groq)})"
    cereb, e = src_provider("https://api.cerebras.ai/v1/models", "Authorization", ENV.get("CEREBRAS_API_KEY"))
    sources["cerebras"] = e or f"OK ({len(cereb)})"
    zai, e = src_provider("https://api.z.ai/api/paas/v4/models", "Authorization", ENV.get("ZAI_API_KEY"))
    sources["zai"] = e or f"OK ({len(zai)})"
    hf, e = src_hf_trending();             sources["hf_trending"] = e or f"OK ({len(hf)})"
    aider, e = src_aider();                sources["aider"] = e or f"OK ({len(aider)} rows)"
    or_rank, e = src_or_rankings();        sources["or_rankings"] = e or f"OK ({len(or_rank)} ids)"

    popular = set(or_rank)
    hf_set = set(hf)
    aider_rows = aider

    # --- enrich provider free-tier models (groq/cerebras/zai) as pseudo-models
    def pseudo(mid, provider, ctx=131_072):
        return {"id": f"{provider}/{mid}", "name": mid, "free": True, "ctx": ctx,
                "created": None, "in_price": 0, "out_price": 0}

    free_pool = [m for m in or_models if m["free"]]
    for mid in groq:
        if any(k in mid for k in ("gpt-oss", "compound", "qwen", "allam", "prompt-guard")) and "whisper" not in mid and "orpheus" not in mid:
            free_pool.append(pseudo(mid, "groq", 131_072))
    for mid in cereb:
        free_pool.append(pseudo(mid, "cerebras"))
    for mid in zai:
        if mid in ("glm-5.3-flash", "glm-4.5-air", "glm-4.5"):
            free_pool.append(pseudo(mid, "zai", 131_072))

    for m in free_pool:
        m["score"] = score_model(m, aider_rows, popular, hf_set)

    paid_pool = [m for m in or_models if not m["free"]]
    for m in paid_pool:
        m["score"] = score_model(m, aider_rows, popular, hf_set)

    free_top = sorted(free_pool, key=lambda m: -m["score"])[:10]
    paid_top = sorted(paid_pool, key=lambda m: -m["score"])[:10]

    # --- previous snapshot for diff
    prev = {}
    snap_path = OUT / "snapshot.json"
    if snap_path.exists():
        try:
            prev = json.load(open(snap_path)).get("top", {})
        except Exception:
            prev = {}

    def rows(top, prev_key):
        prev_ids = {m["id"] for m in prev.get(prev_key, [])}
        lines = []
        for i, m in enumerate(top, 1):
            mark = " 🆕" if m["id"] not in prev_ids and prev else ""
            extra = f" · ctx {m['ctx']:,}" if m.get("ctx") else ""
            if not m["free"]:
                extra += f" · ${m['in_price']:.2f} in / ${m['out_price']:.2f} out за 1M"
            lines.append(f"| {i} | `{m['id']}` | {m['score']} |{mark}{extra} |")
        return "\n".join(lines)

    report = f"""---
title: Модельный монитор — топ бесплатные/платные для кодинга
date: {report_time.date().isoformat()}
tags: [models, monitoring, free, paid, coding]
description: Авто-агрегация топ-10 источников: актуальные бесплатные и платные модели
---

# 📡 Модельный монитор — {report_time.strftime('%Y-%m-%d %H:%M UTC')}

## 🆓 TOP-10 FREE для кодинга

| # | Модель | Score | |
|---|--------|-------|--|
{rows(free_top, "free")}

## 💎 TOP-10 PAID для кодинга

| # | Модель | Score | |
|---|--------|-------|--|
{rows(paid_top, "paid")}

## 🗄️ Источники

| Источник | Статус |
|----------|--------|
| LiteLLM model DB (цены/контекст) | {sources['litellm_prices']} |
| OpenRouter каталог (живые :free) | {sources['openrouter']} |
| OpenRouter rankings (популярность) | {sources['or_rankings']} |
| Groq free-tier | {sources['groq']} |
| Cerebras free-tier | {sources['cerebras']} |
| Z.ai (GLM) | {sources['zai']} |
| HuggingFace trending | {sources['hf_trending']} |
| Aider leaderboard (кодинг) | {sources['aider']} |
| Локальные замеры EvaBot | docs/reports/OMNIROUTE_* |

> Score = бленд: Aider 45% + популярность 15% + coding-family 15% + контекст 15% + свежесть 10% + HF-тренд 10%.

Back to [[index]] · Настройка таймера: config/evabot-model-monitor.timer
"""
    (OUT / "REPORT.md").write_text(report)
    snapshot = {
        "ts": report_time.isoformat(),
        "sources": sources,
        "top": {
            "free": [{k: m.get(k) for k in ("id", "score", "ctx")} for m in free_top],
            "paid": [{k: m.get(k) for k in ("id", "score", "ctx", "in_price", "out_price")} for m in paid_top],
        },
    }
    snap_path.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2))
    with open(OUT / "history.jsonl", "a") as f:
        f.write(json.dumps(snapshot, ensure_ascii=False) + "\n")

    print(f"FREE  top: {', '.join(m['id'] for m in free_top[:5])}")
    print(f"PAID  top: {', '.join(m['id'] for m in paid_top[:5])}")
    print("report:", OUT / "REPORT.md")
    if os.environ.get("MONITOR_JSON"):
        print(json.dumps(snapshot["top"], ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
