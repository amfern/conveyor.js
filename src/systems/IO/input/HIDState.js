// Collects inputs states from keyboard,mouse,joystick, 3Dmouse
// -----------------------------------------
(function() {
  var state = {};

  function combineStates(keyboardState, mouseState, joystickState, 3DMouseState) {
    return _.extend({}, _.prefixKeys(keyboardState, 'k'), _.prefixKeys(mouseState, 'm'), _.prefixKeys(joystickState, 'j'), _.prefixKeys(3DMouseState, '3dm'));
  }

  new COMP.System.IO({
    name: 'HIDState',
    isStatic: true,
    dependencies: ['KeyboardState', 'MouseState'/*, 'Joystick', '3DMouse*/],

    component: function() {
      return state;
    },

    proccess: function(staticEntity) {
      _.clearAll(state);  // clear state

      _.extend(state, combineStates(staticEntity['KeyboardState']), {}, {}, {}, {}); //, staticEntity['MouseState'],  staticEntity['JoystickState'], staticEntity['3DMouseState']));

      bufferState = {}; // reset 
    }
  });
})();
