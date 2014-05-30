'use strict';

// 3D position system
// -----------------------------------------
new COMP.System.Logic({
    name: 'PlayerControl',

    dependencies: ['ActiveKeyBinds'],

    requiredDependencies: ['KeyBinds', 'ActiveKeyBinds'],

    component: function () {

    },

    process: function (entities) {
        _.each(entities, function (e) {
            // calculate current contols hash
            var keyBinds = e.KeyBinds;

            e.ActiveKeyBinds = _.pick(keyBinds,
                    'yawRight',
                    'yawLeft',
                    'moveForward',
                    'moveBack',
                    'moveLeft',
                    'moveRight',
                    'moveUp',
                    'moveDown'
                );
        });
    }
});
