'use strict';

// Uses Transformer to translate along the xyz axis
// -----------------------------------------
new CONV.System.Logic({
    name: 'Translate',

    dependencies: ['TransformPristine', 'Velocity'],

    requiredDependencies: ['Transform', 'Transformer'],

    component: function () {
    },

    process: function (entities) {
        _.each(entities, function (e) {
            var position = e.Transform.position,
                translation = e.Transformer.translation;

	    position.add(translation);
        });
    }
});
