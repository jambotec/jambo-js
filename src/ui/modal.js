(function(window, document, undefined, jambo) {
    /**
     * Modal window component.
     *
     * @class Modal
     * @constructor
     * @param {Object} options A set of key/value pairs with component settings.
     * @param {String} [options.msg] The message to display on the modal.
     * @param {String} [options.title] The window title.
     * @param {String} [options.class] An optional css class to add 
     *        to modal wrapper.
     * @param {String} [options.contentDiv] A selector to a div to be added
     *        to modal window.
     */
    function Modal(options) {
        // create the background layer that blocks the page
        var divLayer = document.createElement('div');
        divLayer.setAttribute('class', 'modal-background-layer');
        divLayer.style.display = 'none';

        // create the modal window wrapper 
        var divWrapper = document.createElement('div');
        divWrapper.setAttribute('class', 'modal-wrapper');
        divLayer.appendChild(divWrapper);

        // add an optional class to modal wrapper
        if (options.class !== undefined) {
            divWrapper.className += ' ' + options.class;
        }

        // creates the container where the title is placed
        var divTitle = document.createElement('div');
        divTitle.className = 'modal-title';
        divTitle.innerHTML = (options.title !== undefined ? options.title : '');
        divWrapper.appendChild(divTitle);

        if (options.contentDiv === undefined) {
            // creates the container where the message is placed
            var divContent = document.createElement('div');
            divContent.className = 'modal-message';
            divContent.innerHTML = options.msg;
            divWrapper.appendChild(divContent);
        } else {
            var contentDiv = document.querySelectorAll(options.contentDiv)[0];
            contentDiv.style.display = '';
            divWrapper.appendChild(contentDiv);
        }

        var closeButton = document.createElement('button');
        closeButton.setAttribute('class', 'modal-close');
        divWrapper.appendChild(closeButton);

        document.body.appendChild(divLayer);

        this.layer = divLayer;
        var close = function(e) {
            this.dismiss();
        }.bind(this);

        divLayer.onclick = close;
        closeButton.onclick = close;

        divWrapper.onclick = function(e) {
            e.stopPropagation();
        };
    }

    var self = Modal.prototype;

    self.show = function() {
        document.body.style.overflow = 'hidden';
        this.layer.style.display = '';
    };

    self.dismiss = function() {
        document.body.style.overflow = '';
        this.layer.style.display = 'none';
    };

    self.destroy = function() {
        document.body.removeChild(this.layer);
        this.layer = null;
    };

    jambo.Modal = Modal;

})(window, document, undefined, jambo);
