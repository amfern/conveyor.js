// Core of the engine, responsible for game loop and processing system entities
// -----------------------------------------
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
                         loops = 0,
                 interpolation,
                  nextGameTick,
                  staticEntity;

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

  function unregisterSystem(systemCollection, system) {
    if(system.entities.length) throw new Error('entities still using this system, please remove dependent entities before removing the system');

    var sys = systemsByName[system.name];
    if(!sys) return;

    delete systemsByName[system.name];
    systemCollection.splice(systemCollection.indexOf(sys), 1); // remove system
  }

  // adds system and it dependencies in order
  // returns system index
  function addSystem(tempSystemCollection, systemCollection, tempSys) {
    var sysIndex = systemIndex(systemCollection, tempSys.name);

    if( sysIndex != -1 ) return sysIndex; // do nothing if system already exists

    // add dependencies
    _.each(tempSys.dependencies, function(depSysName) {
      var depSys = systemsByName[depSysName]; // resolve dependency

      if(!depSys) throw new Error('Dependency system not found'); // throw exception if dependency system doesn't exists
      if(tempSys.isStatic && !depSys.isStatic) throw new Error('Static system can\'t have non-static system as dependency'); // throw exception if static system has non-static system as dependency
      if(depSys && !_.find(tempSystemCollection, function(s) { return s.name == depSysName; })) return; // continue loop if dependency system not found but exists in the engine

      var tempSysIndex = addSystem(tempSystemCollection, systemCollection, depSys); // add system
      sysIndex++;
      sysIndex = sysIndex > tempSysIndex ? sysIndex : tempSysIndex; // set the highest dependency
    });

    // TODO: rise event telling that "system finish loading(tempSys)";
    sysIndex++;
    systemCollection.splice(sysIndex, 0, tempSys); // add system it self

    return sysIndex;
  }

  function prepareSystem(tempSystemCollection, lastYield) {
    if(!tempSystemCollection.length)
      return lastYield;

    var systemCollection = [];

    // add systems in the correct order for dependencies
    _.each(tempSystemCollection, function(tempSys) {
      addSystem(tempSystemCollection, systemCollection, tempSys);
    });

    constructCallbacks = function(sys, i) {
      if(!sys) return lastYield;

      i++;
      var nextCallback = constructCallbacks(systemCollection[i], i);
      sys.yield = nextCallback;

      // if system static pass only the static entity else pass all entities
      var processEntities = sys.isStatic ? staticEntity : sys.entities;

      return function() {
        sys.process(processEntities, interpolation); // process system
        if(!sys.thread) sys.yield(); // yield if not threaded system
      };
    };

    return constructCallbacks(_.first(systemCollection), 0);
  }

  // adds entity and it dependencies in order
  function addEntityComponents(entity, componentNames) {
    _.each(componentNames, function(componentName) {
      if(entity[componentName]) return; // do nothing if component already exists
      
      var system = systemsByName[componentName];

      if(!system) throw new Error('System "' + componentName + '" not found'); // throw exception if dependency system doesn't
      entity[system.name] = system.component();

      if(!system.isStatic) system.entities.push(entity); // static systems depend only on other static systems

      addEntityComponents(entity, system.dependencies);
    });
  }

  // updates entity and it components
  function updateEntityComponents(oldEntity, newEntity, componentNames) {
    _.each(componentNames, function(componentName) {
      var system = systemsByName[componentName];
      
      if(!system) return; // dependency not found

      // if oldEntity already have that components, use it instead of creating new one
      var oldEntityComponent = oldEntity[componentName];
      if(oldEntityComponent) {
        newEntity[componentName] = oldEntityComponent;
        delete oldEntity[componentName]; // delete component from old entity
        system.entities.splice(system.entities.indexOf(oldEntity), 1, newEntity); // replace old entity with new one
        updateEntityComponents(oldEntity, newEntity, system.dependencies);
      } else {
        addEntityComponents(newEntity, system.dependencies);
      }
    });
  }

  // removes systems
  function removeEntityComponents(entity, componentNames) {
    _.each(componentNames, function(componentName) {
      var system = systemsByName[componentName];

      if(!system) return; // dependency not found

      delete entity[componentName]; // remove component from entity
      system.entities.splice(system.entities.indexOf(entity), 1); // remove entity from system

      removeEntityComponents(entity, system.dependencies);
    });
  }

  // cycling over all logic systems and processing them
  function processLogic() {
    interpolation = null;

    if(window.performance.now() >= nextGameTick && loops < MAX_FRAMESKIP) {
      nextGameTick += SKIP_TICKS;
      loops++;
      firstLogicCallback();
      return;
    }

    loops = 0;
    
    processInterpolation();
  }

  // cycling over all interpolation systems and processing them passing interpolation to each
  function processInterpolation() {
    interpolation = (window.performance.now() + SKIP_TICKS - nextGameTick) / SKIP_TICKS;
    firstInterpolationCallback();
  }

  // cycling over all input/output systems
  function processIO() {
    firstIOCallback();
  }

  // start processing chain from processLogic callback
  function processNextFrame() {
    window.requestAnimationFrame(processLogic);
  }

  // constructs entity only for static systems to use
  function constructStaticEntity() {
    var staticSystems = _.filter(systemsByName, function(sys) { return sys.isStatic; }); // filter only static systems
    staticSystems = _.map(staticSystems, function(sys) { return sys.name; });// collect only static system names

    // create new entity composing only of static systems
    var staticEntity = new COMP.StaticEntity({
      name: "staticEntity",
      components: staticSystems,
    });

    return staticEntity;
  }

  // Public
  // --------------------------

  // pushes system to array in the correct spot according to dependencies
  function registerLogicSystem(system) {
    return registerSystem(tempLogicSystems, system);
  }

  function unregisterLogicSystem(system) {
    return unregisterSystem(tempLogicSystems, system);
  }

  function registerInterpolateSystem(system) {
    return registerSystem(tempInterpolationSystems, system);
  }

  function unregisterInterpolateSystem(system) {
    return unregisterSystem(tempInterpolationSystems, system);
  }

  function registerIOSystem(system) {
    return registerSystem(tempIOSystems, system);
  }

  function unregisterIOSystem(system) {
    return unregisterSystem(tempIOSystems, system);
  }

  // add new entity
  function registerEntity(entity) {
    addEntityComponents(entity, entity.components);
  }

  function unregisterEntity(entity) {
    removeEntityComponents(entity, entity.components);
  }

  function updateEntity(entity) {
    var newEntity = new COMP.Entity({name: entity.name});
    newEntity.components = entity.components;
    updateEntityComponents(entity, newEntity, newEntity.components);
    removeEntityComponents( entity, _.keys(entity) ); // remove other components
  }

  // clear all entities of all systems
  function clearEntities() {
    _.each(systemsByName, function(sys) {
      sys.entities = [];
    });
  }

  // clear all systems(which clears entities also)
  function clearSystems() {
    tempLogicSystems = [];
    tempInterpolationSystems = [];
    tempIOSystems = [];
    systemsByName = {};
  }

  
  function mainLoop() {
    nextGameTick = window.performance.now();

    staticEntity = constructStaticEntity();

    firstLogicCallback         = prepareSystem(tempLogicSystems, processLogic);
    firstInterpolationCallback = prepareSystem(tempInterpolationSystems, processIO);
    firstIOCallback            = prepareSystem(tempIOSystems, processNextFrame);

    processNextFrame();
  }
  
  mainLoop._registerLogicSystem         = registerLogicSystem;
  mainLoop._unregisterLogicSystem       = unregisterLogicSystem;
  mainLoop._registerIOSystem            = registerIOSystem;
  mainLoop._unregisterIOSystem          = unregisterIOSystem;
  mainLoop._registerInterpolateSystem   = registerInterpolateSystem;
  mainLoop._unregisterInterpolateSystem = unregisterInterpolateSystem;
  mainLoop._registerEntity              = registerEntity;
  mainLoop._unregisterEntity            = unregisterEntity;
  mainLoop._updateEntity                = updateEntity;
  mainLoop._clearEntities               = clearEntities;
  mainLoop._clearSystems                = clearSystems;
  mainLoop.TICKS_PER_SECOND             = TICKS_PER_SECOND;
  mainLoop.SKIP_TICKS                   = SKIP_TICKS;
  mainLoop.MAX_FRAMESKIP                = MAX_FRAMESKIP;
  return mainLoop;
})();
