window.comp = (function() {
  var systems, updateInterval, entities;

  systems = [];
  entities = [];
  updateInterval = 0.03;

  // cycling over all systems and proccesing them
  proccessSystems = function(name, system) {
    // for (var i = 0, x; x= p[i]; i += 1) {
     
    // }
  };

  // pushes system to system array in the correct spot according to dependencies
  registerSystem = function(system) {

  };

  // add new entity
  registerEntity = function(entity) {

  };

  // get better main loop
  mainLoop = function() {
    var time = 0,
        deltaTime = this.updateInterval,
        currentTime = window.perfNow() / 1000, // Maybe delegate this to an outer Timer class.
        newTime = 0,
        frameTime = 0,
        accumulator = 0,
        alpha,
        that = this;
      
    function frameUpdate() {
      newTime = window.perfNow() / 1000;
      frameTime = newTime - currentTime;
      
      if (frameTime > deltaTime * 10) {
        frameTime = deltaTime * 10; // avoiding spiral of death
      } 

      currentTime = newTime;
      
      accumulator += frameTime;
  
      while(accumulator >= deltaTime) {
        that.update(time, deltaTime);
        
        time += deltaTime;
        accumulator -= deltaTime;
      }
      
      alpha = accumulator / deltaTime;
  
      that.render(alpha);
                  
      window.requestAnimationFrame(frameUpdate);
    }

    window.requestAnimationFrame(frameUpdate);
  };

  mainLoop.registerSystem = registerSystem;
  mainLoop.registerEntity = registerEntity;
  return mainLoop;
})();
