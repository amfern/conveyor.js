'use strict';

// 3D position system
// -----------------------------------------
(function () {
    var component = {};

    new COMP.System.Interpolate({
        name: 'RendererMeshes',
        isStatic: true,


        component: function () {
            return component;
        },

        process: function () { }
    });
})();