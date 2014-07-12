'use strict';

// 3D world position system before engine cycle has changed it
// -----------------------------------------
new CONV.System.Logic({
    name: 'TransformWorldPristine',

    dependencies: ['TransformWorld'],

    requiredDependencies: ['TransformWorld'],

    component: function () { },

    process: function (entities) {
        _.each(entities, function (e) {
            e.TransformWorldPristine.copy(e.TransformWorld);
        });
    }
});