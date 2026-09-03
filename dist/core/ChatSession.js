import { GeminiClient } from './GeminiClient.js';
import { ModelRegistry } from '../models/ModelRegistry.js';
import { Config } from './Config.js';
import { logger } from './Logger.js';
export class ChatSession {
    client;
    currentModel;
    systemInstruction;
    history = [];
    maxHistoryTurns;
    constructor(options = {}) {
        const apiKey = options.apiKey || Config.geminiApiKey;
        this.client = new GeminiClient(apiKey);
        this.currentModel = options.model || Config.defaultModel;
        this.systemInstruction = options.systemInstruction || Config.defaultSystemInstruction;
        this.maxHistoryTurns = options.maxHistoryTurns || 50;
        if (!ModelRegistry.isValidModel(this.currentModel)) {
            this.currentModel = ModelRegistry.getDefaultModel().id;
        }
    }
    getModel() {
        return this.currentModel;
    }
    setModel(modelId) {
        if (ModelRegistry.isValidModel(modelId)) {
            this.currentModel = modelId;
            logger.info('ChatSession', `Switched active model to: ${modelId}`);
            return true;
        }
        logger.warn('ChatSession', `Attempted to switch to unknown model: ${modelId}`);
        return false;
    }
    getSystemInstruction() {
        return this.systemInstruction;
    }
    setSystemInstruction(instruction) {
        this.systemInstruction = instruction;
        logger.info('ChatSession', 'Updated system instruction');
    }
    setApiKey(apiKey) {
        this.client.setApiKey(apiKey);
    }
    hasApiKey() {
        return this.client.hasApiKey();
    }
    getHistory() {
        return [...this.history];
    }
    clearHistory() {
        this.history = [];
        logger.info('ChatSession', 'Conversation history cleared');
    }
    trimHistory() {
        const maxMessages = this.maxHistoryTurns * 2;
        if (this.history.length > maxMessages) {
            this.history = this.history.slice(this.history.length - maxMessages);
        }
    }
    async sendMessage(prompt, onChunk) {
        const userMsg = {
            role: 'user',
            parts: [{ text: prompt.trim() }],
        };
        // Prepare contents array with previous conversation + new message
        const contents = [...this.history, userMsg];
        let responseText = '';
        try {
            if (onChunk) {
                responseText = await this.client.streamContent(this.currentModel, contents, onChunk, { systemInstruction: this.systemInstruction });
            }
            else {
                responseText = await this.client.generateContent(this.currentModel, contents, { systemInstruction: this.systemInstruction });
            }
            // Record successful exchange in session history
            this.history.push(userMsg);
            this.history.push({
                role: 'model',
                parts: [{ text: responseText }],
            });
            this.trimHistory();
            return responseText;
        }
        catch (err) {
            logger.error('ChatSession', `Failed to send message: ${err.message}`);
            throw err;
        }
    }
}
