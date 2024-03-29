export default class MessengerBase {
  flag = '';
  debug = false;
  debugPrefix = '';
  events = {};
  uid = +new Date();

  constructor (flag, debug) {
    this.flag = flag + '_' + this.uid;
    this.debug = debug;
    this.debugPrefix = '[messenager.' + this.flag + '] >>>';
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
    Object.keys(this.events).forEach(e => this.off(e));
  }

  invoke (event, ...args) {
    if (event && this.events[event]) {
      this.events[event].forEach(cb => {
        cb.call(this, ...args);
      });
    }
  }

  showDebug (...args) {
    this.debug && console.info(this.debugPrefix, ...args);
  }

  showError (e) {
    this.debug && console.error(this.debugPrefix, typeof e === 'string' ? e : e.message);
  }
}