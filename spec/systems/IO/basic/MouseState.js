describe("mouseState", function() {
  var state, tempSystem, entity, evt;

  function mouseEvent(type, screenX, screenY, clientX, clientY, button, clickCount) {
    evt = document.createEvent("MouseEvent"); 
          
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
  }

  function mouseMoveEvent(screenX, screenY) {
    mouseEvent("mousemove", screenX, screenY, 0, 0, 0, 0);
  }

  function mouseClickEvent(button) {
    mouseEvent("mousedown", 0, 0, 0, 0, button, 0);
  }

  function mouseDoubleClickEvent(button, clickCount) {
    mouseEvent("dblclick", 0, 0, 0, 0, button, clickCount);
  }

  // add reading system
  beforeEach(function() {
    tempSystem = new COMP.System.IO({
      name: 'EpicSystemReadingMouseState',
      dependencies: ['MouseState'],
      component: function() { },
      process: function(entities) {
        state = entities[0]['MouseState'];
      }
    });
  });

  // add entity
  beforeEach(function() {
    entity = new COMP.Entity({
      name: "EpicSystemReadingMouseStateEntity",
      components: ['EpicSystemReadingMouseState']
    });
  });


  it("should fill state correctly", function () {
    // do just a normal event dispatch test with helpers and include clientX and clientY
  });

  describe('mouse movement', function() {
    beforeEach(function() {
      mouseMoveEvent(10, 20);
    });
    
    it("should capture mouse move event", function () {
      COMP.cycleOnce(function() {
        expect(state).toEqual({
          mouseMoved: true,
          mouseMovedUp: false,
          mouseMovedDown: true,
          mouseMovedRight: true,
          mouseMovedLeft : false,
          movementX: 10,
          movementY: 20,
          screenX: 10,
          screenY: 20,
          clientX: 0,
          clientY: 0
        });
      });
    });

    it("should reset state each engine cycle", function () {
      COMP.cycleOnce(function() {
        expect(state).toEqual({
          mouseMoved: false,
          mouseMovedUp: false,
          mouseMovedDown: false,
          mouseMovedRight: false,
          mouseMovedLeft: false,
          movementX: 0,
          movementY: 0,
          screenX: 10,
          screenY: 20,
          clientX: 0,
          clientY: 0
        });
      });
    });

    describe('mouse click', function() {
      it("should capture mousedown button", function () {
        mouseClickEvent(0);
  
        COMP.cycleOnce(function() {
          expect(state).toEqual({
            movementX: 0,
            movementY: 0,
            screenX: 10,
            screenY: 20,
            clientX: 0,
            clientY: 0,
            mouseMovedUp: false,
            mouseMovedDown:
            false,
            mouseMovedLeft: false,
            mouseMovedRight: false,
            mouseMoved: false,
            0: true
          });
        });
      });

      it("should reset state each engine cycle", function () {
        COMP.cycleOnce(function() {
          expect(state).toEqual({
            mouseMoved: false,
            mouseMovedUp: false,
            mouseMovedDown: false,
            mouseMovedRight: false,
            mouseMovedLeft: false,
            movementX: 0,
            movementY: 0,
            screenX: 10,
            screenY: 20,
            clientX: 0,
            clientY: 0
          });
        });
      });
    });

    describe('should capture fresh', function() {
      beforeEach(function() {
        mouseMoveEvent(15, 5);
      });

      it("movement", function () {
        COMP.cycleOnce(function() {
          expect(state).toEqual({
            mouseMoved: true,
            mouseMovedUp: true,
            mouseMovedDown: false,
            mouseMovedRight: true,
            mouseMovedLeft: false,
            movementX: 5,
            movementY: -15,
            screenX: 15,
            screenY: 5,
            clientX: 0,
            clientY: 0
          });
        });
      });

      it("should prevent default", function () {
        COMP.cycleOnce(function() {
          expect(evt.defaultPrevented).toEqual(true);
        });
      });

      it("mouse click", function () {
        mouseClickEvent(2);
        mouseClickEvent(1);
        
        COMP.cycleOnce(function() {

          expect(state).toEqual({
            mouseMoved: false,
            mouseMovedUp: false,
            mouseMovedDown: false,
            mouseMovedRight: false,
            mouseMovedLeft: false,
            movementX: 0,
            movementY: 0,
            screenX: 15,
            screenY: 5,
            clientX: 0,
            clientY: 0,
            2: true,
            1: true
          });
        });
      });

      it("should prevent default", function () {
        COMP.cycleOnce(function() {
          expect(evt.defaultPrevented).toEqual(true);
        });
      });

    });

  });

});