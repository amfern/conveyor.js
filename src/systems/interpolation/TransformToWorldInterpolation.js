'use strict';

// Calcualtes world matrix
// -----------------------------------------
new CONV.System.Interpolate({
    name: 'TransformToWorldInterpolation',

    dependencies: [],
    
    requiredDependencies: ['TransformWorldInterpolation', 'Interpolate'],

    // parent entity
    component: function () {
        return null;
    },

    process: function (entities) {
        _.each(entities, function (e) {
            e.TransformWorldInterpolation.copy(e.TransformInterpolation);
        });
    }
});
