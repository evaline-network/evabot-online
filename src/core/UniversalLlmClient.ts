import { GeminiClient, ChatMessage, GenerationOptions } from './GeminiClient.js';
import { Config } from './Config.js';
import { logger } from './Logger.js';

export type LlmProvider = 'google' | 'omniroute' | 'openrouter' | 'opencode';

export interface UniversalMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface UniversalGenerationOptions {
  temperature?: number;
  maxOutputTokens?: number;
  systemInstruction?: string;
  provider?: LlmProvider;
  apiKey?: string;
  signal?: AbortSignal;
}

export class UniversalLlmClient {
  private geminiClient: GeminiClient;

  constructor(apiKeyOrToken?: string) {
    this.geminiClient = new GeminiClient(apiKeyOrToken || Config.geminiApiKey || undefined);
  }

  /**
   * Automatically resolves provider based on model name or explicit option
   */
  public resolveProvider(model: string, explicitProvider?: LlmProvider): LlmProvider {
    if (explicitProvider) {
      return explicitProvider;
    }

    const m = model.toLowerCase();
    if (m.startsWith('omniroute/')) {
      return 'omniroute';
    }
    if (m.startsWith('opencode/')) {
      return 'opencode';
    }
    if (
      m.startsWith('openrouter/') ||
      m.endsWith(':free') ||
      m.includes('deepseek-r1:free') ||
      m.includes('llama-3.3-70b:free') ||
      m.includes('gemini-2.0-flash-exp:free')
    ) {
      return 'openrouter';
    }

    return 'google';
  }

  /**
   * Normalizes input messages from either ChatMessage[] or UniversalMessage[] or string
   */
  public normalizeToUniversal(
    input: string | UniversalMessage[] | ChatMessage[]
  ): UniversalMessage[] {
    if (typeof input === 'string') {
      return [{ role: 'user', content: input }];
    }

    if (!Array.isArray(input) || input.length === 0) {
      return [];
    }

    // Check if it's ChatMessage[]
    if ('parts' in input[0]) {
      const chatMsgs = input as ChatMessage[];
      return chatMsgs.map((m) => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.parts.map((p) => p.text || '').join('\n'),
      }));
    }

    return input as UniversalMessage[];
  }

  /**
   * Converts UniversalMessage[] to Gemini ChatMessage[] and extracts system prompt
   */
  public toGeminiFormat(
    messages: UniversalMessage[],
    defaultSystem?: string
  ): { contents: ChatMessage[]; systemInstruction?: string } {
    let systemInstruction = defaultSystem;
    const contents: ChatMessage[] = [];

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemInstruction = systemInstruction ? `${systemInstruction}\n${msg.content}` : msg.content;
      } else {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
    }

    return { contents, systemInstruction };
  }

  /**
   * Strips provider prefixes like 'omniroute/' or 'opencode/' or 'openrouter/' for upstream payload if needed
   */
  private cleanModelId(model: string, provider: LlmProvider): string {
    if (provider === 'omniroute' && model.startsWith('omniroute/')) {
      return model.replace('omniroute/', '');
    }
    if (provider === 'opencode' && model.startsWith('opencode/')) {
      return model.replace('opencode/', '');
    }
    if (provider === 'openrouter' && model.startsWith('openrouter/')) {
      return model.replace('openrouter/', '');
    }
    return model;
  }

  /**
   * Generates content without streaming across any supported provider
   */
  public async generateContent(
    model: string,
    messages: string | UniversalMessage[] | ChatMessage[],
    options: UniversalGenerationOptions = {}
  ): Promise<string> {
    const provider = this.resolveProvider(model, options.provider);
    const universalMsgs = this.normalizeToUniversal(messages);

    logger.debug('UniversalLlmClient', `Generating unary response via provider: ${provider} [model: ${model}]`);

    if (provider === 'google') {
      const { contents, systemInstruction } = this.toGeminiFormat(
        universalMsgs,
        options.systemInstruction || Config.defaultSystemInstruction
      );
      if (options.apiKey) {
        this.geminiClient.setApiKey(options.apiKey);
      }
      return this.geminiClient.generateContent(model, contents, {
        temperature: options.temperature,
        maxOutputTokens: options.maxOutputTokens,
        systemInstruction,
        signal: options.signal,
      });
    }

    return this.generateOpenAiCompatible(provider, model, universalMsgs, options);
  }

  /**
   * Streams content chunk-by-chunk via SSE across any supported provider
   */
  public async streamContent(
    model: string,
    messages: string | UniversalMessage[] | ChatMessage[],
    onChunk: (chunk: string) => void,
    options: UniversalGenerationOptions = {}
  ): Promise<string> {
    const provider = this.resolveProvider(model, options.provider);
    const universalMsgs = this.normalizeToUniversal(messages);

    logger.debug('UniversalLlmClient', `Streaming response via provider: ${provider} [model: ${model}]`);

    if (provider === 'google') {
      const { contents, systemInstruction } = this.toGeminiFormat(
        universalMsgs,
        options.systemInstruction || Config.defaultSystemInstruction
      );
      if (options.apiKey) {
        this.geminiClient.setApiKey(options.apiKey);
      }
      return this.geminiClient.streamContent(model, contents, onChunk, {
        temperature: options.temperature,
        maxOutputTokens: options.maxOutputTokens,
        systemInstruction,
        signal: options.signal,
      });
    }

    return this.streamOpenAiCompatible(provider, model, universalMsgs, onChunk, options);
  }

  /**
   * Handles OpenAI-compatible providers: OmniRoute, OpenRouter, OpenCode Go
   */
  private getProviderEndpointConfig(
    provider: 'omniroute' | 'openrouter' | 'opencode',
    optionsApiKey?: string
  ): { url: string; headers: Record<string, string> } {
    if (provider === 'omniroute') {
      const url = `${Config.omnirouteBaseUrl}/chat/completions`;
      const apiKey = optionsApiKey || Config.omnirouteApiKey || 'omniroute-token';
      return {
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
      };
    }

    if (provider === 'openrouter') {
      const url = `${Config.openrouterBaseUrl}/chat/completions`;
      const apiKey = optionsApiKey || Config.openrouterApiKey || process.env.OPENROUTER_API_KEY || '';
      return {
        url,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://evabot.online',
          'X-Title': 'EvaBot Autonomous Agent',
        },
      };
    }

    // opencode (OpenCode Go)
    const url = `${Config.opencodeBaseUrl}/chat/completions`;
    const apiKey = optionsApiKey || Config.opencodeApiKey || process.env.OPENCODE_API_KEY || 'opencode-token';
    return {
      url,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Client': 'EvaBot-OpenCode-Go-Adapter',
      },
    };
  }

  private buildOpenAiMessages(
    messages: UniversalMessage[],
    systemInstruction?: string
  ): { role: string; content: string }[] {
    const formatted: { role: string; content: string }[] = [];
    const effectiveSystem = systemInstruction || Config.defaultSystemInstruction;

    if (effectiveSystem) {
      formatted.push({ role: 'system', content: effectiveSystem });
    }

    for (const msg of messages) {
      formatted.push({
        role: msg.role === 'assistant' ? 'assistant' : msg.role === 'system' ? 'system' : 'user',
        content: msg.content,
      });
    }

    return formatted;
  }

  private async generateOpenAiCompatible(
    provider: 'omniroute' | 'openrouter' | 'opencode',
    model: string,
    messages: UniversalMessage[],
    options: UniversalGenerationOptions
  ): Promise<string> {
    const { url, headers } = this.getProviderEndpointConfig(provider, options.apiKey);
    const targetModel = this.cleanModelId(model, provider);
    const payload = {
      model: targetModel,
      messages: this.buildOpenAiMessages(messages, options.systemInstruction),
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxOutputTokens ?? 4096,
      stream: false,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: options.signal,
    });

    if (!response.ok) {
      const errText = await response.text();
      let errorDetail = errText;
      try {
        const json = JSON.parse(errText);
        errorDetail = json.error?.message || json.message || errText;
      } catch {
        // use raw
      }
      logger.error('UniversalLlmClient', `${provider} API Error ${response.status}: ${errorDetail}`);
      throw new Error(`${provider.toUpperCase()} API Error (${response.status}): ${errorDetail}`);
    }

    const data: any = await response.json();
    const output = data.choices?.[0]?.message?.content;
    if (typeof output !== 'string') {
      return '[No content returned by model]';
    }
    return output;
  }

  private async streamOpenAiCompatible(
    provider: 'omniroute' | 'openrouter' | 'opencode',
    model: string,
    messages: UniversalMessage[],
    onChunk: (chunk: string) => void,
    options: UniversalGenerationOptions
  ): Promise<string> {
    const { url, headers } = this.getProviderEndpointConfig(provider, options.apiKey);
    const targetModel = this.cleanModelId(model, provider);
    const payload = {
      model: targetModel,
      messages: this.buildOpenAiMessages(messages, options.systemInstruction),
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxOutputTokens ?? 4096,
      stream: true,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: options.signal,
    });

    if (!response.ok) {
      const errText = await response.text();
      let errorDetail = errText;
      try {
        const json = JSON.parse(errText);
        errorDetail = json.error?.message || json.message || errText;
      } catch {
        // use raw
      }
      logger.error('UniversalLlmClient', `${provider} Stream Error ${response.status}: ${errorDetail}`);
      throw new Error(`${provider.toUpperCase()} Stream Error (${response.status}): ${errorDetail}`);
    }

    if (!response.body) {
      throw new Error(`Empty response body from ${provider}`);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let fullText = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          const dataStr = trimmed.slice(6).trim();
          if (dataStr === '[DONE]') continue;

          try {
            const parsed = JSON.parse(dataStr);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullText += delta;
              onChunk(delta);
            }
          } catch {
            // Buffer fragment
          }
        }
      }
    }

    // Process leftover buffer
    if (buffer.trim().startsWith('data: ')) {
      const dataStr = buffer.trim().slice(6).trim();
      if (dataStr !== '[DONE]') {
        try {
          const parsed = JSON.parse(dataStr);
          const delta = parsed.choices?.[0]?.delta?.content;
          if (delta) {
            fullText += delta;
            onChunk(delta);
          }
        } catch {
          // ignore
        }
      }
    }

    return fullText;
  }
}
