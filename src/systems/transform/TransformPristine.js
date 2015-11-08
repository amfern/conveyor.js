'use strict';

// 3D position system before engine cycle has changed it
// -----------------------------------------
new CONV.System.Logic({
    name: 'TransformPristine',

    dependencies: [],

    requiredDependencies: ['Transform'],

    process: function (entities) {
        _.each(entities, function (e) {
            e.TransformPristine.copy(e.Transform);
        });
    }
});
