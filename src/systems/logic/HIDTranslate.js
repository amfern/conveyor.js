/*jshint bitwise: false*/
'use strict';

// Sets Transformer translate according to triggered combos
// -----------------------------------------
new COMP.System.Logic({
    name: 'HIDTranslate',

    dependencies: ['CameraControl', 'PlayerControl', 'Transformer'],

    requiredDependencies: ['Transformer', 'HIDComboState', 'ActiveKeyBinds'],

    component: function () {},

    process: function (entities) {
        _.each(entities, function (e) {
            var translate = e.Transformer.position,
                HIDComboState = e.HIDComboState,
                ActiveKeyBinds = e.ActiveKeyBinds,
                triggered = {};

            _.each(ActiveKeyBinds, function (keyBind, keyBindName) {
                triggered[keyBindName] = !!~HIDComboState.indexOf(keyBindName);
            });

            translate.x += +triggered.moveRight || -triggered.moveLeft;

            translate.y += +triggered.moveUp || -triggered.moveDown;

            translate.z += -triggered.moveForward || +triggered.moveBack;

            translate.normalize();
        });
    }
});