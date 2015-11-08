'use strict';

// Holds the camera 3D position for rendere to use
// -----------------------------------------
(function () {
    var matrix = new THREE.Matrix4();

    new CONV.System.Interpolate({
        name: 'RendererCamera',

        isStatic: true,

        component: function () {
            return matrix;
        }
    });
})();
