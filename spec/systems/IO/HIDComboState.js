'use strict';

describe('HIDComboState', function () {
    var state, keyboardState,
        handler, handler2, handler3;

    // add reading system
    beforeEach(function () {
        tapIntoSystem('HIDComboState', function (s) {
            state = s;
        });
        tapIntoSystem('KeyboardState', function (s) {
            keyboardState = s;
        });
        COMP.cycleOnce(); // cycle to get HIDComboState state
    });

    // reset mouse movement after each test
    afterEach(function () {
        COMP.cycleOnce(); // cycle again to flush any HID states
        _.clearAll(keyboardState);
    });

    it('Should throw exception for empty keys', function () {
        expect(state.register.bind(null, {})).toThrow('empty keys combination');
        expect(state.register.bind(null, {
            keys: []
        })).toThrow('empty keys combination');
    });

    describe('', function () {
        afterEach(function () {
            state.unregister(handler); // Should unregister combo
            state.unregister(handler2);
            state.unregister(handler3);
        });

        describe('register combo', function () {
            it('Should register the combo and return handler', function () {
                handler = state.register({
                    keys: ['k1', 'k2', 'k3'],
                    trigger: 'down',
                    isOnce: false,
                    isOrdered: false,
                    isSequence: false,
                    isExclusive: false,
                    isSolitary: false
                });

                expect(handler).toBeDefined();
            });

            // hmm i don't really have a way of telling if default values were filled
            it('should fill in default values', function () {
                handler = state.register({
                    keys: ['k1', 'k2', 'k3']
                });

                expect(handler).toBeDefined();
            });

            it('should throw exception for existing combo', function () {
                handler = state.register({
                    keys: ['k1', 'k2', 'k3']
                });

                expect(handler).toBeDefined();
                expect(state.register.bind(null, {
                    keys: ['k1', 'k2', 'k3']
                })).toThrow('"k1,k2,k3" combo already exists');
            });
        });

        describe('should trigger', function () {
            describe('unordered combo', function () {
                it('keydown', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);
                        },
                        function () {
                            // expect the combo to be triggered after engine cycle as it is not once combo
                            expect(state.isTriggered(handler)).toBe(true);

                            // remove one key
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        }
                    ]);
                });

                it('keyup', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);

                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(2);

                        },
                        function () {
                            // expect the combo to be
                            expect(state.isTriggered(handler)).toBe(true);
                        },
                        function () {
                            // expect the combo to be triggered after engine cycle as it is not once combo
                            expect(state.isTriggered(handler)).toBe(true);

                            // remove one key
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(true);
                        }
                    ]);
                });

                it('release', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);

                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be
                            expect(state.isTriggered(handler)).toBe(true);
                        },
                        function () {
                            // expect the combo to be triggered after engine cycle as it is not once combo
                            expect(state.isTriggered(handler)).toBe(true);

                            // remove one key
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        }
                    ]);
                });
            });

            describe('ordered combo', function () {
                it('keydown', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);

                            // trigger combo again in different order
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(true);

                            // remove one key
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        }
                    ]);
                });

                it('keyup', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);

                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(true);

                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        }
                    ]);
                });

                it('release', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(true);

                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        }
                    ]);
                });
            });

            describe('ordered sequence combo', function () {
                it('keydown', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo again in sequence
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(4);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);

                            // trigger combo again in different order
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(true);

                            // remove one key
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        }
                    ]);
                });

                it('keyup', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);

                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(true);

                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        }
                    ]);
                });

                it('release', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(true);

                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        }
                    ]);
                });
            });

            describe('unordered combo and keep triggered', function () {
                it('keydown', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo
                            keydownEvent(1);
                        },
                        function () {
                            // combos shouldn't be triggered because keys doesn't match any of them
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // only one combo is expected to be triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect all combos to be triggered
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);
                        }
                    ]);
                });

                it('keyup', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // combos shouldn't be triggered because keys doesn't match any of them
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keyupEvent(1);
                        },
                        function () {
                            // combos shouldn't be triggered because keys doesn't match any of them
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(true);

                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // only one combo is expected to be triggered
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect all combos to be triggered
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);
                        }
                    ]);
                });

                it('release', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // combos shouldn't be triggered because keys doesn't match any of them
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keyupEvent(1);
                        },
                        function () {
                            // combos shouldn't be triggered because keys doesn't match any of them
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // only one combo is expected to be triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect all combos to be triggered
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);
                        }
                    ]);
                });
            });

            describe('ordered combo and keep triggered', function () {
                it('keydown', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keydownEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);
                        }
                    ]);
                });

                it('keyup', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keyupEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);
                        }
                    ]);
                });

                it('release', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keyupEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);
                        }
                    ]);
                });
            });

            describe('ordered combo sequence and keep triggered', function () {
                it('keydown', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keydownEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order and in sequence
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(4);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);
                        }
                    ]);
                });

                it('keyup', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keyupEvent(1);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order and in sequence
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(4);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);
                        }
                    ]);
                });

                it('release', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keyupEvent(1);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order and in sequence
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(4);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);
                        }
                    ]);
                });
            });
        });

        describe('should trigger once', function () {
            beforeEach(function () {
                COMP.afterCycleContinues([

                    function () {
                        // expect the combo to be triggered
                        expect(state.isTriggered(handler)).toBe(false);
                    },
                    function () {
                        // double check it is not triggered
                        expect(state.isTriggered(handler)).toBe(false);
                    },
                    function () {
                        // triple  check it is not triggered
                        expect(state.isTriggered(handler)).toBe(false);
                    }
                ]);
            });

            describe('unordered combos', function () {
                it('keydown', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: true,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // double check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // remove one key
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);
                        }
                    ]);
                });

                it('keyup', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: true,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // double check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // remove one key
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // re-trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);
                        }
                    ]);
                });

                it('release', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: true,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // double check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // remove one key
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // re-trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            keyupEvent(1);
                            keyupEvent(3);
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);
                        }
                    ]);
                });
            });

            describe('ordered combos', function () {
                it('keydown', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: true,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // double check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // remove one key
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered because not in order
                            expect(state.isTriggered(handler)).toBe(false);
                            // remove one key
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered because now it is in order
                            expect(state.isTriggered(handler)).toBe(true);
                        }
                    ]);
                });

                it('keyup', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: true,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // double check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // remove one key
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered because not in order
                            expect(state.isTriggered(handler)).toBe(false);
                            // remove one key
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered because now it is in order
                            expect(state.isTriggered(handler)).toBe(true);
                        }
                    ]);
                });

                it('release', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: true,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // double check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // remove one key
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered because not in order
                            expect(state.isTriggered(handler)).toBe(false);

                            // remove one key
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered because now it is in order
                            expect(state.isTriggered(handler)).toBe(true);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // double check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered because now it is in order
                            expect(state.isTriggered(handler)).toBe(false);
                        }
                    ]);
                });
            });

            describe('ordered sequence combos', function () {
                it('keydown', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: true,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered because not in sequence
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // double check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // remove one key
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered because not in order
                            expect(state.isTriggered(handler)).toBe(false);
                            // remove one key
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered because now it is in order
                            expect(state.isTriggered(handler)).toBe(true);
                        }
                    ]);
                });

                it('keyup', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: true,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered because not in sequence
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // double check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // remove one key
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered because not in order
                            expect(state.isTriggered(handler)).toBe(false);
                            // remove one key
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered because now it is in order
                            expect(state.isTriggered(handler)).toBe(true);
                        }
                    ]);
                });

                it('release', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: true,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered because not in sequence
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expect(state.isTriggered(handler)).toBe(true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // double check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // remove one key
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered because not in order
                            expect(state.isTriggered(handler)).toBe(false);
                            // remove one key
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered because now it is in order
                            expect(state.isTriggered(handler)).toBe(true);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expect(state.isTriggered(handler)).toBe(false);
                        },
                        function () {
                            // double check it is not triggered
                            expect(state.isTriggered(handler)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered because now it is in order
                            expect(state.isTriggered(handler)).toBe(false);
                        }
                    ]);
                });
            });
        });

        describe('should trigger exclusive', function () {
            describe('unordered combos', function () {
                it('keydown', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });

                it('keyup', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });

                it('release', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });
            });

            describe('ordered combos', function () {
                it('keydown', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keydownEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });

                it('keyup', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keyupEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });

                it('release', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keyupEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });
            });

            describe('ordered sequence combos', function () {
                it('keydown', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keydownEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(4);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });

                it('keyup', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keyupEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(4);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });

                it('release', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keyupEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(4);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(true);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });
            });

            describe('once', function () {
                describe('unordered combos', function () {
                    it('keydown', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keydownEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(true);
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });

                    it('keyup', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keydownEvent(1);
                                _(100000).times(function () {});
                                // trigger combo
                                keydownEvent(2);
                                _(100000).times(function () {});
                                // trigger combo
                                keydownEvent(4);
                                _(100000).times(function () {});
                                // trigger combo
                                keydownEvent(3);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(true);

                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });

                    it('release', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keydownEvent(1);
                                _(100000).times(function () {});
                                // trigger combo
                                keydownEvent(2);
                                _(100000).times(function () {});
                                // trigger combo
                                keydownEvent(4);
                                _(100000).times(function () {});
                                // trigger combo
                                keydownEvent(3);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(true);

                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });
                });

                describe('ordered combos', function () {
                    it('keydown', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(true);

                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(true);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(1);
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);
                            }
                        ]);
                    });

                    it('keydup', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(3);
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(true);

                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                                _(100000).times(function () {});
                                keyupEvent(4);
                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(true);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);
                            }
                        ]);
                    });

                    it('release', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(3);
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(true);

                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                                _(100000).times(function () {});
                                keyupEvent(4);
                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(true);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);
                            }
                        ]);
                    });
                });

                describe('ordered sequence combos', function () {
                    it('keydown', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(true);

                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);
                            }
                        ]);
                    });

                    it('keyup', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(3);
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(true);

                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                                _(100000).times(function () {});
                                keyupEvent(4);
                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(true);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(true);
                            }
                        ]);
                    });

                    it('release', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                });

                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(3);
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(true);

                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                                _(100000).times(function () {});
                                keyupEvent(4);
                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);
                            }
                        ]);
                    });
                });
            });
        });

        describe('should trigger solitary', function () {
            describe('unordered combos', function () {
                it('keydown', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });

                it('keyup', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            state.unregister(handler);

                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });

                it('release', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo
                            keyupEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            state.unregister(handler);

                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });
            });

            describe('unordered combos', function () {
                it('keydown', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keydownEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });

                it('keyup', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keyupEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            state.unregister(handler);

                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });

                it('release', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keyupEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            state.unregister(handler);

                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(false);

                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });
            });

            describe('ordered sequence combos', function () {
                it('keydown', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keydownEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(true);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });

                it('keyup', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keyupEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            state.unregister(handler);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });

                it('release', function () {
                    COMP.cycleContinues([

                        function () {
                            // register combo
                            handler = state.register({
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler2 = state.register({
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // register combo
                            handler3 = state.register({
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            });

                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo
                            keydownEvent(3);
                            _(100000).times(function () {});
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(4);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            keyupEvent(1);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(3);
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);

                            state.unregister(handler);

                            // trigger combo
                            keydownEvent(1);
                            _(100000).times(function () {});
                            keydownEvent(2);
                            _(100000).times(function () {});
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(true);
                            expect(state.isTriggered(handler3)).toBe(false);

                            // trigger combo again in different order
                            _(100000).times(function () {});
                            keyupEvent(1);
                            _(100000).times(function () {});
                            keyupEvent(2);
                            _(100000).times(function () {});
                            keyupEvent(4);
                            _(100000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expect(state.isTriggered(handler)).toBe(false);
                            expect(state.isTriggered(handler2)).toBe(false);
                            expect(state.isTriggered(handler3)).toBe(false);
                        }
                    ]);
                });
            });

            describe('once', function () {
                describe('unordered combos', function () {
                    it('keydown', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keydownEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(1);
                                keyupEvent(2);
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(2);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);

                                state.unregister(handler2);
                                keydownEvent(3);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });

                    it('keyup', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(1);
                                keydownEvent(2);
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(2);
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                state.unregister(handler);
                                keyupEvent(3);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });

                    it('release', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(1);
                                keydownEvent(2);
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(2);
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);

                                state.unregister(handler);
                                keyupEvent(3);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });
                });

                describe('unordered combos', function () {
                    it('keydown', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(1);
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);

                                state.unregister(handler2);
                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });

                    it('keyup', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(3);
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                                _(100000).times(function () {});
                                keyupEvent(4);
                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);

                                state.unregister(handler2);
                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });

                    it('release', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(3);
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                                _(100000).times(function () {});
                                keyupEvent(4);
                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);

                                state.unregister(handler2);
                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });
                });

                describe('ordered sequence combos', function () {
                    it('keydown', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(1);
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);

                                state.unregister(handler2);
                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });

                    it('keyup', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(3);
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                                _(100000).times(function () {});
                                keyupEvent(4);
                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(1);
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                state.unregister(handler2);
                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });

                    it('release', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(3);
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                                _(100000).times(function () {});
                                keyupEvent(4);
                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(1);
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);

                                state.unregister(handler2);
                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });
                });
            });

            describe('exclusive', function () {
                describe('unordered combos', function () {
                    it('keydown', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keydownEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });

                    it('keyup', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });

                    it('release', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(true);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });
                });

                describe('ordered combos', function () {
                    it('keydown', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });

                    it('keyup', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(1);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(3);
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                                _(100000).times(function () {});
                                keyupEvent(4);
                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });

                    it('release', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(1);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(3);
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                                _(100000).times(function () {});
                                keyupEvent(4);
                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });
                });

                describe('ordered sequence combos', function () {
                    it('keydown', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);
                            }
                        ]);
                    });

                    it('keyup', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(3);
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                                _(100000).times(function () {});
                                keyupEvent(4);
                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(true);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);
                            }
                        ]);
                    });

                    it('release', function () {
                        COMP.cycleContinues([

                            function () {
                                // register combo
                                handler = state.register({
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler2 = state.register({
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // register combo
                                handler3 = state.register({
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                });

                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo
                                keydownEvent(3);
                                _(100000).times(function () {});
                                keydownEvent(1);
                                _(100000).times(function () {});
                                keydownEvent(4);
                                _(100000).times(function () {});
                                keydownEvent(2);
                                _(100000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keyupEvent(1);
                                _(100000).times(function () {});
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(3);
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);

                                // trigger combo again in different order
                                _(100000).times(function () {});
                                keyupEvent(1);
                                _(100000).times(function () {});
                                keyupEvent(2);
                                _(100000).times(function () {});
                                keyupEvent(4);
                                _(100000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(false);

                                _(100000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expect(state.isTriggered(handler)).toBe(false);
                                expect(state.isTriggered(handler2)).toBe(false);
                                expect(state.isTriggered(handler3)).toBe(true);
                            }
                        ]);
                    });
                });

                describe('once', function () {
                    describe('unordered combos', function () {
                        it('keydown', function () {
                            COMP.cycleContinues([

                                function () {
                                    // register combo
                                    handler = state.register({
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler2 = state.register({
                                        keys: ['k3'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler3 = state.register({
                                        keys: ['k1', 'k2'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // expect the combo to be not triggered
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo
                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(true);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keydownEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(true);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                }
                            ]);
                        });

                        it('keyup', function () {
                            COMP.cycleContinues([

                                function () {
                                    // register combo
                                    handler = state.register({
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler2 = state.register({
                                        keys: ['k3'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler3 = state.register({
                                        keys: ['k1', 'k2'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // expect the combo to be not triggered
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo
                                    keydownEvent(3);
                                    _(100000).times(function () {});
                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                    keydownEvent(4);
                                    _(100000).times(function () {});
                                    keydownEvent(2);
                                    _(100000).times(function () {});
                                },
                                function () {
                                    // expect the combo to be not triggered
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo
                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(true);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo
                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                    keydownEvent(2);
                                    _(100000).times(function () {});
                                    keydownEvent(3);
                                    _(100000).times(function () {});
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    state.unregister(handler);

                                    _(100000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(true);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                }
                            ]);
                        });

                        it('release', function () {
                            COMP.cycleContinues([

                                function () {
                                    // register combo
                                    handler = state.register({
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler2 = state.register({
                                        keys: ['k3'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler3 = state.register({
                                        keys: ['k1', 'k2'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // expect the combo to be not triggered
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo
                                    keydownEvent(3);
                                    _(100000).times(function () {});
                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                    keydownEvent(4);
                                    _(100000).times(function () {});
                                    keydownEvent(2);
                                    _(100000).times(function () {});
                                },
                                function () {
                                    // expect the combo to be not triggered
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo
                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(true);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(true);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo
                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                    keydownEvent(2);
                                    _(100000).times(function () {});
                                    keydownEvent(3);
                                    _(100000).times(function () {});
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    state.unregister(handler);

                                    _(100000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(true);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                }
                            ]);
                        });
                    });

                    describe('ordered combos', function () {
                        it('keydown', function () {
                            COMP.cycleContinues([

                                function () {
                                    // register combo
                                    handler = state.register({
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler2 = state.register({
                                        keys: ['k3'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler3 = state.register({
                                        keys: ['k1', 'k2'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // expect the combo to be not triggered
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo again in different order
                                    _(100000).times(function () {});
                                    keydownEvent(3);
                                    _(100000).times(function () {});
                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                    keydownEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo again in different order
                                    _(100000).times(function () {});
                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                    keydownEvent(2);
                                    _(100000).times(function () {});
                                    keydownEvent(4);
                                    _(100000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(true);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                    keydownEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(true);
                                }
                            ]);
                        });

                        it('keyup', function () {
                            COMP.cycleContinues([

                                function () {
                                    // register combo
                                    handler = state.register({
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler2 = state.register({
                                        keys: ['k3'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler3 = state.register({
                                        keys: ['k1', 'k2'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // expect the combo to be not triggered
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo
                                    keydownEvent(3);
                                    _(100000).times(function () {});
                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                    keydownEvent(4);
                                    _(100000).times(function () {});
                                    keydownEvent(2);
                                    _(100000).times(function () {});
                                },
                                function () {
                                    // expect the combo to be not triggered
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(true);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo again in different order
                                    _(100000).times(function () {});
                                    keyupEvent(3);
                                    _(100000).times(function () {});
                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(true);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo again in different order
                                    _(100000).times(function () {});
                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                    keyupEvent(2);
                                    _(100000).times(function () {});
                                    keyupEvent(4);
                                    _(100000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    keydownEvent(1);
                                    keydownEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(true);
                                }
                            ]);
                        });

                        it('release', function () {
                            COMP.cycleContinues([

                                function () {
                                    // register combo
                                    handler = state.register({
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler2 = state.register({
                                        keys: ['k3'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler3 = state.register({
                                        keys: ['k1', 'k2'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // expect the combo to be not triggered
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo
                                    keydownEvent(3);
                                    _(100000).times(function () {});
                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                    keydownEvent(4);
                                    _(100000).times(function () {});
                                    keydownEvent(2);
                                    _(100000).times(function () {});
                                },
                                function () {
                                    // expect the combo to be not triggered
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo again in different order
                                    _(100000).times(function () {});
                                    keyupEvent(3);
                                    _(100000).times(function () {});
                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo again in different order
                                    _(100000).times(function () {});
                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                    keyupEvent(2);
                                    _(100000).times(function () {});
                                    keyupEvent(4);
                                    _(100000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(true);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    keydownEvent(1);
                                    keydownEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(true);
                                }
                            ]);
                        });
                    });

                    describe('ordered sequence combos', function () {
                        it('keydown', function () {
                            COMP.cycleContinues([

                                function () {
                                    // register combo
                                    handler = state.register({
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler2 = state.register({
                                        keys: ['k3'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler3 = state.register({
                                        keys: ['k1', 'k2'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // expect the combo to be not triggered
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo again in different order
                                    _(100000).times(function () {});
                                    keydownEvent(3);
                                    _(100000).times(function () {});
                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                    keydownEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo again in different order
                                    _(100000).times(function () {});
                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                    keydownEvent(2);
                                    _(100000).times(function () {});
                                    keydownEvent(4);
                                    _(100000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(true);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                    keydownEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(true);
                                }
                            ]);
                        });

                        it('keyup', function () {
                            COMP.cycleContinues([

                                function () {
                                    // register combo
                                    handler = state.register({
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler2 = state.register({
                                        keys: ['k3'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler3 = state.register({
                                        keys: ['k1', 'k2'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // expect the combo to be not triggered
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo
                                    keydownEvent(3);
                                    _(100000).times(function () {});
                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                    keydownEvent(4);
                                    _(100000).times(function () {});
                                    keydownEvent(2);
                                    _(100000).times(function () {});
                                },
                                function () {
                                    // expect the combo to be not triggered
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(true);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo again in different order
                                    _(100000).times(function () {});
                                    keyupEvent(3);
                                    _(100000).times(function () {});
                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(true);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo again in different order
                                    _(100000).times(function () {});
                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                    keyupEvent(2);
                                    _(100000).times(function () {});
                                    keyupEvent(4);
                                    _(100000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                    keydownEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(true);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                }
                            ]);
                        });

                        it('release', function () {
                            COMP.cycleContinues([

                                function () {
                                    // register combo
                                    handler = state.register({
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler2 = state.register({
                                        keys: ['k3'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // register combo
                                    handler3 = state.register({
                                        keys: ['k1', 'k2'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    });

                                    // expect the combo to be not triggered
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo
                                    keydownEvent(3);
                                    _(100000).times(function () {});
                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                    keydownEvent(4);
                                    _(100000).times(function () {});
                                    keydownEvent(2);
                                    _(100000).times(function () {});
                                },
                                function () {
                                    // expect the combo to be not triggered
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo again in different order
                                    _(100000).times(function () {});
                                    keyupEvent(3);
                                    _(100000).times(function () {});
                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    // trigger combo again in different order
                                    _(100000).times(function () {});
                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                    keyupEvent(2);
                                    _(100000).times(function () {});
                                    keyupEvent(4);
                                    _(100000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(true);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keydownEvent(1);
                                    _(100000).times(function () {});
                                    keydownEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(false);

                                    _(100000).times(function () {});
                                    keyupEvent(1);
                                    _(100000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expect(state.isTriggered(handler)).toBe(false);
                                    expect(state.isTriggered(handler2)).toBe(false);
                                    expect(state.isTriggered(handler3)).toBe(true);
                                }
                            ]);
                        });
                    });
                });
            });
        });
    });


    describe('', function () {
        var mouseState;

        beforeEach(function () {
            tapIntoSystem('MouseState', function (s) {
                mouseState = s;
            });
            COMP.cycleOnce(); // cycle to get HIDComboState state
        });

        afterEach(function () {
            COMP.cycleOnce(); // cycle to invalidate input buffers
            resetMouseState(mouseState);
        });


        it('should capture HID combo state of mouseMove, mouseClick, keydown', function () {
            COMP.cycleContinues([
                function () {
                    // register combo
                    handler = state.register({
                        keys: ['k1', 'mmoved', 'mwheelMoved', 'm0'],
                        trigger: 'down',
                        isOnce: false,
                        isOrdered: false,
                        isSequence: false,
                        isExclusive: false,
                        isSolitary: false
                    });

                    // expect the combo to be not triggered
                    expect(state.isTriggered(handler)).toBe(false);

                    // trigger combo
                    keydownEvent(1);
                    mouseMoveEvent(10, 20);
                    wheelEvent(20, 30);
                    mouseClickEvent(0);
                },
                function () {
                    // expect the combo to be triggered
                    expect(state.isTriggered(handler)).toBe(true);

                    mouseMoveEvent(11, 22);
                    wheelEvent(21, 31);
                },
                function () {
                    // expect the combo to be triggered after engine cycle as it is not once combo
                    expect(state.isTriggered(handler)).toBe(true);
                },
                function () {
                    // expect the combo to be not triggered
                    expect(state.isTriggered(handler)).toBe(false);
                }
            ]);
        });
    });

});