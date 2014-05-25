/*jshint bitwise: false*/
'use strict';

// API for register combos combination from keyboard, mouse, touch, joystick and 3Dmouse.
// when the combo pressed API will set appropriate flag to true.
// passing additional values will effect the behavior of the key
// this system logic and API is borrowed from keypress.js
// -----------------------------------------
(function () {
    var combos = [], // ordered array of combos from the longest sequence of keys to the shortest
        triggeredCombos = [],
        potentialOnceTriggered = [], // combos that would-have been triggered unless they were once
        component = [];



    // component.state = {};
    // component.isTriggered = function(handler) {
    //     return component.state[handler] || false; // even if undefined will return false
    // };




    /*    
    registers a combo
    {
        "keys"              : null,   - array of keys
        
        "trigger"           : null,   - {down|up|release}
                                           down - combo trigger on all of the keys down
                                             up - combo trigger on all of the keys up
                                        release - combo trigger on one of the keys up

        "isOnce"            : false,  - Normally while holding the keys combo will be always
                                        triggered, setting this to true will trigger and wait
                                        for release before triggering again

        "isOrdered"         : false,  - will trigger only if clicked in the correct order
        
        "isSequence"        : false,  - when "isOrdered" is true will trigger only if key
                                        were clicked in one sequence meaning, no other key
                                        then specified in the combo were clicked in-between
        
        "isExclusive"       : false,  - Normally when pressing a key, any and all combos that
                                        match will have their callbacks called. For instance,
                                        pressing 'shift' and then 's' would activate the following
                                        combos if they existed: "shift", "shift s" and "s".
                                        When we set isExclusive to true, we will not call the
                                        callbacks for any combos that are also exclusive and less specific.
        
        "isSolitary"        : false   - This option will check that ONLY the combo's keys are
                                        being pressed when set to true. When set to the default
                                        value of false, a combo can be activated even if extraneous
                                        keys are pressed
    }
    
    returns handler to use with isTriggered()
    */
    function register(rawCombo, combos) {
        if (_.isEmpty(rawCombo.keys)) {
            throw new Error('empty keys combination');
        }

        var combo = {
            keys: rawCombo.keys,
            trigger: rawCombo.trigger || 'down',
            isOnce: rawCombo.isOnce || false,
            isOrdered: rawCombo.isOrdered || false,
            isSequence: rawCombo.isSequence || false,
            isExclusive: rawCombo.isExclusive || false,
            isSolitary: rawCombo.isSolitary || false,
            triggered: false,
            rawCombo: rawCombo
        };

        if (_.find(combos, function (c) {
            return !_.difference(c.keys, combo.keys).length;
        })) {
            throw new Error('"' + combo.keys.toString() + '" combo already exists');
        }

        // insert in-place by order of combo.keys.length
        var insertIndex = _.sortedIndex(combos, combo, function (combo) {
            return -combo.keys.length;
        });

        combo.children = [];
        if (combo.isExclusive) {
            combo.children = getComboChildren(combo, combos.slice(insertIndex, combos.length));
        }

        // add combo as child to other combos if its keys are partially matching them
        addComboToParentCombos(combo, combos.slice(0, insertIndex));

        // insert combo in the correct place
        combos.splice(insertIndex, 0, combo);
    }

    // removes combo
    // handler - (integer) a handler to a combo
    // function unregister(handler, combos) {
    //     // remove combo from all parent combos
    //     _.each(combos, function (combo) {
    //         var comboIndex = combo.children.indexOf(handler);
    //         if (comboIndex) {
    //             combo.children.splice(comboIndex, 1);
    //         }
    //     });

    //     // removes combo
    //     combos = _.reject(combos, function (combo) {
    //         return combo.handler === handler;
    //     });
    // }

    function isKeysExistsInOrder(keys, HIDStateKeys) {
        return _.intersection(HIDStateKeys, keys).toString() === keys.toString();
    }

    function isKeysExistsInSequence(keys, HIDStateKeys) {
        return ~HIDStateKeys.toString().indexOf(keys.toString());
    }

    // if all of the specified keys exists in the HIDsate
    function isKeysExists(keys, HIDStateKeys) {
        return _.intersection(keys, HIDStateKeys).length === keys.length;
    }

    // if none of the specified keys exists in the HIDsate
    function isKeysDontExists(keys, HIDStateKeys) {
        return _.intersection(keys, HIDStateKeys).length === 0;
    }

    function addComboToParentCombos(combo, combos) {
        _.each(combos, function (potentialParent) {
            var valid = false;

            if (combo.isOrdered && combo.isSequence) {
                valid = isKeysExistsInSequence(combo.keys, potentialParent.keys);
            }
            else if (combo.isOrdered) {
                valid = isKeysExistsInOrder(combo.keys, potentialParent.keys);
            }
            else {
                valid = isKeysExists(combo.keys, potentialParent.keys);
            }

            if (valid) {
                potentialParent.children.push(combo);
            }
        });
    }

    function getComboChildren(combo, combos) {
        return _.filter(combos, function (potentialChild) {
            if (combo.isOrdered && combo.isSequence) {
                return isKeysExistsInSequence(combo.keys, potentialChild.keys);
            }

            if (combo.isOrdered) {
                return isKeysExistsInOrder(combo.keys, potentialChild.keys);
            }

            return isKeysExists(combo.keys, potentialChild.keys);
        });
    }

    // check if combo triggered
    function isComboValid(combo, HIDStateKeysPressed, HIDStateKeysNotPressed) {
        // if at least one key is up then combo is triggered
        if (combo.trigger === 'up') {
            if (_.intersection(combo.keys, HIDStateKeysNotPressed).length) {
                return true;
            }

            var combinedKeyStates = HIDStateKeysPressed.concat(HIDStateKeysNotPressed);
            return !isKeysExists(combo.keys, combinedKeyStates);
        }

        // if all keys are pressed
        if (combo.trigger === 'down') {
            return isKeysExists(combo.keys, HIDStateKeysPressed);
        }

        // if combo triggered in the past now none of it keys are present
        if (combo.trigger === 'release') {
            return isKeysDontExists(combo.keys, HIDStateKeysPressed);
        }
    }

    // check if combo triggered in order
    function isComboValidInOrder(combo, HIDStateKeysPressed, HIDStateKeysNotPressed) {
        // if keys are up in order
        if (combo.trigger === 'up') {
            var comboKeysNotPressed = _.intersection(combo.keys, HIDStateKeysNotPressed);
            return isKeysExistsInOrder(comboKeysNotPressed, HIDStateKeysNotPressed);
        }
        
        // if all keys are pressed in the correct order
        if (combo.trigger === 'down') {
            return isKeysExistsInOrder(combo.keys, HIDStateKeysPressed);
        }

        // if combo triggered in the past now none of it keys are present
        if (combo.trigger === 'release') {
            return isKeysExistsInOrder(combo.keys, HIDStateKeysNotPressed);
        }
    }

    // check if combo triggered in order
    function isComboValidInSequence(combo, HIDStateKeysPressed, HIDStateKeysNotPressed) {
        // if only last key is up then triggered
        if (combo.trigger === 'up') {
            var comboKeysNotPressed = _.intersection(combo.keys, HIDStateKeysNotPressed);
            return isKeysExistsInSequence(comboKeysNotPressed, HIDStateKeysNotPressed);
        }

        // if all keys are pressed in the correct order
        if (combo.trigger === 'down') {
            return isKeysExistsInSequence(combo.keys, HIDStateKeysPressed);
        }
        
        // if combo triggered in the past now none of it keys are present
        if (combo.trigger === 'release') {
            return isKeysExistsInSequence(combo.keys, HIDStateKeysNotPressed);
        }
    }

    function orderComboHIDStateKeys(HIDState, orderBy) {
        return _.map(_.sortBy(HIDState, function (s) {
            return s[orderBy];
        }), function (v) {
            return _.findKey(HIDState, v);
        });
    }

    // mark triggered if keys exist in the KeyboardState and in the correct order(isOreder==true)
    function getTriggeredCombos(combos, HIDState, potentialOnceTriggered, outPotentialOnceTriggered) {
        var triggeredCombos = [],
            bannedCombos = [],
            HIDStateKeysDown = orderComboHIDStateKeys(HIDState, 'down'),
            HIDStateKeysUp = orderComboHIDStateKeys(HIDState, 'up'),
            HIDStateKeysPressed = _.filter(HIDStateKeysDown, function (k) {
                return HIDState[k].pressed;
            }),
            HIDStateKeysNotPressed = _.filter(HIDStateKeysUp, function (k) {
                return !HIDState[k].pressed;
            });

        _.each(combos, function (combo) {
            // return if combo is in the banned collection
            if (~bannedCombos.indexOf(combo)) {
                return;
            }

            // return if combo is invalid
            if (!isComboValid(combo, HIDStateKeysPressed, HIDStateKeysNotPressed)) {
                return;
            }

            // check if combo is in valid order
            if (combo.isOrdered &&
                !isComboValidInOrder(combo, HIDStateKeysPressed, HIDStateKeysNotPressed)) {
                
                return;
            }

            // check if combo is in valid as sequence
            if (combo.isOrdered &&
                combo.isSequence &&
                !isComboValidInSequence(combo, HIDStateKeysPressed, HIDStateKeysNotPressed)) {
                
                return;
            }

            // return if combo is once and triggered before
            if (combo.isOnce) {
                outPotentialOnceTriggered.push(combo);
                
                if (~potentialOnceTriggered.indexOf(combo)) {
                    return;
                }
            }

            triggeredCombos.push(combo); // add combo

            // if exclusive
            if (combo.isExclusive) {
                bannedCombos = bannedCombos.concat(combo.children); // add combo's children to banned collection
                triggeredCombos = _.difference(triggeredCombos, bannedCombos); // remove already added banned combos from triggered combos
            }
        });

        // remove solitary combos if triggered combos are bigger then 1
        if (triggeredCombos.length > 1) {
            return _.reject(triggeredCombos, function (combo) {
                return combo.isSolitary;
            });
        }

        return triggeredCombos;
    }


    new COMP.System.IO({
        name: 'HIDComboState',
        isStatic: true,
        dependencies: ['HIDState'],

        component: function () {
            return component;
        },

        process: function (staticEntity) {
            var outPotentialOnceTriggered = [];

            combos.length = 0; // clear all combos
            
            // register all combos again
            _.each(component, function (rawCombo) {
                rawCombo.triggered = false;
                register(rawCombo, combos);
            });

            triggeredCombos = getTriggeredCombos(combos, staticEntity.HIDState, potentialOnceTriggered, outPotentialOnceTriggered);
            potentialOnceTriggered = outPotentialOnceTriggered;

            // set the triggered combos
            _.each(triggeredCombos, function (combo) {
                combo.rawCombo.triggered = true;
            });
        }
    });
})();