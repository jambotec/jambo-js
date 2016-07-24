(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;
        if (!u && a) return a(o, !0);
        if (i) return i(o, !0);
        var f = new Error("Cannot find module '" + o + "'");
        throw f.code = "MODULE_NOT_FOUND", f;
      }
      var l = n[o] = {
        exports: {}
      };
      t[o][0].call(l.exports, function(e) {
        var n = t[o][1][e];
        return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }
    return n[o].exports;
  }
  var i = typeof require == "function" && require;
  for (var o = 0; o < r.length; o++) s(r[o]);
  return s;
})({
  1: [ function(require, module, exports) {
    "use strict";
    var asap = require("asap/raw");
    function noop() {}
    var LAST_ERROR = null;
    var IS_ERROR = {};
    function getThen(obj) {
      try {
        return obj.then;
      } catch (ex) {
        LAST_ERROR = ex;
        return IS_ERROR;
      }
    }
    function tryCallOne(fn, a) {
      try {
        return fn(a);
      } catch (ex) {
        LAST_ERROR = ex;
        return IS_ERROR;
      }
    }
    function tryCallTwo(fn, a, b) {
      try {
        fn(a, b);
      } catch (ex) {
        LAST_ERROR = ex;
        return IS_ERROR;
      }
    }
    module.exports = Promise;
    function Promise(fn) {
      if (typeof this !== "object") {
        throw new TypeError("Promises must be constructed via new");
      }
      if (typeof fn !== "function") {
        throw new TypeError("not a function");
      }
      this._37 = 0;
      this._12 = null;
      this._59 = [];
      if (fn === noop) return;
      doResolve(fn, this);
    }
    Promise._99 = noop;
    Promise.prototype.then = function(onFulfilled, onRejected) {
      if (this.constructor !== Promise) {
        return safeThen(this, onFulfilled, onRejected);
      }
      var res = new Promise(noop);
      handle(this, new Handler(onFulfilled, onRejected, res));
      return res;
    };
    function safeThen(self, onFulfilled, onRejected) {
      return new self.constructor(function(resolve, reject) {
        var res = new Promise(noop);
        res.then(resolve, reject);
        handle(self, new Handler(onFulfilled, onRejected, res));
      });
    }
    function handle(self, deferred) {
      while (self._37 === 3) {
        self = self._12;
      }
      if (self._37 === 0) {
        self._59.push(deferred);
        return;
      }
      asap(function() {
        var cb = self._37 === 1 ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
          if (self._37 === 1) {
            resolve(deferred.promise, self._12);
          } else {
            reject(deferred.promise, self._12);
          }
          return;
        }
        var ret = tryCallOne(cb, self._12);
        if (ret === IS_ERROR) {
          reject(deferred.promise, LAST_ERROR);
        } else {
          resolve(deferred.promise, ret);
        }
      });
    }
    function resolve(self, newValue) {
      if (newValue === self) {
        return reject(self, new TypeError("A promise cannot be resolved with itself."));
      }
      if (newValue && (typeof newValue === "object" || typeof newValue === "function")) {
        var then = getThen(newValue);
        if (then === IS_ERROR) {
          return reject(self, LAST_ERROR);
        }
        if (then === self.then && newValue instanceof Promise) {
          self._37 = 3;
          self._12 = newValue;
          finale(self);
          return;
        } else if (typeof then === "function") {
          doResolve(then.bind(newValue), self);
          return;
        }
      }
      self._37 = 1;
      self._12 = newValue;
      finale(self);
    }
    function reject(self, newValue) {
      self._37 = 2;
      self._12 = newValue;
      finale(self);
    }
    function finale(self) {
      for (var i = 0; i < self._59.length; i++) {
        handle(self, self._59[i]);
      }
      self._59 = null;
    }
    function Handler(onFulfilled, onRejected, promise) {
      this.onFulfilled = typeof onFulfilled === "function" ? onFulfilled : null;
      this.onRejected = typeof onRejected === "function" ? onRejected : null;
      this.promise = promise;
    }
    function doResolve(fn, promise) {
      var done = false;
      var res = tryCallTwo(fn, function(value) {
        if (done) return;
        done = true;
        resolve(promise, value);
      }, function(reason) {
        if (done) return;
        done = true;
        reject(promise, reason);
      });
      if (!done && res === IS_ERROR) {
        done = true;
        reject(promise, LAST_ERROR);
      }
    }
  }, {
    "asap/raw": 4
  } ],
  2: [ function(require, module, exports) {
    "use strict";
    var Promise = require("./core.js");
    module.exports = Promise;
    var TRUE = valuePromise(true);
    var FALSE = valuePromise(false);
    var NULL = valuePromise(null);
    var UNDEFINED = valuePromise(undefined);
    var ZERO = valuePromise(0);
    var EMPTYSTRING = valuePromise("");
    function valuePromise(value) {
      var p = new Promise(Promise._99);
      p._37 = 1;
      p._12 = value;
      return p;
    }
    Promise.resolve = function(value) {
      if (value instanceof Promise) return value;
      if (value === null) return NULL;
      if (value === undefined) return UNDEFINED;
      if (value === true) return TRUE;
      if (value === false) return FALSE;
      if (value === 0) return ZERO;
      if (value === "") return EMPTYSTRING;
      if (typeof value === "object" || typeof value === "function") {
        try {
          var then = value.then;
          if (typeof then === "function") {
            return new Promise(then.bind(value));
          }
        } catch (ex) {
          return new Promise(function(resolve, reject) {
            reject(ex);
          });
        }
      }
      return valuePromise(value);
    };
    Promise.all = function(arr) {
      var args = Array.prototype.slice.call(arr);
      return new Promise(function(resolve, reject) {
        if (args.length === 0) return resolve([]);
        var remaining = args.length;
        function res(i, val) {
          if (val && (typeof val === "object" || typeof val === "function")) {
            if (val instanceof Promise && val.then === Promise.prototype.then) {
              while (val._37 === 3) {
                val = val._12;
              }
              if (val._37 === 1) return res(i, val._12);
              if (val._37 === 2) reject(val._12);
              val.then(function(val) {
                res(i, val);
              }, reject);
              return;
            } else {
              var then = val.then;
              if (typeof then === "function") {
                var p = new Promise(then.bind(val));
                p.then(function(val) {
                  res(i, val);
                }, reject);
                return;
              }
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        }
        for (var i = 0; i < args.length; i++) {
          res(i, args[i]);
        }
      });
    };
    Promise.reject = function(value) {
      return new Promise(function(resolve, reject) {
        reject(value);
      });
    };
    Promise.race = function(values) {
      return new Promise(function(resolve, reject) {
        values.forEach(function(value) {
          Promise.resolve(value).then(resolve, reject);
        });
      });
    };
    Promise.prototype["catch"] = function(onRejected) {
      return this.then(null, onRejected);
    };
  }, {
    "./core.js": 1
  } ],
  3: [ function(require, module, exports) {
    "use strict";
    var rawAsap = require("./raw");
    var freeTasks = [];
    var pendingErrors = [];
    var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);
    function throwFirstError() {
      if (pendingErrors.length) {
        throw pendingErrors.shift();
      }
    }
    module.exports = asap;
    function asap(task) {
      var rawTask;
      if (freeTasks.length) {
        rawTask = freeTasks.pop();
      } else {
        rawTask = new RawTask();
      }
      rawTask.task = task;
      rawAsap(rawTask);
    }
    function RawTask() {
      this.task = null;
    }
    RawTask.prototype.call = function() {
      try {
        this.task.call();
      } catch (error) {
        if (asap.onerror) {
          asap.onerror(error);
        } else {
          pendingErrors.push(error);
          requestErrorThrow();
        }
      } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
      }
    };
  }, {
    "./raw": 4
  } ],
  4: [ function(require, module, exports) {
    (function(global) {
      "use strict";
      module.exports = rawAsap;
      function rawAsap(task) {
        if (!queue.length) {
          requestFlush();
          flushing = true;
        }
        queue[queue.length] = task;
      }
      var queue = [];
      var flushing = false;
      var requestFlush;
      var index = 0;
      var capacity = 1024;
      function flush() {
        while (index < queue.length) {
          var currentIndex = index;
          index = index + 1;
          queue[currentIndex].call();
          if (index > capacity) {
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
              queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
          }
        }
        queue.length = 0;
        index = 0;
        flushing = false;
      }
      var BrowserMutationObserver = global.MutationObserver || global.WebKitMutationObserver;
      if (typeof BrowserMutationObserver === "function") {
        requestFlush = makeRequestCallFromMutationObserver(flush);
      } else {
        requestFlush = makeRequestCallFromTimer(flush);
      }
      rawAsap.requestFlush = requestFlush;
      function makeRequestCallFromMutationObserver(callback) {
        var toggle = 1;
        var observer = new BrowserMutationObserver(callback);
        var node = document.createTextNode("");
        observer.observe(node, {
          characterData: true
        });
        return function requestCall() {
          toggle = -toggle;
          node.data = toggle;
        };
      }
      function makeRequestCallFromTimer(callback) {
        return function requestCall() {
          var timeoutHandle = setTimeout(handleTimer, 0);
          var intervalHandle = setInterval(handleTimer, 50);
          function handleTimer() {
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
          }
        };
      }
      rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;
    }).call(this, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
  }, {} ],
  5: [ function(require, module, exports) {
    if (typeof Promise.prototype.done !== "function") {
      Promise.prototype.done = function(onFulfilled, onRejected) {
        var self = arguments.length ? this.then.apply(this, arguments) : this;
        self.then(null, function(err) {
          setTimeout(function() {
            throw err;
          }, 0);
        });
      };
    }
  }, {} ],
  6: [ function(require, module, exports) {
    var asap = require("asap");
    if (typeof Promise === "undefined") {
      Promise = require("./lib/core.js");
      require("./lib/es6-extensions.js");
    }
    require("./polyfill-done.js");
  }, {
    "./lib/core.js": 1,
    "./lib/es6-extensions.js": 2,
    "./polyfill-done.js": 5,
    asap: 3
  } ]
}, {}, [ 6 ]);

// should work in any browser without browserify
if (typeof Promise.prototype.done !== 'function') {
  Promise.prototype.done = function (onFulfilled, onRejected) {
    var self = arguments.length ? this.then.apply(this, arguments) : this
    self.then(null, function (err) {
      setTimeout(function () {
        throw err
      }, 0)
    })
  }
}

(function (window, document, undefined) {

    var jambo = {};

/**
 * Default ajax request.
 *
 * @method ajax
 * @param {Object} options A set of key/value pairs that configure 
 *          the Ajax request. 
 * @param {Object} options.url A string containing the URL to 
 *          which the request is sent. This parameter is obrigatory.
 * @param {Object} [options.method=GET] The method of request. 
 * @param {Object} options.data Data to be sent to the server. 
 *          It is converted to a query string. 
 * @return {Promise}
 */
jambo.ajax = function (options) {
  var requestData = (typeof options.data === 'object') ? options.data : {};

  var requestMethod = (
    options.method === undefined ||
    (
      options.method.toUpperCase() !== 'GET' &&
      options.method.toUpperCase() !== 'POST' &&
      options.method.toUpperCase() !== 'PUT' &&
      options.method.toUpperCase() !== 'DELETE'
    )
  ) ? 'GET' : options.method.toUpperCase();

  if (typeof options.url !== 'string' && options.url === '') {
    return;
  }

  // encode request data
  var query = [];
  for (var param in requestData) {
    query.push(param + '=' + encodeURIComponent(requestData[param]));
  }
  var encodedData = query.join('&');
  var url = (requestMethod !== 'GET' || encodedData === '') ?
    options.url :
    options.url + (options.url.indexOf('?') >= 0 ? '&' : '?') + encodedData;

  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == XMLHttpRequest.DONE) {
        var responseData;

        try {
          responseData = JSON.parse(xhr.responseText);
        } catch (e) {
          responseData = xhr.responseText;
        }

        if (xhr.status >= 200 && xhr.status <= 299) {
          var success = (typeof options.success === 'function') ?
            options.success :
            function (data) { };
          
          resolve(responseData);
        } else {
          var error = (typeof options.error === 'function') ?
            options.error :
            function (data) { };
          
          reject(responseData);
        }        
      }
    };    

    xhr.open(requestMethod, url, true);
    if (requestMethod !== 'GET') {
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      xhr.send(encodedData);
    } else {
      xhr.send();
    }
  });
};

    /**
     * Return the value stored on page cookies.
     *
     * @method getCookie
     * @param {String} cname The name of the cookie to get.
     * @return {String} The store value. If no value was found, an empty string
     *         is returned.
     */
    jambo.getCookie = function(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for(var i = 0, len = ca.length; i < len; ++i) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }

            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }

        return "";
    };

/**
 * Sets a cookie value.
 *
 * @method setCookie
 * @param {String} cname The name of the cookie
 * @param {String} cvalue The value to set
 * @param {Object} options A key value pair set with method settings.
 * @param {String} options.domain The domain to set.
 * @param {String} options.path The path to set.
 * @return {Void}
 */
jambo.setCookie = function(cname, cvalue, options) {
  options = options || {};

  var expires = '';
  if (
    options.expires !== undefined &&
    options.expires !== Infinity &&
    typeof (options.expires) === 'number'
  ) {
    var expiresDate = new Date();
    expiresDate.setTime(expiresDate.getTime() + (options.expires * 60 * 1000));
    expires = '; expires=' + expiresDate.toString();
  }

  document.cookie = cname + '=' + cvalue + expires +
    (options.domain !== undefined ? '; domain=' + options.domain : '') +
    (options.path !== undefined ? '; path=' + options.path : '');
};

/**
 * Deletes a page cookie.
 *
 * @method deleteCookie
 * @param {String} cname The cookie name.
 * @param {Object} options A key value pair set with method settings.
 * @param {String} options.domain The domain to set.
 * @param {String} options.path The path to set.
 * @return {Void}
 */
jambo.deleteCookie = function (cname, options) {
    options = options || {};

    document.cookie = 
        cname + '=;' +
        (
            options.domain !== undefined ? 
                '; domain=' + options.domain : 
                ''
        ) +
        (
            options.path !== undefined ? 
                '; path=' + options.path : 
                ''
        ) +
        '; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
};

    /**
     * Format a monetary value on Brazilian currency.
     *
     * @author Andrew C. Pacifico <andrewcpacifico@gmail.com>
     * @method brMoneyFormat
     * @param {Number} val A int value representing the value in cents.
     * @return {String} The formated number.
     */
    jambo.brMoneyFormat = function (val) {
        var intPart = Math.floor(val/100);
        var decimal = val%100;

        var cents = (decimal > 9) ? 
            decimal + '' : 
            '0' + decimal;

        return 'R$ ' +  intPart + ',' + cents;
    };

jambo.deepExtend = function(out) {
  out = out || {};

  for (var i = 1; i < arguments.length; i++) {
    var obj = arguments[i];

    if (!obj)
      continue;

    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'object')
          out[key] = jambo.deepExtend(out[key], obj[key]);
        else
          out[key] = obj[key];
      }
    }
  }

  return out;
};

    /**
     * Encodes a string using base64 algorithm.
     *
     * @param {String} str The string to encode.
     * @return {String} The base64 encoded string.
     */
    jambo.base64Encode = function(str) {
        var b64 = 
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            enc = '',
            tmp_arr = [];

        if (!str) {
            return str;
        }

        str = unescape(encodeURIComponent(str));

        do {
            // pack three octets into four hexets
            o1 = str.charCodeAt(i++);
            o2 = str.charCodeAt(i++);
            o3 = str.charCodeAt(i++);

            bits = o1 << 16 | o2 << 8 | o3;

            h1 = bits >> 18 & 0x3f;
            h2 = bits >> 12 & 0x3f;
            h3 = bits >> 6 & 0x3f;
            h4 = bits & 0x3f;

            // use hexets to index into b64, and append result to encoded string
            tmp_arr[ac++] = b64.charAt(h1) +
                b64.charAt(h2) +
                b64.charAt(h3) +
                b64.charAt(h4);
        } while (i < str.length);

        enc = tmp_arr.join('');

        var r = str.length % 3;

        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
    };


    /**
     * Decodes a base64 encoded string.
     *
     * @param {String} str The string to decode.
     * @return {String} The decoded string.
     */
    jambo.base64Decode = function (str) {
        var b64 = 
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            dec = '',
            tmp_arr = [];

        if (!str) {
            return str;
        }

        str += '';

        do {
            // unpack four hexets into three octets using index points in b64
            h1 = b64.indexOf(str.charAt(i++));
            h2 = b64.indexOf(str.charAt(i++));
            h3 = b64.indexOf(str.charAt(i++));
            h4 = b64.indexOf(str.charAt(i++));

            bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

            o1 = bits >> 16 & 0xff;
            o2 = bits >> 8 & 0xff;
            o3 = bits & 0xff;

            if (h3 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1);
            } else if (h4 == 64) {
                tmp_arr[ac++] = String.fromCharCode(o1, o2);
            } else {
                tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
            }
        } while (i < str.length);

        dec = tmp_arr.join('');

        return decodeURIComponent(escape(dec.replace(/\0+$/, '')));
    };

(function(window, document, undefined, jambo) {
    /**
     * Modal window component.
     *
     * @class Modal
     * @constructor
     * @param {Object} options A set of key/value pairs with component settings.
     * @param {String} [options.msg] The message to display on the modal.
     * @param {String} [options.title] The window title.
     * @param {String} [options.class] An optional css class to add 
     *        to modal wrapper.
     * @param {String} [options.contentDiv] A selector to a div to be added
     *        to modal window.
     */
    function Modal(options) {
        // create the background layer that blocks the page
        var divLayer = document.createElement('div');
        divLayer.setAttribute('class', 'modal-background-layer');
        divLayer.style.display = 'none';

        // create the modal window wrapper 
        var divWrapper = document.createElement('div');
        divWrapper.setAttribute('class', 'modal-wrapper');
        divLayer.appendChild(divWrapper);

        // add an optional class to modal wrapper
        if (options.class !== undefined) {
            divWrapper.className += ' ' + options.class;
        }

        // creates the container where the title is placed
        var divTitle = document.createElement('div');
        divTitle.className = 'modal-title';
        divTitle.innerHTML = (options.title !== undefined ? options.title : '');
        divWrapper.appendChild(divTitle);

        if (options.contentDiv === undefined) {
            // creates the container where the message is placed
            var divContent = document.createElement('div');
            divContent.className = 'modal-message';
            divContent.innerHTML = options.msg;
            divWrapper.appendChild(divContent);
        } else {
            var contentDiv = document.querySelectorAll(options.contentDiv)[0];
            contentDiv.style.display = '';
            divWrapper.appendChild(contentDiv);
        }

        var closeButton = document.createElement('button');
        closeButton.setAttribute('class', 'modal-close');
        divWrapper.appendChild(closeButton);

        document.body.appendChild(divLayer);

        this.layer = divLayer;
        var close = function(e) {
            this.dismiss();
        }.bind(this);

        divLayer.onclick = close;
        closeButton.onclick = close;

        divWrapper.onclick = function(e) {
            e.stopPropagation();
        };
    }

    var self = Modal.prototype;

    self.show = function() {
        document.body.style.overflow = 'hidden';
        this.layer.style.display = '';
    };

    self.dismiss = function() {
        document.body.style.overflow = '';
        this.layer.style.display = 'none';
    };

    self.destroy = function() {
        document.body.removeChild(this.layer);
        this.layer = null;
    };

    jambo.Modal = Modal;

})(window, document, undefined, jambo);

/**
 * Adds a class to a DOM node.
 *
 * @param {Object} node The node instance, or an array of nodes.
 * @param {String} className The class name to add.
 * @return {Void}
 */
jambo.addClass = function(node, className) {
    var elements = (typeof node === 'object' && node.length) ? node : [node];

    for (var i = 0, len = elements.length; i < len; ++i) {
        var c = elements[i].className + '';

        if (c === '') {
            elements[i].className = className;
        } else {
            c = c.split(' ');

            for (var j = 0, len2 = c.length; j < len2; ++j) {
                if (c[j] === className) {
                    break;
                }
            }

            if (j === len2) {
                elements[i].className += ' ' + className;
            }
        }
    }
};

/**
 * Remove class from a DOM node.
 *
 * @param {Object} node The node instance, or an array of nodes.
 * @param {String} className The class name to remove.
 * @return {Void}
 */
jambo.removeClass = function(node, className){
    var elements = (typeof node === 'object' && node.length) ? node : [node];
    
    for (var i = 0, len = elements.length; i < len ; ++i) {
        var c = elements[i].className + '';
        c = c.split(' ');

        var newClassName = '';
        for (var j = 0, len2 = c.length; j < len2; ++j) {
            if (c[j] !== className) {
                newClassName += c[j] + ' ';
            }
        }

        elements[i].className = newClassName.trim();
    }
};

    window.jambo = jambo;

})(window, document, undefined);
