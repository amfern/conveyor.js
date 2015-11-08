'use strict';

// Uses Transformer to do Euler rotation
// -----------------------------------------
new CONV.System.Logic({
    name: 'Rotate',

    dependencies: ['HIDRotate', 'TransformPristine'],

    requiredDependencies: ['Transform', 'Transformer'],

    component: function () {
        return {
            velocity: 0.005
        };
    },

    process: function (entities) {
        _.each(entities, function (e) {
            var rotate = e.Transform.rotate,
                rotation = e.Transformer.rotation,
                velocity = e.Rotate.velocity,
                scaledRotation = new THREE.Vector3(),
                euler = new THREE.Euler();

            scaledRotation.copy(rotation).multiplyScalar(velocity);
            euler.set(scaledRotation.x, scaledRotation.y, scaledRotation.z);

            rotate.multiply(new THREE.Quaternion().setFromEuler(euler));
        });
    }
});
