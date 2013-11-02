window.COMP = (function() {
  var         TICKS_PER_SECOND = 25,
                    SKIP_TICKS = 1000 / TICKS_PER_SECOND,
                 MAX_FRAMESKIP = 5,
              tempLogicSystems = [],
      tempInterpolationSystems = [],
                 tempIOSystems = [],
                 systemsByName = {},
            firstLogicCallback,
    firstInterpolationCallback,
               firstIOCallback,
                 interpolation,
                         loops = 0,
                  nextGameTick;

  // Private
  // --------------------------
  function systemIndex(systems, systemName) {
    return _.findIndex(systems, function(system) { return system.name == systemName; });
  }

  function registerSystem(systemCollection, system) {
    if(systemsByName[system.name]) throw new Error('system under name "' + system.name + '" already exists');

    _.each(system.dependencies, function(depName) {
      if(depName == system.name) throw new Error('system cannot depend on it self');
    });

    systemCollection.push(system);
    systemsByName[system.name] = system;
    
    return system;
  }

  // adds system and it dependancies in order
  // returns system index
  function addSystem(tempSystemCollection, systemCollection, tempSys) {
    var sysIndex = systemIndex(systemCollection, tempSys.name);

    if( sysIndex != -1 ) return sysIndex; // do nothing if system already exists

    // add dependancies
    _.each(tempSys.dependencies, function(depSysName) {
      var depSys = _.find(tempSystemCollection, function(s) { return s.name == depSysName; }); // resolve depndancy
      if(!depSys) return; // continue loop if depandancy system doesn't exists
      var tempSysIndex = addSystem(tempSystemCollection, systemCollection, depSys); // add system
      sysIndex++;
      sysIndex = sysIndex > tempSysIndex ? sysIndex : tempSysIndex; // set the highest depandancy
    });

    // TODO: rise event system finish loading(tempSys);
    sysIndex++;
    systemCollection.splice(sysIndex, 0, tempSys); // add system it self

    return sysIndex;
  }

  function prepareSystem(tempSystemCollection, lastYield) {
    if(!tempSystemCollection.length)
      return lastYield;

    var systemCollection = [];

    // add systems in the correct order for dependancies
    _.each(tempSystemCollection, function(tempSys) {
      addSystem(tempSystemCollection, systemCollection, tempSys);
    });

    constructCallbacks = function(sys, i) {
      if(!sys) return lastYield;

      i++;
      var nextCallback = constructCallbacks(systemCollection[i], i);
      return function() {
        sys.proccess(sys.entities, interpolation, nextCallback);
        if(true) nextCallback(); // TODO: if last system spawned new thread don't execute this callback
      };
    };

    return constructCallbacks(_.first(systemCollection), 0);
  }

  // adds system and it dependancies in order
  // returns system index
  function addEntityComponents(entity, componentNames) {
    _.each(componentNames, function(componentName) {
      if(entity[componentName]) return; // do nothing if component already exists
      
      var system = systemsByName[componentName];

      if(!system) return; // dependancy not found

      system.entities.push(entity);
      entity[system.name] = system.component();

      addEntityComponents(entity, system.dependencies);
    });
  }

  // cycling over all logic systems and proccesing them
  function proccessLogic() {
    if(window.performance.now() >= nextGameTick && loops < MAX_FRAMESKIP) {
      nextGameTick += SKIP_TICKS;
      loops++;
      firstLogicCallback();
      return;
    }

    loops = 0;
    
    proccessInterpolation();
  }

  // cycling over all interpolation systems and proccesing them passing interpolation to each
  function proccessInterpolation() {
    interpolation = (window.performance.now() + SKIP_TICKS - nextGameTick) / SKIP_TICKS;
    firstInterpolationCallback();
  }

  // cycling over all input/output systems
  function proccessIO() {
    firstIOCallback();
  }

  function proccessNextFrame() {
    window.requestAnimationFrame(proccessLogic);
  }

  // Public
  // --------------------------

  // pushes system to (logicSystem: 0; IOSystem: 1) array in the correct spot according to dependencies
  function registerLogicSystem(system) {
    return registerSystem(tempLogicSystems, system);
  }

  function registerInterpolateSystem(system) {
    return registerSystem(tempInterpolationSystems, system);
  }

  function registerIOSystem(system) {
    return registerSystem(tempIOSystems, system);
  }

  // add new entity
  function registerEntity(entity) {
    addEntityComponents(entity, entity.components);
  }
  
  function mainLoop() {
    nextGameTick = window.performance.now();

    firstLogicCallback         = prepareSystem(tempLogicSystems, proccessLogic);
    firstInterpolationCallback = prepareSystem(tempInterpolationSystems, proccessIO);
    firstIOCallback            = prepareSystem(tempIOSystems, proccessNextFrame);

    proccessNextFrame();
  }
  
  mainLoop._registerLogicSystem = registerLogicSystem;
  mainLoop._registerIOSystem = registerIOSystem;
  mainLoop._registerInterpolateSystem = registerInterpolateSystem;
  mainLoop._registerEntity = registerEntity;
  return mainLoop;
})();