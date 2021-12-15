/* my-messenger by Hisheng (hishengs@gmail.com), version: 0.0.6 */
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {}));
    return true;
  } catch (e) {
    return false;
  }
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _possibleConstructorReturn(self, call) {
  if (call && (typeof call === "object" || typeof call === "function")) {
    return call;
  }

  return _assertThisInitialized(self);
}

function _createSuper(Derived) {
  var hasNativeReflectConstruct = _isNativeReflectConstruct();

  return function _createSuperInternal() {
    var Super = _getPrototypeOf(Derived),
        result;

    if (hasNativeReflectConstruct) {
      var NewTarget = _getPrototypeOf(this).constructor;

      result = Reflect.construct(Super, arguments, NewTarget);
    } else {
      result = Super.apply(this, arguments);
    }

    return _possibleConstructorReturn(this, result);
  };
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

  if (!it) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = it.call(o);
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

var MessengerBase = /*#__PURE__*/function () {
  function MessengerBase(flag, debug) {
    _classCallCheck(this, MessengerBase);

    _defineProperty(this, "flag", '');

    _defineProperty(this, "debug", false);

    _defineProperty(this, "debugPrefix", '');

    _defineProperty(this, "events", {});

    this.flag = flag;
    this.debug = debug;
    this.debugPrefix = "[messenager.".concat(this.flag, "]").padEnd(20, '>');
  }

  _createClass(MessengerBase, [{
    key: "on",
    value: function on(event, callback) {
      if (typeof callback !== 'function') return;
      if (!this.events[event]) this.events[event] = [];
      this.events[event].push(callback);
    }
  }, {
    key: "off",
    value: function off(event, callback) {
      if (event && this.events[event]) {
        if (callback && typeof callback === 'function') {
          var index = this.events[event].indexOf(callback);
          this.events[event].splice(index, 1);
        }

        this.events[event] = undefined;
      }
    }
  }, {
    key: "offAll",
    value: function offAll() {
      var _this = this;

      Object.keys(this.events).forEach(function (e) {
        return _this.off(e);
      });
    }
  }, {
    key: "invoke",
    value: function invoke(event) {
      if (event && this.events[event]) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        var _iterator = _createForOfIteratorHelper(this.events[event]),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var cb = _step.value;
            cb.call.apply(cb, [this].concat(args));
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      }
    }
  }, {
    key: "showDebug",
    value: function showDebug() {
      var _console;

      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      this.debug && (_console = console).info.apply(_console, [this.debugPrefix].concat(args));
    }
  }, {
    key: "showError",
    value: function showError(e) {
      this.debug && console.error(this.debugPrefix, typeof e === 'string' ? e : e.message);
    }
  }]);

  return MessengerBase;
}();

var MessengerParent = /*#__PURE__*/function (_Base) {
  _inherits(MessengerParent, _Base);

  var _super = _createSuper(MessengerParent);

  function MessengerParent(iframe) {
    var _this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, MessengerParent);

    if (typeof iframe === 'string') {
      iframe = document.querySelector(iframe);
    }

    _this = _super.call(this, 'parent', MessengerParent.debug);

    _defineProperty(_assertThisInitialized(_this), "shakehandTimes", 0);

    _defineProperty(_assertThisInitialized(_this), "shakehandTimer", null);

    _defineProperty(_assertThisInitialized(_this), "connected", false);

    _defineProperty(_assertThisInitialized(_this), "timeout", 5000);

    _defineProperty(_assertThisInitialized(_this), "interval", 100);

    _defineProperty(_assertThisInitialized(_this), "maxShakeTimes", 50);

    _this.iframe = iframe;
    _this.timeout = options.timeout || _this.timeout;
    _this.interval = options.interval || _this.interval;
    _this.maxShakeTimes = Math.floor(_this.timeout / _this.interval);
    _this.targetOrigin = options.targetOrigin || iframe.src;
    _this.onMessage = _this.onMessage.bind(_assertThisInitialized(_this));
    window.addEventListener("message", _this.onMessage);
    return _this;
  }

  _createClass(MessengerParent, [{
    key: "connect",
    value: function connect() {
      var _this2 = this;

      return this.checkLoaded().then(function () {
        return _this2.shakehand();
      }).then(function () {
        _this2.connected = true;

        _this2.showDebug('connected');
      });
    } // check if iframe loaded

  }, {
    key: "checkLoaded",
    value: function checkLoaded() {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _this3.showDebug('checkLoaded');

        if (!_this3.iframe) {
          reject('no iframe found');
          return;
        }

        _this3.iframe.addEventListener('load', function () {
          resolve();
        });

        try {
          var iframeDoc = _this3.iframe.contentDocument || _this3.iframe.contentWindow.document;

          if (iframeDoc && iframeDoc.readyState === 'complete') {
            resolve();
          }
        } catch (e) {
          // throw cross origin access error if loaded, otherwise return document
          resolve();
        }
      });
    }
  }, {
    key: "shakehand",
    value: function shakehand() {
      var _this4 = this;

      return new Promise(function (resolve, reject) {
        var shake = function shake(ack) {
          if (_this4.shakehandTimes > _this4.maxShakeTimes) {
            clearInterval(_this4.shakehandTimer);

            _this4.showError('shakehand failed, max times');

            reject('shakehand failed, max times');
            return;
          }

          _this4.shakehandTimes++;

          _this4.showDebug("shakehand: ".concat(_this4.shakehandTimes), ack);

          _this4.send('shakehand', {
            ack: ack
          });
        }; // start shake


        _this4.shakehandTimer = setInterval(shake, _this4.interval); // on reply

        _this4.on('shakehand-reply', function (_ref) {
          var ack = _ref.ack;

          // child ack
          if (ack) {
            // stop shake
            clearInterval(_this4.shakehandTimer); // parent ack

            shake(true);

            _this4.off('shakehand-reply'); // resolve


            resolve();
          }
        });
      });
    }
  }, {
    key: "send",
    value: function send(event, data) {
      if (this.iframe && this.iframe.contentWindow) {
        try {
          this.iframe.contentWindow.postMessage({
            event: event,
            data: data
          }, this.targetOrigin);
        } catch (e) {
          this.showError(e);
        }
      }
    }
  }, {
    key: "onMessage",
    value: function onMessage(e) {
      if (this.targetOrigin !== '*' && !this.targetOrigin.includes(e.origin)) return;
      var _e$data = e.data,
          event = _e$data.event,
          data = _e$data.data;
      this.showDebug('onMessage', e.data);
      this.invoke(event, data);
    }
  }, {
    key: "close",
    value: function close() {
      this.connected = false;
      window.removeEventListener("message", this.onMessage);
      this.offAll();
    }
  }]);

  return MessengerParent;
}(MessengerBase);

_defineProperty(MessengerParent, "debug", false);

var MessengerChild = /*#__PURE__*/function (_Base) {
  _inherits(MessengerChild, _Base);

  var _super = _createSuper(MessengerChild);

  function MessengerChild(origin) {
    var _this;

    _classCallCheck(this, MessengerChild);

    _this = _super.call(this, 'child', MessengerChild.debug);

    _defineProperty(_assertThisInitialized(_this), "origin", '');

    _defineProperty(_assertThisInitialized(_this), "connected", false);

    _this.origin = origin || document.referrer;
    _this.onMessage = _this.onMessage.bind(_assertThisInitialized(_this));
    window.addEventListener('message', _this.onMessage);
    return _this;
  }

  _createClass(MessengerChild, [{
    key: "connect",
    value: function connect() {
      var _this2 = this;

      return new Promise(function (resolve) {
        // shakehand from parent
        _this2.on('shakehand', function (data) {
          _this2.showDebug('on.shakehand', data);

          _this2.replyShakehand(data).then(resolve);
        });
      });
    }
  }, {
    key: "replyShakehand",
    value: function replyShakehand(_ref) {
      var _this3 = this;

      var ack = _ref.ack;
      return new Promise(function (resolve) {
        // ack from parent
        if (ack) {
          _this3.showDebug('connected');

          _this3.connected = true;

          _this3.off('shakehand');

          resolve();
          return;
        }

        _this3.showDebug('shakehand-reply');

        _this3.send('shakehand-reply', {
          ack: true
        });
      });
    }
  }, {
    key: "send",
    value: function send(event, data) {
      if (window.parent && this.origin) {
        try {
          window.parent.postMessage({
            event: event,
            data: data
          }, this.origin);
        } catch (e) {
          this.showError(e);
        }
      }
    }
  }, {
    key: "onMessage",
    value: function onMessage(e) {
      if (!this.origin) this.origin = e.origin;
      if (!this.origin.includes(e.origin)) return;

      var _ref2 = e.data || {},
          _ref2$event = _ref2.event,
          event = _ref2$event === void 0 ? '' : _ref2$event,
          data = _ref2.data;

      this.showDebug('onMessage', e.data);
      this.invoke(event, data);
    }
  }, {
    key: "close",
    value: function close() {
      this.connected = false;
      window.removeEventListener('message', this.onMessage);
      this.offAll();
    }
  }]);

  return MessengerChild;
}(MessengerBase);

_defineProperty(MessengerChild, "debug", false);

var Messenger = {
  Parent: MessengerParent,
  Child: MessengerChild
};

export { Messenger as default };
//# sourceMappingURL=my-messenger.es.js.map
