import { Language } from './Types.js';

export class VoiceEngine {
  private static instance: VoiceEngine;

  public static getInstance(): VoiceEngine {
    if (!VoiceEngine.instance) {
      VoiceEngine.instance = new VoiceEngine();
    }
    return VoiceEngine.instance;
  }

  public speak(text: string, lang: Language, onEnd?: () => void): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('Web Speech API synthesis is not supported in this environment.');
      return;
    }
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = lang === 'en' ? 'en-US' : (lang === 'uk' ? 'uk-UA' : 'ru-RU');
    if (onEnd) {
      utt.onend = onEnd;
    }
    window.speechSynthesis.speak(utt);
  }

  public stop(): void {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
