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
