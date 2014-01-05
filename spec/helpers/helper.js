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