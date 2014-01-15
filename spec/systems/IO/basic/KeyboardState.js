describe("keyboardState", function() {
  var state, tempSystem, entity, evt;

  // add reading system
  beforeEach(function() {
    COMP.cycleOnce();
    tapIntoSystem('KeyboardState', function(s) {state = s;})
  });

  it("should capture keydowns", function () {
    evt = keydownEvent(13);

    COMP.cycleOnce(function() {
      expect(state).toEqual({13:true});
    });
  });

  it("should reset state each engine cycle", function () {
    COMP.cycleOnce(function() {
      expect(state).toEqual({});
    });
  });

  // webkit bug prevents me from sending other keys beside 0
  it("should capture fresh keydowns", function () {
    evt = keydownEvent(1);

    COMP.cycleOnce(function() {
      expect(state).toEqual({1: true});
    });

    evt = keydownEvent(23);

    COMP.cycleOnce(function() {
      expect(state).toEqual({23: true});
    });
  });

  it("should prevent default", function () {
    evt = keydownEvent(36);

    COMP.cycleOnce(function() {
      expect(evt.defaultPrevented).toEqual(true);
    });
  });
});