COMP.System = function(config) {
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

  this.name         = config.name;
  this.dependencies = config.dependencies;
  this.entities     = [];
  this.component    = config.component;
  this.proccess     = config.proccess;
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