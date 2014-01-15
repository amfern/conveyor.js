// reset engine
beforeEach(function() {
  // set timer to 0
  window.performance.now = function() { return 0; }

  // remove all entities
  COMP._clearEntities();

  // remove all systems created during test
  _.each(COMP.System.mockedSystems, function(mSys) { mSys.remove(); });
  COMP.System.mockedSystems = [];
});

function mouseEvent(type, screenX, screenY, clientX, clientY, button, clickCount) {
  var evt = document.createEvent("MouseEvent"); 
        
  evt.initMouseEvent(
    type, // eventName
    true, // bubbles 
    true, // cancelable
    window.document, // document.defaultView
    clickCount, // click count (2 for double-click)
    screenX, // screenX
    screenY, // screenY
    clientX, // clientX
    clientY, // clientY
    false, // ctrlKey
    false, // altKey
    false, // shiftKey
    false, // metaKey
    button, // button (0:left,1:Middle,2:right)
    null // relatedTargetElement
  );

  window.document.dispatchEvent(evt);
  return evt;
}

function mouseMoveEvent(screenX, screenY) {
  return mouseEvent("mousemove", screenX, screenY, 0, 0, 0, 0);
}

function mouseClickEvent(button) {
  return mouseEvent("mousedown", 0, 0, 0, 0, button, 0);
}

function keydownEvent(keyCode) {
  var eventObj = document.createEventObject ?
      document.createEventObject() : document.createEvent("Events"),
      el = window.document;

  if(eventObj.initEvent){
    eventObj.initEvent("keydown", true, true);
  }

  eventObj.keyCode = keyCode;
  eventObj.which = keyCode;
  
  el.dispatchEvent ? el.dispatchEvent(eventObj) : el.fireEvent("onkeydown", eventObj); 
  // doesn't work for chrome browsers
  // var evt = document.createEvent("KeyboardEvent"); 
  // evt.initKeyboardEvent("keydown", true, true, window, false, false, false, false, key, key);
  // window.document.dispatchEvent(evt);
  return eventObj;
}

function tapIntoSystem(systemName, callback) {
  // add reading system
  new COMP.System.IO({
    name: 'EpicSystemReading' + systemName,
    dependencies: [systemName],
    component: function() { },
    process: function(entities) {
      callback(entities[0][systemName]);
    }
  });
  entity = new COMP.Entity({
    name: "EpicSystemReading" + systemName + "Entity",
    components: ['EpicSystemReading' + systemName]
  });
}