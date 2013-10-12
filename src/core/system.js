comp.System = (function(type, config) {
  var constructor;

  constructor = function() {
    // set defaults
    config = config || {};
    config.dependencies = config.dependencies || []; // systems that should run before this one
    config.component = config.component || function() { return {}; }; // new component generator for this system

    // The heart of the system where entities are proccessed.
    // whilte loop that loops througe all components of entities
    // -----------------------------------------
    if(typeof(config.proccess) != 'function') throw 'proccess function is mandatory'; 

    comp.registerSystem(type, config);
  };

  return constructor;
})();

comp.System.Logic = (function(config) {
  return function(config) { return new comp.System(0, config); };
})();

comp.System.IO = (function(config) {
  return function(config) { return new comp.System(1, config); };
})();
