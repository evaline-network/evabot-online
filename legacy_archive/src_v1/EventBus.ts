/**
 * Decoupled EventBus for inter-plugin communication
 */
export type EventCallback = (payload?: any) => void;

export class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, EventCallback[]> = new Map();

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public on(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  public off(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) return;
    const callbacks = this.listeners.get(event)!.filter(cb => cb !== callback);
    this.listeners.set(event, callbacks);
  }

  public emit(event: string, payload?: any): void {
    if (!this.listeners.has(event)) return;
    this.listeners.get(event)!.forEach(cb => {
      try {
        cb(payload);
      } catch (err) {
        console.error(`[EventBus] Error in listener for event "${event}":`, err);
      }
    });
  }
}
