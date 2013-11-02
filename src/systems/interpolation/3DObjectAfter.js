// Object3D interpolate  system
// -----------------------------------------
new COMP.System.Interpolate({
  name: '3DObjectAfter',
  
  dependencies: ['3DObject'],

  component: function() {
  },

  proccess: function(entities, interpolation) {
    var before, current, after, deltaPosition, deltaQuaternion, deltaScale;

    _.each(entities, function(e) {
      before  = e['3DObjectBefore'];
      current = e['3DObject'];
      after   = e['3DObjectAfter'] = current.clone();

      deltaPosition   = current.position.clone().sub(before.position);
      deltaScale      = current.scale.clone().sub(before.scale);

      after.position.add( deltaPosition.multiplyScalar(interpolation) );
      after.scale.add( deltaScale.multiplyScalar(interpolation) );

      deltaQuaternion = before.quaternion.clone();
      after.quaternion.copy( deltaQuaternion.slerp(current.quaternion, 1 + interpolation) );
    });

    this.yield();
  },
});
