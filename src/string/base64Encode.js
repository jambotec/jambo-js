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
