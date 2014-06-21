'use strict';

// Collects keyboard inputs state collection of keycodes that currently pressed, if its not true then it false and its up
// -----------------------------------------
(function () {
    var state = {};

    new COMP.System.Logic({
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