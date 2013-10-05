// Wraps keypress.js
// API for register keyboard AND mouse AND touch combos, when the combo pressed api will set appropriate flag to true.
// passing additional values will effect the behavior of the key
// -----------------------------------------
new comp.System({
  name: 'Input',
  
  // system component creates new components for entities
  component: function() {
    return {  };
  }, 

  // this func runs each loop processing components
  proccess: function(entities) {
    // gets interval components from each entity and updates the passed interval
  }
});
