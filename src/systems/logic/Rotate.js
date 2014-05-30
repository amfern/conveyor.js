'use strict';

// 3D position system
// -----------------------------------------
new COMP.System.Logic({
    name: 'Rotate',

    dependencies: ['Transformer', 'HIDRotate'],

    requiredDependencies: ['Transform', 'Transformer'],

    component: function () {
        return {
            velocity: 0.01
        };
    },

    process: function (entities) {
        _.each(entities, function (e) {
            var Transform = e.Transform,
                rotation = e.Transformer.rotation,
                velocity = e.Rotate.velocity;

            Transform.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotation.y * velocity);
            Transform.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotation.x * velocity);
            Transform.rotateOnAxis(new THREE.Vector3(0, 0, 1), rotation.z * velocity);
        });
    }
});