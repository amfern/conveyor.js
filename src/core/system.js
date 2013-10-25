comp._System = (function() {
  function constructor(config) {
    // set defaults
    config = config || {};
    config.dependencies = config.dependencies || []; // systems that should run before this one
    config.component = config.component || function() { return {}; }; // new component generator for this system

    if(_.isEmpty(config.name)) throw new Error('empty system name is not allowed');
    if(typeof(config.name) == 'name') throw new Error('"name" is saved system name');

    // The heart of the system where entities are proccessed.
    // while loop that loops througe all components of entities
    // -----------------------------------------
    if(typeof(config.proccess) != 'function') throw new Error('proccess function is mandatory');

    return {
      name: config.name,
      dependencies: config.dependencies,
      component: config.component,
      entities: [],
      proccess: config.proccess
    };
  }

  return constructor;
})();

comp.LogicSystem = (function() {
  return function(config) { return comp._registerLogicSystem( new comp._System(config) ); };
})();

comp.IOSystem = (function() {
  return function(config) { return comp._registerIOSystem( new comp._System(config) ); };
})();
