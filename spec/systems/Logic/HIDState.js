'use strict';

describe('HIDState', function () {
    var state, IOkeyboard, IOmouse, keyboardState, mouseState, evt, evt2, evt3, wheelEvt;

    // add reading system
    beforeEach(function () {
        tapIntoSystem('Keyboard', function (s) {
            IOkeyboard = s;
        });

        tapIntoSystem('Mouse', function (s) {
            IOmouse = s;
        });

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
        mouseMoveEvent(0, 0, 0, 0);
        CONV.cycleOnce();
        _.clearAll(IOkeyboard);
        _.clearAll(keyboardState);
        resetIOMouse(IOmouse);
        resetMouseState(mouseState);
        _.clearAll(state);
        CONV.cycleOnce();
    });

    it('should capture HID state of mouseMove, mouseClick, keydown', function () {
        CONV.cycleContinues([
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

                evt = mouseMoveEvent(10, 20, 25, 35);
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
                    mmovementX: 25,
                    mmovementY: 35,
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
                    mmovementX: 0,
                    mmovementY: 0,
                    mscreenX: 10,
                    mscreenY: 20,
                    mclientX: 0,
                    mclientY: 0,
                    mmovedUp: {
                        pressed: false,
                        down: 0,
                        up: 0
                    },
                    mmovedDown: {
                        pressed: false,
                        down: evt.timeStamp,
                        up: evt.timeStamp
                    },
                    mmovedLeft: {
                        pressed: false,
                        down: 0,
                        up: 0
                    },
                    mmovedRight: {
                        down: evt.timeStamp,
                        up: evt.timeStamp,
                        pressed: false
                    },
                    mmoved: {
                        pressed: false,
                        down: evt.timeStamp,
                        up: evt.timeStamp
                    },
                    mwheelX: 20,
                    mwheelY: 30,
                    mwheelMovementX: 0,
                    mwheelMovementY: 0,
                    mwheelMovedUp: {
                        pressed: false,
                        down: 0,
                        up: 0
                    },
                    mwheelMovedDown: {
                        pressed: false,
                        down: wheelEvt.timeStamp,
                        up: wheelEvt.timeStamp
                    },
                    mwheelMovedLeft: {
                        pressed: false,
                        down: 0,
                        up: 0
                    },
                    mwheelMovedRight: {
                        pressed: false,
                        down: wheelEvt.timeStamp,
                        up: wheelEvt.timeStamp
                    },
                    mwheelMoved: {
                        pressed: false,
                        down: wheelEvt.timeStamp,
                        up: wheelEvt.timeStamp
                    }
                });
            }
        ]);
    });
});
