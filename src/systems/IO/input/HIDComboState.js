// API for register combos combination from keyboard, mouse, touch, joystick and 3Dmouse.
// when the combo pressed API will set appropriate flag to true.
// passing additional values will effect the behavior of the key
// -----------------------------------------
(function() {
  var combos = [], // ordered array of combos from the longest sequence of keys to the shortest
      triggeredCombos = [],
      handlerIndex = -1,
      component = {
        register: register,
        unregister: unregister,
        isTriggered: isTriggered,
        state: {}
      };

  // registers a combo
  // {
  //   "keys"              : null,   - array of keys 
  //   "trigger"           : null,   - {down|up|release}
  //                                   down    - combo trigger on all of the keys down
  //                                   up      - combo trigger on all of the keys up
  //                                   release - combo trigger on one of the keys up
  //   "isOnce"            : false,  - Normally while holding the keys combo will be always triggered, setting this to true will trigger and wait for release before triggering again
  //   "isOrdered"         : false,  - will trigger only if clicked in the correct order
  //   "isExclusive"       : false,  - Normally when pressing a key, any and all combos that match will have their callbacks called. 
  //                                   For instance, pressing 'shift' and then 's' would activate the following combos if they existed: "shift", "shift s" and "s". 
  //                                   When we set isExclusive to true, we will not call the callbacks for any combos that are also exclusive and less specific.
  //   "isSolitary"        : false   - This option will check that ONLY the combo's keys are being pressed when set to true. When set to the default value of false, 
  //                                   a combo can be activated even if extraneous keys are pressed
  // }
  // 
  // returns handler to use with isTriggered()
  function register(args) {
    if(_.isEmpty(args.keys)) throw new Error('empty keys combination');

    var combo = {
      keys: args.keys,
      trigger: args.trigger || 'down',
      isOnce: args.isOnce || false,
      isOrdered: args.isOrdered || false,
      isExclusive: args.isExclusive || false,
      isSolitary: args.isSolitary || false,
      handler: ++handlerIndex
    };
    
    if(_.where(combos, combo).length) throw new Error('this combo already exists');

    var insertIndex = _.sortedIndex(combos, combo, function(combo) { return -combo.keys.length; }); // insert inplace by order of combo.keys.length

    if(combo.isExclusive) combo.children = getComboChildren(combo, combos.slice(insertIndex, combos.length));
    
    addComboToParentCombos(combo, combos.slice(0, insertIndex)); // add combo as child to other combos if its keys are partialy matching them

    combos.splice(insertIndex, 0, combo); // insert combo in the correct place

    return handlerIndex;
  }

  // removes combo
  // handler - (integer) a handler to a combo
  function unregister(handler) {
    // remove combo from all parent combos
    _.each(combos, function(combo) {
      var comboIndex = combo.children.indexOf(handler);
      if(comboIndex) combo.children.splice(comboIndex, 1); 
    });
    combos = _.reject(combos, function(combo) { return combo.handler == handler; }); // removes combo
  }

  // checks if a certain combo is triggered
  // handler - (integer) a handler to a combo
  function isTriggered(handler) {
    return component.state[handler] || false; // even if undefined will return false
  }

  function isKeysExistsInOrder(keys, HIDState) {
    return keys.toString() == _.intersection(keys, HIDState).toString();
  }

  function isKeysExists(keys, HIDState) {
    return _.intersection(keys, HIDState).length == keys.length;
  }

  function isKeysDontExists(keys, HIDState) {
    return _.intersection(keys, HIDState).length === 0;
  }

  function addComboToParentCombos(combo, combos) {
    _.each(combos, function(potentialParent) { 
      if (combo.isOrdered ? isKeysExistsInOrder(combo.keys, potentialParent.keys) : isKeysExists(combo.keys, potentialParent.keys)) potentialParent.children.push(combo.handler); 
    });
  }

  function getComboChildren(combo, combos) {
    _.filter(combos, function(potentialChild) { 
      return combo.isOrdered ? isKeysExistsInOrder(potentialChild.keys, combo.keys) : isKeysExists(potentialChild.keys, combo.keys);
    });
  }

  // check if combo triggered
  function isComboValid(combo, pastTriggeredCombos, HIDState) {
    if(combo.trigger == 'down') // if all keys are pressed
      return combo.isOrdered ? isKeysExistsInOrder(combo.keys, HIDState) : isKeysExists(combo.keys, HIDState);
    else if(combo.trigger == 'up') // if at least on key is up combo is triggered
      return combo.isOrdered ? !isKeysExistsInOrder(combo.keys, HIDState) : !isKeysExists(combo.keys, HIDState);
    else if(combo.trigger == 'release') // if combo triggered in the past now none of it keys are present
      return isKeysDontExists(combo.keys, HIDState) && pastTriggeredCombos[combo.handler];

    return false;
  }

  // mark triggered if keys exist in the KeyboardState and in the correct order(isOreder==true)
  function getTriggeredCombos(combos, pastTriggeredCombos, HIDState) {
    var triggeredCombos = [], bannedCol = [];
    _.each(combos, function(combo) {
      if(~bannedCol.indexOf(combo.handler)) return; // return if combo in the banned collection

      if(!isComboValid()) return; // return if combo is invalid

      if(combo.isOnce && ~pastTriggeredCombos.indexOf(combo)) return; // return if combo is once and triggered before

      triggeredCombos.push(combo); // add combo

      // if exclusive add combo's children to banned collection
      if(combo.isExclusive) bannedCol = bannedCol.concat(combo.children);
    });

    // remove solitary combos if triggered combos are bigger then 1
    if(triggeredCombos.length > 1) return _.reject(triggeredCombos, function(combo) { return combo.isSolitary; });

    return triggeredCombos;
  }

  new COMP.System.IO({
    name: 'HIDComboState',
    isStatic: true,
    dependencies: ['HIDState'],

    component: function() {
      return combos;
    },

    process: function(staticEntity) {
      var pastTriggeredCombos = triggeredCombos, HIDState = _.keys(staticEntity.KeyboardState);

      triggeredCombos = getTriggeredCombos(combos, pastTriggeredCombos, HIDState);

      _.clearAll(component.state); // reset triggered state
      _.reduce(triggeredCombos, function(state, combo) { state[combo.handler] = true; }, component.state); // copy new triggeredCombos as the new state
    }
  });
})();