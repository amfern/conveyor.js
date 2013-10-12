comp.Entity = (function(config) {
  var constructor;

  constructor = function() {
    // set defaults
    config = config || {};
    config.components = config.components || []; // collection of all components associated with this entity
    
    return comp.registerEntity(config);
  };

  return constructor;
})();
