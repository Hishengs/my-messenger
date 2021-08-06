export default class MessengerBase {
  flag = '';
  debug = false;
  debugPrefix = '';
  events = {};

  constructor (flag, debug) {
    this.flag = flag;
    this.debug = debug;
    this.debugPrefix = `[messenager.${this.flag}]`.padEnd(20, '>');
  }

  on(event, callback) {
    if (typeof callback !== 'function') return;
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }

  off(event, callback) {
    if (event && this.events[event]) {
      if (callback && typeof callback === 'function') {
        const index = this.events[event].indexOf(callback);
        this.events[event].splice(index, 1);
      } this.events[event] = undefined;
    }
  }

  offAll () {
    Object.keys(this.events).forEach(this.off);
  }

  invoke (event, ...args) {
    if (event && this.events[event]) {
      for (const cb of this.events[event]) {
        cb.call(this, ...args);
      }
    }
  }

  showDebug (...args) {
    this.debug && console.info(this.debugPrefix, ...args);
  }

  showError (e) {
    this.debug && console.error(this.debugPrefix, typeof e === 'string' ? e : e.message);
  }
}