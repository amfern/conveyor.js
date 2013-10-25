comp.Entity = (function() {
  var constructor;

  constructor = function(config) {
    // set defaults
    config = config || {};
    config.name = config.name || ""; // unique entity name
    config.components = config.components || []; // collection of all components associated with this entity, no need to specify dependacnies. core will figure it out

    return comp._registerEntity(config);
  };

  return constructor;
})();
