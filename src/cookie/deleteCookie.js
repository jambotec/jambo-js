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
