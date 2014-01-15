describe("HIDState", function() {
  var state, tempSystem, entity;

  // add reading system
  beforeEach(function() {    
    COMP.cycleOnce();
    tapIntoSystem('HIDState', function(s) {state = s;})
  });

  afterEach(function() {
    mouseMoveEvent(0, 0);
    COMP.cycleOnce();
  });

  describe('mouse movement', function() {
    it("should capture HID state of mouseMove, mouseClick, keydown", function () {
      mouseMoveEvent(10, 20);
      mouseClickEvent(0);
      keydownEvent(13);

      COMP.cycleOnce(function() {
        expect(state).toEqual({
          k13: true,
          mmovementX: 10,
          mmovementY: 20,
          mscreenX: 10,
          mscreenY: 20,
          mclientX: 0,
          mclientY: 0,
          mmouseMovedUp: false,
          mmouseMovedDown: true,
          mmouseMovedLeft: false,
          mmouseMovedRight: true,
          mmouseMoved: true,
          m0: true
        });
      });
    });

    it("should capture new states", function () {
      COMP.cycleOnce(function() {
        expect(state).toEqual({
          mmovementX: 0,
          mmovementY: 0,
          mscreenX: 0,
          mscreenY: 0,
          mclientX: 0,
          mclientY: 0,
          mmouseMovedUp: false,
          mmouseMovedDown: false,
          mmouseMovedLeft: false,
          mmouseMovedRight: false,
          mmouseMoved: false
        });
      });
    });
  });
});