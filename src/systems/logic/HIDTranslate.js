/*jshint bitwise: false*/
'use strict';

// 3D position system
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

            translate.x = +triggered.moveRight;
            translate.x = translate.x || -triggered.moveLeft;

            translate.y = +triggered.moveUp;
            translate.y = translate.y || -triggered.moveDown;

            translate.z = -triggered.moveForward;
            translate.z = translate.z || +triggered.moveBack;

            translate.normalize();
        });
    }
});