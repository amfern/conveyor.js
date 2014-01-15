// mock system types to be deleted after each test
(function() {
  function cycle(specCallback, cycleTime) {
    window.performance.now = function() { return 0; }
    window.requestAnimationFrame = _.once(function(callback) {
      window.performance.now = function() { return cycleTime; } // milliseconds
      callback.call();
      specCallback && specCallback.call();
    });
    COMP();
  }

  function cycleMany(cycleCallback, count, specCallback, index) {
    cycleCallback(function() {
      if(index == count-1) {specCallback.call(); return;}
      cycleMany(cycleCallback, count, specCallback, (index || 0)+1);
    });
  };

  // cycle once
  COMP.cycleOnce = function(specCallback) {
    cycle(specCallback, COMP.SKIP_TICKS -1);
  };
  
  // cycle half
  COMP.cycleHalf = function(specCallback) {
    cycle(specCallback, COMP.SKIP_TICKS/2 -1);
  };

  // spiral engine cycle is when engine avoiding spiral of death doing the maximum allowed cycles
  COMP.spiralCycle = function(specCallback) {
    cycle(specCallback, COMP.SKIP_TICKS * COMP.MAX_FRAMESKIP+1);
  };
  
  // cycleMany
  COMP.cycleMany = function(count, specCallback) {
    cycleMany(COMP.cycleOnce, count, specCallback);
  };

  // cycleMany
  COMP.cycleMany = function(count, specCallback) {
    cycleMany(COMP.cycleHalf, count, specCallback);
  };

  // spiralMany
  COMP.spiralCycleMany = function(count, specCallback) {
    cycleMany(COMP.spiralCycle, count, specCallback);
  };
})();