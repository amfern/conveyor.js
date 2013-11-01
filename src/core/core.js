window.COMP = (function() {
var       TICKS_PER_SECOND = 25,
                SKIP_TICKS = 1000 / TICKS_PER_SECOND,
             MAX_FRAMESKIP = 5,
          tempLogicSystems = [],
  tempInterpolationSystems = [],
             tempIOSystems = [],
             systemsByName = {},
              logicSystems,
      interpolationSystems,
                 IOSystems;

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

  function prepareSystem(tempSystemCollection) {
    var systemCollection = [];

    _.each(tempSystemCollection, function(tempSys) {
      addSystem(tempSystemCollection, systemCollection, tempSys);
    });

    return systemCollection;
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
    _.each(logicSystems, function(system) {
      system.proccess(system.entities);
    });
  }

  // cycling over all interpolation systems and proccesing them passing interpolation to each
  function proccessInterpolation(interpolation) {
    _.each(interpolationSystems, function(system) {
      system.proccess(system.entities, interpolation);
    });
  }

  // cycling over all input/output systems
  function proccessIO() {
    _.each(IOSystems, function(system) {
      system.proccess(system.entities);
    });
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
    var interpolation,
                loops,
         nextGameTick = window.performance.now();

    logicSystems         = prepareSystem(tempLogicSystems);
    interpolationSystems = prepareSystem(tempInterpolationSystems);
    IOSystems            = prepareSystem(tempIOSystems);

    function cycle() {
      loops = 0;
      while(window.performance.now() >= nextGameTick && loops < MAX_FRAMESKIP) {
        proccessLogic();
        nextGameTick += SKIP_TICKS;
        loops++;
      }

      interpolation = (window.performance.now() + SKIP_TICKS - nextGameTick) / SKIP_TICKS;
      
      proccessInterpolation(interpolation);
      proccessIO();

      window.requestAnimationFrame(cycle);
    }

    window.requestAnimationFrame(cycle);
  }
  
  mainLoop._registerLogicSystem = registerLogicSystem;
  mainLoop._registerIOSystem = registerIOSystem;
  mainLoop._registerInterpolateSystem = registerInterpolateSystem;
  mainLoop._registerEntity = registerEntity;
  return mainLoop;
})();