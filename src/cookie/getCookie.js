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
