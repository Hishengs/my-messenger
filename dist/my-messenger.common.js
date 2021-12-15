/* my-messenger by Hisheng (hishengs@gmail.com), version: 0.0.6 */
'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

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
    Object.keys(this.events).forEach(e => this.off(e));
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

class MessengerParent extends MessengerBase {
  static debug = false;
  shakehandTimes = 0;
  shakehandTimer = null;
  connected = false;
  timeout = 5000;
  interval = 100;
  maxShakeTimes = 50;

  constructor (iframe, options = {}) {
    if (typeof iframe === 'string') {
      iframe = document.querySelector(iframe);
    }
    super('parent', MessengerParent.debug);
    this.iframe = iframe;
    this.timeout = options.timeout || this.timeout;
    this.interval = options.interval || this.interval;
    this.maxShakeTimes = Math.floor(this.timeout / this.interval);
    this.targetOrigin = options.targetOrigin || iframe.src;
    this.onMessage = this.onMessage.bind(this);
    window.addEventListener("message", this.onMessage);
  }

  connect () {
    return this.checkLoaded()
      .then(() => this.shakehand())
      .then(() => {
        this.connected = true;
        this.showDebug('connected');
      });
  }

  // check if iframe loaded
  checkLoaded () {
    return new Promise((resolve, reject) => {
      this.showDebug('checkLoaded');
      if (!this.iframe) {
        reject('no iframe found');
        return;
      }
      this.iframe.addEventListener('load', () => {
        resolve();
      });
      try {
        const iframeDoc = this.iframe.contentDocument || this.iframe.contentWindow.document;
        if (iframeDoc && iframeDoc.readyState === 'complete') {
          resolve();
        }
      } catch (e) {
        // throw cross origin access error if loaded, otherwise return document
        resolve();
      }
    });
  }

  shakehand () {
    return new Promise((resolve, reject) => {
      const shake = (ack) => {
        if (this.shakehandTimes > this.maxShakeTimes) {
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
      this.shakehandTimer = setInterval(shake, this.interval);
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
        this.iframe.contentWindow.postMessage({ event, data }, this.targetOrigin);
      } catch (e) {
        this.showError(e);
      }
    }
  }

  onMessage (e) {
    if (this.targetOrigin !== '*' && !this.targetOrigin.includes(e.origin)) return;
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
    this.origin = origin || document.referrer;
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
    if (!this.origin) this.origin = e.origin;
    if (!this.origin.includes(e.origin)) return;
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

exports['default'] = Messenger;
//# sourceMappingURL=my-messenger.common.js.map
