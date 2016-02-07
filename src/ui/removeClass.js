/**
 * Remove class from a DOM node.
 *
 * @param {Object} node The node instance, or an array of nodes.
 * @param {String} className The class name to remove.
 * @return {Void}
 */
jambo.removeClass = function(node, className){
    var elements = (typeof node === 'object' && node.length) ? node : [node];
    
    for (var i = 0, len = elements.length; i < len ; ++i) {
        var c = elements[i].className + '';
        c = c.split(' ');

        var newClassName = '';
        for (var j = 0, len2 = c.length; j < len2; ++j) {
            if (c[j] !== className) {
                newClassName += c[j] + ' ';
            }
        }

        elements[i].className = newClassName.trim();
    }
};
