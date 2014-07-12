'use strict';

// Calcualtes world matrix
// -----------------------------------------
new CONV.System.Interpolate({
    name: 'TransformToWorld',

    dependencies: ['Rotate', 'Translate'],
    
    requiredDependencies: ['TransformWorld', 'Transform'],

    // parent entity
    component: function () {
        return null;
    },

    process: function (entities) {
        _.each(entities, function (e) {
            e.TransformWorld.copy(e.Transform);
        });
    }
});
