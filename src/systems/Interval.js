
new System({
  name: 'Interval',
  dependencies: [], // systems that should run before this one

  // system component creates new components for entities
  component: function() {
    return { interval: 0 };
  }, 

  // this func runs each loop processing components
  proccess: function(entities) {
    // gets interval components from each entity and updates the passed interval
  }
});
