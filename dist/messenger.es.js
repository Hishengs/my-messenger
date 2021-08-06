class MessengerBase {
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

const MAX_SHAKE_HAND = 50;
const SHAKE_HAND_INTERVAL = 100;

class MessengerParent extends MessengerBase {
  static debug = false;
  shakehandTimes = 0;
  shakehandTimer = null;
  connected = false;

  constructor (iframe) {
    super('parent', MessengerParent.debug);
    this.iframe = iframe;
    this.onMessage = this.onMessage.bind(this);
    window.addEventListener("message", this.onMessage);
  }

  connect () {
    return this.shakehand().then(() => {
      this.connected = true;
      this.showDebug('connected');
    });
  }

  shakehand () {
    return new Promise((resolve, reject) => {
      const shake = (ack) => {
        if (this.shakehandTimes > MAX_SHAKE_HAND) {
          clearInterval(this.shakehandTimer);
          this.showError('shakehand failed, max times');
          reject('shakehand failed, max times');
          return;
        }
        this.shakehandTimes++;
        this.showDebug(`shakehand: ${this.shakehandTimes}`, ack);
        this.send('shakehand', { ack });
      };
      // start shake
      this.shakehandTimer = setInterval(shake, SHAKE_HAND_INTERVAL);
      // on reply
      this.on('shakehand-reply', ({ ack }) => {
        // child ack
        if (ack) {
          // stop shake
          clearInterval(this.shakehandTimer);
          // parent ack
          shake(true);
          this.off('shakehand-reply');
          // resolve
          resolve();
        }
      });
    });
  }

  send (event, data) {
    if (this.iframe && this.iframe.contentWindow) {
      try {
        this.iframe.contentWindow.postMessage({ event, data }, this.iframe.src);
      } catch (e) {
        this.showError(e);
      }
    }
  }

  onMessage (e) {
    if (!this.iframe.src.includes(e.origin)) return;
    const { event, data } = e.data;
    this.showDebug('onMessage', e.data);
    this.invoke(event, data);
  }

  close () {
    this.connected = false;
    window.removeEventListener("message", this.onMessage);
    this.offAll();
  }
}

class MessengerChild extends MessengerBase {
  static debug = false;
  origin = '';
  connected = false;

  constructor (origin) {
    super('child', MessengerChild.debug);
    this.origin = origin;
    this.onMessage = this.onMessage.bind(this);
    window.addEventListener('message', this.onMessage);
  }

  connect () {
    return new Promise(resolve => {
      // shakehand from parent
      this.on('shakehand', (data) => {
        this.showDebug('on.shakehand', data);
        this.replyShakehand(data).then(resolve);
      });
    });
  }

  replyShakehand ({ ack }) {
    return new Promise(resolve => {
      // ack from parent
      if (ack) {
        this.showDebug('connected');
        this.connected = true;
        this.off('shakehand');
        resolve();
        return;
      }
      this.showDebug('shakehand-reply');
      this.send('shakehand-reply', { ack: true });
    });
  }

  send (event, data) {
    if (window.parent && this.origin) {
      try {
        window.parent.postMessage({ event, data }, this.origin);
      } catch (e) {
        this.showError(e);
      }
    }
  }

  onMessage(e) {
    if (this.origin !== e.origin) return;
    const { event = '', data } = e.data || {};
    this.showDebug('onMessage', e.data);
    this.invoke(event, data);
  }

  close () {
    this.connected = false;
    window.removeEventListener('message', this.onMessage);
    this.offAll();
  }
}

const Messenger = {
  Parent: MessengerParent,
  Child: MessengerChild
};

export { Messenger as default };
//# sourceMappingURL=messenger.es.js.map
