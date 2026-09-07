import { GeminiClient, ChatMessage } from '../src/core/GeminiClient.js';
import { GoogleAuthProvider, DEFAULT_GEMINI_API_KEY } from '../src/core/GoogleAuthProvider.js';
import { Config } from '../src/core/Config.js';
import { UniversalLlmClient } from '../src/core/UniversalLlmClient.js';
import { getBreaker } from '../src/core/Resilience.js';

/**
 * Gemini routing matrix tests — ONLY-FREE policy.
 *
 * Verifies that:
 *  - GEMINI_API_KEY env (Config) → generativelanguage?key= (free tier)
 *  - no env → DEFAULT_GEMINI_API_KEY fallback (free tier)
 *  - Vertex (paid) is OFF by default; only reachable via EVA_VERTEX_ENABLED=1
 *    (bearer from GoogleAuthProvider) or an explicitly set bearer token
 *  - key path never sends Authorization or X-Goog-User-Project
 *  - 429 from generativelanguage → thrown error → breaker recordFailure event
 */

const OK_BODY = { candidates: [{ content: { parts: [{ text: 'ok' }] } }] };

interface CapturedCall {
  url: string;
  headers: Record<string, string>;
}

const originalFetch = globalThis.fetch;
let captured: CapturedCall[] = [];
let responder: (url: string) => { status: number; body?: any; sse?: string } = () => ({ status: 200, body: OK_BODY });

function installFetchMock(): void {
  (globalThis as any).fetch = async (url: any, init: any = {}) => {
    const headers: Record<string, string> = {};
    if (init && init.headers) {
      for (const [k, v] of Object.entries(init.headers)) headers[k.toLowerCase()] = String(v);
    }
    captured.push({ url: String(url), headers });
    const r = responder(String(url));
    if (r.sse !== undefined) {
      const stream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(r.sse!));
          controller.close();
        },
      });
      return new Response(stream, { status: r.status, headers: { 'content-type': 'text/event-stream' } });
    }
    return new Response(JSON.stringify(r.body ?? {}), { status: r.status, headers: { 'content-type': 'application/json' } });
  };
}

function restoreFetch(): void {
  globalThis.fetch = originalFetch;
  captured = [];
}

function withConfig(overrides: { geminiApiKey?: string; vertexEnabled?: boolean }, fn: () => Promise<void>): Promise<void> {
  const savedKey = Config.geminiApiKey;
  const savedVertex = Config.vertexEnabled;
  if (overrides.geminiApiKey !== undefined) (Config as any).geminiApiKey = overrides.geminiApiKey;
  if (overrides.vertexEnabled !== undefined) (Config as any).vertexEnabled = overrides.vertexEnabled;
  return fn().finally(() => {
    (Config as any).geminiApiKey = savedKey;
    (Config as any).vertexEnabled = savedVertex;
  });
}

/** Traps ambient credential resolution — key-path tests must NEVER hit ADC. */
function trapGetCredentials(): () => void {
  const orig = GoogleAuthProvider.getCredentials;
  (GoogleAuthProvider as any).getCredentials = async () => {
    throw new Error('TRAP: getCredentials must not be called on the free-tier key path');
  };
  return () => {
    (GoogleAuthProvider as any).getCredentials = orig;
  };
}

const SAMPLE_MSGS: ChatMessage[] = [{ role: 'user', parts: [{ text: 'ping' }] }];

export async function runGeminiRoutingTests(): Promise<boolean> {
  console.log('\n--- Running Gemini Routing Matrix Tests (ONLY-FREE policy) ---');
  let passed = true;

  function assert(cond: boolean, msg: string) {
    if (cond) {
      console.log(`  ✓ ${msg}`);
    } else {
      console.error(`  ✗ FAIL: ${msg}`);
      passed = false;
    }
  }

  // ── 1. Explicit GEMINI_API_KEY (via Config) → generativelanguage?key= ──
  await withConfig({ geminiApiKey: 'TEST-ENV-KEY-123', vertexEnabled: false }, async () => {
    installFetchMock();
    const untrap = trapGetCredentials();
    try {
      const client = new GeminiClient(); // no explicit token → ambient resolution
      const out = await client.generateContent('gemini-2.5-flash', SAMPLE_MSGS);
      const call = captured[0];
      assert(out === 'ok', 'Env key path returns model text');
      assert(call.url.startsWith('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=TEST-ENV-KEY-123'),
        'Env key routes to generativelanguage with ?key= (free tier)');
      assert(!('authorization' in call.headers), 'Key path sends NO Authorization bearer header');
      assert(!('x-goog-user-project' in call.headers), 'Key path sends NO X-Goog-User-Project header');
      assert(call.headers['x-goog-api-key'] === 'TEST-ENV-KEY-123', 'Key path authenticates via x-goog-api-key header');
    } catch (e: any) {
      assert(false, `Env key path threw: ${e.message}`);
    } finally {
      untrap();
      restoreFetch();
    }
  });

  // ── 2. No env key → DEFAULT_GEMINI_API_KEY fallback (free tier) ──
  await withConfig({ geminiApiKey: '', vertexEnabled: false }, async () => {
    installFetchMock();
    const untrap = trapGetCredentials();
    try {
      const client = new GeminiClient();
      await client.generateContent('gemini-2.5-flash', SAMPLE_MSGS);
      const call = captured[0];
      assert(call.url.includes(`?key=${DEFAULT_GEMINI_API_KEY}`), 'Missing env falls back to DEFAULT_GEMINI_API_KEY');
      assert(call.url.startsWith('https://generativelanguage.googleapis.com/'), 'Default-key path stays on generativelanguage (free)');
    } catch (e: any) {
      assert(false, `Default-key path threw: ${e.message}`);
    } finally {
      untrap();
      restoreFetch();
    }
  });

  // ── 3. Regression: client seeded with the DEFAULT key must NOT skip it ──
  // (old setApiKey() ignored the embedded literal and fell through to ADC bearer → paid Vertex)
  await withConfig({ geminiApiKey: DEFAULT_GEMINI_API_KEY, vertexEnabled: false }, async () => {
    installFetchMock();
    const untrap = trapGetCredentials();
    try {
      const client = new GeminiClient(DEFAULT_GEMINI_API_KEY); // what UniversalLlmClient/ChatRouter seed
      await client.generateContent('gemini-2.5-flash', SAMPLE_MSGS);
      const call = captured[0];
      assert(call.url.includes('generativelanguage.googleapis.com'), 'Default literal passed via setApiKey routes to generativelanguage (was silently dropped before)');
    } catch (e: any) {
      assert(false, `Default literal via setApiKey threw: ${e.message}`);
    } finally {
      untrap();
      restoreFetch();
    }
  });

  // ── 4. Vertex OFF by default (no EVA_VERTEX_ENABLED) ──
  await withConfig({ geminiApiKey: 'TEST-ENV-KEY-123', vertexEnabled: false }, async () => {
    installFetchMock();
    const untrap = trapGetCredentials();
    try {
      const client = new UniversalLlmClient(); // production construction path
      await client.generateContent('gemini-2.5-flash', 'hello');
      const call = captured[0];
      assert(!call.url.includes('aiplatform.googleapis.com'), 'Default config never targets Vertex AI endpoints');
      assert(!('authorization' in call.headers), 'Default config never sends paid bearer tokens');
      assert(call.url.includes('/models/gemini-2.5-flash:generateContent'), 'Model id resolution unchanged for run-evaline-consilium style ids');
    } catch (e: any) {
      assert(false, `Vertex-off test threw: ${e.message}`);
    } finally {
      untrap();
      restoreFetch();
    }
  });

  // ── 5. EVA_VERTEX_ENABLED=1 → Vertex bearer (explicit paid opt-in) ──
  await withConfig({ geminiApiKey: 'TEST-ENV-KEY-123', vertexEnabled: true }, async () => {
    installFetchMock();
    const orig = GoogleAuthProvider.getCredentials;
    (GoogleAuthProvider as any).getCredentials = async () => ({
      token: 'ya29.MOCKTOKEN', type: 'bearer', source: 'mock ADC', account: 'mock',
    });
    try {
      const client = new GeminiClient(); // NOT seeded with a key → env opt-in honored
      await client.generateContent('gemini-2.5-flash', SAMPLE_MSGS);
      const call = captured[0];
      assert(call.url.startsWith('https://europe-west3-aiplatform.googleapis.com/v1/projects/evabot-agent-server/locations/europe-west3/publishers/google/models/gemini-2.5-flash:generateContent'),
        'EVA_VERTEX_ENABLED=1 routes to Vertex AI (explicit paid opt-in)');
      assert(call.headers['authorization'] === 'Bearer ya29.MOCKTOKEN', 'Vertex path uses bearer token');
      assert(!call.url.includes('key='), 'Vertex path carries no API key');
    } catch (e: any) {
      assert(false, `Vertex opt-in test threw: ${e.message}`);
    } finally {
      (GoogleAuthProvider as any).getCredentials = orig;
      restoreFetch();
    }
  });

  // ── 6. Explicit bearer token = request-level Vertex opt-in ──
  await withConfig({ geminiApiKey: 'TEST-ENV-KEY-123', vertexEnabled: false }, async () => {
    installFetchMock();
    const untrap = trapGetCredentials();
    try {
      const client = new GeminiClient('ya29.EXPLICIT');
      await client.generateContent('gemini-2.5-flash', SAMPLE_MSGS);
      const call = captured[0];
      assert(call.url.includes('-aiplatform.googleapis.com'), 'Explicit ya29 bearer token opts request into Vertex');
      assert(call.headers['authorization'] === 'Bearer ya29.EXPLICIT', 'Explicit bearer used as Authorization');
    } catch (e: any) {
      assert(false, `Explicit bearer test threw: ${e.message}`);
    } finally {
      untrap();
      restoreFetch();
    }
  });

  // ── 7. Streaming key path: SSE URL + no project-billing header ──
  await withConfig({ geminiApiKey: 'TEST-ENV-KEY-123', vertexEnabled: false }, async () => {
    installFetchMock();
    const untrap = trapGetCredentials();
    try {
      responder = () => ({
        status: 200,
        sse: 'data: {"candidates":[{"content":{"parts":[{"text":"hello"}]}}]}\n\n',
      });
      const client = new GeminiClient();
      let chunked = '';
      const out = await client.streamContent('gemini-2.5-flash', SAMPLE_MSGS, (c) => { chunked += c; });
      const call = captured[0];
      assert(out === 'hello' && chunked === 'hello', 'Streaming key path delivers SSE chunks');
      assert(call.url.includes(':streamGenerateContent?alt=sse&key=TEST-ENV-KEY-123'), 'Stream routes to generativelanguage SSE with ?key=');
      assert(!('x-goog-user-project' in call.headers) && !('authorization' in call.headers), 'Stream key path sends no bearer / no X-Goog-User-Project');
    } catch (e: any) {
      assert(false, `Stream test threw: ${e.message}`);
    } finally {
      responder = () => ({ status: 200, body: OK_BODY });
      untrap();
      restoreFetch();
    }
  });

  // ── 8. 429 from generativelanguage → error → breaker event (fallback to free omniroute models) ──
  await withConfig({ geminiApiKey: 'TEST-ENV-KEY-123', vertexEnabled: false }, async () => {
    installFetchMock();
    responder = () => ({ status: 429, body: { error: { message: 'Resource has been exhausted (e.g. check quota)' } } });
    const breaker = getBreaker('google');
    breaker.recordSuccess(); // zero out state from other suites
    const savedThreshold = breaker.openThreshold;
    breaker.openThreshold = 1; // open on first 429 for test speed
    try {
      const client = new UniversalLlmClient(); // seeds free-tier key, vertex off
      let gotErr: any = null;
      try {
        await client.generateContent('gemini-2.5-flash', 'ping', {}, false); // no fallback: isolate attempt
      } catch (e: any) {
        gotErr = e;
      }
      assert(Boolean(gotErr) && gotErr.message.includes('429'), '429 surfaces as thrown error (contains status 429)');
      assert(breaker.snapshot().consecutiveFailures >= 1, '429 recorded as breaker failure (recordFailure)');
      // Now a follow-up call must be blocked by the open breaker — routing to
      // the ranked fallback chain (omniroute free models) instead of retrying.
      let blocked: any = null;
      try {
        await client.generateContent('gemini-2.5-flash', 'ping', {}, false);
      } catch (e: any) {
        blocked = e;
      }
      assert(Boolean(blocked) && blocked.message.includes('CIRCUIT_OPEN'), 'Open breaker blocks further google attempts → fallback chain handles failover');
    } finally {
      breaker.openThreshold = savedThreshold;
      breaker.recordSuccess();
      responder = () => ({ status: 200, body: OK_BODY });
      restoreFetch();
    }
  });

  console.log('--- Gemini Routing Matrix Tests done ---\n');
  return passed;
}
