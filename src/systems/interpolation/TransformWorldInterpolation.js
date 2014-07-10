'use strict';

// 3D world position for interpolation systems to use
// -----------------------------------------
new CONV.System.Interpolate({
    name: 'TransformWorldInterpolation',

    requiredDependencies: ['TransformWorld'],

    component: function () { },

    process: function (entities) {
        _.each(entities, function (e) {
            e.TransformWorldInterpolation = e.TransformWorld.clone();
        });
    }
});