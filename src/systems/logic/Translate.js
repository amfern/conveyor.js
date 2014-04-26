'use strict';

// 3D position system
// -----------------------------------------
new COMP.System.Logic({
    name: 'Translate',

    dependencies: ['Transformer', 'HIDTranslate', 'Rotate'],

    requiredDependencies: ['Object', 'Transformer'],

    component: function () {
        return {
            velocity: 10
        };
    },

    process: function (entities) {
        _.each(entities, function (e) {
            var object = e.Object,
                position = e.Transformer.position,
                velocity = e.Translate.velocity;

            object.translateX(position.x * velocity);
            object.translateY(position.y * velocity);
            object.translateZ(position.z * velocity);
        });
    }
});