describe("HIDState", function() {
  var state, tempSystem, entity;
  // add reading system
  beforeEach(function() {
    tempSystem = new COMP.System.IO({
      name: 'EpicSystemReadingHIDState',
      dependencies: ['HIDState'],
      component: function() { },
      process: function(entities) {
        state = entities[0]['HIDState'];
      }
    });
  });

  // add entity
  beforeEach(function() {
    entity = new COMP.Entity({
      name: "EpicSystemReadingHIDStateEntity",
      components: ['EpicSystemReadingHIDState']
    });
  });

  afterEach(function() {
    mouseEvent("mousemove", 0, 0, 0, 0, 0, 0);
  });

  describe('mouse movement', function() {
    it("should capture HID state of mouseMove, mouseClick, keydown", function () {
      mouseMoveEvent(10, 20);
      mouseClickEvent(0);
      keydownEvent(13);

      COMP.cycleOnce(function() {
        expect(state).toEqual({
          k0: true,
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
          mmovementX: -10,
          mmovementY: -20,
          mscreenX: 0,
          mscreenY: 0,
          mclientX: 0,
          mclientY: 0,
          mmouseMovedUp: true,
          mmouseMovedDown: false,
          mmouseMovedLeft: true,
          mmouseMovedRight: false,
          mmouseMoved: true
        });
      });
    });
  });
});