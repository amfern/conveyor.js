'use strict';

// Collection of meshes for rendere system to use
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