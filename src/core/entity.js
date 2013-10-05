comp.Entity = (function(config) {
  // set defaults
  config = config || {};
  config.components = config.components || []; // collection of all components associated with this entity

  return comp.registerEntity(config);
})();
