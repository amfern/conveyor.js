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
        prevState = _.cloneDeep(state),
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

    // constructs state for mouseMove[...] states
    function constructState(mouseState, prevPressed, timeStamp, directionCheck) {
        if (directionCheck()) {
            return {
                pressed: true,
                // update up timestamp only if state changed to pressed from not pressed
                down: prevPressed ? mouseState.down : timeStamp,
                up: mouseState.up
            };
        }
     
        return {
            pressed: false,
            // update down timestamp only if state changed to not pressed from pressed
            down: mouseState.down,
            // up: prevPressed ? timeStamp : mouseState.up
            up: prevPressed ? mouseState.down : mouseState.up
        };
    }

    // MouseState
    new COMP.System.IO({
        name: 'MouseState',
        isStatic: true,
        dependencies: [],

        component: function () {
            return state;
        },

        process: function () {
            // calculate movement
            state.movementX = state.screenX - prevState.screenX;
            state.movementY = state.screenY - prevState.screenY;

            state.wheelMovementX = state.wheelX - prevState.wheelX;
            state.wheelMovementY = state.wheelY - prevState.wheelY;

            // calculate mouse movement
            state.moved = constructState(
                state.moved,
                prevState.moved.pressed,
                movedTimeStamp,
                function () {
                    return state.movementX || state.movementY;
                }
            );

            state.movedUp = constructState(
                state.movedUp,
                prevState.movedUp.pressed,
                movedTimeStamp,
                function () {
                    return state.moved.pressed && state.movementY < 0;
                }
            );

            state.movedDown = constructState(
                state.movedDown,
                prevState.movedDown.pressed,
                movedTimeStamp,
                function () {
                    return state.moved.pressed && state.movementY > 0;
                }
            );

            state.movedLeft = constructState(
                state.movedLeft,
                prevState.movedLeft.pressed,
                movedTimeStamp,
                function () {
                    return state.moved.pressed && state.movementX < 0;
                }
            );

            state.movedRight = constructState(
                state.movedRight,
                prevState.movedRight.pressed,
                movedTimeStamp,
                function () {
                    return state.moved.pressed && state.movementX > 0;
                }
            );

            // calculate wheel movement
            state.wheelMoved = constructState(
                state.wheelMoved,
                prevState.wheelMoved.pressed,
                wheelMovedTimeStamp,
                function () {
                    return state.movementX || state.movementY;
                }
            );

            state.wheelMovedUp = constructState(
                state.wheelMovedUp,
                prevState.wheelMovedUp.pressed,
                wheelMovedTimeStamp,
                function () {
                    return state.wheelMoved.pressed && state.movementY < 0;
                }
            );

            state.wheelMovedDown = constructState(
                state.wheelMovedDown,
                prevState.wheelMovedDown.pressed,
                wheelMovedTimeStamp,
                function () {
                    return state.wheelMoved.pressed && state.movementY > 0;
                }
            );

            state.wheelMovedLeft = constructState(
                state.wheelMovedLeft,
                prevState.wheelMovedLeft.pressed,
                wheelMovedTimeStamp,
                function () {
                    return state.wheelMoved.pressed && state.movementX < 0;
                }
            );

            state.wheelMovedRight = constructState(
                state.wheelMovedRight,
                prevState.wheelMovedRight.pressed,
                wheelMovedTimeStamp,
                function () {
                    return state.wheelMoved.pressed && state.movementX > 0;
                }
            );

            wheelMovedTimeStamp = 0;
            movedTimeStamp = 0;
            prevState = _.cloneDeep(state); // copy bufferState to state
        }
    });
})();