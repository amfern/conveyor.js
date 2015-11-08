'use strict';

// 3D position for interpolation systems to use
// -----------------------------------------
new CONV.System.Interpolate({
    name: 'TransformInterpolate',

    dependencies: [],

    requiredDependencies: ['Transform'],

    component: function () {
        return {
            position: new THREE.Vector3(),
            rotate: new THREE.Quaternion(),
            scale: new THREE.Vector3(),
        };
    },

    process: function (entities) {
        _.each(entities, function (e) {
            var Transform = e.Transform;

            e.TransformInterpolate = {
                position: Transform.position.clone(),
                rotate: Transform.rotate.clone(),
                scale: Transform.scale.clone()
            };
        });
    }
});
