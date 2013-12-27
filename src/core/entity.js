COMP.Entity = function(config) {
  // set defaults
  this.name = config.name || ""; // unique entity name
  this.components = config.components || []; // collection of all components associated with this entity, no need to specify dependencies. core will figure it out

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

COMP.StaticEntity = function(config) {
  COMP.Entity.call(this, config);
};
COMP.StaticEntity.prototype = {
  constructor: COMP.Entity,
};