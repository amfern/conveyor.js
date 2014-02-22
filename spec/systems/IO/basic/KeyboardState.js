'use strict';

describe('keyboardState', function () {
    var state, evt, evt2, evt3;

    // add reading system
    beforeEach(function () {
        tapIntoSystem('KeyboardState', function (s) {
            state = s;
        });
        COMP.cycleOnce();
    });

    afterEach(function () {
        _.clearAll(state);
    });

    describe('keyboardState', function () {

        it('should capture keydowns', function () {
            COMP.cycleContinues([

                function () {
                    evt = keydownEvent(13);
                },
                function () {
                    expect(state).toEqual({
                        13: {
                            down: evt.timeStamp,
                            up: 0,
                            pressed: true
                        }
                    });
                }
            ]);
        });

        it('should capture keyups', function () {
            COMP.cycleContinues([

                function () {
                    evt = keyupEvent(13);
                },
                function () {
                    expect(state).toEqual({
                        13: {
                            down: 0,
                            up: evt.timeStamp,
                            pressed: false
                        }
                    });
                }
            ]);
        });

        it('should keep the states after cycle', function () {
            COMP.cycleContinues([

                function () {
                    evt = keydownEvent(13);
                    evt2 = keydownEvent(14);
                },
                function () {
                    evt3 = keyupEvent(13);
                },
                function () {
                    expect(state).toEqual({
                        13: {
                            down: evt.timeStamp,
                            up: evt3.timeStamp,
                            pressed: false
                        },
                        14: {
                            down: evt2.timeStamp,
                            up: 0,
                            pressed: true
                        }
                    });
                }
            ]);
        });
    });

    it('should capture keydowns', function () {
        COMP.cycleContinues([

            function () {
                evt = keydownEvent(36);
            },
            function () {
                expect(evt.defaultPrevented).toEqual(true);
            }
        ]);
    });
});