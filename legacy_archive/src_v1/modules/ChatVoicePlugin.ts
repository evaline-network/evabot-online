import { IEvaBotPlugin } from '../plugins/IEvaBotPlugin.js';
import { Language } from '../core/Types.js';

export class ChatVoicePlugin implements IEvaBotPlugin {
  public id = 'chat';
  public name = 'Gemini Chat & Voice Plugin';
  public version = '1.0.0';
  public screenId = 'tab-chat';
  public tabTitle: Record<Language, string> = {
    en: '[1] CHAT & VOICE',
    uk: '[1] ЧАТ ТА ГОЛОС',
    ru: '[1] ЧАТ И ГОЛОС'
  };

  private chatHistory: { sender: string; text: string }[] = [];

  public init(manager: any): void {
    this.chatHistory = [
      {
        sender: 'EVABOT',
        text: 'Hello! I am EvaBot — your autonomous intelligent assistant.\nThe system is running in Starter Demo Mode version 0.0.1.\nCompute core is connected to Google Gemini models under your Google AI Pro subscription.\nGoogle Cloud server infrastructure was activated tonight at 00:01 UTC+3.'
      }
    ];
  }

  public render(lang: Language): string {
    const welcome = this.chatHistory.map(h => `[${h.sender}]: ${h.text}`).join('\n\n');

    return `
      <fieldset>
        <legend><b>// SCREEN 1: GEMINI CHAT & LIVE VOICE CONSOLE</b></legend>
        <table border="1" width="100%" cellpadding="6">
          <tr>
            <td>
              <b>SESSION:</b> EVABOT_GEMINI_CORE_v0.0.1 | 
              <b>PROTOCOL:</b> WSS/TLS1.3 | 
              <b>STATUS:</b> ONLINE (ACTIVE)
            </td>
            <td align="right">
              <button id="live-voice-toggle" onclick="window.evaApp.toggleVoiceInput()">[●] LIVE GEMINI VOICE</button>
            </td>
          </tr>
        </table>
        <hr>
        <pre id="chat-stream">${welcome}</pre>
        <hr>
        <form id="chat-form" onsubmit="window.evaApp.submitPrompt(event)">
          <label for="term-input"><b>PROMPT:</b></label>
          <input type="text" id="term-input" size="60" placeholder="enter prompt for EvaBot...">
          <button type="submit">EXECUTE</button>
        </form>
      </fieldset>
    `;
  }
}
