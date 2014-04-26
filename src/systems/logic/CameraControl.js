'use strict';

// 3D position system
// -----------------------------------------
new COMP.System.Logic({
    name: 'CameraControl',

    dependencies: [],

    requiredDependencies: ['KeyBinds', 'HIDRotate'],

    component: function () {

    },

    process: function (entities) {
        _.each(entities, function (e) {
            // calculate current contols hash
            var HIDRotate = e.HIDRotate,
                keyBinds = e.KeyBinds;

            // pitchUp
            HIDRotate.pitchUpHandler = keyBinds.pitchUp.handler;

            // pitchDown
            HIDRotate.pitchDownHandler = keyBinds.pitchDown.handler;
        });
    }
});
