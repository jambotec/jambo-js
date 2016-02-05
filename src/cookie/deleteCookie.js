    /**
     * Deletes a page cookie.
     *
     * @method deleteCookie
     * @param {String} name The cookie name.
     * @param {Object} options A key value pair set with method settings.
     * @param {String} options.domain The domain to set.
     * @param {String} options.path The path to set.
     * @return {Void}
     */
    jambo.deleteCookie = function (name, options) {
        this.setCookie(name, '', options);
    };
