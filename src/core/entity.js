COMP.Entity = function(config) {
  // set defaults
  config = config || {};
  config.name = config.name || ""; // unique entity name
  config.components = config.components || []; // collection of all components associated with this entity, no need to specify dependacnies. core will figure it out

  this.name = config.name;
  this.components = config.components;

  COMP._registerEntity(this);
};

COMP.Entity.prototype = {
  constructor: COMP.Entity,

  remove: function() {
    COMP._unregisterEntity(this);
  },

  update: function() {
    COMP._updateEntity(this);
  }
};