beforeEach(function() {
  function cycle(cycleCallback, cycleTime) {
    window.performance.now = function() { return 0; }
    window.requestAnimationFrame = _.once(function(callback) {
      window.performance.now = function() { return cycleTime; } // milliseconds
      callback.call();
      cycleCallback.call();
    });
    COMP();
  }

  // cycle once
  COMP.cycleOnce = function(specCallback) {
    cycle(specCallback, ++COMP.TICKS_PER_SECOND);
  };
  
  // full engine cycle is when engine avoiding spiral of death doing the maximum allowed cycles
  COMP.spiralCycle = function(specCallback) {
    cycle(specCallback, Number.MAX_VALUE);
  };

});


// half full engine cycle

// half full engine cycle

beforeEach(function() {
  // remove all systems and entities
});