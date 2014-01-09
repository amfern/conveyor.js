// Collects Mouse inputs state, collection of keycodes that currently pressed, if its not true then it false and its up
// Analog states will be passed as {mouseMoved: true, mouseMovedUp: true, mouseMoveY: -0.73}
// -----------------------------------------
(function() {
  var state = {}, prevMovementBuffer, movementBuffer, buttonBuffer = {};

  function init() {
    // set initial state
    movementBuffer = {
      movementX: 0,
      movementY: 0,
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0
    };

    // set initial prevMovementBuffer
    prevMovementBuffer = {
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0
    };

    var element = window.document;

    element.addEventListener('mousemove', function(e) {
      movementBuffer.screenX = e.screenX;
      movementBuffer.screenY = e.screenY;
      movementBuffer.clientX = e.clientX;
      movementBuffer.clientY = e.clientY;

      e.preventDefault();
    }, false);

    element.addEventListener('mousedown', function(e) {
      buttonBuffer[e.button] = true;
      e.preventDefault();
    }, false);
  }

  function processMovementBuffer() {
    // calculate movement
    movementBuffer.movementX = movementBuffer.screenX - prevMovementBuffer.screenX;
    movementBuffer.movementY = movementBuffer.screenY - prevMovementBuffer.screenY;

    // set previous position to current
    prevMovementBuffer.screenX = movementBuffer.screenX;
    prevMovementBuffer.screenY = movementBuffer.screenY;
    prevMovementBuffer.clientX = movementBuffer.clientX;
    prevMovementBuffer.clientY = movementBuffer.clientY;

    // calculate mouse movementBuffers
    movementBuffer.mouseMovedUp    = movementBuffer.movementY < 0;
    movementBuffer.mouseMovedDown  = movementBuffer.movementY > 0;
    movementBuffer.mouseMovedLeft  = movementBuffer.movementX < 0;
    movementBuffer.mouseMovedRight = movementBuffer.movementX > 0;
    movementBuffer.mouseMoved      = !movementBuffer.movementX && !movementBuffer.movementY ? false : true;
  }

  init();

  new COMP.System.IO({
    name: 'MouseState',
    isStatic: true,
    dependencies: [],

    component: function() {
      return state;
    },

    process: function(staticEntity) {
      processMovementBuffer();

      _.clearAll(state);  // clear state
      _.extend(state, movementBuffer); // copy bufferState to state
      _.extend(state, buttonBuffer); // copy bufferState to state
      
      buttonBuffer = {}; // reset down buttons
    }
  });
})();
