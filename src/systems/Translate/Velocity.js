'use strict';

// Uses Transformer to translate along the xyz axis
// -----------------------------------------
new CONV.System.Logic({
    name: 'Velocity',

    dependencies: [
        'Transformer',
        'HIDTranslateHorizontal',
        'HIDTranslateVertical',
        'HIDTranslateDepth',
        'Rotate'
    ],

    requiredDependencies: ['Transformer', 'Transform'],

    component: function () {
        return {
            velocity: 1
        };
    },

    process: function (entities) {
        _.each(entities, function (e) {
            var rotate = e.Transform.rotate,
                // rotation = e.Transformer.rotation,
                translation = e.Transformer.translation,
                velocity = e.Velocity.velocity;

            // TODO: maybe should take into account when AngularVelocity
            translation.normalize().applyQuaternion(rotate);
	    translation.multiplyScalar(velocity);
        });
    }
});
