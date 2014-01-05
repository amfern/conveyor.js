describe("keyboardState", function() {
  var state, tempSystem, entity;

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
    var evt = document.createEvent("KeyboardEvent"); 
    evt.initKeyboardEvent("keydown", true, true, window, false, false, false, false, 13, 13);
    window.document.dispatchEvent(evt);

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
    var evt = document.createEvent("KeyboardEvent"); 
    evt.initKeyboardEvent("keydown", true, true, window, false, false, false, false, 13, 13);
    window.document.dispatchEvent(evt);

    COMP.cycleOnce(function() {
      expect(state).toEqual({0:true});
    });

    var evt = document.createEvent("KeyboardEvent"); 
    evt.initKeyboardEvent("keydown", true, true, window, false, false, false, false, 13, 13);
    window.document.dispatchEvent(evt);

    COMP.cycleOnce(function() {
      expect(state).toEqual({0:true});
    });
  });

  it("should prevent default", function () {
    var evt = document.createEvent("KeyboardEvent"); 
    evt.initKeyboardEvent("keydown", true, true, window, false, false, false, false, 13, 13);
    window.document.dispatchEvent(evt);

    COMP.cycleOnce(function() {
      expect(evt.defaultPrevented).toEqual(true);
    });
  });
});