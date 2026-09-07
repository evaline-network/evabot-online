---
title: Cloud TTS (Google Cloud Text-to-Speech)
tags: [ops, tts, google-cloud, only-free]
created: 2026-09-07
status: implemented
---

# Cloud TTS (Google Cloud Text-to-Speech)

Back to [[index]]

## What it is

Server-side speech synthesis for EvaBot (Ева / Адам personas) via
`POST https://texttospeech.googleapis.com/v1/text:synthesize`, reusing the
existing `GoogleAuthProvider` credentials chain (user-ADC refresh-token
exchange). Every request sends:

```
Authorization: Bearer <token>
X-Goog-User-Project: evabot-agent-server   ← REQUIRED for user-ADC auth
```

## ONLY-FREE rule & pricing verification (2026-09)

Verified against the official pricing page
**https://cloud.google.com/text-to-speech/pricing** (retrieved 2026-09-07):

| Family      | Free allowance / month | Price after free tier |
|-------------|------------------------|-----------------------|
| Standard    | 4,000,000 chars        | $4 / 1M chars         |
| **WaveNet** | **1,000,000 chars**    | $16 / 1M chars        |
| Neural2     | 1,000,000 chars        | $16 / 1M chars        |
| Chirp 3: HD | 1,000,000 chars        | $30 / 1M chars        |
| Studio      | 100,000 chars          | $160 / 1M chars       |

Key finding: the earlier assumption that **Chirp 3: HD has no free tier was
wrong** — it has 1M chars/month free like WaveNet/Neural2. However, after the
allowance it is the most expensive conversational family ($30/1M), and the
initial hypothesis was that uk/ru existed only as Chirp3-HD. **Live check of
`GET /v1/voices` (2066 voices total) proved otherwise:**

- **uk-UA**: Chirp3-HD (30 voices) **+ Standard-B (F) + Wavenet-B (F)**
- **ru-RU**: Chirp3-HD (8) **+ Standard A–E (F/M/F/M/F) + Wavenet A–E (F/M/F/M/F)**

Therefore the whole feature runs on the **WaveNet free family** — no Chirp3-HD
is used, and the ONLY-FREE rule is satisfied with a comfortable margin.

## Hard free-safety cap

`CloudTTS` enforces `MAX_CHARS_FREE_PER_MONTH` = **900,000 chars** (default,
Wavenet-family safety margin under the 1M free allowance; override via env
`TTS_MONTHLY_CHAR_CAP`). Behavior:

- Monthly counter persisted at `data/tts-usage.json` → `{ "month": "2026-09", "chars": N }`
  (resets automatically on month rollover).
- A synthesis request whose `charCount` would exceed the cap is **refused
  before any API call** — it never silently spends money. The refusal result
  carries `overCap: true` + a clear `PAY-PER-CHAR after cap: US$16 per 1M
  chars (WaveNet)` label, and callers fall back to browser TTS.
- Chirp3-HD / paid-family voices are never selected by defaults; if someone
  explicitly configures one via `TTS_VOICE_EVA` / `TTS_VOICE_ADAM`, the same
  cap logic applies and the pay-per-char note is included in errors/status.

## Chosen voices (verified from live /v1/voices, genders confirmed)

| Persona | Voice | Gender | Family / free tier |
|---------|-------|--------|--------------------|
| Ева (eva) | `uk-UA-Wavenet-B` | FEMALE | WaveNet — 1M chars/mo free |
| Адам (adam) | `ru-RU-Wavenet-D` | MALE | WaveNet — 1M chars/mo free |

Env overrides: `TTS_VOICE_EVA`, `TTS_VOICE_ADAM`, `TTS_MONTHLY_CHAR_CAP`
(see `src/core/Config.ts`).

## Architecture

- `src/core/CloudTTS.ts` — synthesis, monthly counter, disk cache
  (`data/tts-cache/<sha1(text+voice)>.mp3`), 10 s timeout via
  `Resilience.withTimeout`, never throws into the chat flow (failures resolve
  `{ ok: false, error }`).
- `src/server/routes/VoiceRouter.ts` — HTTP surface, registered in
  `src/server/server.ts` sub-routers.
- `public/index.html` `VoiceEngine.speak()` — tries cloud TTS first
  (persona persisted in `evabot_tts_persona`), falls back to the existing
  browser `speechSynthesis` on failure/over-cap; persona pitch/rate tuning
  applies only to the browser fallback.
- `src/cli/terminal-chat.ts` — `/say` command.

## Endpoints

### POST /api/tts

Request: `{ "text": "...", "persona": "eva" | "adam", "lang": "uk-UA" }`

Success (200):

```json
{ "ok": true, "audioBase64": "//OE…", "mimeType": "audio/mp3",
  "voice": "uk-UA-Wavenet-B", "charCount": 14, "cached": false,
  "charsLeftThisMonth": 899986 }
```

Failure / over-cap (still HTTP 200, so the web client falls back cleanly):

```json
{ "ok": false, "voice": "…", "charCount": 30, "overCap": true,
  "payPerCharAfterCap": true, "charsLeftThisMonth": 0,
  "fallback": "browser-tts", "error": "Monthly free cap (900000 chars) reached. …" }
```

### GET /api/tts/status

```json
{ "voicesReady": true, "monthChars": 14, "cap": 900000, "remainingChars": 899986,
  "evaVoice": "uk-UA-Wavenet-B", "adamVoice": "ru-RU-Wavenet-D",
  "family": "wavenet",
  "freeTier": "WaveNet: 1,000,000 chars/month free (verified 2026-09, cloud.google.com/text-to-speech/pricing)",
  "payPerCharNote": "PAY-PER-CHAR after cap: US$16 per 1M chars (WaveNet)" }
```

## CLI usage

```
/say <text>      # synthesize → /tmp/evabot-say.mp3, prints path + size + chars left
/скажи <текст>   # alias (uk)
/сказать <текст> # alias (ru)
```

Output example:

```
✔ Аудио сохранено: /tmp/evabot-say.mp3 (12.4 KB)
  Голос: uk-UA-Wavenet-B | символов: 30 | осталось символов в этом месяце: 899970
```

## Setup

1. APIs already enabled on project `evabot-agent-server` (Text-to-Speech API).
2. Auth: handled automatically by `GoogleAuthProvider` (user-ADC refresh
   token at `~/.config/gcloud/legacy_credentials/evabot.online@gmail.com/adc.json`).
   The `X-Goog-User-Project: evabot-agent-server` header routes quota/billing
   to that project.
3. No build/restart was performed during implementation; deploy via the
   normal flow (`deploy-sync.sh`) when ready.
4. Tests: `tests/cloudtts.test.ts` (registered in `tests/index.ts`), fully
   mocked — no live API calls.

## References

- Pricing: https://cloud.google.com/text-to-speech/pricing (Chirp 3: HD free
  tier & per-char prices verified 2026-09)
- Voice list: https://cloud.google.com/text-to-speech/docs/list-voices-and-types
- API reference: https://cloud.google.com/text-to-speech/docs/reference/rest/v1/text/synthesize
