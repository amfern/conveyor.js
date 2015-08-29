'use strict';

// Collects inputs states from keyboard,mouse,joystick, 3Dmouse
// -----------------------------------------
(function () {
    var state = {};

    function combineStates(keyboardState, mouseState, touchState, joystickState, mouse3DState) {
        return _.extend({},
                _.prefixKeys(keyboardState, 'k'),
                _.prefixKeys(mouseState, 'm'),
                _.prefixKeys(joystickState, 'j'),
                _.prefixKeys(mouse3DState, 'm3d')
            );
    }

    new CONV.System.Logic({
        name: 'HIDState',
        isStatic: true,

        dependencies: [
            'KeyboardState',
            'MouseState',
            /*'TouchState',
            'JoystickState',
            '3DMouseState*/
        ],

        component: function () {
            return state;
        },

        process: function (staticEntity) {
            _.clearAll(state); // clear state
            _.extend(state, combineStates(
                    staticEntity.KeyboardState,
                    staticEntity.MouseState
                    // staticEntity.TouchState
                    // staticEntity.JoystickState
                    // staticEntity.Mouse3DState
                ));
        }
    });
})();
