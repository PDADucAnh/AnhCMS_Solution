class EventEmitter {
  constructor() {
    this.listeners = {};
  }
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }
  emit(event, ...args) {
    (this.listeners[event] || []).forEach(cb => cb(...args));
  }
}

export const authEvents = new EventEmitter();
