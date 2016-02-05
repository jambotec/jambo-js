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
     * @param {Object} [options.type=GET] The method of request. 
     * @param {Object} options.data Data to be sent to the server. 
     *          It is converted to a query string,
     * @param {Function} options.callback A function to execute always when
     *          the request is finished.
     * @param {Function} options.success A function to execute when the request
     *          is successfully finished.
     * @param {Function} options.error A function to execute when some error
     *          occurs on request.
     * @return {Void}
     */
    jambo.ajax = function (options) {
        var callback = (typeof options.callback === 'function') ?
            options.callback :
            function(data) {};

        var requestData = (typeof options.data === 'object') ? options.data : {};

        var requestMethod = (
            options.type === undefined ||
            (
                options.type.toUpperCase() !== 'GET' &&
                options.type.toUpperCase() !== 'POST'
            )
        ) ? 'GET' : options.type.toUpperCase();

        if (typeof options.url !== 'string' && options.url === '') {
            return;
        }

        var xhr  = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var responseData;

                if(xhr.status == 200) {
                    var success = (typeof options.success === 'function') ?
                        options.success :
                        function(data) {};

                    try {
                        responseData = JSON.parse(xhr.responseText);
                    } catch(e) {
                        responseData = xhr.responseText;
                    }

                    // success callback execute only when the request have 200
                    // status
                    success(responseData);
                } else {
                    var error = (typeof options.error === 'function') ?
                        options.error :
                        function(data) {};

                    // when a error occurs run the error callback
                    error();
                }

                // always execute the callback
                callback(responseData);
            }
        };

        // encode request data
        var query = [];
        for(var param in requestData) {
            query.push(param + '=' + encodeURIComponent(requestData[param]));
        }
        var encodedData = query.join('&');
        var url = (requestMethod === 'POST' || encodedData === '') ?
            options.url :
            options.url + 
            (options.url.indexOf('?') >= 0 ? '&' : '?') + 
            encodedData;

        xhr.open(requestMethod, url, true);
        if (requestMethod === 'POST') {
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            xhr.send(encodedData);
        } else {
            xhr.send();
        }
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
    jambo.setCookie = function (cname, cvalue, options) {
        options = options || {};

        document.cookie = 
            cname + '=' + cvalue +
            (
                options.domain !== undefined ? 
                    '; domain=' + options.domain : 
                    ''
            ) +
            (
                options.path !== undefined ? 
                    '; path=' + options.path : 
                    ''
            );
    };

    /**
     * Deletes a page cookie.
     *
     * @method deleteCookie
     * @param {String} name The cookie name.
     * @param {String} host The cookie host.
     * @return {Void}
     */
    jambo.deleteCookie = function (name, host) {
        this.setCookie(name, '', -1, '/', host);
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

        if (options.contentDiv === undefined) {
            // creates the container where the title is placed
            var divTitle = document.createElement('div');
            divTitle.className = 'modal-title';
            divTitle.innerHTML = 
                (options.title !== undefined ? options.title : '');
            divWrapper.appendChild(divTitle);

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

    window.jambo = jambo;

})(window, document, undefined);
