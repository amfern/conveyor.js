describe("mouseState", function() {
  var state, tempSystem, entity, evt;

  // add reading system
  beforeEach(function() {
    COMP.cycleOnce();
    tapIntoSystem('MouseState', function(s) {state = s;});
  });

  afterEach(function() {
    mouseMoveEvent(0, 0);
    COMP.cycleOnce();
  });

  it("should capture mouse move event", function () {
    mouseMoveEvent(10, 20);

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
        screenX: 0,
        screenY: 0,
        clientX: 0,
        clientY: 0
      });
    });
  });
    
  describe('mouse movement', function() {
    beforeEach(function() {
      COMP.cycleOnce();
      evt = mouseMoveEvent(10, 20);
    });

    it("should updated mouse movement state even if mouse stayed on the same place", function () {
      COMP.cycleOnce();
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

    it("should run over previous value if engine hasn't looped yet", function () {
      mouseMoveEvent(1, 45);

      COMP.cycleOnce(function() {
        expect(state).toEqual({
          mouseMoved: true,
          mouseMovedUp: false,
          mouseMovedDown: true,
          mouseMovedRight: true,
          mouseMovedLeft: false,
          movementX: 1,
          movementY: 45,
          screenX: 1,
          screenY: 45,
          clientX: 0,
          clientY: 0
        });
      });
    });

    it("should capture mousemove and mousedown", function () {
      mouseClickEvent(2);
      mouseClickEvent(1);

      COMP.cycleOnce(function() {
        expect(state).toEqual({
          mouseMoved: true,
          mouseMovedUp: false,
          mouseMovedDown: true,
          mouseMovedRight: true,
          mouseMovedLeft: false,
          movementX: 10,
          movementY: 20,
          screenX: 10,
          screenY: 20,
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

    describe('should capture fresh', function() {
      beforeEach(function() {
        COMP.cycleOnce();
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
            movementX: -9,
            movementY: -18,
            screenX: 1,
            screenY: 2,
            clientX: 3,
            clientY: 4
          });
        });
      });
    });
  });

  describe('mouse click', function() {
    beforeEach(function() {
      COMP.cycleOnce();
    });

    it("should capture mousedown button", function () {
      mouseClickEvent(0);

      COMP.cycleOnce(function() {
        expect(state).toEqual({
          movementX: 0,
          movementY: 0,
          screenX: 0,
          screenY: 0,
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
          screenX: 0,
          screenY: 0,
          clientX: 0,
          clientY: 0
        });
      });
    });
  });
});