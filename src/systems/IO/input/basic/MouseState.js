// Collects Mouse inputs state, collection of keycodes that currently pressed, if its not true then it false and its up
// Analog states will be passed as {mouseMoved: true, mouseMovedUp: true, mouseMoveY: -0.73}
// -----------------------------------------
(function() {
  var state = {}, bufferState;

  function init() {
    var element = COMP.getDOMElement();
    resetBuffer(); // reset buffer

    element.addEventListener('mousemove', function(e) {
      bufferState.movementX += e.movementX;
      bufferState.movementY += e.movementY;

      bufferState[mouseMovedUp]    = bufferState.movementY > 0;
      bufferState[mouseMovedDown]  = bufferState.movementY < 0;
      bufferState[mouseMovedRight] = bufferState.movementX > 0;
      bufferState[mouseMovedLeft]  = bufferState.movementX < 0;

      bufferState.clientX += e.clientX;
      bufferState.clientY += e.clientY;
      bufferState.screenX += e.screenX;
      bufferState.screenY += e.screenY;

      bufferState.mouseMoved = !bufferState.movementX && !bufferState.movementY ? false : true;

      e.preventDefault();
    }, false);

    element.addEventListener('mousedown', function(e) {
      bufferState[e.button] = true;
      e.preventDefault();
    }, false);
  }

  function resetBuffer() {
    bufferState = {clientX: 0,clientY: 0, screenX: 0, screenY: 0};
  }

  init();

  new COMP.System.IO({
    name: 'MouseState',
    isStatic: true,
    dependencies: [],

    component: function() {
      return state;
    },

    proccess: function(staticEntity) {
      _.clearAll(state);  // clear state
      _.extend(state, bufferState); // copy bufferState to state
      resetBuffer(); // reset 
    }
  });
})();
