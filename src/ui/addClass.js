/**
 * Adds a class to a DOM node.
 *
 * @param {Object} node The node instance, or an array of nodes.
 * @param {String} className The class name to add.
 * @return {Void}
 */
jambo.addClass = function(node, className) {
    var elements = (typeof node === 'object' && node.length) ? node : [node];

    for (var i = 0, len = elements.length; i < len; ++i) {
        var c = elements[i].className + '';

        if (c === '') {
            elements[i].className = className;
        } else {
            c = c.split(' ');

            for (var j = 0, len2 = c.length; j < len2; ++j) {
                if (c[j] === className) {
                    break;
                }
            }

            if (j === len2) {
                elements[i].className += ' ' + className;
            }
        }
    }
};
