// Core of the engine, responsble for game loop and proccessing system entitites
// element(optional) - DOM element onto which keyboar and mouse event bound and rendering happens
// -----------------------------------------
window.COMP = (function(element) {
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
                  staticEntity,
                    domElement;

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

    // TODO: rise event telling that "system finish loading(tempSys)";
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
      sys.yield = nextCallback;

      return function() {
        sys.isStatic ? sys.proccess(staticEntity, interpolation) : sys.proccess(sys.entities, interpolation); // proccess system, if static pass only the static entity else pass all entities
        if(!sys.thread) sys.yield(); // yield if not threaded system
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

  // adds system and it dependancies in order
  // returns system index
  function updateEntityComponents(oldEntity, newEntity, componentNames) {
    _.each(componentNames, function(componentName) {
      var system = systemsByName[componentName];
      
      if(!system) return; // dependancy not found

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

      if(!system) return; // dependancy not found

      delete entity[componentName]; // remove componenet from entity
      system.entities.splice(system.entities.indexOf(entity), 1); // remove entity from system

      removeEntityComponents(entity, system.dependencies);
    });
  }

  // cycling over all logic systems and proccesing them
  function proccessLogic() {
    interpolation = null;

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

  // start proccesing chain from proccessLogic callback
  function proccessNextFrame() {
    window.requestAnimationFrame(proccessLogic);
  }

  // constructs entity only for static systems to use
  function constructStaticEntity() {
    var staticSystems = _.filter(systemsByName, function(sys) { return sys.isStatic; }); // filter only static systems
    staticSystems = _.map(staticSystems, function(sys) { return sys.name });// collect only static system names

    // create new entity coposing only of static systems
    return new COMP.Entity({
      name: "staticEntity",
      components: staticSystems,
    });
  }

  // Public
  // --------------------------

  // pushes system to array in the correct spot according to dependencies
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

  function unregisterEntity(entity) {
    removeEntityComponents(entity, entity.components);
  }

  function updateEntity(entity) {
    var newEntity = new COMP.Entity({name: entity.name});
    newEntity.components = entity.components;
    updateEntityComponents(entity, newEntity, newEntity.components);
    removeEntityComponents( entity, _.keys(entity) ); // remove other components
  }

  function getDOMElement() {
    return domElement;
  }
  
  function mainLoop() {
    domElement = element || document.createElement('div');
    nextGameTick = window.performance.now();

    firstLogicCallback         = prepareSystem(tempLogicSystems, proccessLogic);
    firstInterpolationCallback = prepareSystem(tempInterpolationSystems, proccessIO);
    firstIOCallback            = prepareSystem(tempIOSystems, proccessNextFrame);

    staticEntity = constructStaticEntity();

    proccessNextFrame();
  }
  
  mainLoop._registerLogicSystem       = registerLogicSystem;
  mainLoop._registerIOSystem          = registerIOSystem;
  mainLoop._registerInterpolateSystem = registerInterpolateSystem;
  mainLoop._registerEntity            = registerEntity;
  mainLoop._unregisterEntity          = unregisterEntity;
  mainLoop._updateEntity              = updateEntity;
  mainLoop.getDOMElement = getDOMElement;
  return mainLoop;
})();