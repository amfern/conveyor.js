'use strict';

// Object3D interpolate  system
// -----------------------------------------
new COMP.System.Interpolate({
    name: 'ObjectInterpolation',

    requiredDependencies: ['ObjectPristine'],

    component: function () {},

    process: function (entities, interpolation) {
        var before, current, after;

        _.each(entities, function (e) {
            before = new THREE.Object3D();
            current = e.Object;
            after = e.ObjectInterpolation = new THREE.Object3D();

            before.applyMatrix(e.ObjectPristine.matrixWorld);
            after.applyMatrix(current.matrixWorld);

            after.scale.lerp(before.scale, 1 - interpolation);
            after.position.lerp(before.position, 1 - interpolation);
            after.quaternion.slerp(before.quaternion, 1 - interpolation);
        });
    },
});