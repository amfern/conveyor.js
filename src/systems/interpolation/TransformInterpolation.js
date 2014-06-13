'use strict';

// 3D position system before engine cycle has changed it
// -----------------------------------------
new COMP.System.Interpolate({
    name: 'TransformInterpolation',

    requiredDependencies: ['Transform'],

    component: function () { },

    process: function (entities) {
        _.each(entities, function (e) {
            e.TransformInterpolation = e.Transform.clone();
        });
    }
});