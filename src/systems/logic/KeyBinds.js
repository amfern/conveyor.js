'use strict';

// 3D position system
// -----------------------------------------
(function () {
    var component = {
            moveForward: {
                keys: ['k87'],
                handler: -1
            },
            moveBack: {
                keys: ['k83'],
                handler: -1
            },
            moveRight: {
                keys: ['k68'],
                handler: -1
            },
            moveLeft: {
                keys: ['k65'],
                handler: -1
            },
            moveUp: {
                keys: ['k32'],
                handler: -1
            },
            moveDown: {
                keys: ['k67'],
                handler: -1
            },

            pitchUp: {
                keys: ['mmovedUp'],
                handler: -1
            },
            pitchDown: {
                keys: ['mmovedDown'],
                handler: -1
            },
            yawRight: {
                keys: ['mmovedRight'],
                handler: -1
            },
            yawLeft: {
                keys: ['mmovedLeft'],
                handler: -1
            },
            rollRight: {
                keys: ['mwheelMovedRight'],
                handler: -1
            },
            rollLeft: {
                keys: ['mwheelMovedLeft'],
                handler: -1
            }
        };

    function generateKeyBind(keys) {
        return {
            keys: keys,
            trigger: 'down',
            isOnce: false,
            isOrdered: false,
            isExclusive: false,
            isSolitary: false
        };
    }

    new COMP.System.Logic({
        name: 'KeyBinds',

        isStatic: true,

        dependencies: ['HIDCombos'],

        requiredDependencies: ['HIDCombos'],

        component: function () {
            return component;
        },

        process: function (staticEntity) {
            // calculate current contols hash
            var KeyBinds = staticEntity.KeyBinds,
                HIDCombos = staticEntity.HIDCombos;

            _.each(KeyBinds, function (keyBind) {
                keyBind.handler = HIDCombos.push(generateKeyBind(keyBind.keys)) - 1;
            });
        }
    });
})();