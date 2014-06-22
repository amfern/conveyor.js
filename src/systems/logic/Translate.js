'use strict';

// Uses Transformer to translate along the xyz axis
// -----------------------------------------
new COMP.System.Logic({
    name: 'Translate',

    dependencies: ['Transformer', 'HIDTranslate', 'Rotate'],

    requiredDependencies: ['Transform', 'Transformer'],

    component: function () {
        return {
            velocity: 10
        };
    },

    process: function (entities) {
        _.each(entities, function (e) {
            var Transform = e.Transform,
                position = e.Transformer.position,
                velocity = e.Translate.velocity;

            Transform.translateX(position.x * velocity);
            Transform.translateY(position.y * velocity);
            Transform.translateZ(position.z * velocity);
        });
    }
});