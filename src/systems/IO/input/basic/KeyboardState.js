// Collects keyboard inputs state collection of keycodes that currently pressed, if its not true then it false and its up
// -----------------------------------------
(function() {
  var state = {}, bufferState = {};

  function init() {
    var element = window.document;

    element.addEventListener('keydown', function(e) {
      bufferState[e.keyCode] = true;
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

    process: function(staticEntity) {
      _.clearAll(state);  // clear state
      _.extend(state, bufferState); // copy bufferState to state
      bufferState = {}; // reset 
    }
  });
})();
