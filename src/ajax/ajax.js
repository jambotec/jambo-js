    /**
     * Default ajax request.
     *
     * @author Andrew C. Pacifico <andrecwpacifico@gmail.com>
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
