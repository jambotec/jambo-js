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

    window.jambo = jambo;

})(window, document, undefined);
