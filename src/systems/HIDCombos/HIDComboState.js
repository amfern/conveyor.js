/*jshint bitwise: false*/
'use strict';

// Recieves combos combination from HIDCombos returns the triggered combos
// according to HIDState(keyboard, mouse, touch, joystick and 3Dmouse).
// When the combo pressed, the key under which it is registered will be added to component
// as indication of triggered combo.
// passing additional values will effect the behavior of the key
//
// HIDCombos object expected to contain:
// key   - unique combo undentifier
// value - {
//              "keys"*             : null,   - array of keys

//              "trigger"           : null,   - {down|up|release}
//                                                 down - combo trigger on all of the keys down
//                                                   up - combo trigger on all of the keys up
//                                              release - combo trigger on one of the keys up

//              "isOnce"            : false,  - Normally while holding the keys combo will be always
//                                              triggered, setting this to true will trigger and wait
//                                              for release before triggering again

//              "isOrdered"         : false,  - will trigger only if clicked in the correct order

//              "isSequence"        : false,  - when "isOrdered" is true will trigger only if key
//                                              were clicked in one sequence meaning, no other key
//                                              then specified in the combo were clicked in-between

//              "isExclusive"       : false,  - Normally when pressing a key, any and all combos that
//                                              match will have their callbacks called. For instance,
//                                              pressing 'shift' and then 's' would activate the following
//                                              combos if they existed: "shift", "shift s" and "s".
//                                              When we set isExclusive to true, we will not call the
//                                              callbacks for any combos that are also exclusive and less specific.

//              "isSolitary"        : false   - This option will check that ONLY the combo's keys are
//                                              being pressed when set to true. When set to the default
//                                              value of false, a combo can be activated even if extraneous
//                                              keys are pressed
//          }
// *only keys value is mandatory the rest are optional
//
// General combos mechanics behavior is borrowed from keypress.js
// -----------------------------------------
(function () {
    var potentialOnceTriggered = [], // combos that would-have been triggered unless they were once
        component = [];

    // find equal combo, in terms of combo functuanality
    function findSimilarCombo(combo, combos) {
        var keysMustBeEqual = [
                'trigger',
                'isOnce',
                'isOrdered',
                'isSequence',
                'isExclusive',
                'isSolitary'
            ],
            comboKeysMustBeEqual = _.pick(combo, keysMustBeEqual),
            potentialEqualCombos = _.where(combos, comboKeysMustBeEqual);

        // plimenary filtering all combos whos don't have same amount of keys
        potentialEqualCombos = _.filter(potentialEqualCombos, function (potentialEqualCombo) {
            return potentialEqualCombo.keys.length === combo.keys.length;
        });

        // unorederd combos are similar if they contain same keys but not same order
        if (combo.isOrdered) {
            return _.find(potentialEqualCombos, function (potentialEqual) {
                return potentialEqual.keys.toString() === combo.keys.toString();
            });
        } else {
            return _.find(potentialEqualCombos, function (potentialEqual) {
                return !_.difference(potentialEqual.keys, combo.keys).length;
            });
        }
    }

    // registers the actual combo or return existing combo, if similar combo found
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
            handlers: [] // array of handlers because there could be many similar combos
        };

        // do nothing if similar combo already exists
        var similarCombo = findSimilarCombo(combo, combos);

        if (similarCombo) {
            return similarCombo;
        }

        // insert in-place by order of combo.keys.length
        var insertIndex = _.sortedIndex(combos, combo, function (combo) {
            return -combo.keys.length;
        });

        // insert combo in the correct place
        combos.splice(insertIndex, 0, combo);

        return combo;
    }

    function registerCombos(rawCombos) {
        var combos = [];

        // register all combos again
        _.each(rawCombos, function (rawCombo, handler) {
            var combo = register(rawCombo, combos);

            // add additional values
            combo.handlers.push(handler);
        });

        // fill children for exclusive combos
        _.each(combos, function (combo, index) {
            if (combo.isExclusive) {
                combo.children = getComboChildren(combo, combos.slice(index, combos.length));
            }
        });

        return combos;
    }

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

    function getComboChildren(combo, combos) {
        return _.filter(combos, function (potentialChild) {
            // return if potential child is the actual combo
            if (potentialChild === combo) {
                return false;
            }

            // return if trigger is not the same
            if (potentialChild.trigger !== combo.trigger) {
                return false;
            }

            if (combo.isOrdered && combo.isSequence) {
                return isKeysExistsInSequence(potentialChild.keys, combo.keys);
            }

            if (combo.isOrdered) {
                return isKeysExistsInOrder(potentialChild.keys, combo.keys);
            }

            return isKeysExists(potentialChild.keys, combo.keys);
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

                if (findSimilarCombo(combo, potentialOnceTriggered)) {
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


    new CONV.System.Logic({
        name: 'HIDComboState',
        isStatic: true,

        dependencies: ['HIDState', 'KeyBinds'],
        requiredDependencies: ['HIDState', 'HIDCombos'],

        component: function () {
            return component;
        },

        process: function (staticEntity) {
            var outPotentialOnceTriggered = [],
                combos = registerCombos(staticEntity.HIDCombos), // ordered array of combos from the longest sequence of keys to the shortest
                triggeredCombos = getTriggeredCombos(combos, staticEntity.HIDState, potentialOnceTriggered, outPotentialOnceTriggered);

            potentialOnceTriggered = outPotentialOnceTriggered;

            // reset triggered handlers
            component.length = 0;

            // push all handlers of triggered combos to HIDComboState's components
            _.merge(component, _(triggeredCombos).pluck('handlers').flatten().value());
        }
    });
})();
