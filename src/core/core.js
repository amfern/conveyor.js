window.comp = (function() {
  var TICKS_PER_SECOND = 25,
            SKIP_TICKS = 1000 / TICKS_PER_SECOND,
         MAX_FRAMESKIP = 5,
          logicSystems = [],
             IOSystems = [],
              entities = [];

  // Private
  // --------------------------
  systemIndex = function(systems, systemName) {
    return _.findIndex(systems, function(system) { return system.name == systemName; });
  };

  systemLastDependancyPosition = function(systemsCollection, system) {
    var sysIndex = 0;

    _.each(system.dependencies, function(dependencySystem) {
      depSysIndex = systemIndex(systemsCollection, dependencySystem.name);
      deepDepSysIndex = systemLastDependancyPosition(dependencySystem);
      deepDepSysIndex = deepDepSysIndex > depSysIndex ? deepDepSysIndex : depSysIndex;
      sysIndex = deepDepSysIndex > sysIndex ? deepDepSysIndex : sysIndex;
    });

    return sysIndex;
  };

  // cycling over all logic systems and proccesing them
  proccessLogic = function() {
    _.each(logicSystems, function(system) {
      system.proccess(entities);
    });
  };

  // cycling over all input/output systems and proccesing them passing interpolation to each
  proccessIO = function(interpolation) {
    _.each(IOSystems, function(system) {
      system.proccess(entities, interpolation);
    });
  };

  // Public
  // --------------------------

  // pushes system to (logicSystem: 0; IOSystem: 1) array in the correct spot according to dependencies
  registerSystem = function(type, system) {
    var systemsCollection = type ? logicSystem : IOSystems,
              systemIndex = systemLastDependancyPosition(systemsCollection, system);

    systemsCollection.splice(systemIndex, 0, system);
  };

  // add new entity
  registerEntity = function(entity) {
    entities.push(entity);
  };

  // get better main loop
  mainLoop = function() {
    var nextGameTick = window.performance(),
        interpolation,
        loops;

    cycle = function() {
      loops = 0;
      while(window.performance() > nextGameTick && loops < MAX_FRAMESKIP) {
        proccessLogic();
        nextGameTick += SKIP_TICKS;
        loops++;
      }

      interpolation = (window.performance() + SKIP_TICKS - nextGameTick) / SKIP_TICKS;
      proccessIO(interpolation);

      window.requestAnimationFrame(mainLoop);
    };

    window.requestAnimationFrame(mainLoop);
  };

  mainLoop.registerSystem = registerSystem;
  mainLoop.registerEntity = registerEntity;
  return mainLoop;
})();
