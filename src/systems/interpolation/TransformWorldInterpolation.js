'use strict';

// 3D position system before engine cycle has changed it
// -----------------------------------------
new COMP.System.Interpolate({
    name: 'TransformWorldInterpolation',

    requiredDependencies: ['TransformWorld'],

    component: function () { },

    process: function (entities) {
        _.each(entities, function (e) {
            e.TransformWorldInterpolation = e.TransformWorld.clone();
        });
    }
});