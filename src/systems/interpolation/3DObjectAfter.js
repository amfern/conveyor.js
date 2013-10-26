// 3D translate system
// -----------------------------------------
new COMP.System.Interpolate({
  name: '3DObjectAfter',
  
  dependencies: ['3DObject'],

  component: function() {
    return {};
  },

  proccess: function(entities, interpolation) {
    _.each(entities, function(e) {
      var          before = e['3DObjectBefore'],
                  current = e['3DObject'],
                    after = e['3DObjectAfter'] = current.clone(),

            deltaPosition = before.position.clone().sub(current.position),
          deltaQuaternion = before.quaternion.clone(),
               deltaScale = before.scale.clone().sub(current.scale);

      after.position.add( deltaPosition.multiplyScalar(interpolation) );
      after.quaternion.copy( deltaQuaternion.slerp(current.quaternion, 1 + interpolation) );
      after.scale.add( deltaScale.multiplyScalar(interpolation) );
    });
  },
});