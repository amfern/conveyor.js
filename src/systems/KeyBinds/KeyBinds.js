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
                HIDCombos[key] = generateKeyBind(keyBind.keys);
            });
        }
    });
})();
