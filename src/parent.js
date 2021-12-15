import Base from './base.js';

export default class MessengerParent extends Base {
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