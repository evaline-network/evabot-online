import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CatalogStore,
  fetchAppConfig,
  fetchBootBannerText,
  fetchBootDiagnostics,
  fetchVoiceConfig,
  runConsilium,
  setServerDevMode,
  toggleVoicePlugin,
} from './api';
import type { AppConfig, BootReport, VoiceConfigPayload } from './models';

function jsonOkResponse(body: unknown): Response {
  return {
    ok: true,
    json: async () => body,
  } as unknown as Response;
}

function errorResponse(status: number, body: unknown): Response {
  return {
    ok: false,
    status,
    json: async () => body,
  } as unknown as Response;
}

function resetCatalogStore(): void {
  const store = CatalogStore as unknown as Record<string, unknown>;
  store.models = [];
  store.categories = [];
  store.defaultModel = 'gemini-2.5-flash';
  store.loaded = false;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

beforeEach(() => {
  resetCatalogStore();
});

describe('fetchAppConfig', () => {
  it('returns the parsed config on ok', async () => {
    const cfg: AppConfig = {
      productName: 'EvaBot Online',
      version: '0.0.1',
      server: 'node',
      base: 'UA',
      localePolicy: { currencies: ['USD', 'EUR'], financialStandard: 'USD/EUR' },
      devMode: false,
      defaultModel: 'gemini-2.5-flash',
      availableModels: 2,
      supportedProviders: ['google'],
      voice: { enabled: false, activePersona: 'auto' },
      commands: [],
    };
    const fetchMock = vi.fn().mockResolvedValue(jsonOkResponse(cfg));
    vi.stubGlobal('fetch', fetchMock);
    expect(await fetchAppConfig()).toEqual(cfg);
    expect(fetchMock).toHaveBeenCalledWith('/api/config');
  });

  it('returns null on network failure and logs a warning', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(await fetchAppConfig()).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
  });
});

describe('setServerDevMode', () => {
  it('posts the toggle and returns the server-reported state', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonOkResponse({ devMode: true }));
    vi.stubGlobal('fetch', fetchMock);
    expect(await setServerDevMode(true)).toBe(true);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({ enabled: true });
  });

  it('returns false when the server responds non-ok', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(errorResponse(500, { devMode: true })));
    expect(await setServerDevMode(false)).toBe(false);
  });

  it('returns false when the request throws', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(await setServerDevMode(true)).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
  });
});

describe('fetchBootBannerText', () => {
  it('returns banner content when present', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonOkResponse({ type: 'banner', content: 'EVA IS ONLINE', generatedAt: 'now' })),
    );
    expect(await fetchBootBannerText()).toBe('EVA IS ONLINE');
  });

  it('returns null for empty content and non-ok responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonOkResponse({ type: 'banner', content: '', generatedAt: 'now' })));
    expect(await fetchBootBannerText()).toBeNull();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(errorResponse(404, {})));
    expect(await fetchBootBannerText()).toBeNull();
  });

  it('returns null on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(await fetchBootBannerText()).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
  });
});

describe('fetchBootDiagnostics', () => {
  const report: BootReport = {
    timestamp: '2026-01-01T00:00:00Z',
    activeModel: 'gemini-2.5-flash',
    version: '0.0.1',
    steps: [{ name: 'db', status: 'success', latencyMs: 5, details: 'ok' }],
    totalDurationMs: 5,
    passed: 1,
    skipped: 0,
    failed: 0,
  };

  it('returns the boot report and encodes the model in the URL', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonOkResponse(report));
    vi.stubGlobal('fetch', fetchMock);
    expect(await fetchBootDiagnostics('gemini 2.5 flash')).toEqual(report);
    expect(fetchMock).toHaveBeenCalledWith('/api/diagnostics/boot?model=gemini%202.5%20flash');
  });

  it('returns null on failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(await fetchBootDiagnostics('m')).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
  });
});

describe('fetchVoiceConfig', () => {
  const voiceCfg: VoiceConfigPayload = {
    enabled: true,
    model: 'gemini-2.5-flash',
    endpoint: 'wss://x',
    activePersona: 'eva',
    sampleRateInput: 16000,
    sampleRateOutput: 24000,
    apiKey: '',
    systemInstruction: '',
    voiceName: 'Aoede',
    personas: {},
  };

  it('returns the voice config on ok', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonOkResponse(voiceCfg));
    vi.stubGlobal('fetch', fetchMock);
    expect(await fetchVoiceConfig()).toEqual(voiceCfg);
    expect(fetchMock).toHaveBeenCalledWith('/api/voice/config');
  });

  it('returns null on non-ok and network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(errorResponse(503, {})));
    expect(await fetchVoiceConfig()).toBeNull();
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(await fetchVoiceConfig()).toBeNull();
    expect(warnSpy).toHaveBeenCalled();
  });
});

describe('toggleVoicePlugin', () => {
  it('posts the toggle and resolves even when fetch rejects', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonOkResponse({ ok: true }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(toggleVoicePlugin(true)).resolves.toBeUndefined();
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body))).toEqual({ enabled: true });

    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(toggleVoicePlugin(false)).resolves.toBeUndefined();
  });
});

describe('runConsilium', () => {
  const payload = {
    prompt: 'review the plan',
    mode: 'consilium',
    persona: 'dual' as const,
    participants: 5,
    useKnowledgeBase: true,
  };

  it('posts the payload and unwraps data.result', async () => {
    const result = { consensus: 'approved' };
    const fetchMock = vi.fn().mockResolvedValue(jsonOkResponse({ result }));
    vi.stubGlobal('fetch', fetchMock);
    expect(await runConsilium(payload, new AbortController().signal)).toEqual(result);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('/api/consilium');
    expect(init.method).toBe('POST');
    expect(JSON.parse(String(init.body)).prompt).toBe('review the plan');
    expect(JSON.parse(String(init.body)).participants).toBe(5);
  });

  it('throws the server error message for non-ok responses', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(errorResponse(400, { error: 'no participants' })));
    await expect(runConsilium(payload, new AbortController().signal)).rejects.toThrow('no participants');
  });

  it('falls back to a generic message for malformed error bodies', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error('bad json');
        },
      } as unknown as Response),
    );
    await expect(runConsilium(payload, new AbortController().signal)).rejects.toThrow('Consilium execution failed');
  });
});

describe('CatalogStore extras', () => {
  it('fetchTopModels returns models on ok and requests the scope', async () => {
    const models = [{ id: 'a', name: 'A' }];
    const fetchMock = vi.fn().mockResolvedValue(jsonOkResponse({ models }));
    vi.stubGlobal('fetch', fetchMock);
    expect(await CatalogStore.fetchTopModels('top10_paid')).toEqual(models);
    expect(fetchMock).toHaveBeenCalledWith('/api/models?scope=top10_paid');
  });

  it('fetchTopModels swallows network failures', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(await CatalogStore.fetchTopModels('top10_free')).toEqual([]);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('getByCategory and getById operate on an empty catalog without errors', () => {
    expect(CatalogStore.getByCategory('any')).toEqual([]);
    expect(CatalogStore.getById('nope')).toBeUndefined();
    expect(CatalogStore.getDefault()).toBe('gemini-2.5-flash');
  });

  it('load adopts a custom defaultModel from the payload', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        jsonOkResponse({ models: [], categories: [], defaultModel: 'custom-default' }),
      ),
    );
    await CatalogStore.load();
    expect(CatalogStore.getDefault()).toBe('custom-default');
    expect(CatalogStore.isLoaded()).toBe(true);
  });

  it('load keeps the previous default when payload omits one', async () => {
    resetCatalogStore();
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonOkResponse({ models: [], categories: [] })));
    await CatalogStore.load();
    expect(CatalogStore.getDefault()).toBe('gemini-2.5-flash');
  });
});
