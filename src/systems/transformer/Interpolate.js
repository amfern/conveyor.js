'use strict';

// Object3D interpolate  system
// -----------------------------------------
new CONV.System.Interpolate({
    name: 'Interpolate',

    dependencies: ['TransformInterpolation'],

    requiredDependencies: ['TransformInterpolation', 'TransformPristine'],

    process: function (entities, interpolation) {
        _.each(entities, function (e) {
            var before = e.TransformPristine,
                after = e.TransformInterpolation,
                beforePosition = new THREE.Vector3(),
                beforeQuaternion = new THREE.Quaternion(),
                beforeScale = new THREE.Vector3(),
                afterPosition = new THREE.Vector3(),
                afterQuaternion = new THREE.Quaternion(),
                afterScale = new THREE.Vector3();

            before.decompose(beforePosition, beforeQuaternion, beforeScale);
            after.decompose(afterPosition, afterQuaternion, afterScale);

            afterPosition.lerp(beforePosition, 1 - interpolation);
            afterQuaternion.slerp(beforeQuaternion, 1 - interpolation);
            afterScale.lerp(beforeScale, 1 - interpolation);

            after.compose(afterPosition, afterQuaternion, afterScale);
        });
    },
});
