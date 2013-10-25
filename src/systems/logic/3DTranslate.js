// 3D translate system
// -----------------------------------------
new comp.LogicSystem({
  name: '3DTranslate',
  
  dependencies: ['3DPosition'],

  component: function() {
    return {
      prevPosition: new THREE.Vector3(0,0,0),
             speed: 0
    };
  },

  proccess: function(entities) {
    _.each(entities, function(e) {
      e['3DTranslate'].prevPosition = e['3Dposition'].clone();
      e['3Dposition'].multiplyScalar(speed);
    });
  }
});
