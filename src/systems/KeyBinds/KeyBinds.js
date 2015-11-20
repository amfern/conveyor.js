'use strict';

// Collection of keybinds
// -----------------------------------------
(function () {
    var component = {
            moveForward: {
                keys: ['k87']
            },
            moveBack: {
                keys: ['k83']
            },
            moveRight: {
                keys: ['k68']
            },
            moveLeft: {
                keys: ['k65']
            },
            moveUp: {
                keys: ['k32']
            },
            moveDown: {
                keys: ['k67']
            },

            pitchUp: {
                keys: ['mmovedUp']
            },
            pitchDown: {
                keys: ['mmovedDown']
            },
            yawRight: {
                keys: ['mmovedRight']
            },
            yawLeft: {
                keys: ['mmovedLeft']
            },
            rollRight: {
                keys: ['mwheelMovedRight']
            },
            rollLeft: {
                keys: ['mwheelMovedLeft']
            },
            attack: {
                keys: ['m0'],
                isOnce: true
            },
            auxAttack: {
                keys: ['m1'],
                isOnce: true
            },
            altAttack: {
                keys: ['m2'],
                isOnce: true
            }
        };

    function generateKeyBind(keybind) {
        return {
            keys: keybind.keys,
            trigger: keybind.trigger || 'down',
            isOnce: keybind.isOnce || false,
            isOrdered: keybind.isOrdered || false,
            isExclusive: keybind.isExclusive || false,
            isSolitary: keybind.isSolitary || false
        };
    }

    new CONV.System.Logic({
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

            _.each(KeyBinds, function (keyBind, key) {
                HIDCombos[key] = generateKeyBind(keyBind);
            });
        }
    });
})();
