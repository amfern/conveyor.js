'use strict';

// 3D position system
// -----------------------------------------
new COMP.System.Logic({
    name: 'Rotate',

    dependencies: ['Transformer', 'HIDRotate'],

    requiredDependencies: ['Object', 'Transformer'],

    component: function () {
        return {
            velocity: 0.01
        };
    },

    process: function (entities) {
        _.each(entities, function (e) {
            var object = e.Object,
                rotation = e.Transformer.rotation,
                velocity = e.Rotate.velocity;

            object.rotateOnAxis(new THREE.Vector3(1, 0, 0), rotation.y * velocity);
            object.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotation.x * velocity);
            object.rotateOnAxis(new THREE.Vector3(0, 0, 1), rotation.z * velocity);
        });
    }
});