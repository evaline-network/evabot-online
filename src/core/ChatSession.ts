import { GeminiClient, ChatMessage } from './GeminiClient.js';
import { ModelRegistry } from '../models/ModelRegistry.js';
import { Config } from './Config.js';
import { logger } from './Logger.js';

export interface ChatSessionOptions {
  model?: string;
  systemInstruction?: string;
  apiKey?: string;
  maxHistoryTurns?: number;
}

export class ChatSession {
  private client: GeminiClient;
  private currentModel: string;
  private systemInstruction: string;
  private history: ChatMessage[] = [];
  private maxHistoryTurns: number;

  constructor(options: ChatSessionOptions = {}) {
    const apiKey = options.apiKey || Config.geminiApiKey;
    this.client = new GeminiClient(apiKey);
    this.currentModel = options.model || Config.defaultModel;
    this.systemInstruction = options.systemInstruction || Config.defaultSystemInstruction;
    this.maxHistoryTurns = options.maxHistoryTurns || 50;

    if (!ModelRegistry.isValidModel(this.currentModel)) {
      this.currentModel = ModelRegistry.getDefaultModel().id;
    }
  }

  public getModel(): string {
    return this.currentModel;
  }

  public setModel(modelId: string): boolean {
    if (ModelRegistry.isValidModel(modelId)) {
      this.currentModel = modelId;
      logger.info('ChatSession', `Switched active model to: ${modelId}`);
      return true;
    }
    logger.warn('ChatSession', `Attempted to switch to unknown model: ${modelId}`);
    return false;
  }

  public getSystemInstruction(): string {
    return this.systemInstruction;
  }

  public setSystemInstruction(instruction: string): void {
    this.systemInstruction = instruction;
    logger.info('ChatSession', 'Updated system instruction');
  }

  public setApiKey(apiKey: string): void {
    this.client.setApiKey(apiKey);
  }

  public hasApiKey(): boolean {
    return this.client.hasApiKey();
  }

  public getHistory(): ChatMessage[] {
    return [...this.history];
  }

  public clearHistory(): void {
    this.history = [];
    logger.info('ChatSession', 'Conversation history cleared');
  }

  public trimHistory(): void {
    const maxMessages = this.maxHistoryTurns * 2;
    if (this.history.length > maxMessages) {
      this.history = this.history.slice(this.history.length - maxMessages);
    }
  }

  public async sendMessage(
    prompt: string,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    const userMsg: ChatMessage = {
      role: 'user',
      parts: [{ text: prompt.trim() }],
    };

    // Prepare contents array with previous conversation + new message
    const contents = [...this.history, userMsg];

    let responseText = '';
    try {
      if (onChunk) {
        responseText = await this.client.streamContent(
          this.currentModel,
          contents,
          onChunk,
          { systemInstruction: this.systemInstruction }
        );
      } else {
        responseText = await this.client.generateContent(
          this.currentModel,
          contents,
          { systemInstruction: this.systemInstruction }
        );
      }

      // Record successful exchange in session history
      this.history.push(userMsg);
      this.history.push({
        role: 'model',
        parts: [{ text: responseText }],
      });
      this.trimHistory();

      return responseText;
    } catch (err: any) {
      logger.error('ChatSession', `Failed to send message: ${err.message}`);
      throw err;
    }
  }
}
