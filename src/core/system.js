comp.System = (function(type, config) {
  // set defaults
  config = config || {};
  config.dependencies = config.dependencies || []; // systems that should run before this one
  config.component = config.component || function() { return {}; }; // new component generator for this system

  
  // The heart of the system where entities are proccessed.
  // whilte loop that loops througe all components of entities
  // -----------------------------------------
  if(typeof(config.proccess) != 'function') throw 'proccess function is mandatory'; 

  comp.registerSystem(type, config);

  return {
    // declare logic system
    Logic: (function(config) { return new this(0, config); })(),
    
    // declare input/output system
    IO: (function(config) { return new this(1, config); })()
  };
})();
