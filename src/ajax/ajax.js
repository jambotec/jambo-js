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
      options.method.toUpperCase() !== 'POST'
    )
  ) ? 'GET' : options.method.toUpperCase();

  if (typeof options.url !== 'string' && options.url === '') {
    return;
  }

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

        if (xhr.status === 200) {                    
          resolve(responseData);
        } else {          
          reject(responseData);
        }        
      }
    };

    // encode request data
    var query = [];
    for (var param in requestData) {
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
  });
};
