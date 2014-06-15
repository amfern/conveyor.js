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
            movedUp: _.clone(defaultHidState),
            movedDown: _.clone(defaultHidState),
            movedLeft: _.clone(defaultHidState),
            movedRight: _.clone(defaultHidState),
            moved: _.clone(defaultHidState),
            wheelX: 0,
            wheelY: 0,
            wheelMovementX: 0,
            wheelMovementY: 0,
            wheelMovedUp: _.clone(defaultHidState),
            wheelMovedDown: _.clone(defaultHidState),
            wheelMovedLeft: _.clone(defaultHidState),
            wheelMovedRight: _.clone(defaultHidState),
            wheelMoved: _.clone(defaultHidState),
        },
        movedTimeStamp = 0,
        wheelMovedTimeStamp = 0;

    element.addEventListener('mousedown', function (e) {
        state[e.button] = state[e.button] || _.clone(defaultHidState);
        state[e.button].down = e.timeStamp;
        state[e.button].pressed = true;

        e.preventDefault();
    }, false);

    element.addEventListener('mouseup', function (e) {
        state[e.button] = state[e.button] || _.clone(defaultHidState);
        state[e.button].up = e.timeStamp;
        state[e.button].pressed = false;

        e.preventDefault();
    }, false);

    element.addEventListener('mousemove', function (e) {
        state.screenX = e.screenX;
        state.screenY = e.screenY;
        state.clientX = e.clientX;
        state.clientY = e.clientY;

        movedTimeStamp = e.timeStamp;

        e.preventDefault();
    }, false);

    element.addEventListener('wheel', function (e) {
        state.wheelX += e.wheelDeltaX;
        state.wheelY += e.wheelDeltaY;
        wheelMovedTimeStamp = e.timeStamp;

        e.preventDefault();
    }, false);

    // MouseState
    new COMP.System.IO({
        name: 'Mouse',
        isStatic: true,
        dependencies: [],

        component: function () {
            return state;
        },

        process: function () {
            wheelMovedTimeStamp = 0;
            movedTimeStamp = 0;
        }
    });
})();