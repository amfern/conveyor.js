'use strict';

// 3D position for interpolation systems to use
// -----------------------------------------
new CONV.System.Interpolate({
    name: 'TransformInterpolation',

    requiredDependencies: ['Transform'],

    component: function () {
        return {
            position: new THREE.Vector3(),
            rotate:  new THREE.Quaternion(),
            scale: new THREE.Vector3(1,1,1)
        };
    },

    process: function (entities) {
        _.each(entities, function (e) {
            e.TransformInterpolation.copy(e.Transform);
        });
    }
});
