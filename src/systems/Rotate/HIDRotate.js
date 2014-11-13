/*jshint bitwise: false*/
'use strict';

// Sets Transformer rotation according to triggered combos
// -----------------------------------------
new CONV.System.Logic({
    name: 'HIDRotate',

    dependencies: ['Transformer'],

    requiredDependencies: ['Transformer', 'HIDComboState', 'MouseState', 'ActiveKeyBinds'],

    component: function () { },

    process: function (entities) {
        _.each(entities, function (e) {
            var rotation = e.Transformer.rotation,
                HIDComboState = e.HIDComboState,
                MouseState = e.MouseState,
                ActiveKeyBinds = e.ActiveKeyBinds,
                triggered = {};

            _.each(ActiveKeyBinds, function (keyBindName) {
                triggered[keyBindName] = !!~HIDComboState.indexOf(keyBindName);
            });


            if (triggered.pitchUp || triggered.pitchDown) {
                rotation.y += -MouseState.movementY;
            }

            if (triggered.yawLeft || triggered.yawRight) {
                rotation.x += -MouseState.movementX;
            }

            if (triggered.rollLeft || triggered.rollRight) {
                rotation.z += -MouseState.movementZ;
            }
        });
    }
});