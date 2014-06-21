'use strict';

// Collects Mouse inputs state, collection of keycodes that currently pressed,
// if its not true then it false and its up.
// -----------------------------------------
(function () {
    var defaultHidState = {
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
        };

    // constructs state for mouseMove[...] states
    function constructState(mouseState, timeStamp, directionCheck) {
        mouseState = mouseState || {};

        // update up timestamp only if state changed to pressed from not pressed
        if (directionCheck()) {
            return {
                pressed: true,
                down: mouseState.pressed ? mouseState.down : timeStamp,
                up: mouseState.up
            };
        }
     
        // update down timestamp only if state changed to not pressed from pressed
        return {
            pressed: false,
            down: mouseState.down,
            up: mouseState.pressed ? mouseState.down : mouseState.up
        };
    }

    // MouseState
    new COMP.System.Logic({
        name: 'MouseState',
        isStatic: true,
        dependencies: [],

        component: function () {
            return state;
        },

        process: function (staticEntity) {
            var Mouse = staticEntity.Mouse;

            _.extend(state, _.omit(Mouse,[
                'movementX',
                'movementY',
                'screenX',
                'screenY',
                'clientX',
                'clientY',
                'wheelX',
                'wheelY',
            ]));

            // calculate movement
            state.movementX = Mouse.screenX - state.screenX;
            state.movementY = Mouse.screenY - state.screenY;

            state.wheelMovementX = Mouse.wheelX - state.wheelX;
            state.wheelMovementY = Mouse.wheelY - state.wheelY;

            state.screenX = Mouse.screenX;
            state.screenY = Mouse.screenY;
            state.wheelX = Mouse.wheelX;
            state.wheelY = Mouse.wheelY;

            // calculate mouse movement
            state.moved = constructState(
                state.moved,
                Mouse.movedTimeStamp,
                function () {
                    return state.movementX || state.movementY;
                }
            );

            state.movedUp = constructState(
                state.movedUp,
                Mouse.movedTimeStamp,
                function () {
                    return state.moved.pressed && state.movementY < 0;
                }
            );

            state.movedDown = constructState(
                state.movedDown,
                Mouse.movedTimeStamp,
                function () {
                    return state.moved.pressed && state.movementY > 0;
                }
            );

            state.movedLeft = constructState(
                state.movedLeft,
                Mouse.movedTimeStamp,
                function () {
                    return state.moved.pressed && state.movementX < 0;
                }
            );

            state.movedRight = constructState(
                state.movedRight,
                Mouse.movedTimeStamp,
                function () {
                    return state.moved.pressed && state.movementX > 0;
                }
            );

            // calculate wheel movement
            state.wheelMoved = constructState(
                state.wheelMoved,
                Mouse.wheelMovedTimeStamp,
                function () {
                    return state.wheelMovementX || state.wheelMovementY;
                }
            );

            state.wheelMovedUp = constructState(
                state.wheelMovedUp,
                Mouse.wheelMovedTimeStamp,
                function () {
                    return state.wheelMoved.pressed && state.wheelMovementY < 0;
                }
            );

            state.wheelMovedDown = constructState(
                state.wheelMovedDown,
                Mouse.wheelMovedTimeStamp,
                function () {
                    return state.wheelMoved.pressed && state.wheelMovementY > 0;
                }
            );

            state.wheelMovedLeft = constructState(
                state.wheelMovedLeft,
                Mouse.wheelMovedTimeStamp,
                function () {
                    return state.wheelMoved.pressed && state.wheelMovementX < 0;
                }
            );

            state.wheelMovedRight = constructState(
                state.wheelMovedRight,
                Mouse.wheelMovedTimeStamp,
                function () {
                    return state.wheelMoved.pressed && state.wheelMovementX > 0;
                }
            );
        }
    });
})();