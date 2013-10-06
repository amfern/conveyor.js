// Wraps THREE.js as graphic output
// -----------------------------------------
new comp.System({
  name: 'Graphic',
  dependencies: ['OutputInterval'], // systems that should run before this one

  // system component creates new components for entities
  component: function() {
    return THREE;
  }, 

  // this func runs each loop processing components
  proccess: function(entities) {
    // gets interval components from each entity and updates the passed interval
  }
});
