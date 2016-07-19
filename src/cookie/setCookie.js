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
