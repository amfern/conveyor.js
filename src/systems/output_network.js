// uses network device from  NetworkInput system
// -----------------------------------------
new comp.System({
  name: 'OutputNetwork',
  dependencies: [], // systems that should run before this one

  // system component creates new components for entities
  component: function() {
    return THREE;
  }, 

  // this func runs each loop processing components
  proccess: function(entities) {
    // gets interval components from each entity and updates the passed interval
  }
});
