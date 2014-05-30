'use strict';

// 3D position system
// -----------------------------------------
(function () {
    var component = new THREE.Object3D();

    new COMP.System.Interpolate({
        name: 'RendererCamera',

        isStatic: true,

        component: function () {
            return component;
        },

        process: function () { }
    });
})();