'use strict';

// Collects keyboard inputs state collection of keycodes that currently pressed, if its not true then it false and its up
// -----------------------------------------
(function () {
    var state = {},
        defaultHidState = {
            down: 0,
            up: 0
        };

    window.document.addEventListener('keydown', function (e) {
        state[e.keyCode] = state[e.keyCode] || _.clone(defaultHidState);
        state[e.keyCode].down = e.timeStamp;
        state[e.keyCode].pressed = true;

        e.preventDefault();
    }, false);

    window.document.addEventListener('keyup', function (e) {
        state[e.keyCode] = state[e.keyCode] || _.clone(defaultHidState);
        state[e.keyCode].up = e.timeStamp;
        state[e.keyCode].pressed = false;
        
        e.preventDefault();
    }, false);

    new COMP.System.IO({
        name: 'Keyboard',
        isStatic: true,
        dependencies: [],

        component: function () {
            return state;
        },

        process: function () { }
    });
})();