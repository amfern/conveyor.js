'use strict';

// 3D position for interpolation systems to use
// -----------------------------------------
new CONV.System.Interpolate({
    name: 'TransformInterpolation',

    requiredDependencies: ['Transform'],

    component: function () {
        return new THREE.Matrix4();
    },

    process: function (entities) {
        _.each(entities, function (e) {
            e.TransformInterpolation.copy(e.Transform);
        });
    }
});
