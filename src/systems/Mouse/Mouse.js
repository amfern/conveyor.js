'use strict';

// Collects Mouse inputs state, collection of keycodes that currently pressed,
// if its not true then it false and its up.
// -----------------------------------------
(function () {
    var element = window.document,
        defaultHidState = {
            down: 0,
            up: 0
        },
        state = {
            movementX: 0,
            movementY: 0,
            screenX: 0,
            screenY: 0,
            clientX: 0,
            clientY: 0,
            wheelX: 0,
            wheelY: 0
        };

    element.addEventListener('mousedown', function (e) {
        state[e.button] = state[e.button] || _.clone(defaultHidState);
        state[e.button].down = e.timeStamp;
        state[e.button].pressed = true;

        e.preventDefault();

        window.document.body.requestPointerLock();
    }, false);

    element.addEventListener('mouseup', function (e) {
        state[e.button] = state[e.button] || _.clone(defaultHidState);
        state[e.button].up = e.timeStamp;
        state[e.button].pressed = false;

        e.preventDefault();
    }, false);

    element.addEventListener('mousemove', function (e) {
        state.movementX += e.movementX;
        state.movementY += e.movementY;
        state.screenX = e.screenX;
        state.screenY = e.screenY;
        state.clientX = e.clientX;
        state.clientY = e.clientY;
        state.timeStamp = e.timeStamp;

        e.preventDefault();
    }, false);

    element.addEventListener('wheel', function (e) {
        state.wheelX += e.wheelDeltaX;
        state.wheelY += e.wheelDeltaY;
        state.wheelTimeStamp = e.timeStamp;

        e.preventDefault();
    }, false);

    // MouseState
    new CONV.System.IO({
        name: 'Mouse',
        isStatic: true,
        dependencies: [],

        component: function () {
            return state;
        }
    });
})();
