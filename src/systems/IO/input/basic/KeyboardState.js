// Collects keyboard inputs state collection of keycodes that currently pressed, if its not true then it false and its up
// -----------------------------------------
(function() {
  var state = {}, bufferState = {};

  function init() {
    var element = COMP.getDOMElement();

    element.addEventListener('keydown', function(e) {
      bufferState[e.key] = true;
      e.preventDefault();
    }, false);
  }

  init();

  new COMP.System.IO({
    name: 'KeyboardState',
    isStatic: true,
    dependencies: [],

    component: function() {
      return state;
    },

    proccess: function(staticEntity) {
      _.clearAll(state);  // clear state
      _.extend(state, bufferState); // copy bufferState to state
      bufferState = {}; // reset 
    }
  });
})();
