/*jshint bitwise: false*/
'use strict';

// Sets Transformer translate according to triggered combos
// -----------------------------------------
new CONV.System.Logic({
    name: 'HIDTranslate',

    dependencies: ['Transformer'],

    requiredDependencies: ['Transformer', 'HIDComboState', 'ActiveKeyBinds'],

    process: function (entities) {
        _.each(entities, function (e) {
            var translate = e.Transformer.position,
                HIDComboState = e.HIDComboState,
                ActiveKeyBinds = e.ActiveKeyBinds,
                triggered = {};

            _.each(ActiveKeyBinds, function (keyBindName) {
                triggered[keyBindName] = !!~HIDComboState.indexOf(keyBindName);
            });

            translate.x += +triggered.moveRight || -triggered.moveLeft;

            translate.y += +triggered.moveUp || -triggered.moveDown;

            translate.z += -triggered.moveForward || +triggered.moveBack;

            translate.normalize();
        });
    }
});