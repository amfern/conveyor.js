// Collects inputs states from keyboard,mouse,joystick, 3Dmouse
// -----------------------------------------
(function() {
  var state = {};

  function combineStates(keyboardState, mouseState, joystickState, Mouse3DState) {
    return _.extend({}, _.prefixKeys(keyboardState, 'k'), _.prefixKeys(mouseState, 'm'), _.prefixKeys(joystickState, 'j'), _.prefixKeys(Mouse3DState, 'm3d'));
  }

  new COMP.System.IO({
    name: 'HIDState',
    isStatic: true,
    dependencies: ['KeyboardState', 'MouseState'/*, 'Joystick', '3DMouse*/],

    component: function() {
      return state;
    },

    process: function(staticEntity) {
      _.clearAll(state);  // clear state
      _.extend(state, combineStates(staticEntity.KeyboardState), {}, {}, {}, {}); //, staticEntity['MouseState'],  staticEntity['JoystickState'], staticEntity['Mouse3DState']));
      bufferState = {}; // reset 
    }
  });
})();
