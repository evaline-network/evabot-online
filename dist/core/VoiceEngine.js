export class VoiceEngine {
    static instance;
    static getInstance() {
        if (!VoiceEngine.instance) {
            VoiceEngine.instance = new VoiceEngine();
        }
        return VoiceEngine.instance;
    }
    speak(text, lang, onEnd) {
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
    stop() {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }
}
