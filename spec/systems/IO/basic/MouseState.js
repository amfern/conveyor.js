'use strict';

describe('mouseState', function () {
    var state, IOmouse, evt, evt2, evt3, evt4,
        wheelEvt, wheelEvt2;

    // add reading system
    beforeEach(function () {
        tapIntoSystem('MouseState', function (s) { state = s; });
        tapIntoSystem('Mouse', function (s) { IOmouse = s; });
        CONV.cycleOnce();
    });

    // reset mouse position to 0,0 after each test
    afterEach(function () {
        mouseMoveEvent(0, 0, 0, 0);
        CONV.cycleOnce(); // cycle again to flush any HID states
        // reset mouse state
        resetMouseState(state);
        resetIOMouse(IOmouse);
    });

    // do just a normal event dispatch test with helpers and include clientX and clientY
    it('should fill state correctly', function () {
        evt = mouseEvent('mousemove', 1, 2, 3, 4, 0, 0, 8, 9);
        wheelEvt = wheelEvent(5, 6);

        CONV.cycleOnce(function () {
            expect(state).toEqual({
                moved: {
                    down: evt.timeStamp,
                    up: 0,
                    pressed: true
                },
                movedUp: {
                    down: 0,
                    up: 0,
                    pressed: false
                },
                movedDown: {
                    down: evt.timeStamp,
                    up: 0,
                    pressed: true
                },
                movedRight: {
                    down: evt.timeStamp,
                    up: 0,
                    pressed: true
                },
                movedLeft: {
                    down: 0,
                    up: 0,
                    pressed: false
                },
                wheelMoved: {
                    down: wheelEvt.timeStamp,
                    up: 0,
                    pressed: true
                },
                wheelMovedUp: {
                    down: 0,
                    up: 0,
                    pressed: false
                },
                wheelMovedDown: {
                    down: wheelEvt.timeStamp,
                    up: 0,
                    pressed: true
                },
                wheelMovedRight: {
                    down: wheelEvt.timeStamp,
                    up: 0,
                    pressed: true
                },
                wheelMovedLeft: {
                    down: 0,
                    up: 0,
                    pressed: false
                },
                movementX: 8,
                movementY: 9,
                screenX: 1,
                screenY: 2,
                clientX: 3,
                clientY: 4,
                wheelX: 5,
                wheelY: 6,
                wheelMovementX: 5,
                wheelMovementY: 6
            });
        });
    });

    it('should capture mouse move event', function () {
        CONV.cycleContinues([
            function () {
                expect(state).toEqual({
                    moved: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    movedUp: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    movedDown: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    movedRight: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    movedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    wheelMoved: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    wheelMovedUp: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    wheelMovedDown: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    wheelMovedRight: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    wheelMovedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    screenX: 0,
                    screenY: 0,
                    clientX: 0,
                    clientY: 0,
                    movementX: 0,
                    movementY: 0,
                    wheelX: 0,
                    wheelY: 0,
                    wheelMovementX: 0,
                    wheelMovementY: 0
                });

                _(100000).times(function () {});
                evt = mouseMoveEvent(10, 20, 15, 25);
                _.times(100000, function () {});
                wheelEvt = wheelEvent(20, 30);
            },
            function () {
                expect(state).toEqual({
                    moved: {
                        down: evt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    movedUp: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    movedDown: {
                        down: evt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    movedRight: {
                        down: evt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    movedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    wheelMoved: {
                        down: wheelEvt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    wheelMovedUp: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    wheelMovedDown: {
                        down: wheelEvt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    wheelMovedRight: {
                        down: wheelEvt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    wheelMovedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    movementX: 15,
                    movementY: 25,
                    screenX: 10,
                    screenY: 20,
                    clientX: 0,
                    clientY: 0,
                    wheelX: 20,
                    wheelY: 30,
                    wheelMovementX: 20,
                    wheelMovementY: 30
                });
            }
        ]);
    });

    it('should update mouse movement state even if mouse stayed on the same place', function () {
        CONV.cycleContinues([
            function () {
                _.times(100000, function () {});
                evt = mouseMoveEvent(10, 20, 15, 25);
                wheelEvt = wheelEvent(20, 30);
            },
            function () {
                _.times(100000, function () {});
                evt2 = mouseMoveEvent(10, 20, 0, 0);
                wheelEvt2 = wheelEvent(0, 0);
            },
            function () {
                expect(state).toEqual({
                    moved: {
                        down: evt.timeStamp,
                        up: evt.timeStamp,
                        pressed: false
                    },
                    movedUp: {
                        up: 0,
                        down: 0,
                        pressed: false
                    },
                    movedDown: {
                        down: evt.timeStamp,
                        up: evt.timeStamp,
                        pressed: false
                    },
                    movedRight: {
                        down: evt.timeStamp,
                        up: evt.timeStamp,
                        pressed: false
                    },
                    movedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    wheelMoved: {
                        down: wheelEvt.timeStamp,
                        up: wheelEvt.timeStamp,
                        pressed: false
                    },
                    wheelMovedUp: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    wheelMovedDown: {
                        down: wheelEvt.timeStamp,
                        up: wheelEvt.timeStamp,
                        pressed: false
                    },
                    wheelMovedRight: {
                        down: wheelEvt.timeStamp,
                        up: wheelEvt.timeStamp,
                        pressed: false
                    },
                    wheelMovedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    movementX: 0,
                    movementY: 0,
                    screenX: 10,
                    screenY: 20,
                    clientX: 0,
                    clientY: 0,
                    wheelX: 20,
                    wheelY: 30,
                    wheelMovementX: 0,
                    wheelMovementY: 0
                });
            }
        ]);
    });

    it('should aggregate movementXY value if engine hasn\'t looped yet', function () {
        CONV.cycleContinues([
            function () {
                evt = mouseMoveEvent(10, 20, 15, 25);
                _.times(100000, function () {});
                evt2 = mouseMoveEvent(1, 45, 3, 65);
                _.times(100000, function () {});
                wheelEvt = wheelEvent(20, 30);
                _.times(100000, function () {});
                wheelEvt2 = wheelEvent(11, 55);
                _.times(100000, function () {});
            },
            function () {
                expect(state).toEqual({
                    moved: {
                        down: evt2.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    movedUp: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    movedDown: {
                        down: evt2.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    movedRight: {
                        down: evt2.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    movedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    wheelMoved: {
                        down: wheelEvt2.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    wheelMovedUp: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    wheelMovedDown: {
                        down: wheelEvt2.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    wheelMovedRight: {
                        down: wheelEvt2.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    wheelMovedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    movementX: 18,
                    movementY: 90,
                    screenX: 1,
                    screenY: 45,
                    clientX: 0,
                    clientY: 0,
                    wheelX: 31,
                    wheelY: 85,
                    wheelMovementX: 31,
                    wheelMovementY: 85
                });
            }
        ]);
    });

    it('should capture mousemove and mousedown', function () {
        CONV.cycleContinues([
            function () {
                evt = mouseMoveEvent(10, 20, 15, 25);
                _.times(100000, function () {});
                wheelEvt = wheelEvent(20, 30);
                _.times(100000, function () {});
                evt2 = mouseClickEvent(2);
                _.times(100000, function () {});
                evt3 = mouseClickEvent(1);
            },
            function () {
                expect(state).toEqual({
                    moved: {
                        down: evt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    movedUp: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    movedDown: {
                        down: evt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    movedRight: {
                        down: evt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    movedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    wheelMoved: {
                        down: wheelEvt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    wheelMovedUp: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    wheelMovedDown: {
                        down: wheelEvt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    wheelMovedRight: {
                        down: wheelEvt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    wheelMovedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    movementX: 15,
                    movementY: 25,
                    screenX: 10,
                    screenY: 20,
                    clientX: 0,
                    clientY: 0,
                    wheelX: 20,
                    wheelY: 30,
                    wheelMovementX: 20,
                    wheelMovementY: 30,
                    2: {
                        down: evt2.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    1: {
                        down: evt3.timeStamp,
                        up: 0,
                        pressed: true
                    }
                });
            }
        ]);
    });

    it('should prevent default', function () {
        CONV.cycleContinues([
            function () {
                evt = mouseMoveEvent(10, 20, 15, 25);
                wheelEvt = wheelEvent(20, 30);
                evt2 = mouseClickEvent(1);
            },
            function () {
                expect(evt.defaultPrevented).toEqual(true);
                expect(wheelEvt.defaultPrevented).toEqual(true);
                expect(evt2.defaultPrevented).toEqual(true);
            }
        ]);
    });

    it('should capture fresh event input', function () {
        CONV.cycleContinues([
            function () {
                evt = mouseMoveEvent(10, 20, 15, 25);
                wheelEvt = wheelEvent(20, 30);
                _.times(100000, function () {});
                evt2 = mouseClickEvent(1);
            },
            function () {
                expect(state).toEqual({
                    moved: {
                        down: evt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    movedUp: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    movedDown: {
                        down: evt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    movedRight: {
                        down: evt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    movedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    wheelMoved: {
                        down: wheelEvt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    wheelMovedUp: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    wheelMovedDown: {
                        down: wheelEvt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    wheelMovedRight: {
                        down: wheelEvt.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    wheelMovedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    movementX: 15,
                    movementY: 25,
                    screenX: 10,
                    screenY: 20,
                    clientX: 0,
                    clientY: 0,
                    wheelX: 20,
                    wheelY: 30,
                    wheelMovementX: 20,
                    wheelMovementY: 30,
                    1 : {
                        down: evt2.timeStamp,
                        up: 0,
                        pressed: true
                    }
                });
            },
            function () {
                _.times(100000, function () {});
                evt3 = mouseMoveEvent(15, 5, 35, -45);
                wheelEvt2 = wheelEvent(25, -15);
                _.times(100000, function () {});
                evt4 = mouseClickEvent(2);
            },
            function () {
                expect(state).toEqual({
                    moved: {
                        down: evt3.timeStamp,
                        up: evt.timeStamp,
                        pressed: true
                    },
                    movedUp: {
                        down: evt3.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    movedDown: {
                        down: evt.timeStamp,
                        up: evt.timeStamp,
                        pressed: false
                    },
                    movedRight: {
                        down: evt3.timeStamp,
                        up: evt.timeStamp,
                        pressed: true
                    },
                    movedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    wheelMoved: {
                        down: wheelEvt2.timeStamp,
                        up: wheelEvt.timeStamp,
                        pressed: true
                    },
                    wheelMovedUp: {
                        down: wheelEvt2.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    wheelMovedDown: {
                        down: wheelEvt.timeStamp,
                        up: wheelEvt.timeStamp,
                        pressed: false
                    },
                    wheelMovedRight: {
                        down: wheelEvt2.timeStamp,
                        up: wheelEvt.timeStamp,
                        pressed: true
                    },
                    wheelMovedLeft: {
                        down: 0,
                        up: 0,
                        pressed: false
                    },
                    movementX: 35,
                    movementY: -45,
                    screenX: 15,
                    screenY: 5,
                    clientX: 0,
                    clientY: 0,
                    wheelX: 45,
                    wheelY: 15,
                    wheelMovementX: 25,
                    wheelMovementY: -15,
                    1 : {
                        down: evt2.timeStamp,
                        up: 0,
                        pressed: true
                    },
                    2 : {
                        down: evt4.timeStamp,
                        up: 0,
                        pressed: true
                    }
                });
            }
        ]);
    });
});
