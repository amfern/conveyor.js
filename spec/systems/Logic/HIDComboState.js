/*jshint bitwise: false*/
'use strict';

describe('HIDComboState', function () {
    var state, combosState, IOkeyboard, keyboardState;

    // pass keys to find if triggered
    function expectTriggered(key, isTriggered) {
        expect(!!~state.indexOf(key)).toBe(isTriggered);
    }

    // add reading system
    beforeEach(function () {
        tapIntoSystem('HIDComboState', function (s) {
            state = s;
        });
        tapIntoSystem('Keyboard', function (s) {
            IOkeyboard = s;
        });
        tapIntoSystem('KeyboardState', function (s) {
            keyboardState = s;
        });
        tapIntoSystem('HIDCombos', function (s) {
            combosState = s;
        });

        CONV.cycleOnce(); // cycle to get HIDComboState state
    });

    // reset mouse movement after each test
    afterEach(function () {
        CONV.cycleOnce(); // cycle again to flush any HID states
        _.clearAll(combosState);
        _.clearAll(IOkeyboard);
        _.clearAll(keyboardState);
    });

    describe('', function () {
        describe('register combo', function () {
            it('Should register combo and set handler same as combo index', function () {
                CONV.cycleContinues([
                    function () {
                        combosState.handler1 = {
                            keys: ['k1'],
                            trigger: 'down',
                            isOnce: false,
                            isOrdered: false,
                            isSequence: false,
                            isExclusive: false,
                            isSolitary: false
                        };

                        // expect triggered states to be empty
                        expectTriggered('handler1', false);
                    }, function() {
                        expectTriggered('handler1', false);

                        keydownEvent(1);
                        _(1000000).times(function () {});
                    }, function() {
                        expectTriggered('handler1', true);
                    }
                ]);
            });
        });

        describe('should trigger', function () {
            describe('unordered combo', function () {
                it('keydown', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);
                        },
                        function () {
                            // expect the combo to be triggered after engine cycle as it is not once combo
                            expectTriggered('handler1', true);

                            // remove one key
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                        }
                    ]);
                });

                it('keyup', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(2);

                        },
                        function () {
                            // expect the combo to be
                            expectTriggered('handler1', true);
                        },
                        function () {
                            // expect the combo to be triggered after engine cycle as it is not once combo
                            expectTriggered('handler1', true);

                            // remove one key
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', true);
                        }
                    ]);
                });

                it('release', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be
                            expectTriggered('handler1', true);
                        },
                        function () {
                            // expect the combo to be triggered after engine cycle as it is not once combo
                            expectTriggered('handler1', true);

                            // remove one key
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                        }
                    ]);
                });

                // hmm i don't really have a way of telling if default values were filled
                it('should fill in default values', function () {
                    CONV.cycleContinues([
                        function () {
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3']
                            };
                        }, function() {
                            expectTriggered('handler1', false);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                        }, function() {
                            expectTriggered('handler1', true);
                        }
                    ]);
                });

                it('should register duplicated combos', function () {
                    CONV.cycleContinues([
                        function () {
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            combosState.handler2 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                        }, function() {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                        }, function() {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', true);
                        }
                    ]);
                });
            });

            describe('ordered combo', function () {
                it('keydown', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);

                            // trigger combo again in different order
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', true);

                            // remove one key
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                        }
                    ]);
                });

                it('keyup', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', true);

                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                        }
                    ]);
                });

                it('release', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', false);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', true);

                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                        }
                    ]);
                });
            });

            describe('ordered sequence combo', function () {
                it('keydown', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', false);

                            // trigger combo again in sequence
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);

                            // trigger combo again in different order
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', true);

                            // remove one key
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                        }
                    ]);
                });

                it('keyup', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', true);

                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                        }
                    ]);
                });

                it('release', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', false);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', true);

                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                        }
                    ]);
                });
            });

            describe('unordered combo and keep triggered', function () {
                it('keydown', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo
                            keydownEvent(1);
                        },
                        function () {
                            // combos shouldn't be triggered because keys doesn't match any of them
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // only one combo is expected to be triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect all combos to be triggered
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);
                        }
                    ]);
                });

                it('keyup', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // combos shouldn't be triggered because keys doesn't match any of them
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keyupEvent(1);
                        },
                        function () {
                            // combos shouldn't be triggered because keys doesn't match any of them
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', true);

                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // only one combo is expected to be triggered
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect all combos to be triggered
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);
                        }
                    ]);
                });

                it('release', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // combos shouldn't be triggered because keys doesn't match any of them
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keyupEvent(1);
                        },
                        function () {
                            // combos shouldn't be triggered because keys doesn't match any of them
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // only one combo is expected to be triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect all combos to be triggered
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);
                        }
                    ]);
                });
            });

            describe('ordered combo and keep triggered', function () {
                it('keydown', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);
                        }
                    ]);
                });

                it('keyup', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keyupEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);
                        }
                    ]);
                });

                it('release', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keyupEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);
                        }
                    ]);
                });
            });

            describe('ordered combo sequence and keep triggered', function () {
                it('keydown', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order and in sequence
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);
                        }
                    ]);
                });

                it('keyup', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keyupEvent(1);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order and in sequence
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);
                        }
                    ]);
                });

                it('release', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keyupEvent(1);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order and in sequence
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);
                        }
                    ]);
                });
            });
        });

        describe('should trigger once', function () {
            beforeEach(function () {
                CONV.afterCycleContinues([
                    function () {
                        // expect the combo to be triggered
                        expectTriggered('handler1', false);
                    },
                    function () {
                        // double check it is not triggered
                        expectTriggered('handler1', false);
                    },
                    function () {
                        // triple  check it is not triggered
                        expectTriggered('handler1', false);
                    }
                ]);
            });

            describe('unordered combos', function () {
                it('keydown', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: true,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // double check it is not triggered
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expectTriggered('handler1', false);

                            // remove one key
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);
                        }
                    ]);
                });

                it('keyup', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: true,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // double check it is not triggered
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expectTriggered('handler1', false);

                            // remove one key
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // re-trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', false);

                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);
                        }
                    ]);
                });

                it('release', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: true,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // double check it is not triggered
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expectTriggered('handler1', false);

                            // remove one key
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // re-trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', false);

                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', false);

                            keyupEvent(1);
                            keyupEvent(3);
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);
                        }
                    ]);
                });
            });

            describe('ordered combos', function () {
                it('keydown', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: true,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // double check it is not triggered
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expectTriggered('handler1', false);

                            // remove one key
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered because not in order
                            expectTriggered('handler1', false);
                            // remove one key
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered because now it is in order
                            expectTriggered('handler1', true);
                        }
                    ]);
                });

                it('keyup', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: true,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // double check it is not triggered
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expectTriggered('handler1', false);

                            // remove one key
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered because not in order
                            expectTriggered('handler1', false);
                            // remove one key
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered because now it is in order
                            expectTriggered('handler1', true);
                        }
                    ]);
                });

                it('release', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: true,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // double check it is not triggered
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expectTriggered('handler1', false);

                            // remove one key
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered because not in order
                            expectTriggered('handler1', false);

                            // remove one key
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered because now it is in order
                            expectTriggered('handler1', true);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // double check it is not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered because now it is in order
                            expectTriggered('handler1', false);
                        }
                    ]);
                });
            });

            describe('ordered sequence combos', function () {
                it('keydown', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: true,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered because not in sequence
                            expectTriggered('handler1', false);

                            // trigger combo
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // double check it is not triggered
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expectTriggered('handler1', false);

                            // remove one key
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered because not in order
                            expectTriggered('handler1', false);
                            // remove one key
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered because now it is in order
                            expectTriggered('handler1', true);
                        }
                    ]);
                });

                it('keyup', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: true,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered because not in sequence
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // double check it is not triggered
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expectTriggered('handler1', false);

                            // remove one key
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered because not in order
                            expectTriggered('handler1', false);
                            // remove one key
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered because now it is in order
                            expectTriggered('handler1', true);
                        }
                    ]);
                });

                it('release', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: true,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: false,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered because not in sequence
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered
                            expectTriggered('handler1', true);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // double check it is not triggered
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // triple  check it is not triggered
                            expectTriggered('handler1', false);

                            // remove one key
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered because not in order
                            expectTriggered('handler1', false);
                            // remove one key
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            // expect the combo to be triggered because now it is in order
                            expectTriggered('handler1', true);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered after engine cycle as it is once combo
                            expectTriggered('handler1', false);
                        },
                        function () {
                            // double check it is not triggered
                            expectTriggered('handler1', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered because now it is in order
                            expectTriggered('handler1', false);
                        }
                    ]);
                });
            });
        });

        describe('should trigger exclusive', function () {
            describe('unordered combos', function () {
                it('keydown', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });

                it('keyup', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });

                it('release', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });

                it('keydown and keyup and release should be exclusive only among their trigger type', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            combosState.handler2 = {
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            combosState.handler3 = {
                                keys: ['k1'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            // trigger combo
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            _(1000000).times(function () {});
                            keydownEvent(1);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });
            });

            describe('ordered combos', function () {
                it('keydown', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });

                it('keyup', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keyupEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });

                it('release', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keyupEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });
            });

            describe('ordered sequence combos', function () {
                it('keydown', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });

                it('keyup', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keyupEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });

                it('release', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: true,
                                isExclusive: true,
                                isSolitary: false
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keyupEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                        },
                        function () {
                            expectTriggered('handler1', true);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });
            });

            describe('once', function () {
                describe('unordered combos', function () {
                    it('keydown', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keydownEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', true);
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });

                    it('keyup', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                // trigger combo
                                keydownEvent(2);
                                _(1000000).times(function () {});
                                // trigger combo
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                // trigger combo
                                keydownEvent(3);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', true);

                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });

                    it('release', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                // trigger combo
                                keydownEvent(2);
                                _(1000000).times(function () {});
                                // trigger combo
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                // trigger combo
                                keydownEvent(3);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', true);

                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });
                });

                describe('ordered combos', function () {
                    it('keydown', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', true);

                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', true);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(1);
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);
                            }
                        ]);
                    });

                    it('keydup', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(3);
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', true);

                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                                _(1000000).times(function () {});
                                keyupEvent(4);
                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', true);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);
                            }
                        ]);
                    });

                    it('release', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(3);
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', true);

                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                                _(1000000).times(function () {});
                                keyupEvent(4);
                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', true);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);
                            }
                        ]);
                    });
                });

                describe('ordered sequence combos', function () {
                    it('keydown', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', true);

                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);
                            }
                        ]);
                    });

                    it('keyup', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(3);
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', true);

                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                                _(1000000).times(function () {});
                                keyupEvent(4);
                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', true);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', true);
                            }
                        ]);
                    });

                    it('release', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: false
                                };

                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(3);
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', true);

                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                                _(1000000).times(function () {});
                                keyupEvent(4);
                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);
                            }
                        ]);
                    });
                });
            });
        });

        describe('should trigger solitary', function () {
            describe('unordered combos', function () {
                it('keydown', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });

                it('keyup', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            delete combosState.handler1;

                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });

                it('release', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: false,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo
                            keyupEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            delete combosState.handler1;

                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });
            });

            describe('unordered combos', function () {
                it('keydown', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });

                it('keyup', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keyupEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            delete combosState.handler1;

                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });

                it('release', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keyupEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            delete combosState.handler1;

                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', false);

                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });
            });

            describe('ordered sequence combos', function () {
                it('keydown', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'down',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keydownEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', true);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });

                it('keyup', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'up',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keyupEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            delete combosState.handler1;

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });

                it('release', function () {
                    CONV.cycleContinues([
                        function () {
                            // register combo
                            combosState.handler1 = {
                                keys: ['k1', 'k2', 'k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler2 = {
                                keys: ['k3'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // register combo
                            combosState.handler3 = {
                                keys: ['k1', 'k2'],
                                trigger: 'release',
                                isOnce: false,
                                isOrdered: true,
                                isSequence: false,
                                isExclusive: false,
                                isSolitary: true
                            };

                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo
                            keydownEvent(3);
                            _(1000000).times(function () {});
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(4);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                        },
                        function () {
                            // expect the combo to be not triggered
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            keyupEvent(1);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(3);
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);

                            delete combosState.handler1;

                            // trigger combo
                            keydownEvent(1);
                            _(1000000).times(function () {});
                            keydownEvent(2);
                            _(1000000).times(function () {});
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', true);
                            expectTriggered('handler3', false);

                            // trigger combo again in different order
                            _(1000000).times(function () {});
                            keyupEvent(1);
                            _(1000000).times(function () {});
                            keyupEvent(2);
                            _(1000000).times(function () {});
                            keyupEvent(4);
                            _(1000000).times(function () {});
                            keyupEvent(3);
                        },
                        function () {
                            expectTriggered('handler1', false);
                            expectTriggered('handler2', false);
                            expectTriggered('handler3', false);
                        }
                    ]);
                });
            });

            describe('once', function () {
                describe('unordered combos', function () {
                    it('keydown', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keydownEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(1);
                                keyupEvent(2);
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(2);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);

                                delete combosState.handler2;
                                keydownEvent(3);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });

                    it('keyup', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(1);
                                keydownEvent(2);
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(2);
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                delete combosState.handler1;
                                keyupEvent(3);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });

                    it('release', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: false,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(1);
                                keydownEvent(2);
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(2);
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);

                                delete combosState.handler1;
                                keyupEvent(3);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });
                });

                describe('unordered combos', function () {
                    it('keydown', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(1);
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);

                                delete combosState.handler2;
                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });

                    it('keyup', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(3);
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                                _(1000000).times(function () {});
                                keyupEvent(4);
                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);

                                delete combosState.handler2;
                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });

                    it('release', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(3);
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                                _(1000000).times(function () {});
                                keyupEvent(4);
                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);

                                delete combosState.handler2;
                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });
                });

                describe('ordered sequence combos', function () {
                    it('keydown', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(1);
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);

                                delete combosState.handler2;
                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });

                    it('keyup', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(3);
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                                _(1000000).times(function () {});
                                keyupEvent(4);
                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(1);
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                delete combosState.handler2;
                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });

                    it('release', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: true,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(3);
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                                _(1000000).times(function () {});
                                keyupEvent(4);
                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(1);
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);

                                delete combosState.handler2;
                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });
                });
            });

            describe('exclusive', function () {
                describe('unordered combos', function () {
                    it('keydown', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keydownEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });

                    it('keyup', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });

                    it('release', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: false,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', true);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });
                });

                describe('ordered combos', function () {
                    it('keydown', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });

                    it('keyup', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(1);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(3);
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                                _(1000000).times(function () {});
                                keyupEvent(4);
                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });

                    it('release', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: false,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(1);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(3);
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                                _(1000000).times(function () {});
                                keyupEvent(4);
                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });
                });

                describe('ordered sequence combos', function () {
                    it('keydown', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'down',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);
                            }
                        ]);
                    });

                    it('keyup', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'up',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(3);
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                                _(1000000).times(function () {});
                                keyupEvent(4);
                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', true);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);
                            }
                        ]);
                    });

                    it('release', function () {
                        CONV.cycleContinues([
                            function () {
                                // register combo
                                combosState.handler1 = {
                                    keys: ['k1', 'k2', 'k3'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler2 = {
                                    keys: ['k3'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // register combo
                                combosState.handler3 = {
                                    keys: ['k1', 'k2'],
                                    trigger: 'release',
                                    isOnce: false,
                                    isOrdered: true,
                                    isSequence: true,
                                    isExclusive: true,
                                    isSolitary: true
                                };

                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo
                                keydownEvent(3);
                                _(1000000).times(function () {});
                                keydownEvent(1);
                                _(1000000).times(function () {});
                                keydownEvent(4);
                                _(1000000).times(function () {});
                                keydownEvent(2);
                                _(1000000).times(function () {});
                            },
                            function () {
                                // expect the combo to be not triggered
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keyupEvent(1);
                                _(1000000).times(function () {});
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(3);
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);

                                // trigger combo again in different order
                                _(1000000).times(function () {});
                                keyupEvent(1);
                                _(1000000).times(function () {});
                                keyupEvent(2);
                                _(1000000).times(function () {});
                                keyupEvent(4);
                                _(1000000).times(function () {});
                                keyupEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', false);

                                _(1000000).times(function () {});
                                keydownEvent(3);
                            },
                            function () {
                                expectTriggered('handler1', false);
                                expectTriggered('handler2', false);
                                expectTriggered('handler3', true);
                            }
                        ]);
                    });
                });

                describe('once', function () {
                    describe('unordered combos', function () {
                        it('keydown', function () {
                            CONV.cycleContinues([
                                function () {
                                    // register combo
                                    combosState.handler1 = {
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler2 = {
                                        keys: ['k3'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler3 = {
                                        keys: ['k1', 'k2'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // expect the combo to be not triggered
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo
                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', true);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keydownEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', true);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                }
                            ]);
                        });

                        it('keyup', function () {
                            CONV.cycleContinues([
                                function () {
                                    // register combo
                                    combosState.handler1 = {
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler2 = {
                                        keys: ['k3'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler3 = {
                                        keys: ['k1', 'k2'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // expect the combo to be not triggered
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo
                                    keydownEvent(3);
                                    _(1000000).times(function () {});
                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                    keydownEvent(4);
                                    _(1000000).times(function () {});
                                    keydownEvent(2);
                                    _(1000000).times(function () {});
                                },
                                function () {
                                    // expect the combo to be not triggered
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo
                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                },
                                function () {
                                    expectTriggered('handler1', true);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo
                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                    keydownEvent(2);
                                    _(1000000).times(function () {});
                                    keydownEvent(3);
                                    _(1000000).times(function () {});
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    delete combosState.handler1;

                                    _(1000000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', true);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                }
                            ]);
                        });

                        it('release', function () {
                            CONV.cycleContinues([
                                function () {
                                    // register combo
                                    combosState.handler1 = {
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler2 = {
                                        keys: ['k3'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler3 = {
                                        keys: ['k1', 'k2'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: false,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // expect the combo to be not triggered
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo
                                    keydownEvent(3);
                                    _(1000000).times(function () {});
                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                    keydownEvent(4);
                                    _(1000000).times(function () {});
                                    keydownEvent(2);
                                    _(1000000).times(function () {});
                                },
                                function () {
                                    // expect the combo to be not triggered
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo
                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', true);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', true);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo
                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                    keydownEvent(2);
                                    _(1000000).times(function () {});
                                    keydownEvent(3);
                                    _(1000000).times(function () {});
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    delete combosState.handler1;

                                    _(1000000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', true);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                }
                            ]);
                        });
                    });

                    describe('ordered combos', function () {
                        it('keydown', function () {
                            CONV.cycleContinues([
                                function () {
                                    // register combo
                                    combosState.handler1 = {
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler2 = {
                                        keys: ['k3'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler3 = {
                                        keys: ['k1', 'k2'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // expect the combo to be not triggered
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo again in different order
                                    _(1000000).times(function () {});
                                    keydownEvent(3);
                                    _(1000000).times(function () {});
                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                    keydownEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo again in different order
                                    _(1000000).times(function () {});
                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                    keydownEvent(2);
                                    _(1000000).times(function () {});
                                    keydownEvent(4);
                                    _(1000000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', true);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                    keydownEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', true);
                                }
                            ]);
                        });

                        it('keyup', function () {
                            CONV.cycleContinues([
                                function () {
                                    // register combo
                                    combosState.handler1 = {
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler2 = {
                                        keys: ['k3'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler3 = {
                                        keys: ['k1', 'k2'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // expect the combo to be not triggered
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo
                                    keydownEvent(3);
                                    _(1000000).times(function () {});
                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                    keydownEvent(4);
                                    _(1000000).times(function () {});
                                    keydownEvent(2);
                                    _(1000000).times(function () {});
                                },
                                function () {
                                    // expect the combo to be not triggered
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                },
                                function () {
                                    expectTriggered('handler1', true);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo again in different order
                                    _(1000000).times(function () {});
                                    keyupEvent(3);
                                    _(1000000).times(function () {});
                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', true);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo again in different order
                                    _(1000000).times(function () {});
                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                    keyupEvent(2);
                                    _(1000000).times(function () {});
                                    keyupEvent(4);
                                    _(1000000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    keydownEvent(1);
                                    keydownEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', true);
                                }
                            ]);
                        });

                        it('release', function () {
                            CONV.cycleContinues([
                                function () {
                                    // register combo
                                    combosState.handler1 = {
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler2 = {
                                        keys: ['k3'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler3 = {
                                        keys: ['k1', 'k2'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: false,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // expect the combo to be not triggered
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo
                                    keydownEvent(3);
                                    _(1000000).times(function () {});
                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                    keydownEvent(4);
                                    _(1000000).times(function () {});
                                    keydownEvent(2);
                                    _(1000000).times(function () {});
                                },
                                function () {
                                    // expect the combo to be not triggered
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo again in different order
                                    _(1000000).times(function () {});
                                    keyupEvent(3);
                                    _(1000000).times(function () {});
                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo again in different order
                                    _(1000000).times(function () {});
                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                    keyupEvent(2);
                                    _(1000000).times(function () {});
                                    keyupEvent(4);
                                    _(1000000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', true);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    keydownEvent(1);
                                    keydownEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', true);
                                }
                            ]);
                        });
                    });

                    describe('ordered sequence combos', function () {
                        it('keydown', function () {
                            CONV.cycleContinues([
                                function () {
                                    // register combo
                                    combosState.handler1 = {
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler2 = {
                                        keys: ['k3'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler3 = {
                                        keys: ['k1', 'k2'],
                                        trigger: 'down',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // expect the combo to be not triggered
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo again in different order
                                    _(1000000).times(function () {});
                                    keydownEvent(3);
                                    _(1000000).times(function () {});
                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                    keydownEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo again in different order
                                    _(1000000).times(function () {});
                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                    keydownEvent(2);
                                    _(1000000).times(function () {});
                                    keydownEvent(4);
                                    _(1000000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', true);
                                    expectTriggered('handler3', false);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                    keydownEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', true);
                                }
                            ]);
                        });

                        it('keyup', function () {
                            CONV.cycleContinues([
                                function () {
                                    // register combo
                                    combosState.handler1 = {
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler2 = {
                                        keys: ['k3'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler3 = {
                                        keys: ['k1', 'k2'],
                                        trigger: 'up',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // expect the combo to be not triggered
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo
                                    keydownEvent(3);
                                    _(1000000).times(function () {});
                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                    keydownEvent(4);
                                    _(1000000).times(function () {});
                                    keydownEvent(2);
                                    _(1000000).times(function () {});
                                },
                                function () {
                                    // expect the combo to be not triggered
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                },
                                function () {
                                    expectTriggered('handler1', true);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo again in different order
                                    _(1000000).times(function () {});
                                    keyupEvent(3);
                                    _(1000000).times(function () {});
                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', true);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo again in different order
                                    _(1000000).times(function () {});
                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                    keyupEvent(2);
                                    _(1000000).times(function () {});
                                    keyupEvent(4);
                                    _(1000000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                    keydownEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', true);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                }
                            ]);
                        });

                        it('release', function () {
                            CONV.cycleContinues([
                                function () {
                                    // register combo
                                    combosState.handler1 = {
                                        keys: ['k1', 'k2', 'k3'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler2 = {
                                        keys: ['k3'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // register combo
                                    combosState.handler3 = {
                                        keys: ['k1', 'k2'],
                                        trigger: 'release',
                                        isOnce: true,
                                        isOrdered: true,
                                        isSequence: true,
                                        isExclusive: true,
                                        isSolitary: true
                                    };

                                    // expect the combo to be not triggered
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo
                                    keydownEvent(3);
                                    _(1000000).times(function () {});
                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                    keydownEvent(4);
                                    _(1000000).times(function () {});
                                    keydownEvent(2);
                                    _(1000000).times(function () {});
                                },
                                function () {
                                    // expect the combo to be not triggered
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo again in different order
                                    _(1000000).times(function () {});
                                    keyupEvent(3);
                                    _(1000000).times(function () {});
                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keydownEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    // trigger combo again in different order
                                    _(1000000).times(function () {});
                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                    keyupEvent(2);
                                    _(1000000).times(function () {});
                                    keyupEvent(4);
                                    _(1000000).times(function () {});
                                    keyupEvent(3);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', true);
                                    expectTriggered('handler3', false);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keydownEvent(1);
                                    _(1000000).times(function () {});
                                    keydownEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', false);

                                    _(1000000).times(function () {});
                                    keyupEvent(1);
                                    _(1000000).times(function () {});
                                    keyupEvent(2);
                                },
                                function () {
                                    expectTriggered('handler1', false);
                                    expectTriggered('handler2', false);
                                    expectTriggered('handler3', true);
                                }
                            ]);
                        });
                    });
                });
            });
        });
    });


    describe('', function () {
        var mouseState, IOmouse;

        beforeEach(function () {
            tapIntoSystem('MouseState', function (s) {
                mouseState = s;
            });
            tapIntoSystem('Mouse', function (s) {
                IOmouse = s;
            });
            CONV.cycleOnce(); // cycle to get HIDComboState state
        });

        afterEach(function () {
            mouseMoveEvent(0, 0, 0, 0);
            CONV.cycleOnce(); // cycle to invalidate input buffers
            resetMouseState(mouseState);
            resetIOMouse(IOmouse);
        });


        it('should capture HID combo state of mouseMove, mouseClick, keydown', function () {
            CONV.cycleContinues([
                function () {
                    // register combo
                    combosState.handler1 = {
                        keys: ['k1', 'mmoved', 'mwheelMoved', 'm0'],
                        trigger: 'down',
                        isOnce: false,
                        isOrdered: false,
                        isSequence: false,
                        isExclusive: false,
                        isSolitary: false
                    };

                    // expect the combo to be not triggered
                    expectTriggered('handler1', false);

                    // trigger combo
                    keydownEvent(1);
                    mouseMoveEvent(10, 20, 25, 35);
                    wheelEvent(20, 30);
                    mouseClickEvent(0);
                },
                function () {
                    // expect the combo to be triggered
                    expectTriggered('handler1', true);


                    mouseMoveEvent(11, 22, 26, 36);
                    wheelEvent(21, 31);
                },
                function () {
                    // expect the combo to be triggered after engine cycle as it is not once combo
                    expectTriggered('handler1', true);
                },
                function () {
                    // expect the combo to be not triggered
                    expectTriggered('handler1', false);
                }
            ]);
        });
    });

});
