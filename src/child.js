import Base from './base.js';

export default class MessengerChild extends Base {
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
    if (!this.origin) this.origin = e.origin;
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