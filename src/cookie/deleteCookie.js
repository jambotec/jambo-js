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
