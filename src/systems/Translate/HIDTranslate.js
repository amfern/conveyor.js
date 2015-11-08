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
            var Transformer = e.Transformer,
                HIDComboState = e.HIDComboState,
                ActiveKeyBinds = e.ActiveKeyBinds,
                triggered = {},
                translation;

            _.each(ActiveKeyBinds, function (keyBindName) {
                triggered[keyBindName] = !!~HIDComboState.indexOf(keyBindName);
            });

            translation = new THREE.Vector3(
                triggered.moveRight || -triggered.moveLeft,
                triggered.moveUp || -triggered.moveDown,
                -triggered.moveForward || +triggered.moveBack
            );

            Transformer.translation.add(translation);
        });
    }
});
