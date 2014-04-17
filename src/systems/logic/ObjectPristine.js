'use strict';

// 3D position system before engine cycle has changed it
// -----------------------------------------
new COMP.System.Logic({
    name: 'ObjectPristine',

    requiredDependencies: ['Object'],

    component: function () { },

    process: function (entities) {
        _.each(entities, function (e) {
            e.ObjectPristine = e.Object.clone();
        });
    }
});