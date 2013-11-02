// 3D translate system
// -----------------------------------------
new COMP.System.Logic({
  name: '3DRotate',
  
  dependencies: ['3DObject'],

  component: function() {
    return {
       axis: new THREE.Vector3(0,1,0),
      speed: 0.1
    };
  },

  proccess: function(entities) {
    _.each(entities, function(e) {
      var rotateComponent = e['3DRotate'];
      e['3DObject'].rotateOnAxis(rotateComponent.axis, rotateComponent.speed);
    });
  }
});
