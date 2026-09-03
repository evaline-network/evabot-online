export class EventBus {
    static instance;
    listeners = new Map();
    static getInstance() {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }
    on(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event).push(callback);
    }
    off(event, callback) {
        if (!this.listeners.has(event))
            return;
        const callbacks = this.listeners.get(event).filter(cb => cb !== callback);
        this.listeners.set(event, callbacks);
    }
    emit(event, payload) {
        if (!this.listeners.has(event))
            return;
        this.listeners.get(event).forEach(cb => {
            try {
                cb(payload);
            }
            catch (err) {
                console.error(`[EventBus] Error in listener for event "${event}":`, err);
            }
        });
    }
}
