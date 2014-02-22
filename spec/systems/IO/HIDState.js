'use strict';

describe('HIDState', function () {
    var state, keyboardState, mouseState, evt, evt2, evt3, wheelEvt;

    // add reading system
    beforeEach(function () {
        tapIntoSystem('HIDState', function (s) {
            state = s;
        });
        
        tapIntoSystem('KeyboardState', function (s) {
            keyboardState = s;
        });

        tapIntoSystem('MouseState', function (s) {
            mouseState = s;
        });
    });

    afterEach(function () {
        COMP.cycleOnce();
        _.clearAll(keyboardState);
        resetMouseState(mouseState);
        _.clearAll(state);
    });

    it('should capture HID state of mouseMove, mouseClick, keydown', function () {
        COMP.cycleContinues([
            function () {
                expect(state).toEqual({
                    mmoved: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mmovedUp: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mmovedDown: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mmovedRight: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mmovedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mwheelMoved: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mwheelMovedUp: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mwheelMovedDown: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mwheelMovedRight: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mwheelMovedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mmovementX: 0,
                    mmovementY: 0,
                    mscreenX: 0,
                    mscreenY: 0,
                    mclientX: 0,
                    mclientY: 0,
                    mwheelX: 0,
                    mwheelY: 0,
                    mwheelMovementX: 0,
                    mwheelMovementY: 0
                });

                evt = mouseMoveEvent(10, 20);
                wheelEvt = wheelEvent(20, 30);
                evt2 = mouseClickEvent(0);
                evt3 = keydownEvent(13);
            },
            function () {
                expect(state).toEqual({
                    k13: {
                        down: evt3.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    m0: {
                        down: evt2.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    mmoved: {
                        down: evt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    mmovedUp: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mmovedDown: {
                        down: evt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    mmovedRight: {
                        down: evt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    mmovedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mwheelMoved: {
                        down: wheelEvt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    mwheelMovedUp: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mwheelMovedDown: {
                        down: wheelEvt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    mwheelMovedRight: {
                        down: wheelEvt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    mwheelMovedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mmovementX: 10,
                    mmovementY: 20,
                    mscreenX: 10,
                    mscreenY: 20,
                    mclientX: 0,
                    mclientY: 0,
                    mwheelX: 20,
                    mwheelY: 30,
                    mwheelMovementX: 20,
                    mwheelMovementY: 30
                });
            },
            function () {
                expect(state).toEqual({
                    k13: {
                        down: evt3.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    m0: {
                        down: evt2.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    mmoved: {
                        down: evt.timeStamp,
                        up: evt2.timeStamp,
                        pressed: false
                    },
                    mmovedUp: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mmovedDown: {
                        down: evt.timeStamp,
                        up: evt.timeStamp,
                        pressed: false
                    },
                    mmovedRight: {
                        down: evt.timeStamp,
                        up: evt.timeStamp,
                        pressed: false
                    },
                    mmovedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mwheelMoved: {
                        down: wheelEvt.timeStamp,
                        up: wheelEvt.timeStamp,
                        pressed: false
                    },
                    mwheelMovedUp: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mwheelMovedDown: {
                        down: wheelEvt.timeStamp,
                        up: wheelEvt.timeStamp,
                        pressed: false
                    },
                    mwheelMovedRight: {
                        down: wheelEvt.timeStamp,
                        up: wheelEvt.timeStamp,
                        pressed: false
                    },
                    mwheelMovedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    mmovementX: 0,
                    mmovementY: 0,
                    mscreenX: 10,
                    mscreenY: 20,
                    mclientX: 0,
                    mclientY: 0,
                    mwheelX: 20,
                    mwheelY: 30,
                    mwheelMovementX: 0,
                    mwheelMovementY: 0
                });
            }
        ]);
    });
});