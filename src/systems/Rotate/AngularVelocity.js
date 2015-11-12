'use strict';

// Uses Transformer to do Euler rotation
// -----------------------------------------
new CONV.System.Logic({
    name: 'AngularVelocity',

    dependencies: ['HIDRotate'],

    requiredDependencies: ['Transformer'],

    component: function () {
        return {
            velocity: 0.005
        };
    },

    process: function (entities) {
        _.each(entities, function (e) {
            var rotation = e.Transformer.rotation,
                velocity = e.AngularVelocity.velocity;

            rotation.multiplyScalar(velocity);
        });
    }
});
