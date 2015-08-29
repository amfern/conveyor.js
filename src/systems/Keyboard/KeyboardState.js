'use strict';

// Collection of keys represents keyboardstate
//
// key   - unique key indentifier(keycode)
// value - {
//              up        : timestamp of last time key was up
//              down      : timestamp of last time key was down
//              pressed   : bool current key press state
//          }
// -----------------------------------------
(function () {
    var state = {};

    new CONV.System.Logic({
        name: 'KeyboardState',
        isStatic: true,
        dependencies: [],

        component: function () {
            return state;
        },

        process: function (staticEntity) {
            _.extend(state, staticEntity.Keyboard);
        }
    });
})();
