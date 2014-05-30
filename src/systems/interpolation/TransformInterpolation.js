'use strict';

// 3D position for interpolation systems to use
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