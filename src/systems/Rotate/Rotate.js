'use strict';

// Uses Transformer to do Euler rotation
// -----------------------------------------
new CONV.System.Logic({
    name: 'Rotate',

    dependencies: ['TransformPristine', 'AngularVelocity'],

    requiredDependencies: ['Transform', 'Transformer'],

    component: function () {
    },

    process: function (entities) {
        _.each(entities, function (e) {
            var rotate = e.Transform.rotate,
                rotation = e.Transformer.rotation,
                euler = new THREE.Euler();

            euler.set(rotation.x, rotation.y, rotation.z);
            rotate.multiply(new THREE.Quaternion().setFromEuler(euler));
        });
    }
});
