/*jshint bitwise: false*/
'use strict';

// Translates in direction
// -----------------------------------------
new CONV.System.Logic({
    name: 'OmniForce',

    dependencies: ['Transform'],

    requiredDependencies: ['Transform'],

    component: function () {
        return {
            velocity: 10,
            direction: {
                x: 0,
                y: -1,
                z: 0
            }
        };
    },

    process: function (entities) {
        _.each(entities, function (e) {
            var Transform = e.Transform,
                velocity = e.OmniForce.velocity,
                direction = e.OmniForce.direction;

            Transform.translateX(velocity * direction.x);
            Transform.translateY(velocity * direction.y);
            Transform.translateZ(velocity * direction.z);
        });
    }
});
