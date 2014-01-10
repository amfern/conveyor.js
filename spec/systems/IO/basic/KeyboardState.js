describe("keyboardState", function() {
  var state, tempSystem, entity, evt;

  // add reading system
  beforeEach(function() {
    tempSystem = new COMP.System.IO({
      name: 'EpicSystemReadingKeyboardState',
      dependencies: ['KeyboardState'],
      component: function() { },
      process: function(entities) {
        state = entities[0]['KeyboardState'];
      }
    });
  });

  // add entity
  beforeEach(function() {
    entity = new COMP.Entity({
      name: "EpicSystemReadingKeyboardStateEntity",
      components: ['EpicSystemReadingKeyboardState']
    });
  });

  it("should capture keydowns", function () {
    evt = keydownEvent(13);

    COMP.cycleOnce(function() {
      expect(state).toEqual({0:true});
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
      expect(state).toEqual({0:true});
    });

    evt = keydownEvent(23);

    COMP.cycleOnce(function() {
      expect(state).toEqual({0:true});
    });
  });

  it("should prevent default", function () {
    evt = keydownEvent(13);

    COMP.cycleOnce(function() {
      expect(evt.defaultPrevented).toEqual(true);
    });
  });
});