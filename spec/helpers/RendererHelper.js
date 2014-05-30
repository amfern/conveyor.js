'use strict';

// remove renderer element when running specs
afterEach(function () {
    var rendererElem = window.document.getElementById('RendererSystem');

    if(!rendererElem) {
        return;
    }

    rendererElem.remove();
});
