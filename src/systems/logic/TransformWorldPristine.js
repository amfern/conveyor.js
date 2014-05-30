'use strict';

// 3D position system before engine cycle has changed it
// -----------------------------------------
new COMP.System.Logic({
    name: 'TransformWorldPristine',

    dependencies: ['TransformWorld'],

    requiredDependencies: ['TransformWorld'],

    component: function () { },

    process: function (entities) {
        _.each(entities, function (e) {
            e.TransformWorldPristine = e.TransformWorld.clone();
        });
    }
});