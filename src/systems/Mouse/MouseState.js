'use strict';

// Collection of keys represents mousestate
//
// key   - unique key indentifier(keycode)
// value - {
//              up        : timestamp of last time key was up
//              down      : timestamp of last time key was down
//              pressed   : bool current key press state
//          }
// it also comes with predefined keys for mouse raw data and wheel raw data
// and their directional movement states
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
    function constructState(mouse, timeStamp, directionCheck) {
        mouse = mouse || {};

        // update up timestamp only if state changed to pressed from not pressed
        if (directionCheck()) {
            return {
                pressed: true,
                down: mouse.pressed ? mouse.down : timeStamp,
                up: mouse.up
            };
        }

        // update down timestamp only if state changed to not pressed from pressed
        return {
            pressed: false,
            down: mouse.down,
            up: mouse.pressed ? mouse.down : mouse.up
        };
    }

    // MouseState
    new CONV.System.Logic({
        name: 'MouseState',
        isStatic: true,
        dependencies: [],

        component: function () {
            return state;
        },

        process: function (staticEntity) {
            var Mouse = staticEntity.Mouse;

            _.extend(state, _.omit(Mouse, [
                'movementX',
                'movementY',
                'screenX',
                'screenY',
                'clientX',
                'clientY',
                'wheelX',
                'wheelY',
                'timeStamp',
                'wheelTimeStamp'
            ]));

            // calculate movement
            state.movementX = Mouse.screenX - state.screenX;
            state.movementY = Mouse.screenY - state.screenY;

            state.wheelMovementX = Mouse.wheelX - state.wheelX;
            state.wheelMovementY = Mouse.wheelY - state.wheelY;

            _.extend(state, _.pick(Mouse, ['clientX', 'clientY', 'screenX', 'screenY', 'wheelX', 'wheelY']));

            // calculate mouse movement
            state.moved = constructState(
                state.moved,
                Mouse.timeStamp,
                function () {
                    return state.movementX || state.movementY;
                }
            );

            state.movedUp = constructState(
                state.movedUp,
                Mouse.timeStamp,
                function () {
                    return state.moved.pressed && state.movementY < 0;
                }
            );

            state.movedDown = constructState(
                state.movedDown,
                Mouse.timeStamp,
                function () {
                    return state.moved.pressed && state.movementY > 0;
                }
            );

            state.movedLeft = constructState(
                state.movedLeft,
                Mouse.timeStamp,
                function () {
                    return state.moved.pressed && state.movementX < 0;
                }
            );

            state.movedRight = constructState(
                state.movedRight,
                Mouse.timeStamp,
                function () {
                    return state.moved.pressed && state.movementX > 0;
                }
            );

            // calculate wheel movement
            state.wheelMoved = constructState(
                state.wheelMoved,
                Mouse.wheelTimeStamp,
                function () {
                    return state.wheelMovementX || state.wheelMovementY;
                }
            );

            state.wheelMovedUp = constructState(
                state.wheelMovedUp,
                Mouse.wheelTimeStamp,
                function () {
                    return state.wheelMoved.pressed && state.wheelMovementY < 0;
                }
            );

            state.wheelMovedDown = constructState(
                state.wheelMovedDown,
                Mouse.wheelTimeStamp,
                function () {
                    return state.wheelMoved.pressed && state.wheelMovementY > 0;
                }
            );

            state.wheelMovedLeft = constructState(
                state.wheelMovedLeft,
                Mouse.wheelTimeStamp,
                function () {
                    return state.wheelMoved.pressed && state.wheelMovementX < 0;
                }
            );

            state.wheelMovedRight = constructState(
                state.wheelMovedRight,
                Mouse.wheelTimeStamp,
                function () {
                    return state.wheelMoved.pressed && state.wheelMovementX > 0;
                }
            );
        }
    });
})();
