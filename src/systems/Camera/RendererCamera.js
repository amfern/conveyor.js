'use strict';

// Holds the camera 3D position for rendere to use
// -----------------------------------------
(function () {
    var component = new THREE.Object3D();

    new CONV.System.Interpolate({
        name: 'RendererCamera',

        isStatic: true,

        component: function () {
            return component;
        },

        process: function () { }
    });
})();