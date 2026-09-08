import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CatalogStore, fetchHealth, streamChat } from './api';
import type { ModelsPayload } from './models';

const MOCK_PAYLOAD: ModelsPayload = {
  models: [
    {
      id: 'gemini-2.5-flash',
      name: 'Gemini 2.5 Flash',
      provider: 'google',
      category: 'fast',
      description: '',
      codingStrengths: '',
      contextWindow: 1048576,
      maxOutputTokens: 65536,
      recommended: true,
      tier: 'free',
      protocol: 'genai',
      pricing: {
        freeTierStatus: '100% Free Quota Available',
        freeTierDetails: '',
        inputPer1MTokensUSD: '0.00',
        outputPer1MTokensUSD: '0.00',
        inputPer1MTokensEUR: '0.00',
        outputPer1MTokensEUR: '0.00',
      },
    },
    {
      id: 'claude-opus-5',
      name: 'Claude Opus 5',
      provider: 'anthropic',
      category: 'reasoning',
      description: '',
      codingStrengths: '',
      contextWindow: 204800,
      maxOutputTokens: 32768,
      recommended: false,
      tier: 'paid',
      protocol: 'openrouter',
      pricing: {
        freeTierStatus: 'Paid',
        freeTierDetails: '',
        inputPer1MTokensUSD: '15.00',
        outputPer1MTokensUSD: '75.00',
        inputPer1MTokensEUR: '14.00',
        outputPer1MTokensEUR: '70.00',
      },
    },
  ],
  categories: ['fast', 'reasoning'],
  defaultModel: 'gemini-2.5-flash',
};

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

describe('CatalogStore', () => {
  beforeEach(() => {
    resetCatalogStore();
  });
  it('loads the catalog once and exposes accessors', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonOkResponse(MOCK_PAYLOAD));
    vi.stubGlobal('fetch', fetchMock);

    await CatalogStore.load();
    await CatalogStore.load();

    expect(CatalogStore.isLoaded()).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/models');
    expect(CatalogStore.getAll()).toHaveLength(2);
    expect(CatalogStore.getCategories()).toEqual(['fast', 'reasoning']);
    expect(CatalogStore.getDefault()).toBe('gemini-2.5-flash');
  });

  it('finds models by id and by category', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonOkResponse(MOCK_PAYLOAD)),
    );
    await CatalogStore.load();

    expect(CatalogStore.getById('claude-opus-5')?.provider).toBe('anthropic');
    expect(CatalogStore.getById('missing-model')).toBeUndefined();
    expect(CatalogStore.getByCategory('fast')).toHaveLength(1);
  });

  it('returns empty array when fetchTopModels gets a failed response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false } as unknown as Response),
    );
    const result = await CatalogStore.fetchTopModels('top10_free');
    expect(result).toEqual([]);
  });

  it('survives a network failure and stays unloaded', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('backend offline')),
    );
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    await CatalogStore.load();
    expect(CatalogStore.isLoaded()).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
  });
});

describe('fetchHealth', () => {
  it('returns payload on ok response', async () => {
    const health = { status: 'ok', version: '0.0.1' };
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(jsonOkResponse(health)),
    );
    expect(await fetchHealth()).toEqual(health);
  });

  it('returns null when the backend is unreachable', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    expect(await fetchHealth()).toBeNull();
  });
});

describe('streamChat', () => {
  function sseResponse(chunks: string[]): Response {
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        for (const chunk of chunks) {
          controller.enqueue(encoder.encode(chunk));
        }
        controller.close();
      },
    });
    return {
      ok: true,
      body,
    } as unknown as Response;
  }

  it('parses SSE chunks, accumulates text and delivers final usage and cost', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        sseResponse([
          'data: {"chunk":"Hello"}\n',
          'data: {"chunk":" world"}\n\n',
          'data: {"usage":{"promptTokens":10,"completionTokens":5,"totalTokens":15}}\n',
          'data: {"cost":{"formattedUSD":"$0.0001","formattedEUR":"€0.0001"}}\n',
          'data: {"done":true,"fullText":"Hello world"}\n',
        ]),
      ),
    );

    const chunks: string[] = [];
    let doneText = '';
    let usage: unknown;
    let cost: unknown;
    await streamChat(
      {
        message: 'hi',
        model: 'gemini-2.5-flash',
        persona: 'eva',
        role: 'general_assistant',
        lang: 'en',
        db: 'ephemeral',
        mode: 'chat',
      },
      {
        onChunk: (text) => chunks.push(text),
        onError: () => {},
        onDone: (text, u, c) => {
          doneText = text;
          usage = u;
          cost = c;
        },
      },
      new AbortController().signal,
    );

    expect(chunks).toEqual(['Hello', 'Hello world']);
    expect(doneText).toBe('Hello world');
    expect(usage).toEqual({
      promptTokens: 10,
      completionTokens: 5,
      totalTokens: 15,
    });
    expect(cost).toEqual({
      formattedUSD: '$0.0001',
      formattedEUR: '€0.0001',
    });
  });

  it('reports errors from the stream as onError events', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        sseResponse([
          'data: {"chunk":"partial"}\n',
          'data: {"error":"quota exceeded"}\n\n',
          'data: {"done":true,"fullText":"partial\\n\\n[Error: quota exceeded]"}\n',
        ]),
      ),
    );

    const errors: string[] = [];
    let doneText = '';
    await streamChat(
      {
        message: 'hi',
        model: 'gemini-2.5-flash',
        persona: 'eva',
        role: 'general_assistant',
        lang: 'en',
        db: 'ephemeral',
        mode: 'chat',
      },
      {
        onChunk: () => {},
        onError: (message) => errors.push(message),
        onDone: (text) => {
          doneText = text;
        },
      },
      new AbortController().signal,
    );

    expect(errors).toEqual(['quota exceeded']);
    expect(doneText).toContain('[Error: quota exceeded]');
  });

  it('throws a descriptive error for a non-ok response', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(errorResponse(404, { error: 'model not found' })),
    );
    await expect(
      streamChat(
        {
          message: 'hi',
          model: 'unknown-model',
          persona: 'eva',
          role: 'general_assistant',
          lang: 'en',
          db: 'ephemeral',
          mode: 'chat',
        },
        { onChunk: () => {}, onError: () => {}, onDone: () => {} },
        new AbortController().signal,
      ),
    ).rejects.toThrow('model not found');
  });
});
