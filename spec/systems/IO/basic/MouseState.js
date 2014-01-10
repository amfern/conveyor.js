describe("mouseState", function() {
  var state, tempSystem, entity, evt;

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

  // reset mouse to 0,0 position after each test
  afterEach(function() {
    mouseEvent("mousemove", 0, 0, 0, 0, 0, 0);
  });

  describe('mouse movement', function() {
    beforeEach(function() {
      evt = mouseMoveEvent(10, 20);
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
        evt = mouseClickEvent(0);
  
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
        evt = mouseMoveEvent(15, 5);
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
        evt = mouseClickEvent(2);
        evt = mouseClickEvent(1);

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

      // do just a normal event dispatch test with helpers and include clientX and clientY
      it("should fill state correctly", function () {
        evt = mouseEvent("mousemove", 1, 2, 3, 4, 0, 0);

        COMP.cycleOnce(function() {
          expect(state).toEqual({
            mouseMoved: true,
            mouseMovedUp: true,
            mouseMovedDown: false,
            mouseMovedRight: false,
            mouseMovedLeft: true,
            movementX: -14,
            movementY: -3,
            screenX: 1,
            screenY: 2,
            clientX: 3,
            clientY: 4
          });
        });
      
      });

    });

  });

});