# EvaBot Frontend — Testing Guide

Unit testing stack for the `frontend/` Vite + TypeScript workspace. Introduced for
KANBAN TASK-324 (frontend coverage was 0%, no test runner at all).

## Stack

| Tool | Purpose |
|---|---|
| vitest | Test runner (Vite-native, zero extra config for TS) |
| @vitest/coverage-v8 | Code coverage via the V8 provider |
| jsdom | Browser-like test environment (localStorage, DOM) |

## Running

All commands run inside `frontend/`:

```bash
npm run test            # single run, watch mode off
npm run test:coverage   # single run + V8 coverage report
npx vitest              # watch mode during development
npx vitest run src/ansi.test.ts   # a single file
```

TypeScript is type-checked separately (`npm run build` runs `tsc --noEmit`);
test files are included in that check.

## Configuration

`frontend/vitest.config.ts`:

- `environment: 'jsdom'` — every test file runs in a simulated browser
  (localStorage, `TextEncoder`, `ReadableStream` are available).
- `include: ['src/**/*.test.ts', 'tests/**/*.test.ts']` — tests live next to
  the source or under `frontend/tests/`.
- Coverage: provider `v8`, `include: ['src/**/*.ts']`,
  `exclude: ['**/*.d.ts', 'src/main.ts']` (entry point has no logic).

## What is covered

| Module | Status | Notes |
|---|---|---|
| `src/ansi.test.ts` | 16 tests | Pure ANSI engine: `stripAnsi`, `visibleWidth` (CJK/emoji double-width), `padEndVisible`/`padStartVisible`, `escapeHtml`, `toHtml` (SGR-to-inline-style mapping, span close on reset, unknown code dropping), `trafficLightIcon`, `renderTerminalTable` (layout, widths, format callbacks), `renderError`, `renderNotice`. |
| `src/api.test.ts` | 9 tests | Network layer with `vi.stubGlobal('fetch', ...)` and mocked `ReadableStream` SSE bodies: `CatalogStore` (load-once semantics, accessors, failure resilience), `fetchHealth` (ok + offline), `streamChat` (SSE chunk accumulation, usage/cost delivery, in-stream error events, non-ok HTTP error). |
| `src/onboarding.test.ts` | 6 tests | `OnboardingHandler` against jsdom localStorage: first-step render, step advance + persistence, auto-skip of configured steps, action execution, completion flag (`STORAGE_DONE`), `isDone()`/`reset()`. |

Total: 3 files, 31 tests, all passing.

## Baseline coverage (first run, `npm run test:coverage`)

| File | Stmts | Branch | Funcs | Lines |
|---|---|---|---|---|
| `src/ansi.ts` | 40.51% | 27.58% | 40% | 40.27% |
| `src/api.ts` | 60.65% | 53.7% | 54.54% | 62.26% |
| `src/onboarding.ts` | 71.26% | 84.61% | 62.5% | 74.39% |
| `src/app.ts` | 0% | 0% | 0% | 0% |
| `src/voice/*` | 0% | 0% | 0% | 0% |
| **All files** | **10.31%** | **7.02%** | **18.18%** | **10.64%** |

## Modules intentionally not tested (and why)

- `src/models.ts`, `src/voice/GeminiLiveProtocol.ts` — TypeScript type and
  interface declarations only; zero runtime logic to assert.
- `src/app.ts` (2337 lines) — the terminal controller is hard-coupled to the
  DOM, localStorage and network side effects. Testing it requires component-level
  tooling (see next steps), not unit tests. Skipped instead of refactored.
- `src/main.ts` — empty entry point, excluded from coverage by config.
- `src/voice/*` UI/client modules (`VoiceDockUI`, `GeminiLiveClient`,
  `AudioPCMStreamer`, `VoiceVisualizer`) — depend on WebAudio, WebSocket and
  canvas APIs; candidates for future integration tests with heavy mocking.

## Conventions

- Test files are colocated with sources (`src/*.test.ts`) or placed in
  `frontend/tests/`.
- No emojis in test names.
- Network is always mocked with `vi.stubGlobal('fetch', ...)` +
  `vi.unstubAllGlobals()` in `afterEach`; static singletons (e.g. `CatalogStore`)
  are reset between tests via a `beforeEach` helper.
- Assertion style: narrow union types (`OnboardingView`) with `kind` checks
  before accessing variant-specific properties so `tsc --noEmit` stays clean.

## Next steps

1. **Component tests** — `app.ts` and `src/voice/VoiceDockUI.ts` need DOM-level
   testing. Add `@testing-library/dom` (or `happy-dom` + query helpers), extract
   small render helpers from `app.ts` where possible, and test status-bar /
   deck / dialog rendering against fixture ANSI strings.
2. **Voice protocol tests** — `GeminiLiveClient` can be tested with a mocked
   `WebSocket` transport asserting the JSON message shapes from
   `GeminiLiveProtocol.ts` (setup / realtimeInput / serverContent handling).
3. **E2E** — Playwright against `npm run preview` (or the dev server), covering
   the boot sequence, chat streaming and the onboarding funnel end to end.
4. **CI gate** — once the meaningful-code coverage (`ansi.ts`, `api.ts`,
   `onboarding.ts` + future component tests) exceeds a threshold, wire
   `npm run test:coverage` into CI with `--coverage.thresholds` in
   `vitest.config.ts`.
