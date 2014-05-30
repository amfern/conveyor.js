'use strict';

// 3D position system
// -----------------------------------------
new COMP.System.Logic({
    name: 'CameraControl',

    dependencies: ['ActiveKeyBinds'],

    requiredDependencies: ['ActiveKeyBinds', 'KeyBinds'],

    component: function () { },

    process: function (entities) {
        _.each(entities, function (e) {
            // calculate current contols hash
            var keyBinds = e.KeyBinds;

            e.ActiveKeyBinds = _.pick(keyBinds, 'pitchUp', 'pitchDown');
        });
    }
});
