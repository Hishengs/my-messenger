import Base from './base.js';

const MAX_SHAKE_HAND = 50;
const SHAKE_HAND_INTERVAL = 100;

export default class MessengerParent extends Base {
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