COMP.System = function(config) {
  if(_.isEmpty(config.name)) throw new Error('empty system name is not allowed');
  
  // invalid system names
  _.each(['name', 'dependencies', 'entities', 'component', 'process', 'yield'], function(name) {
    if(config.name == name) throw new Error('"' + name + '" is saved system name');  
  });

  // The heart of the system where entities are processed.
  // while loop that loops through all components of entities
  // -----------------------------------------
  if(typeof(config.process) != 'function') throw new Error('process function is mandatory');

  // set defaults
  this.name         = config.name;
  this.isStatic     = config.isStatic || false; // static system have no need to process other entities, they have one entity. that entity is shared between all static systems and created upon engine initialization
  this.dependencies = config.dependencies || []; // systems that should run before this one
  this.component    = config.component || function() { return {}; }; // new component generator for this system
  this.thread       = config.thread || false; // if process function spawns thread inside its up to the developer to call yield when done processing
  this.process      = config.process;
  this.entities     = [];
};

COMP.System.Logic = function(config) {
  COMP.System.call(this, config);
  COMP._registerLogicSystem(this);
};

COMP.System.Interpolate = function(config) {
  COMP.System.call(this, config);
  COMP._registerInterpolateSystem(this);
};

COMP.System.IO = function(config) {
  COMP.System.call(this, config);
  COMP._registerIOSystem(this);
};